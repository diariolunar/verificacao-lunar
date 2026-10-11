import {
  abrirModal,
  copiarTexto,
  escapeHTML,
  mostrarToast
} from "./utils.js";

import {
  buscarPreparacaoAtividade,
  salvarPreparacaoAtividade
} from "./data.js";

const SUBS_SUPORTADOS = new Set(["A1", "A6", "A7", "A17"]);

function campoTexto(id, label, tipo = "text", atributos = "") {
  return `
    <div class="form-row">
      <label for="${id}">${label}</label>
      <input id="${id}" name="${id}" type="${tipo}" ${atributos} required />
    </div>
  `;
}

function obterDadosComuns(form) {
  const dados = new FormData(form);

  return {
    obra: String(dados.get("nomeObra") || "").trim(),
    autor: String(dados.get("autor") || "").trim(),
    user: String(dados.get("user") || "").trim(),
    link: String(dados.get("link") || "").trim()
  };
}

function preencherDadosComuns(form, dados = {}) {
  const valores = dados || {};

  form.elements.nomeObra.value = valores.obra || "";
  form.elements.autor.value = valores.autor || "";
  form.elements.user.value = valores.user || "";
  form.elements.link.value = valores.link || "";
}

function abrirExportacao(titulo, texto) {
  abrirModal(titulo, `
    <div class="grid">
      <textarea id="textoAtividadeExportada" readonly>${escapeHTML(texto)}</textarea>

      <div class="form-actions">
        <button class="btn" type="button" id="copiarAtividadeButton">Copiar texto</button>
      </div>
    </div>
  `);

  document.getElementById("copiarAtividadeButton")?.addEventListener("click", async () => {
    try {
      await copiarTexto(document.getElementById("textoAtividadeExportada")?.value || "");
      mostrarToast("Texto copiado.");
    } catch (error) {
      console.error(error);
      mostrarToast("Não foi possível copiar o texto.");
    }
  });
}

