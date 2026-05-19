import { db } from "./firebase.js";

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

import { COLLECTION_ROOT, DEFAULT_SUBS, DEFAULT_MODELOS } from "./config.js";
import { getTodayISO, ordenarPorCriacao } from "./utils.js";

function subDoc(subId) {
  return doc(db, COLLECTION_ROOT, subId);
}

function membrosCollection(subId) {
  return collection(db, COLLECTION_ROOT, subId, "membros");
}

function obrasCollection(subId) {
  return collection(db, COLLECTION_ROOT, subId, "obras");
}

function verificacoesCollection(subId) {
  return collection(db, COLLECTION_ROOT, subId, "verificacoes");
}

function gradeDoc(subId) {
  return doc(db, COLLECTION_ROOT, subId, "config", "gradeSemanal");
}

function verificacaoDoc(subId, dia) {
  return doc(db, COLLECTION_ROOT, subId, "verificacoes", dia);
}

function modelosPadrao(modelo) {
  return DEFAULT_MODELOS[modelo] || DEFAULT_MODELOS.trono;
}

/* SUBS */

export async function criarSubsPadraoSeNecessario() {
  const snap = await getDocs(collection(db, COLLECTION_ROOT));

  if (!snap.empty) return;

  for (const sub of Object.values(DEFAULT_SUBS)) {
    await setDoc(subDoc(sub.id), {
      ...sub,
      criadoEm: getTodayISO(),
      atualizadoEm: getTodayISO()
    }, { merge: true });
  }
}

export async function listarSubs() {
  const snap = await getDocs(collection(db, COLLECTION_ROOT));

  const subs = snap.docs.map(docSnap => ({
    id: docSnap.id,
    ...docSnap.data()
  }));

  return subs.sort((a, b) => String(a.id || "").localeCompare(String(b.id || "")));
}

export async function buscarSub(subId) {
  const snap = await getDoc(subDoc(subId));

  if (!snap.exists()) return null;

  return {
    id: snap.id,
    ...snap.data()
  };
}

export async function salvarSub(sub) {
  const id = String(sub.id || "").trim().toUpperCase();
  const modelo = sub.modelo || "chama";

  if (!id) {
    throw new Error("Código do sub obrigatório.");
  }

  await setDoc(subDoc(id), {
    id,
    nome: sub.nome || id,
    botao: sub.botao || sub.nome || id,
    subtitulo: sub.subtitulo || `Sub Lunar ${id}`,
    cor: sub.cor || "#10b981",
    modelo,
    obrasPorDia: Number(sub.obrasPorDia || 2),
    ativo: Boolean(sub.ativo),
    modelos: {
      ...modelosPadrao(modelo),
      ...(sub.modelos || {})
    },
    atualizadoEm: getTodayISO(),
    criadoEm: sub.criadoEm || getTodayISO()
  }, { merge: true });
}

export async function atualizarSub(subId, dados) {
  const modelo = dados.modelo || "chama";

  await updateDoc(subDoc(subId), {
    nome: dados.nome,
    botao: dados.botao,
    subtitulo: dados.subtitulo,
    cor: dados.cor,
    modelo,
    obrasPorDia: Number(dados.obrasPorDia || 2),
    ativo: Boolean(dados.ativo),
    modelos: {
      ...modelosPadrao(modelo),
      ...(dados.modelos || {})
    },
    atualizadoEm: getTodayISO()
  });
}

export async function excluirSub(subId) {
  await deleteDoc(subDoc(subId));
}

export async function garantirSub(sub) {
  const modelo = sub?.modelo || "chama";

  await setDoc(subDoc(sub.id), {
    ...sub,
    modelos: {
      ...modelosPadrao(modelo),
      ...(sub?.modelos || {})
    },
    atualizadoEm: getTodayISO()
  }, { merge: true });
}

/* MEMBROS */

export async function listarMembros(subId) {
  const snap = await getDocs(membrosCollection(subId));

  const membros = snap.docs.map(docSnap => ({
    id: docSnap.id,
    ...docSnap.data()
  }));

  return ordenarPorCriacao(membros);
}

export async function buscarMembro(subId, membroId) {
  const ref = doc(db, COLLECTION_ROOT, subId, "membros", membroId);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;

  return {
    id: snap.id,
    ...snap.data()
  };
}

export async function criarMembro(subId, dados) {
  await addDoc(membrosCollection(subId), {
    nome: dados.nome,
    user: dados.user,
    semana: Number(dados.semana || 0),
    criadoEm: getTodayISO(),
    atualizadoEm: getTodayISO()
  });
}

