export const APP_VERSION = "2.3.0";

export const COLLECTION_ROOT = "v2_subs";

export const CONFIG_ROOT = "v2_config";

export const SEM_OBRA_ID = "__SEM_OBRA__";

export const DIAS_SEMANA = [
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta"
];

export const STATUS_LEITURA = [
  { emoji: "", label: "Selecione" },
  { emoji: "🌙", label: "Leu" },
  { emoji: "☠", label: "Não leu" },
  { emoji: "💅", label: "Justificado" },
  { emoji: "🌼", label: "Já havia lido antes" },
  { emoji: "🙍", label: "Falta algo" },
  { emoji: "✨", label: "Obra do dia" },
  { emoji: "⏳", label: "Sem obra" },
  { emoji: "⚰", label: "Saiu do grupo" },
  { emoji: "🧕🏻", label: "Leitura em andamento" },
  { emoji: "⚠", label: "Infração das regras" },
  { emoji: "🚫", label: "Infração no tempo de leitura" },
  { emoji: "📲", label: "Prints no PV" },
  { emoji: "⛔", label: "Removido por infração" },
  { emoji: "⏰", label: "Leitura feita em tempo estimado" }
];

export const STATUS_QUE_CONTAM_LEITURA = ["🌙", "🌼", "✨"];

export const MODELOS_SUB = {
  chama: "Chama Eterna",
  pagina: "Página Livre",
  entreNos: "Entre Nós",
  trono: "Trono Profano",
  margens: "Margens de Mundos",
  cicatrizes: "Cicatrizes Literárias",
  ferias: "Sub de Férias",
  quasar: "Quasar",
  lamina: "Lâmina Sombria"
};

export const SUBS_OFICIAIS = ["A1", "A2", "A3", "A6", "A7", "A10", "A17"];

