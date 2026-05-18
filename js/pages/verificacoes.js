import { diasSemana, statusLeitura } from "../constants.js";
import { state } from "../state.js";
import { getGrade, getVerificacaoDia, listMembros, listObras, listVerificacoes, saveVerificacaoDia } from "../services/firestore.js";
import { calcularPontosDia, escapeHTML, leiturasDoDiaValidas, resolverObra, statusContaComoLeitura, statusEhSemObra } from "../utils.js";

function statusOptions(value) {
  return statusLeitura.map((s) => `<option value="${s.emoji}" ${s.emoji === value ? "selected" : ""}>${s.emoji ? `${s.emoji} ` : ""}${s.texto}</option>`).join("");
}

function defaultStatus(membro, obra) {
  if (obra.semObra) return "⏳";
  if (obra.membroId === membro.id) return "✨";
  return "";
}

async function acumuladoDoMembro(membroId) {
  const verificacoes = await listVerificacoes(state.sub);
  return diasSemana.reduce((total, dia) => total + Number(verificacoes[dia]?.membros?.[membroId]?.pontos || 0), 0);
}

export async function renderVerificacoes(app, diaSelecionado = "Segunda") {
  const [membros, obras, grade, verificacao] = await Promise.all([
    listMembros(state.sub),
    listObras(state.sub),
    getGrade(state.sub),
    getVerificacaoDia(state.sub, diaSelecionado)
  ]);

  if (!membros.length || !obras.length) {
    app.innerHTML = `<section class="panel"><h1>📜 Verificações</h1><div class="empty-state">Cadastre membros e obras antes de verificar.</div></section>`;
    return;
  }

  const dadosDia = grade[diaSelecionado];
  if (!dadosDia?.obra1 || !dadosDia?.obra2) {
    app.innerHTML = `
      <section class="panel">
        <h1>📜 Verificações</h1>
        <div class="toolbar">
          <select id="diaSelect">${diasSemana.map((d) => `<option value="${d}" ${d === diaSelecionado ? "selected" : ""}>${d}</option>`).join("")}</select>
          <button data-route="grade">Montar grade</button>
        </div>
        <div class="empty-state">A grade deste dia ainda não está completa.</div>
      </section>
    `;
    app.querySelector("#diaSelect").addEventListener("change", (e) => renderVerificacoes(app, e.target.value));
    app.querySelector("[data-route]").addEventListener("click", () => { location.hash = "grade"; });
    return;
  }

  const obra1 = resolverObra(dadosDia.obra1, obras);
  const obra2 = resolverObra(dadosDia.obra2, obras);

  app.innerHTML = `
    <section class="panel">
      <div class="panel-header">
        <div>
          <h1>📜 Verificações</h1>
          <p class="panel-subtitle">Marque leitura, feedback e capítulos extras comprados.</p>
        </div>
      </div>

      <div class="toolbar">
        <select id="diaSelect">${diasSemana.map((d) => `<option value="${d}" ${d === diaSelecionado ? "selected" : ""}>${d}</option>`).join("")}</select>
        <input id="searchMember" placeholder="Buscar por nome ou user..." />
      </div>

      <div class="grid-2">
        <div class="card"><h3>Obra 1</h3><p>${escapeHTML(obra1.titulo)}</p></div>
        <div class="card"><h3>Obra 2</h3><p>${escapeHTML(obra2.titulo)}</p></div>
      </div>

      <form id="verifyForm" class="list" style="margin-top:18px;">
        ${membros.map((membro) => {
          const saved = verificacao?.membros?.[membro.id] || {};
          const data = {
            obra1Status: saved.obra1Status ?? defaultStatus(membro, obra1),
            obra2Status: saved.obra2Status ?? defaultStatus(membro, obra2),
            obra1Feedback: saved.obra1Feedback || false,
            obra2Feedback: saved.obra2Feedback || false,
            obra1ExtraQtd: Number(saved.obra1ExtraQtd || 0),
            obra2ExtraQtd: Number(saved.obra2ExtraQtd || 0),
            pontos: Number(saved.pontos || 0)
          };
          return `
            <article class="verify-card" data-member-card data-search="${escapeHTML(`${membro.nome} ${membro.user}`.toLowerCase())}" data-id="${membro.id}">
              <div class="verify-head">
                <div>
                  <h3>${escapeHTML(membro.nome)}</h3>
                  <span class="meta">${escapeHTML(membro.user)} · Semana ${Number(membro.semana || 0)}</span>
                </div>
                <div class="points-box">
                  <div class="points-pill"><small>Hoje</small><strong id="pontos_${membro.id}">${data.pontos}</strong></div>
                  <div class="points-pill"><small>Semana</small><strong id="acumulado_${membro.id}">...</strong></div>
                </div>
              </div>

              <div class="verify-grid">
                ${workBlock(membro.id, 1, obra1, data)}
                ${workBlock(membro.id, 2, obra2, data)}
              </div>
            </article>
          `;
        }).join("")}

        <div class="toolbar">
          <button type="submit">Salvar verificação</button>
        </div>
      </form>
    </section>
  `;

  app.querySelector("#diaSelect").addEventListener("change", (e) => renderVerificacoes(app, e.target.value));
  app.querySelector("#searchMember").addEventListener("input", (e) => {
    const term = e.target.value.toLowerCase().trim();
    app.querySelectorAll("[data-member-card]").forEach((card) => {
      card.style.display = card.dataset.search.includes(term) ? "" : "none";
    });
  });

  for (const membro of membros) {
    atualizarPontos(membro.id);
    document.getElementById(`acumulado_${membro.id}`).textContent = await acumuladoDoMembro(membro.id);
  }

  app.querySelectorAll("[data-field]").forEach((el) => el.addEventListener("input", () => atualizarPontos(el.dataset.member)));
  app.querySelectorAll("[data-field]").forEach((el) => el.addEventListener("change", () => atualizarPontos(el.dataset.member)));

  app.querySelector("#verifyForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const dados = { dia: diaSelecionado, membros: {} };
    membros.forEach((membro) => {
      const payload = lerDadosMembro(membro.id);
      payload.pontos = calcularPontosDia(payload);
      dados.membros[membro.id] = { ...payload, nome: membro.nome, user: membro.user, semana: Number(membro.semana || 0) };
    });
    await saveVerificacaoDia(state.sub, diaSelecionado, dados);
    alert("Verificação salva com sucesso.");
    await renderVerificacoes(app, diaSelecionado);
  });
}

