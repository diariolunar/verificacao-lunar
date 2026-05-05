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

async function buscarMembros() {
  const sub = getSubAtual();
  const ref = collection(db, "subs", sub, "membros");
  const snap = await getDocs(ref);

  return snap.docs.map(docSnap => ({
    id: docSnap.id,
    ...docSnap.data()
  }));
}

async function buscarObras() {
  const sub = getSubAtual();
  const ref = collection(db, "subs", sub, "obras");
  const snap = await getDocs(ref);

  return snap.docs.map(docSnap => ({
    id: docSnap.id,
    ...docSnap.data()
  }));
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

/* =========================
   INÍCIO / AUTH
========================= */

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
  let membro = { nome: "", user: "" };
  const editando = Boolean(id);

  if (editando) {
    const sub = getSubAtual();
    const ref = doc(db, "subs", sub, "membros", id);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      membro = snap.data();
    }
  }

  app.innerHTML = `
    <div class="page-box form-box">
      <h2>${editando ? "Editar Membro" : "Cadastrar Membro"}</h2>

      <label>Nome</label>
      <input id="nomeMembro" placeholder="Nome do membro" value="${escapeHTML(membro.nome)}">

      <label>User</label>
      <input id="userMembro" placeholder="@user" value="${escapeHTML(membro.user)}">

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

  if (!nome || !user) {
    alert("Preencha nome e user.");
    return;
  }

  await addDoc(collection(db, "subs", sub, "membros"), {
    nome,
    user,
    criadoEm: new Date().toISOString()
  });

  await telaMembros();
}

async function salvarEdicaoMembro(id) {
  const sub = getSubAtual();

  const nome = document.getElementById("nomeMembro").value.trim();
  const user = document.getElementById("userMembro").value.trim();

  if (!nome || !user) {
    alert("Preencha nome e user.");
    return;
  }

  await updateDoc(doc(db, "subs", sub, "membros", id), {
    nome,
    user
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

/* =========================
   OBRAS
========================= */

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

/* =========================
   GRADE SEMANAL
========================= */

async function telaGrade() {
  const obras = await buscarObras();
  const grade = await buscarGrade();

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

  const linhas = diasSemana.map(dia => `
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
  `).join("");

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
      document.getElementById(`${dia}_obra1`).value = grade[dia].obra1 || "";
      document.getElementById(`${dia}_obra2`).value = grade[dia].obra2 || "";
    }
  });

  aplicarTema();
}

async function salvarGrade() {
  const novaGrade = {};

  diasSemana.forEach(dia => {
    novaGrade[dia] = {
      obra1: document.getElementById(`${dia}_obra1`).value,
      obra2: document.getElementById(`${dia}_obra2`).value
    };
  });

  await salvarGradeBanco(novaGrade);

  alert("Grade salva com sucesso!");

  await telaDashboard();
}

/* =========================
   VERIFICAÇÕES
========================= */

async function telaVerificacoes(diaSelecionado = "Segunda") {
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
      obra2Status: "",
      obra2Feedback: false,
      pontos: 0
    };

    return `
      <div class="verificacao-card">
        <div class="verificacao-topo">
          <div>
            <strong>${escapeHTML(membro.nome)}</strong>
            <span>${escapeHTML(membro.user)}</span>
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
          <div class="obra-verificacao">
            <h3>Obra 1</h3>
            <p>${obra1 ? escapeHTML(obra1.titulo) : "Obra não encontrada"}</p>

            <label>Status da leitura</label>
            <select id="membro_${membro.id}_obra1Status" onchange="atualizarPontosTela('${membro.id}')">
              ${gerarOpcoesStatus(dadosMembro.obra1Status)}
            </select>

            <label class="checkbox-label">
              <input 
                type="checkbox" 
                id="membro_${membro.id}_obra1Feedback"
                onchange="atualizarPontosTela('${membro.id}')"
                ${dadosMembro.obra1Feedback ? "checked" : ""}
              >
              Feedback entregue (+20)
            </label>

            <small id="aviso_${membro.id}_obra1" class="feedback-aviso"></small>
          </div>

          <div class="obra-verificacao">
            <h3>Obra 2</h3>
            <p>${obra2 ? escapeHTML(obra2.titulo) : "Obra não encontrada"}</p>

            <label>Status da leitura</label>
            <select id="membro_${membro.id}_obra2Status" onchange="atualizarPontosTela('${membro.id}')">
              ${gerarOpcoesStatus(dadosMembro.obra2Status)}
            </select>

            <label class="checkbox-label">
              <input 
                type="checkbox" 
                id="membro_${membro.id}_obra2Feedback"
                onchange="atualizarPontosTela('${membro.id}')"
                ${dadosMembro.obra2Feedback ? "checked" : ""}
              >
              Feedback entregue (+20)
            </label>

            <small id="aviso_${membro.id}_obra2" class="feedback-aviso"></small>
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

  if (!obra1Completa || !obra2Completa) return 0;

  pontos += 10;

  if (obra1Status === "🌙" && obra1Feedback) pontos += 20;
  if (obra2Status === "🌙" && obra2Feedback) pontos += 20;

  return pontos;
}

