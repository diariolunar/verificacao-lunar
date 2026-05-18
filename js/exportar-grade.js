import { SUBS } from "./config.js";

import {
  escapeHTML,
  limparUser,
  normalizarDiaMaiusculo,
  normalizarDiaTitulo,
  numeroObra
} from "./utils.js";

function getMembroDaObra(obra, membros) {
  return membros.find(membro => membro.id === obra.membroId) || null;
}

function isSemObra(obra) {
  return !obra || obra.semObra || obra.id === "__SEM_OBRA__";
}

function obsBaseTrono() {
  return "Leiam os especiais votando e deixando pelo menos 1 comentário + 2 capítulos comentando no 𝐌𝐈́𝐍𝐈𝐌𝐎 6 vezes em cada.";
}

function obsBaseNormal() {
  return "Leiam os especiais votando e deixando pelo menos 1 comentário + 2 capítulos comentando no mínimo 6 vezes em cada.";
}

function obsDistribuicao() {
  return "Lembrem-se: os comentários devem estar bem distribuídos entre o início, o meio e o fim.";
}

function montarObsObra(obra, modelo) {
  let texto = "";

  if (modelo === "trono") {
    if (obra.prologoMais1000) {
      texto += `\n⚠️ 𝐎𝐁𝐒.: O prólogo tem +1K de palavras, então ele é considerado um capítulo normal.\n`;
    }

    if (obra.capitulosMais4100) {
      texto += `\n⚠️ Os capítulos ${obra.capitulosMais4100} têm mais de 4.1K de palavras. Ler apenas 1 capítulo por vez, deixando no 𝐌𝐈́𝐍𝐈𝐌𝐎 12 comentários em cada.\n`;
    }

    if (obra.capitulosMenos500) {
      texto += `\n⚠️ Os capítulos ${obra.capitulosMenos500} têm menos de 500 palavras. Ler um capítulo a mais, deixando no 𝐌𝐈́𝐍𝐈𝐌𝐎 6 comentários em cada.\n`;
    }

    if (obra.observacoes) {
      texto += `\n⚠️ 𝐎𝐁𝐒.: ${obra.observacoes}\n`;
    }

    return texto;
  }

  if (modelo === "margens") {
    if (obra.prologoMais1000) {
      texto += `\n⚠️ 𝐎𝐁𝐒.: o Prólogo tem +1k de palavras, então deve ser lido e comentado como um capítulo normal. No 𝐌𝐈́𝐍𝐈𝐌𝐎 6 vezes.\n`;
    }

    if (obra.capitulosMais4100) {
      texto += `\n⚠️ 𝐎𝐁𝐒.: Os capítulos ${obra.capitulosMais4100} têm +4,1k de palavras. Por isso, quem for lê-los deverá ler apenas 1 capítulo e comentar no 𝐌𝐈́𝐍𝐈𝐌𝐎 12 vezes.\n`;
    }

    if (obra.capitulosMenos500) {
      texto += `\n⚠️ 𝐎𝐁𝐒.: Os capítulos ${obra.capitulosMenos500} possuem menos de 500 palavras. Por isso, quem for lê-los deverá ler um capítulo a mais e comentar no mínimo 6 vezes em cada capítulo.\n`;
    }

    if (obra.observacoes) {
      texto += `\n⚠️ 𝐎𝐁𝐒.: ${obra.observacoes}\n`;
    }

    return texto;
  }

  if (modelo === "pagina") {
    if (obra.prologoMais1000) {
      texto += `\n🕷 Prólogo conta como capítulo nesta obra.\n`;
    }

    if (obra.capitulosMais4100) {
      texto += `\n🚔 Capítulos ${obra.capitulosMais4100} têm +4.1 k. Ler apenas 1 capítulo por vez e deixar 12 comentários.\n`;
    }

    if (obra.capitulosMenos500) {
      texto += `\n🚔 Capítulos ${obra.capitulosMenos500} possuem menos de 500 palavras. Ler um capítulo a mais e comentar no mínimo 6 vezes.\n`;
    }

    if (obra.observacoes) {
      texto += `\n🚦${obra.observacoes}\n`;
    }

    return texto;
  }

  if (obra.prologoMais1000) {
    texto += `\n🍂♦️Obs: O prólogo tem +1k de palavras, então conta como capítulo normal.♦️🍂\n`;
  }

  if (obra.capitulosMais4100) {
    texto += `\n♦🍂Obs: Os capítulos ${obra.capitulosMais4100} possuem +4.1k de palavras, ler somente eles deixando 12 comentários em cada♦🍂\n`;
  }

  if (obra.capitulosMenos500) {
    texto += `\n♦🍂Obs: Os capítulos ${obra.capitulosMenos500} possuem menos de 500 palavras, ler um capítulo a mais comentando no mínimo 6 vezes em cada♦🍂\n`;
  }

  if (obra.observacoes) {
    texto += `\n🍂♦️Obs: ${obra.observacoes}♦️🍂\n`;
  }

  return texto;
}

