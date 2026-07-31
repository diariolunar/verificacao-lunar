import {
  listarMembros,
  listarObras,
  criarMembro,
  criarObra,
  atualizarObra
} from "./data.js";

import {
  escapeHTML,
  mostrarToast,
  confirmarAcao,
  limparUser
} from "./utils.js";

const SUBS_SUPORTADOS = ["A1", "A6", "A7", "A17"];

const CAMPOS_OBRA = [
  { chave: "titulo", label: "Nome da obra" },
  { chave: "link", label: "Link" },
  { chave: "membroId", label: "Autor vinculado" },
  { chave: "prologoMais1000", label: "Prólogo +1k" },
  { chave: "capitulosMais4100", label: "Capítulos +4,1k" },
  { chave: "capitulosMenos500", label: "Capítulos -500" },
  { chave: "observacoes", label: "Observações" }
];

function textoBusca(valor) {
  return String(valor || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function linhasDaFicha(texto) {
  return String(texto || "")
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map(linha => linha.trim())
    .filter(Boolean);
}

function limparValor(valor) {
  return String(valor || "")
    .replace(/^[*"'“”]+|[*"'“”]+$/g, "")
    .trim();
}

function linhaTemLabel(linha, labels) {
  const texto = textoBusca(linha);

  return labels.some(label => texto.includes(label));
}

function valorAposDoisPontos(linha) {
  const partes = String(linha || "").split(":");

  if (partes.length < 2) return "";

  return limparValor(partes.slice(1).join(":"));
}

function extrairCampo(texto, labels, { inline = false } = {}) {
  const linhas = linhasDaFicha(texto);

  for (let index = 0; index < linhas.length; index++) {
    const linha = linhas[index];

    if (!linhaTemLabel(linha, labels)) continue;

    const valorInline = valorAposDoisPontos(linha);

    if (valorInline) {
      return valorInline;
    }

    if (inline) {
      continue;
    }

    for (let proxima = index + 1; proxima < linhas.length; proxima++) {
      const valor = limparValor(linhas[proxima]);

      if (valor) {
        return valor;
      }
    }
  }

  return "";
}

function extrairRespostaDepoisDaPergunta(texto, labels) {
  const linhas = linhasDaFicha(texto);

  for (let index = 0; index < linhas.length; index++) {
    if (!linhaTemLabel(linhas[index], labels)) continue;

    for (let proxima = index + 1; proxima < linhas.length; proxima++) {
      const linha = linhas[proxima];
      const busca = textoBusca(linha);

      if (busca === "quais" || busca.includes("apenas numeros")) {
        continue;
      }

      if (linha.includes("━━") || linha.includes("🔥🔥")) {
        continue;
      }

      return limparValor(linha);
    }
  }

  return "";
}

function ehRespostaSim(valor) {
  return textoBusca(valor).startsWith("sim");
}

function normalizarRespostaTexto(valor) {
  const resposta = limparValor(valor);

  if (!resposta || textoBusca(resposta).startsWith("nao")) {
    return "";
  }

  return resposta;
}

function montarObservacoes({ gatilhoLeitura, gatilhoObra }) {
  const linhas = [];

  if (normalizarRespostaTexto(gatilhoLeitura)) {
    linhas.push(`Gatilho de leitura do autor: ${normalizarRespostaTexto(gatilhoLeitura)}.`);
  }

  if (normalizarRespostaTexto(gatilhoObra)) {
    linhas.push(`Gatilhos da obra: ${normalizarRespostaTexto(gatilhoObra)}.`);
  }

  return linhas.join("\n");
}

export function parseFicha(texto, subId) {
  const nome = subId === "A1"
    ? extrairCampo(texto, ["autor"], { inline: true })
    : extrairCampo(texto, ["nome"]);

  const user = extrairCampo(texto, ["user"], { inline: subId === "A1" });
  const titulo = extrairCampo(texto, [
    "nome da obra",
    "grimo rio obra",
    "grimorio obra",
    "mundo obra",
    "obra"
  ], { inline: subId === "A1" });
  const link = extrairCampo(texto, ["link"], { inline: subId === "A1" });

  const prologo = extrairRespostaDepoisDaPergunta(texto, ["prologo", "1k"]);
  const capitulosMais4100 = extrairRespostaDepoisDaPergunta(texto, ["4 1k"]);
  const capitulosMenos500 = extrairRespostaDepoisDaPergunta(texto, ["500"]);
  const gatilhoLeitura = extrairRespostaDepoisDaPergunta(texto, ["voce tem algum gatilho"]);
  const gatilhoObra = extrairRespostaDepoisDaPergunta(texto, ["obra tem algum gatilho", "obra possui algum gatilho"]);

  return {
    nome: limparValor(nome),
    user: limparUser(user),
    obra: {
      titulo: limparValor(titulo),
      link: limparValor(link),
      isPoesia: false,
      prologoMais1000: ehRespostaSim(prologo),
      capitulosMais4100: normalizarRespostaTexto(capitulosMais4100),
      capitulosMenos500: normalizarRespostaTexto(capitulosMenos500),
      observacoes: montarObservacoes({ gatilhoLeitura, gatilhoObra })
    }
  };
}

function validarImportacao(dados) {
  const faltando = [];

  if (!dados.nome) faltando.push("nome");
  if (!dados.user) faltando.push("user");
  if (!dados.obra.titulo) faltando.push("nome da obra");
  if (!dados.obra.link) faltando.push("link");

  return faltando;
}

function mesmoUser(a, b) {
  return textoBusca(limparUser(a)) === textoBusca(limparUser(b));
}

function mesmaObra(a, b) {
  return textoBusca(a) === textoBusca(b);
}

function encontrarMembro(membros, dados) {
  return membros.find(membro => mesmoUser(membro.user, dados.user))
    || membros.find(membro => textoBusca(membro.nome) === textoBusca(dados.nome))
    || null;
}

function encontrarObra(obras, dadosObra, membroId) {
  return obras.find(obra => mesmaObra(obra.titulo, dadosObra.titulo) || obra.link === dadosObra.link)
    || obras.find(obra => obra.membroId === membroId && mesmaObra(obra.titulo, dadosObra.titulo))
    || null;
}

function formatarValor(valor) {
  if (typeof valor === "boolean") {
    return valor ? "Sim" : "Não";
  }

  return String(valor || "-");
}

function getNomeMembroPorId(membros, membroId) {
  const membro = membros.find(item => item.id === membroId);

  if (!membro) return membroId || "-";

  return `${membro.nome || ""}${membro.user ? ` (${limparUser(membro.user)})` : ""}`.trim();
}

function compararObra(existente, nova, membros) {
  return CAMPOS_OBRA
    .map(campo => {
      const antigo = campo.chave === "membroId"
        ? getNomeMembroPorId(membros, existente?.membroId)
        : existente?.[campo.chave];
      const atual = campo.chave === "membroId"
        ? getNomeMembroPorId(membros, nova?.membroId)
        : nova?.[campo.chave];

      if (formatarValor(antigo) === formatarValor(atual)) {
        return null;
      }

      return {
        campo: campo.label,
        antigo: formatarValor(antigo),
        atual: formatarValor(atual)
      };
    })
    .filter(Boolean);
}

function montarResumoDiferencas(diferencas) {
  return diferencas.map(item => `${item.campo}:\nAtual: ${item.antigo}\nNovo: ${item.atual}`).join("\n\n");
}

function renderPreview(dados, faltando = []) {
  if (!dados) {
    return `<div class="empty-state">Cole uma ficha e clique em pré-visualizar.</div>`;
  }

  return `
    <article class="item-card">
      <div>
        <h4>${escapeHTML(dados.nome || "Nome não encontrado")}</h4>
        <p>User: ${escapeHTML(dados.user || "Não encontrado")}</p>
        <p>Obra: ${escapeHTML(dados.obra.titulo || "Não encontrada")}</p>
        <p>Link: ${escapeHTML(dados.obra.link || "Não encontrado")}</p>
        <p>Prólogo +1k: ${dados.obra.prologoMais1000 ? "Sim" : "Não"}</p>
        <p>+4,1k: ${escapeHTML(dados.obra.capitulosMais4100 || "-")}</p>
        <p>-500: ${escapeHTML(dados.obra.capitulosMenos500 || "-")}</p>
        ${dados.obra.observacoes ? `<p>Obs.: ${escapeHTML(dados.obra.observacoes)}</p>` : ""}
      </div>
    </article>
    ${
      faltando.length
        ? `<div class="note-warning">Campos não encontrados: ${escapeHTML(faltando.join(", "))}</div>`
        : ""
    }
  `;
}

async function importarFicha({ state, dados }) {
  const membros = await listarMembros(state.subId);
  const obras = await listarObras(state.subId);
  let membro = encontrarMembro(membros, dados);
  let membroCriado = false;

  if (!membro) {
    const membroId = await criarMembro(state.subId, {
      nome: dados.nome,
      user: dados.user,
      semana: 0
    });

    membro = {
      id: membroId,
      nome: dados.nome,
      user: dados.user
    };
    membroCriado = true;
  }

  const novaObra = {
    ...dados.obra,
    membroId: membro.id
  };
  const obraExistente = encontrarObra(obras, novaObra, membro.id);

  if (!obraExistente) {
    await criarObra(state.subId, novaObra);
    return membroCriado
      ? "Membro e obra cadastrados."
      : "Membro já existia. Obra cadastrada.";
  }

  const diferencas = compararObra(obraExistente, novaObra, membros);

  if (!diferencas.length) {
    return membroCriado
      ? "Membro cadastrado. A obra já existia com os mesmos dados."
      : "Membro e obra já estavam cadastrados com os mesmos dados.";
  }

  const confirmar = await confirmarAcao({
    titulo: "Obra já cadastrada",
    mensagem: `A obra "${obraExistente.titulo}" já existe, mas há diferenças:\n\n${montarResumoDiferencas(diferencas)}\n\nDeseja substituir pelos dados da ficha?`,
    confirmarTexto: "Substituir",
    cancelarTexto: "Manter atual",
    perigo: true
  });

  if (!confirmar) {
    return membroCriado
      ? "Membro cadastrado. Obra existente mantida sem alterações."
      : "Obra existente mantida sem alterações.";
  }

  await atualizarObra(state.subId, obraExistente.id, novaObra);

  return "Obra existente atualizada com os dados da ficha.";
}

export async function renderImportarFichaPage(context) {
  const { state, setSubtitle, refresh } = context;
  const subId = String(state.subId || "").toUpperCase();

  setSubtitle("Importe membro e obra a partir de uma ficha pronta.");

  const view = document.getElementById("view");
  const suportado = SUBS_SUPORTADOS.includes(subId);

  view.innerHTML = `
    <section class="card">
      <div class="card-header">
        <div>
          <h3>📥 Importar Ficha</h3>
          <p>Cole uma ficha do sub atual para cadastrar membro e obra automaticamente.</p>
        </div>
      </div>

      ${
        suportado
          ? ""
          : `<div class="note-warning">Importação automática disponível apenas para A1, A6, A7 e A17.</div>`
      }

      <div class="grid">
        <textarea id="textoFichaImportar" placeholder="Cole a ficha aqui..." ${suportado ? "" : "disabled"}></textarea>

        <div class="form-actions">
          <button class="btn secondary" type="button" id="previsualizarFichaButton" ${suportado ? "" : "disabled"}>Pré-visualizar</button>
          <button class="btn" type="button" id="importarFichaButton" disabled>Importar ficha</button>
        </div>

        <div id="previewImportacaoFicha">
          ${renderPreview(null)}
        </div>
      </div>
    </section>
  `;

  let dadosPreview = null;

  function atualizarPreview() {
    const texto = document.getElementById("textoFichaImportar")?.value || "";
    const preview = document.getElementById("previewImportacaoFicha");
    const importarButton = document.getElementById("importarFichaButton");

    dadosPreview = parseFicha(texto, subId);

    const faltando = validarImportacao(dadosPreview);

    if (preview) {
      preview.innerHTML = renderPreview(dadosPreview, faltando);
    }

    if (importarButton) {
      importarButton.disabled = Boolean(faltando.length);
    }
  }

  document.getElementById("previsualizarFichaButton")?.addEventListener("click", atualizarPreview);

  document.getElementById("importarFichaButton")?.addEventListener("click", async () => {
    try {
      if (!dadosPreview) {
        atualizarPreview();
      }

      const faltando = validarImportacao(dadosPreview);

      if (faltando.length) {
        mostrarToast(`Não foi possível importar. Campos faltando: ${faltando.join(", ")}.`);
        return;
      }

      const mensagem = await importarFicha({ state, dados: dadosPreview });

      mostrarToast(mensagem);
      await refresh();
    } catch (error) {
      console.error(error);
      mostrarToast("Erro ao importar ficha. Veja o console.");
    }
  });
}
