import { state } from "../state.js";
import { subs } from "../constants.js";
import { listMembros, listObras, listVerificacoes, clearVerificacoesSemana } from "../services/firestore.js";

export async function renderDashboard(app) {
  const sub = subs[state.sub];
  const [membros, obras, verificacoes] = await Promise.all([
    listMembros(state.sub),
    listObras(state.sub),
    listVerificacoes(state.sub)
  ]);

  const diasVerificados = Object.keys(verificacoes).length;

  app.innerHTML = `
    <section class="panel">
      <div class="panel-header">
        <div>
          <h1>${sub.nome}</h1>
          <p class="panel-subtitle">Organize membros, obras, grade semanal, verificação e exportações.</p>
        </div>
      </div>

      <div class="grid-3">
        <div class="card"><h3>👥 Membros</h3><strong>${membros.length}</strong><p>Cadastrados neste sub.</p></div>
        <div class="card"><h3>📚 Obras</h3><strong>${obras.length}</strong><p>Obras disponíveis para a grade.</p></div>
        <div class="card"><h3>📅 Dias verificados</h3><strong>${diasVerificados}</strong><p>De segunda a sexta.</p></div>
      </div>

      <div class="toolbar">
        <button data-route="membros">👥 Membros</button>
        <button data-route="obras">📚 Obras</button>
        <button data-route="grade">🗓️ Grade Semanal</button>
        <button data-route="verificacoes">📜 Verificações</button>
        <button data-route="ficha">👁️ Visualizar Ficha</button>
        <button class="danger" id="clearWeek">🧹 Limpar ficha da semana</button>
      </div>
    </section>
  `;

  app.querySelectorAll("[data-route]").forEach((btn) => btn.addEventListener("click", () => {
    location.hash = btn.dataset.route;
  }));

  app.querySelector("#clearWeek").addEventListener("click", async () => {
    const ok = confirm("Limpar as verificações desta semana? Membros, obras e grade não serão apagados.");
    if (!ok) return;
    await clearVerificacoesSemana(state.sub);
    alert("Ficha da semana limpa com sucesso.");
    await renderDashboard(app);
  });
}
