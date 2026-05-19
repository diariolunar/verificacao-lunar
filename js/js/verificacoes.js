import { DIAS_SEMANA, STATUS_LEITURA } from "./config.js";

import {
  listarMembros,
  listarObras,
  buscarGrade,
  buscarVerificacaoDia,
  salvarVerificacaoDia
} from "./data.js";

import {
  calcularPontosDoDia,
  escapeHTML,
  leiturasDoDiaValidas,
  mostrarToast,
  resolverObraDaGrade,
  statusEhSemObra,
  textoBuscaMembro
} from "./utils.js";

export async function renderVerificacoesPage(context) {
  const { state, setSubtitle, refresh } = context;

  setSubtitle("Verificação de leitura e pontuação.");

  const view = document.getElementById("view");

  const [membros, obras, grade] = await Promise.all([
    listarMembros(state.subId),
    listarObras(state.subId),
    buscarGrade(state.subId)
  ]);

  if (!membros.length || !obras.length) {
    view.innerHTML = `
      <section class="card">
        <div class="card-header">
          <div>
            <h3>📜 Verificações</h3>
            <p>Antes de verificar, cadastre membros, obras e monte a grade.</p>
          </div>
        </div>

        <div class="empty-state">
          ${!membros.length ? "Cadastre pelo menos um membro." : "Cadastre pelo menos uma obra."}
        </div>
      </section>
    `;

    return;
  }

  const diaInicial = document.getElementById("diaVerificacao")?.value || "Segunda";

  await renderVerificacaoDia({
    state,
    view,
    membros,
    obras,
    grade,
    dia: diaInicial,
    refresh
  });
}

