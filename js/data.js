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

import { COLLECTION_ROOT, CONFIG_ROOT, DEFAULT_SUBS, DEFAULT_MODELOS, SUBS_OFICIAIS } from "./config.js";
import { getTodayISO, ordenarPorCriacao } from "./utils.js";

const MIGRACAO_SUBS_OFICIAIS_ID = "recadastro_subs_oficiais_modelos_a10_a17_2026_07_31";

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

function subConfigCollection(subId) {
  return collection(db, COLLECTION_ROOT, subId, "config");
}

function configDoc(id) {
  return doc(db, CONFIG_ROOT, id);
}

function modelosPadrao(modelo) {
  return DEFAULT_MODELOS[modelo] || DEFAULT_MODELOS.trono;
}

function normalizarSubId(subId) {
  return String(subId || "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "")
    .replace(/^([A-Z]+)-(\d+)$/, "$1$2");
}

function separarCodigoSub(subId) {
  const texto = normalizarSubId(subId);
  const match = texto.match(/^([A-Z]+)(\d+)$/);

  if (!match) {
    return {
      prefixo: texto,
      numero: Number.MAX_SAFE_INTEGER
    };
  }

  return {
    prefixo: match[1],
    numero: Number(match[2])
  };
}

function compararCodigoSub(a, b) {
  const codigoA = separarCodigoSub(a?.id || a);
  const codigoB = separarCodigoSub(b?.id || b);
  const prefixo = codigoA.prefixo.localeCompare(codigoB.prefixo);

  if (prefixo !== 0) return prefixo;
  if (codigoA.numero !== codigoB.numero) return codigoA.numero - codigoB.numero;

  return String(a?.id || a || "").localeCompare(String(b?.id || b || ""));
}

async function excluirDocumentosDaColecao(collectionRef) {
  const snap = await getDocs(collectionRef);

  for (const docSnap of snap.docs) {
    await deleteDoc(docSnap.ref);
  }
}

async function excluirDadosDoSub(subId) {
  await excluirDocumentosDaColecao(membrosCollection(subId));
  await excluirDocumentosDaColecao(obrasCollection(subId));
  await excluirDocumentosDaColecao(verificacoesCollection(subId));
  await excluirDocumentosDaColecao(subConfigCollection(subId));
}

function normalizarObra(dados) {
  return {
    titulo: dados.titulo || "",
    link: dados.link || "",
    membroId: dados.membroId || "",

    isPoesia: Boolean(dados.isPoesia),

    capitulosMais4100: dados.capitulosMais4100 || "",
    capitulosMenos500: dados.capitulosMenos500 || "",
    prologoMais1000: Boolean(dados.prologoMais1000),

    observacoes: dados.observacoes || "",

    alternativaTitulo: dados.alternativaTitulo || "",
    alternativaLink: dados.alternativaLink || "",

    alternativaIsPoesia: Boolean(dados.alternativaIsPoesia),
    alternativaCapitulosMais4100: dados.alternativaCapitulosMais4100 || "",
    alternativaCapitulosMenos500: dados.alternativaCapitulosMenos500 || "",
    alternativaPrologoMais1000: Boolean(dados.alternativaPrologoMais1000),

    alternativaObservacoes: dados.alternativaObservacoes || ""
  };
}

/* CONFIG GERAL */

export async function buscarConfigGeral(id) {
  const snap = await getDoc(configDoc(id));

  if (!snap.exists()) return null;

  return {
    id: snap.id,
    ...snap.data()
  };
}

export async function salvarConfigGeral(id, dados) {
  await setDoc(configDoc(id), {
    ...dados,
    atualizadoEm: getTodayISO()
  }, { merge: true });
}

/* SUBS */

export async function criarSubsPadraoSeNecessario() {
  const snap = await getDocs(collection(db, COLLECTION_ROOT));
  const subsExistentes = new Map(snap.docs.map(docSnap => [docSnap.id, docSnap.data()]));
  const migracaoSnap = await getDoc(configDoc(MIGRACAO_SUBS_OFICIAIS_ID));
  const deveRecadastrarSubsOficiais = !migracaoSnap.exists();
  const idsOficiais = new Set(SUBS_OFICIAIS);

  for (const subId of SUBS_OFICIAIS) {
    const sub = DEFAULT_SUBS[subId];

    if (!sub) continue;

    const existente = subsExistentes.get(sub.id);

    if (!deveRecadastrarSubsOficiais && existente) {
      continue;
    }

    await setDoc(subDoc(sub.id), {
      ...sub,
      criadoEm: existente?.criadoEm || getTodayISO(),
      atualizadoEm: getTodayISO()
    });
  }

  if (!deveRecadastrarSubsOficiais) {
    return;
  }

  const falhasExclusao = [];

  for (const docSnap of snap.docs) {
    const subId = docSnap.id;

    if (!idsOficiais.has(subId)) {
      try {
        await excluirSub(subId);
      } catch (error) {
        console.error(`Erro ao excluir o sub antigo ${subId}:`, error);
        falhasExclusao.push(subId);
      }
    }
  }

  if (falhasExclusao.length) {
    return;
  }

  await setDoc(configDoc(MIGRACAO_SUBS_OFICIAIS_ID), {
    aplicadoEm: getTodayISO(),
    subs: SUBS_OFICIAIS
  });
}

export async function listarSubs() {
  const snap = await getDocs(collection(db, COLLECTION_ROOT));

  const subs = snap.docs.map(docSnap => ({
    id: docSnap.id,
    ...docSnap.data()
  }));

  return subs.sort(compararCodigoSub);
}

export async function buscarSub(subId) {
  const snap = await getDoc(subDoc(normalizarSubId(subId)));

  if (!snap.exists()) return null;

  return {
    id: snap.id,
    ...snap.data()
  };
}

export async function salvarSub(sub) {
  const id = normalizarSubId(sub.id);
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
    icone: sub.icone || "",
    modelos: {
      ...modelosPadrao(modelo),
      ...(sub.modelos || {})
    },
    atualizadoEm: getTodayISO(),
    criadoEm: sub.criadoEm || getTodayISO()
  }, { merge: true });
}

