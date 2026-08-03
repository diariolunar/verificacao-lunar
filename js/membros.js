import {
  listarMembros,
  criarMembro,
  atualizarMembro,
  atualizarStatusMembro,
  excluirMembro
} from "./data.js";

import {
  abrirModal,
  fecharModal,
  escapeHTML,
  mostrarToast,
  confirmarAcao
} from "./utils.js";

function membroAtivo(membro) {
  return membro?.ativo !== false;
}

function getAbaMembros() {
  return localStorage.getItem("verificacao_lunar_membros_aba") === "desativados"
    ? "desativados"
    : "ativos";
}

function setAbaMembros(aba) {
  localStorage.setItem("verificacao_lunar_membros_aba", aba);
}

export async function renderMembrosPage(context) {
  const { state, setSubtitle, refresh } = context;

  setSubtitle("Cadastro e edicao de membros.");

  const view = document.getElementById("view");
  const membros = await listarMembros(state.subId);
  const abaAtual = getAbaMembros();
  const membrosAtivos = membros.filter(membroAtivo);
  const membrosDesativados = membros.filter(membro => !membroAtivo(membro));
  const membrosExibidos = abaAtual === "desativados" ? membrosDesativados : membrosAtivos;

  const listaHTML = membrosExibidos.length
    ? membrosExibidos.map(membro => `
      <article class="item-card">
        <div>
          <h4>${escapeHTML(membro.nome || "")}</h4>
          <p>User: ${escapeHTML(membro.user || "")}</p>
          <p>Semana atual: ${Number(membro.semana || 0)}</p>
          <p>Gatilhos: ${escapeHTML(membro.gatilhos || "Nao informado")}</p>
          ${membroAtivo(membro) ? "" : `<p><span class="badge">Desativado</span></p>`}
        </div>

        <div class="item-actions">
          <button class="btn secondary" type="button" data-editar-membro="${membro.id}">Editar</button>
          ${
            membroAtivo(membro)
              ? `<button class="btn secondary" type="button" data-status-membro="${membro.id}" data-ativo="false">Desativar</button>`
              : `<button class="btn" type="button" data-status-membro="${membro.id}" data-ativo="true">Reativar</button>`
          }
          <button class="btn danger" type="button" data-excluir-membro="${membro.id}">Excluir</button>
        </div>
      </article>
    `).join("")
    : `
      <div class="empty-state">
        ${abaAtual === "desativados" ? "Nenhum membro desativado." : "Nenhum membro ativo cadastrado ainda."}
      </div>
    `;

  view.innerHTML = `
    <section class="card">
      <div class="card-header">
        <div>
          <h3>👥 Membros</h3>
          <p>Cadastre os leitores do sub, seus usuarios e a semana atual de cada um.</p>
        </div>

        <button class="btn" type="button" id="novoMembroButton">+ Novo Membro</button>
      </div>

      <div class="tabs">
        <button class="tab-button ${abaAtual === "ativos" ? "active" : ""}" type="button" data-aba-membros="ativos">
          Ativos (${membrosAtivos.length})
        </button>
        <button class="tab-button ${abaAtual === "desativados" ? "active" : ""}" type="button" data-aba-membros="desativados">
          Desativados (${membrosDesativados.length})
        </button>
      </div>

      <div class="item-list">
        ${listaHTML}
      </div>
    </section>
  `;

  document.getElementById("novoMembroButton")?.addEventListener("click", () => {
    abrirFormularioMembro({
      state,
      refresh,
      membro: null
    });
  });

  document.querySelectorAll("[data-aba-membros]").forEach(button => {
    button.addEventListener("click", async () => {
      setAbaMembros(button.dataset.abaMembros);
      await refresh();
    });
  });

  document.querySelectorAll("[data-editar-membro]").forEach(button => {
    button.addEventListener("click", () => {
      const membroId = button.dataset.editarMembro;
      const membro = membros.find(item => item.id === membroId);

      abrirFormularioMembro({
        state,
        refresh,
        membro
      });
    });
  });

  document.querySelectorAll("[data-status-membro]").forEach(button => {
    button.addEventListener("click", async () => {
      const membroId = button.dataset.statusMembro;
      const membro = membros.find(item => item.id === membroId);
      const ativar = button.dataset.ativo === "true";

      const confirmar = await confirmarAcao({
        titulo: ativar ? "Reativar membro?" : "Desativar membro?",
        mensagem: ativar
          ? `Deseja reativar "${membro?.nome || ""}"? As obras vinculadas voltarao a aparecer como opcao na grade.`
          : `Deseja desativar "${membro?.nome || ""}"? O membro nao sera apagado e as obras vinculadas nao aparecerao como opcao na grade.`,
        confirmarTexto: ativar ? "Sim, reativar" : "Sim, desativar",
        cancelarTexto: "Cancelar",
        perigo: !ativar
      });

      if (!confirmar) return;

      try {
        await atualizarStatusMembro(state.subId, membroId, ativar);
        mostrarToast(ativar ? "Membro reativado." : "Membro desativado.");
        await refresh();
      } catch (error) {
        console.error(error);
        mostrarToast("Erro ao alterar status do membro. Veja o console.");
      }
    });
  });

  document.querySelectorAll("[data-excluir-membro]").forEach(button => {
    button.addEventListener("click", async () => {
      const membroId = button.dataset.excluirMembro;
      const membro = membros.find(item => item.id === membroId);

      const confirmar = await confirmarAcao({
        titulo: "Excluir membro?",
        mensagem: `Tem certeza que deseja excluir o membro "${membro?.nome || ""}"? As obras vinculadas a ele tambem serao removidas.`,
        confirmarTexto: "Sim, excluir",
        cancelarTexto: "Cancelar",
        perigo: true
      });

      if (!confirmar) return;

      try {
        await excluirMembro(state.subId, membroId);
        mostrarToast("Membro excluido.");
        await refresh();
      } catch (error) {
        console.error(error);
        mostrarToast("Erro ao excluir membro. Veja o console.");
      }
    });
  });
}

