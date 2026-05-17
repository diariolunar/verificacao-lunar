import { auth, db } from "./firebase.js";

import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";

const subs = {
  A6: {
    nome: "𖤐⛓️🔥 Trono Profano",
    cor: "#7F1D1D",
    tituloFicha: "𖤐⛓️🔥 𝐀-𝟔 — 𝐓𝐑𝐎𝐍𝐎 𝐏𝐑𝐎𝐅𝐀𝐍𝐎 🔥⛓️𖤐",
    modeloFicha: "trono",
    tipoGrade: "duasObras"
  },
  A1: {
    nome: "🔥 Chama Eterna",
    cor: "#F97316",
    tituloFicha: "🌜 𝐎𝐧𝐝𝐞 𝐚 𝐋𝐮𝐚 𝐢𝐥𝐮𝐦𝐢𝐧𝐚 𝐨𝐬 𝐥𝐢𝐯𝐫𝐨𝐬: 𝐋𝐮𝐧𝐚 𝐀-𝟏 🌛",
    modeloFicha: "chama",
    tipoGrade: "duasObras"
  },
  A2: {
    nome: "📖 Página Livre",
    cor: "#0ea5e9",
    tituloFicha: "🧚‍♂PAGINA LIVRE 𝑨-𝟐 🧝‍♀🧌🦹‍♂🧞‍♂ VERIFICAÇÕES 🧛‍♂🧜‍♂",
    modeloFicha: "pagina",
    tipoGrade: "duasObras"
  },
  A7: {
    nome: "✦🗺️📖 Margens de Mundos",
    cor: "#10B981",
    tituloFicha: "✦🗺️📖 𝐀-𝟕 — 𝐌𝐀𝐑𝐆𝐄𝐍𝐒 𝐃𝐄 𝐌𝐔𝐍𝐃𝐎𝐒 📖🗺️✦",
    modeloFicha: "margens",
    tipoGrade: "umaObra"
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
let usuarioAtual = null;

async function carregarComponentes() {
  const header = await fetch("header.html").then(res => res.text());
  const footer = await fetch("footer.html").then(res => res.text());

  document.getElementById("header").innerHTML = header;
  document.getElementById("footer").innerHTML = footer;
}

function getSubAtual() {
  return localStorage.getItem("sub");
}

function ehSubUmaObra() {
  const sub = getSubAtual();
  return subs[sub]?.tipoGrade === "umaObra";
}

function caminhoSub(sub) {
  return doc(db, "subs", sub);
}

function escapeHTML(texto) {
  return String(texto || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function limparUser(user) {
  return String(user || "").replace(/^@/, "");
}

function repetirCheck(qtd) {
  const total = Number(qtd || 0);
  if (total <= 0) return "";
  return "✅".repeat(total);
}

function statusEhSemObra(status) {
  return status === "⏳";
}

function statusContaComoLeitura(status) {
  return statusQueCompletamLeitura.includes(status);
}

function leituraObrigatoriaValida(status) {
  if (statusEhSemObra(status)) return true;
  return statusContaComoLeitura(status);
}

function existePeloMenosUmaObraObrigatoria(obra1Status, obra2Status) {
  return !statusEhSemObra(obra1Status) || !statusEhSemObra(obra2Status);
}

function leiturasDoDiaValidas(obra1Status, obra2Status) {
  return (
    existePeloMenosUmaObraObrigatoria(obra1Status, obra2Status) &&
    leituraObrigatoriaValida(obra1Status) &&
    leituraObrigatoriaValida(obra2Status)
  );
}

function traduzirEmojisTronoProfano(texto) {
  return String(texto || "")
    .replaceAll("☠", "☠️")
    .replaceAll("🌼", "📜")
    .replaceAll("⚰", "⚰️")
    .replaceAll("🧕🏻", "🕯️")
    .replaceAll("⚠", "⚠️");
}

function traduzirEmojisMargens(texto) {
  return String(texto || "")
    .replaceAll("☠", "🌑")
    .replaceAll("🌼", "📜")
    .replaceAll("⚰", "🚪")
    .replaceAll("🧕🏻", "🧭")
    .replaceAll("⚠", "⚠️");
}

async function buscarMembros() {
  const sub = getSubAtual();
  const ref = collection(db, "subs", sub, "membros");
  const snap = await getDocs(ref);

  return snap.docs
    .map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data()
    }))
    .sort((a, b) => String(a.criadoEm || "").localeCompare(String(b.criadoEm || "")));
}

async function buscarObras() {
  const sub = getSubAtual();
  const ref = collection(db, "subs", sub, "obras");
  const snap = await getDocs(ref);

  return snap.docs
    .map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data()
    }))
    .sort((a, b) => String(a.criadoEm || "").localeCompare(String(b.criadoEm || "")));
}

async function buscarGrade() {
  const sub = getSubAtual();
  const ref = doc(db, "subs", sub, "config", "gradeSemanal");
  const snap = await getDoc(ref);

  if (!snap.exists()) return {};
  return snap.data();
}

async function salvarGradeBanco(grade) {
  const sub = getSubAtual();
  const ref = doc(db, "subs", sub, "config", "gradeSemanal");
  await setDoc(ref, grade);
}

async function buscarVerificacoes() {
  const sub = getSubAtual();
  const ref = collection(db, "subs", sub, "verificacoes");
  const snap = await getDocs(ref);

  const dados = {};

  snap.docs.forEach(docSnap => {
    dados[docSnap.id] = docSnap.data();
  });

  return dados;
}

async function buscarVerificacaoDia(dia) {
  const sub = getSubAtual();
  const ref = doc(db, "subs", sub, "verificacoes", dia);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;
  return snap.data();
}

async function salvarVerificacaoBanco(dia, dados) {
  const sub = getSubAtual();
  const ref = doc(db, "subs", sub, "verificacoes", dia);
  await setDoc(ref, dados);
}

await carregarComponentes();

onAuthStateChanged(auth, async user => {
  usuarioAtual = user;

  if (!user) {
    telaLogin();
    return;
  }

  const sub = getSubAtual();

  if (!sub) {
    telaSubs();
  } else {
    await telaDashboard();
  }

  aplicarTema();
});

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

      <button onclick="selecionarSub('A6')">𖤐 Trono Profano</button>
      <button onclick="selecionarSub('A1')">🔥 Chama Eterna</button>
      <button onclick="selecionarSub('A2')">📖 Página Livre</button>
      <button onclick="selecionarSub('A7')">🗺️ Margens de Mundos</button>

      <button onclick="logout()">Sair</button>
    </div>
  `;

  aplicarTema();
}

async function telaDashboard() {
  const sub = getSubAtual();

  app.innerHTML = `
    <div class="login-box dashboard-box">
      <h2>${subs[sub].nome}</h2>
      <p>Escolha uma área para gerenciar.</p>

      <button onclick="telaMembros()">👥 Membros</button>
      <button onclick="telaObras()">📚 Obras</button>
      <button onclick="telaGrade()">📅 Grade Semanal</button>
      <button onclick="telaVerificacoes()">📜 Verificações</button>
      <button onclick="telaVisualizarFicha()">👁 Visualizar Ficha</button>
      <button onclick="limparFichaSemana()">🧹 Limpar Ficha da Semana</button>

      <br><br>

      <button onclick="trocarSub()">🔁 Trocar Sub</button>
      <button onclick="logout()">Sair</button>
    </div>
  `;

  aplicarTema();
}

async function telaMembros() {
  const membros = await buscarMembros();

  let lista = "";

  if (membros.length === 0) {
    lista = `<p class="empty-message">Nenhum membro cadastrado ainda.</p>`;
  } else {
    lista = membros.map(membro => `
      <div class="item-card">
        <div>
          <strong>${escapeHTML(membro.nome)}</strong>
          <span>${escapeHTML(membro.user)}</span>
          <span>Semana: ${membro.semana ?? 0}</span>
        </div>

        <div class="item-actions">
          <button onclick="formMembro('${membro.id}')">Editar</button>
          <button onclick="removerMembro('${membro.id}')">Excluir</button>
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