export function gerarLeituraLunar(subId, dados) {
  const prologo = dados.prologoMaisDeMil === "sim" ? "Sim" : "Não";
  const capitulos = dados.temCapitulosLongos ? dados.capitulosLongos : "Não";

  const modelos = {
    A1: `🏮🔥 Cʜᴀᴍᴀ ᴇᴛᴇʀɴᴀ 🅐 ❶ 🐦‍🔥🍁
               🌙 Leitura Lunar

🔶🔶🔶🔶🔶🔶🔶🔶🔶🔶🔶🔶🔶🔶🔶

🔥 Nome da Obra: ${dados.obra}
🐦‍🔥 Autor(a): ${dados.autor}
🍁 User: ${dados.user}
🔗 Link: ${dados.link}

🔶 Prólogo com mais de 1.000 palavras? ${prologo}

🏮 Capítulos com mais de 4.100 palavras? ${capitulos}

🔶🔶🔶🔶🔶🔶🔶🔶🔶🔶🔶🔶🔶🔶🔶`,
    A6: `𖤐𖤐𖤐𖤐𖤐𖤐𖤐𖤐𖤐𖤐𖤐𖤐𖤐𖤐𖤐𖤐

🔥 LEITURA LUNAR 🔥

𖤐𖤐𖤐𖤐𖤐𖤐𖤐𖤐𖤐𖤐𖤐𖤐𖤐𖤐𖤐𖤐

🩸 Nome da Obra: ${dados.obra}
⛓️ Autor(a): ${dados.autor}
🕯️ User: ${dados.user}
🔗 Link: ${dados.link}

👁️ O prólogo contém mais de mil palavras? Se sim, quantas? ${prologo}

📖 A obra ultrapassa 4.1k palavras? Se sim, quais capítulos? Apenas números: ${capitulos}

𖤐𖤐𖤐𖤐𖤐𖤐𖤐𖤐𖤐𖤐𖤐𖤐𖤐𖤐𖤐𖤐`,
    A7: `🗺️✦━━━━━━━━━━━━━━━━━━━━━━━━━━━━━✦🗺️
                🌙 LEITURA LUNAR ✨
             A-7 MARGENS DE MUNDOS
🗺️✦━━━━━━━━━━━━━━━━━━━━━━━━━━━━━✦🗺️

📖 Nome da Obra: ${dados.obra}
✒️ Autor(a): ${dados.autor}
🌿 User: ${dados.user}
🔗 Link: ${dados.link}

🧭  O prólogo contém mais de mil palavras? ${prologo}

🌍 A obra tem capítulos que ultrapassa 4.1k palavras? Quais? ${capitulos}

━━━━━━━━━━━ ✦ ━━━━━━━━━━━

🌌 Que os mundos sejam abertos, que as leituras atravessem fronteiras,
e que cada obra encontre seu caminho nas 𝐌𝐚𝐫𝐠𝐞𝐧𝐬 𝐝𝐞 𝐌𝐮𝐧𝐝𝐨𝐬.`,
    A17: `⚔️✦━━━━━━━━━━━━━━━━━━━━━━━━━━━━━✦⚔️
            🌑 𝐋𝐄𝐈𝐓𝐔𝐑𝐀 𝐋𝐔𝐍𝐀𝐑 🖤
          𝐀-𝟏𝟕 • 𝐋𝐀̂𝐌𝐈𝐍𝐀 𝐒𝐎𝐌𝐁𝐑𝐈𝐀
⚔️✦━━━━━━━━━━━━━━━━━━━━━━━━━━━━━✦⚔️

📖 𝐎𝐛𝐫𝐚: ${dados.obra}
🗡️ 𝐀𝐮𝐭𝐨𝐫(𝐚): ${dados.autor}
⚔️ 𝐔𝐬𝐞𝐫: ${dados.user}
⚫ 𝐋𝐢𝐧𝐤: ${dados.link}

🌒 𝐎 𝐩𝐫𝐨́𝐥𝐨𝐠𝐨 𝐜𝐨𝐧𝐭𝐞́𝐦 𝐦𝐚𝐢𝐬 𝐝𝐞 𝟏𝐊 𝐝𝐞 𝐩𝐚𝐥𝐚𝐯𝐫𝐚𝐬? ${prologo}

⚔️ 𝐀𝐥𝐠𝐮𝐦 𝐜𝐚𝐩𝐢́𝐭𝐮𝐥𝐨 𝐮𝐥𝐭𝐫𝐚𝐩𝐚𝐬𝐬𝐚 𝟒.𝟏𝐊 𝐩𝐚𝐥𝐚𝐯𝐫𝐚𝐬? ${capitulos}

⚔️✦━━━━━━━━━━━━━━━━━━━━━━━━━━━━━✦⚔️
🖤 𝐌𝐚𝐢𝐬 𝐮𝐦𝐚 𝐥𝐚̂𝐦𝐢𝐧𝐚 𝐟𝐨𝐢 𝐬𝐚𝐜𝐚𝐝𝐚, 𝐦𝐚𝐢𝐬 𝐮𝐦𝐚
𝐡𝐢𝐬𝐭𝐨́𝐫𝐢𝐚 𝐟𝐨𝐢 𝐚𝐟𝐢𝐚𝐝𝐚 𝐧𝐚 𝐋𝐚̂𝐦𝐢𝐧𝐚 𝐒𝐨𝐦𝐛𝐫𝐢𝐚.
⚔️✦━━━━━━━━━━━━━━━━━━━━━━━━━━━━━✦⚔️`
  };

  return modelos[subId];
}

export function formatarDataCurta(dataISO) {
  const [ano, mes, dia] = String(dataISO || "").split("-");
  return ano && mes && dia ? `${dia}/${mes}` : "";
}

