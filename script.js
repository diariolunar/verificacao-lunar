const subs = {
  A6: {
    nome: "👑 Trono de Papel",
    cor: "#6B21A8"
  },
  A1: {
    nome: "🔥 Chama Eterna",
    cor: "#b91c1c"
  },
  A2: {
    nome: "📖 Página Livre",
    cor: "#0ea5e9"
  }
};

const app = document.getElementById("app");

async function carregarComponentes() {
  const header = await fetch("header.html").then(res => res.text());
  const footer = await fetch("footer.html").then(res => res.text());

  document.getElementById("header").innerHTML = header;
  document.getElementById("footer").innerHTML = footer;

  iniciarApp();
}

function iniciarApp() {
  const usuarioLogado = localStorage.getItem("logado");
  const subSelecionado = localStorage.getItem("sub");

  if (!usuarioLogado) {
    telaLogin();
  } else if (!subSelecionado) {
    telaSubs();
  } else {
    telaDashboard();
  }

  aplicarTema();
}

// 🧱 LOGIN
function telaLogin() {
  app.innerHTML = `
    <div class="login-box">
      <h2>Verificação Lunar</h2>
      <p>Login do ADM</p>

      <input id="email" type="email" placeholder="E-mail">
      <input id="senha" type="password" placeholder="Senha">

      <button onclick="login()">Entrar</button>
    </div>
  `;
}

// 🌙 ESCOLHER SUB
function telaSubs() {
  app.innerHTML = `
    <div class="login-box">
      <h2>Escolher Sub</h2>

      <button onclick="selecionarSub('A6')">👑 Trono de Papel</button>
      <button onclick="selecionarSub('A1')">🔥 Chama Eterna</button>
      <button onclick="selecionarSub('A2')">📖 Página Livre</button>

      <button onclick="logout()">Sair</button>
    </div>
  `;
}

// 🚀 DASHBOARD
function telaDashboard() {
  const sub = localStorage.getItem("sub");

  app.innerHTML = `
    <div class="login-box">
      <h2>Dashboard do Sub</h2>

      <p><strong>Sub atual:</strong> ${subs[sub].nome}</p>

      <button onclick="alert('Membros em breve')">👥 Membros</button>
      <button onclick="alert('Obras em breve')">📚 Obras</button>
      <button onclick="alert('Verificações em breve')">📜 Verificações</button>

      <br><br>

      <button onclick="trocarSub()">🔁 Trocar Sub</button>
      <button onclick="logout()">Sair</button>
    </div>
  `;
}

// 🔓 LOGIN
function login() {
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  if (!email || !senha) {
    alert("Preencha e-mail e senha.");
    return;
  }

  localStorage.setItem("logado", "true");
  location.reload();
}

// 🔒 LOGOUT
function logout() {
  localStorage.clear();
  location.reload();
}

// 🔁 TROCAR SUB
function trocarSub() {
  localStorage.removeItem("sub");
  location.reload();
}

// 🎯 ESCOLHER SUB
function selecionarSub(sub) {
  localStorage.setItem("sub", sub);
  location.reload();
}

// 🎨 TEMA
function aplicarTema() {
  const subSelecionado = localStorage.getItem("sub");
  const titulo = document.getElementById("titulo-sub");

  if (!subSelecionado || !subs[subSelecionado] || !titulo) return;

  const tema = subs[subSelecionado];

  titulo.textContent = tema.nome;
  document.querySelector("header").style.borderBottomColor = tema.cor;

  document.querySelectorAll("button").forEach(btn => {
    btn.style.background = tema.cor;
  });
}

carregarComponentes();
