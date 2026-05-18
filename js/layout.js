import { auth } from "../firebase.js";
import { signOut } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";
import { state, setSub } from "./state.js";
import { subs } from "./constants.js";

const sidebar = document.getElementById("sidebar");
const topbar = document.getElementById("topbar");

const routes = [
  ["dashboard", "🏠", "Início"],
  ["membros", "👥", "Membros"],
  ["obras", "📚", "Obras"],
  ["grade", "🗓️", "Grade"],
  ["verificacoes", "📜", "Verificações"],
  ["ficha", "👁️", "Ficha"],
  ["subs", "🔁", "Trocar Sub"]
];

export function currentRoute() {
  return location.hash.replace("#", "") || "dashboard";
}

export function updateLayout() {
  const hasUser = Boolean(state.user);
  const hasSub = Boolean(state.sub);
  const route = currentRoute();

  if (!hasUser || !hasSub || route === "subs") {
    sidebar.classList.add("hidden");
    topbar.classList.add("hidden");
    return;
  }

  const sub = subs[state.sub];
  document.documentElement.style.setProperty("--accent", sub.cor);
  document.documentElement.style.setProperty("--accent-2", `${sub.cor}26`);

  sidebar.classList.remove("hidden");
  topbar.classList.remove("hidden");

  sidebar.innerHTML = `
    <div class="brand">
      <div class="brand-icon">🌙</div>
      <div>
        <h1>Verificação Lunar</h1>
        <p>${sub.subtitulo}</p>
      </div>
    </div>

    <nav class="nav">
      ${routes.map(([hash, icon, label]) => `
        <button class="${route === hash ? "active" : ""}" data-route="${hash}">${icon} ${label}</button>
      `).join("")}
      <button data-action="logout">🚪 Sair</button>
    </nav>
  `;

  topbar.innerHTML = `
    <div>
      <h2>${sub.nome}</h2>
      <p>Sistema de verificação, grade e pontuação.</p>
    </div>
    <button class="secondary" data-route="subs">Trocar Sub</button>
  `;

  sidebar.querySelectorAll("[data-route]").forEach((btn) => btn.addEventListener("click", () => {
    const target = btn.dataset.route;
    if (target === "subs") setSub("");
    location.hash = target;
  }));

  topbar.querySelectorAll("[data-route]").forEach((btn) => btn.addEventListener("click", () => {
    setSub("");
    location.hash = btn.dataset.route;
  }));

  const logoutButton = sidebar.querySelector("[data-action='logout']");
  logoutButton.addEventListener("click", async () => {
    setSub("");
    await signOut(auth);
  });
}
