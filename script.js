const subs = {
  A6: {
    nome: "👑 Trono de Papel",
    cor: "#6B21A8",
    tituloFicha: "👑 𝐓𝐑𝐎𝐍𝐎 𝐃𝐄 𝐏𝐀𝐏𝐄𝐋 👑 𝐀-𝟔",
    modeloFicha: "trono"
  },
  A1: {
    nome: "🔥 Chama Eterna",
    cor: "#b91c1c",
    tituloFicha: "🔥 𝐂𝐇𝐀𝐌𝐀 𝐄𝐓𝐄𝐑𝐍𝐀 🔥 𝐀-𝟏",
    modeloFicha: "chama"
  },
  A2: {
    nome: "📖 Página Livre",
    cor: "#0ea5e9",
    tituloFicha: "📖 𝐏𝐀́𝐆𝐈𝐍𝐀 𝐋𝐈𝐕𝐑𝐄 📖 𝐀-𝟐",
    modeloFicha: "pagina"
  }
};

const diasSemana = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"];

const statusLeitura = [
  { emoji: "", texto: "Selecione" },
  { emoji: "🌙", texto: "Leu" },
  { emoji: "☠", texto: "Não leu" },
  { emoji: "💅", texto: "Justificado" },
  { emoji: "🌼", texto: "Já havia lido antes" },
  { emoji: "🙍", texto: "Falta algo" },
  { emoji: "✨", texto: "Obra do dia" },
  { emoji: "⏳", texto: "Sem obra" },
  { emoji: "⚰", texto: "Saiu do grupo" },
  { emoji: "🧕🏻", texto: "Leitura em andamento" },
  { emoji: "⚠", texto: "Infração das regras" },
  { emoji: "🚫", texto: "Infração no tempo de leitura" },
  { emoji: "📲", texto: "Prints no pv" },
  { emoji: "⛔", texto: "Removido por infração" },
  { emoji: "⏰", texto: "Leitura feita em tempo estimado" }
];

const statusQueCompletamLeitura = ["🌙", "✨"];

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

/* =========================
   LOGIN / SUBS / DASHBOARD
========================= */

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
    <div class="login-box dashboard-box">
      <h2>${subs[sub].nome}</h2>
      <p>Escolha uma área para gerenciar.</p>

      <button onclick="telaMembros()">👥 Membros</button>
      <button onclick="telaObras()">📚 Obras</button>
      <button onclick="telaGrade()">📅 Grade Semanal</button>
      <button onclick="telaVerificacoes()">📜 Verificações</button>
      <button onclick="telaVisualizarFicha()">👁 Visualizar Ficha</button>

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
    lista = `<p class="empty-message">Nenhum membro cadastrado ainda.</p>`;
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
    lista = `<p class="empty-message">Nenhuma obra cadastrada ainda.</p>`;
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
   VERIFICAÇÕES
========================= */

