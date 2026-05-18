import { diasSemana, subs } from "../constants.js";
import { state } from "../state.js";
import { listMembros, listVerificacoes } from "../services/firestore.js";
import { limparUser, repetirCheck, traduzirEmojisPorSub } from "../utils.js";

function legenda(modelo) {
  if (modelo === "trono") return `🌙 𝐋𝐞𝐮\n☠️ 𝐍𝐚̃𝐨 𝐥𝐞𝐮\n💅 𝐉𝐮𝐬𝐭𝐢𝐟𝐢𝐜𝐚𝐝𝐨\n📜 𝐉𝐚́ 𝐡𝐚𝐯𝐢𝐚 𝐥𝐢𝐝𝐨 𝐚𝐧𝐭𝐞𝐬\n🙍 𝐅𝐚𝐥𝐭𝐚 𝐚𝐥𝐠𝐨 (𝐜𝐨𝐦𝐞𝐧𝐭𝐚́𝐫𝐢𝐨 𝐨𝐮 𝐯𝐨𝐭𝐨)\n✨ 𝐎𝐛𝐫𝐚 𝐝𝐨 𝐝𝐢𝐚\n⏳ 𝐒𝐞𝐦 𝐨𝐛𝐫𝐚\n⚰️ 𝐒𝐚𝐢𝐮 𝐝𝐨 𝐠𝐫𝐮𝐩𝐨\n🕯️ 𝐋𝐞𝐢𝐭𝐮𝐫𝐚 𝐞𝐦 𝐚𝐧𝐝𝐚𝐦𝐞𝐧𝐭𝐨 𝐧𝐨 𝐦𝐨𝐦𝐞𝐧𝐭𝐨 𝐝𝐚 𝐯𝐞𝐫𝐢𝐟𝐢𝐜𝐚𝐜̧𝐚̃𝐨\n⚠️ 𝐈𝐧𝐟𝐫𝐚𝐜̧𝐚̃𝐨 𝐝𝐚𝐬 𝐫𝐞𝐠𝐫𝐚𝐬\n🚫 𝐈𝐧𝐟𝐫𝐚𝐜̧𝐚̃𝐨 𝐧𝐨 𝐭𝐞𝐦𝐩𝐨 𝐝𝐞 𝐥𝐞𝐢𝐭𝐮𝐫𝐚\n📲 𝐏𝐫𝐢𝐧𝐭𝐬 𝐧𝐨 𝐩𝐯\n⛔ 𝐑𝐞𝐦𝐨𝐯𝐢𝐝𝐨 𝐩𝐨𝐫 𝐢𝐧𝐟𝐫𝐚𝐜̧𝐚̃𝐨 𝐝𝐚𝐬 𝐫𝐞𝐠𝐫𝐚𝐬\n⏰ 𝐋𝐞𝐢𝐭𝐮𝐫𝐚 𝐟𝐞𝐢𝐭𝐚 𝐞𝐦 𝐭𝐞𝐦𝐩𝐨 𝐞𝐬𝐭𝐢𝐦𝐚𝐝𝐨\n\n`;
  if (modelo === "margens") return `🌙 𝐋𝐞𝐮\n🌑 𝐍𝐚̃𝐨 𝐥𝐞𝐮\n💅 𝐉𝐮𝐬𝐭𝐢𝐟𝐢𝐜𝐚𝐝𝐨\n📜 𝐉𝐚́ 𝐡𝐚𝐯𝐢𝐚 𝐥𝐢𝐝𝐨 𝐚𝐧𝐭𝐞𝐬\n🙍 𝐅𝐚𝐥𝐭𝐚 𝐚𝐥𝐠𝐨 (𝐜𝐨𝐦𝐞𝐧𝐭𝐚́𝐫𝐢𝐨 𝐨𝐮 𝐯𝐨𝐭𝐨)\n✨ 𝐎𝐛𝐫𝐚 𝐝𝐨 𝐝𝐢𝐚\n⏳ 𝐒𝐞𝐦 𝐨𝐛𝐫𝐚\n🚪 𝐒𝐚𝐢𝐮 𝐝𝐨 𝐠𝐫𝐮𝐩𝐨\n🧭 𝐋𝐞𝐢𝐭𝐮𝐫𝐚 𝐞𝐦 𝐚𝐧𝐝𝐚𝐦𝐞𝐧𝐭𝐨\n⚠️ 𝐈𝐧𝐟𝐫𝐚𝐜̧𝐚̃𝐨 𝐝𝐚𝐬 𝐫𝐞𝐠𝐫𝐚𝐬\n🚫 𝐈𝐧𝐟𝐫𝐚𝐜̧𝐚̃𝐨 𝐧𝐨 𝐭𝐞𝐦𝐩𝐨 𝐝𝐞 𝐥𝐞𝐢𝐭𝐮𝐫𝐚\n📲 𝐏𝐫𝐢𝐧𝐭𝐬 𝐧𝐨 𝐩𝐯\n⛔ 𝐑𝐞𝐦𝐨𝐯𝐢𝐝𝐨 𝐩𝐨𝐫 𝐢𝐧𝐟𝐫𝐚𝐜̧𝐚̃𝐨\n⏰ 𝐋𝐞𝐢𝐭𝐮𝐫𝐚 𝐟𝐞𝐢𝐭𝐚 𝐞𝐦 𝐭𝐞𝐦𝐩𝐨\n\n`;
  return `🌙 𝐋𝐞𝐮\n☠ 𝐍𝐚̃𝐨 𝐥𝐞𝐮\n💅 𝐉𝐮𝐬𝐭𝐢𝐟𝐢𝐜𝐚𝐝𝐨\n🌼 𝐉𝐚́ 𝐡𝐚𝐯𝐢𝐚 𝐥𝐢𝐝𝐨 𝐚𝐧𝐭𝐞𝐬\n🙍 𝐅𝐚𝐥𝐭𝐚 𝐚𝐥𝐠𝐨\n✨ 𝐎𝐛𝐫𝐚 𝐝𝐨 𝐝𝐢𝐚\n⏳ 𝐒𝐞𝐦 𝐨𝐛𝐫𝐚\n⚰ 𝐒𝐚𝐢𝐮 𝐝𝐨 𝐠𝐫𝐮𝐩𝐨\n🧕🏻 𝐋𝐞𝐢𝐭𝐮𝐫𝐚 𝐞𝐦 𝐚𝐧𝐝𝐚𝐦𝐞𝐧𝐭𝐨\n⚠ 𝐈𝐧𝐟𝐫𝐚𝐜̧𝐚̃𝐨\n📲 𝐏𝐫𝐢𝐧𝐭𝐬 𝐧𝐨 𝐩𝐯\n⛔ 𝐑𝐞𝐦𝐨𝐯𝐢𝐝𝐨\n\n`;
}

