import { DIAS_SEMANA, SUBS } from "./config.js";

import {
  listarMembros,
  listarVerificacoes,
  limparVerificacoesDaSemana
} from "./data.js";

import {
  abrirModal,
  copiarTexto,
  diasComVerificacao,
  escapeHTML,
  limparUser,
  mostrarToast,
  repetirCheck,
  traduzirEmojisMargens,
  traduzirEmojisTronoProfano,
  ultimoDiaVerificado
} from "./utils.js";

export async function renderFichaPage(context) {
  const { state, setSubtitle, refresh } = context;

  setSubtitle("Ficha acumulada para WhatsApp.");

  const view = document.getElementById("view");

  const [membros, verificacoes] = await Promise.all([
    listarMembros(state.subId),
    listarVerificacoes(state.subId)
  ]);

  const ultimoDia = ultimoDiaVerificado(verificacoes);

  if (!membros.length) {
    view.innerHTML = `
      <section class="card">
        <div class="card-header">
          <div>
            <h3>👁️ Visualizar Ficha</h3>
            <p>Cadastre membros antes de gerar a ficha.</p>
          </div>
        </div>

        <div class="empty-state">
          Nenhum membro cadastrado.
        </div>
      </section>
    `;

    return;
  }

  if (!ultimoDia) {
    view.innerHTML = `
      <section class="card">
        <div class="card-header">
          <div>
            <h3>👁️ Visualizar Ficha</h3>
            <p>A ficha aparece depois que pelo menos uma verificação for salva.</p>
          </div>
        </div>

        <div class="empty-state">
          Ainda não existe nenhuma verificação salva nesta semana.
        </div>
      </section>
    `;

    return;
  }

  const texto = gerarFicha({
    subId: state.subId,
    membros,
    verificacoes
  });

  view.innerHTML = `
    <section class="card">
      <div class="card-header">
        <div>
          <h3>👁️ Visualizar Ficha</h3>
          <p>Dias acumulados: ${diasComVerificacao(verificacoes)}</p>
        </div>

        <button class="btn danger" id="limparFichaButton">🧹 Limpar semana</button>
      </div>

      <textarea id="fichaTexto" readonly>${escapeHTML(texto)}</textarea>

      <div class="form-actions">
        <button class="btn" id="copiarFichaButton">Copiar ficha</button>
      </div>
    </section>
  `;

  document.getElementById("copiarFichaButton").addEventListener("click", async () => {
    await copiarTexto(document.getElementById("fichaTexto").value);
    mostrarToast("Ficha copiada.");
  });

  document.getElementById("limparFichaButton").addEventListener("click", () => {
    abrirModal("Limpar ficha da semana", `
      <p class="muted">
        Isso vai apagar apenas as verificações salvas de segunda a sexta.
        Membros, obras e grade semanal continuarão cadastrados.
      </p>

      <div class="form-actions">
        <button class="btn danger" id="confirmarLimparFicha">Sim, limpar semana</button>
      </div>
    `);

    document.getElementById("confirmarLimparFicha").addEventListener("click", async () => {
      await limparVerificacoesDaSemana(state.subId, DIAS_SEMANA);
      mostrarToast("Ficha da semana limpa.");
      document.getElementById("modalRoot")?.remove();
      await refresh();
    });
  });
}

function gerarFicha({ subId, membros, verificacoes }) {
  const sub = SUBS[subId];

  if (sub.modelo === "chama") return gerarFichaChama(membros, verificacoes);
  if (sub.modelo === "pagina") return gerarFichaPagina(membros, verificacoes);
  if (sub.modelo === "margens") return gerarFichaMargens(membros, verificacoes);

  return gerarFichaTrono(membros, verificacoes);
}

function pontosAcumulados(membroId, verificacoes) {
  let total = 0;

  DIAS_SEMANA.forEach(dia => {
    total += Number(verificacoes[dia]?.membros?.[membroId]?.pontos || 0);
  });

  return total;
}

function emojisAcumulados(membroId, verificacoes, campo) {
  let texto = "";

  DIAS_SEMANA.forEach(dia => {
    texto += verificacoes[dia]?.membros?.[membroId]?.[campo] || "";
  });

  return texto;
}

function feedbacksAcumulados(membroId, verificacoes) {
  let total = 0;

  DIAS_SEMANA.forEach(dia => {
    const dados = verificacoes[dia]?.membros?.[membroId];

    if (!dados) return;

    if (dados.obra1Feedback) total++;
    if (dados.obra2Feedback) total++;
  });

  return total;
}