async function renderVerificacaoDia({ state, view, membros, obras, grade, dia, refresh }) {
  const dadosDia = grade[dia];

  if (!dadosDia || !dadosDia.obra1 || !dadosDia.obra2) {
    view.innerHTML = `
      <section class="card">
        <div class="card-header">
          <div>
            <h3>📜 Verificações</h3>
            <p>Selecione o dia para verificar.</p>
          </div>
        </div>

        <div class="grid grid-2">
          <div class="form-row">
            <label for="diaVerificacao">Dia da semana</label>
            <select id="diaVerificacao">
              ${DIAS_SEMANA.map(item => `<option value="${item}" ${item === dia ? "selected" : ""}>${item}</option>`).join("")}
            </select>
          </div>
        </div>

        <div class="empty-state" style="margin-top:18px;">
          A grade de ${dia} ainda não está completa. Escolha Obra 1 e Obra 2 ou marque Sem Obra na grade.
        </div>
      </section>
    `;

    document.getElementById("diaVerificacao").addEventListener("change", async event => {
      await renderVerificacaoDia({
        state,
        view,
        membros,
        obras,
        grade,
        dia: event.target.value,
        refresh
      });
    });

    return;
  }

  const obra1 = resolverObraDaGrade(dadosDia.obra1, obras);
  const obra2 = resolverObraDaGrade(dadosDia.obra2, obras);

  const verificacaoSalva = await buscarVerificacaoDia(state.subId, dia);

  const membrosHTML = membros.map(membro => {
    const salvo = verificacaoSalva?.membros?.[membro.id] || {};

    const dadosMembro = {
      obra1Status: obra1.semObra ? "⏳" : salvo.obra1Status || "",
      obra1Feedback: obra1.semObra ? false : Boolean(salvo.obra1Feedback),
      obra1Extra: obra1.semObra ? false : Boolean(salvo.obra1Extra),
      obra1ExtraQtd: obra1.semObra ? 1 : Number(salvo.obra1ExtraQtd || 1),

      obra2Status: obra2.semObra ? "⏳" : salvo.obra2Status || "",
      obra2Feedback: obra2.semObra ? false : Boolean(salvo.obra2Feedback),
      obra2Extra: obra2.semObra ? false : Boolean(salvo.obra2Extra),
      obra2ExtraQtd: obra2.semObra ? 1 : Number(salvo.obra2ExtraQtd || 1)
    };

    const pontos = calcularPontosDoDia(dadosMembro);

    return `
      <article class="member-check-card" data-member-card data-search="${escapeHTML(textoBuscaMembro(membro))}" data-member-id="${membro.id}">
        <div class="member-check-header">
          <div>
            <h4>${escapeHTML(membro.nome)}</h4>
            <p>${escapeHTML(membro.user)} • Semana ${membro.semana ?? 0}</p>
          </div>

          <div class="points-pill">
            <small>Hoje</small>
            <strong id="pontos_${membro.id}">${pontos}</strong>
          </div>
        </div>

        <div class="check-columns">
          ${renderSlotVerificacao(membro.id, 1, obra1, dadosMembro)}
          ${renderSlotVerificacao(membro.id, 2, obra2, dadosMembro)}
        </div>
      </article>
    `;
  }).join("");

  view.innerHTML = `
    <section class="card">
      <div class="card-header">
        <div>
          <h3>📜 Verificações</h3>
          <p>Marque leitura, feedback e capítulos extras comprados.</p>
        </div>
      </div>

      <div class="grid grid-2">
        <div class="form-row">
          <label for="diaVerificacao">Dia da semana</label>
          <select id="diaVerificacao">
            ${DIAS_SEMANA.map(item => `<option value="${item}" ${item === dia ? "selected" : ""}>${item}</option>`).join("")}
          </select>
        </div>

        <div class="form-row">
          <label for="buscaMembro">Buscar membro</label>
          <input id="buscaMembro" placeholder="Digite nome ou user..." />
        </div>
      </div>

      <div class="grid grid-2" style="margin-top:18px;">
        <div class="grade-slot">
          <h5>Obra 01</h5>
          <p class="muted">${escapeHTML(obra1.titulo)}</p>
        </div>

        <div class="grade-slot">
          <h5>Obra 02</h5>
          <p class="muted">${escapeHTML(obra2.titulo)}</p>
        </div>
      </div>

      <div class="item-list" style="margin-top:18px;">
        ${membrosHTML}
      </div>

      <div class="form-actions">
        <button class="btn" id="salvarVerificacaoButton">Salvar verificação</button>
      </div>
    </section>
  `;

  document.getElementById("diaVerificacao").addEventListener("change", async event => {
    await renderVerificacaoDia({
      state,
      view,
      membros,
      obras,
      grade,
      dia: event.target.value,
      refresh
    });
  });

  document.getElementById("buscaMembro").addEventListener("input", event => {
    const busca = event.target.value.toLowerCase().trim();

    document.querySelectorAll("[data-member-card]").forEach(card => {
      const texto = String(card.dataset.search || "").toLowerCase();
      card.style.display = texto.includes(busca) ? "" : "none";
    });
  });

  membros.forEach(membro => {
    atualizarPontosMembro(membro.id);
    [1, 2].forEach(numero => {
      atualizarVisibilidadeExtra(membro.id, numero);
    });
  });

  document.querySelectorAll("[data-check-control]").forEach(control => {
    control.addEventListener("change", event => {
      const membroId = event.target.dataset.memberId;
      atualizarPontosMembro(membroId);
    });

    control.addEventListener("input", event => {
      const membroId = event.target.dataset.memberId;
      atualizarPontosMembro(membroId);
    });
  });

  document.getElementById("salvarVerificacaoButton").addEventListener("click", async () => {
    const dados = montarDadosVerificacaoDaTela(membros, dia);

    await salvarVerificacaoDia(state.subId, dia, dados);

    mostrarToast("Verificação salva.");
    await refresh();
  });
}

function renderSlotVerificacao(membroId, numero, obra, dados) {
  const status = dados[`obra${numero}Status`] || "";
  const feedback = dados[`obra${numero}Feedback`] || false;
  const extra = dados[`obra${numero}Extra`] || false;
  const extraQtd = dados[`obra${numero}ExtraQtd`] || 1;

  return `
    <div class="check-slot">
      <h5>Obra ${numero}</h5>
      <p>${escapeHTML(obra.titulo)}</p>

      <div class="form-row">
        <label>Status</label>
        <select
          id="m_${membroId}_o${numero}_status"
          data-check-control
          data-member-id="${membroId}"
          ${obra.semObra ? "disabled" : ""}
        >
          ${STATUS_LEITURA.map(item => `
            <option value="${item.emoji}" ${item.emoji === status ? "selected" : ""}>
              ${item.emoji ? `${item.emoji} ` : ""}${item.label}
            </option>
          `).join("")}
        </select>
      </div>

      <label class="checkbox-row">
        <input
          type="checkbox"
          id="m_${membroId}_o${numero}_feedback"
          data-check-control
          data-member-id="${membroId}"
          ${feedback ? "checked" : ""}
          ${obra.semObra ? "disabled" : ""}
        />
        Feedback entregue (+20)
      </label>

      <label class="checkbox-row">
        <input
          type="checkbox"
          id="m_${membroId}_o${numero}_extra"
          data-check-control
          data-member-id="${membroId}"
          ${extra ? "checked" : ""}
          ${obra.semObra ? "disabled" : ""}
        />
        Leitura extra comprada (+5 cada)
      </label>

      <div class="form-row" id="m_${membroId}_o${numero}_extraBox" style="display:none;">
        <label>Quantidade de capítulos extras</label>
        <input
          type="number"
          min="1"
          id="m_${membroId}_o${numero}_extraQtd"
          data-check-control
          data-member-id="${membroId}"
          value="${extraQtd}"
          ${obra.semObra ? "disabled" : ""}
        />
      </div>

      <div class="note-warning" id="m_${membroId}_o${numero}_aviso"></div>
    </div>
  `;
}

