const subs = {
  A6: { nome: "👑 Trono de Papel", cor: "#6B21A8" },
  A1: { nome: "🔥 Chama Eterna", cor: "#b91c1c" },
  A2: { nome: "📖 Página Livre", cor: "#0ea5e9" }
};

const diasSemana = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"];

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

  if (!logado) {
    telaLogin();
  } else if (!sub) {
    telaSubs();
  } else {
    telaDashboard();
  }

  aplicarTema();
}

function telaLogin() {
  app.innerHTML = `
    <div class="login-box">
      <h2>Verificação Lunar</h2>
      <p>Login do ADM</p>

      <input id="email" placeholder="E-mail">
      <input id="senha" type="password" placeholder="Senha">

      <button onclick="login()">Entrar</button>
    </div>
  `;

  aplicarTema();
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

  aplicarTema();
}

function telaDashboard() {
  const sub = localStorage.getItem("sub");

  app.innerHTML = `
    <div class="login-box">
      <h2>${subs[sub].nome}</h2>
      <p>Escolha uma área para gerenciar.</p>

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

/* =========================
   MEMBROS
========================= */

function telaMembros() {
  const sub = localStorage.getItem("sub");
  const membros = JSON.parse(localStorage.getItem("membros_" + sub)) || [];

  let lista = "";

  if (membros.length === 0) {
    lista = `
      <p class="empty-message">Nenhum membro cadastrado ainda.</p>
    `;
  } else {
    lista = membros.map((membro, index) => `
      <div class="item-card">
        <div>
          <strong>${membro.nome}</strong>
          <span>${membro.user}</span>
        </div>

        <div class="item-actions">
          <button onclick="editarMembro(${index})">Editar</button>
          <button onclick="removerMembro(${index})">Excluir</button>
        </div>
      </div>
    `).join("");
  }

  app.innerHTML = `
    <div class="page-box">
      <div class="page-header">
        <div>
          <h2>Membros</h2>
          <p>Gerencie os membros cadastrados neste sub.</p>
        </div>

        <button onclick="formMembro()">+ Novo Membro</button>
      </div>

      <div class="list-area">
        ${lista}
      </div>

      <button onclick="telaDashboard()">⬅ Voltar</button>
    </div>
  `;

  aplicarTema();
}

function formMembro(index = null) {
  const sub = localStorage.getItem("sub");
  const membros = JSON.parse(localStorage.getItem("membros_" + sub)) || [];

  const editando = index !== null;
  const membro = editando ? membros[index] : { nome: "", user: "" };

  app.innerHTML = `
    <div class="page-box form-box">
      <h2>${editando ? "Editar Membro" : "Cadastrar Membro"}</h2>

      <label>Nome</label>
      <input id="nomeMembro" placeholder="Nome do membro" value="${membro.nome}">

      <label>User</label>
      <input id="userMembro" placeholder="@user" value="${membro.user}">

      <button onclick="${editando ? `salvarEdicaoMembro(${index})` : "adicionarMembro()"}">
        ${editando ? "Salvar Alterações" : "Cadastrar Membro"}
      </button>

      <button onclick="telaMembros()">⬅ Voltar</button>
    </div>
  `;

  aplicarTema();
}

function adicionarMembro() {
  const sub = localStorage.getItem("sub");

  const nome = document.getElementById("nomeMembro").value.trim();
  const user = document.getElementById("userMembro").value.trim();

  if (!nome || !user) {
    alert("Preencha nome e user.");
    return;
  }

  let membros = JSON.parse(localStorage.getItem("membros_" + sub)) || [];

  membros.push({ nome, user });

  localStorage.setItem("membros_" + sub, JSON.stringify(membros));

  telaMembros();
}

function editarMembro(index) {
  formMembro(index);
}

function salvarEdicaoMembro(index) {
  const sub = localStorage.getItem("sub");

  const nome = document.getElementById("nomeMembro").value.trim();
  const user = document.getElementById("userMembro").value.trim();

  if (!nome || !user) {
    alert("Preencha nome e user.");
    return;
  }

  let membros = JSON.parse(localStorage.getItem("membros_" + sub)) || [];

  membros[index] = { nome, user };

  localStorage.setItem("membros_" + sub, JSON.stringify(membros));

  telaMembros();
}

function removerMembro(index) {
  const confirmar = confirm("Tem certeza que deseja excluir este membro?");

  if (!confirmar) return;

  const sub = localStorage.getItem("sub");

  let membros = JSON.parse(localStorage.getItem("membros_" + sub)) || [];
  let obras = JSON.parse(localStorage.getItem("obras_" + sub)) || [];

  membros.splice(index, 1);

  obras = obras.filter(obra => obra.membroIndex !== index);
  obras = obras.map(obra => {
    if (obra.membroIndex > index) {
      return {
        ...obra,
        membroIndex: obra.membroIndex - 1
      };
    }

    return obra;
  });

  localStorage.setItem("membros_" + sub, JSON.stringify(membros));
  localStorage.setItem("obras_" + sub, JSON.stringify(obras));

  telaMembros();
}

/* =========================
   OBRAS
========================= */

function telaObras() {
  const sub = localStorage.getItem("sub");
  const membros = JSON.parse(localStorage.getItem("membros_" + sub)) || [];
  const obras = JSON.parse(localStorage.getItem("obras_" + sub)) || [];

  let lista = "";

  if (obras.length === 0) {
    lista = `
      <p class="empty-message">Nenhuma obra cadastrada ainda.</p>
    `;
  } else {
    lista = obras.map((obra, index) => {
      const membro = membros[obra.membroIndex];

      return `
        <div class="item-card">
          <div>
            <strong>${obra.titulo}</strong>
            <span>Responsável: ${membro ? `${membro.nome} (${membro.user})` : "Membro removido"}</span>
          </div>

          <div class="item-actions">
            <button onclick="editarObra(${index})">Editar</button>
            <button onclick="removerObra(${index})">Excluir</button>
          </div>
        </div>
      `;
    }).join("");
  }

  app.innerHTML = `
    <div class="page-box">
      <div class="page-header">
        <div>
          <h2>Obras</h2>
          <p>Gerencie as obras vinculadas aos membros deste sub.</p>
        </div>

        <button onclick="formObra()">+ Nova Obra</button>
      </div>

      <div class="list-area">
        ${lista}
      </div>

      <button onclick="telaDashboard()">⬅ Voltar</button>
    </div>
  `;

  aplicarTema();
}

function formObra(index = null) {
  const sub = localStorage.getItem("sub");

  const membros = JSON.parse(localStorage.getItem("membros_" + sub)) || [];
  const obras = JSON.parse(localStorage.getItem("obras_" + sub)) || [];

  if (membros.length === 0) {
    app.innerHTML = `
      <div class="page-box">
        <h2>Cadastrar Obra</h2>
        <p class="empty-message">Você precisa cadastrar pelo menos um membro antes de cadastrar obras.</p>
        <button onclick="telaMembros()">Cadastrar Membro</button>
        <button onclick="telaObras()">⬅ Voltar</button>
      </div>
    `;

    aplicarTema();
    return;
  }

  const editando = index !== null;
  const obra = editando ? obras[index] : { titulo: "", membroIndex: "" };

  const opcoesMembros = membros.map((membro, i) => `
    <option value="${i}" ${Number(obra.membroIndex) === i ? "selected" : ""}>
      ${membro.nome} (${membro.user})
    </option>
  `).join("");

  app.innerHTML = `
    <div class="page-box form-box">
      <h2>${editando ? "Editar Obra" : "Cadastrar Obra"}</h2>

      <label>Título da obra</label>
      <input id="tituloObra" placeholder="Título da obra" value="${obra.titulo}">

      <label>Membro responsável</label>
      <select id="membroObra">
        <option value="">Selecione o membro</option>
        ${opcoesMembros}
      </select>

      <button onclick="${editando ? `salvarEdicaoObra(${index})` : "adicionarObra()"}">
        ${editando ? "Salvar Alterações" : "Cadastrar Obra"}
      </button>

      <button onclick="telaObras()">⬅ Voltar</button>
    </div>
  `;

  aplicarTema();
}

function adicionarObra() {
  const sub = localStorage.getItem("sub");

  const titulo = document.getElementById("tituloObra").value.trim();
  const membroIndex = document.getElementById("membroObra").value;

  if (!titulo || membroIndex === "") {
    alert("Preencha o título e selecione o membro.");
    return;
  }

  let obras = JSON.parse(localStorage.getItem("obras_" + sub)) || [];

  obras.push({
    titulo,
    membroIndex: Number(membroIndex)
  });

  localStorage.setItem("obras_" + sub, JSON.stringify(obras));

  telaObras();
}

function editarObra(index) {
  formObra(index);
}

function salvarEdicaoObra(index) {
  const sub = localStorage.getItem("sub");

  const titulo = document.getElementById("tituloObra").value.trim();
  const membroIndex = document.getElementById("membroObra").value;

  if (!titulo || membroIndex === "") {
    alert("Preencha o título e selecione o membro.");
    return;
  }

  let obras = JSON.parse(localStorage.getItem("obras_" + sub)) || [];

  obras[index] = {
    titulo,
    membroIndex: Number(membroIndex)
  };

  localStorage.setItem("obras_" + sub, JSON.stringify(obras));

  telaObras();
}

function removerObra(index) {
  const confirmar = confirm("Tem certeza que deseja excluir esta obra?");

  if (!confirmar) return;

  const sub = localStorage.getItem("sub");

  let obras = JSON.parse(localStorage.getItem("obras_" + sub)) || [];

  obras.splice(index, 1);

  localStorage.setItem("obras_" + sub, JSON.stringify(obras));

  limparObraRemovidaDaGrade(index);

  telaObras();
}

function limparObraRemovidaDaGrade(indexRemovido) {
  const sub = localStorage.getItem("sub");
  let grade = JSON.parse(localStorage.getItem("grade_" + sub)) || {};

  diasSemana.forEach(dia => {
    if (!grade[dia]) return;

    if (Number(grade[dia].obra1) === indexRemovido) {
      grade[dia].obra1 = "";
    }

    if (Number(grade[dia].obra2) === indexRemovido) {
      grade[dia].obra2 = "";
    }

    if (Number(grade[dia].obra1) > indexRemovido) {
      grade[dia].obra1 = String(Number(grade[dia].obra1) - 1);
    }

    if (Number(grade[dia].obra2) > indexRemovido) {
      grade[dia].obra2 = String(Number(grade[dia].obra2) - 1);
    }
  });

  localStorage.setItem("grade_" + sub, JSON.stringify(grade));
}

/* =========================
   GRADE SEMANAL
========================= */

function telaGrade() {
  const sub = localStorage.getItem("sub");

  const obras = JSON.parse(localStorage.getItem("obras_" + sub)) || [];
  const grade = JSON.parse(localStorage.getItem("grade_" + sub)) || {};

  if (obras.length === 0) {
    app.innerHTML = `
      <div class="page-box">
        <h2>Grade Semanal</h2>
        <p class="empty-message">Você precisa cadastrar obras antes de montar a grade semanal.</p>
        <button onclick="telaObras()">Cadastrar Obra</button>
        <button onclick="telaDashboard()">⬅ Voltar</button>
      </div>
    `;

    aplicarTema();
    return;
  }

  const opcoesObras = obras.map((obra, index) => `
    <option value="${index}">${obra.titulo}</option>
  `).join("");

  const linhas = diasSemana.map(dia => {
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
    `;
  }).join("");

  app.innerHTML = `
    <div class="page-box grade-box">
      <div class="page-header">
        <div>
          <h2>Grade Semanal</h2>
          <p>Selecione a Obra 1 e a Obra 2 de segunda a sexta.</p>
        </div>
      </div>

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

  const novaGrade = {};

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

/* =========================
   LOGIN E CONTROLE
========================= */

function login() {
  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value.trim();

  if (!email || !senha) {
    alert("Preencha e-mail e senha.");
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

/* =========================
   TEMA
========================= */

function aplicarTema() {
  const sub = localStorage.getItem("sub");
  const titulo = document.getElementById("titulo-sub");

  if (!sub || !subs[sub] || !titulo) return;

  titulo.textContent = subs[sub].nome;

  const cor = subs[sub].cor;

  document.querySelector("header").style.borderBottomColor = cor;
  document.querySelector("footer").style.borderTopColor = cor;

  document.querySelectorAll("button").forEach(btn => {
    btn.style.background = cor;
  });
}

carregarComponentes();
