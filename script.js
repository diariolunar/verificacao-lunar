const subs = {
  A6: { nome: "👑 Trono de Papel", cor: "#6B21A8" },
  A1: { nome: "🔥 Chama Eterna", cor: "#b91c1c" },
  A2: { nome: "📖 Página Livre", cor: "#0ea5e9" }
};

const diasSemana = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];

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

// LOGIN
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

// SUBS
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

// DASHBOARD
function telaDashboard() {
  const sub = localStorage.getItem("sub");

  app.innerHTML = `
    <div class="login-box">
      <h2>${subs[sub].nome}</h2>

      <button onclick="telaMembros()">👥 Membros</button>
      <button onclick="telaObras()">📚 Obras</button>
      <button onclick="telaGrade()">📅 Grade Semanal</button>
      <button onclick="alert('Em breve')">📜 Verificações</button>

      <br><br>

      <button onclick="trocarSub()">🔁 Trocar Sub</button>
      <button onclick="logout()">Sair</button>
    </div>
  `;

  aplicarTema();
}

// MEMBROS
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

      <ul style="text-align:left;">
        ${lista}
      </ul>

      <button onclick="telaDashboard()">⬅ Voltar</button>
    </div>
  `;

  aplicarTema();
}

function adicionarMembro() {
  const sub = localStorage.getItem("sub");
  const nome = document.getElementById("nome").value;
  const user = document.getElementById("user").value;

  if (!nome || !user) return alert("Preencha tudo");

  let membros = JSON.parse(localStorage.getItem("membros_" + sub)) || [];
  membros.push({ nome, user });

  localStorage.setItem("membros_" + sub, JSON.stringify(membros));
  telaMembros();
}

function removerMembro(i) {
  const sub = localStorage.getItem("sub");
  let membros = JSON.parse(localStorage.getItem("membros_" + sub)) || [];

  membros.splice(i, 1);
  localStorage.setItem("membros_" + sub, JSON.stringify(membros));

  telaMembros();
}

// OBRAS
function telaObras() {
  const sub = localStorage.getItem("sub");
  const membros = JSON.parse(localStorage.getItem("membros_" + sub)) || [];
  const obras = JSON.parse(localStorage.getItem("obras_" + sub)) || [];

  let opcoes = membros.map((m, i) => `
    <option value="${i}">${m.nome}</option>
  `).join("");

  let lista = obras.map((o, i) => `
    <li>
      ${o.titulo} (${membros[o.membroIndex]?.nome})
      <button onclick="removerObra(${i})">❌</button>
    </li>
  `).join("");

  app.innerHTML = `
    <div class="login-box">
      <h2>Obras</h2>

      <input id="tituloObra" placeholder="Título">
      <select id="membroObra">
        <option value="">Selecione</option>
        ${opcoes}
      </select>

      <button onclick="adicionarObra()">Adicionar</button>

      <ul>${lista}</ul>

      <button onclick="telaDashboard()">⬅ Voltar</button>
    </div>
  `;

  aplicarTema();
}

function adicionarObra() {
  const sub = localStorage.getItem("sub");
  const titulo = document.getElementById("tituloObra").value;
  const membroIndex = document.getElementById("membroObra").value;

  if (!titulo || membroIndex === "") return alert("Preencha tudo");

  let obras = JSON.parse(localStorage.getItem("obras_" + sub)) || [];
  obras.push({ titulo, membroIndex: Number(membroIndex) });

  localStorage.setItem("obras_" + sub, JSON.stringify(obras));
  telaObras();
}

function removerObra(i) {
  const sub = localStorage.getItem("sub");
  let obras = JSON.parse(localStorage.getItem("obras_" + sub)) || [];

  obras.splice(i, 1);
  localStorage.setItem("obras_" + sub, JSON.stringify(obras));

  telaObras();
}

// 📅 GRADE SEMANAL
function telaGrade() {
  const sub = localStorage.getItem("sub");
  const obras = JSON.parse(localStorage.getItem("obras_" + sub)) || [];
  const grade = JSON.parse(localStorage.getItem("grade_" + sub)) || {};

  let html = diasSemana.map(dia => {
    let selecionadas = grade[dia] || [];

    let opcoes = obras.map((o, i) => {
      const checked = selecionadas.includes(i) ? "checked" : "";
      return `
        <label>
          <input type="checkbox" value="${i}" ${checked}>
          ${o.titulo}
        </label><br>
      `;
    }).join("");

    return `
      <div style="margin-bottom:10px;">
        <strong>${dia}</strong><br>
        ${opcoes}
      </div>
    `;
  }).join("");

  app.innerHTML = `
    <div class="login-box" style="max-height:80vh; overflow:auto;">
      <h2>Grade Semanal</h2>

      ${html}

      <button onclick="salvarGrade()">Salvar Grade</button>

      <br><br>
      <button onclick="telaDashboard()">⬅ Voltar</button>
    </div>
  `;

  aplicarTema();
}

function salvarGrade() {
  const sub = localStorage.getItem("sub");
  let novaGrade = {};

  diasSemana.forEach(dia => {
    const checkboxes = [...document.querySelectorAll(`strong:contains('${dia}')`)];
  });

  const blocos = document.querySelectorAll(".login-box div");

  blocos.forEach((bloco, index) => {
    const dia = diasSemana[index];
    const checks = bloco.querySelectorAll("input:checked");

    novaGrade[dia] = [...checks].map(c => Number(c.value));
  });

  localStorage.setItem("grade_" + sub, JSON.stringify(novaGrade));

  alert("Grade salva!");
}

// LOGIN / CONTROLE
function login() {
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  if (!email || !senha) return alert("Preencha tudo");

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

// TEMA
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
