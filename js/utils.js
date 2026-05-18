import { SEM_OBRA_ID, statusQueCompletamLeitura } from "./constants.js";

export function $(selector, root = document) {
  return root.querySelector(selector);
}

export function $all(selector, root = document) {
  return [...root.querySelectorAll(selector)];
}

export function escapeHTML(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function getFormData(form) {
  return Object.fromEntries(new FormData(form).entries());
}

export function limparUser(user) {
  return String(user || "").replace(/^@/, "").trim();
}

export function repetirCheck(qtd) {
  const n = Number(qtd || 0);
  return n > 0 ? "✅".repeat(n) : "";
}

export function statusEhSemObra(status) {
  return status === "⏳";
}

export function statusContaComoLeitura(status) {
  return statusQueCompletamLeitura.includes(status);
}

export function leituraObrigatoriaValida(status) {
  if (statusEhSemObra(status)) return true;
  return statusContaComoLeitura(status);
}

export function existeObraObrigatoria(status1, status2) {
  return !statusEhSemObra(status1) || !statusEhSemObra(status2);
}

export function leiturasDoDiaValidas(status1, status2) {
  return existeObraObrigatoria(status1, status2) && leituraObrigatoriaValida(status1) && leituraObrigatoriaValida(status2);
}

export function calcularPontosDia(dados) {
  const status1 = dados.obra1Status || "⏳";
  const status2 = dados.obra2Status || "⏳";

  if (!leiturasDoDiaValidas(status1, status2)) return 0;

  let pontos = 0;
  if (statusContaComoLeitura(status1) && !statusEhSemObra(status1)) pontos += 5;
  if (statusContaComoLeitura(status2) && !statusEhSemObra(status2)) pontos += 5;

  if (status1 === "🌙" && dados.obra1Feedback) pontos += 20;
  if (status2 === "🌙" && dados.obra2Feedback) pontos += 20;

  if (status1 === "🌙") pontos += Math.max(0, Number(dados.obra1ExtraQtd || 0)) * 5;
  if (status2 === "🌙") pontos += Math.max(0, Number(dados.obra2ExtraQtd || 0)) * 5;

  return pontos;
}

export function resolverObra(id, obras) {
  if (!id || id === SEM_OBRA_ID) {
    return { id: SEM_OBRA_ID, titulo: "⏳ Sem Obra", link: "", membroId: "", semObra: true };
  }
  return obras.find((obra) => obra.id === id) || { id, titulo: "Obra não encontrada", link: "", membroId: "", semObra: false };
}

export function normalizarDia(dia) {
  return {
    Segunda: "SEGUNDA-FEIRA",
    Terça: "TERÇA-FEIRA",
    Quarta: "QUARTA-FEIRA",
    Quinta: "QUINTA-FEIRA",
    Sexta: "SEXTA-FEIRA"
  }[dia] || String(dia).toUpperCase();
}

export function normalizarDiaBonito(dia) {
  return {
    Segunda: "Segunda-Feira",
    Terça: "Terça-Feira",
    Quarta: "Quarta-Feira",
    Quinta: "Quinta-Feira",
    Sexta: "Sexta-Feira"
  }[dia] || dia;
}

export function numeroObra(n) {
  return Number(n) === 1 ? "01" : "02";
}

export function traduzirEmojisPorSub(texto, modelo) {
  let out = String(texto || "");
  if (modelo === "trono") {
    out = out.replaceAll("☠", "☠️").replaceAll("🌼", "📜").replaceAll("⚰", "⚰️").replaceAll("🧕🏻", "🕯️").replaceAll("⚠", "⚠️");
  }
  if (modelo === "margens") {
    out = out.replaceAll("☠", "🌑").replaceAll("🌼", "📜").replaceAll("⚰", "🚪").replaceAll("🧕🏻", "🧭").replaceAll("⚠", "⚠️");
  }
  return out;
}

export async function copyToClipboard(texto) {
  await navigator.clipboard.writeText(texto);
}

export function todayISO() {
  return new Date().toISOString();
}
