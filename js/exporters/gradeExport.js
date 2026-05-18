import { diasSemana, SEM_OBRA_ID, subs } from "../constants.js";
import { state } from "../state.js";
import { listMembros, listObras } from "../services/firestore.js";
import { limparUser, normalizarDia, normalizarDiaBonito, numeroObra, resolverObra } from "../utils.js";

async function context(obraId) {
  const [obras, membros] = await Promise.all([listObras(state.sub), listMembros(state.sub)]);
  const obra = resolverObra(obraId, obras);
  if (obra.semObra || obra.id === SEM_OBRA_ID) return { semObra: true };
  const membro = membros.find((m) => m.id === obra.membroId) || {};
  return { semObra: false, obra, membro };
}

function obsExtras(obra, modelo) {
  let texto = "";
  if (!obra) return texto;

  if (modelo === "trono") {
    if (obra.prologo1000) texto += `\n⚠️ 𝐎𝐁𝐒.: O prólogo tem +1K de palavras, então ele é considerado um capítulo normal.\n`;
    if (obra.capitulos4100) texto += `\n⚠️ Os capítulos ${obra.capitulos4100} têm mais de 4.1K de palavras. Ler apenas 1 capítulo por vez, deixando no 𝐌𝐈́𝐍𝐈𝐌𝐎 12 comentários em cada.\n`;
    if (obra.capitulosMenos500) texto += `\n⚠️ Os capítulos ${obra.capitulosMenos500} têm menos de 500 palavras. Ler um capítulo a mais, comentando no 𝐌𝐈́𝐍𝐈𝐌𝐎 6 vezes em cada.\n`;
    if (obra.observacoes) texto += `\n⚠️ 𝐎𝐁𝐒.: ${obra.observacoes}\n`;
    return texto;
  }

  if (modelo === "margens") {
    if (obra.prologo1000) texto += `\n⚠️ 𝐎𝐁𝐒.: o Prólogo tem +1k de palavras, então deve ser lido e comentado como um capítulo normal. No 𝐌𝐈́𝐍𝐈𝐌𝐎 6 vezes.\n`;
    if (obra.capitulos4100) texto += `\n⚠️ 𝐎𝐁𝐒.: Os capítulos ${obra.capitulos4100} têm +4,1k de palavras. Por isso, quem for lê-los deverá ler apenas 1 capítulo e comentar no 𝐌𝐈́𝐍𝐈𝐌𝐎 12 vezes.\n`;
    if (obra.capitulosMenos500) texto += `\n⚠️ 𝐎𝐁𝐒.: Os capítulos ${obra.capitulosMenos500} possuem menos de 500 palavras. Por isso, quem for lê-los deverá ler um capítulo a mais e comentar no mínimo 6 vezes em cada capítulo.\n`;
    if (obra.observacoes) texto += `\n⚠️ 𝐎𝐁𝐒.: ${obra.observacoes}\n`;
    return texto;
  }

  if (modelo === "pagina") {
    if (obra.prologo1000) texto += `\n🕷 Prólogo conta como capítulo nesta obra.\n`;
    if (obra.capitulos4100) texto += `\n🚔 Capítulos ${obra.capitulos4100} têm +4.1 k. Ler apenas 1 capítulo por vez e deixar 12 comentários.\n`;
    if (obra.capitulosMenos500) texto += `\n🚔 Capítulos ${obra.capitulosMenos500} possuem menos de 500 palavras. Ler um capítulo a mais e comentar no mínimo 6 vezes.\n`;
    if (obra.observacoes) texto += `\n🚦${obra.observacoes}\n`;
    return texto;
  }

  if (obra.prologo1000) texto += `\n🍂♦️ Obs: O prólogo tem +1k de palavras, então conta como capítulo normal.♦️🍂\n`;
  if (obra.capitulos4100) texto += `\n♦🍂Obs: Os capítulos ${obra.capitulos4100} possuem +4.1k de palavras, ler somente eles deixando 12 comentários em cada♦🍂\n`;
  if (obra.capitulosMenos500) texto += `\n♦🍂Obs: Os capítulos ${obra.capitulosMenos500} possuem menos de 500 palavras, ler um capítulo a mais comentando no mínimo 6 vezes em cada♦🍂\n`;
  if (obra.observacoes) texto += `\n🍂♦️Obs: ${obra.observacoes}♦️🍂\n`;
  return texto;
}