export function gerarChuvaEstrelas(subId, dados) {
  const prazo = formatarDataCurta(dados.prazo);
  const modelos = {
    A1: `🏮🔥 Cʜᴀᴍᴀ ᴇᴛᴇʀɴᴀ 🅐 ❶ 🐦‍🔥🍁
     ✨ CHUVA DE ESTRELAS✨

🔶🔶🔶🔶🔶🔶🔶🔶🔶🔶🔶🔶🔶🔶🔶

🔥 Nome da Obra: ${dados.obra}
🐦‍🔥 Autor(a): ${dados.autor}
🍁 User: ${dados.user}
🔗 Link: ${dados.link}
🏮 Número de Capítulos: ${dados.numeroCapitulos}

🍂 PRAZO: Sábado - Dia ${prazo} às 12h
♦️ Enviar o vídeo ou os prints para a ADM Duda: +55 35 9868-4945

🔶🔶🔶🔶🔶🔶🔶🔶🔶🔶🔶🔶🔶🔶🔶`,
    A6: `𖤐𖤐𖤐𖤐𖤐𖤐𖤐𖤐𖤐𖤐𖤐𖤐𖤐𖤐𖤐𖤐

🔥CHUVA DE ESTRELAS🔥

𖤐𖤐𖤐𖤐𖤐𖤐𖤐𖤐𖤐𖤐𖤐𖤐𖤐𖤐𖤐𖤐

🩸 Nome da Obra: ${dados.obra}
⛓️ Autora: ${dados.autor}
🕯️ User: ${dados.user}
🔗 Link ${dados.link}
♦️ Número de Capítulos: ${dados.numeroCapitulos}

👁️  PRAZO: Sábado - Dia ${prazo} às 12h
📖 Enviar o vídeo ou os prints para a ADM Duda: +55 35 9868-4945

𖤐𖤐𖤐𖤐𖤐𖤐𖤐𖤐𖤐𖤐𖤐𖤐𖤐𖤐𖤐𖤐`,
    A7: `🗺️✦━━━━━━━━━━━━━━━━━━━━━━━━━━━━━✦🗺️
          🌙 CHUVA DE ESTRELAS ✨
             A-7 MARGENS DE MUNDOS
🗺️✦━━━━━━━━━━━━━━━━━━━━━━━━━━━━━✦🗺️

📖 Nome da Obra: ${dados.obra}
✒️ Autora: ${dados.autor}
🌿 User: ${dados.user}
🔗 Link: ${dados.link}
🛣️  Número de Capítulos: ${dados.numeroCapitulos}

🧭  PRAZO: Sábado - Dia ${prazo} às 12h
🌍  Enviar o vídeo ou os prints para a ADM Duda: +55 35 9868-4945

━━━━━━━━━━━ ✦ ━━━━━━━━━━━

🌌 Que os mundos sejam abertos, que as leituras atravessem fronteiras,
e que cada obra encontre seu caminho nas 𝐌𝐚𝐫𝐠𝐞𝐧𝐬 𝐝𝐞 𝐌𝐮𝐧𝐝𝐨𝐬.`,
    A17: `⚔️✦━━━━━━━━━━━━━━━━━━━━━━━━━━━━━✦⚔️
      🌑 CHUVA DE ESTRELAS 🖤
          𝐀-𝟏𝟕 • 𝐋𝐀̂𝐌𝐈𝐍𝐀 𝐒𝐎𝐌𝐁𝐑𝐈𝐀
⚔️✦━━━━━━━━━━━━━━━━━━━━━━━━━━━━━✦⚔️

📖 𝐎𝐛𝐫𝐚: ${dados.obra}
🗡️ 𝐀𝐮𝐭𝐨𝐫(𝐚): ${dados.autor}
⚔️ 𝐔𝐬𝐞𝐫: ${dados.user}
⚫ 𝐋𝐢𝐧𝐤: ${dados.link}
♠️ Número de Capítulos: ${dados.numeroCapitulos}

🌒 PRAZO: Sábado - Dia ${prazo} às 12h
⚔️ Enviar o vídeo ou os prints para a ADM Duda: +55 35 9868-4945

⚔️✦━━━━━━━━━━━━━━━━━━━━━━━━━━━━━✦⚔️
🖤 𝐌𝐚𝐢𝐬 𝐮𝐦𝐚 𝐥𝐚̂𝐦𝐢𝐧𝐚 𝐟𝐨𝐢 𝐬𝐚𝐜𝐚𝐝𝐚,
𝐦𝐚𝐢𝐬 𝐮𝐦𝐚 𝐡𝐢𝐬𝐭𝐨́𝐫𝐢𝐚 𝐟𝐨𝐢 𝐚𝐟𝐢𝐚𝐝𝐚
𝐧𝐚 𝐋𝐚̂𝐦𝐢𝐧𝐚 𝐒𝐨𝐦𝐛𝐫𝐢𝐚.
⚔️✦━━━━━━━━━━━━━━━━━━━━━━━━━━━━━✦⚔️`
  };

  return modelos[subId];
}