function extrasAcumulados(membroId, verificacoes) {
  let total = 0;

  DIAS_SEMANA.forEach(dia => {
    const dados = verificacoes[dia]?.membros?.[membroId];

    if (!dados) return;

    if (dados.obra1Extra) total += Math.max(1, Number(dados.obra1ExtraQtd || 1));
    if (dados.obra2Extra) total += Math.max(1, Number(dados.obra2ExtraQtd || 1));
  });

  return total;
}

function gerarLegendaTrono() {
  return `🌙 𝐋𝐞𝐮
☠️ 𝐍𝐚̃𝐨 𝐥𝐞𝐮
💅 𝐉𝐮𝐬𝐭𝐢𝐟𝐢𝐜𝐚𝐝𝐨
📜 𝐉𝐚́ 𝐡𝐚𝐯𝐢𝐚 𝐥𝐢𝐝𝐨 𝐚𝐧𝐭𝐞𝐬
🙍 𝐅𝐚𝐥𝐭𝐚 𝐚𝐥𝐠𝐨 (𝐜𝐨𝐦𝐞𝐧𝐭𝐚́𝐫𝐢𝐨 𝐨𝐮 𝐯𝐨𝐭𝐨)
✨ 𝐎𝐛𝐫𝐚 𝐝𝐨 𝐝𝐢𝐚
⏳ 𝐒𝐞𝐦 𝐨𝐛𝐫𝐚
⚰️ 𝐒𝐚𝐢𝐮 𝐝𝐨 𝐠𝐫𝐮𝐩𝐨
🕯️ 𝐋𝐞𝐢𝐭𝐮𝐫𝐚 𝐞𝐦 𝐚𝐧𝐝𝐚𝐦𝐞𝐧𝐭𝐨 𝐧𝐨 𝐦𝐨𝐦𝐞𝐧𝐭𝐨 𝐝𝐚 𝐯𝐞𝐫𝐢𝐟𝐢𝐜𝐚𝐜̧𝐚̃𝐨
⚠️ 𝐈𝐧𝐟𝐫𝐚𝐜̧𝐚̃𝐨 𝐝𝐚𝐬 𝐫𝐞𝐠𝐫𝐚𝐬
🚫 𝐈𝐧𝐟𝐫𝐚𝐜̧𝐚̃𝐨 𝐧𝐨 𝐭𝐞𝐦𝐩𝐨 𝐝𝐞 𝐥𝐞𝐢𝐭𝐮𝐫𝐚
📲 𝐏𝐫𝐢𝐧𝐭𝐬 𝐧𝐨 𝐩𝐯
⛔ 𝐑𝐞𝐦𝐨𝐯𝐢𝐝𝐨 𝐩𝐨𝐫 𝐢𝐧𝐟𝐫𝐚𝐜̧𝐚̃𝐨 𝐝𝐚𝐬 𝐫𝐞𝐠𝐫𝐚𝐬
⏰ 𝐋𝐞𝐢𝐭𝐮𝐫𝐚 𝐟𝐞𝐢𝐭𝐚 𝐞𝐦 𝐭𝐞𝐦𝐩𝐨 𝐞𝐬𝐭𝐢𝐦𝐚𝐝𝐨

`;
}