function atualizarPontosTela(membroId) {
  const obra1Status = document.getElementById(`membro_${membroId}_obra1Status`)?.value || "";
  const obra2Status = document.getElementById(`membro_${membroId}_obra2Status`)?.value || "";

  const obra1FeedbackCampo = document.getElementById(`membro_${membroId}_obra1Feedback`);
  const obra2FeedbackCampo = document.getElementById(`membro_${membroId}_obra2Feedback`);

  const avisoObra1 = document.getElementById(`aviso_${membroId}_obra1`);
  const avisoObra2 = document.getElementById(`aviso_${membroId}_obra2`);

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

    if (avisoObra1) avisoObra1.textContent = "Feedback só conta se as duas leituras do dia estiverem completas.";
    if (avisoObra2) avisoObra2.textContent = "Feedback só conta se as duas leituras do dia estiverem completas.";
  } else {
    if (obra1FeedbackCampo) {
      if (obra1Status === "🌙") {
        obra1FeedbackCampo.disabled = false;
        if (avisoObra1) avisoObra1.textContent = "";
      } else {
        obra1FeedbackCampo.checked = false;
        obra1FeedbackCampo.disabled = true;
        if (avisoObra1) avisoObra1.textContent = "Não pode entregar feedback da própria obra.";
      }
    }

    if (obra2FeedbackCampo) {
      if (obra2Status === "🌙") {
        obra2FeedbackCampo.disabled = false;
        if (avisoObra2) avisoObra2.textContent = "";
      } else {
        obra2FeedbackCampo.checked = false;
        obra2FeedbackCampo.disabled = true;
        if (avisoObra2) avisoObra2.textContent = "Não pode entregar feedback da própria obra.";
      }
    }
  }

  const obra1Feedback = obra1Status === "🌙" ? obra1FeedbackCampo?.checked || false : false;
  const obra2Feedback = obra2Status === "🌙" ? obra2FeedbackCampo?.checked || false : false;

  const pontos = calcularPontos(obra1Status, obra1Feedback, obra2Status, obra2Feedback);

  const campoPontos = document.getElementById(`pontos_membro_${membroId}`);

  if (campoPontos) {
    campoPontos.textContent = pontos;
  }
}

async function salvarVerificacao(diaSelecionado) {
  const membros = await buscarMembros();

  const dados = {
    dia: diaSelecionado,
    atualizadoEm: new Date().toISOString(),
    membros: {}
  };

  membros.forEach(membro => {
    const obra1Status = document.getElementById(`membro_${membro.id}_obra1Status`).value;
    const obra2Status = document.getElementById(`membro_${membro.id}_obra2Status`).value;

    const obra1Completa = statusQueCompletamLeitura.includes(obra1Status);
    const obra2Completa = statusQueCompletamLeitura.includes(obra2Status);
    const leituraCompleta = obra1Completa && obra2Completa;

    const obra1Feedback = leituraCompleta && obra1Status === "🌙"
      ? document.getElementById(`membro_${membro.id}_obra1Feedback`).checked
      : false;

    const obra2Feedback = leituraCompleta && obra2Status === "🌙"
      ? document.getElementById(`membro_${membro.id}_obra2Feedback`).checked
      : false;

    const pontos = calcularPontos(obra1Status, obra1Feedback, obra2Status, obra2Feedback);

    dados.membros[membro.id] = {
      nome: membro.nome,
      user: membro.user,
      obra1Status,
      obra1Feedback,
      obra2Status,
      obra2Feedback,
      pontos
    };
  });

  await salvarVerificacaoBanco(diaSelecionado, dados);

  alert("Verificação salva no banco de dados!");

  await telaDashboard();
}