function garantirSubSuportado(state) {
  const subId = String(state.subId || "").toUpperCase();

  if (!SUBS_SUPORTADOS.has(subId)) {
    throw new Error("Preparação semanal indisponível para este sub.");
  }

  return subId;
}

function camposComuns() {
  return `
    <div class="grid-2">
      ${campoTexto("nomeObra", "Nome da Obra")}
      ${campoTexto("autor", "Autor")}
      ${campoTexto("user", "User")}
      ${campoTexto("link", "Link", "url", 'placeholder="https://www.wattpad.com/story/..."')}
    </div>
  `;
}

export async function renderPrepararLeituraLunarPage(context) {
  const { state, setSubtitle } = context;
  const subId = garantirSubSuportado(state);
  const buscarPreparacao = context.buscarPreparacaoAtividade || buscarPreparacaoAtividade;
  const salvarPreparacao = context.salvarPreparacaoAtividade || salvarPreparacaoAtividade;
  const dadosSalvos = await buscarPreparacao(subId, "leituraLunar");

  setSubtitle("Prepare e exporte a Leitura Lunar no padrão do sub.");

  const view = document.getElementById("view");
  view.innerHTML = `
    <section class="card">
      <div class="card-header">
        <div>
          <h3>🌙 Preparar Leitura Lunar</h3>
          <p>Preencha os dados para gerar o texto no padrão de ${escapeHTML(subId)}.</p>
        </div>
      </div>

      <form class="grid" id="prepararLeituraLunarForm">
        ${camposComuns()}

        <div class="grid-2">
          <div class="form-row">
            <label for="prologoMaisDeMil">Prólogo tem mais de 1k de palavras?</label>
            <select id="prologoMaisDeMil" name="prologoMaisDeMil" required>
              <option value="nao">Não</option>
              <option value="sim">Sim</option>
            </select>
          </div>

          <div class="form-row">
            <label for="temCapitulosLongos">Algum capítulo tem mais de 4,1k de palavras?</label>
            <select id="temCapitulosLongos" name="temCapitulosLongos" required>
              <option value="nao">Não</option>
              <option value="sim">Sim</option>
            </select>
          </div>
        </div>

        <div class="form-row" id="capitulosLongosRow" hidden>
          <label for="capitulosLongos">Quais capítulos?</label>
          <input id="capitulosLongos" name="capitulosLongos" type="text" placeholder="Ex.: 1, 4, 7" />
        </div>

        <div class="form-actions">
          <button class="btn secondary" type="button" id="salvarLeituraLunarButton">Salvar</button>
          <button class="btn" type="submit">Exportar</button>
        </div>
      </form>
    </section>
  `;

  const form = document.getElementById("prepararLeituraLunarForm");
  const selectCapitulos = document.getElementById("temCapitulosLongos");
  const capitulosRow = document.getElementById("capitulosLongosRow");
  const capitulosInput = document.getElementById("capitulosLongos");

  preencherDadosComuns(form, dadosSalvos);
  form.elements.prologoMaisDeMil.value = dadosSalvos?.prologoMaisDeMil || "nao";
  form.elements.temCapitulosLongos.value = dadosSalvos?.temCapitulosLongos ? "sim" : "nao";
  capitulosInput.value = dadosSalvos?.capitulosLongos || "";

  function atualizarCampoCapitulos() {
    const mostrar = selectCapitulos.value === "sim";
    capitulosRow.hidden = !mostrar;
    capitulosRow.style.display = mostrar ? "grid" : "none";
    capitulosInput.required = mostrar;

    if (!mostrar) capitulosInput.value = "";
  }

  selectCapitulos.addEventListener("change", atualizarCampoCapitulos);
  atualizarCampoCapitulos();

  function coletarLeituraLunar() {
    const comuns = obterDadosComuns(form);
    const dados = new FormData(form);

    return {
      ...comuns,
      prologoMaisDeMil: String(dados.get("prologoMaisDeMil") || "nao"),
      temCapitulosLongos: String(dados.get("temCapitulosLongos") || "nao") === "sim",
      capitulosLongos: String(dados.get("capitulosLongos") || "").trim()
    };
  }

  document.getElementById("salvarLeituraLunarButton")?.addEventListener("click", async () => {
    if (!form.reportValidity()) return;

    try {
      await salvarPreparacao(subId, "leituraLunar", coletarLeituraLunar());
      mostrarToast("Leitura Lunar salva.");
    } catch (error) {
      console.error(error);
      mostrarToast("Não foi possível salvar a Leitura Lunar.");
    }
  });

  form.addEventListener("submit", event => {
    event.preventDefault();
    const texto = gerarLeituraLunar(subId, coletarLeituraLunar());

    abrirExportacao("Leitura Lunar", texto);
  });
}

