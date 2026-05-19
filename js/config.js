export const APP_VERSION = "2.2.0";

export const COLLECTION_ROOT = "v2_subs";

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

export const STATUS_QUE_CONTAM_LEITURA = ["🌙", "✨"];

export const MODELOS_SUB = {
  chama: "Chama Eterna",
  pagina: "Página Livre",
  trono: "Trono Profano",
  margens: "Margens de Mundos",
  cicatrizes: "Cicatrizes Literárias"
};

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
    fichaCabecalho: `🧚‍♂PAGINA LIVRE 𝑨-𝟐 🧝‍♀🧌🦹‍♂🧞‍♂ VERIFICAÇÕES 🧛‍♂🧜‍♂

🌙 𝐋𝐞𝐮
☠ 𝐍𝐚̃𝐨 𝐥𝐞𝐮
💅 𝐉𝐮𝐬𝐭𝐢𝐟𝐢𝐜𝐚𝐝𝐨
🌼 𝐉𝐚́ 𝐡𝐚𝐯𝐢𝐚 𝐥𝐢𝐝𝐨 𝐚𝐧𝐭𝐞𝐬
🙍 𝐅𝐚𝐥𝐭𝐚 𝐚𝐥𝐠𝐨
✨𝐎𝐛𝐫𝐚 𝐝𝐨 𝐝𝐢𝐚
⏳ 𝐒𝐞𝐦 𝐨𝐛𝐫𝐚`,

    fichaMembro: `_______________

🧙‍♂🧚‍♂ PAGINA LIVRE 𝑨-𝟐 🧛‍♂🧜‍♂

🧝‍♀ Nome: {{nome}}
🦇 User: {{user}}

🌎 Semanas: {{semana}}
🗺 Dias: {{dias}}
🧭 Pontos: {{pontos}}
🏗 Feedback: {{feedbacks}}
📚 Capítulos Extras: {{extras}}
🌌 Leitura Lunar:

🏘 Obra 01: {{obra1}}
🏘 Obra 02: {{obra2}}`,

    fichaRodape: `________________________

🚨𝐀𝐓𝐄𝐍𝐂̧𝐀̃𝐎🚨

𝐏𝐚𝐫𝐚 𝐠𝐚𝐫𝐚𝐧𝐭𝐢𝐫 𝐚 𝐨𝐫𝐠𝐚𝐧𝐢𝐳𝐚𝐜̧𝐚̃𝐨, 𝐞́ 𝐢𝐦𝐩𝐨𝐫𝐭𝐚𝐧𝐭𝐞 𝐪𝐮𝐞 𝐭𝐨𝐝𝐨𝐬 𝐞𝐬𝐭𝐞𝐣𝐚𝐦 𝐞𝐦 𝐝𝐢𝐚.`,

    gradeSemanaCabecalho: `🧙‍♂️🧚‍♂️ PAGINA LIVRE 𝑨-𝟐 🧌🧝‍♀️ GRADE DE OBRAS 🧛‍♂️🧜‍♂️`,

    gradeDiaCabecalho: `🧙‍♂️🧚‍♂️ PAGINA LIVRE 𝑨-𝟐 🧌🧝‍♀️ GRADE DE OBRAS 🧛‍♂️🧜‍♂️`,

    gradeObra: `🧚‍♂️ {{diaMaiusculo}} {{numeroObra}} 🧜‍♂️

🧝‍♀️ Autor: {{autor}}
🦇 User: {{user}}
🛕 Nome da Obra: {{tituloObra}}
🛸 Link: {{link}}

🛎️Obs.: {{regraLeitura}}
{{observacoes}}
{{alternativa}}`,

    gradeSeparador: `---------■`,

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

𝐏𝐚𝐫𝐚 𝐠𝐚𝐫𝐚𝐧𝐭𝐢𝐫 𝐚 𝐨 𝐛𝐨𝐦 𝐚𝐧𝐝𝐚𝐦𝐞𝐧𝐭𝐨 𝐝𝐨 𝐓𝐫𝐨𝐧𝐨 𝐏𝐫𝐨𝐟𝐚𝐧𝐨, 𝐞́ 𝐢𝐦𝐩𝐨𝐫𝐭𝐚𝐧𝐭𝐞 𝐪𝐮𝐞 𝐭𝐨𝐝𝐨𝐬 𝐞𝐬𝐭𝐞𝐣𝐚𝐦 𝐞𝐦 𝐝𝐢𝐚.`,

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
    botao: "📖 Página Livre",
    subtitulo: "Sub Lunar A-2",
    cor: "#0ea5e9",
    modelo: "pagina",
    obrasPorDia: 2,
    ativo: true,
    modelos: DEFAULT_MODELOS.pagina
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

  A9: {
    id: "A9",
    nome: "Cicatrizes Literárias",
    botao: "🫀 Cicatrizes Literárias",
    subtitulo: "Sub Lunar A-9",
    cor: "#d4af37",
    modelo: "cicatrizes",
    obrasPorDia: 2,
    ativo: true,
    modelos: DEFAULT_MODELOS.cicatrizes
  }
};

export const ROTAS = {
  DASHBOARD: "dashboard",
  MEMBROS: "membros",
  OBRAS: "obras",
  GRADE: "grade",
  VERIFICACOES: "verificacoes",
  FICHA: "ficha",
  PONTUACAO: "pontuacao",
  SUBS: "subs"
};