function alternativa(obra, modelo) {
  if (!obra?.alternativaTitulo && !obra?.alternativaLink && !obra?.alternativaObs) return "";

  if (modelo === "trono") {
    return `\n\n🔥 𝐏𝐀𝐑𝐀 𝐐𝐔𝐄𝐌 𝐉𝐀́ 𝐋𝐄𝐔:\n\n📕 𝐆𝐑𝐈𝐌𝐎́𝐑𝐈𝐎/𝐎𝐁𝐑𝐀: ${obra.alternativaTitulo || ""}\n🔗 𝐋𝐈𝐍𝐊: ${obra.alternativaLink || ""}\n\n⚠️ 𝐎𝐁𝐒.: ${obra.alternativaObs || "Leiam os especiais votando e deixando pelo menos 1 comentário + 2 capítulos comentando no 𝐌𝐈́𝐍𝐈𝐌𝐎 6 vezes em cada."}\n`;
  }

  if (modelo === "margens") {
    return `\n━━━━━━━━━━━ ✦ ━━━━━━━━━━━\n\n🌌 *PRA QUEM JÁ LEU* 🌌\n\n📖 𝐌𝐔𝐍𝐃𝐎/𝐎𝐁𝐑𝐀: ${obra.alternativaTitulo || ""}\n🔗 𝐋𝐈𝐍𝐊: ${obra.alternativaLink || ""}\n\n⚠️ 𝐎𝐁𝐒.: ${obra.alternativaObs || "Leiam os especiais votando e deixando pelo menos 1 comentário em cada."}\n`;
  }

  if (modelo === "pagina") {
    return `\nヘ(.^o^)ノ＼(^_^.)𝒫𝒶𝓇𝒶 𝒬𝓊ℯ𝓂 𝒥𝒶́ ℒℯ𝓊 ヘ(.^o^)ノ＼(^_^.)\n\n🎃 Obra: ${obra.alternativaTitulo || ""}\n👁️ Link: ${obra.alternativaLink || ""}\n🛎️Obs.: ${obra.alternativaObs || "Leia especial votando e deixando 1 comentário + 02 capítulos comentando no mínimo 6 vezes em cada."}\n`;
  }

  return `\n🍁 Para quem já leu:\n📙Obra.: ${obra.alternativaTitulo || ""}\n🪸 Link.: 🔗 ${obra.alternativaLink || ""}\n🍂♦️Obs: ${obra.alternativaObs || "Ler 2 capítulos deixando 6 comentários bem distribuídos"}♦️🍂\n`;
}

async function blocoChama(dia, numero, dadosDia = {}) {
  const { semObra, obra, membro } = await context(dadosDia[`obra${numero}`]);
  if (semObra) return "";
  return `🔶🔶🔶🔶🔶🔶🔶🔶🔶🔶🔶🔶🔶🔶🔶\n\n🍁🦊Obra ${numeroObra(numero)} de ${normalizarDiaBonito(dia)} 🦊🍁\n\n🐦‍🔥Nome.: ${membro.nome || ""}\n🔸User.: ${limparUser(membro.user || "")}\n📙Obra.: ${obra.titulo || ""}\n🪸 Link.: 🔗 ${obra.link || ""}\n\n🍂♦️Obs: Ler 2 capítulos deixando 6 comentários bem distribuídos♦️🍂\n${obsExtras(obra, "chama")}${alternativa(obra, "chama")}\n`;
}

async function blocoPagina(dia, numero, dadosDia = {}) {
  const { semObra, obra, membro } = await context(dadosDia[`obra${numero}`]);
  if (semObra) return "";
  const a = numero === 1 ? "🧚‍♂️" : "🦇";
  const b = numero === 1 ? "🧜‍♂️" : "🧙‍♂️";
  return `${a} ${normalizarDia(dia)} ${numero} ${b}\n\n🧝‍♀️ Autor: ${membro.nome || ""}\n🦇 User: ${limparUser(membro.user || "")}\n🛕 Nome da Obra: ${obra.titulo || ""}\n🛸 Link: ${obra.link || ""}\n\n🛎️Obs.: Leia 02 capítulos comentando no mínimo 6 vezes em cada.\n${obsExtras(obra, "pagina")}${alternativa(obra, "pagina")}\n`;
}

async function blocoTrono(dia, numero, dadosDia = {}) {
  const { semObra, obra, membro } = await context(dadosDia[`obra${numero}`]);
  if (semObra) return "";
  return `━━━━━━━━━━━ 𖤐 ━━━━━━━━━━━\n🌙🔥 ${normalizarDia(dia)} ${numeroObra(numero)}\n━━━━━━━━━━━ 𖤐 ━━━━━━━━━━━\n\n🔥 𝐍𝐎𝐌𝐄: ${membro.nome || ""}\n♜ 𝐔𝐒𝐄𝐑: ${limparUser(membro.user || "")}\n📕 𝐆𝐑𝐈𝐌𝐎́𝐑𝐈𝐎/𝐎𝐁𝐑𝐀: ${obra.titulo || ""}\n🔗 𝐋𝐈𝐍𝐊: ${obra.link || ""}\n${obsExtras(obra, "trono")}\n⚠️ 𝐎𝐁𝐒.: Leiam os especiais votando e deixando pelo menos 1 comentário + 2 capítulos comentando no 𝐌𝐈́𝐍𝐈𝐌𝐎 6 vezes em cada.\n\nLembrem-se: os comentários devem estar bem distribuídos entre o início, o meio e o fim.\n${alternativa(obra, "trono")}\n`;
}