function header(modelo) {
  if (modelo === "trono") return `𖤐⛓️🔥 𝐀-𝟔 — 𝐓𝐑𝐎𝐍𝐎 𝐏𝐑𝐎𝐅𝐀𝐍𝐎 🔥⛓️𖤐\n━━━━━━━━━━━ 𖤐 ━━━━━━━━━━━\n📜 𝐕𝐄𝐑𝐈𝐅𝐈𝐂𝐀𝐂̧𝐀̃𝐎\n━━━━━━━━━━━ 𖤐 ━━━━━━━━━━━\n\n`;
  if (modelo === "margens") return `✦🗺️📖 𝐀-𝟕 — 𝐌𝐀𝐑𝐆𝐄𝐍𝐒 𝐃𝐄 𝐌𝐔𝐍𝐃𝐎𝐒 📖🗺️✦\n━━━━━━━━━━━ ✦ ━━━━━━━━━━━\n📜 𝐕𝐄𝐑𝐈𝐅𝐈𝐂𝐀𝐂̧𝐀̃𝐎\n━━━━━━━━━━━ ✦ ━━━━━━━━━━━\n\n`;
  if (modelo === "pagina") return `🧚‍♂PAGINA LIVRE 𝑨-𝟐 🧝‍♀🧌🦹‍♂🧞‍♂ VERIFICAÇÕES 🧛‍♂🧜‍♂\n\n`;
  return `🌑👑 𝐕𝐄𝐑𝐈𝐅𝐈𝐂𝐀𝐂̧𝐎̃𝐄𝐒 👑🌑\n\n🌜 𝐎𝐧𝐝𝐞 𝐚 𝐋𝐮𝐚 𝐢𝐥𝐮𝐦𝐢𝐧𝐚 𝐨𝐬 𝐥𝐢𝐯𝐫𝐨𝐬: 𝐋𝐮𝐧𝐚 𝐀-𝟏 🌛\n\n`;
}