function telaVerificacoes(diaSelecionado = "Segunda") {
  const sub = localStorage.getItem("sub");

  const membros = JSON.parse(localStorage.getItem("membros_" + sub)) || [];
  const obras = JSON.parse(localStorage.getItem("obras_" + sub)) || [];
  const grade = JSON.parse(localStorage.getItem("grade_" + sub)) || {};
  const verificacoes = JSON.parse(localStorage.getItem("verificacoes_" + sub)) || {};

  if (membros.length === 0) {
    app.innerHTML = `
      <div class="page-box">
        <h2>Verificações</h2>
        <p class="empty-message">Você precisa cadastrar membros antes de fazer verificações.</p>
        <button onclick="telaMembros()">Cadastrar Membro</button>
        <button onclick="telaDashboard()">⬅ Voltar</button>
      </div>
    `;

    aplicarTema();
    return;
  }

  if (obras.length === 0) {
    app.innerHTML = `
      <div class="page-box">
        <h2>Verificações</h2>
        <p class="empty-message">Você precisa cadastrar obras antes de fazer verificações.</p>
        <button onclick="telaObras()">Cadastrar Obra</button>
        <button onclick="telaDashboard()">⬅ Voltar</button>
      </div>
    `;

    aplicarTema();
    return;
  }

  const dadosDia = grade[diaSelecionado];

  if (!dadosDia || dadosDia.obra1 === "" || dadosDia.obra2 === "") {
    app.innerHTML = `
      <div class="page-box">
        <h2>Verificações</h2>

        <label>Dia da semana</label>
        <select id="diaVerificacao" onchange="telaVerificacoes(this.value)">
          ${diasSemana.map(dia => `
            <option value="${dia}" ${dia === diaSelecionado ? "selected" : ""}>${dia}</option>
          `).join("")}
        </select>

        <p class="empty-message">A grade deste dia ainda não está completa. Selecione Obra 1 e Obra 2 na grade semanal.</p>

        <button onclick="telaGrade()">Montar Grade</button>
        <button onclick="telaDashboard()">⬅ Voltar</button>
      </div>
    `;

    aplicarTema();
    return;
  }

  const obra1 = obras[Number(dadosDia.obra1)];
  const obra2 = obras[Number(dadosDia.obra2)];

  const verificacaoDia = verificacoes[diaSelecionado] || {};

  const linhasMembros = membros.map((membro, index) => {
    const dadosMembro = verificacaoDia[index] || {
      obra1Status: "",
      obra1Feedback: false,
      obra2Status: "",
      obra2Feedback: false,
      pontos: 0
    };

    const pontosAcumulados = calcularPontosAcumulados(index);

    return `
      <div class="verificacao-card">
        <div class="verificacao-topo">
          <div>
            <strong>${membro.nome}</strong>
            <span>${membro.user}</span>
          </div>

          <div class="pontos-duplo">
            <div class="pontos-box">
              <small>Hoje</small>
              <strong id="pontos_membro_${index}">${dadosMembro.pontos || 0}</strong>
            </div>

            <div class="pontos-box">
              <small>Semana</small>
              <strong>${pontosAcumulados}</strong>
            </div>
          </div>
        </div>

        <div class="verificacao-grid">
          <div class="obra-verificacao">
            <h3>Obra 1</h3>
            <p>${obra1 ? obra1.titulo : "Obra não encontrada"}</p>

            <label>Status da leitura</label>
            <select id="membro_${index}_obra1Status" onchange="atualizarPontosTela(${index})">
              ${gerarOpcoesStatus(dadosMembro.obra1Status)}
            </select>

            <label class="checkbox-label">
              <input 
                type="checkbox" 
                id="membro_${index}_obra1Feedback"
                onchange="atualizarPontosTela(${index})"
                ${dadosMembro.obra1Feedback ? "checked" : ""}
              >
              Feedback entregue (+20)
            </label>

            <small id="aviso_${index}_obra1" class="feedback-aviso"></small>
          </div>

          <div class="obra-verificacao">
            <h3>Obra 2</h3>
            <p>${obra2 ? obra2.titulo : "Obra não encontrada"}</p>

            <label>Status da leitura</label>
            <select id="membro_${index}_obra2Status" onchange="atualizarPontosTela(${index})">
              ${gerarOpcoesStatus(dadosMembro.obra2Status)}
            </select>

            <label class="checkbox-label">
              <input 
                type="checkbox" 
                id="membro_${index}_obra2Feedback"
                onchange="atualizarPontosTela(${index})"
                ${dadosMembro.obra2Feedback ? "checked" : ""}
              >
              Feedback entregue (+20)
            </label>

            <small id="aviso_${index}_obra2" class="feedback-aviso"></small>
          </div>
        </div>
      </div>
    `;
  }).join("");

  app.innerHTML = `
    <div class="page-box verificacao-box">
      <div class="page-header">
        <div>
          <h2>Verificações</h2>
          <p>Marque o resultado da leitura e a entrega dos feedbacks.</p>
        </div>
      </div>

      <div class="controle-verificacao">
        <label>Dia da semana</label>
        <select id="diaVerificacao" onchange="telaVerificacoes(this.value)">
          ${diasSemana.map(dia => `
            <option value="${dia}" ${dia === diaSelecionado ? "selected" : ""}>${dia}</option>
          `).join("")}
        </select>
      </div>

      <div class="resumo-obras">
        <div>
          <strong>Obra 1</strong>
          <span>${obra1 ? obra1.titulo : "Obra não encontrada"}</span>
        </div>

        <div>
          <strong>Obra 2</strong>
          <span>${obra2 ? obra2.titulo : "Obra não encontrada"}</span>
        </div>
      </div>

      <div class="list-area">
        ${linhasMembros}
      </div>

      <button onclick="salvarVerificacao('${diaSelecionado}')">Salvar Verificação</button>
      <button onclick="telaVisualizarFicha()">👁 Visualizar Ficha</button>
      <button onclick="telaDashboard()">⬅ Voltar</button>
    </div>
  `;

  membros.forEach((_, index) => atualizarPontosTela(index));

  aplicarTema();
}

