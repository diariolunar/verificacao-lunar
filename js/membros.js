import {
  listarMembros,
  criarMembro,
  atualizarMembro,
  excluirMembro
} from "./data.js";

import {
  abrirModal,
  fecharModal,
  escapeHTML,
  mostrarToast,
  confirmarAcao
} from "./utils.js";

export async function renderMembrosPage(context) {
  const { state, setSubtitle, refresh } = context;

  setSubtitle("Cadastro e edição de membros.");

  const view = document.getElementById("view");
  const membros = await listarMembros(state.subId);

  const listaHTML = membros.length
    ? membros.map(membro => `
      <article class="item-card">
        <div>
          <h4>${escapeHTML(membro.nome || "")}</h4>
          <p>User: ${escapeHTML(membro.user || "")}</p>
          <p>Semana atual: ${Number(membro.semana || 0)}</p>
        </div>

        <div class="item-actions">
          <button class="btn secondary" type="button" data-editar-membro="${membro.id}">Editar</button>
          <button class="btn danger" type="button" data-excluir-membro="${membro.id}">Excluir</button>
        </div>
      </article>
    `).join("")
    : `
      <div class="empty-state">
        Nenhum membro cadastrado ainda.
      </div>
    `;

  view.innerHTML = `
    <section class="card">
      <div class="card-header">
        <div>
          <h3>👥 Membros</h3>
          <p>Cadastre os leitores do sub, seus usuários e a semana atual de cada um.</p>
        </div>

        <button class="btn" type="button" id="novoMembroButton">+ Novo Membro</button>
      </div>

      <div class="item-list">
        ${listaHTML}
      </div>
    </section>
  `;

  const novoMembroButton = document.getElementById("novoMembroButton");

  if (novoMembroButton) {
    novoMembroButton.addEventListener("click", () => {
      abrirFormularioMembro({
        state,
        refresh,
        membro: null
      });
    });
  }

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

  document.querySelectorAll("[data-excluir-membro]").forEach(button => {
    button.addEventListener("click", async () => {
      const membroId = button.dataset.excluirMembro;
      const membro = membros.find(item => item.id === membroId);

      const confirmar = await confirmarAcao({
        titulo: "Excluir membro?",
        mensagem: `Tem certeza que deseja excluir o membro "${membro?.nome || ""}"? As obras vinculadas a ele também serão removidas.`,
        confirmarTexto: "Sim, excluir",
        cancelarTexto: "Cancelar",
        perigo: true
      });

      if (!confirmar) return;

      try {
        await excluirMembro(state.subId, membroId);
        mostrarToast("Membro excluído.");
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

      <div class="form-actions">
        <button class="btn" type="submit">${editando ? "Salvar alterações" : "Cadastrar membro"}</button>
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
    mostrarToast("Erro ao abrir formulário de membro.");
    return;
  }

  form.addEventListener("submit", async event => {
    event.preventDefault();

    const nome = document.getElementById("nomeMembro")?.value.trim();
    const user = document.getElementById("userMembro")?.value.trim();
    const semana = Number(document.getElementById("semanaMembro")?.value || 0);

    if (!nome || !user) {
      mostrarToast("Preencha nome e user do membro.");
      return;
    }

    const dados = {
      nome,
      user,
      semana
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