/* =========================
   ACUMULADOS
========================= */

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

async function verificarFeedbackAcumulado(membroId) {
  const verificacoes = await buscarVerificacoes();

  let teveFeedback = false;

  diasSemana.forEach(dia => {
    const dados = verificacoes[dia]?.membros?.[membroId];

    if (dados?.obra1Feedback || dados?.obra2Feedback) {
      teveFeedback = true;
    }
  });

  return teveFeedback;
}

/* =========================
   VISUALIZAR FICHA
========================= */

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
  return await montarFichaBase();
}

async function montarFichaBase() {
  const sub = getSubAtual();

  const membros = await buscarMembros();
  const diasAcumulados = await contarDiasComVerificacao();

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

  for (const membro of membros) {
    const pontosAcumulados = await calcularPontosAcumulados(membro.id);
    const emojisObra1 = await gerarEmojisAcumulados(membro.id, "obra1Status");
    const emojisObra2 = await gerarEmojisAcumulados(membro.id, "obra2Status");
    const teveFeedback = await verificarFeedbackAcumulado(membro.id);
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
  }

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

/* =========================
   LOGIN E CONTROLE
========================= */

async function login() {
  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value.trim();

  if (!email || !senha) {
    alert("Preencha e-mail e senha.");
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, senha);
  } catch (error) {
    alert("Erro ao entrar. Verifique o e-mail e a senha.");
  }
}

async function logout() {
  localStorage.removeItem("sub");
  await signOut(auth);
}

async function trocarSub() {
  localStorage.removeItem("sub");
  telaSubs();
}

async function selecionarSub(sub) {
  localStorage.setItem("sub", sub);

  await setDoc(caminhoSub(sub), {
    nome: subs[sub].nome,
    codigo: sub,
    atualizadoEm: new Date().toISOString()
  }, { merge: true });

  await telaDashboard();
}

/* =========================
   TEMA
========================= */

function aplicarTema() {
  const sub = getSubAtual();
  const titulo = document.getElementById("titulo-sub");

  if (!sub || !subs[sub] || !titulo) {
    if (titulo) titulo.textContent = "🌙 Verificação Lunar";
    return;
  }

  titulo.textContent = subs[sub].nome;

  const cor = subs[sub].cor;

  document.querySelector("header").style.borderBottomColor = cor;
  document.querySelector("footer").style.borderTopColor = cor;

  document.querySelectorAll("button").forEach(btn => {
    btn.style.background = cor;
  });
}

/* =========================
   EXPOR FUNÇÕES NO HTML
========================= */

window.login = login;
window.logout = logout;
window.trocarSub = trocarSub;
window.selecionarSub = selecionarSub;

window.telaDashboard = telaDashboard;
window.telaMembros = telaMembros;
window.formMembro = formMembro;
window.adicionarMembro = adicionarMembro;
window.salvarEdicaoMembro = salvarEdicaoMembro;
window.removerMembro = removerMembro;

window.telaObras = telaObras;
window.formObra = formObra;
window.adicionarObra = adicionarObra;
window.salvarEdicaoObra = salvarEdicaoObra;
window.removerObra = removerObra;

window.telaGrade = telaGrade;
window.salvarGrade = salvarGrade;

window.telaVerificacoes = telaVerificacoes;
window.atualizarPontosTela = atualizarPontosTela;
window.salvarVerificacao = salvarVerificacao;

window.telaVisualizarFicha = telaVisualizarFicha;
window.copiarFicha = copiarFicha;
