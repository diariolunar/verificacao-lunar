import { auth } from "./firebase.js";

import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";

import { ROTAS } from "./config.js";

import {
  criarSubsPadraoSeNecessario,
  listarSubs,
  buscarSub,
  garantirSub
} from "./data.js";

import { atualizarSemanasGeralSeDomingo } from "./semanas.js";

import { renderMembrosPage } from "./membros.js";
import { renderObrasPage } from "./obras.js";
import { renderGradePage } from "./grade.js";
import { renderVerificacoesPage } from "./verificacoes.js";
import { renderFichaPage } from "./ficha.js";
import { renderPontuacaoPage } from "./pontuacao.js";
import { renderSubsPage } from "./subs.js";

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
  subConfig: null,
  subs: [],
  rota: ROTAS.DASHBOARD
};

function getSubConfig() {
  return state.subConfig;
}

function getSubIcon(sub) {
  const texto = String(sub?.botao || sub?.nome || "").trim();

  if (!texto) return "🌙";

  const partes = texto.split(/\s+/);

  const icone = partes.find(parte => {
    const ehCodigoSub = /^A-\d+$/i.test(parte);
    const temLetraOuNumero = /[a-zA-ZÀ-ÿ0-9]/.test(parte);

    return !ehCodigoSub && !temLetraOuNumero;
  });

  return icone || "🌙";
}

function aplicarTema() {
  const sub = getSubConfig();

  if (!sub) {
    document.documentElement.style.setProperty("--accent", "#7c3aed");
    document.documentElement.style.setProperty("--accent-dark", "#a78bfa");
    document.documentElement.style.setProperty("--accent-soft", "rgba(124, 58, 237, 0.24)");
    document.documentElement.style.setProperty("--topbar-gradient", "linear-gradient(90deg, rgba(16, 7, 31, 0.97) 0%, rgba(124, 58, 237, 0.30) 100%)");
    return;
  }

  const cor = sub.cor || "#7c3aed";

  document.documentElement.style.setProperty("--accent", cor);
  document.documentElement.style.setProperty("--accent-dark", cor);
  document.documentElement.style.setProperty("--accent-soft", `${cor}33`);
  document.documentElement.style.setProperty("--topbar-gradient", `linear-gradient(90deg, rgba(16, 7, 31, 0.97) 0%, ${cor}55 58%, ${cor}77 100%)`);
}

async function carregarSubs() {
  await criarSubsPadraoSeNecessario();
  state.subs = await listarSubs();

  if (state.subId) {
    state.subConfig = await buscarSub(state.subId);

    if (!state.subConfig) {
      limparSubAtual();
      state.subId = null;
      state.subConfig = null;
    }
  }
}

function fecharMenuMobile() {
  document.body.classList.remove("menu-open");
}