async function blocoMargens(dia, numero, dadosDia = {}) {
  const { semObra, obra, membro } = await context(dadosDia[`obra${numero}`]);
  if (semObra) return "";
  return `━━━━━━━━━━━ ✦ ━━━━━━━━━━━\n🌙🌌 ${normalizarDia(dia)} ${numeroObra(numero)}\n━━━━━━━━━━━ ✦ ━━━━━━━━━━━\n\n🌿 𝐍𝐎𝐌𝐄: ${membro.nome || ""}\n🧭 𝐔𝐒𝐄𝐑: ${limparUser(membro.user || "")}\n📖 𝐌𝐔𝐍𝐃𝐎/𝐎𝐁𝐑𝐀: ${obra.titulo || ""}\n🔗 𝐋𝐈𝐍𝐊: ${obra.link || ""}\n${obsExtras(obra, "margens")}\n⚠️ 𝐎𝐁𝐒.:\n\nLeiam os especiais votando e deixando pelo menos 1 comentário + 2 capítulos comentando no 𝐌𝐈́𝐍𝐈𝐌𝐎 6 vezes em cada.\n\nLembrem-se: os comentários devem estar bem distribuídos entre o início, o meio e o fim.\n${alternativa(obra, "margens")}\n`;
}

function encerramento(modelo) {
  if (modelo === "trono") return `━━━━━━━━━━━ 𖤐 ━━━━━━━━━━━\n\n🔥 Que os grimórios sejam abertos,\nque as leituras sejam seladas no fogo,\ne que as obras dignas encontrem seu lugar no 𝐓𝐫𝐨𝐧𝐨 𝐏𝐫𝐨𝐟𝐚𝐧𝐨.`;
  if (modelo === "margens") return `━━━━━━━━━━━ ✦ ━━━━━━━━━━━\n\n🌌 Que os mundos sejam abertos,\nque as leituras atravessem fronteiras,\ne que cada obra encontre seu caminho\nnas 𝐌𝐚𝐫𝐠𝐞𝐧𝐬 𝐝𝐞 𝐌𝐮𝐧𝐝𝐨𝐬.`;
  return "";
}

async function gerarBloco(modelo, dia, numero, dadosDia) {
  if (modelo === "chama") return blocoChama(dia, numero, dadosDia);
  if (modelo === "pagina") return blocoPagina(dia, numero, dadosDia);
  if (modelo === "margens") return blocoMargens(dia, numero, dadosDia);
  return blocoTrono(dia, numero, dadosDia);
}

function cabecalho(modelo, semanal = true) {
  if (modelo === "chama") return semanal ? "" : "";
  if (modelo === "pagina") return `🧙‍♂️🧚‍♂️ PAGINA LIVRE 𝑨-𝟐 🧌🧝‍♀️ GRADE DE OBRAS 🧛‍♂️🧜‍♂️\n\n`;
  if (modelo === "margens") return `✦🗺️📖 𝐀-𝟕 — 𝐌𝐀𝐑𝐆𝐄𝐍𝐒 𝐃𝐄 𝐌𝐔𝐍𝐃𝐎𝐒 📖🗺️✦${semanal ? "\n𝐆𝐑𝐀𝐃𝐄 𝐃𝐄 𝐎𝐁𝐑𝐀𝐒 𝐃𝐀 𝐒𝐄𝐌𝐀𝐍𝐀" : ""}\n\n`;
  return `𖤐⛓️🔥 𝐀-𝟔 — 𝐓𝐑𝐎𝐍𝐎 𝐏𝐑𝐎𝐅𝐀𝐍𝐎 🔥⛓️𖤐${semanal ? "\n𝐆𝐑𝐀𝐃𝐄 𝐃𝐄 𝐎𝐁𝐑𝐀𝐒 𝐃𝐀 𝐒𝐄𝐌𝐀𝐍𝐀" : ""}\n\n`;
}

export async function exportarGradeSemana(grade) {
  const modelo = subs[state.sub].modelo;
  let texto = cabecalho(modelo, true);
  for (const dia of diasSemana) {
    texto += await gerarBloco(modelo, dia, 1, grade[dia]);
    texto += await gerarBloco(modelo, dia, 2, grade[dia]);
    if (modelo === "pagina") texto += "---------■\n\n";
  }
  if (["trono", "margens"].includes(modelo)) texto += encerramento(modelo);
  if (modelo === "chama") texto += "🔶🔶🔶🔶🔶🔶🔶🔶🔶🔶🔶🔶🔶🔶🔶";
  return texto.trim();
}

export async function exportarGradeDia(grade, dia) {
  const modelo = subs[state.sub].modelo;
  let texto = cabecalho(modelo, false);
  texto += await gerarBloco(modelo, dia, 1, grade[dia]);
  texto += await gerarBloco(modelo, dia, 2, grade[dia]);
  if (["trono", "margens"].includes(modelo)) texto += encerramento(modelo);
  if (modelo === "chama") texto += "🔶🔶🔶🔶🔶🔶🔶🔶🔶🔶🔶🔶🔶🔶🔶";
  return texto.trim();
}
