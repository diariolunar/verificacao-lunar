const subs = {
  A6: { nome: "👑 Trono de Papel", cor: "#6B21A8" },
  A1: { nome: "🔥 Chama Eterna", cor: "#b91c1c" },
  A2: { nome: "📖 Página Livre", cor: "#0ea5e9" }
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
  const logado = localStorage.getItem("logado");
  const sub = localStorage.getItem("sub");

  if (!logado) telaLogin();
  else if (!sub) telaSubs();
  else telaDashboard();

  aplicarTema();
}

function telaLogin() {
  app.innerHTML = `
    <div class="login-box">
      <h2>Verificação Lunar</h2>
      <input id="email" placeholder="E-mail">
      <input id="senha" type="password" placeholder="Senha">
      <button onclick="login()">Entrar</button>
    </div>
  `;
}

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

function telaDashboard() {
  const sub = localStorage.getItem("sub");

  app.innerHTML = `
    <div class="login-box">
      <h2>${subs[sub].nome}</h2>

      <button onclick="telaMembros()">👥 Membros</button>
      <button onclick="telaObras()">📚 Obras</button>
      <button onclick="alert('Em breve')">📜 Verificações</button>

      <br><br>

      <button onclick="trocarSub()">🔁 Trocar Sub</button>
      <button onclick="logout()">Sair</button>
    </div>
  `;

  aplicarTema();
}

function telaMembros() {
  const sub = localStorage.getItem("sub");
  const membros = JSON.parse(localStorage.getItem("membros_" + sub)) || [];

  let lista = membros.map((m, i) => `
    <li>
      ${m.nome} (${m.user})
      <button onclick="removerMembro(${i})">❌</button>
    </li>
  `).join("");

  app.innerHTML = `
    <div class="login-box">
      <h2>Membros</h2>

      <input id="nome" placeholder="Nome">
      <input id="user" placeholder="@user">

      <button onclick="adicionarMembro()">Adicionar</button>

      <ul style="text-align:left; margin-top:10px;">
        ${lista}
      </ul>

      <br>
      <button onclick="telaDashboard()">⬅ Voltar</button>
    </div>
  `;

  aplicarTema();
}

function adicionarMembro() {
  const sub = localStorage.getItem("sub");
  const nome = document.getElementById("nome").value;
  const user = document.getElementById("user").value;

  if (!nome || !user) {
    alert("Preencha tudo");
    return;
  }

  let membros = JSON.parse(localStorage.getItem("membros_" + sub)) || [];
  membros.push({ nome, user });

  localStorage.setItem("membros_" + sub, JSON.stringify(membros));
  telaMembros();
}

function removerMembro(index) {
  const sub = localStorage.getItem("sub");
  let membros = JSON.parse(localStorage.getItem("membros_" + sub)) || [];

  membros.splice(index, 1);

  localStorage.setItem("membros_" + sub, JSON.stringify(membros));
  telaMembros();
}

function telaObras() {
  const sub = localStorage.getItem("sub");
  const membros = JSON.parse(localStorage.getItem("membros_" + sub)) || [];
  const obras = JSON.parse(localStorage.getItem("obras_" + sub)) || [];

  let opcoesMembros = membros.map((m, i) => `
    <option value="${i}">${m.nome} (${m.user})</option>
  `).join("");

  let listaObras = obras.map((obra, i) => {
    const membro = membros[obra.membroIndex];

    return `
      <li>
        <strong>${obra.titulo}</strong><br>
        Responsável: ${membro ? membro.nome : "Membro removido"}<br>
        Status: ${obra.status}
        <button onclick="removerObra(${i})">❌</button>
      </li>
      <br>
    `;
  }).join("");

  app.innerHTML = `
    <div class="login-box">
      <h2>Obras</h2>

      <input id="tituloObra" placeholder="Título da obra">

      <select id="membroObra">
        <option value="">Selecione o membro</option>
        ${opcoesMembros}
      </select>

      <select id="statusObra">
        <option value="Ativa">Ativa</option>
        <option value="Sem obra">Sem obra</option>
        <option value="Pausada">Pausada</option>
        <option value="Finalizada">Finalizada</option>
      </select>

      <button onclick="adicionarObra()">Adicionar Obra</button>

      <ul style="text-align:left; margin-top:10px;">
        ${listaObras}
      </ul>

      <br>
      <button onclick="telaDashboard()">⬅ Voltar</button>
    </div>
  `;

  aplicarTema();
}

function adicionarObra() {
  const sub = localStorage.getItem("sub");

  const titulo = document.getElementById("tituloObra").value;
  const membroIndex = document.getElementById("membroObra").value;
  const status = document.getElementById("statusObra").value;

  if (!titulo || membroIndex === "") {
    alert("Preencha o título e selecione o membro.");
    return;
  }

  let obras = JSON.parse(localStorage.getItem("obras_" + sub)) || [];

  obras.push({
    titulo,
    membroIndex: Number(membroIndex),
    status
  });

  localStorage.setItem("obras_" + sub, JSON.stringify(obras));

  telaObras();
}

function removerObra(index) {
  const sub = localStorage.getItem("sub");
  let obras = JSON.parse(localStorage.getItem("obras_" + sub)) || [];

  obras.splice(index, 1);

  localStorage.setItem("obras_" + sub, JSON.stringify(obras));

  telaObras();
}

function login() {
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  if (!email || !senha) {
    alert("Preencha os campos");
    return;
  }

  localStorage.setItem("logado", "true");
  location.reload();
}

function logout() {
  localStorage.clear();
  location.reload();
}

function trocarSub() {
  localStorage.removeItem("sub");
  location.reload();
}

function selecionarSub(sub) {
  localStorage.setItem("sub", sub);
  location.reload();
}

function aplicarTema() {
  const sub = localStorage.getItem("sub");
  const titulo = document.getElementById("titulo-sub");

  if (!sub || !subs[sub] || !titulo) return;

  titulo.textContent = subs[sub].nome;
  document.querySelector("header").style.borderBottomColor = subs[sub].cor;

  document.querySelectorAll("button").forEach(btn => {
    btn.style.background = subs[sub].cor;
  });
}

carregarComponentes();