export async function atualizarMembro(subId, membroId, dados) {
  const ref = doc(db, COLLECTION_ROOT, subId, "membros", membroId);

  await updateDoc(ref, {
    nome: dados.nome,
    user: dados.user,
    semana: Number(dados.semana || 0),
    atualizadoEm: getTodayISO()
  });
}

export async function excluirMembro(subId, membroId) {
  const membroRef = doc(db, COLLECTION_ROOT, subId, "membros", membroId);
  await deleteDoc(membroRef);

  const obras = await listarObras(subId);

  for (const obra of obras) {
    if (obra.membroId === membroId) {
      await excluirObra(subId, obra.id);
    }
  }
}

/* OBRAS */

export async function listarObras(subId) {
  const snap = await getDocs(obrasCollection(subId));

  const obras = snap.docs.map(docSnap => ({
    id: docSnap.id,
    ...docSnap.data()
  }));

  return ordenarPorCriacao(obras);
}

export async function buscarObra(subId, obraId) {
  const ref = doc(db, COLLECTION_ROOT, subId, "obras", obraId);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;

  return {
    id: snap.id,
    ...snap.data()
  };
}

export async function criarObra(subId, dados) {
  await addDoc(obrasCollection(subId), {
    titulo: dados.titulo,
    link: dados.link || "",
    membroId: dados.membroId,

    isPoesia: Boolean(dados.isPoesia),

    capitulosMais4100: dados.capitulosMais4100 || "",
    capitulosMenos500: dados.capitulosMenos500 || "",
    prologoMais1000: Boolean(dados.prologoMais1000),

    observacoes: dados.observacoes || "",

    alternativaTitulo: dados.alternativaTitulo || "",
    alternativaLink: dados.alternativaLink || "",
    alternativaObservacoes: dados.alternativaObservacoes || "",

    criadoEm: getTodayISO(),
    atualizadoEm: getTodayISO()
  });
}

export async function atualizarObra(subId, obraId, dados) {
  const ref = doc(db, COLLECTION_ROOT, subId, "obras", obraId);

  await updateDoc(ref, {
    titulo: dados.titulo,
    link: dados.link || "",
    membroId: dados.membroId,

    isPoesia: Boolean(dados.isPoesia),

    capitulosMais4100: dados.capitulosMais4100 || "",
    capitulosMenos500: dados.capitulosMenos500 || "",
    prologoMais1000: Boolean(dados.prologoMais1000),

    observacoes: dados.observacoes || "",

    alternativaTitulo: dados.alternativaTitulo || "",
    alternativaLink: dados.alternativaLink || "",
    alternativaObservacoes: dados.alternativaObservacoes || "",

    atualizadoEm: getTodayISO()
  });
}

export async function excluirObra(subId, obraId) {
  const ref = doc(db, COLLECTION_ROOT, subId, "obras", obraId);
  await deleteDoc(ref);

  const grade = await buscarGrade(subId);

  let alterou = false;

  Object.keys(grade).forEach(dia => {
    if (grade[dia]?.obra1 === obraId) {
      grade[dia].obra1 = "";
      alterou = true;
    }

    if (grade[dia]?.obra2 === obraId) {
      grade[dia].obra2 = "";
      alterou = true;
    }
  });

  if (alterou) {
    await salvarGrade(subId, grade);
  }
}

/* GRADE */

export async function buscarGrade(subId) {
  const snap = await getDoc(gradeDoc(subId));

  if (!snap.exists()) return {};

  return snap.data();
}

export async function salvarGrade(subId, grade) {
  await setDoc(gradeDoc(subId), {
    ...grade,
    atualizadoEm: getTodayISO()
  });
}

/* VERIFICAÇÕES */

export async function listarVerificacoes(subId) {
  const snap = await getDocs(verificacoesCollection(subId));

  const dados = {};

  snap.docs.forEach(docSnap => {
    dados[docSnap.id] = docSnap.data();
  });

  return dados;
}

export async function buscarVerificacaoDia(subId, dia) {
  const snap = await getDoc(verificacaoDoc(subId, dia));

  if (!snap.exists()) return null;

  return snap.data();
}

export async function salvarVerificacaoDia(subId, dia, dados) {
  await setDoc(verificacaoDoc(subId, dia), {
    ...dados,
    dia,
    atualizadoEm: getTodayISO()
  });
}

export async function limparVerificacoesDaSemana(subId, diasSemana) {
  for (const dia of diasSemana) {
    await deleteDoc(verificacaoDoc(subId, dia));
  }
}