function fechamento(modelo) {
  if (modelo === "trono") return `━━━━━━━━━━━ 𖤐 ━━━━━━━━━━━\n\n🚨 𝐀𝐓𝐄𝐍𝐂̧𝐀̃𝐎 🚨\n\n𝐏𝐚𝐫𝐚 𝐠𝐚𝐫𝐚𝐧𝐭𝐢𝐫 𝐨 𝐛𝐨𝐦 𝐚𝐧𝐝𝐚𝐦𝐞𝐧𝐭𝐨 𝐝𝐨 𝐓𝐫𝐨𝐧𝐨 𝐏𝐫𝐨𝐟𝐚𝐧𝐨, 𝐞́ 𝐢𝐦𝐩𝐨𝐫𝐭𝐚𝐧𝐭𝐞 𝐪𝐮𝐞 𝐭𝐨𝐝𝐨𝐬 𝐞𝐬𝐭𝐞𝐣𝐚𝐦 𝐞𝐦 𝐝𝐢𝐚 𝐜𝐨𝐦 𝐬𝐮𝐚𝐬 𝐥𝐞𝐢𝐭𝐮𝐫𝐚𝐬.\n\n🔥 𝐕𝐚𝐦𝐨𝐬 𝐦𝐚𝐧𝐭𝐞𝐫 𝐨 𝐠𝐫𝐮𝐩𝐨 𝐨𝐫𝐠𝐚𝐧𝐢𝐳𝐚𝐝𝐨.`;
  if (modelo === "margens") return `━━━━━━━━━━━ ✦ ━━━━━━━━━━━\n\n🚨 𝐀𝐓𝐄𝐍𝐂̧𝐀̃𝐎 🚨\n\n𝐏𝐚𝐫𝐚 𝐠𝐚𝐫𝐚𝐧𝐭𝐢𝐫 𝐨 𝐛𝐨𝐦 𝐚𝐧𝐝𝐚𝐦𝐞𝐧𝐭𝐨 𝐝𝐨 𝐌𝐚𝐫𝐠𝐞𝐧𝐬 𝐝𝐞 𝐌𝐮𝐧𝐝𝐨𝐬, 𝐞́ 𝐢𝐦𝐩𝐨𝐫𝐭𝐚𝐧𝐭𝐞 𝐪𝐮𝐞 𝐭𝐨𝐝𝐨𝐬 𝐞𝐬𝐭𝐞𝐣𝐚𝐦 𝐞𝐦 𝐝𝐢𝐚.\n\n🌌 𝐕𝐚𝐦𝐨𝐬 𝐦𝐚𝐧𝐭𝐞𝐫 𝐨 𝐠𝐫𝐮𝐩𝐨 𝐨𝐫𝐠𝐚𝐧𝐢𝐳𝐚𝐝𝐨.`;
  return `\n🚨𝐀𝐓𝐄𝐍𝐂̧𝐀̃𝐎🚨\n\n𝐏𝐚𝐫𝐚 𝐠𝐚𝐫𝐚𝐧𝐭𝐢𝐫 𝐚 𝐨𝐫𝐠𝐚𝐧𝐢𝐳𝐚𝐜̧𝐚̃𝐨 𝐝𝐨 𝐠𝐫𝐮𝐩𝐨, 𝐞́ 𝐢𝐦𝐩𝐨𝐫𝐭𝐚𝐧𝐭𝐞 𝐪𝐮𝐞 𝐭𝐨𝐝𝐨𝐬 𝐞𝐬𝐭𝐞𝐣𝐚𝐦 𝐞𝐦 𝐝𝐢𝐚.`;
}

function counts(membroId, verificacoes) {
  let pontos = 0, feedbacks = 0, extras = 0, obra1 = "", obra2 = "", dias = 0;
  for (const dia of diasSemana) {
    const d = verificacoes[dia]?.membros?.[membroId];
    if (!d) continue;
    dias++;
    pontos += Number(d.pontos || 0);
    obra1 += d.obra1Status || "";
    obra2 += d.obra2Status || "";
    if (d.obra1Feedback) feedbacks++;
    if (d.obra2Feedback) feedbacks++;
    extras += Number(d.obra1ExtraQtd || 0) + Number(d.obra2ExtraQtd || 0);
  }
  return { pontos, feedbacks, extras, obra1, obra2, dias };
}

