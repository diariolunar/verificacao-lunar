import { auth } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";
import { state, setUser } from "./js/state.js";
import { updateLayout, currentRoute } from "./js/layout.js";
import { renderLogin } from "./js/pages/login.js";
import { renderSubs } from "./js/pages/subs.js";
import { renderDashboard } from "./js/pages/dashboard.js";
import { renderMembros } from "./js/pages/membros.js";
import { renderObras } from "./js/pages/obras.js";
import { renderGrade } from "./js/pages/grade.js";
import { renderVerificacoes } from "./js/pages/verificacoes.js";
import { renderFicha } from "./js/pages/ficha.js";

const app = document.getElementById("app");

async function render() {
  updateLayout();

  if (!state.user) {
    renderLogin(app);
    return;
  }

  const route = currentRoute();

  if (!state.sub || route === "subs") {
    renderSubs(app);
    updateLayout();
    return;
  }

  try {
    if (route === "membros") await renderMembros(app);
    else if (route === "obras") await renderObras(app);
    else if (route === "grade") await renderGrade(app);
    else if (route === "verificacoes") await renderVerificacoes(app);
    else if (route === "ficha") await renderFicha(app);
    else await renderDashboard(app);
  } catch (error) {
    console.error(error);
    app.innerHTML = `
      <section class="panel">
        <h1>Algo deu errado</h1>
        <p class="panel-subtitle">Erro: ${error.message || error}</p>
        <button onclick="location.reload()">Recarregar</button>
      </section>
    `;
  }

  updateLayout();
}

onAuthStateChanged(auth, async (user) => {
  setUser(user);
  await render();
});

window.addEventListener("hashchange", render);