function lerDadosMembroDaTela(membroId) {
  const dados = {};

  [1, 2].forEach(numero => {
    const status = document.getElementById(`m_${membroId}_o${numero}_status`)?.value || "⏳";

    dados[`obra${numero}Status`] = status;
    dados[`obra${numero}Feedback`] = document.getElementById(`m_${membroId}_o${numero}_feedback`)?.checked || false;
    dados[`obra${numero}Extra`] = document.getElementById(`m_${membroId}_o${numero}_extra`)?.checked || false;
    dados[`obra${numero}ExtraQtd`] = Math.max(1, Number(document.getElementById(`m_${membroId}_o${numero}_extraQtd`)?.value || 1));
  });

  return dados;
}

function atualizarPontosMembro(membroId) {
  const dados = lerDadosMembroDaTela(membroId);
  const diaValido = leiturasDoDiaValidas(dados.obra1Status, dados.obra2Status);

  [1, 2].forEach(numero => {
    const status = dados[`obra${numero}Status`];

    const feedbackInput = document.getElementById(`m_${membroId}_o${numero}_feedback`);
    const extraInput = document.getElementById(`m_${membroId}_o${numero}_extra`);
    const extraQtdInput = document.getElementById(`m_${membroId}_o${numero}_extraQtd`);
    const aviso = document.getElementById(`m_${membroId}_o${numero}_aviso`);

    if (!feedbackInput || !extraInput || !extraQtdInput || !aviso) return;

    if (!diaValido) {
      feedbackInput.checked = false;
      feedbackInput.disabled = true;

      extraInput.checked = false;
      extraInput.disabled = true;
      extraQtdInput.value = 1;

      aviso.textContent = "Só pontua se as leituras obrigatórias do dia estiverem válidas.";
    } else if (status === "🌙") {
      feedbackInput.disabled = false;
      extraInput.disabled = false;
      aviso.textContent = "";
    } else {
      feedbackInput.checked = false;
      feedbackInput.disabled = true;

      extraInput.checked = false;
      extraInput.disabled = true;
      extraQtdInput.value = 1;

      if (statusEhSemObra(status)) {
        aviso.textContent = "Sem obra neste campo.";
      } else {
        aviso.textContent = "Feedback e extra só contam quando marcou 🌙 Leu.";
      }
    }

    atualizarVisibilidadeExtra(membroId, numero);
  });

  const dadosAtualizados = lerDadosMembroDaTela(membroId);
  const pontos = calcularPontosDoDia(dadosAtualizados);

  const campoPontos = document.getElementById(`pontos_${membroId}`);

  if (campoPontos) {
    campoPontos.textContent = pontos;
  }
}

function atualizarVisibilidadeExtra(membroId, numero) {
  const box = document.getElementById(`m_${membroId}_o${numero}_extraBox`);
  const extra = document.getElementById(`m_${membroId}_o${numero}_extra`);

  if (!box || !extra) return;

  box.style.display = extra.checked ? "" : "none";
}

function montarDadosVerificacaoDaTela(membros, dia) {
  const dados = {
    dia,
    atualizadoEm: new Date().toISOString(),
    membros: {}
  };

  membros.forEach(membro => {
    const dadosMembro = lerDadosMembroDaTela(membro.id);
    const pontos = calcularPontosDoDia(dadosMembro);

    dados.membros[membro.id] = {
      nome: membro.nome,
      user: membro.user,
      semana: membro.semana ?? 0,
      ...dadosMembro,
      pontos
    };
  });

  return dados;
}