export async function atualizarSub(subId, dados) {
  const id = normalizarSubId(subId);
  const modelo = dados.modelo || "chama";

  await updateDoc(subDoc(id), {
    nome: dados.nome,
    botao: dados.botao,
    subtitulo: dados.subtitulo,
    cor: dados.cor,
    modelo,
    obrasPorDia: Number(dados.obrasPorDia || 2),
    ativo: Boolean(dados.ativo),
    icone: dados.icone || "",
    modelos: {
      ...modelosPadrao(modelo),
      ...(dados.modelos || {})
    },
    atualizadoEm: getTodayISO()
  });
}

export async function excluirSub(subId) {
  const id = normalizarSubId(subId);

  if (!id) {
    throw new Error("Código do sub obrigatório.");
  }

  try {
    await excluirDadosDoSub(id);
  } catch (error) {
    console.error(`Erro ao limpar dados internos do sub ${id}:`, error);
  }

  await deleteDoc(subDoc(id));
}

export async function garantirSub(sub) {
  const id = normalizarSubId(sub?.id);
  const modelo = sub?.modelo || "chama";

  if (!id) return;

  await setDoc(subDoc(id), {
    ...sub,
    id,
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
  const ref = await addDoc(membrosCollection(subId), {
    nome: dados.nome || "",
    user: dados.user || "",
    semana: Number(dados.semana || 0),
    ativo: dados.ativo !== false,
    criadoEm: getTodayISO(),
    atualizadoEm: getTodayISO()
  });

  return ref.id;
}

export async function atualizarMembro(subId, membroId, dados) {
  const ref = doc(db, COLLECTION_ROOT, subId, "membros", membroId);

  await updateDoc(ref, {
    nome: dados.nome || "",
    user: dados.user || "",
    semana: Number(dados.semana || 0),
    ativo: dados.ativo !== false,
    atualizadoEm: getTodayISO()
  });
}

export async function atualizarStatusMembro(subId, membroId, ativo) {
  const ref = doc(db, COLLECTION_ROOT, subId, "membros", membroId);

  await updateDoc(ref, {
    ativo: Boolean(ativo),
    atualizadoEm: getTodayISO()
  });
}

export async function atualizarSemanaMembro(subId, membroId, novaSemana) {
  const ref = doc(db, COLLECTION_ROOT, subId, "membros", membroId);

  await updateDoc(ref, {
    semana: Number(novaSemana || 0),
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
  const obra = normalizarObra(dados);

  const ref = await addDoc(obrasCollection(subId), {
    ...obra,
    criadoEm: getTodayISO(),
    atualizadoEm: getTodayISO()
  });

  return ref.id;
}

export async function atualizarObra(subId, obraId, dados) {
  const ref = doc(db, COLLECTION_ROOT, subId, "obras", obraId);
  const obra = normalizarObra(dados);

  await updateDoc(ref, {
    ...obra,
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
