import { auth } from "./firebase.js";

import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";

import { ROTAS, DIAS_SEMANA } from "./config.js";

import {
  criarSubsPadraoSeNecessario,
  listarSubs,
  buscarSub,
  garantirSub,
  limparVerificacoesDaSemana
} from "./data.js";

import { atualizarSemanasGeralSeDomingo } from "./semanas.js";

import {
  escapeHTML,
  getRotaAtual,
  getSubAtual,
  limparSubAtual,
  setRotaAtual,
  setSubAtual,
  mostrarToast,
  confirmarAcao
} from "./utils.js";

const root = document.getElementById("root");

const state = {
  user: null,
  subId: null,
  subConfig: null,
  subs: [],
  rota: ROTAS.DASHBOARD
};

const ICONES_FIXOS_SUBS = {
  A1: "🔥",
  A2: "📖",
  A6: "𖤐",
  A7: "🗺️",
  A9: "🫀",
  A10: "☄️"
};

function getSubConfig() {
  return state.subConfig;
}

function getSubIcon(sub) {
  if (sub?.icone) {
    return String(sub.icone).trim();
  }

  const id = String(sub?.id || "").trim().toUpperCase();

  if (ICONES_FIXOS_SUBS[id]) {
    return ICONES_FIXOS_SUBS[id];
  }

  const texto = String(sub?.botao || sub?.nome || "").trim();

  if (!texto) return "🌙";

  const partes = texto.split(/\s+/);

  for (const parte of partes) {
    const ehCodigoSub = /^A-\d+$/i.test(parte) || /^A\d+$/i.test(parte);
    const temLetraOuNumero = /[a-zA-ZÀ-ÿ0-9]/.test(parte);

    if (!ehCodigoSub && !temLetraOuNumero) {
      return parte;
    }
  }

  return "🌙";
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

function mostrarErroInicial(error) {
  console.error(error);

  root.innerHTML = `
    <main class="center-page">
      <section class="auth-card">
        <h1>⚠️ Erro ao carregar</h1>
        <p>O sistema encontrou um erro de JavaScript antes de abrir.</p>

        <div class="empty-state" style="text-align:left;">
          <strong>Mensagem do erro:</strong>
          <pre style="white-space:pre-wrap;margin-top:10px;">${escapeHTML(error?.message || String(error))}</pre>
        </div>

        <div class="form-actions">
          <button class="btn" type="button" id="recarregarSistemaButton">Recarregar</button>
        </div>
      </section>
    </main>
  `;

  document.getElementById("recarregarSistemaButton")?.addEventListener("click", () => {
    window.location.reload();
  });
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

  document.getElementById("loginForm")?.addEventListener("submit", async event => {
    event.preventDefault();

    const email = document.getElementById("email")?.value.trim();
    const senha = document.getElementById("senha")?.value.trim();

    if (!email || !senha) {
      mostrarToast("Preencha e-mail e senha.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, senha);
    } catch (error) {
      console.error(error);
      mostrarToast("Não foi possível entrar. Confira os dados.");
    }
  });
}

async function renderSelecionarSub() {
  await carregarSubs();
  aplicarTema();

  const subsAtivos = state.subs.filter(sub => sub.ativo !== false);

  const botoes = subsAtivos.map(sub => `
    <button class="sub-card" type="button" data-sub="${escapeHTML(sub.id)}">
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
          <button class="btn secondary" type="button" id="gerenciarSubsButton">⚙️ Gerenciar Subs</button>
          <button class="btn secondary" type="button" id="logoutButton">Sair</button>
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

      if (state.subConfig) {
        await garantirSub(state.subConfig);
      }

      renderAppShell();
    });
  });

  document.getElementById("gerenciarSubsButton")?.addEventListener("click", () => {
    state.subId = null;
    state.subConfig = null;
    state.rota = ROTAS.SUBS;

    setRotaAtual(ROTAS.SUBS);

    renderAppShellSemSub();
  });

  document.getElementById("logoutButton")?.addEventListener("click", logout);
}

function navButton(rota, icon, label) {
  const active = state.rota === rota ? "active" : "";

  return `
    <button class="nav-button ${active}" type="button" data-route="${rota}">
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
          <button class="nav-button" type="button" id="voltarSelecaoButton">
            <span>🔁</span>
            <span>Escolher Sub</span>
          </button>

          <button class="nav-button danger" type="button" id="logoutButton">
            <span>🚪</span>
            <span>Sair</span>
          </button>
        </div>
      </aside>

      <main class="main-area">
        <div class="topbar">
          <button class="btn secondary mobile-menu-button" type="button" id="mobileMenuButton">☰ Menu</button>

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

  bindShellEvents();
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

          <button class="nav-button" type="button" id="resetFichaSidebarButton">
            <span>🧹</span>
            <span>Resetar Ficha da Semana</span>
          </button>
        </nav>

        <div class="sidebar-section-title">Sistema</div>

        <div class="nav-list">
          ${navButton(ROTAS.SUBS, "⚙️", "Subs")}
          
          <button class="nav-button" type="button" id="trocarSubButton">
            <span>🔁</span>
            <span>Trocar Sub</span>
          </button>

          <button class="nav-button danger" type="button" id="logoutButton">
            <span>🚪</span>
            <span>Sair</span>
          </button>
        </div>
      </aside>

      <main class="main-area">
        <div class="topbar">
          <button class="btn secondary mobile-menu-button" type="button" id="mobileMenuButton">☰ Menu</button>

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

  bindShellEvents();
  renderRotaAtual();
}

function bindShellEvents() {
  document.querySelectorAll("[data-route]").forEach(button => {
    button.addEventListener("click", () => {
      fecharMenuMobile();
      navegar(button.dataset.route);
    });
  });

  document.getElementById("trocarSubButton")?.addEventListener("click", () => {
    fecharMenuMobile();
    limparSubAtual();

    state.subId = null;
    state.subConfig = null;

    renderSelecionarSub();
  });

  document.getElementById("voltarSelecaoButton")?.addEventListener("click", () => {
    fecharMenuMobile();
    limparSubAtual();

    state.subId = null;
    state.subConfig = null;

    renderSelecionarSub();
  });

  document.getElementById("logoutButton")?.addEventListener("click", logout);
  document.getElementById("mobileMenuButton")?.addEventListener("click", alternarMenuMobile);
  document.getElementById("mobileBackdrop")?.addEventListener("click", fecharMenuMobile);
  document.getElementById("resetFichaSidebarButton")?.addEventListener("click", resetarFichaDaSemana);
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

  if (el) {
    el.textContent = texto;
  }
}

function getContext() {
  return {
    state,
    setSubtitle,
    refresh: renderRotaAtual,
    navegar
  };
}

async function resetarFichaDaSemana() {
  if (!state.subId) {
    mostrarToast("Nenhum sub selecionado.");
    return;
  }

  const confirmar = await confirmarAcao({
    titulo: "Resetar ficha da semana?",
    mensagem: "Isso vai apagar as verificações salvas da semana atual deste sub. Membros, obras e grade não serão apagados.",
    confirmarTexto: "Sim, resetar",
    cancelarTexto: "Cancelar",
    perigo: true
  });

  if (!confirmar) return;

  try {
    await limparVerificacoesDaSemana(state.subId, DIAS_SEMANA);
    mostrarToast("Ficha da semana resetada.");

    if (state.rota === ROTAS.FICHA || state.rota === ROTAS.PONTUACAO || state.rota === ROTAS.VERIFICACOES) {
      await renderRotaAtual();
    }
  } catch (error) {
    console.error(error);
    mostrarToast("Erro ao resetar ficha da semana.");
  }
}

function renderDashboard() {
  setSubtitle("Painel principal do sub selecionado.");

  const view = document.getElementById("view");

  if (!view) return;

  view.innerHTML = `
    <div class="dashboard-grid">
      <button class="dashboard-card" type="button" data-go="${ROTAS.MEMBROS}">
        <div class="icon">👥</div>
        <strong>Membros</strong>
        <span>Cadastre leitores, usuários e semana atual.</span>
      </button>

      <button class="dashboard-card" type="button" data-go="${ROTAS.OBRAS}">
        <div class="icon">📚</div>
        <strong>Obras</strong>
        <span>Cadastre obras, links e observações fixas.</span>
      </button>

      <button class="dashboard-card" type="button" data-go="${ROTAS.GRADE}">
        <div class="icon">📅</div>
        <strong>Grade Semanal</strong>
        <span>Monte a semana e exporte a grade do dia ou da semana.</span>
      </button>

      <button class="dashboard-card" type="button" data-go="${ROTAS.VERIFICACOES}">
        <div class="icon">📜</div>
        <strong>Verificações</strong>
        <span>Marque leituras, feedbacks, extras e Leitura Lunar.</span>
      </button>

      <button class="dashboard-card" type="button" data-go="${ROTAS.FICHA}">
        <div class="icon">👁️</div>
        <strong>Visualizar Ficha</strong>
        <span>Gere a ficha acumulada da semana para copiar.</span>
      </button>

      <button class="dashboard-card" type="button" data-go="${ROTAS.PONTUACAO}">
        <div class="icon">🏆</div>
        <strong>Pontuação</strong>
        <span>Veja o ranking da semana atual do sub.</span>
      </button>

      <button class="dashboard-card" type="button" id="resetFichaDashboardButton">
        <div class="icon">🧹</div>
        <strong>Resetar Ficha da Semana</strong>
        <span>Limpa as verificações salvas e inicia uma nova semana de ficha.</span>
      </button>
    </div>
  `;

  document.querySelectorAll("[data-go]").forEach(button => {
    button.addEventListener("click", () => navegar(button.dataset.go));
  });

  document.getElementById("resetFichaDashboardButton")?.addEventListener("click", resetarFichaDaSemana);
}

async function carregarModuloPagina(caminho, exportName) {
  const modulo = await import(caminho);

  if (!modulo[exportName]) {
    throw new Error(`O módulo ${caminho} não exporta ${exportName}.`);
  }

  return modulo[exportName];
}

async function renderRotaAtual() {
  try {
    if (state.rota === ROTAS.SUBS) {
      const renderSubsPage = await carregarModuloPagina("./subs.js", "renderSubsPage");
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
      const renderMembrosPage = await carregarModuloPagina("./membros.js", "renderMembrosPage");
      await renderMembrosPage(getContext());
      return;
    }

    if (state.rota === ROTAS.OBRAS) {
      const renderObrasPage = await carregarModuloPagina("./obras.js", "renderObrasPage");
      await renderObrasPage(getContext());
      return;
    }

    if (state.rota === ROTAS.GRADE) {
      const renderGradePage = await carregarModuloPagina("./grade.js", "renderGradePage");
      await renderGradePage(getContext());
      return;
    }

    if (state.rota === ROTAS.VERIFICACOES) {
      const renderVerificacoesPage = await carregarModuloPagina("./verificacoes.js", "renderVerificacoesPage");
      await renderVerificacoesPage(getContext());
      return;
    }

    if (state.rota === ROTAS.FICHA) {
      const renderFichaPage = await carregarModuloPagina("./ficha.js", "renderFichaPage");
      await renderFichaPage(getContext());
      return;
    }

    if (state.rota === ROTAS.PONTUACAO) {
      const renderPontuacaoPage = await carregarModuloPagina("./pontuacao.js", "renderPontuacaoPage");
      await renderPontuacaoPage(getContext());
      return;
    }

    renderDashboard();
  } catch (error) {
    console.error(error);

    const view = document.getElementById("view");

    if (view) {
      view.innerHTML = `
        <section class="card">
          <div class="card-header">
            <div>
              <h3>⚠️ Erro nesta tela</h3>
              <p>O sistema abriu, mas esta página específica encontrou um erro.</p>
            </div>
          </div>

          <div class="empty-state" style="text-align:left;">
            <strong>Erro:</strong>
            <pre style="white-space:pre-wrap;margin-top:10px;">${escapeHTML(error?.message || String(error))}</pre>
          </div>
        </section>
      `;
    } else {
      mostrarErroInicial(error);
    }
  }
}

async function logout() {
  fecharMenuMobile();
  limparSubAtual();

  state.subId = null;
  state.subConfig = null;
  state.rota = ROTAS.DASHBOARD;

  await signOut(auth);
}

async function iniciarSistema(user) {
  try {
    state.user = user;

    if (!user) {
      renderLogin();
      return;
    }

    state.subId = getSubAtual();
    state.rota = getRotaAtual();

    await carregarSubs();

    try {
      await atualizarSemanasGeralSeDomingo();
    } catch (error) {
      console.error("Erro ao atualizar semanas:", error);
    }

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
  } catch (error) {
    mostrarErroInicial(error);
  }
}

onAuthStateChanged(auth, iniciarSistema, mostrarErroInicial);