import { MODELOS_SUB, DEFAULT_MODELOS } from "./config.js";

import {
  listarSubs,
  salvarSub,
  atualizarSub,
  excluirSub
} from "./data.js";

import {
  abrirModal,
  fecharModal,
  escapeHTML,
  mostrarToast
} from "./utils.js";

import {
  getModelosDoSub,
  getVariaveisFichaTexto,
  getVariaveisGradeTexto
} from "./templates.js";

export async function renderSubsPage(context) {
  const { setSubtitle, refresh, state } = context;

  setSubtitle("Cadastro e edição de subs.");

  const view = document.getElementById("view");
  const subs = await listarSubs();

  const listaHTML = subs.length
    ? subs.map(sub => `
      <article class="item-card">
        <div>
          <h4>${escapeHTML(sub.botao || sub.nome || sub.id)}</h4>
          <p>Código: ${escapeHTML(sub.id)} • Modelo: ${escapeHTML(MODELOS_SUB[sub.modelo] || sub.modelo)}</p>
          <p>${escapeHTML(sub.subtitulo || "")}</p>
          <p>Obras por dia: ${sub.obrasPorDia || 2} • Status: ${sub.ativo ? "Ativo" : "Inativo"}</p>
        </div>

        <div class="item-actions">
          <button class="btn secondary" data-editar-sub="${sub.id}">Editar</button>
          <button class="btn danger" data-excluir-sub="${sub.id}">Excluir</button>
        </div>
      </article>
    `).join("")
    : `
      <div class="empty-state">
        Nenhum sub cadastrado.
      </div>
    `;

  view.innerHTML = `
    <section class="card">
      <div class="card-header">
        <div>
          <h3>⚙️ Subs</h3>
          <p>Crie, edite e personalize os modelos dos subs disponíveis na plataforma.</p>
        </div>

        <button class="btn" id="novoSubButton">+ Novo Sub</button>
      </div>

      <div class="item-list">
        ${listaHTML}
      </div>
    </section>
  `;

  document.getElementById("novoSubButton").addEventListener("click", () => {
    abrirFormularioSub({
      sub: null,
      refresh
    });
  });

  document.querySelectorAll("[data-editar-sub]").forEach(button => {
    const sub = subs.find(item => item.id === button.dataset.editarSub);

    button.addEventListener("click", () => {
      abrirFormularioSub({
        sub,
        refresh
      });
    });
  });

  document.querySelectorAll("[data-excluir-sub]").forEach(button => {
    button.addEventListener("click", async () => {
      const subId = button.dataset.excluirSub;
      const sub = subs.find(item => item.id === subId);

      const confirmar = confirm(
        `Tem certeza que deseja excluir o sub ${sub?.nome || subId}?\n\nNão é recomendado excluir subs que já têm dados cadastrados.`
      );

      if (!confirmar) return;

      if (state.subId === subId) {
        mostrarToast("Você não pode excluir o sub que está usando agora.");
        return;
      }

      await excluirSub(subId);
      mostrarToast("Sub excluído.");
      await refresh();
    });
  });
}