function montarAlternativa(obra, modelo) {
  if (!obra.alternativaTitulo && !obra.alternativaLink && !obra.alternativaObservacoes) {
    return "";
  }

  if (modelo === "trono") {
    let texto = `\n🔥 𝐏𝐀𝐑𝐀 𝐐𝐔𝐄𝐌 𝐉𝐀́ 𝐋𝐄𝐔:\n\n`;

    if (obra.alternativaTitulo) texto += `📕 𝐆𝐑𝐈𝐌𝐎́𝐑𝐈𝐎/𝐎𝐁𝐑𝐀: ${obra.alternativaTitulo}\n`;
    if (obra.alternativaLink) texto += `🔗 𝐋𝐈𝐍𝐊: ${obra.alternativaLink}\n`;
    if (obra.alternativaObservacoes) texto += `\n⚠️ 𝐎𝐁𝐒.: ${obra.alternativaObservacoes}\n`;

    texto += `\n${obsBaseTrono()}\n${obsDistribuicao()}\n`;

    return texto;
  }

  if (modelo === "margens") {
    let texto = `\n━━━━━━━━━━━ ✦ ━━━━━━━━━━━\n\n🌌 *PRA QUEM JÁ LEU* 🌌\n\n`;

    if (obra.alternativaTitulo) texto += `📖 𝐌𝐔𝐍𝐃𝐎/𝐎𝐁𝐑𝐀: ${obra.alternativaTitulo}\n`;
    if (obra.alternativaLink) texto += `🔗 𝐋𝐈𝐍𝐊: ${obra.alternativaLink}\n`;
    if (obra.alternativaObservacoes) texto += `\n⚠️ 𝐎𝐁𝐒.: ${obra.alternativaObservacoes}\n`;

    texto += `\n${obsBaseNormal()}\n${obsDistribuicao()}\n`;

    return texto;
  }

  if (modelo === "pagina") {
    let texto = `\nヘ(.^o^)ノ＼(^_^.)𝒫𝒶𝓇𝒶 𝒬𝓊ℯ𝓂 𝒥𝒶́ ℒℯ𝓊 ヘ(.^o^)ノ＼(^_^.)\n\n`;

    if (obra.alternativaTitulo) texto += `🎃 Obra: ${obra.alternativaTitulo}\n`;
    if (obra.alternativaLink) texto += `👁️ Link: ${obra.alternativaLink}\n`;
    if (obra.alternativaObservacoes) texto += `🛎Obs.: ${obra.alternativaObservacoes}\n`;

    return texto;
  }

  let texto = `\n🍁 Para quem já leu:\n\n`;

  if (obra.alternativaTitulo) texto += `📙Obra.: ${obra.alternativaTitulo}\n`;
  if (obra.alternativaLink) texto += `🪸 Link.: 🔗 ${obra.alternativaLink}\n`;
  if (obra.alternativaObservacoes) texto += `🍂♦️Obs: ${obra.alternativaObservacoes}♦️🍂\n`;

  return texto;
}

/* A-1 */