export async function renderPrepararChuvaEstrelasPage(context) {
  const { state, setSubtitle } = context;
  const subId = garantirSubSuportado(state);
  const buscarPreparacao = context.buscarPreparacaoAtividade || buscarPreparacaoAtividade;
  const salvarPreparacao = context.salvarPreparacaoAtividade || salvarPreparacaoAtividade;
  const dadosSalvos = await buscarPreparacao(subId, "chuvaEstrelas");

  setSubtitle("Prepare e exporte a Chuva de Estrelas no padrão do sub.");

  const view = document.getElementById("view");
  view.innerHTML = `
    <section class="card">
      <div class="card-header">
        <div>
          <h3>✨ Preparar Chuva de Estrelas</h3>
          <p>Preencha os dados para gerar o texto no padrão de ${escapeHTML(subId)}.</p>
        </div>
      </div>

      <form class="grid" id="prepararChuvaEstrelasForm">
        ${camposComuns()}

        <div class="grid-2">
          ${campoTexto("numeroCapitulos", "Número de Capítulos", "number", 'min="1" step="1"')}
          ${campoTexto("prazo", "Prazo de Entrega", "date")}
        </div>

        <div class="form-actions">
          <button class="btn secondary" type="button" id="salvarChuvaEstrelasButton">Salvar</button>
          <button class="btn" type="submit">Exportar</button>
        </div>
      </form>
    </section>
  `;

  const form = document.getElementById("prepararChuvaEstrelasForm");
  preencherDadosComuns(form, dadosSalvos);
  form.elements.numeroCapitulos.value = dadosSalvos?.numeroCapitulos || "";
  form.elements.prazo.value = dadosSalvos?.prazo || "";

  function coletarChuvaEstrelas() {
    const comuns = obterDadosComuns(form);
    const dados = new FormData(form);

    return {
      ...comuns,
      numeroCapitulos: String(dados.get("numeroCapitulos") || "").trim(),
      prazo: String(dados.get("prazo") || "")
    };
  }

  document.getElementById("salvarChuvaEstrelasButton")?.addEventListener("click", async () => {
    if (!form.reportValidity()) return;

    try {
      await salvarPreparacao(subId, "chuvaEstrelas", coletarChuvaEstrelas());
      mostrarToast("Chuva de Estrelas salva.");
    } catch (error) {
      console.error(error);
      mostrarToast("Não foi possível salvar a Chuva de Estrelas.");
    }
  });

  form.addEventListener("submit", event => {
    event.preventDefault();
    const texto = gerarChuvaEstrelas(subId, coletarChuvaEstrelas());

    abrirExportacao("Chuva de Estrelas", texto);
  });
}