function abrirFormularioSub({ sub, refresh }) {
  const editando = Boolean(sub);
  const modelos = getModelosDoSub(sub || { modelo: "chama" });

  const opcoesModelo = Object.entries(MODELOS_SUB).map(([id, nome]) => `
    <option value="${id}" ${sub?.modelo === id ? "selected" : ""}>
      ${escapeHTML(nome)}
    </option>
  `).join("");

  abrirModal(editando ? "Editar sub" : "Novo sub", `
    <form id="subForm" class="grid">
      <div class="grid grid-2">
        <div class="form-row">
          <label for="subId">Código do sub</label>
          <input 
            id="subId" 
            placeholder="Ex: A9" 
            value="${escapeHTML(sub?.id || "")}"
            ${editando ? "disabled" : ""}
          />
        </div>

        <div class="form-row">
          <label for="subNome">Nome do sub</label>
          <input 
            id="subNome" 
            placeholder="Ex: Cicatrizes Literárias" 
            value="${escapeHTML(sub?.nome || "")}"
          />
        </div>
      </div>

      <div class="grid grid-2">
        <div class="form-row">
          <label for="subBotao">Nome do botão</label>
          <input 
            id="subBotao" 
            placeholder="Ex: 🫀 Cicatrizes Literárias" 
            value="${escapeHTML(sub?.botao || "")}"
          />
        </div>

        <div class="form-row">
          <label for="subSubtitulo">Subtítulo</label>
          <input 
            id="subSubtitulo" 
            placeholder="Ex: Sub Lunar A-9" 
            value="${escapeHTML(sub?.subtitulo || "")}"
          />
        </div>
      </div>

      <div class="grid grid-3">
        <div class="form-row">
          <label for="subCor">Cor do tema</label>
          <input 
            id="subCor" 
            type="color" 
            value="${escapeHTML(sub?.cor || "#d4af37")}"
          />
        </div>

        <div class="form-row">
          <label for="subModelo">Modelo base</label>
          <select id="subModelo">
            ${opcoesModelo}
          </select>
        </div>

        <div class="form-row">
          <label for="subObrasPorDia">Obras por dia</label>
          <select id="subObrasPorDia">
            <option value="1" ${Number(sub?.obrasPorDia || 2) === 1 ? "selected" : ""}>1 obra por dia</option>
            <option value="2" ${Number(sub?.obrasPorDia || 2) === 2 ? "selected" : ""}>2 obras por dia</option>
          </select>
        </div>
      </div>

      <label class="checkbox-row">
        <input 
          id="subAtivo" 
          type="checkbox" 
          ${sub?.ativo === false ? "" : "checked"}
        />
        Sub ativo
      </label>

      <div class="card" style="box-shadow:none;">
        <div class="card-header">
          <div>
            <h3>🧩 Modelos personalizados</h3>
            <p>Edite os modelos existentes ou cole modelos novos usando variáveis.</p>
          </div>

          <button class="btn secondary" type="button" id="carregarModeloBaseButton">Carregar modelo base</button>
        </div>

        <div class="grid grid-2">
          <div class="empty-state" style="text-align:left;">
            <pre style="white-space:pre-wrap;margin:0;">${escapeHTML(getVariaveisFichaTexto())}</pre>
          </div>

          <div class="empty-state" style="text-align:left;">
            <pre style="white-space:pre-wrap;margin:0;">${escapeHTML(getVariaveisGradeTexto())}</pre>
          </div>
        </div>

        <div class="grid" style="margin-top:18px;">
          <div class="form-row">
            <label for="fichaCabecalho">Ficha — Cabeçalho</label>
            <textarea id="fichaCabecalho">${escapeHTML(modelos.fichaCabecalho || "")}</textarea>
          </div>

          <div class="form-row">
            <label for="fichaMembro">Ficha — Bloco de cada membro</label>
            <textarea id="fichaMembro">${escapeHTML(modelos.fichaMembro || "")}</textarea>
          </div>

          <div class="form-row">
            <label for="fichaRodape">Ficha — Rodapé / aviso final</label>
            <textarea id="fichaRodape">${escapeHTML(modelos.fichaRodape || "")}</textarea>
          </div>

          <div class="form-row">
            <label for="gradeSemanaCabecalho">Grade — Cabeçalho semanal</label>
            <textarea id="gradeSemanaCabecalho">${escapeHTML(modelos.gradeSemanaCabecalho || "")}</textarea>
          </div>

          <div class="form-row">
            <label for="gradeDiaCabecalho">Grade — Cabeçalho do dia</label>
            <textarea id="gradeDiaCabecalho">${escapeHTML(modelos.gradeDiaCabecalho || "")}</textarea>
          </div>

          <div class="form-row">
            <label for="gradeObra">Grade — Bloco de cada obra</label>
            <textarea id="gradeObra">${escapeHTML(modelos.gradeObra || "")}</textarea>
          </div>

          <div class="form-row">
            <label for="gradeSeparador">Grade — Separador entre obras</label>
            <textarea id="gradeSeparador">${escapeHTML(modelos.gradeSeparador || "")}</textarea>
          </div>

          <div class="form-row">
            <label for="gradeRodape">Grade — Rodapé</label>
            <textarea id="gradeRodape">${escapeHTML(modelos.gradeRodape || "")}</textarea>
          </div>
        </div>
      </div>

      <div class="form-actions">
        <button class="btn" type="submit">${editando ? "Salvar alterações" : "Criar sub"}</button>
        <button class="btn secondary" type="button" id="cancelarSub">Cancelar</button>
      </div>
    </form>
  `);

  document.getElementById("cancelarSub").addEventListener("click", fecharModal);

  document.getElementById("carregarModeloBaseButton").addEventListener("click", () => {
    const modeloSelecionado = document.getElementById("subModelo").value;
    const modeloBase = DEFAULT_MODELOS[modeloSelecionado] || DEFAULT_MODELOS.trono;

    const confirmar = confirm("Isso vai substituir os textos dos modelos pelos padrões do modelo base selecionado. Continuar?");

    if (!confirmar) return;

    preencherCamposModelo(modeloBase);
    mostrarToast("Modelo base carregado.");
  });

  document.getElementById("subForm").addEventListener("submit", async event => {
    event.preventDefault();

    const dados = {
      id: document.getElementById("subId").value.trim().toUpperCase(),
      nome: document.getElementById("subNome").value.trim(),
      botao: document.getElementById("subBotao").value.trim(),
      subtitulo: document.getElementById("subSubtitulo").value.trim(),
      cor: document.getElementById("subCor").value,
      modelo: document.getElementById("subModelo").value,
      obrasPorDia: Number(document.getElementById("subObrasPorDia").value),
      ativo: document.getElementById("subAtivo").checked,
      modelos: lerCamposModelo()
    };

    if (!dados.id || !dados.nome || !dados.botao) {
      mostrarToast("Preencha código, nome e botão do sub.");
      return;
    }

    if (editando) {
      await atualizarSub(sub.id, dados);
      mostrarToast("Sub atualizado.");
    } else {
      await salvarSub(dados);
      mostrarToast("Sub criado.");
    }

    fecharModal();
    await refresh();
  });
}