async function blocoChama({ dia, numero, obra, membros }) {
  if (isSemObra(obra)) return "";

  const membro = getMembroDaObra(obra, membros);

  let texto = "";

  texto += `🔶🔶🔶🔶🔶🔶🔶🔶🔶🔶🔶🔶🔶🔶🔶\n\n`;
  texto += `🍁🦊Obra ${numeroObra(numero)} de ${normalizarDiaTitulo(dia)} 🦊🍁\n\n`;
  texto += `🐦‍🔥Nome.: ${membro?.nome || ""}\n`;
  texto += `🔸User.: ${limparUser(membro?.user || "")}\n`;
  texto += `📙Obra.: ${obra.titulo || ""}\n`;
  texto += `🪸 Link.: 🔗 ${obra.link || ""}\n\n`;

  texto += `🍂♦️Obs: Ler 2 capítulos deixando 6 comentários bem distribuídos♦️🍂\n`;
  texto += montarObsObra(obra, "chama");
  texto += montarAlternativa(obra, "chama");

  texto += `\n`;

  return texto;
}

async function gradeChamaSemana({ grade, obrasPorId, membros }) {
  let texto = "";

  for (const dia of Object.keys(grade)) {
    if (dia === "atualizadoEm") continue;

    const obra1 = obrasPorId.get(grade[dia]?.obra1);
    const obra2 = obrasPorId.get(grade[dia]?.obra2);

    texto += await blocoChama({ dia, numero: 1, obra: obra1, membros });
    texto += await blocoChama({ dia, numero: 2, obra: obra2, membros });
  }

  texto += `🔶🔶🔶🔶🔶🔶🔶🔶🔶🔶🔶🔶🔶🔶🔶`;

  return texto.trim();
}

async function gradeChamaDia({ grade, obrasPorId, membros, dia }) {
  const obra1 = obrasPorId.get(grade[dia]?.obra1);
  const obra2 = obrasPorId.get(grade[dia]?.obra2);

  let texto = "";

  texto += await blocoChama({ dia, numero: 1, obra: obra1, membros });
  texto += await blocoChama({ dia, numero: 2, obra: obra2, membros });
  texto += `🔶🔶🔶🔶🔶🔶🔶🔶🔶🔶🔶🔶🔶🔶🔶`;

  return texto.trim();
}

/* A-2 */

async function blocoPagina({ dia, numero, obra, membros }) {
  if (isSemObra(obra)) return "";

  const membro = getMembroDaObra(obra, membros);
  const emojiInicio = numero === 1 ? "🧚‍♂️" : "🦇";
  const emojiFim = numero === 1 ? "🧜‍♂️" : "🧙‍♂️";

  let texto = "";

  texto += `${emojiInicio} ${normalizarDiaMaiusculo(dia)} ${numero} ${emojiFim}\n\n`;
  texto += `🧝‍♀️ Autor: ${membro?.nome || ""}\n`;
  texto += `🦇 User: ${limparUser(membro?.user || "")}\n`;
  texto += `🛕 Nome da Obra: ${obra.titulo || ""}\n`;
  texto += `🛸 Link: ${obra.link || ""}\n\n`;

  texto += `🛎️Obs.: Leia 02 capítulos comentando no mínimo 6 vezes em cada.\n`;
  texto += montarObsObra(obra, "pagina");
  texto += montarAlternativa(obra, "pagina");

  texto += `\n`;

  return texto;
}

async function gradePaginaSemana({ grade, obrasPorId, membros }) {
  let texto = `🧙‍♂️🧚‍♂️ PAGINA LIVRE 𝑨-𝟐 🧌🧝‍♀️ GRADE DE OBRAS 🧛‍♂️🧜‍♂️\n\n`;

  for (const dia of Object.keys(grade)) {
    if (dia === "atualizadoEm") continue;

    const obra1 = obrasPorId.get(grade[dia]?.obra1);
    const obra2 = obrasPorId.get(grade[dia]?.obra2);

    texto += await blocoPagina({ dia, numero: 1, obra: obra1, membros });
    texto += await blocoPagina({ dia, numero: 2, obra: obra2, membros });
    texto += `---------■\n\n`;
  }

  return texto.trim();
}

async function gradePaginaDia({ grade, obrasPorId, membros, dia }) {
  const obra1 = obrasPorId.get(grade[dia]?.obra1);
  const obra2 = obrasPorId.get(grade[dia]?.obra2);

  let texto = `🧙‍♂️🧚‍♂️ PAGINA LIVRE 𝑨-𝟐 🧌🧝‍♀️ GRADE DE OBRAS 🧛‍♂️🧜‍♂️\n\n`;

  texto += await blocoPagina({ dia, numero: 1, obra: obra1, membros });
  texto += await blocoPagina({ dia, numero: 2, obra: obra2, membros });

  return texto.trim();
}

