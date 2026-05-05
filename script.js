function carregarComponente(id, arquivo, callback) {
  fetch(arquivo)
    .then(res => res.text())
    .then(data => {
      document.getElementById(id).innerHTML = data;
      if (callback) callback();
    });
}

// 🌙 CONFIG DOS SUBS
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

// CARREGAR HEADER COM CONFIG
carregarComponente("header", "header.html", aplicarTema);
carregarComponente("footer", "footer.html");

const app = document.getElementById("app");

// 🔐 LOGIN
const usuarioLogado = localStorage.getItem("logado");

// 🎨 APLICAR TEMA
function aplicarTema() {
  const sub = localStorage.getItem("sub");

  if (sub && subs[sub]) {
    const config = subs[sub];

    document.getElementById("titulo-sub").innerText = config.nome;

    document.querySelector("header").style.borderBottom =
      "2px solid " + config.cor;

    document.querySelector("button")?.style.background = config.cor;
  }
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

// 🌙 SUBS
function telaSubs() {
  app.innerHTML = `
    <div class="login-box">
      <h2>Escolher Sub</h2>

      <button onclick="selecionarSub('A6')">👑 Trono de Papel</button>
      <button onclick="selecionarSub('A1')">🔥 Chama Eterna</button>
      <button onclick="selecionarSub('A2')">📖 Página Livre</button>

      <br><br>
      <button onclick="logout()">Sair</button>
    </div>
  `;
}

// 🔓 LOGIN
function login() {
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  if (email && senha) {
    localStorage.setItem("logado", "true");
    location.reload();
  } else {
    alert("Preencha os campos");
  }
}

// 🔒 LOGOUT
function logout() {
  localStorage.removeItem("logado");
  localStorage.removeItem("sub");
  location.reload();
}

// 🎯 ESCOLHER SUB
function selecionarSub(sub) {
  localStorage.setItem("sub", sub);
  location.reload();
}

// 🔁 CONTROLE
if (usuarioLogado) {
  telaSubs();
} else {
  telaLogin();
}
