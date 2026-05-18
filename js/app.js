import { auth } from "./firebase.js";

import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";

import { ROTAS, SUBS } from "./config.js";

import { garantirSub } from "./data.js";
import { renderMembrosPage } from "./membros.js";
import { renderObrasPage } from "./obras.js";
import { renderGradePage } from "./grade.js";
import { renderVerificacoesPage } from "./verificacoes.js";
import { renderFichaPage } from "./ficha.js";
import { renderPontuacaoPage } from "./pontuacao.js";

import {
  escapeHTML,
  getRotaAtual,
  getSubAtual,
  limparSubAtual,
  setRotaAtual,
  setSubAtual,
  mostrarToast
} from "./utils.js";

const root = document.getElementById("root");

const state = {
  user: null,
  subId: null,
  rota: ROTAS.DASHBOARD
};

function getSubConfig() {
  if (!state.subId) return null;
  return SUBS[state.subId] || null;
}

function aplicarTema() {
  const sub = getSubConfig();

  if (!sub) {
    document.documentElement.style.setProperty("--accent", "#10b981");
    document.documentElement.style.setProperty("--accent-dark", "#059669");
    document.documentElement.style.setProperty("--accent-soft", "rgba(16, 185, 129, 0.18)");
    return;
  }

  document.documentElement.style.setProperty("--accent", sub.cor);
  document.documentElement.style.setProperty("--accent-dark", sub.cor);
  document.documentElement.style.setProperty("--accent-soft", `${sub.cor}33`);
}