function gerarOpcoesStatus(valorAtual) {
  return statusLeitura.map(status => `
    <option value="${status.emoji}" ${status.emoji === valorAtual ? "selected" : ""}>
      ${status.emoji ? status.emoji + " " : ""}${status.texto}
    </option>
  `).join("");
}

function calcularPontos(obra1Status, obra1Feedback, obra2Status, obra2Feedback) {
  let pontos = 0;

  const obra1Completa = statusQueCompletamLeitura.includes(obra1Status);
  const obra2Completa = statusQueCompletamLeitura.includes(obra2Status);

  if (!obra1Completa || !obra2Completa) {
    return 0;
  }

  pontos += 10;

  if (obra1Status === "🌙" && obra1Feedback) {
    pontos += 20;
  }

  if (obra2Status === "🌙" && obra2Feedback) {
    pontos += 20;
  }

  return pontos;
}

function atualizarPontosTela(index) {
  const obra1Status = document.getElementById(`membro_${index}_obra1Status`)?.value || "";
  const obra2Status = document.getElementById(`membro_${index}_obra2Status`)?.value || "";

  const obra1FeedbackCampo = document.getElementById(`membro_${index}_obra1Feedback`);
  const obra2FeedbackCampo = document.getElementById(`membro_${index}_obra2Feedback`);

  const avisoObra1 = document.getElementById(`aviso_${index}_obra1`);
  const avisoObra2 = document.getElementById(`aviso_${index}_obra2`);

  const obra1Completa = statusQueCompletamLeitura.includes(obra1Status);
  const obra2Completa = statusQueCompletamLeitura.includes(obra2Status);

  const leituraCompleta = obra1Completa && obra2Completa;

  if (!leituraCompleta) {
    if (obra1FeedbackCampo) {
      obra1FeedbackCampo.checked = false;
      obra1FeedbackCampo.disabled = true;
    }

    if (obra2FeedbackCampo) {
      obra2FeedbackCampo.checked = false;
      obra2FeedbackCampo.disabled = true;
    }

    if (avisoObra1) {
      avisoObra1.textContent = "Feedback só conta se as duas leituras do dia estiverem completas.";
    }

    if (avisoObra2) {
      avisoObra2.textContent = "Feedback só conta se as duas leituras do dia estiverem completas.";
    }
  } else {
    if (obra1FeedbackCampo) {
      if (obra1Status === "🌙") {
        obra1FeedbackCampo.disabled = false;

        if (avisoObra1) {
          avisoObra1.textContent = "";
        }
      } else {
        obra1FeedbackCampo.checked = false;
        obra1FeedbackCampo.disabled = true;

        if (avisoObra1) {
          avisoObra1.textContent = "Não pode entregar feedback da própria obra.";
        }
      }
    }

    if (obra2FeedbackCampo) {
      if (obra2Status === "🌙") {
        obra2FeedbackCampo.disabled = false;

        if (avisoObra2) {
          avisoObra2.textContent = "";
        }
      } else {
        obra2FeedbackCampo.checked = false;
        obra2FeedbackCampo.disabled = true;

        if (avisoObra2) {
          avisoObra2.textContent = "Não pode entregar feedback da própria obra.";
        }
      }
    }
  }

  const obra1Feedback = obra1Status === "🌙" ? obra1FeedbackCampo?.checked || false : false;
  const obra2Feedback = obra2Status === "🌙" ? obra2FeedbackCampo?.checked || false : false;

  const pontos = calcularPontos(obra1Status, obra1Feedback, obra2Status, obra2Feedback);

  const campoPontos = document.getElementById(`pontos_membro_${index}`);

  if (campoPontos) {
    campoPontos.textContent = pontos;
  }
}