export const DEFAULT_MODELOS = {
  chama: {
    fichaCabecalho: `🌑👑 𝐕𝐄𝐑𝐈𝐅𝐈𝐂𝐀𝐂̧𝐎̃𝐄𝐒 👑🌑

🌜 𝐎𝐧𝐝𝐞 𝐚 𝐋𝐮𝐚 𝐢𝐥𝐮𝐦𝐢𝐧𝐚 𝐨𝐬 𝐥𝐢𝐯𝐫𝐨𝐬: 𝐋𝐮𝐧𝐚 𝐀-𝟏 🌛

🌙𝐋𝐞𝐮
☠𝐍𝐚̃𝐨 𝐥𝐞𝐮
💅 𝐉𝐮𝐬𝐭𝐢𝐟𝐢𝐜𝐚𝐝𝐨
🌼 𝐉𝐚́ 𝐡𝐚𝐯𝐢𝐚 𝐥𝐢𝐝𝐨 𝐚𝐧𝐭𝐞𝐬
🙍 𝐅𝐚𝐥𝐭𝐚 𝐚𝐥𝐠𝐨
✨𝐎𝐛𝐫𝐚 𝐝𝐨 𝐝𝐢𝐚
⏳ 𝐒𝐞𝐦 𝐨𝐛𝐫𝐚`,

    fichaMembro: `_____________

📙𝐍𝐨𝐦𝐞: {{nome}}
🦐𝐔𝐬𝐞𝐫: {{user}}

🏆  semanas: {{semana}}
💌  Dias: {{dias}}
👑 Pontos: {{pontos}}
📈 Feedback: {{feedbacks}}
📚 Capítulos Extras: {{extras}}
LEITURA LUNAR:

Obra 01.: {{obra1}}
Obra 02.: {{obra2}}`,

    fichaRodape: `—————————

🚨𝐀𝐓𝐄𝐍𝐂̧𝐀̃𝐎🚨

𝐏𝐚𝐫𝐚 𝐠𝐚𝐫𝐚𝐧𝐭𝐢𝐫 𝐚 𝐨𝐫𝐠𝐚𝐧𝐢𝐳𝐚𝐜̧𝐚̃𝐨, 𝐞́ 𝐢𝐦𝐩𝐨𝐫𝐭𝐚𝐧𝐭𝐞 𝐪𝐮𝐞 𝐭𝐨𝐝𝐨𝐬 𝐞𝐬𝐭𝐞𝐣𝐚𝐦 𝐞𝐦 𝐝𝐢𝐚.`,

    gradeSemanaCabecalho: ``,

    gradeDiaCabecalho: ``,

    gradeObra: `🔶🔶🔶🔶🔶🔶🔶🔶🔶🔶🔶🔶🔶🔶🔶

🍁🦊Obra {{numeroObra}} de {{diaTitulo}} 🦊🍁

🐦‍🔥Nome.: {{autor}}
🔸User.: {{user}}
📙Obra.: {{tituloObra}}
🪸 Link.: 🔗 {{link}}

🍂♦️Obs: {{regraLeitura}}♦️🍂
{{observacoes}}
{{alternativa}}`,

    gradeSeparador: ``,

    gradeRodape: `🔶🔶🔶🔶🔶🔶🔶🔶🔶🔶🔶🔶🔶🔶🔶`
  },

  pagina: {
    fichaCabecalho: `🧚‍♀️ 𝐕𝐄𝐑𝐈𝐅𝐈𝐂𝐀𝐂̧𝐎̃𝐄𝐒 🧚‍♀️
🌙𝐋𝐞𝐮
☠ 𝐍𝐚̃𝐨 𝐥𝐞𝐮
💅 𝐉𝐮𝐬𝐭𝐢𝐟𝐢𝐜𝐚𝐝𝐨
🌼 𝐉𝐚́ 𝐡𝐚𝐯𝐢𝐚 𝐥𝐢𝐝𝐨 𝐚𝐧𝐭𝐞𝐬
🙍 𝐅𝐚𝐥𝐭𝐚 𝐚𝐥𝐠𝐨 (𝐜𝐨𝐦𝐞𝐧𝐭𝐚́𝐫𝐢𝐨 𝐨𝐮 𝐯𝐨𝐭𝐨)
✨𝐎𝐛𝐫𝐚 𝐝𝐨 𝐝𝐢𝐚
⏳ 𝐒𝐞𝐦 𝐨𝐛𝐫𝐚
⚰ 𝐒𝐚𝐢𝐮 𝐝𝐨 𝐠𝐫𝐮𝐩𝐨
🧕🏻 𝐋𝐞𝐢𝐭𝐮𝐫𝐚 𝐞𝐦 𝐚𝐧𝐝𝐚𝐦𝐞𝐧𝐭𝐨 𝐧𝐨 𝐦𝐨𝐦𝐞𝐧𝐭𝐨 𝐝𝐚 𝐯𝐞𝐫𝐢𝐟𝐢𝐜𝐚𝐜̧𝐚̃𝐨
⚠ 𝐈𝐧𝐟𝐫𝐚𝐜̧𝐚̃𝐨 𝐝𝐚𝐬 𝐫𝐞𝐠𝐫𝐚𝐬
📲 𝐏𝐫𝐢𝐧𝐭𝐬 𝐧𝐨 𝐩𝐯
⛔ 𝐑𝐞𝐦𝐨𝐯𝐢𝐝𝐨 𝐩𝐨𝐫 𝐢𝐧𝐟𝐫𝐚𝐜̧𝐚̃𝐨 𝐝𝐚𝐬 𝐫𝐞𝐠𝐫𝐚𝐬
⏰ Leitura feita em tempo estimado`,

    fichaMembro: `🌊━━━━━━━━━━━🏝️━━━━━━━━━━━🌊
🌺 𝐍𝐨𝐦𝐞: {{nome}}
🌊 𝐔𝐬𝐞𝐫: {{user}}
☀️ ➤ 𝐒𝐄𝐌𝐀𝐍𝐀: {{semana}}
🌴 ➤ 𝐃𝐈𝐀: {{dias}}
🐚 ➤ 𝐏𝐎𝐍𝐓𝐎𝐒: {{pontos}}
📝 ➤ 𝐅𝐄𝐄𝐃𝐁𝐀𝐂𝐊: {{feedbacks}}
📚 ➤CAPÍTULOS EXTRAS: {{extras}}
📖 ➤ 𝐋𝐄𝐈𝐓𝐔𝐑𝐀 𝐋𝐔𝐍𝐀𝐑: {{leituraLunar}}
🌙 𝐎𝐁𝐑𝐀 𝟏: {{obra1}}
🌙 O𝐁𝐑𝐀 𝟐: {{obra2}}`,

    fichaRodape: `🌊━━━━━━━━━━━🏝️━━━━━━━━━━━🌊
🚨𝐀𝐓𝐄𝐍𝐂̧𝐀̃𝐎🚨
𝐏𝐚𝐫𝐚 𝐠𝐚𝐫𝐚𝐧𝐭𝐢𝐫 𝐚 𝐨𝐫𝐠𝐚𝐧𝐢𝐳𝐚𝐜̧𝐚̃𝐨 𝐞 𝐞𝐟𝐢𝐜𝐢𝐞̂𝐧𝐜𝐢𝐚 𝐝𝐨 𝐠𝐫𝐮𝐩𝐨, 𝐞́ 𝐢𝐦𝐩𝐨𝐫𝐭𝐚𝐧𝐭𝐞 𝐪𝐮𝐞 𝐭𝐨𝐝𝐨𝐬 𝐞𝐬𝐭𝐞𝐣𝐚𝐦 𝐞𝐦 𝐝𝐢𝐚 𝐜𝐨𝐦 𝐬𝐮𝐚𝐬 𝐥𝐞𝐢𝐭𝐮𝐫𝐚𝐬. 𝐒𝐞 𝐯𝐨𝐜𝐞̂ 𝐟𝐢𝐜𝐨𝐮 𝐝𝐞𝐯𝐞𝐧𝐝𝐨 𝐥𝐞𝐢𝐭𝐮𝐫𝐚, 𝐩𝐨𝐫 𝐟𝐚𝐯𝐨𝐫, 𝐞𝐧𝐯𝐢𝐞 𝐨𝐬 𝐩𝐫𝐢𝐧𝐭𝐬 𝐧𝐨 𝐩𝐫𝐢𝐯𝐚𝐝𝐨 𝐩𝐚𝐫𝐚 𝐪𝐮𝐞 𝐞𝐮 𝐩𝐨𝐬𝐬𝐚 𝐚𝐭𝐮𝐚𝐥𝐢𝐳𝐚𝐫 𝐬𝐞𝐮𝐬 𝐫𝐞𝐠𝐢𝐬𝐭𝐫𝐨𝐬.
𝐈𝐬𝐬𝐨 𝐞𝐯𝐢𝐭𝐚𝐫𝐚́ 𝐪𝐮𝐞 𝐞𝐮 𝐩𝐞𝐫𝐜𝐚 𝐭𝐞𝐦𝐩𝐨 𝐜𝐨𝐧𝐟𝐞𝐫𝐢𝐧𝐝𝐨 𝐚 𝐦𝐞𝐬𝐦𝐚 𝐜𝐨𝐢𝐬𝐚 𝐝𝐮𝐚𝐬 𝐯𝐞𝐳𝐞𝐬. 𝐀𝐥𝐞́𝐦 𝐝𝐢𝐬𝐬𝐨, 𝐬𝐞 𝐯𝐨𝐜𝐞̂ 𝐞𝐧𝐜𝐨𝐧𝐭𝐫𝐚𝐫 𝐚𝐥𝐠𝐮𝐦 𝐞𝐫𝐫𝐨 𝐧𝐚𝐬 𝐯𝐞𝐫𝐢𝐟𝐢𝐜𝐚𝐜̧𝐨̃𝐞𝐬, 𝐧𝐚̃𝐨 𝐡𝐞𝐬𝐢𝐭𝐞 𝐞𝐦 𝐦𝐞 𝐜𝐡𝐚𝐦𝐚𝐫 𝐧𝐨 𝐩𝐫𝐢𝐯𝐚𝐝𝐨. 𝐄𝐬𝐭𝐨𝐮 𝐚𝐪𝐮𝐢 𝐩𝐚𝐫𝐚 𝐚𝐣𝐮𝐝𝐚𝐫 𝐞 𝐫𝐞𝐬𝐨𝐥𝐯𝐞𝐫 𝐪𝐮𝐚𝐥𝐪𝐮𝐞𝐫 𝐩𝐫𝐨𝐛𝐥𝐞𝐦𝐚!
😉 𝐕𝐚𝐦𝐨𝐬 𝐦𝐚𝐧𝐭𝐞𝐫 𝐨 𝐠𝐫𝐮𝐩𝐨 𝐨𝐫𝐠𝐚𝐧𝐢𝐳𝐚𝐝𝐨 𝐞 𝐟𝐨𝐜𝐚𝐝𝐨 𝐧𝐚𝐬 𝐡𝐢𝐬𝐭𝐨́𝐫𝐢𝐚𝐬 𝐢𝐧𝐜𝐫𝐢́𝐯𝐞𝐢𝐬 𝐪𝐮𝐞  𝐜𝐨𝐦𝐩𝐚𝐫𝐭𝐢𝐥𝐡𝐚𝐦𝐨𝐬! 𝐎𝐛𝐫𝐢𝐠𝐚𝐝𝐚 𝐩𝐞𝐥𝐚 𝐜𝐨𝐨𝐩𝐞𝐫𝐚𝐜̧𝐚̃𝐨! 📚👍`,

    gradeSemanaCabecalho: `✨ PÁGINA LIVRE — 𝐀-2 ✨`,

    gradeDiaCabecalho: ``,

    gradeDiaBlocoCabecalho: `🐉✨🧙‍♀️ ⋆｡˚✦ ─ ⭒ ─ ✦˚｡⋆ 🏰✨🧚‍♀️
{{diaMaiusculo}}`,

    gradeObra: `⤷ {{numeroObraIcone}} 𝐎𝐁𝐑𝐀 {{numeroObraDecorado}} ˎˊ˗
👤 𝐍𝐎𝐌𝐄: {{autor}}
🧙‍♀️ 𝐔𝐒𝐄𝐑: {{userOriginal}}
📖 𝐎𝐁𝐑𝐀: {{tituloObra}}
🔗 𝐋𝐈𝐍𝐊: {{linkMarkdown}}
{{observacoesOuRegra}}`,

    gradeSeparador: `· · ───── · 🧙‍♀️ · ───── · ·`,

    gradeRodape: ``,
    renderSemObra: true
  },

  entreNos: {
    fichaCabecalho: `🌈 𝐕𝐄𝐑𝐈𝐅𝐈𝐂𝐀𝐂̧𝐎̃𝐄𝐒 🤍

🌙 𝐋𝐞𝐮
☠ 𝐍𝐚̃𝐨 𝐥𝐞𝐮
💅 𝐉𝐮𝐬𝐭𝐢𝐟𝐢𝐜𝐚𝐝𝐨
🌼 𝐉𝐚́ 𝐡𝐚𝐯𝐢𝐚 𝐥𝐢𝐝𝐨 𝐚𝐧𝐭𝐞𝐬
🙍 𝐅𝐚𝐥𝐭𝐚 𝐚𝐥𝐠𝐨 (𝐜𝐨𝐦𝐞𝐧𝐭𝐚́𝐫𝐢𝐨 𝐨𝐮 𝐯𝐨𝐭𝐨)
✨ 𝐎𝐛𝐫𝐚 𝐝𝐨 𝐝𝐢𝐚
⏳ 𝐒𝐞𝐦 𝐨𝐛𝐫𝐚
⚰ 𝐒𝐚𝐢𝐮 𝐝𝐨 𝐠𝐫𝐮𝐩𝐨
🧕🏻 𝐋𝐞𝐢𝐭𝐮𝐫𝐚 𝐞𝐦 𝐚𝐧𝐝𝐚𝐦𝐞𝐧𝐭𝐨 𝐧𝐨 𝐦𝐨𝐦𝐞𝐧𝐭𝐨 𝐝𝐚 𝐯𝐞𝐫𝐢𝐟𝐢𝐜𝐚𝐜̧𝐚̃𝐨
⚠ 𝐈𝐧𝐟𝐫𝐚𝐜̧𝐚̃𝐨 𝐝𝐚𝐬 𝐫𝐞𝐠𝐫𝐚𝐬
📲 𝐏𝐫𝐢𝐧𝐭𝐬 𝐧𝐨 𝐩𝐯
⛔ 𝐑𝐞𝐦𝐨𝐯𝐢𝐝𝐨 𝐩𝐨𝐫 𝐢𝐧𝐟𝐫𝐚𝐜̧𝐚̃𝐨 𝐝𝐚𝐬 𝐫𝐞𝐠𝐫𝐚𝐬
⏰ 𝐋𝐞𝐢𝐭𝐮𝐫𝐚 𝐟𝐞𝐢𝐭𝐚 𝐞𝐦 𝐭𝐞𝐦𝐩𝐨 𝐞𝐬𝐭𝐢𝐦𝐚𝐝𝐨`,

    fichaMembro: `🌈━━━━━━━━━━━🤍━━━━━━━━━━━🌈

❤️ 𝐍𝐨𝐦𝐞: {{nome}}
🌹 𝐔𝐬𝐞𝐫: {{user}}

🌈 ➤ 𝐒𝐄𝐌𝐀𝐍𝐀: {{semana}}
🤍 ➤ 𝐃𝐈𝐀: {{dias}}
✨ ➤ 𝐏𝐎𝐍𝐓𝐎𝐒: {{pontos}}
📝 ➤ 𝐅𝐄𝐄𝐃𝐁𝐀𝐂𝐊: {{feedbacks}}
📖 ➤ 𝐋𝐄𝐈𝐓𝐔𝐑𝐀 𝐋𝐔𝐍𝐀𝐑: {{leituraLunar}}

🌙 𝐎𝐁𝐑𝐀 𝟏: {{obra1}}
🌙 𝐎𝐁𝐑𝐀 𝟐: {{obra2}}`,

    fichaRodape: `🌈━━━━━━━━━━━🤍━━━━━━━━━━━🌈

🚨𝐀𝐓𝐄𝐍𝐂̧𝐀̃𝐎🚨

𝐏𝐚𝐫𝐚 𝐠𝐚𝐫𝐚𝐧𝐭𝐢𝐫 𝐚 𝐨𝐫𝐠𝐚𝐧𝐢𝐳𝐚𝐜̧𝐚̃𝐨 𝐞 𝐞𝐟𝐢𝐜𝐢𝐞̂𝐧𝐜𝐢𝐚 𝐝𝐨 𝐠𝐫𝐮𝐩𝐨, 𝐞́ 𝐢𝐦𝐩𝐨𝐫𝐭𝐚𝐧𝐭𝐞 𝐪𝐮𝐞 𝐭𝐨𝐝𝐨𝐬 𝐞𝐬𝐭𝐞𝐣𝐚𝐦 𝐞𝐦 𝐝𝐢𝐚 𝐜𝐨𝐦 𝐬𝐮𝐚𝐬 𝐥𝐞𝐢𝐭𝐮𝐫𝐚𝐬. 𝐒𝐞 𝐯𝐨𝐜𝐞̂ 𝐟𝐢𝐜𝐨𝐮 𝐝𝐞𝐯𝐞𝐧𝐝𝐨 𝐥𝐞𝐢𝐭𝐮𝐫𝐚, 𝐩𝐨𝐫 𝐟𝐚𝐯𝐨𝐫, 𝐞𝐧𝐯𝐢𝐞 𝐨𝐬 𝐩𝐫𝐢𝐧𝐭𝐬 𝐧𝐨 𝐩𝐫𝐢𝐯𝐚𝐝𝐨 𝐩𝐚𝐫𝐚 𝐪𝐮𝐞 𝐞𝐮 𝐩𝐨𝐬𝐬𝐚 𝐚𝐭𝐮𝐚𝐥𝐢𝐳𝐚𝐫 𝐬𝐞𝐮𝐬 𝐫𝐞𝐠𝐢𝐬𝐭𝐫𝐨𝐬.

𝐈𝐬𝐬𝐨 𝐞𝐯𝐢𝐭𝐚𝐫𝐚́ 𝐪𝐮𝐞 𝐞𝐮 𝐩𝐞𝐫𝐜𝐚 𝐭𝐞𝐦𝐩𝐨 𝐜𝐨𝐧𝐟𝐞𝐫𝐢𝐧𝐝𝐨 𝐚 𝐦𝐞𝐬𝐦𝐚 𝐜𝐨𝐢𝐬𝐚 𝐝𝐮𝐚𝐬 𝐯𝐞𝐳𝐞𝐬. 𝐀𝐥𝐞́𝐦 𝐝𝐢𝐬𝐬𝐨, 𝐬𝐞 𝐯𝐨𝐜𝐞̂ 𝐞𝐧𝐜𝐨𝐧𝐭𝐫𝐚𝐫 𝐚𝐥𝐠𝐮𝐦 𝐞𝐫𝐫𝐨 𝐧𝐚𝐬 𝐯𝐞𝐫𝐢𝐟𝐢𝐜𝐚𝐜̧𝐨̃𝐞𝐬, 𝐧𝐚̃𝐨 𝐡𝐞𝐬𝐢𝐭𝐞 𝐞𝐦 𝐦𝐞 𝐜𝐡𝐚𝐦𝐚𝐫 𝐧𝐨 𝐩𝐫𝐢𝐯𝐚𝐝𝐨. 𝐄𝐬𝐭𝐨𝐮 𝐚𝐪𝐮𝐢 𝐩𝐚𝐫𝐚 𝐚𝐣𝐮𝐝𝐚𝐫 𝐞 𝐫𝐞𝐬𝐨𝐥𝐯𝐞𝐫 𝐪𝐮𝐚𝐥𝐪𝐮𝐞𝐫 𝐩𝐫𝐨𝐛𝐥𝐞𝐦𝐚!

😉 𝐕𝐚𝐦𝐨𝐬 𝐦𝐚𝐧𝐭𝐞𝐫 𝐨 𝐠𝐫𝐮𝐩𝐨 𝐨𝐫𝐠𝐚𝐧𝐢𝐳𝐚𝐝𝐨 𝐞 𝐟𝐨𝐜𝐚𝐝𝐨 𝐧𝐚𝐬 𝐡𝐢𝐬𝐭𝐨́𝐫𝐢𝐚𝐬 𝐢𝐧𝐜𝐫𝐢́𝐯𝐞𝐢𝐬 𝐪𝐮𝐞 𝐜𝐨𝐦𝐩𝐚𝐫𝐭𝐢𝐥𝐡𝐚𝐦𝐨𝐬! 𝐎𝐛𝐫𝐢𝐠𝐚𝐝𝐚 𝐩𝐞𝐥𝐚 𝐜𝐨𝐨𝐩𝐞𝐫𝐚𝐜̧𝐚̃𝐨! 📚👍`,

    gradeSemanaCabecalho: ``,

    gradeDiaCabecalho: ``,

    gradeDiaBlocoCabecalho: `🌈━━━━━━━━━━🤍━━━━━━━━━━🌈
📋 𝐆𝐑𝐀𝐃𝐄 • {{diaMaiusculoEstilizado}}`,

    gradeObra: `📖 𝐎𝐁𝐑𝐀 𝟏
{{diaNomeIcone}} 𝐍𝐨𝐦𝐞: {{autor}}
{{diaUserIcone}} 𝐔𝐬𝐞𝐫: {{userOriginal}}
📚 𝐎𝐛𝐫𝐚: {{tituloObra}}
🔗 𝐋𝐢𝐧𝐤: {{linkMarkdown}}
📝 𝐎𝐛𝐬𝐞𝐫𝐯𝐚çõ𝐞𝐬: {{observacoesOuRegra}}`,

    gradeSeparador: ``,

    gradeDiaBlocoRodape: `🌈━━━━━━━━━━🤍━━━━━━━━━━🌈`,

    gradeRodape: ``
  },

  trono: {
    fichaCabecalho: `𖤐⛓️🔥 𝐀-𝟔 — 𝐓𝐑𝐎𝐍𝐎 𝐏𝐑𝐎𝐅𝐀𝐍𝐎 🔥⛓️𖤐
━━━━━━━━━━━ 𖤐 ━━━━━━━━━━━
📜 𝐕𝐄𝐑𝐈𝐅𝐈𝐂𝐀𝐂̧𝐀̃𝐎
━━━━━━━━━━━ 𖤐 ━━━━━━━━━━━

🌙 𝐋𝐞𝐮
☠️ 𝐍𝐚̃𝐨 𝐥𝐞𝐮
💅 𝐉𝐮𝐬𝐭𝐢𝐟𝐢𝐜𝐚𝐝𝐨
📜 𝐉𝐚́ 𝐡𝐚𝐯𝐢𝐚 𝐥𝐢𝐝𝐨 𝐚𝐧𝐭𝐞𝐬
🙍 𝐅𝐚𝐥𝐭𝐚 𝐚𝐥𝐠𝐨
✨ 𝐎𝐛𝐫𝐚 𝐝𝐨 𝐝𝐢𝐚
⏳ 𝐒𝐞𝐦 𝐨𝐛𝐫𝐚
⚰️ 𝐒𝐚𝐢𝐮 𝐝𝐨 𝐠𝐫𝐮𝐩𝐨
🕯️ 𝐋𝐞𝐢𝐭𝐮𝐫𝐚 𝐞𝐦 𝐚𝐧𝐝𝐚𝐦𝐞𝐧𝐭𝐨
⚠️ 𝐈𝐧𝐟𝐫𝐚𝐜̧𝐚̃𝐨
🚫 𝐈𝐧𝐟𝐫𝐚𝐜̧𝐚̃𝐨 𝐧𝐨 𝐭𝐞𝐦𝐩𝐨
📲 𝐏𝐫𝐢𝐧𝐭𝐬 𝐧𝐨 𝐩𝐯
⛔ 𝐑𝐞𝐦𝐨𝐯𝐢𝐝𝐨
⏰ 𝐋𝐞𝐢𝐭𝐮𝐫𝐚 𝐟𝐞𝐢𝐭𝐚 𝐞𝐦 𝐭𝐞𝐦𝐩𝐨

━━━━━━━━━━━ 𖤐 ━━━━━━━━━━━
📖 𝐅𝐈𝐂𝐇𝐀 𝐃𝐎 𝐋𝐄𝐈𝐓𝐎𝐑
━━━━━━━━━━━ 𖤐 ━━━━━━━━━━━`,

    fichaMembro: `━━━━━━━━━━━ 𖤐 ━━━━━━━━━━━

♛ 𝐍𝐨𝐦𝐞: {{nome}}
♜ 𝐔𝐬𝐞𝐫: {{user}}

🌙 𝐒𝐞𝐦𝐚𝐧𝐚𝐬: {{semana}}
📅 𝐃𝐢𝐚𝐬: {{dias}}
⭐ 𝐏𝐨𝐧𝐭𝐨𝐬: {{pontos}}
💬 𝐅𝐞𝐞𝐝𝐛𝐚𝐜𝐤: {{feedbacks}}
🔮 𝐋𝐞𝐢𝐭𝐮𝐫𝐚 𝐋𝐮𝐧𝐚𝐫:

📕 𝐆𝐫𝐢𝐦𝐨́𝐫𝐢𝐨 𝟎𝟏: {{obra1}}
📕 𝐆𝐫𝐢𝐦𝐨́𝐫𝐢𝐨 𝟎𝟐: {{obra2}}

🔮 𝐋𝐞𝐢𝐭𝐮𝐫𝐚 𝐄𝐱𝐭𝐫𝐚: {{extras}}`,

    fichaRodape: `━━━━━━━━━━━ 𖤐 ━━━━━━━━━━━

🚨 𝐀𝐓𝐄𝐍𝐂̧𝐀̃𝐎 🚨

𝐏𝐚𝐫𝐚 𝐠𝐚𝐫𝐚𝐧𝐭𝐢𝐫 𝐚 𝐨 𝐛𝐨𝐦 𝐚𝐧𝐝𝐚𝐦𝐞𝐧𝐭𝐨 𝐝𝐨 𝐓𝐫𝐨𝐧𝐨 𝐏𝐫𝐨𝐟𝐀𝐍𝐎, 𝐞́ 𝐢𝐦𝐩𝐨𝐫𝐭𝐚𝐧𝐭𝐞 𝐪𝐮𝐞 𝐭𝐨𝐝𝐨𝐬 𝐞𝐬𝐭𝐞𝐣𝐚𝐦 𝐞𝐦 𝐝𝐢𝐚.`,

    gradeSemanaCabecalho: `𖤐⛓️🔥 𝐀-𝟔 — 𝐓𝐑𝐎𝐍𝐎 𝐏𝐑𝐎𝐅𝐀𝐍𝐎 🔥⛓️𖤐
𝐆𝐑𝐀𝐃𝐄 𝐃𝐄 𝐎𝐁𝐑𝐀𝐒 𝐃𝐀 𝐒𝐄𝐌𝐀𝐍𝐀`,

    gradeDiaCabecalho: `𖤐⛓️🔥 𝐀-𝟔 — 𝐓𝐑𝐎𝐍𝐎 𝐏𝐑𝐎𝐅𝐀𝐍𝐎 🔥⛓️𖤐`,

    gradeObra: `━━━━━━━━━━━ 𖤐 ━━━━━━━━━━━
🌙🔥 {{diaMaiusculo}} {{numeroObra}}
━━━━━━━━━━━ 𖤐 ━━━━━━━━━━━

🔥 𝐍𝐎𝐌𝐄: {{autor}}
♜ 𝐔𝐒𝐄𝐑: {{user}}
📕 𝐆𝐑𝐈𝐌𝐎́𝐑𝐈𝐎/𝐎𝐁𝐑𝐀: {{tituloObra}}
🔗 𝐋𝐈𝐍𝐊: {{link}}

⚠️ 𝐎𝐁𝐒.: {{regraLeitura}}

{{observacoes}}

Lembrem-se: os comentários devem estar bem distribuídos entre o início, o meio e o fim.

{{alternativa}}`,

    gradeSeparador: ``,

    gradeRodape: `━━━━━━━━━━━ 𖤐 ━━━━━━━━━━━

🔥 Que os grimórios sejam abertos,
que as leituras sejam seladas no fogo,
e que as obras dignas encontrem seu lugar no 𝐓𝐫𝐨𝐧𝐨 𝐏𝐫𝐨𝐅𝐀𝐍𝐎.`
  },

  margens: {
    fichaCabecalho: `✦🗺️📖 𝐀-𝟕 — 𝐌𝐀𝐑𝐆𝐄𝐍𝐒 𝐃𝐄 𝐌𝐔𝐍𝐃𝐎𝐒 📖🗺️✦
━━━━━━━━━━━ ✦ ━━━━━━━━━━━
📜 𝐕𝐄𝐑𝐈𝐅𝐈𝐂𝐀𝐂̧𝐀̃𝐎
━━━━━━━━━━━ ✦ ━━━━━━━━━━━

🌙 𝐋𝐞𝐮
🌑 𝐍𝐚̃𝐨 𝐥𝐞𝐮
💅 𝐉𝐮𝐬𝐭𝐢𝐟𝐢𝐜𝐚𝐝𝐨
📜 𝐉𝐚́ 𝐡𝐚𝐯𝐢𝐚 𝐥𝐢𝐝𝐨 𝐚𝐧𝐭𝐞𝐬
🙍 𝐅𝐚𝐥𝐭𝐚 𝐚𝐥𝐠𝐨
✨ 𝐎𝐛𝐫𝐚 𝐝𝐨 𝐝𝐢𝐚
⏳ 𝐒𝐞𝐦 𝐨𝐛𝐫𝐚

━━━━━━━━━━━ ✦ ━━━━━━━━━━━
📖 𝐅𝐈𝐂𝐇𝐀 𝐃𝐎 𝐋𝐄𝐈𝐓𝐎𝐑
━━━━━━━━━━━ ✦ ━━━━━━━━━━━`,

    fichaMembro: `━━━━━━━━━━━ ✦ ━━━━━━━━━━━

🗝️ 𝐍𝐨𝐦𝐞: {{nome}}
🧭 𝐔𝐬𝐞𝐫: {{user}}

🌙 𝐒𝐞𝐦𝐚𝐧𝐚𝐬: {{semana}}
📅 𝐃𝐢𝐚𝐬: {{dias}}
⭐ 𝐏𝐨𝐧𝐭𝐨𝐬: {{pontos}}
💬 𝐅𝐞𝐞𝐝𝐛𝐚𝐜𝐤: {{feedbacks}}
🌌 𝐋𝐞𝐢𝐭𝐮𝐫𝐚 𝐋𝐮𝐧𝐚𝐑:

📖 𝐌𝐮𝐧𝐝𝐨 𝟎𝟏: {{obra1}}
📖 𝐌𝐮𝐧𝐝𝐨 𝟎𝟐: {{obra2}}

🗺️ 𝐋𝐞𝐢𝐭𝐮𝐫𝐚 𝐄𝐱𝐭𝐫𝐚: {{extras}}`,

    fichaRodape: `━━━━━━━━━━━ ✦ ━━━━━━━━━━━

🚨 𝐀𝐓𝐄𝐍𝐂̧𝐀̃𝐎 🚨

𝐏𝐚𝐫𝐚 𝐠𝐚𝐫𝐚𝐧𝐭𝐢𝐫 𝐚 𝐨 𝐛𝐨𝐦 𝐚𝐧𝐝𝐚𝐦𝐞𝐧𝐭𝐨 𝐝𝐨 𝐌𝐚𝐫𝐠𝐞𝐧𝐬 𝐝𝐞 𝐌𝐮𝐧𝐝𝐨𝐬, 𝐭𝐨𝐝𝐨𝐬 𝐝𝐞𝐯𝐞𝐦 𝐞𝐬𝐭𝐚𝐫 𝐞𝐦 𝐝𝐢𝐚.`,

    gradeSemanaCabecalho: `✦🗺️📖 𝐀-𝟕 — 𝐌𝐀𝐑𝐆𝐄𝐍𝐒 𝐃𝐄 𝐌𝐔𝐍𝐃𝐎𝐒 📖🗺️✦
𝐆𝐑𝐀𝐃𝐄 𝐃𝐄 𝐎𝐁𝐑𝐀𝐒 𝐃𝐀 𝐒𝐄𝐌𝐀𝐍𝐀`,

    gradeDiaCabecalho: `✦🗺️📖 𝐀-𝟕 — 𝐌𝐀𝐑𝐆𝐄𝐍𝐒 𝐃𝐄 𝐌𝐔𝐍𝐃𝐎𝐒 📖🗺️✦`,

    gradeObra: `━━━━━━━━━━━ ✦ ━━━━━━━━━━━
🌙🌌 {{diaMaiusculo}} {{numeroObra}}
━━━━━━━━━━━ ✦ ━━━━━━━━━━━

🌿 𝐍𝐎𝐌𝐄: {{autor}}
🧭 𝐔𝐒𝐄𝐑: {{user}}
📖 𝐌𝐔𝐍𝐃𝐎/𝐎𝐁𝐑𝐀: {{tituloObra}}
🔗 𝐋𝐈𝐍𝐊: {{link}}

⚠️ 𝐎𝐁𝐒.:

{{regraLeitura}}

{{observacoes}}

Lembrem-se: os comentários devem estar bem distribuídos entre o início, o meio e o fim.

{{alternativa}}`,

    gradeSeparador: ``,

    gradeRodape: `━━━━━━━━━━━ ✦ ━━━━━━━━━━━

🌌 Que os mundos sejam abertos,
que as leituras atravessem fronteiras,
e que cada obra encontre seu caminho
nas 𝐌𝐚𝐫𝐠𝐞𝐧𝐬 𝐝𝐞 𝐌𝐮𝐧𝐝𝐨𝐬.`
  },

  cicatrizes: {
    fichaCabecalho: `✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦

✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦
🫀𝐕𝐄𝐑𝐈𝐅𝐈𝐂𝐀𝐂̧𝐎̃𝐄𝐒 🫀

🩻𝐎𝐧𝐝𝐞 𝐚 𝐥𝐮𝐚 𝐢𝐥𝐮𝐦𝐢𝐧𝐚 𝐨𝐬 𝐋𝐢𝐯𝐫𝐨𝐬 
𝐂𝐢𝐜𝐚𝐭𝐫𝐢𝐳𝐞𝐬 𝐋𝐢𝐭𝐞𝐫𝐚́𝐫𝐢𝐚𝐬 𝐀-9🩻

🌙𝐋𝐞𝐮
☠𝐍𝐚̃𝐨 𝐥𝐞𝐮
💅 𝐉𝐮𝐬𝐭𝐢𝐟𝐢𝐜𝐚𝐝𝐨
🌼 𝐉𝐚́ 𝐡𝐚𝐯𝐢𝐚 𝐥𝐢𝐝𝐨 𝐚𝐧𝐭𝐞𝐬
🙍 𝐅𝐚𝐥𝐭𝐚 𝐚𝐥𝐠𝐨
✨𝐎𝐛𝐫𝐚 𝐝𝐨 𝐝𝐢𝐚
⏳ 𝐒𝐞𝐦 𝐨𝐛𝐫𝐚
⚰ 𝐒𝐚𝐢𝐮 𝐝𝐨 𝐠𝐫𝐮𝐩𝐨

───`,

    fichaMembro: `───

🫟𝑵𝒐𝒎𝒆: {{nome}}
🫟𝑼𝒔𝒆𝒓: {{user}}

🏆 𝑺𝒆𝒎𝒂𝒏𝒂𝒔: {{semana}}
💌 𝑫𝒊𝒂𝒔: {{dias}}
👑 𝑷𝒐𝒏𝒕𝒐𝒔: {{pontos}}
📊 𝑭𝒆𝒅𝒃𝒆𝒆𝒄𝒌: {{feedbacks}}
🌟𝑳𝒆𝒊𝒕𝒖𝒓𝒂 𝑳𝒖𝒏𝒂𝒓:

*OBRA 1*: {{obra1}}
*OBRA 2*: {{obra2}}

───`,

    fichaRodape: `───

🚨𝐀𝐓𝐄𝐍𝐂̧𝐀̃𝐎🚨

𝐏𝐚𝐫𝐚 𝐠𝐚𝐫𝐚𝐧𝐭𝐢𝐫 𝐚 𝐨𝐫𝐠𝐚𝐧𝐢𝐳𝐚𝐜̧𝐚̃𝐨 𝐞 𝐞𝐟𝐢𝐜𝐢𝐞̂𝐧𝐜𝐢𝐚 𝐝𝐨 𝐠𝐫𝐮𝐩𝐨, 𝐞́ 𝐢𝐦𝐩𝐨𝐫𝐭𝐚𝐧𝐭𝐞 𝐪𝐮𝐞 𝐭𝐨𝐝𝐨𝐬 𝐞𝐬𝐭𝐞𝐣𝐚𝐦 𝐞𝐦 𝐝𝐢𝐚.

😉 𝐕𝐚𝐦𝐨𝐬 𝐦𝐚𝐧𝐭𝐞𝐫 𝐨 𝐠𝐫𝐮𝐩𝐨 𝐨𝐫𝐠𝐚𝐧𝐢𝐳𝐚𝐝𝐨!`,

    gradeSemanaCabecalho: `✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦

✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦
🫀𝐕𝐄𝐑𝐈𝐅𝐈𝐂𝐀𝐂̧𝐎̃𝐄𝐒 🫀

🩻𝐎𝐧𝐝𝐞 𝐚 𝐥𝐮𝐚 𝐢𝐥𝐮𝐦𝐢𝐧𝐚 𝐨𝐬 𝐋𝐢𝐯𝐫𝐨𝐬 
𝐂𝐢𝐜𝐚𝐭𝐫𝐢𝐳𝐞𝐬 𝐋𝐢𝐭𝐞𝐫𝐚́𝐫𝐢𝐚𝐬 𝐀-9🩻`,

    gradeDiaCabecalho: `✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦✦ ✦ ✦ ✦ ✦ ✦ ✦
             A-9 - CICATRIZES LITERÁRIAS
✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦✦ ✦ ✦ ✦ ✦ ✦ ✦`,

    gradeObra: `🪻*{{diaMaiusculo}} {{numeroObra}}*🪻

🩻𝑛𝑜𝑚𝑒: {{autor}}
🩻𝑢𝑠𝑒𝑟: {{user}}
🩻𝑜𝑏𝑟𝑎: {{tituloObra}}
🩻𝑙𝑖𝑛𝑘: {{link}}

🧠 OBS: {{regraLeitura}}
{{observacoes}}
{{alternativa}}`,

    gradeSeparador: `✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦`,

    gradeRodape: ``
  },

  ferias: {
    fichaCabecalho: `🌴🌊 SUB DE FÉRIAS SF-04 • ÁGUA FRESCA 🥥☀️

🌙 Leu
☠️ Não leu
💅 Justificado
🌼 Já havia lido antes
🙍 Falta algo
✨ Obra do dia
⏳ Sem obra`,

    fichaMembro: `━━━━━━━━━━━━━━

👤 Nome: {{nome}}
🏖️ User: {{user}}

📆 Semanas: {{semana}}
🗓️ Dias: {{dias}}
⭐ Pontos: {{pontos}}
💬 Feedbacks: {{feedbacks}}
📚 Capítulos Extras: {{extras}}
🌌 Leitura Lunar: {{leituraLunar}}

📖 Obra 01: {{obra1}}
📖 Obra 02: {{obra2}}`,

    fichaRodape: `━━━━━━━━━━━━━━

🌴🌊 Projeto Lunar • Sub de Férias SF-04 – Água Fresca 🥥☀️`,

    gradeSemanaCabecalho: `🌴🌊 SUB DE FÉRIAS SF-04 • ÁGUA FRESCA 🥥☀️`,

    gradeDiaCabecalho: `🌴🌊 SUB DE FÉRIAS SF-04 • ÁGUA FRESCA 🥥☀️`,

    gradeObra: `📖 Nome da Obra: *{{tituloObra}}*
✍️ Autor: *{{autor}}*
👤 User: *{{user}}*
🔗 Link:
{{link}}

━━━━━━━━━━━━━━

📜 O prólogo possui mais de 1.000 palavras?
Se sim, informe a quantidade.
*{{prologoMais1000}}*

━━━━━━━━━━━━━━

📚 Há capítulos com mais de 4.100 palavras?
Se sim, informe apenas os números.
*{{capitulosMais4100}}*

━━━━━━━━━━━━━━

📝 Há capítulos com menos de 500 palavras?
Se sim, informe apenas os números.
*{{capitulosMenos500}}*
━━━━━━━━━━━━━━

⚠️ A obra contém gatilhos?
Se sim, informe quais.
*{{gatilhosObra}}*
━━━━━━━━━━━━━━

🛡️ Você possui algum gatilho de leitura?
Se sim, informe quais.
*{{gatilhosLeitura}}*
━━━━━━━━━━━━━━

{{alternativa}}`,

    gradeSeparador: `━━━━━━━━━━━━━━`,

    gradeRodape: `🌴🌊 Projeto Lunar • Sub de Férias SF-04 – Água Fresca 🥥☀️`
  },

  quasar: {
    fichaCabecalho: `🌑👑 𝐕𝐄𝐑𝐈𝐅𝐈𝐂𝐀ÇÕ𝐄𝐒 𝐐𝐔𝐀𝐒𝐀𝐑 𝐀-𝟏𝟎 👑🌑
━━━━━━━━━━━━━━━

🌜 𝐎𝐧𝐝𝐞 𝐚 𝐋𝐮𝐚 𝐢𝐥𝐮𝐦𝐢𝐧𝐚 𝐨𝐬 𝐥𝐢𝐯𝐫𝐨𝐬:

🌙 Leu
☠️ Não leu
💅 Justificado
🌼 Já havia lido antes
🙍 Falta algo
✨ Obra do dia
⏳ Sem obra
⚰️ Saiu do grupo
🧕🏻 Leitura em andamento
⚠️ Infração das regras
🚫 Tempo inferior
📲 Prints no PV
⏰ Fora do tempo estimado`,

    fichaMembro: `━━━━━━━━━━━━━━━

🕷️ 𝐍𝐨𝐦𝐞: {{nome}}
🕷️ 𝐔𝐬𝐞𝐫: {{user}}

🏆 Semana: {{semana}}
💌  Dias: {{dias}}
👑 Pontos: {{pontos}}
📚 Leitura Lunar: {{leituraLunar}}

🌋 Obra 01: {{obra1}}
Feedback: {{feedbacks}}
📚 Capítulos Extras: {{extras}}`,

    fichaRodape: `━━━━━━━━━━━━━━━

🚨 𝐀𝐓𝐄𝐍ÇÃ𝐎 🚨

Para manter o Quasar A-10 organizado, quem ainda ficou devendo feedback, voto ou comentário deve enviar os prints no privado da ADM responsável.

Caso encontre algum erro na verificação, chame no PV para correção.

🔥 𝐀𝐃𝐌: Alana
━─────── • 𝐏𝐫𝐨𝐣. 𝐋𝐮𝐧𝐚𝐫 • ───────━`,

    gradeSemanaCabecalho: `━━━ • 🌌 𝐐𝐔𝐀𝐒𝐀𝐑 𝐀-10 • ━━━
𝐆𝐑𝐀𝐃𝐄 𝐃𝐄 𝐎𝐁𝐑𝐀𝐒 𝐃𝐀 𝐒𝐄𝐌𝐀𝐍𝐀`,

    gradeDiaCabecalho: `━━━ • 🌌 𝐐𝐔𝐀𝐒𝐀𝐑 𝐀-10 • ━━━
𝐆𝐑𝐀𝐃𝐄 𝐃𝐄 𝐎𝐁𝐑𝐀𝐒 𝐃𝐀 𝐒𝐄𝐌𝐀𝐍𝐀`,

    gradeObra: `OBRA DE {{diaTitulo}}

🌠 𝐍𝐨𝐦𝐞 𝐝𝐚 𝐎𝐛𝐫𝐚: {{tituloObra}}
🪐 𝐀𝐮𝐭𝐨𝐫: {{autor}}
✨ 𝐔𝐬𝐞𝐫: {{user}}
🌌 𝐋𝐢𝐧𝐤: 🔗 {{link}}

🛎️Obs.: {{regraLeitura}}
{{observacoes}}

{{alternativa}}`,

    gradeSeparador: `✨✨✨✨✨✨✨✨`,

    gradeRodape: `✨✨✨✨✨✨✨✨`
  },

  lamina: {
    fichaCabecalho: `⚔️🌑🖤 𝐀-𝟏𝟕 — 𝐋𝐀̂𝐌𝐈𝐍𝐀 𝐒𝐎𝐌𝐁𝐑𝐈𝐀 🖤🌑⚔️
━━━━━━━━━━━ ⚔️ ━━━━━━━━━━━
                          📜 𝐕𝐄𝐑𝐈𝐅𝐈𝐂𝐀𝐂̧𝐀̃𝐎
━━━━━━━━━━━ ⚔️ ━━━━━━━━━━━

🌙 𝐋𝐞𝐮
🌑 𝐍𝐚̃𝐨 𝐥𝐞𝐮
🛡️ 𝐉𝐮𝐬𝐭𝐢𝐟𝐢𝐜𝐚𝐝𝐨
📜 𝐉𝐚́ 𝐡𝐚𝐯𝐢𝐚 𝐥𝐢𝐝𝐨 𝐚𝐧𝐭𝐞𝐬
🙍 𝐅𝐚𝐥𝐭𝐚 𝐚𝐥𝐠𝐨 (𝐜𝐨𝐦𝐞𝐧𝐭𝐚́𝐫𝐢𝐨 𝐨𝐮 𝐯𝐨𝐭𝐨)
⚔️ 𝐎𝐛𝐫𝐚 𝐝𝐨 𝐝𝐢𝐚
⏳ 𝐒𝐞𝐦 𝐨𝐛𝐫𝐚
🚪 𝐒𝐚𝐢𝐮 𝐝𝐨 𝐠𝐫𝐮𝐩𝐨
🗡️ 𝐋𝐞𝐢𝐭𝐮𝐫𝐚 𝐞𝐦 𝐚𝐧𝐝𝐚𝐦𝐞𝐧𝐭𝐨 𝐧𝐨 𝐦𝐨𝐦𝐞𝐧𝐭𝐨 𝐝𝐚 𝐯𝐞𝐫𝐢𝐟𝐢𝐜𝐚𝐜̧𝐚̃𝐨
⚠️ 𝐈𝐧𝐟𝐫𝐚𝐜̧𝐚̃𝐨 𝐝𝐚𝐬 𝐫𝐞𝐠𝐫𝐚𝐬
⛔ 𝐑𝐞𝐦𝐨𝐯𝐢𝐝𝐨 𝐩𝐨𝐫 𝐢𝐧𝐟𝐫𝐚𝐜̧𝐚̃𝐨 𝐝𝐚𝐬 𝐫𝐞𝐠𝐫𝐚𝐬

━━━━━━━━━━━ ⚔️ ━━━━━━━━━━━
📖 𝐅𝐈𝐂𝐇𝐀 𝐃𝐎 𝐋𝐄𝐈𝐓𝐎𝐑
━━━━━━━━━━━ ⚔️ ━━━━━━━━━━━`,

    fichaMembro: `━━━━━━━━━━━ ⚔️ ━━━━━━━━━━━

🗡️ 𝐍𝐨𝐦𝐞: {{nome}}
⚔️ 𝐔𝐬𝐞𝐫: {{user}}

🌙 𝐒𝐞𝐦𝐚𝐧𝐚𝐬: {{semana}}
📅 𝐃𝐢𝐚𝐬: {{dias}}
⭐ 𝐏𝐨𝐧𝐭𝐨𝐬: {{pontos}}
💬 𝐅𝐞𝐞𝐝𝐛𝐚𝐜𝐤: {{feedbacks}}
🌑 𝐋𝐞𝐢𝐭𝐮𝐫𝐚 𝐋𝐮𝐧𝐚𝐫: {{leituraLunar}}

📖 𝐎𝐛𝐫𝐚 𝟎𝟏: {{obra1}}
⚫ 𝐋𝐞𝐢𝐭𝐮𝐫𝐚 𝐄𝐱𝐭𝐫𝐚: {{extras}}`,

    fichaRodape: `━━━━━━━━━━━ ⚔️ ━━━━━━━━━━━

🚨 𝐀𝐓𝐄𝐍𝐂̧𝐀̃𝐎 🚨

𝐏𝐚𝐫𝐚 𝐠𝐚𝐫𝐚𝐧𝐭𝐢𝐫 𝐚 𝐨𝐫𝐠𝐚𝐧𝐢𝐳𝐚𝐜̧𝐚̃𝐨 𝐞 𝐨 𝐛𝐨𝐦 𝐚𝐧𝐝𝐚𝐦𝐞𝐧𝐭𝐨 𝐝𝐚 𝐋𝐚̂𝐦𝐢𝐧𝐚 𝐒𝐨𝐦𝐛𝐫𝐢𝐚, 𝐞́ 𝐢𝐦𝐩𝐨𝐫𝐭𝐚𝐧𝐭𝐞 𝐪𝐮𝐞 𝐭𝐨𝐝𝐨𝐬 𝐞𝐬𝐭𝐞𝐣𝐚𝐦 𝐞𝐦 𝐝𝐢𝐚 𝐜𝐨𝐦 𝐬𝐮𝐚𝐬 𝐥𝐞𝐢𝐭𝐮𝐫𝐚𝐬.

𝐒𝐞 𝐯𝐨𝐜𝐞̂ 𝐟𝐢𝐜𝐨𝐮 𝐝𝐞𝐯𝐞𝐧𝐝𝐨 𝐥𝐞𝐢𝐭𝐮𝐫𝐚, 𝐩𝐨𝐫 𝐟𝐚𝐯𝐨𝐫, 𝐞𝐧𝐯𝐢𝐞 𝐨𝐬 𝐩𝐫𝐢𝐧𝐭𝐬 𝐧𝐨 𝐩𝐫𝐢𝐯𝐚𝐝𝐨 𝐩𝐚𝐫𝐚 𝐪𝐮𝐞 𝐞𝐮 𝐩𝐨𝐬𝐬𝐚 𝐚𝐭𝐮𝐚𝐥𝐢𝐳𝐚𝐫 𝐬𝐞𝐮𝐬 𝐫𝐞𝐠𝐢𝐬𝐭𝐫𝐨𝐬.

𝐈𝐬𝐬𝐨 𝐞𝐯𝐢𝐭𝐚 𝐪𝐮𝐞 𝐞𝐮 𝐩𝐞𝐫𝐜𝐚 𝐭𝐞𝐦𝐩𝐨 𝐜𝐨𝐧𝐟𝐞𝐫𝐢𝐧𝐝𝐨 𝐚 𝐦𝐞𝐬𝐦𝐚 𝐜𝐨𝐢𝐬𝐚 𝐝𝐮𝐚𝐬 𝐯𝐞𝐳𝐞𝐬. 𝐀𝐥𝐞́𝐦 𝐝𝐢𝐬𝐬𝐨, 𝐬𝐞 𝐯𝐨𝐜𝐞̂ 𝐞𝐧𝐜𝐨𝐧𝐭𝐫𝐚𝐫 𝐚𝐥𝐠𝐮𝐦 𝐞𝐫𝐫𝐨 𝐧𝐚𝐬 𝐯𝐞𝐫𝐢𝐟𝐢𝐜𝐚𝐜̧𝐨̃𝐞𝐬, 𝐦𝐞 𝐜𝐡𝐚𝐦𝐞 𝐧𝐨 𝐩𝐫𝐢𝐯𝐚𝐝𝐨 𝐩𝐚𝐫𝐚 𝐪𝐮𝐞 𝐞𝐮 𝐩𝐨𝐬𝐬𝐚 𝐜𝐨𝐫𝐫𝐢𝐠𝐢𝐫.

🖤 𝐕𝐚𝐦𝐨𝐬 𝐦𝐚𝐧𝐭𝐞𝐫 𝐨 𝐠𝐫𝐮𝐩𝐨 𝐨𝐫𝐠𝐚𝐧𝐢𝐳𝐚𝐝𝐨, 𝐚𝐬 𝐥𝐞𝐢𝐭𝐮𝐫𝐚𝐬 𝐞𝐦 𝐝𝐢𝐚 𝐞 𝐚𝐬 𝐡𝐢𝐬𝐭𝐨́𝐫𝐢𝐚𝐬 𝐜𝐨𝐦 𝐨 𝐟𝐢𝐨 𝐚𝐟𝐢𝐚𝐝𝐨 𝐧𝐚 𝐋𝐚̂𝐦𝐢𝐧𝐚 𝐒𝐨𝐦𝐛𝐫𝐢𝐚.`,

    gradeSemanaCabecalho: `⚔️🌑🖤 𝐀-𝟏𝟕 — 𝐋𝐀̂𝐌𝐈𝐍𝐀 𝐒𝐎𝐌𝐁𝐑𝐈𝐀 🖤🌑⚔️
𝐆𝐑𝐀𝐃𝐄 𝐃𝐄 𝐎𝐁𝐑𝐀𝐒 𝐃𝐀 𝐒𝐄𝐌𝐀𝐍𝐀`,

    gradeDiaCabecalho: `⚔️🌑🖤 𝐀-𝟏𝟕 — 𝐋𝐀̂𝐌𝐈𝐍𝐀 𝐒𝐎𝐌𝐁𝐑𝐈𝐀 🖤🌑⚔️
𝐆𝐑𝐀𝐃𝐄 𝐃𝐄 𝐎𝐁𝐑𝐀𝐒 𝐃𝐀 𝐒𝐄𝐌𝐀𝐍𝐀`,

    gradeObra: `━━━━━━━━━━━ 𖤐 ━━━━━━━━━━━
🌑⚔️ {{diaMaiusculo}}
━━━━━━━━━━━ 𖤐 ━━━━━━━━━━━

🗡️ 𝐍𝐎𝐌𝐄: {{autor}}
⚔️ 𝐔𝐒𝐄𝐑: {{user}}
📖 𝐎𝐁𝐑𝐀: {{tituloObra}}
⚫ 𝐋𝐈𝐍𝐊: {{link}}

⚠️ 𝐎𝐁𝐒.: {{regraLeitura}}

{{observacoes}}

Lembrem-se: os comentários devem estar bem distribuídos entre o início, o meio e o fim.

{{alternativa}}`,

    gradeSeparador: ``,

    gradeRodape: `━━━━━━━━━━━ ⚔️ ━━━━━━━━━━━

🖤 𝐐𝐮𝐞 𝐚𝐬 𝐥𝐚̂𝐦𝐢𝐧𝐚𝐬 𝐬𝐞𝐣𝐚𝐦 𝐞𝐫𝐠𝐮𝐢𝐝𝐚𝐬, 𝐪𝐮𝐞 𝐚𝐬 𝐥𝐞𝐢𝐭𝐮𝐫𝐚𝐬 𝐜𝐨𝐫𝐭𝐞𝐦 𝐚 𝐞𝐬𝐜𝐮𝐫𝐢𝐝𝐚̃𝐨,
𝐞 𝐪𝐮𝐞 𝐜𝐚𝐝𝐚 𝐨𝐛𝐫𝐚 𝐞𝐧𝐜𝐨𝐧𝐭𝐫𝐞 𝐬𝐞𝐮 𝐟𝐢𝐨 𝐧𝐚 𝐋𝐚̂𝐦𝐢𝐧𝐚 𝐒𝐨𝐦𝐛𝐫𝐢𝐚.`
  }
};