/* A-6 */

async function blocoTrono({ dia, numero, obra, membros }) {
  if (isSemObra(obra)) return "";

  const membro = getMembroDaObra(obra, membros);

  let texto = "";

  texto += `━━━━━━━━━━━ 𖤐 ━━━━━━━━━━━\n`;
  texto += `🌙🔥 ${normalizarDiaMaiusculo(dia)} ${numero === 1 ? "𝟎𝟏" : "𝟎𝟐"}\n`;
  texto += `━━━━━━━━━━━ 𖤐 ━━━━━━━━━━━\n\n`;

  texto += `🔥 𝐍𝐎𝐌𝐄: ${membro?.nome || ""}\n`;
  texto += `♜ 𝐔𝐒𝐄𝐑: ${limparUser(membro?.user || "")}\n`;
  texto += `📕 𝐆𝐑𝐈𝐌𝐎́𝐑𝐈𝐎/𝐎𝐁𝐑𝐀: ${obra.titulo || ""}\n`;
  texto += `🔗 𝐋𝐈𝐍𝐊: ${obra.link || ""}\n`;

  texto += montarObsObra(obra, "trono");

  texto += `\n⚠️ 𝐎𝐁𝐒.: ${obsBaseTrono()}\n\n`;
  texto += `${obsDistribuicao()}\n`;

  texto += montarAlternativa(obra, "trono");

  texto += `\n`;

  return texto;
}

function encerramentoTrono() {
  return `━━━━━━━━━━━ 𖤐 ━━━━━━━━━━━

🔥 Que os grimórios sejam abertos,
que as leituras sejam seladas no fogo,
e que as obras dignas encontrem seu lugar no 𝐓𝐫𝐨𝐧𝐨 𝐏𝐫𝐨𝐟𝐚𝐧𝐨.`;
}

async function gradeTronoSemana({ grade, obrasPorId, membros }) {
  let texto = "";

  texto += `𖤐⛓️🔥 𝐀-𝟔 — 𝐓𝐑𝐎𝐍𝐎 𝐏𝐑𝐎𝐅𝐀𝐍𝐎 🔥⛓️𖤐\n`;
  texto += `𝐆𝐑𝐀𝐃𝐄 𝐃𝐄 𝐎𝐁𝐑𝐀𝐒 𝐃𝐀 𝐒𝐄𝐌𝐀𝐍𝐀\n\n`;

  for (const dia of Object.keys(grade)) {
    if (dia === "atualizadoEm") continue;

    const obra1 = obrasPorId.get(grade[dia]?.obra1);
    const obra2 = obrasPorId.get(grade[dia]?.obra2);

    texto += await blocoTrono({ dia, numero: 1, obra: obra1, membros });
    texto += await blocoTrono({ dia, numero: 2, obra: obra2, membros });
  }

  texto += encerramentoTrono();

  return texto.trim();
}

async function gradeTronoDia({ grade, obrasPorId, membros, dia }) {
  const obra1 = obrasPorId.get(grade[dia]?.obra1);
  const obra2 = obrasPorId.get(grade[dia]?.obra2);

  let texto = `𖤐⛓️🔥 𝐀-𝟔 — 𝐓𝐑𝐎𝐍𝐎 𝐏𝐑𝐎𝐅𝐀𝐍𝐎 🔥⛓️𖤐\n\n`;

  texto += await blocoTrono({ dia, numero: 1, obra: obra1, membros });
  texto += await blocoTrono({ dia, numero: 2, obra: obra2, membros });
  texto += encerramentoTrono();

  return texto.trim();
}

/* A-7 */

