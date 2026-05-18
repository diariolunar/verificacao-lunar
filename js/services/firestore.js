import { db } from "../../firebase.js";
import { ROOT_COLLECTION, diasSemana } from "../constants.js";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";
import { todayISO } from "../utils.js";

function subDoc(sub) {
  return doc(db, ROOT_COLLECTION, sub);
}

function subCollection(sub, name) {
  return collection(db, ROOT_COLLECTION, sub, name);
}

export async function ensureSub(sub, config) {
  await setDoc(subDoc(sub), { ...config, atualizadoEm: todayISO() }, { merge: true });
}

export async function listMembros(sub) {
  const snap = await getDocs(subCollection(sub, "membros"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })).sort((a, b) => String(a.criadoEm || "").localeCompare(String(b.criadoEm || "")));
}

export async function getMembro(sub, id) {
  const snap = await getDoc(doc(db, ROOT_COLLECTION, sub, "membros", id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function saveMembro(sub, payload, id = null) {
  const data = { ...payload, atualizadoEm: todayISO() };
  if (id) {
    await updateDoc(doc(db, ROOT_COLLECTION, sub, "membros", id), data);
    return id;
  }
  const ref = await addDoc(subCollection(sub, "membros"), { ...data, criadoEm: todayISO() });
  return ref.id;
}

export async function deleteMembro(sub, id) {
  await deleteDoc(doc(db, ROOT_COLLECTION, sub, "membros", id));
}

export async function listObras(sub) {
  const snap = await getDocs(subCollection(sub, "obras"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })).sort((a, b) => String(a.criadoEm || "").localeCompare(String(b.criadoEm || "")));
}

export async function getObra(sub, id) {
  const snap = await getDoc(doc(db, ROOT_COLLECTION, sub, "obras", id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function saveObra(sub, payload, id = null) {
  const data = { ...payload, atualizadoEm: todayISO() };
  if (id) {
    await updateDoc(doc(db, ROOT_COLLECTION, sub, "obras", id), data);
    return id;
  }
  const ref = await addDoc(subCollection(sub, "obras"), { ...data, criadoEm: todayISO() });
  return ref.id;
}

export async function deleteObra(sub, id) {
  await deleteDoc(doc(db, ROOT_COLLECTION, sub, "obras", id));
}

export async function getGrade(sub) {
  const snap = await getDoc(doc(db, ROOT_COLLECTION, sub, "config", "gradeSemanal"));
  return snap.exists() ? snap.data() : {};
}

export async function saveGrade(sub, grade) {
  await setDoc(doc(db, ROOT_COLLECTION, sub, "config", "gradeSemanal"), { ...grade, atualizadoEm: todayISO() });
}

export async function getVerificacaoDia(sub, dia) {
  const snap = await getDoc(doc(db, ROOT_COLLECTION, sub, "verificacoes", dia));
  return snap.exists() ? snap.data() : null;
}

export async function saveVerificacaoDia(sub, dia, dados) {
  await setDoc(doc(db, ROOT_COLLECTION, sub, "verificacoes", dia), { ...dados, atualizadoEm: todayISO() });
}

export async function listVerificacoes(sub) {
  const snap = await getDocs(subCollection(sub, "verificacoes"));
  const out = {};
  snap.docs.forEach((d) => { out[d.id] = d.data(); });
  return out;
}

export async function clearVerificacoesSemana(sub) {
  for (const dia of diasSemana) {
    await deleteDoc(doc(db, ROOT_COLLECTION, sub, "verificacoes", dia));
  }
}
