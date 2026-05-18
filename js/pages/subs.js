import { subs } from "../constants.js";
import { setSub } from "../state.js";
import { ensureSub } from "../services/firestore.js";

export function renderSubs(app) {
  app.innerHTML = `
    <div class="center-page">
      <section class="select-card">
        <h1>Escolher Sub</h1>
        <p>Selecione o sub que deseja gerenciar agora.</p>

        <div class="sub-grid">
          ${Object.values(subs).map((sub) => `
            <button class="sub-card" data-sub="${sub.codigo}" style="--accent:${sub.cor}">
              <strong>${sub.nome}</strong>
              <span>${sub.subtitulo}</span>
            </button>
          `).join("")}
        </div>
      </section>
    </div>
  `;

  app.querySelectorAll("[data-sub]").forEach((btn) => btn.addEventListener("click", async () => {
    const codigo = btn.dataset.sub;
    await ensureSub(codigo, subs[codigo]);
    setSub(codigo);
    location.hash = "dashboard";
  }));
}
