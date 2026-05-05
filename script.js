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
      <button onclick="telaGrade()">📅 Grade Semanal</button>
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

function telaObras() {
  const sub = localStorage.getItem("sub");
  const membros = JSON.parse(localStorage.getItem("membros_" + sub)) || [];
  const obras = JSON.parse(localStorage.getItem("obras_" + sub)) || [];

  let opcoes = membros.map((m, i) => `
    <option value="${i}">${m.nome}</option>
  `).join("");

  let lista = obras.map((o, i) => `
    <li>
      ${o.titulo} (${membros[o.membroIndex]?.nome || "Membro removido"})
      <button onclick="removerObra(${i})">❌</button>
    </li>
  `).join("");

  app.innerHTML = `
    <div class="login-box">
      <h2>Obras</h2>

      <input id="tituloObra" placeholder="Título">
      <select id="membroObra">
        <option value="">Selecione o membro</option>
        ${opcoes}
      </select>

      <button onclick="adicionarObra()">Adicionar</button>

      <ul style="text-align:left;">
        ${lista}
      </ul>

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

function telaGrade() {
  const sub = localStorage.getItem("sub");
  const obras = JSON.parse(localStorage.getItem("obras_" + sub)) || [];
  const grade = JSON.parse(localStorage.getItem("grade_" + sub)) || {};

  let opcoesObras = obras.map((obra, index) => `
    <option value="${index}">${obra.titulo}</option>
  `).join("");

  let linhas = diasSemana.map(dia => {
    const obra1 = grade[dia]?.obra1 ?? "";
    const obra2 = grade[dia]?.obra2 ?? "";

    return `
      <div class="linha-grade">
        <label class="dia-grade">${dia}</label>

        <select id="${dia}_obra1">
          <option value="">Obra 1</option>
          ${opcoesObras}
        </select>

        <select id="${dia}_obra2">
          <option value="">Obra 2</option>
          ${opcoesObras}
        </select>
      </div>

      <script>
        document.getElementById("${dia}_obra1").value = "${obra1}";
        document.getElementById("${dia}_obra2").value = "${obra2}";
      </script>
    `;
  }).join("");

  app.innerHTML = `
    <div class="login-box grade-box">
      <h2>Grade Semanal</h2>
      <p>Selecione as duas obras de cada dia.</p>

      ${linhas}

      <button onclick="salvarGrade()">Salvar Grade</button>
      <button onclick="telaDashboard()">⬅ Voltar</button>
    </div>
  `;

  diasSemana.forEach(dia => {
    if (grade[dia]) {
      document.getElementById(`${dia}_obra1`).value = grade[dia].obra1 ?? "";
      document.getElementById(`${dia}_obra2`).value = grade[dia].obra2 ?? "";
    }
  });

  aplicarTema();
}

function salvarGrade() {
  const sub = localStorage.getItem("sub");

  let novaGrade = {};

  diasSemana.forEach(dia => {
    novaGrade[dia] = {
      obra1: document.getElementById(`${dia}_obra1`).value,
      obra2: document.getElementById(`${dia}_obra2`).value
    };
  });

  localStorage.setItem("grade_" + sub, JSON.stringify(novaGrade));

  alert("Grade salva com sucesso!");
  telaDashboard();
}

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
