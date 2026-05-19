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
  mostrarToast
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
          <h4>${escapeHTML(membro.nome)}</h4>
          <p>User: ${escapeHTML(membro.user)}</p>
          <p>Semana atual: ${membro.semana ?? 0}</p>
        </div>

        <div class="item-actions">
          <button class="btn secondary" data-editar-membro="${membro.id}">Editar</button>
          <button class="btn danger" data-excluir-membro="${membro.id}">Excluir</button>
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
          <p>Cadastre nome, user e a semana atual de cada participante.</p>
        </div>

        <button class="btn" id="novoMembroButton">+ Novo Membro</button>
      </div>

      <div class="item-list">
        ${listaHTML}
      </div>
    </section>
  `;

  document.getElementById("novoMembroButton").addEventListener("click", () => {
    abrirFormularioMembro({
      state,
      refresh,
      membro: null
    });
  });

  document.querySelectorAll("[data-editar-membro]").forEach(button => {
    const membro = membros.find(item => item.id === button.dataset.editarMembro);

    button.addEventListener("click", () => {
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

      const confirmar = confirm(
        `Tem certeza que deseja excluir ${membro?.nome || "este membro"}?\n\nAs obras vinculadas a esse membro também serão removidas.`
      );

      if (!confirmar) return;

      await excluirMembro(state.subId, membroId);
      mostrarToast("Membro excluído.");
      await refresh();
    });
  });
}

function abrirFormularioMembro({ state, refresh, membro }) {
  const editando = Boolean(membro);

  abrirModal(editando ? "Editar membro" : "Novo membro", `
    <form id="membroForm" class="grid">
      <div class="form-row">
        <label for="nomeMembro">Nome</label>
        <input 
          id="nomeMembro" 
          placeholder="Ex: Mayke Arrais" 
          value="${escapeHTML(membro?.nome || "")}"
        />
      </div>

      <div class="form-row">
        <label for="userMembro">User</label>
        <input 
          id="userMembro" 
          placeholder="Ex: RKymae" 
          value="${escapeHTML(membro?.user || "")}"
        />
      </div>

      <div class="form-row">
        <label for="semanaMembro">Semana atual</label>
        <input 
          id="semanaMembro" 
          type="number" 
          min="0" 
          placeholder="Ex: 2" 
          value="${membro?.semana ?? 0}"
        />
      </div>

      <div class="form-actions">
        <button class="btn" type="submit">${editando ? "Salvar alterações" : "Cadastrar membro"}</button>
        <button class="btn secondary" type="button" id="cancelarMembro">Cancelar</button>
      </div>
    </form>
  `);

  document.getElementById("cancelarMembro").addEventListener("click", fecharModal);

  document.getElementById("membroForm").addEventListener("submit", async event => {
    event.preventDefault();

    const dados = {
      nome: document.getElementById("nomeMembro").value.trim(),
      user: document.getElementById("userMembro").value.trim(),
      semana: Number(document.getElementById("semanaMembro").value || 0)
    };

    if (!dados.nome || !dados.user) {
      mostrarToast("Preencha nome e user.");
      return;
    }

    if (editando) {
      await atualizarMembro(state.subId, membro.id, dados);
      mostrarToast("Membro atualizado.");
    } else {
      await criarMembro(state.subId, dados);
      mostrarToast("Membro cadastrado.");
    }

    fecharModal();
    await refresh();
  });
}