function gerarFichaTrono(membros, verificacoes) {
  const dias = diasComVerificacao(verificacoes);

  let texto = "";

  texto += `𖤐⛓️🔥 𝐀-𝟔 — 𝐓𝐑𝐎𝐍𝐎 𝐏𝐑𝐎𝐅𝐀𝐍𝐎 🔥⛓️𖤐
━━━━━━━━━━━ 𖤐 ━━━━━━━━━━━
📜 𝐕𝐄𝐑𝐈𝐅𝐈𝐂𝐀𝐂̧𝐀̃𝐎
━━━━━━━━━━━ 𖤐 ━━━━━━━━━━━

`;

  texto += gerarLegendaTrono();

  texto += `━━━━━━━━━━━ 𖤐 ━━━━━━━━━━━
📖 𝐅𝐈𝐂𝐇𝐀 𝐃𝐎 𝐋𝐄𝐈𝐓𝐎𝐑
━━━━━━━━━━━ 𖤐 ━━━━━━━━━━━

`;

  membros.forEach(membro => {
    const obra1 = traduzirEmojisTronoProfano(emojisAcumulados(membro.id, verificacoes, "obra1Status"));
    const obra2 = traduzirEmojisTronoProfano(emojisAcumulados(membro.id, verificacoes, "obra2Status"));

    texto += `━━━━━━━━━━━ 𖤐 ━━━━━━━━━━━

♛ 𝐍𝐨𝐦𝐞: ${membro.nome}
♜ 𝐔𝐬𝐞𝐫: ${limparUser(membro.user)}

🌙 𝐒𝐞𝐦𝐚𝐧𝐚𝐬: ${membro.semana ?? 0}
📅 𝐃𝐢𝐚𝐬: ${dias}
⭐ 𝐏𝐨𝐧𝐭𝐨𝐬: ${pontosAcumulados(membro.id, verificacoes)}
💬 𝐅𝐞𝐞𝐝𝐛𝐚𝐜𝐤: ${repetirCheck(feedbacksAcumulados(membro.id, verificacoes))}
🔮 𝐋𝐞𝐢𝐭𝐮𝐫𝐚 𝐋𝐮𝐧𝐚𝐫:

📕 𝐆𝐫𝐢𝐦𝐨́𝐫𝐢𝐨 𝟎𝟏: ${obra1}
📕 𝐆𝐫𝐢𝐦𝐨́𝐫𝐢𝐨 𝟎𝟐: ${obra2}

🔮 𝐋𝐞𝐢𝐭𝐮𝐫𝐚 𝐄𝐱𝐭𝐫𝐚: ${repetirCheck(extrasAcumulados(membro.id, verificacoes))}

`;
  });

  texto += `━━━━━━━━━━━ 𖤐 ━━━━━━━━━━━

🚨 𝐀𝐓𝐄𝐍𝐂̧𝐀̃𝐎 🚨

𝐏𝐚𝐫𝐚 𝐠𝐚𝐫𝐚𝐧𝐭𝐢𝐫 𝐚 𝐨 𝐛𝐨𝐦 𝐚𝐧𝐝𝐚𝐦𝐞𝐧𝐭𝐨 𝐝𝐨 𝐓𝐫𝐨𝐧𝐨 𝐏𝐫𝐨𝐟𝐚𝐧𝐨, 𝐞́ 𝐢𝐦𝐩𝐨𝐫𝐭𝐚𝐧𝐭𝐞 𝐪𝐮𝐞 𝐭𝐨𝐝𝐨𝐬 𝐞𝐬𝐭𝐞𝐣𝐚𝐦 𝐞𝐦 𝐝𝐢𝐚 𝐜𝐨𝐦 𝐬𝐮𝐚𝐬 𝐥𝐞𝐢𝐭𝐮𝐫𝐚𝐬.

𝐒𝐞 𝐯𝐨𝐜𝐞̂ 𝐟𝐢𝐜𝐨𝐮 𝐝𝐞𝐯𝐞𝐧𝐝𝐨 𝐥𝐞𝐢𝐭𝐮𝐫𝐚, 𝐩𝐨𝐫 𝐟𝐚𝐯𝐨𝐫, 𝐞𝐧𝐯𝐢𝐞 𝐨𝐬 𝐩𝐫𝐢𝐧𝐭𝐬 𝐧𝐨 𝐩𝐫𝐢𝐯𝐚𝐝𝐨.

🔥 𝐕𝐚𝐦𝐨𝐬 𝐦𝐚𝐧𝐭𝐞𝐫 𝐨 𝐠𝐫𝐮𝐩𝐨 𝐨𝐫𝐠𝐚𝐧𝐢𝐳𝐚𝐝𝐨.`;

  return texto.trim();
}