async function blocoMargens({ dia, numero, obra, membros }) {
  if (isSemObra(obra)) return "";

  const membro = getMembroDaObra(obra, membros);

  let texto = "";

  texto += `━━━━━━━━━━━ ✦ ━━━━━━━━━━━\n`;
  texto += `🌙🌌 ${normalizarDiaMaiusculo(dia)} ${numero === 1 ? "01" : "02"}\n`;
  texto += `━━━━━━━━━━━ ✦ ━━━━━━━━━━━\n\n`;

  texto += `🌿 𝐍𝐎𝐌𝐄: ${membro?.nome || ""}\n`;
  texto += `🧭 𝐔𝐒𝐄𝐑: ${limparUser(membro?.user || "")}\n`;
  texto += `📖 𝐌𝐔𝐍𝐃𝐎/𝐎𝐁𝐑𝐀: ${obra.titulo || ""}\n`;
  texto += `🔗 𝐋𝐈𝐍𝐊: ${obra.link || ""}\n`;

  texto += montarObsObra(obra, "margens");

  texto += `\n⚠️ 𝐎𝐁𝐒.:\n\n`;
  texto += `Leiam os especiais votando e deixando pelo menos 1 comentário + 2 capítulos comentando no 𝐌𝐈́𝐍𝐈𝐌𝐎 6 vezes em cada.\n\n`;
  texto += `${obsDistribuicao()}\n`;

  texto += montarAlternativa(obra, "margens");

  texto += `\n`;

  return texto;
}

function encerramentoMargens() {
  return `━━━━━━━━━━━ ✦ ━━━━━━━━━━━

🌌 Que os mundos sejam abertos,
que as leituras atravessem fronteiras,
e que cada obra encontre seu caminho
nas 𝐌𝐚𝐫𝐠𝐞𝐧𝐬 𝐝𝐞 𝐌𝐮𝐧𝐝𝐨𝐬.`;
}

async function gradeMargensSemana({ grade, obrasPorId, membros }) {
  let texto = "";

  texto += `✦🗺️📖 𝐀-𝟕 — 𝐌𝐀𝐑𝐆𝐄𝐍𝐒 𝐃𝐄 𝐌𝐔𝐍𝐃𝐎𝐒 📖🗺️✦\n`;
  texto += `𝐆𝐑𝐀𝐃𝐄 𝐃𝐄 𝐎𝐁𝐑𝐀𝐒 𝐃𝐀 𝐒𝐄𝐌𝐀𝐍𝐀\n\n`;

  for (const dia of Object.keys(grade)) {
    if (dia === "atualizadoEm") continue;

    const obra1 = obrasPorId.get(grade[dia]?.obra1);
    const obra2 = obrasPorId.get(grade[dia]?.obra2);

    texto += await blocoMargens({ dia, numero: 1, obra: obra1, membros });
    texto += await blocoMargens({ dia, numero: 2, obra: obra2, membros });
  }

  texto += encerramentoMargens();

  return texto.trim();
}

async function gradeMargensDia({ grade, obrasPorId, membros, dia }) {
  const obra1 = obrasPorId.get(grade[dia]?.obra1);
  const obra2 = obrasPorId.get(grade[dia]?.obra2);

  let texto = `✦🗺️📖 𝐀-𝟕 — 𝐌𝐀𝐑𝐆𝐄𝐍𝐒 𝐃𝐄 𝐌𝐔𝐍𝐃𝐎𝐒 📖🗺️✦\n\n`;

  texto += await blocoMargens({ dia, numero: 1, obra: obra1, membros });
  texto += await blocoMargens({ dia, numero: 2, obra: obra2, membros });
  texto += encerramentoMargens();

  return texto.trim();
}

/* EXPORTADOR */

export async function gerarGradeExportada({
  subId,
  tipo,
  dia,
  grade,
  obras,
  membros
}) {
  const sub = SUBS[subId];

  const obrasPorId = new Map(obras.map(obra => [obra.id, obra]));

  const base = {
    grade,
    obrasPorId,
    membros,
    dia
  };

  if (sub.modelo === "chama") {
    return tipo === "dia"
      ? await gradeChamaDia(base)
      : await gradeChamaSemana(base);
  }

  if (sub.modelo === "pagina") {
    return tipo === "dia"
      ? await gradePaginaDia(base)
      : await gradePaginaSemana(base);
  }

  if (sub.modelo === "margens") {
    return tipo === "dia"
      ? await gradeMargensDia(base)
      : await gradeMargensSemana(base);
  }

  return tipo === "dia"
    ? await gradeTronoDia(base)
    : await gradeTronoSemana(base);
}