function abrirFormularioMembro({ state, refresh, membro }) {
  const editando = Boolean(membro);

  abrirModal(editando ? "Editar membro" : "Novo membro", `
    <form id="membroForm" class="grid">
      <div class="grid grid-2">
        <div class="form-row">
          <label for="nomeMembro">Nome</label>
          <input
            id="nomeMembro"
            type="text"
            placeholder="Ex: Mayke"
            value="${escapeHTML(membro?.nome || "")}"
          />
        </div>

        <div class="form-row">
          <label for="userMembro">User</label>
          <input
            id="userMembro"
            type="text"
            placeholder="Ex: RKymae"
            value="${escapeHTML(membro?.user || "")}"
          />
        </div>
      </div>

      <div class="form-row">
        <label for="semanaMembro">Semana atual</label>
        <input
          id="semanaMembro"
          type="number"
          min="0"
          step="1"
          placeholder="Ex: 5"
          value="${Number(membro?.semana || 0)}"
        />
      </div>

      <div class="form-row">
        <label for="gatilhosMembro">Gatilhos de leitura</label>
        <textarea
          id="gatilhosMembro"
          placeholder="Ex: abandono, violencia, cobras..."
        >${escapeHTML(membro?.gatilhos || "")}</textarea>
      </div>

      <div class="form-actions">
        <button class="btn" type="submit">${editando ? "Salvar alteracoes" : "Cadastrar membro"}</button>
        <button class="btn secondary" type="button" id="cancelarMembro">Cancelar</button>
      </div>
    </form>
  `);

  const cancelarButton = document.getElementById("cancelarMembro");
  const form = document.getElementById("membroForm");

  if (cancelarButton) {
    cancelarButton.addEventListener("click", fecharModal);
  }

  if (!form) {
    mostrarToast("Erro ao abrir formulario de membro.");
    return;
  }

  form.addEventListener("submit", async event => {
    event.preventDefault();

    const nome = document.getElementById("nomeMembro")?.value.trim();
    const user = document.getElementById("userMembro")?.value.trim();
    const semana = Number(document.getElementById("semanaMembro")?.value || 0);
    const gatilhos = document.getElementById("gatilhosMembro")?.value.trim();

    if (!nome || !user) {
      mostrarToast("Preencha nome e user do membro.");
      return;
    }

    const dados = {
      nome,
      user,
      semana,
      gatilhos,
      ativo: membro?.ativo !== false
    };

    try {
      if (editando) {
        await atualizarMembro(state.subId, membro.id, dados);
        mostrarToast("Membro atualizado.");
      } else {
        await criarMembro(state.subId, dados);
        mostrarToast("Membro cadastrado.");
      }

      fecharModal();
      await refresh();
    } catch (error) {
      console.error(error);
      mostrarToast("Erro ao salvar membro. Veja o console.");
    }
  });
}