function gerarFichaMargens(membros, verificacoes) {
  const dias = diasComVerificacao(verificacoes);

  let texto = "";

  texto += `✦🗺️📖 𝐀-𝟕 — 𝐌𝐀𝐑𝐆𝐄𝐍𝐒 𝐃𝐄 𝐌𝐔𝐍𝐃𝐎𝐒 📖🗺️✦
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
🚪 𝐒𝐚𝐢𝐮 𝐝𝐨 𝐠𝐫𝐮𝐩𝐨
🧭 𝐋𝐞𝐢𝐭𝐮𝐫𝐚 𝐞𝐦 𝐚𝐧𝐝𝐚𝐦𝐞𝐧𝐭𝐨
⚠️ 𝐈𝐧𝐟𝐫𝐚𝐜̧𝐚̃𝐨
🚫 𝐈𝐧𝐟𝐫𝐚𝐜̧𝐚̃𝐨 𝐧𝐨 𝐭𝐞𝐦𝐩𝐨
📲 𝐏𝐫𝐢𝐧𝐭𝐬 𝐧𝐨 𝐩𝐯
⛔ 𝐑𝐞𝐦𝐨𝐯𝐢𝐝𝐨
⏰ 𝐋𝐞𝐢𝐭𝐮𝐫𝐚 𝐟𝐞𝐢𝐭𝐚 𝐞𝐦 𝐭𝐞𝐦𝐩𝐨

━━━━━━━━━━━ ✦ ━━━━━━━━━━━
📖 𝐅𝐈𝐂𝐇𝐀 𝐃𝐎 𝐋𝐄𝐈𝐓𝐎𝐑
━━━━━━━━━━━ ✦ ━━━━━━━━━━━

`;

  membros.forEach(membro => {
    const obra1 = traduzirEmojisMargens(emojisAcumulados(membro.id, verificacoes, "obra1Status"));
    const obra2 = traduzirEmojisMargens(emojisAcumulados(membro.id, verificacoes, "obra2Status"));

    texto += `━━━━━━━━━━━ ✦ ━━━━━━━━━━━

🗝️ 𝐍𝐨𝐦𝐞: ${membro.nome}
🧭 𝐔𝐬𝐞𝐫: ${limparUser(membro.user)}

🌙 𝐒𝐞𝐦𝐚𝐧𝐚𝐬: ${membro.semana ?? 0}
📅 𝐃𝐢𝐚𝐬: ${dias}
⭐ 𝐏𝐨𝐧𝐭𝐨𝐬: ${pontosAcumulados(membro.id, verificacoes)}
💬 𝐅𝐞𝐞𝐝𝐛𝐚𝐜𝐤: ${repetirCheck(feedbacksAcumulados(membro.id, verificacoes))}
🌌 𝐋𝐞𝐢𝐭𝐮𝐫𝐚 𝐋𝐮𝐧𝐚𝐫:

📖 𝐌𝐮𝐧𝐝𝐨 𝟎𝟏: ${obra1}
📖 𝐌𝐮𝐧𝐝𝐨 𝟎𝟐: ${obra2}

🗺️ 𝐋𝐞𝐢𝐭𝐮𝐫𝐚 𝐄𝐱𝐭𝐫𝐚: ${repetirCheck(extrasAcumulados(membro.id, verificacoes))}

`;
  });

  texto += `━━━━━━━━━━━ ✦ ━━━━━━━━━━━

🚨 𝐀𝐓𝐄𝐍𝐂̧𝐀̃𝐎 🚨

𝐏𝐚𝐫𝐚 𝐠𝐚𝐫𝐚𝐧𝐭𝐢𝐫 𝐚 𝐨 𝐛𝐨𝐦 𝐚𝐧𝐝𝐚𝐦𝐞𝐧𝐭𝐨 𝐝𝐨 𝐌𝐚𝐫𝐠𝐞𝐧𝐬 𝐝𝐞 𝐌𝐮𝐧𝐝𝐨𝐬, 𝐭𝐨𝐝𝐨𝐬 𝐝𝐞𝐯𝐞𝐦 𝐞𝐬𝐭𝐚𝐫 𝐞𝐦 𝐝𝐢𝐚.

🌌 𝐕𝐚𝐦𝐨𝐬 𝐦𝐚𝐧𝐭𝐞𝐫 𝐨 𝐠𝐫𝐮𝐩𝐨 𝐨𝐫𝐠𝐚𝐧𝐢𝐳𝐚𝐝𝐨.`;

  return texto.trim();
}