function workBlock(membroId, numero, obra, data) {
  const disabled = obra.semObra ? "disabled" : "";
  return `
    <div class="verify-work">
      <h4>Obra ${numero}</h4>
      <p class="meta">${escapeHTML(obra.titulo)}</p>

      <div class="form-row">
        <label>Status</label>
        <select data-field data-member="${membroId}" id="${membroId}_obra${numero}Status" ${disabled}>${statusOptions(data[`obra${numero}Status`])}</select>
      </div>

      <label class="checkbox-line">
        <input data-field data-member="${membroId}" type="checkbox" id="${membroId}_obra${numero}Feedback" ${data[`obra${numero}Feedback`] ? "checked" : ""} ${disabled} />
        Feedback entregue (+20)
      </label>

      <div class="form-row" style="margin-top:12px;">
        <label>Capítulos extras comprados (+5 cada)</label>
        <input data-field data-member="${membroId}" type="number" min="0" id="${membroId}_obra${numero}ExtraQtd" value="${Number(data[`obra${numero}ExtraQtd`] || 0)}" ${disabled} />
      </div>

      <small class="warning-text" id="${membroId}_obra${numero}Aviso"></small>
    </div>
  `;
}

function lerDadosMembro(membroId) {
  return {
    obra1Status: document.getElementById(`${membroId}_obra1Status`)?.value || "⏳",
    obra2Status: document.getElementById(`${membroId}_obra2Status`)?.value || "⏳",
    obra1Feedback: document.getElementById(`${membroId}_obra1Feedback`)?.checked || false,
    obra2Feedback: document.getElementById(`${membroId}_obra2Feedback`)?.checked || false,
    obra1ExtraQtd: Number(document.getElementById(`${membroId}_obra1ExtraQtd`)?.value || 0),
    obra2ExtraQtd: Number(document.getElementById(`${membroId}_obra2ExtraQtd`)?.value || 0)
  };
}

function atualizarPontos(membroId) {
  const dados = lerDadosMembro(membroId);
  const valido = leiturasDoDiaValidas(dados.obra1Status, dados.obra2Status);

  [1, 2].forEach((numero) => {
    const status = dados[`obra${numero}Status`];
    const feedback = document.getElementById(`${membroId}_obra${numero}Feedback`);
    const extra = document.getElementById(`${membroId}_obra${numero}ExtraQtd`);
    const aviso = document.getElementById(`${membroId}_obra${numero}Aviso`);

    if (!feedback || !extra) return;

    if (!valido || status !== "🌙") {
      feedback.checked = false;
      feedback.disabled = true;
      extra.value = 0;
      extra.disabled = true;
      aviso.textContent = statusEhSemObra(status) ? "Sem obra neste campo." : "Feedback e extra só contam para leitura feita de obra que não é própria.";
    } else {
      feedback.disabled = false;
      extra.disabled = false;
      aviso.textContent = "";
    }
  });

  const final = lerDadosMembro(membroId);
  document.getElementById(`pontos_${membroId}`).textContent = calcularPontosDia(final);
}
