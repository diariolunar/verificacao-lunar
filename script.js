function carregarComponente(id, arquivo) {
  fetch(arquivo)
    .then(res => res.text())
    .then(data => {
      document.getElementById(id).innerHTML = data;
    });
}

carregarComponente("header", "header.html");
carregarComponente("footer", "footer.html");

const app = document.getElementById("app");

// 🔐 VERIFICAR LOGIN
const usuarioLogado = localStorage.getItem("logado");

// 🧱 TELA DE LOGIN
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

// 🌙 TELA DE SELEÇÃO DE SUB
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

// 🔓 LOGIN SIMPLES (TEMPORÁRIO)
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
  location.reload();
}

// 🎯 ESCOLHER SUB
function selecionarSub(sub) {
  localStorage.setItem("sub", sub);
  alert("Você entrou no sub " + sub);
}

// 🔁 CONTROLE DE TELA
if (usuarioLogado) {
  telaSubs();
} else {
  telaLogin();
}