function gerarFichaChama(membros, verificacoes) {
  const dias = diasComVerificacao(verificacoes);

  let texto = "";

  texto += `🌑👑 𝐕𝐄𝐑𝐈𝐅𝐈𝐂𝐀𝐂̧𝐎̃𝐄𝐒 👑🌑

🌜 𝐎𝐧𝐝𝐞 𝐚 𝐋𝐮𝐚 𝐢𝐥𝐮𝐦𝐢𝐧𝐚 𝐨𝐬 𝐥𝐢𝐯𝐫𝐨𝐬: 𝐋𝐮𝐧𝐚 𝐀-𝟏 🌛

🌙𝐋𝐞𝐮
☠𝐍𝐚̃𝐨 𝐥𝐞𝐮
💅 𝐉𝐮𝐬𝐭𝐢𝐟𝐢𝐜𝐚𝐝𝐨
🌼 𝐉𝐚́ 𝐡𝐚𝐯𝐢𝐚 𝐥𝐢𝐝𝐨 𝐚𝐧𝐭𝐞𝐬
🙍 𝐅𝐚𝐥𝐭𝐚 𝐚𝐥𝐠𝐨
✨𝐎𝐛𝐫𝐚 𝐝𝐨 𝐝𝐢𝐚
⏳ 𝐒𝐞𝐦 𝐨𝐛𝐫𝐚

`;

  membros.forEach(membro => {
    texto += `_____________

📙𝐍𝐨𝐦𝐞: ${membro.nome}
🦐𝐔𝐬𝐞𝐫: ${membro.user}

🏆  semanas: ${membro.semana ?? 0}
💌  Dias: ${dias}
👑 Pontos: ${pontosAcumulados(membro.id, verificacoes)}
📈 Feedback: ${repetirCheck(feedbacksAcumulados(membro.id, verificacoes))}
📚 Capítulos Extras: ${repetirCheck(extrasAcumulados(membro.id, verificacoes))}
LEITURA LUNAR:

Obra 01.: ${emojisAcumulados(membro.id, verificacoes, "obra1Status")}
Obra 02.: ${emojisAcumulados(membro.id, verificacoes, "obra2Status")}

`;
  });

  texto += `—————————

🚨𝐀𝐓𝐄𝐍𝐂̧𝐀̃𝐎🚨

𝐏𝐚𝐫𝐚 𝐠𝐚𝐫𝐚𝐧𝐭𝐢𝐫 𝐚 𝐨𝐫𝐠𝐚𝐧𝐢𝐳𝐚𝐜̧𝐚̃𝐨, 𝐞́ 𝐢𝐦𝐩𝐨𝐫𝐭𝐚𝐧𝐭𝐞 𝐪𝐮𝐞 𝐭𝐨𝐝𝐨𝐬 𝐞𝐬𝐭𝐞𝐣𝐚𝐦 𝐞𝐦 𝐝𝐢𝐚.`;

  return texto.trim();
}

function gerarFichaPagina(membros, verificacoes) {
  const dias = diasComVerificacao(verificacoes);

  let texto = "";

  texto += `🧚‍♂PAGINA LIVRE 𝑨-𝟐 🧝‍♀🧌🦹‍♂🧞‍♂ VERIFICAÇÕES 🧛‍♂🧜‍♂

🌙 𝐋𝐞𝐮
☠ 𝐍𝐚̃𝐨 𝐥𝐞𝐮
💅 𝐉𝐮𝐬𝐭𝐢𝐟𝐢𝐜𝐚𝐝𝐨
🌼 𝐉𝐚́ 𝐡𝐚𝐯𝐢𝐚 𝐥𝐢𝐝𝐨 𝐚𝐧𝐭𝐞𝐬
🙍 𝐅𝐚𝐥𝐭𝐚 𝐚𝐥𝐠𝐨
✨𝐎𝐛𝐫𝐚 𝐝𝐨 𝐝𝐢𝐚
⏳ 𝐒𝐞𝐦 𝐨𝐛𝐫𝐚

`;

  membros.forEach(membro => {
    texto += `_______________

🧙‍♂🧚‍♂ PAGINA LIVRE 𝑨-𝟐 🧛‍♂🧜‍♂

🧝‍♀ Nome: ${membro.nome}
🦇 User: ${membro.user}

🌎 Semanas: ${membro.semana ?? 0}
🗺 Dias: ${dias}
🧭 Pontos: ${pontosAcumulados(membro.id, verificacoes)}
🏗 Feedback: ${repetirCheck(feedbacksAcumulados(membro.id, verificacoes))}
📚 Capítulos Extras: ${repetirCheck(extrasAcumulados(membro.id, verificacoes))}
🌌 Leitura Lunar:

🏘 Obra 01: ${emojisAcumulados(membro.id, verificacoes, "obra1Status")}
🏘 Obra 02: ${emojisAcumulados(membro.id, verificacoes, "obra2Status")}

`;
  });

  texto += `________________________

🚨𝐀𝐓𝐄𝐍𝐂̧𝐀̃𝐎🚨

𝐏𝐚𝐫𝐚 𝐠𝐚𝐫𝐚𝐧𝐭𝐢𝐫 𝐚 𝐨𝐫𝐠𝐚𝐧𝐢𝐳𝐚𝐜̧𝐚̃𝐨, 𝐞́ 𝐢𝐦𝐩𝐨𝐫𝐭𝐚𝐧𝐭𝐞 𝐪𝐮𝐞 𝐭𝐨𝐝𝐨𝐬 𝐞𝐬𝐭𝐞𝐣𝐚𝐦 𝐞𝐦 𝐝𝐢𝐚.`;

  return texto.trim();
}