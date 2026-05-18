import { state } from "../state.js";
import { listMembros, listObras, getObra, saveObra, deleteObra } from "../services/firestore.js";
import { escapeHTML } from "../utils.js";

export async function renderObras(app) {
  const [membros, obras] = await Promise.all([listMembros(state.sub), listObras(state.sub)]);

  app.innerHTML = `
    <section class="panel">
      <div class="panel-header">
        <div>
          <h1>📚 Obras</h1>
          <p class="panel-subtitle">Cadastre as obras e as regras fixas de leitura de cada uma.</p>
        </div>
        <button id="newWork">+ Nova obra</button>
      </div>

      <div class="list">
        ${obras.length ? obras.map((obra) => {
          const membro = membros.find((m) => m.id === obra.membroId);
          return `
            <article class="item-card">
              <div>
                <strong>${escapeHTML(obra.titulo)}</strong>
                <span class="meta">Autor: ${escapeHTML(membro?.nome || "Membro não encontrado")}</span>
                <span class="meta">User: ${escapeHTML(membro?.user || "")}</span>
                <span class="meta">Link: ${escapeHTML(obra.link || "Não informado")}</span>
                ${obra.capitulos4100 ? `<span class="meta">+4,1k: ${escapeHTML(obra.capitulos4100)}</span>` : ""}
                ${obra.capitulosMenos500 ? `<span class="meta">-500: ${escapeHTML(obra.capitulosMenos500)}</span>` : ""}
                ${obra.prologo1000 ? `<span class="meta">Prólogo +1k: Sim</span>` : ""}
              </div>
              <div class="item-actions">
                <button class="secondary" data-edit="${obra.id}">Editar</button>
                <button class="danger" data-delete="${obra.id}">Excluir</button>
              </div>
            </article>
          `;
        }).join("") : `<div class="empty-state">Nenhuma obra cadastrada ainda.</div>`}
      </div>
    </section>
  `;

  app.querySelector("#newWork").addEventListener("click", () => renderObraForm(app));
  app.querySelectorAll("[data-edit]").forEach((btn) => btn.addEventListener("click", () => renderObraForm(app, btn.dataset.edit)));
  app.querySelectorAll("[data-delete]").forEach((btn) => btn.addEventListener("click", async () => {
    const ok = confirm("Excluir esta obra?");
    if (!ok) return;
    await deleteObra(state.sub, btn.dataset.delete);
    await renderObras(app);
  }));
}

async function renderObraForm(app, id = null) {
  const membros = await listMembros(state.sub);
  if (!membros.length) {
    app.innerHTML = `<section class="panel"><div class="empty-state">Cadastre um membro antes de cadastrar uma obra.</div><div class="toolbar"><button data-route="membros">Cadastrar membro</button></div></section>`;
    app.querySelector("[data-route]").addEventListener("click", () => { location.hash = "membros"; });
    return;
  }

  const obra = id ? await getObra(state.sub, id) : {
    titulo: "",
    link: "",
    membroId: "",
    capitulos4100: "",
    capitulosMenos500: "",
    prologo1000: false,
    observacoes: "",
    alternativaTitulo: "",
    alternativaLink: "",
    alternativaObs: ""
  };

  app.innerHTML = `
    <section class="panel">
      <div class="panel-header">
        <div>
          <h1>${id ? "Editar obra" : "Nova obra"}</h1>
          <p class="panel-subtitle">As informações especiais ficam na obra e serão puxadas automaticamente na exportação da grade.</p>
        </div>
      </div>

      <form id="workForm" class="form-grid">
        <div class="grid-2">
          <div class="form-row">
            <label>Nome da obra</label>
            <input name="titulo" required value="${escapeHTML(obra?.titulo || "")}" />
          </div>
          <div class="form-row">
            <label>Link da obra</label>
            <input name="link" placeholder="https://www.wattpad.com/story/..." value="${escapeHTML(obra?.link || "")}" />
          </div>
        </div>

        <div class="form-row">
          <label>Membro responsável</label>
          <select name="membroId" required>
            <option value="">Selecione</option>
            ${membros.map((membro) => `<option value="${membro.id}" ${obra?.membroId === membro.id ? "selected" : ""}>${escapeHTML(membro.nome)} (${escapeHTML(membro.user)})</option>`).join("")}
          </select>
        </div>

        <div class="grid-2">
          <div class="form-row">
            <label>Capítulos com +4,1k palavras</label>
            <input name="capitulos4100" placeholder="Ex: 3, 4 e 7" value="${escapeHTML(obra?.capitulos4100 || "")}" />
          </div>
          <div class="form-row">
            <label>Capítulos com -500 palavras</label>
            <input name="capitulosMenos500" placeholder="Ex: Capítulo 5, Especial..." value="${escapeHTML(obra?.capitulosMenos500 || "")}" />
          </div>
        </div>

        <label class="checkbox-line">
          <input type="checkbox" name="prologo1000" ${obra?.prologo1000 ? "checked" : ""} />
          Prólogo tem +1k palavras
        </label>

        <div class="form-row">
          <label>Observações extras da obra</label>
          <textarea name="observacoes" placeholder="Ex: Contém gatilhos, ler especial, comentários bem distribuídos...">${escapeHTML(obra?.observacoes || "")}</textarea>
        </div>

        <div class="notice">Obra alternativa para quem já leu. Preencha apenas se existir.</div>
        <div class="grid-2">
          <div class="form-row">
            <label>Nome da obra alternativa</label>
            <input name="alternativaTitulo" value="${escapeHTML(obra?.alternativaTitulo || "")}" />
          </div>
          <div class="form-row">
            <label>Link da obra alternativa</label>
            <input name="alternativaLink" value="${escapeHTML(obra?.alternativaLink || "")}" />
          </div>
        </div>
        <div class="form-row">
          <label>Observações da alternativa</label>
          <textarea name="alternativaObs">${escapeHTML(obra?.alternativaObs || "")}</textarea>
        </div>

        <div class="form-actions">
          <button type="submit">Salvar</button>
          <button type="button" class="secondary" id="cancel">Cancelar</button>
        </div>
      </form>
    </section>
  `;

  app.querySelector("#cancel").addEventListener("click", () => renderObras(app));
  app.querySelector("#workForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    await saveObra(state.sub, {
      titulo: String(form.get("titulo") || "").trim(),
      link: String(form.get("link") || "").trim(),
      membroId: String(form.get("membroId") || ""),
      capitulos4100: String(form.get("capitulos4100") || "").trim(),
      capitulosMenos500: String(form.get("capitulosMenos500") || "").trim(),
      prologo1000: form.get("prologo1000") === "on",
      observacoes: String(form.get("observacoes") || "").trim(),
      alternativaTitulo: String(form.get("alternativaTitulo") || "").trim(),
      alternativaLink: String(form.get("alternativaLink") || "").trim(),
      alternativaObs: String(form.get("alternativaObs") || "").trim()
    }, id);
    await renderObras(app);
  });
}