function lerCamposModelo() {
  return {
    fichaCabecalho: document.getElementById("fichaCabecalho").value,
    fichaMembro: document.getElementById("fichaMembro").value,
    fichaRodape: document.getElementById("fichaRodape").value,
    gradeSemanaCabecalho: document.getElementById("gradeSemanaCabecalho").value,
    gradeDiaCabecalho: document.getElementById("gradeDiaCabecalho").value,
    gradeObra: document.getElementById("gradeObra").value,
    gradeSeparador: document.getElementById("gradeSeparador").value,
    gradeRodape: document.getElementById("gradeRodape").value
  };
}

function preencherCamposModelo(modelos) {
  document.getElementById("fichaCabecalho").value = modelos.fichaCabecalho || "";
  document.getElementById("fichaMembro").value = modelos.fichaMembro || "";
  document.getElementById("fichaRodape").value = modelos.fichaRodape || "";
  document.getElementById("gradeSemanaCabecalho").value = modelos.gradeSemanaCabecalho || "";
  document.getElementById("gradeDiaCabecalho").value = modelos.gradeDiaCabecalho || "";
  document.getElementById("gradeObra").value = modelos.gradeObra || "";
  document.getElementById("gradeSeparador").value = modelos.gradeSeparador || "";
  document.getElementById("gradeRodape").value = modelos.gradeRodape || "";
}