function renderLogin() {
  aplicarTema();

  root.innerHTML = `
    <main class="center-page">
      <section class="auth-card">
        <h1>🌙 Verificação Lunar V2</h1>
        <p>Entre com o acesso do ADM para gerenciar os subs.</p>

        <form id="loginForm" class="grid">
          <div class="form-row">
            <label for="email">E-mail</label>
            <input id="email" type="email" placeholder="seuemail@email.com" autocomplete="email" />
          </div>

          <div class="form-row">
            <label for="senha">Senha</label>
            <input id="senha" type="password" placeholder="Sua senha" autocomplete="current-password" />
          </div>

          <button class="btn full" type="submit">Entrar</button>
        </form>
      </section>
    </main>
  `;

  document.getElementById("loginForm").addEventListener("submit", async event => {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value.trim();

    if (!email || !senha) {
      mostrarToast("Preencha e-mail e senha.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, senha);
    } catch (error) {
      mostrarToast("Não foi possível entrar. Confira os dados.");
    }
  });
}

function renderSelecionarSub() {
  aplicarTema();

  const botoes = Object.values(SUBS).map(sub => `
    <button class="sub-card" data-sub="${sub.id}">
      <strong>${escapeHTML(sub.botao)}</strong>
      <span>${escapeHTML(sub.subtitulo)}</span>
    </button>
  `).join("");

  root.innerHTML = `
    <main class="center-page">
      <section class="auth-card">
        <h1>Escolher Sub</h1>
        <p>Selecione qual sub você quer gerenciar agora.</p>

        <div class="sub-grid">
          ${botoes}
        </div>

        <div class="form-actions">
          <button class="btn secondary" id="logoutButton">Sair</button>
        </div>
      </section>
    </main>
  `;

  document.querySelectorAll("[data-sub]").forEach(button => {
    button.addEventListener("click", async () => {
      const subId = button.dataset.sub;

      setSubAtual(subId);
      state.subId = subId;
      state.rota = ROTAS.DASHBOARD;
      setRotaAtual(ROTAS.DASHBOARD);

      const sub = SUBS[subId];

      await garantirSub(sub);

      renderAppShell();
    });
  });

  document.getElementById("logoutButton").addEventListener("click", logout);
}

function navButton(rota, icon, label) {
  const active = state.rota === rota ? "active" : "";

  return `
    <button class="nav-button ${active}" data-route="${rota}">
      <span>${icon}</span>
      <span>${label}</span>
    </button>
  `;
}

function renderAppShell() {
  const sub = getSubConfig();

  if (!sub) {
    renderSelecionarSub();
    return;
  }

  aplicarTema();

  root.innerHTML = `
    <div class="app-shell">
      <aside class="sidebar">
        <div class="sidebar-brand">
          <div class="brand-icon">🌙</div>
          <div>
            <h1>Verificação Lunar</h1>
            <p>V2 • ${escapeHTML(sub.nome)}</p>
          </div>
        </div>

        <div class="sidebar-section-title">Gestão</div>

        <nav class="nav-list">
          ${navButton(ROTAS.DASHBOARD, "🏠", "Início")}
          ${navButton(ROTAS.MEMBROS, "👥", "Membros")}
          ${navButton(ROTAS.OBRAS, "📚", "Obras")}
          ${navButton(ROTAS.GRADE, "📅", "Grade Semanal")}
          ${navButton(ROTAS.VERIFICACOES, "📜", "Verificações")}
          ${navButton(ROTAS.FICHA, "👁️", "Visualizar Ficha")}
          ${navButton(ROTAS.PONTUACAO, "🏆", "Pontuação")}
        </nav>

        <div class="sidebar-section-title">Sistema</div>

        <div class="nav-list">
          <button class="nav-button" id="trocarSubButton">
            <span>🔁</span>
            <span>Trocar Sub</span>
          </button>

          <button class="nav-button danger" id="logoutButton">
            <span>🚪</span>
            <span>Sair</span>
          </button>
        </div>
      </aside>

      <main class="main-area">
        <div class="topbar">
          <button class="btn secondary mobile-menu-button" id="mobileMenuButton">☰ Menu</button>

          <div class="topbar-title">
            <h2>${escapeHTML(sub.botao)}</h2>
            <p id="pageSubtitle">Sistema de verificação e grade do Projeto Lunar.</p>
          </div>

          <div class="topbar-actions">
            <span class="badge">🔥 ${escapeHTML(sub.subtitulo)}</span>
          </div>
        </div>

        <section class="content" id="view"></section>
      </main>
    </div>
  `;

  document.querySelectorAll("[data-route]").forEach(button => {
    button.addEventListener("click", () => {
      navegar(button.dataset.route);
    });
  });

  document.getElementById("trocarSubButton").addEventListener("click", () => {
    limparSubAtual();
    state.subId = null;
    renderSelecionarSub();
  });

  document.getElementById("logoutButton").addEventListener("click", logout);

  document.getElementById("mobileMenuButton").addEventListener("click", () => {
    document.body.classList.toggle("menu-open");
  });

  renderRotaAtual();
}

function navegar(rota) {
  state.rota = rota;
  setRotaAtual(rota);
  document.body.classList.remove("menu-open");
  renderAppShell();
}

function setSubtitle(texto) {
  const el = document.getElementById("pageSubtitle");
  if (el) el.textContent = texto;
}

function getContext() {
  return {
    state,
    setSubtitle,
    refresh: renderRotaAtual,
    navegar
  };
}

function renderDashboard() {
  setSubtitle("Painel principal do sub selecionado.");

  const view = document.getElementById("view");

  view.innerHTML = `
    <div class="dashboard-grid">
      <button class="dashboard-card" data-go="${ROTAS.MEMBROS}">
        <div class="icon">👥</div>
        <strong>Membros</strong>
        <span>Cadastre leitores, usuários e semana atual.</span>
      </button>

      <button class="dashboard-card" data-go="${ROTAS.OBRAS}">
        <div class="icon">📚</div>
        <strong>Obras</strong>
        <span>Cadastre obras, links e observações fixas.</span>
      </button>

      <button class="dashboard-card" data-go="${ROTAS.GRADE}">
        <div class="icon">📅</div>
        <strong>Grade Semanal</strong>
        <span>Monte a semana e exporte a grade do dia ou da semana.</span>
      </button>

      <button class="dashboard-card" data-go="${ROTAS.VERIFICACOES}">
        <div class="icon">📜</div>
        <strong>Verificações</strong>
        <span>Marque leituras, feedbacks e extras.</span>
      </button>

      <button class="dashboard-card" data-go="${ROTAS.FICHA}">
        <div class="icon">👁️</div>
        <strong>Visualizar Ficha</strong>
        <span>Gere a ficha acumulada para copiar.</span>
      </button>

      <button class="dashboard-card" data-go="${ROTAS.PONTUACAO}">
        <div class="icon">🏆</div>
        <strong>Pontuação</strong>
        <span>Veja o ranking acumulado do sub.</span>
      </button>
    </div>
  `;

  document.querySelectorAll("[data-go]").forEach(button => {
    button.addEventListener("click", () => navegar(button.dataset.go));
  });
}

async function renderRotaAtual() {
  if (state.rota === ROTAS.DASHBOARD) {
    renderDashboard();
    return;
  }

  if (state.rota === ROTAS.MEMBROS) {
    await renderMembrosPage(getContext());
    return;
  }

  if (state.rota === ROTAS.OBRAS) {
    await renderObrasPage(getContext());
    return;
  }

  if (state.rota === ROTAS.GRADE) {
    await renderGradePage(getContext());
    return;
  }

  if (state.rota === ROTAS.VERIFICACOES) {
    await renderVerificacoesPage(getContext());
    return;
  }

  if (state.rota === ROTAS.FICHA) {
    await renderFichaPage(getContext());
    return;
  }

  if (state.rota === ROTAS.PONTUACAO) {
    await renderPontuacaoPage(getContext());
    return;
  }

  renderDashboard();
}

async function logout() {
  limparSubAtual();
  state.subId = null;
  state.rota = ROTAS.DASHBOARD;
  await signOut(auth);
}

onAuthStateChanged(auth, user => {
  state.user = user;

  if (!user) {
    renderLogin();
    return;
  }

  state.subId = getSubAtual();
  state.rota = getRotaAtual();

  if (!state.subId) {
    renderSelecionarSub();
    return;
  }

  renderAppShell();
});