async function formMembro(id = null) {
  let membro = { nome: "", user: "", semana: 0 };
  const editando = Boolean(id);

  if (editando) {
    const sub = getSubAtual();
    const ref = doc(db, "subs", sub, "membros", id);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      membro = {
        semana: 0,
        ...snap.data()
      };
    }
  }

  app.innerHTML = `
    <div class="page-box form-box">
      <h2>${editando ? "Editar Membro" : "Cadastrar Membro"}</h2>

      <label>Nome</label>
      <input id="nomeMembro" placeholder="Nome do membro" value="${escapeHTML(membro.nome)}">

      <label>User</label>
      <input id="userMembro" placeholder="@user" value="${escapeHTML(membro.user)}">

      <label>Semana atual</label>
      <input id="semanaMembro" type="number" min="0" placeholder="Ex: 2" value="${membro.semana ?? 0}">

      <button onclick="${editando ? `salvarEdicaoMembro('${id}')` : "adicionarMembro()"}">
        ${editando ? "Salvar Alterações" : "Cadastrar Membro"}
      </button>

      <button onclick="telaMembros()">⬅ Voltar</button>
    </div>
  `;

  aplicarTema();
}

async function adicionarMembro() {
  const sub = getSubAtual();

  const nome = document.getElementById("nomeMembro").value.trim();
  const user = document.getElementById("userMembro").value.trim();
  const semana = Number(document.getElementById("semanaMembro").value || 0);

  if (!nome || !user) {
    alert("Preencha nome e user.");
    return;
  }

  await addDoc(collection(db, "subs", sub, "membros"), {
    nome,
    user,
    semana,
    criadoEm: new Date().toISOString()
  });

  await telaMembros();
}

async function salvarEdicaoMembro(id) {
  const sub = getSubAtual();

  const nome = document.getElementById("nomeMembro").value.trim();
  const user = document.getElementById("userMembro").value.trim();
  const semana = Number(document.getElementById("semanaMembro").value || 0);

  if (!nome || !user) {
    alert("Preencha nome e user.");
    return;
  }

  await updateDoc(doc(db, "subs", sub, "membros", id), {
    nome,
    user,
    semana
  });

  await telaMembros();
}

async function removerMembro(id) {
  const confirmar = confirm("Tem certeza que deseja excluir este membro?");

  if (!confirmar) return;

  const sub = getSubAtual();

  await deleteDoc(doc(db, "subs", sub, "membros", id));

  const obras = await buscarObras();

  for (const obra of obras) {
    if (obra.membroId === id) {
      await deleteDoc(doc(db, "subs", sub, "obras", obra.id));
    }
  }

  await telaMembros();
}

