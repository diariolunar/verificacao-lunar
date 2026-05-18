import { state } from "../state.js";
import { listMembros, getMembro, saveMembro, deleteMembro } from "../services/firestore.js";
import { escapeHTML } from "../utils.js";

export async function renderMembros(app) {
  const membros = await listMembros(state.sub);

  app.innerHTML = `
    <section class="panel">
      <div class="panel-header">
        <div>
          <h1>👥 Membros</h1>
          <p class="panel-subtitle">Cadastre nome, user e semana atual de cada membro.</p>
        </div>
        <button id="newMember">+ Novo membro</button>
      </div>

      <div class="list">
        ${membros.length ? membros.map((membro) => `
          <article class="item-card">
            <div>
              <strong>${escapeHTML(membro.nome)}</strong>
              <span class="meta">User: ${escapeHTML(membro.user)}</span>
              <span class="meta">Semana: ${Number(membro.semana || 0)}</span>
            </div>
            <div class="item-actions">
              <button class="secondary" data-edit="${membro.id}">Editar</button>
              <button class="danger" data-delete="${membro.id}">Excluir</button>
            </div>
          </article>
        `).join("") : `<div class="empty-state">Nenhum membro cadastrado ainda.</div>`}
      </div>
    </section>
  `;

  app.querySelector("#newMember").addEventListener("click", () => renderMembroForm(app));
  app.querySelectorAll("[data-edit]").forEach((btn) => btn.addEventListener("click", () => renderMembroForm(app, btn.dataset.edit)));
  app.querySelectorAll("[data-delete]").forEach((btn) => btn.addEventListener("click", async () => {
    const ok = confirm("Excluir este membro? A obra vinculada a ele não será apagada automaticamente na V2.");
    if (!ok) return;
    await deleteMembro(state.sub, btn.dataset.delete);
    await renderMembros(app);
  }));
}

async function renderMembroForm(app, id = null) {
  const membro = id ? await getMembro(state.sub, id) : { nome: "", user: "", semana: 0 };

  app.innerHTML = `
    <section class="panel">
      <div class="panel-header">
        <div>
          <h1>${id ? "Editar membro" : "Novo membro"}</h1>
          <p class="panel-subtitle">Preencha os dados do membro.</p>
        </div>
      </div>

      <form id="memberForm" class="form-grid">
        <div class="grid-2">
          <div class="form-row">
            <label>Nome</label>
            <input name="nome" required value="${escapeHTML(membro?.nome || "")}" />
          </div>
          <div class="form-row">
            <label>User</label>
            <input name="user" required value="${escapeHTML(membro?.user || "")}" />
          </div>
        </div>
        <div class="form-row">
          <label>Semana atual</label>
          <input name="semana" type="number" min="0" value="${Number(membro?.semana || 0)}" />
        </div>
        <div class="form-actions">
          <button type="submit">Salvar</button>
          <button type="button" class="secondary" id="cancel">Cancelar</button>
        </div>
      </form>
    </section>
  `;

  app.querySelector("#cancel").addEventListener("click", () => renderMembros(app));
  app.querySelector("#memberForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    await saveMembro(state.sub, {
      nome: String(form.get("nome") || "").trim(),
      user: String(form.get("user") || "").trim(),
      semana: Number(form.get("semana") || 0)
    }, id);
    await renderMembros(app);
  });
}