function alternarMenuMobile() {
  document.body.classList.toggle("menu-open");
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

async function renderSelecionarSub() {
  await carregarSubs();
  aplicarTema();

  const subsAtivos = state.subs.filter(sub => sub.ativo !== false);

  const botoes = subsAtivos.map(sub => `
    <button class="sub-card" data-sub="${sub.id}">
      <strong>${escapeHTML(sub.botao || sub.nome || sub.id)}</strong>
      <span>${escapeHTML(sub.subtitulo || "")}</span>
    </button>
  `).join("");

  root.innerHTML = `
    <main class="center-page">
      <section class="auth-card">
        <h1>Escolher Sub</h1>
        <p>Selecione qual sub você quer gerenciar agora.</p>

        <div class="sub-grid">
          ${botoes || `<div class="empty-state">Nenhum sub ativo cadastrado.</div>`}
        </div>

        <div class="form-actions">
          <button class="btn secondary" id="gerenciarSubsButton">⚙️ Gerenciar Subs</button>
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
      state.subConfig = await buscarSub(subId);
      state.rota = ROTAS.DASHBOARD;
      setRotaAtual(ROTAS.DASHBOARD);

      await garantirSub(state.subConfig);

      renderAppShell();
    });
  });

  document.getElementById("gerenciarSubsButton").addEventListener("click", async () => {
    state.subId = null;
    state.subConfig = null;
    state.rota = ROTAS.SUBS;
    setRotaAtual(ROTAS.SUBS);
    renderAppShellSemSub();
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

function renderAppShellSemSub() {
  aplicarTema();

  root.innerHTML = `
    <div class="app-shell">
      <div class="mobile-backdrop" id="mobileBackdrop"></div>

      <aside class="sidebar">
        <div class="sidebar-brand">
          <div class="brand-icon">🌙</div>
          <div>
            <h1>Verificação Lunar</h1>
            <p>V2 • Configurações</p>
          </div>
        </div>

        <div class="sidebar-section-title">Sistema</div>

        <nav class="nav-list">
          ${navButton(ROTAS.SUBS, "⚙️", "Subs")}
        </nav>

        <div class="sidebar-section-title">Acesso</div>

        <div class="nav-list">
          <button class="nav-button" id="voltarSelecaoButton">
            <span>🔁</span>
            <span>Escolher Sub</span>
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
            <h2>⚙️ Configurações</h2>
            <p id="pageSubtitle">Gerencie os subs disponíveis na plataforma.</p>
          </div>

          <div class="topbar-actions">
            <span class="topbar-sub-icon">🌙</span>
          </div>
        </div>

        <section class="content" id="view"></section>
      </main>
    </div>
  `;

  document.querySelectorAll("[data-route]").forEach(button => {
    button.addEventListener("click", () => {
      fecharMenuMobile();
      navegar(button.dataset.route);
    });
  });

  document.getElementById("voltarSelecaoButton").addEventListener("click", () => {
    fecharMenuMobile();
    limparSubAtual();
    state.subId = null;
    state.subConfig = null;
    renderSelecionarSub();
  });

  document.getElementById("logoutButton").addEventListener("click", logout);
  document.getElementById("mobileMenuButton").addEventListener("click", alternarMenuMobile);
  document.getElementById("mobileBackdrop").addEventListener("click", fecharMenuMobile);

  renderRotaAtual();
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
      <div class="mobile-backdrop" id="mobileBackdrop"></div>

      <aside class="sidebar">
        <div class="sidebar-brand">
          <div class="brand-icon">🌙</div>
          <div>
            <h1>Verificação Lunar</h1>
            <p>V2 • ${escapeHTML(sub.nome || sub.botao || sub.id)}</p>
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
          ${navButton(ROTAS.SUBS, "⚙️", "Subs")}
          
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
            <h2>${escapeHTML(sub.botao || sub.nome || sub.id)}</h2>
            <p id="pageSubtitle">Sistema de verificação e grade do Projeto Lunar.</p>
          </div>

          <div class="topbar-actions">
            <span class="topbar-sub-icon">${escapeHTML(getSubIcon(sub))}</span>
          </div>
        </div>

        <section class="content" id="view"></section>
      </main>
    </div>
  `;

  document.querySelectorAll("[data-route]").forEach(button => {
    button.addEventListener("click", () => {
      fecharMenuMobile();
      navegar(button.dataset.route);
    });
  });

  document.getElementById("trocarSubButton").addEventListener("click", () => {
    fecharMenuMobile();
    limparSubAtual();
    state.subId = null;
    state.subConfig = null;
    renderSelecionarSub();
  });

  document.getElementById("logoutButton").addEventListener("click", logout);
  document.getElementById("mobileMenuButton").addEventListener("click", alternarMenuMobile);
  document.getElementById("mobileBackdrop").addEventListener("click", fecharMenuMobile);

  renderRotaAtual();
}

function navegar(rota) {
  state.rota = rota;
  setRotaAtual(rota);
  fecharMenuMobile();

  if (rota === ROTAS.SUBS) {
    renderAppShellSemSub();
    return;
  }

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
  if (state.rota === ROTAS.SUBS) {
    await renderSubsPage(getContext());
    return;
  }

  if (!state.subConfig) {
    await renderSelecionarSub();
    return;
  }

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
  fecharMenuMobile();
  limparSubAtual();
  state.subId = null;
  state.subConfig = null;
  state.rota = ROTAS.DASHBOARD;
  await signOut(auth);
}

onAuthStateChanged(auth, async user => {
  state.user = user;

  if (!user) {
    renderLogin();
    return;
  }

  state.subId = getSubAtual();
  state.rota = getRotaAtual();

  await carregarSubs();
  await atualizarSemanasGeralSeDomingo();

  await carregarSubs();

  if (!state.subId && state.rota !== ROTAS.SUBS) {
    await renderSelecionarSub();
    return;
  }

  if (state.rota === ROTAS.SUBS) {
    renderAppShellSemSub();
    return;
  }

  renderAppShell();
});