async function telaObras() {
  const membros = await buscarMembros();
  const obras = await buscarObras();

  let lista = "";

  if (obras.length === 0) {
    lista = `<p class="empty-message">Nenhuma obra cadastrada ainda.</p>`;
  } else {
    lista = obras.map(obra => {
      const membro = membros.find(m => m.id === obra.membroId);

      return `
        <div class="item-card">
          <div>
            <strong>${escapeHTML(obra.titulo)}</strong>
            <span>Responsável: ${membro ? `${escapeHTML(membro.nome)} (${escapeHTML(membro.user)})` : "Membro removido"}</span>
          </div>

          <div class="item-actions">
            <button onclick="formObra('${obra.id}')">Editar</button>
            <button onclick="removerObra('${obra.id}')">Excluir</button>
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

async function formObra(id = null) {
  const sub = getSubAtual();
  const membros = await buscarMembros();

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

  let obra = { titulo: "", membroId: "" };
  const editando = Boolean(id);

  if (editando) {
    const ref = doc(db, "subs", sub, "obras", id);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      obra = snap.data();
    }
  }

  const opcoesMembros = membros.map(membro => `
    <option value="${membro.id}" ${obra.membroId === membro.id ? "selected" : ""}>
      ${escapeHTML(membro.nome)} (${escapeHTML(membro.user)})
    </option>
  `).join("");

  app.innerHTML = `
    <div class="page-box form-box">
      <h2>${editando ? "Editar Obra" : "Cadastrar Obra"}</h2>

      <label>Título da obra</label>
      <input id="tituloObra" placeholder="Título da obra" value="${escapeHTML(obra.titulo)}">

      <label>Membro responsável</label>
      <select id="membroObra">
        <option value="">Selecione o membro</option>
        ${opcoesMembros}
      </select>

      <button onclick="${editando ? `salvarEdicaoObra('${id}')` : "adicionarObra()"}">
        ${editando ? "Salvar Alterações" : "Cadastrar Obra"}
      </button>

      <button onclick="telaObras()">⬅ Voltar</button>
    </div>
  `;

  aplicarTema();
}

async function adicionarObra() {
  const sub = getSubAtual();

  const titulo = document.getElementById("tituloObra").value.trim();
  const membroId = document.getElementById("membroObra").value;

  if (!titulo || !membroId) {
    alert("Preencha o título e selecione o membro.");
    return;
  }

  await addDoc(collection(db, "subs", sub, "obras"), {
    titulo,
    membroId,
    criadoEm: new Date().toISOString()
  });

  await telaObras();
}

async function salvarEdicaoObra(id) {
  const sub = getSubAtual();

  const titulo = document.getElementById("tituloObra").value.trim();
  const membroId = document.getElementById("membroObra").value;

  if (!titulo || !membroId) {
    alert("Preencha o título e selecione o membro.");
    return;
  }

  await updateDoc(doc(db, "subs", sub, "obras", id), {
    titulo,
    membroId
  });

  await telaObras();
}

async function removerObra(id) {
  const confirmar = confirm("Tem certeza que deseja excluir esta obra?");

  if (!confirmar) return;

  const sub = getSubAtual();

  await deleteDoc(doc(db, "subs", sub, "obras", id));

  const grade = await buscarGrade();

  diasSemana.forEach(dia => {
    if (!grade[dia]) return;

    if (grade[dia].obra1 === id) grade[dia].obra1 = "";
    if (grade[dia].obra2 === id) grade[dia].obra2 = "";
  });

  await salvarGradeBanco(grade);

  await telaObras();
}

async function telaGrade() {
  const obras = await buscarObras();
  const grade = await buscarGrade();
  const umaObra = ehSubUmaObra();

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

  const opcoesObras = obras.map(obra => `
    <option value="${obra.id}">${escapeHTML(obra.titulo)}</option>
  `).join("");

  const linhas = diasSemana.map(dia => {
    if (umaObra) {
      return `
        <div class="linha-grade">
          <label class="dia-grade">${dia}</label>

          <select id="${dia}_obra1">
            <option value="">Obra do dia</option>
            ${opcoesObras}
          </select>
        </div>
      `;
    }

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
          <p>${umaObra ? "Selecione a obra de cada dia." : "Selecione a Obra 1 e a Obra 2 de segunda a sexta."}</p>
        </div>
      </div>

      ${linhas}

      <button onclick="salvarGrade()">Salvar Grade</button>
      <button onclick="telaDashboard()">⬅ Voltar</button>
    </div>
  `;

  diasSemana.forEach(dia => {
    if (grade[dia]) {
      document.getElementById(`${dia}_obra1`).value = grade[dia].obra1 || "";

      if (!umaObra && document.getElementById(`${dia}_obra2`)) {
        document.getElementById(`${dia}_obra2`).value = grade[dia].obra2 || "";
      }
    }
  });

  aplicarTema();
}

async function salvarGrade() {
  const umaObra = ehSubUmaObra();
  const novaGrade = {};

  diasSemana.forEach(dia => {
    novaGrade[dia] = {
      obra1: document.getElementById(`${dia}_obra1`).value,
      obra2: umaObra ? "" : document.getElementById(`${dia}_obra2`).value
    };
  });

  await salvarGradeBanco(novaGrade);

  alert("Grade salva com sucesso!");

  await telaDashboard();
}

async function telaVerificacoes(diaSelecionado = "Segunda") {
  if (ehSubUmaObra()) {
    await telaVerificacoesUmaObra(diaSelecionado);
    return;
  }

  await telaVerificacoesDuasObras(diaSelecionado);
}

function campoBuscaMembroHTML() {
  return `
    <div class="controle-verificacao">
      <label>Buscar membro</label>
      <input 
        id="buscaMembroVerificacao" 
        placeholder="Digite nome ou user..."
        oninput="filtrarMembrosVerificacao()"
      >
    </div>
  `;
}

function filtrarMembrosVerificacao() {
  const busca = String(document.getElementById("buscaMembroVerificacao")?.value || "")
    .toLowerCase()
    .trim();

  document.querySelectorAll(".verificacao-card").forEach(card => {
    const texto = String(card.dataset.search || "").toLowerCase();
    card.style.display = texto.includes(busca) ? "" : "none";
  });
}

async function telaVerificacoesDuasObras(diaSelecionado = "Segunda") {
  const membros = await buscarMembros();
  const obras = await buscarObras();
  const grade = await buscarGrade();
  const verificacaoDia = await buscarVerificacaoDia(diaSelecionado);

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

  if (!dadosDia || !dadosDia.obra1 || !dadosDia.obra2) {
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

  const obra1 = obras.find(obra => obra.id === dadosDia.obra1);
  const obra2 = obras.find(obra => obra.id === dadosDia.obra2);

  const linhasMembros = membros.map(membro => {
    const dadosMembro = verificacaoDia?.membros?.[membro.id] || {
      obra1Status: "",
      obra1Feedback: false,
      obra1Extra: false,
      obra1ExtraQtd: 1,
      obra2Status: "",
      obra2Feedback: false,
      obra2Extra: false,
      obra2ExtraQtd: 1,
      pontos: 0
    };

    return `
      <div class="verificacao-card" data-search="${escapeHTML(`${membro.nome} ${membro.user}`)}">
        <div class="verificacao-topo">
          <div>
            <strong>${escapeHTML(membro.nome)}</strong>
            <span>${escapeHTML(membro.user)}</span>
            <span>Semana: ${membro.semana ?? 0}</span>
          </div>

          <div class="pontos-duplo">
            <div class="pontos-box">
              <small>Hoje</small>
              <strong id="pontos_membro_${membro.id}">${dadosMembro.pontos || 0}</strong>
            </div>

            <div class="pontos-box">
              <small>Semana</small>
              <strong id="semana_membro_${membro.id}">...</strong>
            </div>
          </div>
        </div>

        <div class="verificacao-grid">
          ${gerarBlocoObraVerificacao(membro.id, 1, obra1, dadosMembro)}
          ${gerarBlocoObraVerificacao(membro.id, 2, obra2, dadosMembro)}
        </div>
      </div>
    `;
  }).join("");

  app.innerHTML = `
    <div class="page-box verificacao-box">
      <div class="page-header">
        <div>
          <h2>Verificações</h2>
          <p>Marque o resultado da leitura, feedbacks e capítulos extras.</p>
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

      ${campoBuscaMembroHTML()}

      <div class="resumo-obras">
        <div>
          <strong>Obra 1</strong>
          <span>${obra1 ? escapeHTML(obra1.titulo) : "Obra não encontrada"}</span>
        </div>

        <div>
          <strong>Obra 2</strong>
          <span>${obra2 ? escapeHTML(obra2.titulo) : "Obra não encontrada"}</span>
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

  for (const membro of membros) {
    atualizarPontosTela(membro.id);
    document.getElementById(`semana_membro_${membro.id}`).textContent = await calcularPontosAcumulados(membro.id);
  }

  aplicarTema();
}

async function telaVerificacoesUmaObra(diaSelecionado = "Segunda") {
  const membros = await buscarMembros();
  const obras = await buscarObras();
  const grade = await buscarGrade();
  const verificacaoDia = await buscarVerificacaoDia(diaSelecionado);

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

  if (!dadosDia || !dadosDia.obra1) {
    app.innerHTML = `
      <div class="page-box">
        <h2>Verificações</h2>

        <label>Dia da semana</label>
        <select id="diaVerificacao" onchange="telaVerificacoes(this.value)">
          ${diasSemana.map(dia => `
            <option value="${dia}" ${dia === diaSelecionado ? "selected" : ""}>${dia}</option>
          `).join("")}
        </select>

        <p class="empty-message">A grade deste dia ainda não está completa. Selecione a obra do dia na grade semanal.</p>

        <button onclick="telaGrade()">Montar Grade</button>
        <button onclick="telaDashboard()">⬅ Voltar</button>
      </div>
    `;

    aplicarTema();
    return;
  }

  const obra1 = obras.find(obra => obra.id === dadosDia.obra1);

  const linhasMembros = membros.map(membro => {
    const dadosMembro = verificacaoDia?.membros?.[membro.id] || {
      obra1Status: "",
      obra1Feedback: false,
      obra1Extra: false,
      obra1ExtraQtd: 1,
      pontos: 0
    };

    return `
      <div class="verificacao-card" data-search="${escapeHTML(`${membro.nome} ${membro.user}`)}">
        <div class="verificacao-topo">
          <div>
            <strong>${escapeHTML(membro.nome)}</strong>
            <span>${escapeHTML(membro.user)}</span>
            <span>Semana: ${membro.semana ?? 0}</span>
          </div>

          <div class="pontos-duplo">
            <div class="pontos-box">
              <small>Hoje</small>
              <strong id="pontos_membro_${membro.id}">${dadosMembro.pontos || 0}</strong>
            </div>

            <div class="pontos-box">
              <small>Semana</small>
              <strong id="semana_membro_${membro.id}">...</strong>
            </div>
          </div>
        </div>

        <div class="verificacao-grid">
          ${gerarBlocoObraVerificacao(membro.id, 1, obra1, dadosMembro)}
        </div>
      </div>
    `;
  }).join("");

  app.innerHTML = `
    <div class="page-box verificacao-box">
      <div class="page-header">
        <div>
          <h2>Verificações Margens de Mundos</h2>
          <p>Marque o resultado da obra do dia, feedback e capítulos extras.</p>
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

      ${campoBuscaMembroHTML()}

      <div class="resumo-obras">
        <div>
          <strong>Obra do dia</strong>
          <span>${obra1 ? escapeHTML(obra1.titulo) : "Obra não encontrada"}</span>
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

  for (const membro of membros) {
    atualizarPontosTela(membro.id);
    document.getElementById(`semana_membro_${membro.id}`).textContent = await calcularPontosAcumulados(membro.id);
  }

  aplicarTema();
}

function gerarBlocoObraVerificacao(membroId, numeroObra, obra, dadosMembro) {
  const status = dadosMembro[`obra${numeroObra}Status`] || "";
  const feedback = dadosMembro[`obra${numeroObra}Feedback`] || false;
  const extra = dadosMembro[`obra${numeroObra}Extra`] || false;
  const extraQtd = dadosMembro[`obra${numeroObra}ExtraQtd`] || 1;

  return `
    <div class="obra-verificacao">
      <h3>${ehSubUmaObra() ? "Obra do dia" : `Obra ${numeroObra}`}</h3>
      <p>${obra ? escapeHTML(obra.titulo) : "Obra não encontrada"}</p>

      <label>Status da leitura</label>
      <select id="membro_${membroId}_obra${numeroObra}Status" onchange="atualizarPontosTela('${membroId}')">
        ${gerarOpcoesStatus(status)}
      </select>

      <label class="checkbox-label">
        <input 
          type="checkbox" 
          id="membro_${membroId}_obra${numeroObra}Feedback"
          onchange="atualizarPontosTela('${membroId}')"
          ${feedback ? "checked" : ""}
        >
        Feedback entregue (+20)
      </label>

      <label class="checkbox-label">
        <input 
          type="checkbox" 
          id="membro_${membroId}_obra${numeroObra}Extra"
          onchange="atualizarPontosTela('${membroId}')"
          ${extra ? "checked" : ""}
        >
        Teve capítulo extra? (+5 cada)
      </label>

      <div id="extraBox_${membroId}_obra${numeroObra}" style="display:none;">
        <label>Quantidade de capítulos extras</label>
        <input 
          type="number"
          min="1"
          id="membro_${membroId}_obra${numeroObra}ExtraQtd"
          value="${extraQtd}"
          onchange="atualizarPontosTela('${membroId}')"
          oninput="atualizarPontosTela('${membroId}')"
        >
      </div>

      <small id="aviso_${membroId}_obra${numeroObra}" class="feedback-aviso"></small>
    </div>
  `;
}

function gerarOpcoesStatus(valorAtual) {
  return statusLeitura.map(status => `
    <option value="${status.emoji}" ${status.emoji === valorAtual ? "selected" : ""}>
      ${status.emoji ? status.emoji + " " : ""}${status.texto}
    </option>
  `).join("");
}

function calcularPontosDuasObras(
  obra1Status,
  obra1Feedback,
  obra1Extra,
  obra1ExtraQtd,
  obra2Status,
  obra2Feedback,
  obra2Extra,
  obra2ExtraQtd
) {
  let pontos = 0;

  const diaValido = leiturasDoDiaValidas(obra1Status, obra2Status);

  if (!diaValido) return 0;

  if (statusContaComoLeitura(obra1Status) && !statusEhSemObra(obra1Status)) {
    pontos += 5;
  }

  if (statusContaComoLeitura(obra2Status) && !statusEhSemObra(obra2Status)) {
    pontos += 5;
  }

  if (obra1Status === "🌙" && obra1Feedback) {
    pontos += 20;
  }

  if (obra2Status === "🌙" && obra2Feedback) {
    pontos += 20;
  }

  if (obra1Status === "🌙" && obra1Extra) {
    pontos += Math.max(1, Number(obra1ExtraQtd || 1)) * 5;
  }

  if (obra2Status === "🌙" && obra2Extra) {
    pontos += Math.max(1, Number(obra2ExtraQtd || 1)) * 5;
  }

  return pontos;
}

function calcularPontosUmaObra(
  obra1Status,
  obra1Feedback,
  obra1Extra,
  obra1ExtraQtd
) {
  let pontos = 0;

  if (!statusContaComoLeitura(obra1Status)) return 0;

  pontos += 5;

  if (obra1Status === "🌙" && obra1Feedback) {
    pontos += 20;
  }

  if (obra1Status === "🌙" && obra1Extra) {
    pontos += Math.max(1, Number(obra1ExtraQtd || 1)) * 5;
  }

  return pontos;
}

function controlarExtras(membroId, obraNumero, statusObra, leituraCompleta) {
  const extraCampo = document.getElementById(`membro_${membroId}_obra${obraNumero}Extra`);
  const extraQtdCampo = document.getElementById(`membro_${membroId}_obra${obraNumero}ExtraQtd`);
  const extraBox = document.getElementById(`extraBox_${membroId}_obra${obraNumero}`);

  if (!extraCampo || !extraQtdCampo || !extraBox) return;

  const podeTerExtra = leituraCompleta && statusObra === "🌙";

  if (!podeTerExtra) {
    extraCampo.checked = false;
    extraCampo.disabled = true;
    extraQtdCampo.value = 1;
    extraBox.style.display = "none";
    return;
  }

  extraCampo.disabled = false;

  if (extraCampo.checked) {
    extraBox.style.display = "block";

    if (!extraQtdCampo.value || Number(extraQtdCampo.value) < 1) {
      extraQtdCampo.value = 1;
    }
  } else {
    extraQtdCampo.value = 1;
    extraBox.style.display = "none";
  }
}

function atualizarPontosTela(membroId) {
  if (ehSubUmaObra()) {
    atualizarPontosTelaUmaObra(membroId);
    return;
  }

  atualizarPontosTelaDuasObras(membroId);
}

function atualizarPontosTelaDuasObras(membroId) {
  const obra1Status = document.getElementById(`membro_${membroId}_obra1Status`)?.value || "";
  const obra2Status = document.getElementById(`membro_${membroId}_obra2Status`)?.value || "";

  const obra1FeedbackCampo = document.getElementById(`membro_${membroId}_obra1Feedback`);
  const obra2FeedbackCampo = document.getElementById(`membro_${membroId}_obra2Feedback`);

  const avisoObra1 = document.getElementById(`aviso_${membroId}_obra1`);
  const avisoObra2 = document.getElementById(`aviso_${membroId}_obra2`);

  const diaValido = leiturasDoDiaValidas(obra1Status, obra2Status);

  if (!diaValido) {
    if (obra1FeedbackCampo) {
      obra1FeedbackCampo.checked = false;
      obra1FeedbackCampo.disabled = true;
    }

    if (obra2FeedbackCampo) {
      obra2FeedbackCampo.checked = false;
      obra2FeedbackCampo.disabled = true;
    }

    if (avisoObra1) avisoObra1.textContent = "Feedback e capítulos extras só contam se as leituras obrigatórias do dia estiverem completas.";
    if (avisoObra2) avisoObra2.textContent = "Feedback e capítulos extras só contam se as leituras obrigatórias do dia estiverem completas.";
  } else {
    configurarFeedbackPorObra(membroId, 1, obra1Status);
    configurarFeedbackPorObra(membroId, 2, obra2Status);
  }

  controlarExtras(membroId, 1, obra1Status, diaValido);
  controlarExtras(membroId, 2, obra2Status, diaValido);

  const obra1Feedback = obra1Status === "🌙" ? obra1FeedbackCampo?.checked || false : false;
  const obra2Feedback = obra2Status === "🌙" ? obra2FeedbackCampo?.checked || false : false;

  const obra1ExtraCampo = document.getElementById(`membro_${membroId}_obra1Extra`);
  const obra2ExtraCampo = document.getElementById(`membro_${membroId}_obra2Extra`);
  const obra1ExtraQtdCampo = document.getElementById(`membro_${membroId}_obra1ExtraQtd`);
  const obra2ExtraQtdCampo = document.getElementById(`membro_${membroId}_obra2ExtraQtd`);

  const obra1Extra = obra1Status === "🌙" ? obra1ExtraCampo?.checked || false : false;
  const obra2Extra = obra2Status === "🌙" ? obra2ExtraCampo?.checked || false : false;

  const obra1ExtraQtd = obra1Extra ? Math.max(1, Number(obra1ExtraQtdCampo?.value || 1)) : 0;
  const obra2ExtraQtd = obra2Extra ? Math.max(1, Number(obra2ExtraQtdCampo?.value || 1)) : 0;

  const pontos = calcularPontosDuasObras(
    obra1Status,
    obra1Feedback,
    obra1Extra,
    obra1ExtraQtd,
    obra2Status,
    obra2Feedback,
    obra2Extra,
    obra2ExtraQtd
  );

  const campoPontos = document.getElementById(`pontos_membro_${membroId}`);

  if (campoPontos) {
    campoPontos.textContent = pontos;
  }
}

function atualizarPontosTelaUmaObra(membroId) {
  const obra1Status = document.getElementById(`membro_${membroId}_obra1Status`)?.value || "";
  const obra1FeedbackCampo = document.getElementById(`membro_${membroId}_obra1Feedback`);
  const avisoObra1 = document.getElementById(`aviso_${membroId}_obra1`);

  const leituraCompleta = statusContaComoLeitura(obra1Status);

  if (!leituraCompleta) {
    if (obra1FeedbackCampo) {
      obra1FeedbackCampo.checked = false;
      obra1FeedbackCampo.disabled = true;
    }

    if (avisoObra1) {
      avisoObra1.textContent = "Feedback e capítulos extras só contam se a leitura do dia estiver completa.";
    }
  } else {
    configurarFeedbackPorObra(membroId, 1, obra1Status);
  }

  controlarExtras(membroId, 1, obra1Status, leituraCompleta);

  const obra1Feedback = obra1Status === "🌙" ? obra1FeedbackCampo?.checked || false : false;

  const obra1ExtraCampo = document.getElementById(`membro_${membroId}_obra1Extra`);
  const obra1ExtraQtdCampo = document.getElementById(`membro_${membroId}_obra1ExtraQtd`);

  const obra1Extra = obra1Status === "🌙" ? obra1ExtraCampo?.checked || false : false;
  const obra1ExtraQtd = obra1Extra ? Math.max(1, Number(obra1ExtraQtdCampo?.value || 1)) : 0;

  const pontos = calcularPontosUmaObra(
    obra1Status,
    obra1Feedback,
    obra1Extra,
    obra1ExtraQtd
  );

  const campoPontos = document.getElementById(`pontos_membro_${membroId}`);

  if (campoPontos) {
    campoPontos.textContent = pontos;
  }
}

function configurarFeedbackPorObra(membroId, obraNumero, statusObra) {
  const feedbackCampo = document.getElementById(`membro_${membroId}_obra${obraNumero}Feedback`);
  const aviso = document.getElementById(`aviso_${membroId}_obra${obraNumero}`);

  if (!feedbackCampo) return;

  if (statusObra === "🌙") {
    feedbackCampo.disabled = false;
    if (aviso) aviso.textContent = "";
    return;
  }

  feedbackCampo.checked = false;
  feedbackCampo.disabled = true;

  if (statusEhSemObra(statusObra)) {
    if (aviso) aviso.textContent = "Sem obra neste campo.";
  } else {
    if (aviso) aviso.textContent = "Não pode entregar feedback nem capítulo extra da própria obra.";
  }
}

async function salvarVerificacao(diaSelecionado) {
  if (ehSubUmaObra()) {
    await salvarVerificacaoUmaObra(diaSelecionado);
    return;
  }

  await salvarVerificacaoDuasObras(diaSelecionado);
}

async function salvarVerificacaoDuasObras(diaSelecionado) {
  const membros = await buscarMembros();

  const dados = {
    dia: diaSelecionado,
    atualizadoEm: new Date().toISOString(),
    membros: {}
  };

  membros.forEach(membro => {
    const obra1Status = document.getElementById(`membro_${membro.id}_obra1Status`).value;
    const obra2Status = document.getElementById(`membro_${membro.id}_obra2Status`).value;

    const diaValido = leiturasDoDiaValidas(obra1Status, obra2Status);

    const obra1Feedback = diaValido && obra1Status === "🌙"
      ? document.getElementById(`membro_${membro.id}_obra1Feedback`).checked
      : false;

    const obra2Feedback = diaValido && obra2Status === "🌙"
      ? document.getElementById(`membro_${membro.id}_obra2Feedback`).checked
      : false;

    const obra1Extra = diaValido && obra1Status === "🌙"
      ? document.getElementById(`membro_${membro.id}_obra1Extra`).checked
      : false;

    const obra2Extra = diaValido && obra2Status === "🌙"
      ? document.getElementById(`membro_${membro.id}_obra2Extra`).checked
      : false;

    const obra1ExtraQtd = obra1Extra
      ? Math.max(1, Number(document.getElementById(`membro_${membro.id}_obra1ExtraQtd`).value || 1))
      : 0;

    const obra2ExtraQtd = obra2Extra
      ? Math.max(1, Number(document.getElementById(`membro_${membro.id}_obra2ExtraQtd`).value || 1))
      : 0;

    const pontos = calcularPontosDuasObras(
      obra1Status,
      obra1Feedback,
      obra1Extra,
      obra1ExtraQtd,
      obra2Status,
      obra2Feedback,
      obra2Extra,
      obra2ExtraQtd
    );

    dados.membros[membro.id] = {
      nome: membro.nome,
      user: membro.user,
      semana: membro.semana ?? 0,
      obra1Status,
      obra1Feedback,
      obra1Extra,
      obra1ExtraQtd,
      obra2Status,
      obra2Feedback,
      obra2Extra,
      obra2ExtraQtd,
      pontos
    };
  });

  await salvarVerificacaoBanco(diaSelecionado, dados);

  alert("Verificação salva no banco de dados!");

  await telaDashboard();
}

async function salvarVerificacaoUmaObra(diaSelecionado) {
  const membros = await buscarMembros();

  const dados = {
    dia: diaSelecionado,
    atualizadoEm: new Date().toISOString(),
    membros: {}
  };

  membros.forEach(membro => {
    const obra1Status = document.getElementById(`membro_${membro.id}_obra1Status`).value;
    const leituraCompleta = statusContaComoLeitura(obra1Status);

    const obra1Feedback = leituraCompleta && obra1Status === "🌙"
      ? document.getElementById(`membro_${membro.id}_obra1Feedback`).checked
      : false;

    const obra1Extra = leituraCompleta && obra1Status === "🌙"
      ? document.getElementById(`membro_${membro.id}_obra1Extra`).checked
      : false;

    const obra1ExtraQtd = obra1Extra
      ? Math.max(1, Number(document.getElementById(`membro_${membro.id}_obra1ExtraQtd`).value || 1))
      : 0;

    const pontos = calcularPontosUmaObra(
      obra1Status,
      obra1Feedback,
      obra1Extra,
      obra1ExtraQtd
    );

    dados.membros[membro.id] = {
      nome: membro.nome,
      user: membro.user,
      semana: membro.semana ?? 0,
      obra1Status,
      obra1Feedback,
      obra1Extra,
      obra1ExtraQtd,
      obra2Status: "",
      obra2Feedback: false,
      obra2Extra: false,
      obra2ExtraQtd: 0,
      pontos
    };
  });

  await salvarVerificacaoBanco(diaSelecionado, dados);

  alert("Verificação salva no banco de dados!");

  await telaDashboard();
}

async function calcularPontosAcumulados(membroId) {
  const verificacoes = await buscarVerificacoes();

  let total = 0;

  diasSemana.forEach(dia => {
    if (verificacoes[dia]?.membros?.[membroId]) {
      total += Number(verificacoes[dia].membros[membroId].pontos || 0);
    }
  });

  return total;
}

async function contarDiasComVerificacao() {
  const verificacoes = await buscarVerificacoes();

  let total = 0;

  diasSemana.forEach(dia => {
    if (verificacoes[dia]) total++;
  });

  return total;
}

async function obterUltimoDiaVerificado() {
  const verificacoes = await buscarVerificacoes();

  let ultimoDia = null;

  diasSemana.forEach(dia => {
    if (verificacoes[dia]) ultimoDia = dia;
  });

  return ultimoDia;
}

async function gerarEmojisAcumulados(membroId, campoStatus) {
  const verificacoes = await buscarVerificacoes();

  let emojis = "";

  diasSemana.forEach(dia => {
    if (verificacoes[dia]?.membros?.[membroId]) {
      emojis += verificacoes[dia].membros[membroId][campoStatus] || "";
    }
  });

  return emojis;
}

async function contarFeedbacksAcumulados(membroId) {
  const verificacoes = await buscarVerificacoes();

  let total = 0;

  diasSemana.forEach(dia => {
    const dados = verificacoes[dia]?.membros?.[membroId];

    if (dados?.obra1Feedback) total++;
    if (!ehSubUmaObra() && dados?.obra2Feedback) total++;
  });

  return total;
}

async function contarExtrasAcumulados(membroId) {
  const verificacoes = await buscarVerificacoes();

  let total = 0;

  diasSemana.forEach(dia => {
    const dados = verificacoes[dia]?.membros?.[membroId];

    if (!dados) return;

    if (dados.obra1Extra) {
      total += Math.max(1, Number(dados.obra1ExtraQtd || 1));
    }

    if (!ehSubUmaObra() && dados.obra2Extra) {
      total += Math.max(1, Number(dados.obra2ExtraQtd || 1));
    }
  });

  return total;
}

async function limparFichaSemana() {
  const confirmar = confirm(
    "Tem certeza que deseja limpar a ficha desta semana?\n\nIsso vai apagar apenas as verificações de segunda a sexta.\nNão vai apagar membros, obras, grade ou semanas cadastradas."
  );

  if (!confirmar) return;

  const sub = getSubAtual();

  try {
    for (const dia of diasSemana) {
      await deleteDoc(doc(db, "subs", sub, "verificacoes", dia));
    }

    alert("Ficha da semana limpa com sucesso!");
    await telaDashboard();
  } catch (error) {
    alert("Não foi possível limpar a ficha da semana.");
  }
}

async function telaVisualizarFicha() {
  const membros = await buscarMembros();
  const ultimoDia = await obterUltimoDiaVerificado();

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

  const ficha = await gerarFichaWhatsapp();
  const dias = await contarDiasComVerificacao();

  app.innerHTML = `
    <div class="page-box ficha-box">
      <div class="page-header">
        <div>
          <h2>Visualizar Ficha</h2>
          <p>Confira a mensagem antes de enviar no WhatsApp.</p>
          <p><strong>Dias acumulados:</strong> ${dias}</p>
        </div>
      </div>

      <textarea id="fichaTexto" readonly></textarea>

      <button onclick="copiarFicha()">Copiar Ficha</button>
      <button onclick="telaDashboard()">⬅ Voltar</button>
    </div>
  `;

  document.getElementById("fichaTexto").value = ficha;

  aplicarTema();
}

async function gerarFichaWhatsapp() {
  const sub = getSubAtual();

  if (subs[sub].modeloFicha === "chama") {
    return await montarFichaChama();
  }

  if (subs[sub].modeloFicha === "pagina") {
    return await montarFichaPagina();
  }

  if (subs[sub].modeloFicha === "margens") {
    return await montarFichaMargens();
  }

  return await montarFichaTrono();
}

async function montarFichaTrono() {
  const membros = await buscarMembros();
  const diasAcumulados = await contarDiasComVerificacao();

  let texto = "";

  texto += `𖤐⛓️🔥 𝐀-𝟔 — 𝐓𝐑𝐎𝐍𝐎 𝐏𝐑𝐎𝐅𝐀𝐍𝐎 🔥⛓️𖤐\n`;
  texto += `━━━━━━━━━━━ 𖤐 ━━━━━━━━━━━\n`;
  texto += `📜 𝐕𝐄𝐑𝐈𝐅𝐈𝐂𝐀𝐂̧𝐀̃𝐎\n`;
  texto += `━━━━━━━━━━━ 𖤐 ━━━━━━━━━━━\n\n`;

  texto += gerarLegendaTrono();

  texto += `━━━━━━━━━━━ 𖤐 ━━━━━━━━━━━\n`;
  texto += `📖 𝐅𝐈𝐂𝐇𝐀 𝐃𝐎 𝐋𝐄𝐈𝐓𝐎𝐑\n`;
  texto += `━━━━━━━━━━━ 𖤐 ━━━━━━━━━━━\n\n`;

  for (const membro of membros) {
    const pontosAcumulados = await calcularPontosAcumulados(membro.id);

    const emojisObra1Bruto = await gerarEmojisAcumulados(membro.id, "obra1Status");
    const emojisObra2Bruto = await gerarEmojisAcumulados(membro.id, "obra2Status");

    const emojisObra1 = traduzirEmojisTronoProfano(emojisObra1Bruto);
    const emojisObra2 = traduzirEmojisTronoProfano(emojisObra2Bruto);

    const feedbacks = await contarFeedbacksAcumulados(membro.id);
    const extras = await contarExtrasAcumulados(membro.id);

    const feedbackTexto = repetirCheck(feedbacks);
    const extrasTexto = repetirCheck(extras);

    texto += `━━━━━━━━━━━ 𖤐 ━━━━━━━━━━━\n\n`;

    texto += `♛ 𝐍𝐨𝐦𝐞: ${membro.nome}\n`;
    texto += `♜ 𝐔𝐬𝐞𝐫: ${limparUser(membro.user)}\n\n`;

    texto += `🌙 𝐒𝐞𝐦𝐚𝐧𝐚𝐬: ${membro.semana ?? 0}\n`;
    texto += `📅 𝐃𝐢𝐚𝐬: ${diasAcumulados}\n`;
    texto += `⭐ 𝐏𝐨𝐧𝐭𝐨𝐬: ${pontosAcumulados}\n`;
    texto += `💬 𝐅𝐞𝐞𝐝𝐛𝐚𝐜𝐤: ${feedbackTexto}\n`;
    texto += `🔮 𝐋𝐞𝐢𝐭𝐮𝐫𝐚 𝐋𝐮𝐧𝐚𝐫:\n\n`;

    texto += `📕 𝐆𝐫𝐢𝐦𝐨́𝐫𝐢𝐨 𝟎𝟏: ${emojisObra1}\n`;
    texto += `📕 𝐆𝐫𝐢𝐦𝐨́𝐫𝐢𝐨 𝟎𝟐: ${emojisObra2}\n\n`;

    texto += `🔮 𝐋𝐞𝐢𝐭𝐮𝐫𝐚 𝐄𝐱𝐭𝐫𝐚: ${extrasTexto}\n\n`;
  }

  texto += `━━━━━━━━━━━ 𖤐 ━━━━━━━━━━━\n\n`;
  texto += gerarMensagemAtencaoTronoProfano();

  return texto;
}

async function montarFichaChama() {
  const membros = await buscarMembros();
  const diasAcumulados = await contarDiasComVerificacao();

  let texto = "";

  texto += `🌑👑 𝐕𝐄𝐑𝐈𝐅𝐈𝐂𝐀𝐂̧𝐎̃𝐄𝐒 👑🌑\n\n`;
  texto += `🌜 𝐎𝐧𝐝𝐞 𝐚 𝐋𝐮𝐚 𝐢𝐥𝐮𝐦𝐢𝐧𝐚 𝐨𝐬 𝐥𝐢𝐯𝐫𝐨𝐬: 𝐋𝐮𝐧𝐚 𝐀-𝟏 🌛\n\n`;

  texto += gerarLegendaChama();

  for (const membro of membros) {
    const pontosAcumulados = await calcularPontosAcumulados(membro.id);
    const emojisObra1 = await gerarEmojisAcumulados(membro.id, "obra1Status");
    const emojisObra2 = await gerarEmojisAcumulados(membro.id, "obra2Status");
    const feedbacks = await contarFeedbacksAcumulados(membro.id);
    const extras = await contarExtrasAcumulados(membro.id);

    const feedbackTexto = repetirCheck(feedbacks);
    const extrasTexto = repetirCheck(extras);

    texto += `_____________\n\n`;
    texto += `📙𝐍𝐨𝐦𝐞: ${membro.nome}\n`;
    texto += `🦐𝐔𝐬𝐞𝐫: ${membro.user}\n\n`;

    texto += `🏆  semanas: ${membro.semana ?? 0}\n`;
    texto += `💌  Dias: ${diasAcumulados}\n`;
    texto += `👑 Pontos: ${pontosAcumulados}\n`;
    texto += `📈 Feedback: ${feedbackTexto}\n`;
    texto += `📚 Capítulos Extras: ${extrasTexto}\n`;
    texto += `LEITURA LUNAR:\n\n`;

    texto += `Obra 01.: ${emojisObra1}\n`;
    texto += `Obra 02.: ${emojisObra2}\n\n`;
  }

  texto += `—————————\n\n`;
  texto += gerarMensagemAtencao();

  return texto;
}

async function montarFichaPagina() {
  const membros = await buscarMembros();
  const diasAcumulados = await contarDiasComVerificacao();

  let texto = "";

  texto += `🧚‍♂PAGINA LIVRE 𝑨-𝟐 🧝‍♀🧌🦹‍♂🧞‍♂ VERIFICAÇÕES 🧛‍♂🧜‍♂\n\n`;

  texto += gerarLegendaPagina();

  for (const membro of membros) {
    const pontosAcumulados = await calcularPontosAcumulados(membro.id);
    const emojisObra1 = await gerarEmojisAcumulados(membro.id, "obra1Status");
    const emojisObra2 = await gerarEmojisAcumulados(membro.id, "obra2Status");
    const feedbacks = await contarFeedbacksAcumulados(membro.id);
    const extras = await contarExtrasAcumulados(membro.id);

    const feedbackTexto = repetirCheck(feedbacks);
    const extrasTexto = repetirCheck(extras);

    texto += `_______________\n\n`;
    texto += `🧙‍♂🧚‍♂ PAGINA LIVRE 𝑨-𝟐 🧛‍♂🧜‍♂\n\n`;

    texto += `🧝‍♀ Nome: ${membro.nome}\n`;
    texto += `🦇 User: ${membro.user}\n\n`;

    texto += `🌎 Semanas: ${membro.semana ?? 0}\n`;
    texto += `🗺 Dias: ${diasAcumulados}\n`;
    texto += `🧭 Pontos: ${pontosAcumulados}\n`;
    texto += `🏗 Feedback: ${feedbackTexto}\n`;
    texto += `📚 Capítulos Extras: ${extrasTexto}\n`;
    texto += `🌌 Leitura Lunar: \n\n`;

    texto += `🏘 Obra 01: ${emojisObra1}\n`;
    texto += `🏘 Obra 02: ${emojisObra2}\n\n`;
  }

  texto += `________________________\n\n`;
  texto += gerarMensagemAtencao();

  return texto;
}

async function montarFichaMargens() {
  const membros = await buscarMembros();
  const diasAcumulados = await contarDiasComVerificacao();

  let texto = "";

  texto += `✦🗺️📖 𝐀-𝟕 — 𝐌𝐀𝐑𝐆𝐄𝐍𝐒 𝐃𝐄 𝐌𝐔𝐍𝐃𝐎𝐒 📖🗺️✦\n`;
  texto += `━━━━━━━━━━━ ✦ ━━━━━━━━━━━\n`;
  texto += `📜 𝐕𝐄𝐑𝐈𝐅𝐈𝐂𝐀𝐂̧𝐀̃𝐎\n`;
  texto += `━━━━━━━━━━━ ✦ ━━━━━━━━━━━\n\n`;

  texto += gerarLegendaMargens();

  texto += `━━━━━━━━━━━ ✦ ━━━━━━━━━━━\n`;
  texto += `📖 𝐅𝐈𝐂𝐇𝐀 𝐃𝐎 𝐋𝐄𝐈𝐓𝐎𝐑\n`;
  texto += `━━━━━━━━━━━ ✦ ━━━━━━━━━━━\n\n`;

  for (const membro of membros) {
    const pontosAcumulados = await calcularPontosAcumulados(membro.id);
    const emojisObra1Bruto = await gerarEmojisAcumulados(membro.id, "obra1Status");
    const emojisObra1 = traduzirEmojisMargens(emojisObra1Bruto);

    const feedbacks = await contarFeedbacksAcumulados(membro.id);
    const extras = await contarExtrasAcumulados(membro.id);

    const feedbackTexto = repetirCheck(feedbacks);
    const extrasTexto = repetirCheck(extras);

    texto += `━━━━━━━━━━━ ✦ ━━━━━━━━━━━\n\n`;

    texto += `🗝️ 𝐍𝐨𝐦𝐞: ${membro.nome}\n`;
    texto += `🧭 𝐔𝐬𝐞𝐫: ${limparUser(membro.user)}\n\n`;

    texto += `🌙 𝐒𝐞𝐦𝐚𝐧𝐚𝐬: ${membro.semana ?? 0}\n`;
    texto += `📅 𝐃𝐢𝐚𝐬: ${diasAcumulados}\n`;
    texto += `⭐ 𝐏𝐨𝐧𝐭𝐨𝐬: ${pontosAcumulados}\n`;
    texto += `💬 𝐅𝐞𝐞𝐝𝐛𝐚𝐜𝐤: ${feedbackTexto}\n`;
    texto += `🌌 𝐋𝐞𝐢𝐭𝐮𝐫𝐚 𝐋𝐮𝐧𝐚𝐫:\n\n`;

    texto += `📖 𝐌𝐮𝐧𝐝𝐨 𝟎𝟏: ${emojisObra1}\n\n`;

    texto += `🗺️ 𝐋𝐞𝐢𝐭𝐮𝐫𝐚 𝐄𝐱𝐭𝐫𝐚: ${extrasTexto}\n\n`;
  }

  texto += `━━━━━━━━━━━ ✦ ━━━━━━━━━━━\n\n`;
  texto += gerarMensagemAtencaoMargens();

  return texto;
}

function gerarLegendaTrono() {
  let texto = "";

  texto += `🌙 𝐋𝐞𝐮\n`;
  texto += `☠️ 𝐍𝐚̃𝐨 𝐥𝐞𝐮\n`;
  texto += `💅 𝐉𝐮𝐬𝐭𝐢𝐟𝐢𝐜𝐚𝐝𝐨\n`;
  texto += `📜 𝐉𝐚́ 𝐡𝐚𝐯𝐢𝐚 𝐥𝐢𝐝𝐨 𝐚𝐧𝐭𝐞𝐬\n`;
  texto += `🙍 𝐅𝐚𝐥𝐭𝐚 𝐚𝐥𝐠𝐨 (𝐜𝐨𝐦𝐞𝐧𝐭𝐚́𝐫𝐢𝐨 𝐨𝐮 𝐯𝐨𝐭𝐨)\n`;
  texto += `✨ 𝐎𝐛𝐫𝐚 𝐝𝐨 𝐝𝐢𝐚\n`;
  texto += `⏳ 𝐒𝐞𝐦 𝐨𝐛𝐫𝐚\n`;
  texto += `⚰️ 𝐒𝐚𝐢𝐮 𝐝𝐨 𝐠𝐫𝐮𝐩𝐨\n`;
  texto += `🕯️ 𝐋𝐞𝐢𝐭𝐮𝐫𝐚 𝐞𝐦 𝐚𝐧𝐝𝐚𝐦𝐞𝐧𝐭𝐨 𝐧𝐨 𝐦𝐨𝐦𝐞𝐧𝐭𝐨 𝐝𝐚 𝐯𝐞𝐫𝐢𝐟𝐢𝐜𝐚𝐜̧𝐚̃𝐨\n`;
  texto += `⚠️ 𝐈𝐧𝐟𝐫𝐚𝐜̧𝐚̃𝐨 𝐝𝐚𝐬 𝐫𝐞𝐠𝐫𝐚𝐬\n`;
  texto += `🚫 𝐈𝐧𝐟𝐫𝐚𝐜̧𝐚̃𝐨 𝐧𝐨 𝐭𝐞𝐦𝐩𝐨 𝐝𝐞 𝐥𝐞𝐢𝐭𝐮𝐫𝐚\n`;
  texto += `📲 𝐏𝐫𝐢𝐧𝐭𝐬 𝐧𝐨 𝐩𝐯\n`;
  texto += `⛔ 𝐑𝐞𝐦𝐨𝐯𝐢𝐝𝐨 𝐩𝐨𝐫 𝐢𝐧𝐟𝐫𝐚𝐜̧𝐚̃𝐨 𝐝𝐚𝐬 𝐫𝐞𝐠𝐫𝐚𝐬\n`;
  texto += `⏰ 𝐋𝐞𝐢𝐭𝐮𝐫𝐚 𝐟𝐞𝐢𝐭𝐚 𝐞𝐦 𝐭𝐞𝐦𝐩𝐨 𝐞𝐬𝐭𝐢𝐦𝐚𝐝𝐨\n\n`;

  return texto;
}

function gerarLegendaChama() {
  let texto = "";

  texto += `🌙𝐋𝐞𝐮\n`;
  texto += `☠𝐍𝐚̃𝐨 𝐥𝐞𝐮\n`;
  texto += `💅 𝐉𝐮𝐬𝐭𝐢𝐟𝐢𝐜𝐚𝐝𝐨\n`;
  texto += `🌼 𝐉𝐚́ 𝐡𝐚𝐯𝐢𝐚 𝐥𝐢𝐝𝐨 𝐚𝐧𝐭𝐞𝐬\n`;
  texto += `🙍 𝐅𝐚𝐥𝐭𝐚 𝐚𝐥𝐠𝐨 (𝐜𝐨𝐦𝐞𝐧𝐭𝐚́𝐫𝐢𝐨 𝐨𝐮 𝐯𝐨𝐭𝐨)\n`;
  texto += `✨𝐎𝐛𝐫𝐚 𝐝𝐨 𝐝𝐢𝐚\n`;
  texto += `⏳ 𝐒𝐞𝐦 𝐨𝐛𝐫𝐚\n`;
  texto += `⚰ 𝐒𝐚𝐢𝐮 𝐝𝐨 𝐠𝐫𝐮𝐩𝐨\n`;
  texto += `🧕🏻 𝐋𝐞𝐢𝐭𝐮𝐫𝐚 𝐞𝐦 𝐚𝐧𝐝𝐚𝐦𝐞𝐧𝐭𝐨 𝐧𝐨 𝐦𝐨𝐦𝐞𝐧𝐭𝐨 𝐝𝐚 𝐯𝐞𝐫𝐢𝐟𝐢𝐜𝐚𝐜̧𝐚̃𝐨\n`;
  texto += `⚠ 𝐈𝐧𝐟𝐫𝐚𝐜̧𝐚̃𝐨 𝐝𝐚𝐬 𝐫𝐞𝐠𝐫𝐚𝐬\n`;
  texto += `📲 𝐏𝐫𝐢𝐧𝐭𝐬 𝐧𝐨 𝐩𝐯\n`;
  texto += `⛔ 𝐑𝐞𝐦𝐨𝐯𝐢𝐝𝐨 𝐩𝐨𝐫 𝐢𝐧𝐟𝐫𝐚𝐜̧𝐚̃𝐨 𝐝𝐚𝐬 𝐫𝐞𝐠𝐫𝐚𝐬\n`;
  texto += `⏰Leitura feita em tempo estimado\n\n\n`;
  texto += `_____________\n\n`;

  return texto;
}

function gerarLegendaPagina() {
  let texto = "";

  texto += `🌙 𝐋𝐞𝐮\n`;
  texto += `☠ 𝐍𝐚̃𝐨 𝐥𝐞𝐮\n`;
  texto += `💅 𝐉𝐮𝐬𝐭𝐢𝐟𝐢𝐜𝐚𝐝𝐨\n`;
  texto += `🌼 𝐉𝐚́ 𝐡𝐚𝐯𝐢𝐚 𝐥𝐢𝐝𝐨 𝐚𝐧𝐭𝐞𝐬\n`;
  texto += `🙍 𝐅𝐚𝐥𝐭𝐚 𝐚𝐥𝐠𝐨 (𝐜𝐨𝐦𝐞𝐧𝐭𝐚́𝐫𝐢𝐨 𝐨𝐮 𝐯𝐨𝐭𝐨)\n`;
  texto += `✨𝐎𝐛𝐫𝐚 𝐝𝐨 𝐝𝐢𝐚\n`;
  texto += `⏳ 𝐒𝐞𝐦 𝐨𝐛𝐫𝐚\n`;
  texto += `⚰ 𝐒𝐚𝐢𝐮 𝐝𝐨 𝐠𝐫𝐮𝐩𝐨\n`;
  texto += `🧕🏻 𝐋𝐞𝐢𝐭𝐮𝐫𝐚 𝐞𝐦 𝐚𝐧𝐝𝐚𝐦𝐞𝐧𝐭𝐨 𝐧𝐨 𝐦𝐨𝐦𝐞𝐧𝐭𝐨 𝐝𝐚 𝐯𝐞𝐫𝐢𝐟𝐢𝐜𝐚𝐜̧𝐚̃𝐨\n`;
  texto += `⚠ 𝐈𝐧𝐟𝐫𝐚𝐜̧𝐚̃𝐨 𝐝𝐚𝐬 𝐫𝐞𝐠𝐫𝐚𝐬\n`;
  texto += `🚫 𝐈𝐧𝐟𝐫𝐚𝐜̧𝐚̃𝐨 𝐧𝐨 𝐭𝐞𝐦𝐩𝐨 𝐝𝐞 𝐥𝐞𝐢𝐭𝐮𝐫𝐚 (𝐭𝐞𝐦𝐩𝐨 𝐢𝐧𝐟𝐞𝐫𝐢𝐨𝐫)\n`;
  texto += `📲 𝐏𝐫𝐢𝐧𝐭𝐬 𝐧𝐨 𝐩𝐯\n`;
  texto += `⛔ 𝐑𝐞𝐦𝐨𝐯𝐢𝐝𝐨 𝐩𝐨𝐫 𝐢𝐧𝐟𝐫𝐚𝐜̧𝐚̃𝐨 𝐝𝐚𝐬 𝐫𝐞𝐠𝐫𝐚𝐬\n`;
  texto += `⏰ *Leitura não feita em tempo estimado*\n\n`;
  texto += `_______________\n\n`;

  return texto;
}

function gerarLegendaMargens() {
  let texto = "";

  texto += `🌙 𝐋𝐞𝐮\n`;
  texto += `🌑 𝐍𝐚̃𝐨 𝐥𝐞𝐮\n`;
  texto += `💅 𝐉𝐮𝐬𝐭𝐢𝐟𝐢𝐜𝐚𝐝𝐨\n`;
  texto += `📜 𝐉𝐚́ 𝐡𝐚𝐯𝐢𝐚 𝐥𝐢𝐝𝐨 𝐚𝐧𝐭𝐞𝐬\n`;
  texto += `🙍 𝐅𝐚𝐥𝐭𝐚 𝐚𝐥𝐠𝐨 (𝐜𝐨𝐦𝐞𝐧𝐭𝐚́𝐫𝐢𝐨 𝐨𝐮 𝐯𝐨𝐭𝐨)\n`;
  texto += `✨ 𝐎𝐛𝐫𝐚 𝐝𝐨 𝐝𝐢𝐚\n`;
  texto += `⏳ 𝐒𝐞𝐦 𝐨𝐛𝐫𝐚\n`;
  texto += `🚪 𝐒𝐚𝐢𝐮 𝐝𝐨 𝐠𝐫𝐮𝐩𝐨\n`;
  texto += `🧭 𝐋𝐞𝐢𝐭𝐮𝐫𝐚 𝐞𝐦 𝐚𝐧𝐝𝐚𝐦𝐞𝐧𝐭𝐨 𝐧𝐨 𝐦𝐨𝐦𝐞𝐧𝐭𝐨 𝐝𝐚 𝐯𝐞𝐫𝐢𝐟𝐢𝐜𝐚𝐜̧𝐚̃𝐨\n`;
  texto += `⚠️ 𝐈𝐧𝐟𝐫𝐚𝐜̧𝐚̃𝐨 𝐝𝐚𝐬 𝐫𝐞𝐠𝐫𝐚𝐬\n`;
  texto += `🚫 𝐈𝐧𝐟𝐫𝐚𝐜̧𝐚̃𝐨 𝐧𝐨 𝐭𝐞𝐦𝐩𝐨 𝐝𝐞 𝐥𝐞𝐢𝐭𝐮𝐫𝐚\n`;
  texto += `📲 𝐏𝐫𝐢𝐧𝐭𝐬 𝐧𝐨 𝐩𝐯\n`;
  texto += `⛔ 𝐑𝐞𝐦𝐨𝐯𝐢𝐝𝐨 𝐩𝐨𝐫 𝐢𝐧𝐟𝐫𝐚𝐜̧𝐚̃𝐨 𝐝𝐚𝐬 𝐫𝐞𝐠𝐫𝐚𝐬\n`;
  texto += `⏰ 𝐋𝐞𝐢𝐭𝐮𝐫𝐚 𝐟𝐞𝐢𝐭𝐚 𝐞𝐦 𝐭𝐞𝐦𝐩𝐨 𝐞𝐬𝐭𝐢𝐦𝐚𝐝𝐨\n\n`;

  return texto;
}

function gerarMensagemAtencaoTronoProfano() {
  let texto = "";

  texto += `🚨 𝐀𝐓𝐄𝐍𝐂̧𝐀̃𝐎 🚨\n\n`;
  texto += `𝐏𝐚𝐫𝐚 𝐠𝐚𝐫𝐚𝐧𝐭𝐢𝐫 𝐚 𝐨 𝐛𝐨𝐦 𝐚𝐧𝐝𝐚𝐦𝐞𝐧𝐭𝐨 𝐝𝐨 𝐓𝐫𝐨𝐧𝐨 𝐏𝐫𝐨𝐟𝐚𝐧𝐨, 𝐞́ 𝐢𝐦𝐩𝐨𝐫𝐭𝐚𝐧𝐭𝐞 𝐪𝐮𝐞 𝐭𝐨𝐝𝐨𝐬 𝐞𝐬𝐭𝐞𝐣𝐚𝐦 𝐞𝐦 𝐝𝐢𝐚 𝐜𝐨𝐦 𝐬𝐮𝐚𝐬 𝐥𝐞𝐢𝐭𝐮𝐫𝐚𝐬.\n\n`;
  texto += `𝐒𝐞 𝐯𝐨𝐜𝐞̂ 𝐟𝐢𝐜𝐨𝐮 𝐝𝐞𝐯𝐞𝐧𝐝𝐨 𝐥𝐞𝐢𝐭𝐮𝐫𝐚, 𝐩𝐨𝐫 𝐟𝐚𝐯𝐨𝐫, 𝐞𝐧𝐯𝐢𝐞 𝐨𝐬 𝐩𝐫𝐢𝐧𝐭𝐬 𝐧𝐨 𝐩𝐫𝐢𝐯𝐚𝐝𝐨 𝐩𝐚𝐫𝐚 𝐪𝐮𝐞 𝐞𝐮 𝐩𝐨𝐬𝐬𝐚 𝐚𝐭𝐮𝐚𝐥𝐢𝐳𝐚𝐫 𝐬𝐞𝐮𝐬 𝐫𝐞𝐠𝐢𝐬𝐭𝐫𝐨𝐬.\n\n`;
  texto += `𝐈𝐬𝐬𝐨 𝐞𝐯𝐢𝐭𝐚 𝐪𝐮𝐞 𝐞𝐮 𝐩𝐞𝐫𝐜𝐚 𝐭𝐞𝐦𝐩𝐨 𝐜𝐨𝐧𝐟𝐞𝐫𝐢𝐧𝐝𝐨 𝐚 𝐦𝐞𝐬𝐦𝐚 𝐜𝐨𝐢𝐬𝐚 𝐝𝐮𝐚𝐬 𝐯𝐞𝐳𝐞𝐬. 𝐀𝐥𝐞́𝐦 𝐝𝐢𝐬𝐬𝐨, 𝐬𝐞 𝐯𝐨𝐜𝐞̂ 𝐞𝐧𝐜𝐨𝐧𝐭𝐫𝐚𝐫 𝐚𝐥𝐠𝐮𝐦 𝐞𝐫𝐫𝐨 𝐧𝐚𝐬 𝐯𝐞𝐫𝐢𝐟𝐢𝐜𝐚𝐜̧𝐨̃𝐞𝐬, 𝐦𝐞 𝐜𝐡𝐚𝐦𝐞 𝐧𝐨 𝐩𝐫𝐢𝐯𝐚𝐝𝐨 𝐩𝐚𝐫𝐚 𝐪𝐮𝐞 𝐞𝐮 𝐩𝐨𝐬𝐬𝐚 𝐜𝐨𝐫𝐫𝐢𝐠𝐢𝐫.\n\n`;
  texto += `🔥 𝐕𝐚𝐦𝐨𝐬 𝐦𝐚𝐧𝐭𝐞𝐫 𝐨 𝐠𝐫𝐮𝐩𝐨 𝐨𝐫𝐠𝐚𝐧𝐢𝐳𝐚𝐝𝐨, 𝐚𝐬 𝐥𝐞𝐢𝐭𝐮𝐫𝐚𝐬 𝐞𝐦 𝐝𝐢𝐚 𝐞 𝐚𝐬 𝐨𝐛𝐫𝐚𝐬 𝐝𝐢𝐠𝐧𝐚