function blocoMembro(membro, c, modelo) {
  const f = repetirCheck(c.feedbacks);
  const e = repetirCheck(c.extras);
  const obra1 = traduzirEmojisPorSub(c.obra1, modelo);
  const obra2 = traduzirEmojisPorSub(c.obra2, modelo);

  if (modelo === "trono") return `━━━━━━━━━━━ 𖤐 ━━━━━━━━━━━\n\n♛ 𝐍𝐨𝐦𝐞: ${membro.nome}\n♜ 𝐔𝐬𝐞𝐫: ${limparUser(membro.user)}\n\n🌙 𝐒𝐞𝐦𝐚𝐧𝐚𝐬: ${membro.semana || 0}\n📅 𝐃𝐢𝐚𝐬: ${c.dias}\n⭐ 𝐏𝐨𝐧𝐭𝐨𝐬: ${c.pontos}\n💬 𝐅𝐞𝐞𝐝𝐛𝐚𝐜𝐤: ${f}\n🔮 𝐋𝐞𝐢𝐭𝐮𝐫𝐚 𝐋𝐮𝐧𝐚𝐫:\n\n📕 𝐆𝐫𝐢𝐦𝐨́𝐫𝐢𝐨 𝟎𝟏: ${obra1}\n📕 𝐆𝐫𝐢𝐦𝐨́𝐫𝐢𝐨 𝟎𝟐: ${obra2}\n\n🔮 𝐋𝐞𝐢𝐭𝐮𝐫𝐚 𝐄𝐱𝐭𝐫𝐚: ${e}\n\n`;
  if (modelo === "margens") return `━━━━━━━━━━━ ✦ ━━━━━━━━━━━\n\n🗝️ 𝐍𝐨𝐦𝐞: ${membro.nome}\n🧭 𝐔𝐬𝐞𝐫: ${limparUser(membro.user)}\n\n🌙 𝐒𝐞𝐦𝐚𝐧𝐚𝐬: ${membro.semana || 0}\n📅 𝐃𝐢𝐚𝐬: ${c.dias}\n⭐ 𝐏𝐨𝐧𝐭𝐨𝐬: ${c.pontos}\n💬 𝐅𝐞𝐞𝐝𝐛𝐚𝐜𝐤: ${f}\n🌌 𝐋𝐞𝐢𝐭𝐮𝐫𝐚 𝐋𝐮𝐧𝐚𝐫:\n\n📖 𝐌𝐮𝐧𝐝𝐨 𝟎𝟏: ${obra1}\n📖 𝐌𝐮𝐧𝐝𝐨 𝟎𝟐: ${obra2}\n\n🗺️ 𝐋𝐞𝐢𝐭𝐮𝐫𝐚 𝐄𝐱𝐭𝐫𝐚: ${e}\n\n`;
  if (modelo === "pagina") return `_______________\n\n🧙‍♂🧚‍♂ PAGINA LIVRE 𝑨-𝟐 🧛‍♂🧜‍♂\n\n🧝‍♀ Nome: ${membro.nome}\n🦇 User: ${membro.user}\n\n🌎 Semanas: ${membro.semana || 0}\n🗺 Dias: ${c.dias}\n🧭 Pontos: ${c.pontos}\n🏗 Feedback: ${f}\n📚 Extras: ${e}\n🌌 Leitura Lunar:\n\n🏘 Obra 01: ${obra1}\n🏘 Obra 02: ${obra2}\n\n`;
  return `_____________\n\n📙𝐍𝐨𝐦𝐞: ${membro.nome}\n🦐𝐔𝐬𝐞𝐫: ${membro.user}\n\n🏆 semanas: ${membro.semana || 0}\n💌 Dias: ${c.dias}\n👑 Pontos: ${c.pontos}\n📈 Feedback: ${f}\n📚 Extras: ${e}\nLEITURA LUNAR:\n\nObra 01.: ${obra1}\nObra 02.: ${obra2}\n\n`;
}

export async function gerarFicha() {
  const modelo = subs[state.sub].modelo;
  const [membros, verificacoes] = await Promise.all([listMembros(state.sub), listVerificacoes(state.sub)]);
  let texto = header(modelo) + legenda(modelo);
  if (["trono", "margens"].includes(modelo)) texto += modelo === "trono" ? `━━━━━━━━━━━ 𖤐 ━━━━━━━━━━━\n📖 𝐅𝐈𝐂𝐇𝐀 𝐃𝐎 𝐋𝐄𝐈𝐓𝐎𝐑\n━━━━━━━━━━━ 𖤐 ━━━━━━━━━━━\n\n` : `━━━━━━━━━━━ ✦ ━━━━━━━━━━━\n📖 𝐅𝐈𝐂𝐇𝐀 𝐃𝐎 𝐋𝐄𝐈𝐓𝐎𝐑\n━━━━━━━━━━━ ✦ ━━━━━━━━━━━\n\n`;
  for (const membro of membros) texto += blocoMembro(membro, counts(membro.id, verificacoes), modelo);
  texto += fechamento(modelo);
  return texto.trim();
}