function salvarVerificacao(diaSelecionado) {
  const sub = localStorage.getItem("sub");

  const membros = JSON.parse(localStorage.getItem("membros_" + sub)) || [];
  let verificacoes = JSON.parse(localStorage.getItem("verificacoes_" + sub)) || {};

  verificacoes[diaSelecionado] = {};

  membros.forEach((membro, index) => {
    const obra1Status = document.getElementById(`membro_${index}_obra1Status`).value;
    const obra2Status = document.getElementById(`membro_${index}_obra2Status`).value;

    const obra1Completa = statusQueCompletamLeitura.includes(obra1Status);
    const obra2Completa = statusQueCompletamLeitura.includes(obra2Status);

    const leituraCompleta = obra1Completa && obra2Completa;

    const obra1Feedback = leituraCompleta && obra1Status === "🌙"
      ? document.getElementById(`membro_${index}_obra1Feedback`).checked
      : false;

    const obra2Feedback = leituraCompleta && obra2Status === "🌙"
      ? document.getElementById(`membro_${index}_obra2Feedback`).checked
      : false;

    const pontos = calcularPontos(obra1Status, obra1Feedback, obra2Status, obra2Feedback);

    verificacoes[diaSelecionado][index] = {
      nome: membro.nome,
      user: membro.user,
      obra1Status,
      obra1Feedback,
      obra2Status,
      obra2Feedback,
      pontos
    };
  });

  localStorage.setItem("verificacoes_" + sub, JSON.stringify(verificacoes));

  alert("Verificação salva com sucesso!");

  telaDashboard();
}

/* =========================
   PONTOS / DIAS / EMOJIS ACUMULADOS
========================= */

function calcularPontosAcumulados(membroIndex) {
  const sub = localStorage.getItem("sub");
  const verificacoes = JSON.parse(localStorage.getItem("verificacoes_" + sub)) || {};

  let total = 0;

  diasSemana.forEach(dia => {
    if (verificacoes[dia] && verificacoes[dia][membroIndex]) {
      total += Number(verificacoes[dia][membroIndex].pontos || 0);
    }
  });

  return total;
}

function contarDiasComVerificacao() {
  const sub = localStorage.getItem("sub");
  const verificacoes = JSON.parse(localStorage.getItem("verificacoes_" + sub)) || {};

  let total = 0;

  diasSemana.forEach(dia => {
    if (verificacoes[dia]) {
      total++;
    }
  });

  return total;
}

function obterUltimoDiaVerificado() {
  const sub = localStorage.getItem("sub");
  const verificacoes = JSON.parse(localStorage.getItem("verificacoes_" + sub)) || {};

  let ultimoDia = null;

  diasSemana.forEach(dia => {
    if (verificacoes[dia]) {
      ultimoDia = dia;
    }
  });

  return ultimoDia;
}

function gerarEmojisAcumulados(membroIndex, campoStatus) {
  const sub = localStorage.getItem("sub");
  const verificacoes = JSON.parse(localStorage.getItem("verificacoes_" + sub)) || {};

  let emojis = "";

  diasSemana.forEach(dia => {
    if (verificacoes[dia] && verificacoes[dia][membroIndex]) {
      emojis += verificacoes[dia][membroIndex][campoStatus] || "";
    }
  });

  return emojis;
}

function verificarFeedbackAcumulado(membroIndex) {
  const sub = localStorage.getItem("sub");
  const verificacoes = JSON.parse(localStorage.getItem("verificacoes_" + sub)) || {};

  let teveFeedback = false;

  diasSemana.forEach(dia => {
    if (verificacoes[dia] && verificacoes[dia][membroIndex]) {
      const dados = verificacoes[dia][membroIndex];

      if (dados.obra1Feedback || dados.obra2Feedback) {
        teveFeedback = true;
      }
    }
  });

  return teveFeedback;
}

/* =========================
   VISUALIZAR FICHA
========================= */

function telaVisualizarFicha() {
  const sub = localStorage.getItem("sub");

  const membros = JSON.parse(localStorage.getItem("membros_" + sub)) || [];
  const ultimoDia = obterUltimoDiaVerificado();

  if (membros.length === 0) {
    app.innerHTML = `
      <div class="page-box">
        <h2>Visualizar Ficha</h2>
        <p class="empty-message">Você precisa cadastrar membros antes de gerar a ficha.</p>
        <button onclick="telaMembros()">Cadastrar Membro</button>
        <button onclick="telaDashboard()">⬅ Voltar</button>
      </div>
    `;

    aplicarTema();
    return;
  }

  if (!ultimoDia) {
    app.innerHTML = `
      <div class="page-box">
        <h2>Visualizar Ficha</h2>

        <p class="empty-message">Ainda não existe nenhuma verificação salva nesta semana.</p>

        <button onclick="telaVerificacoes()">Fazer Verificação</button>
        <button onclick="telaDashboard()">⬅ Voltar</button>
      </div>
    `;

    aplicarTema();
    return;
  }

  const ficha = gerarFichaWhatsapp();

  app.innerHTML = `
    <div class="page-box ficha-box">
      <div class="page-header">
        <div>
          <h2>Visualizar Ficha</h2>
          <p>Confira a mensagem antes de enviar no WhatsApp.</p>
          <p><strong>Dias acumulados:</strong> ${contarDiasComVerificacao()}</p>
        </div>
      </div>

      <textarea id="fichaTexto" readonly></textarea>

      <button onclick="copiarFicha()">Copiar Ficha</button>
      <button onclick="enviarWhatsapp()">Enviar pelo WhatsApp</button>
      <button onclick="telaDashboard()">⬅ Voltar</button>
    </div>
  `;

  document.getElementById("fichaTexto").value = ficha;

  aplicarTema();
}