export const DEFAULT_SUBS = {
  A1: {
    id: "A1",
    nome: "Chama Eterna",
    botao: "🔥 Chama Eterna",
    subtitulo: "Sub Lunar A-1",
    cor: "#f97316",
    modelo: "chama",
    obrasPorDia: 2,
    ativo: true,
    modelos: DEFAULT_MODELOS.chama
  },

  A2: {
    id: "A2",
    nome: "Página Livre",
    botao: "🧚‍♀️ A-2 Página Livre",
    subtitulo: "Sub Lunar A-2",
    cor: "#ec4899",
    modelo: "pagina",
    obrasPorDia: 2,
    ativo: true,
    icone: "🧚‍♀️",
    modelos: DEFAULT_MODELOS.pagina
  },

  A3: {
    id: "A3",
    nome: "Entre Nós",
    botao: "🌈 🤍 A-3 • Entre Nós",
    subtitulo: "Sub Lunar A-3",
    cor: "#ec4899",
    modelo: "entreNos",
    obrasPorDia: 1,
    ativo: true,
    icone: "🌈",
    modelos: DEFAULT_MODELOS.entreNos
  },

  A6: {
    id: "A6",
    nome: "Trono Profano",
    botao: "𖤐 Trono Profano",
    subtitulo: "Sub Lunar A-6",
    cor: "#7f1d1d",
    modelo: "trono",
    obrasPorDia: 2,
    ativo: true,
    modelos: DEFAULT_MODELOS.trono
  },

  A7: {
    id: "A7",
    nome: "Margens de Mundos",
    botao: "✦ 🗺️ 📖 Margens de Mundos",
    subtitulo: "Sub Lunar A-7",
    cor: "#10b981",
    modelo: "margens",
    obrasPorDia: 2,
    ativo: true,
    modelos: DEFAULT_MODELOS.margens
  },

  A10: {
    id: "A10",
    nome: "Quasar",
    botao: "☄️ Quasar",
    subtitulo: "Sub Lunar A-10",
    cor: "#8b5cf6",
    modelo: "quasar",
    obrasPorDia: 1,
    ativo: true,
    icone: "☄️",
    modelos: DEFAULT_MODELOS.quasar
  },

  A17: {
    id: "A17",
    nome: "Lâmina Sombria",
    botao: "🌙 Lâmina Sombria",
    subtitulo: "Sub Lunar A-17",
    cor: "#14b8a6",
    modelo: "lamina",
    obrasPorDia: 1,
    ativo: true,
    icone: "🌙",
    modelos: DEFAULT_MODELOS.lamina
  }
};

export const ROTAS = {
  DASHBOARD: "dashboard",
  MEMBROS: "membros",
  OBRAS: "obras",
  IMPORTAR_FICHA: "importar-ficha",
  GRADE: "grade",
  VERIFICACOES: "verificacoes",
  FICHA: "ficha",
  PONTUACAO: "pontuacao",
  SUBS: "subs"
};