function gerarFichaWhatsapp() {
  const sub = localStorage.getItem("sub");

  const modelo = subs[sub].modeloFicha;

  if (modelo === "trono") {
    return gerarFichaTrono();
  }

  if (modelo === "chama") {
    return gerarFichaChama();
  }

  if (modelo === "pagina") {
    return gerarFichaPagina();
  }

  return gerarFichaPadrao();
}

function gerarFichaTrono() {
  return montarFichaBase();
}

function gerarFichaChama() {
  return montarFichaBase();
}

function gerarFichaPagina() {
  return montarFichaBase();
}

function gerarFichaPadrao() {
  return montarFichaBase();
}

function montarFichaBase() {
  const sub = localStorage.getItem("sub");

  const membros = JSON.parse(localStorage.getItem("membros_" + sub)) || [];
  const diasAcumulados = contarDiasComVerificacao();

  let texto = "";

  texto += `ੈ✩‧₊˚ ${subs[sub].tituloFicha} ˚₊‧✩ੈ\n`;
  texto += `━━━━━━━━━━━ ✦ ━━━━━━━━━━━\n`;
  texto += `               📜 𝐕𝐄𝐑𝐈𝐅𝐈𝐂𝐀𝐂̧𝐀̃𝐎\n`;
  texto += `━━━━━━━━━━━ ✦ ━━━━━━━━━━━\n\n`;

  texto += `🌙 𝐋𝐞𝐮\n`;
  texto += `☠ 𝐍𝐚̃𝐨 𝐥𝐞𝐮\n`;
  texto += `💅 𝐉𝐮𝐬𝐭𝐢𝐟𝐢𝐜𝐚𝐝𝐨\n`;
  texto += `🌼 𝐉𝐚́ 𝐡𝐚𝐯𝐢𝐚 𝐥𝐢𝐝𝐨 𝐚𝐧𝐭𝐞𝐬\n`;
  texto += `🙍 𝐅𝐚𝐥𝐭𝐚 𝐚𝐥𝐠𝐨 (𝐜𝐨𝐦𝐞𝐧𝐭𝐚́𝐫𝐢𝐨 𝐨𝐮 𝐯𝐨𝐭𝐨)\n`;
  texto += `✨ 𝐎𝐛𝐫𝐚 𝐝𝐨 𝐝𝐢𝐚\n`;
  texto += `⏳ 𝐒𝐞𝐦 𝐨𝐛𝐫𝐚\n`;
  texto += `⚰ 𝐒𝐚𝐢𝐮 𝐝𝐨 𝐠𝐫𝐮𝐩𝐨\n`;
  texto += `🧕🏻 𝐋𝐞𝐢𝐭𝐮𝐫𝐚 𝐞𝐦 𝐚𝐧𝐝𝐚𝐦𝐞𝐧𝐭𝐨 𝐧𝐨 𝐦𝐨𝐦𝐞𝐧𝐭𝐨 𝐝𝐚 𝐯𝐞𝐫𝐢𝐟𝐢𝐜𝐚𝐜̧𝐚̃𝐨\n`;
  texto += `⚠ 𝐈𝐧𝐟𝐫𝐚𝐜̧𝐚̃𝐨 𝐝𝐚𝐬 𝐫𝐞𝐠𝐫𝐚𝐬\n`;
  texto += `🚫 𝐈𝐧𝐟𝐫𝐚𝐜̧𝐚̃𝐨 𝐧𝐨 𝐭𝐞𝐦𝐩𝐨 𝐝𝐞 𝐥𝐞𝐢𝐭𝐮𝐫𝐚\n`;
  texto += `📲 𝐏𝐫𝐢𝐧𝐭𝐬 𝐧𝐨 𝐩𝐯\n`;
  texto += `⛔ 𝐑𝐞𝐦𝐨𝐯𝐢𝐝𝐨 𝐩𝐨𝐫 𝐢𝐧𝐟𝐫𝐚𝐜̧𝐚̃𝐨 𝐝𝐚𝐬 𝐫𝐞𝐠𝐫𝐚𝐬\n`;
  texto += `⏰ 𝐋𝐞𝐢𝐭𝐮𝐫𝐚 𝐟𝐞𝐢𝐭𝐚 𝐞𝐦 𝐭𝐞𝐦𝐩𝐨 𝐞𝐬𝐭𝐢𝐦𝐚𝐝𝐨\n\n`;

  texto += `━━━━━━━━━━━ ✦ ━━━━━━━━━━━\n`;
  texto += `           📖 𝐅𝐈𝐂𝐇𝐀 𝐃𝐎 𝐋𝐄𝐈𝐓𝐎𝐑\n`;
  texto += `━━━━━━━━━━━ ✦ ━━━━━━━━━━━\n\n`;

  membros.forEach((membro, index) => {
    const pontosAcumulados = calcularPontosAcumulados(index);

    const emojisObra1 = gerarEmojisAcumulados(index, "obra1Status");
    const emojisObra2 = gerarEmojisAcumulados(index, "obra2Status");

    const teveFeedback = verificarFeedbackAcumulado(index);
    const feedbackTexto = teveFeedback ? "✅" : "";

    texto += `━━━━━━━━━━━ ✦ ━━━━━━━━━━━\n\n`;
    texto += `👑 𝐍𝐨𝐦𝐞: ${membro.nome}\n`;
    texto += `♜ 𝐔𝐬𝐞𝐫: ${membro.user}\n\n`;

    texto += `🌙 𝐒𝐞𝐦𝐚𝐧𝐚𝐬: 0\n`;
    texto += `📅 𝐃𝐢𝐚𝐬: ${diasAcumulados}\n`;
    texto += `⭐ 𝐏𝐨𝐧𝐭𝐨𝐬: ${pontosAcumulados}\n`;
    texto += `💬 𝐅𝐞𝐞𝐝𝐛𝐚𝐜𝐤: ${feedbackTexto}\n`;
    texto += `🔮 𝐋𝐞𝐢𝐭𝐮𝐫𝐚 𝐋𝐮𝐧𝐚𝐫: \n\n`;

    texto += `📖 𝐎𝐛𝐫𝐚 𝟎𝟏: ${emojisObra1}\n`;
    texto += `📖 𝐎𝐛𝐫𝐚 𝟎𝟐: ${emojisObra2}\n\n`;

    texto += `🔮 𝐋𝐞𝐢𝐭𝐮𝐫𝐚 Extra: \n\n`;
  });

  texto += `━━━━━━━━━━━ ✦ ━━━━━━━━━━━\n\n`;

  texto += `‎🚨𝐀𝐓𝐄𝐍𝐂̧𝐀̃𝐎🚨\n`;
  texto += `‎\n`;
  texto += `‎𝐏𝐚𝐫𝐚 𝐠𝐚𝐫𝐚𝐧𝐭𝐢𝐫 𝐚 𝐨𝐫𝐠𝐚𝐧𝐢𝐳𝐚𝐜̧𝐚̃𝐨 𝐞 𝐞𝐟𝐢𝐜𝐢𝐞̂𝐧𝐜𝐢𝐚 𝐝𝐨 𝐠𝐫𝐮𝐩𝐨, 𝐞́ 𝐢𝐦𝐩𝐨𝐫𝐭𝐚𝐧𝐭𝐞 𝐪𝐮𝐞 𝐭𝐨𝐝𝐨𝐬 𝐞𝐬𝐭𝐞𝐣𝐚𝐦 𝐞𝐦 𝐝𝐢𝐚 𝐜𝐨𝐦 𝐬𝐮𝐚𝐬 𝐥𝐞𝐢𝐭𝐮𝐫𝐚𝐬. 𝐒𝐞 𝐯𝐨𝐜𝐞̂ 𝐟𝐢𝐜𝐨𝐮 𝐝𝐞𝐯𝐞𝐧𝐝𝐨 𝐥𝐞𝐢𝐭𝐮𝐫𝐚, 𝐩𝐨𝐫 𝐟𝐚𝐯𝐨𝐫, 𝐞𝐧𝐯𝐢𝐞 𝐨𝐬 𝐩𝐫𝐢𝐧𝐭𝐬 𝐧𝐨 𝐩𝐫𝐢𝐯𝐚𝐝𝐨 𝐩𝐚𝐫𝐚 𝐪𝐮𝐞 𝐞𝐮 𝐩𝐨𝐬𝐬𝐚 𝐚𝐭𝐮𝐚𝐥𝐢𝐳𝐚𝐫 𝐬𝐞𝐮𝐬 𝐫𝐞𝐠𝐢𝐬𝐭𝐫𝐨𝐬.\n`;
  texto += `‎\n`;
  texto += `‎𝐈𝐬𝐬𝐨 𝐞𝐯𝐢𝐭𝐚𝐫𝐚́ 𝐪𝐮𝐞 𝐞𝐮 𝐩𝐞𝐫𝐜𝐚 𝐭𝐞𝐦𝐩𝐨 𝐜𝐨𝐧𝐟𝐞𝐫𝐢𝐧𝐝𝐨 𝐚 𝐦𝐞𝐬𝐦𝐚 𝐜𝐨𝐢𝐬𝐚 𝐝𝐮𝐚𝐬 𝐯𝐞𝐳𝐞𝐬. 𝐀𝐥𝐞́𝐦 𝐝𝐢𝐬𝐬𝐨, 𝐬𝐞 𝐯𝐨𝐜𝐞̂ 𝐞𝐧𝐜𝐨𝐧𝐭𝐫𝐚𝐫 𝐚𝐥𝐠𝐮𝐦 𝐞𝐫𝐫𝐨 𝐧𝐚𝐬 𝐯𝐞𝐫𝐢𝐟𝐢𝐜𝐚𝐜̧𝐨̃𝐞𝐬, 𝐧𝐚̃𝐨 𝐡𝐞𝐬𝐢𝐭𝐞 𝐞𝐦 𝐦𝐞 𝐜𝐡𝐚𝐦𝐚𝐫 𝐧𝐨 𝐩𝐫𝐢𝐯𝐚𝐝𝐨. 𝐄𝐬𝐭𝐨𝐮 𝐚𝐪𝐮𝐢 𝐩𝐚𝐫𝐚 𝐚𝐣𝐮𝐝𝐚𝐫 𝐞 𝐫𝐞𝐬𝐨𝐥𝐯𝐞𝐫 𝐪𝐮𝐚𝐥𝐪𝐮𝐞𝐫 𝐩𝐫𝐨𝐛𝐥𝐞𝐦𝐚!\n`;
  texto += `‎\n`;
  texto += `‎😉 𝐕𝐚𝐦𝐨𝐬 𝐦𝐚𝐧𝐭𝐞𝐫 𝐨 𝐠𝐫𝐮𝐩𝐨 𝐨𝐫𝐠𝐚𝐧𝐢𝐳𝐚𝐝𝐨 𝐞 𝐟𝐨𝐜𝐚𝐝𝐨 𝐧𝐚𝐬 𝐡𝐢𝐬𝐭𝐨́𝐫𝐢𝐚𝐬 𝐢𝐧𝐜𝐫𝐢́𝐯𝐞𝐢𝐬 𝐪𝐮𝐞 𝐜𝐨𝐦𝐩𝐚𝐫𝐭𝐢𝐥𝐡𝐚𝐦𝐨𝐬! 𝐎𝐛𝐫𝐢𝐠𝐚𝐝𝐚 𝐩𝐞𝐥𝐚 𝐜𝐨𝐨𝐩𝐞𝐫𝐚𝐜̧𝐚̃𝐨! 📚👍`;

  return texto;
}

function copiarFicha() {
  const texto = document.getElementById("fichaTexto").value;

  navigator.clipboard.writeText(texto)
    .then(() => alert("Ficha copiada!"))
    .catch(() => alert("Não foi possível copiar automaticamente. Selecione o texto e copie manualmente."));
}

function enviarWhatsapp() {
  const texto = document.getElementById("fichaTexto").value;
  const url = "https://wa.me/?text=" + encodeURIComponent(texto);

  window.open(url, "_blank");
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
