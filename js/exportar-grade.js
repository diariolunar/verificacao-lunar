import {
  limparUser,
  normalizarDiaMaiusculo,
  normalizarDiaTitulo,
  numeroObra
} from "./utils.js";

import {
  getModelosDoSub,
  renderTemplate,
  limparLinhasVazias
} from "./templates.js";

function getMembroDaObra(obra, membros) {
  return membros.find(membro => membro.id === obra.membroId) || null;
}

function isSemObra(obra) {
  return !obra || obra.semObra || obra.id === "__SEM_OBRA__";
}

function isSemObraId(obraId) {
  return !obraId || obraId === "__SEM_OBRA__";
}

function getObraDaGrade(obrasPorId, obraId) {
  if (isSemObraId(obraId)) return null;

  return obrasPorId.get(obraId);
}

function numeroObraIconePorNumero(numero) {
  return Number(numero) === 2 ? "🧚‍♀️" : "🐲";
}

function numeroObraDecorado(numero) {
  return Number(numero) === 2 ? "𝟐" : "𝟏";
}

function getIconesEntreNosDia(dia) {
  const mapa = {
    Segunda: { nome: "💜", user: "🌸" },
    Terça: { nome: "💛", user: "🌻" },
    Quarta: { nome: "💚", user: "🍀" },
    Quinta: { nome: "💜", user: "🌸" },
    Sexta: { nome: "💙", user: "🦋" }
  };

  return mapa[dia] || { nome: "🌈", user: "🤍" };
}

function estilizarNegrito(texto) {
  const mapa = {
    A: "𝐀", B: "𝐁", C: "𝐂", D: "𝐃", E: "𝐄", F: "𝐅", G: "𝐆", H: "𝐇", I: "𝐈",
    J: "𝐉", K: "𝐊", L: "𝐋", M: "𝐌", N: "𝐍", O: "𝐎", P: "𝐏", Q: "𝐐", R: "𝐑",
    S: "𝐒", T: "𝐓", U: "𝐔", V: "𝐕", W: "𝐖", X: "𝐗", Y: "𝐘", Z: "𝐙",
    Á: "Á", À: "À", Â: "Â", Ã: "Ã", É: "É", Ê: "Ê", Í: "Í", Ó: "Ó", Ô: "Ô",
    Õ: "Õ", Ú: "Ú", Ç: "Ç"
  };

  return String(texto || "")
    .toUpperCase()
    .split("")
    .map(char => mapa[char] || char)
    .join("");
}

function formatarLinkMarkdown(link) {
  const texto = String(link || "").trim();

  return texto ? `[${texto}](${texto})` : "";
}

function regraLeituraPrincipal(obra, modelo = "normal") {
  if (obra?.semObra) return "";

  if (obra?.isPoesia) {
    if (modelo === "trono" || modelo === "lamina") {
      return "Leiam os especiais votando e deixando pelo menos 1 comentário + 5 capítulos deixando no 𝐌𝐈́𝐍𝐈𝐌𝐎 3 comentários.";
    }

    return "Leiam os especiais votando e deixando pelo menos 1 comentário + 5 capítulos deixando no mínimo 3 comentários.";
  }

  if (modelo === "trono" || modelo === "lamina") {
    return "Leiam os especiais votando e deixando pelo menos 1 comentário + 2 capítulos comentando no 𝐌𝐈́𝐍𝐈𝐌𝐎 6 vezes em cada.";
  }

  return "Leiam os especiais votando e deixando pelo menos 1 comentário + 2 capítulos comentando no mínimo 6 vezes em cada.";
}

function regraLeituraAlternativa(obra, modelo = "normal") {
  if (obra?.alternativaIsPoesia) {
    if (modelo === "trono" || modelo === "lamina") {
      return "Leiam os especiais votando e deixando pelo menos 1 comentário + 5 capítulos deixando no 𝐌𝐈́𝐍𝐈𝐌𝐎 3 comentários.";
    }

    return "Leiam os especiais votando e deixando pelo menos 1 comentário + 5 capítulos deixando no mínimo 3 comentários.";
  }

  if (modelo === "trono" || modelo === "lamina") {
    return "Leiam os especiais votando e deixando pelo menos 1 comentário + 2 capítulos comentando no 𝐌𝐈́𝐍𝐈𝐌𝐎 6 vezes em cada.";
  }

  return "Leiam os especiais votando e deixando pelo menos 1 comentário + 2 capítulos comentando no mínimo 6 vezes em cada.";
}

function montarObservacoesPrincipal(obra) {
  if (obra?.semObra) return "";

  const linhas = [];

  if (obra.prologoMais1000) {
    linhas.push("O prólogo tem +1k de palavras, então conta como capítulo normal.");
  }

  if (obra.capitulosMais4100) {
    linhas.push(`Capítulos com +4,1k palavras: ${obra.capitulosMais4100}. Ler apenas 1 capítulo por vez, deixando no mínimo 12 comentários.`);
  }

  if (obra.capitulosMenos500) {
    linhas.push(`Capítulos com -500 palavras: ${obra.capitulosMenos500}. Ler 1 capítulo a mais e comentar normalmente.`);
  }

  if (obra.observacoes) {
    linhas.push(obra.observacoes);
  }

  return linhas.join("\n\n");
}

function montarObservacoesAlternativa(obra) {
  const linhas = [];

  if (obra.alternativaPrologoMais1000) {
    linhas.push("O prólogo tem +1k de palavras, então conta como capítulo normal.");
  }

  if (obra.alternativaCapitulosMais4100) {
    linhas.push(`Capítulos com +4,1k palavras: ${obra.alternativaCapitulosMais4100}. Ler apenas 1 capítulo por vez, deixando no mínimo 12 comentários.`);
  }

  if (obra.alternativaCapitulosMenos500) {
    linhas.push(`Capítulos com -500 palavras: ${obra.alternativaCapitulosMenos500}. Ler 1 capítulo a mais e comentar normalmente.`);
  }

  if (obra.alternativaObservacoes) {
    linhas.push(obra.alternativaObservacoes);
  }

  return linhas.join("\n\n");
}

function montarObservacoesOuRegra({ observacoes, regraLeitura, modelo }) {
  if (observacoes) {
    return observacoes;
  }

  if (!regraLeitura) {
    return "";
  }

  return regraLeitura;
}

function valorOuNao(valor) {
  const texto = String(valor || "").trim();

  return texto || "Não";
}

function simNao(valor) {
  return valor ? "Sim" : "Não";
}

function montarAlternativa(obra, sub) {
  if (!obra.alternativaTitulo && !obra.alternativaLink && !obra.alternativaObservacoes) {
    return "";
  }

  const linhas = [];

  if (sub?.modelo === "trono") {
    linhas.push("🔥 𝐏𝐀𝐑𝐀 𝐐𝐔𝐄𝐌 𝐉𝐀́ 𝐋𝐄𝐔:");
    linhas.push("");
    linhas.push(`📕 𝐆𝐑𝐈𝐌𝐎́𝐑𝐈𝐎/𝐎𝐁𝐑𝐀: ${obra.alternativaTitulo || ""}`);
    linhas.push(`🔗 𝐋𝐈𝐍𝐊: ${obra.alternativaLink || ""}`);
    linhas.push("");
    linhas.push(`⚠️ 𝐎𝐁𝐒.: ${regraLeituraAlternativa(obra, sub?.modelo)}`);

    const obs = montarObservacoesAlternativa(obra);

    if (obs) {
      linhas.push("");
      linhas.push(obs);
    }

    linhas.push("");
    linhas.push("Lembrem-se: os comentários devem estar bem distribuídos entre o início, o meio e o fim.");

    return linhas.join("\n");
  }

  if (sub?.modelo === "margens") {
    linhas.push("🌌 *PRA QUEM JÁ LEU* 🌌");
    linhas.push("");
    linhas.push(`📖 𝐌𝐔𝐍𝐃𝐎/𝐎𝐁𝐑𝐀: ${obra.alternativaTitulo || ""}`);
    linhas.push(`🔗 𝐋𝐈𝐍𝐊: ${obra.alternativaLink || ""}`);
    linhas.push("");
    linhas.push("⚠️ 𝐎𝐁𝐒.:");
    linhas.push("");
    linhas.push(regraLeituraAlternativa(obra, sub?.modelo));

    const obs = montarObservacoesAlternativa(obra);

    if (obs) {
      linhas.push("");
      linhas.push(obs);
    }

    linhas.push("");
    linhas.push("Lembrem-se: os comentários devem estar bem distribuídos entre o início, o meio e o fim.");

    return linhas.join("\n");
  }

  if (sub?.modelo === "cicatrizes") {
    linhas.push("🪻*PARA QUEM JÁ LEU*🪻");
    linhas.push("");
    linhas.push(`🩻𝑜𝑏𝑟𝑎: ${obra.alternativaTitulo || ""}`);
    linhas.push(`🩻𝑙𝑖𝑛𝑘: ${obra.alternativaLink || ""}`);
    linhas.push("");
    linhas.push(`🧠 OBS: ${regraLeituraAlternativa(obra, sub?.modelo)}`);

    const obs = montarObservacoesAlternativa(obra);

    if (obs) {
      linhas.push(obs);
    }

    return linhas.join("\n");
  }

  linhas.push("Para quem já leu:");
  linhas.push("");

  if (obra.alternativaTitulo) {
    linhas.push(`Obra: ${obra.alternativaTitulo}`);
  }

  if (obra.alternativaLink) {
    linhas.push(`Link: ${obra.alternativaLink}`);
  }

  linhas.push(`Obs.: ${regraLeituraAlternativa(obra, sub?.modelo)}`);

  const obs = montarObservacoesAlternativa(obra);

  if (obs) {
    linhas.push(obs);
  }

  return linhas.join("\n");
}

function montarBlocoObra({ template, dia, numero, obra, membros, mostrarNumero, sub, modelos }) {
  if (!obra) return "";
  if (isSemObra(obra) && !modelos?.renderSemObra) return "";

  const membro = getMembroDaObra(obra, membros);
  const observacoes = montarObservacoesPrincipal(obra);
  const regraLeitura = regraLeituraPrincipal(obra, sub?.modelo);
  const iconesEntreNos = getIconesEntreNosDia(dia);

  const valores = {
    dia,
    diaTitulo: normalizarDiaTitulo(dia),
    diaMaiusculo: normalizarDiaMaiusculo(dia),
    diaMaiusculoEstilizado: estilizarNegrito(normalizarDiaMaiusculo(dia)),
    numeroObra: mostrarNumero ? numeroObra(numero) : "",
    numeroObraIcone: numeroObraIconePorNumero(numero),
    numeroObraDecorado: numeroObraDecorado(numero),
    diaNomeIcone: iconesEntreNos.nome,
    diaUserIcone: iconesEntreNos.user,
    autor: obra.semObra ? "SEM OBRA" : membro?.nome || "",
    nome: obra.semObra ? "SEM OBRA" : membro?.nome || "",
    user: obra.semObra ? "" : limparUser(membro?.user || ""),
    userOriginal: obra.semObra ? "" : membro?.user || "",
    tituloObra: obra.titulo || "",
    link: obra.link || "",
    linkMarkdown: formatarLinkMarkdown(obra.link),
    prologoMais1000: simNao(obra.prologoMais1000),
    capitulosMais4100: valorOuNao(obra.capitulosMais4100),
    capitulosMenos500: valorOuNao(obra.capitulosMenos500),
    gatilhosObra: valorOuNao(obra.observacoes),
    gatilhosLeitura: valorOuNao(membro?.gatilhos),
    regraLeitura,
    observacoes,
    observacoesOuRegra: montarObservacoesOuRegra({
      observacoes,
      regraLeitura,
      modelo: sub?.modelo
    }),
    alternativa: montarAlternativa(obra, sub)
  };

  return renderTemplate(template, valores);
}

function montarCabecalhoDia(template, dia) {
  if (!template) return "";

  return renderTemplate(template, {
    dia,
    diaTitulo: normalizarDiaTitulo(dia),
    diaMaiusculo: normalizarDiaMaiusculo(dia),
    diaMaiusculoEstilizado: estilizarNegrito(normalizarDiaMaiusculo(dia))
  });
}

export async function gerarGradeExportada({
  sub,
  tipo,
  dia,
  grade,
  obras,
  membros
}) {
  const modelos = getModelosDoSub(sub);
  const obrasPorId = new Map(obras.map(obra => [obra.id, obra]));

  const partes = [];

  if (tipo === "dia") {
    partes.push(montarCabecalhoDia(modelos.gradeDiaCabecalho, dia));

    partes.push(await montarDia({
      sub,
      dia,
      grade,
      obrasPorId,
      membros,
      modelos
    }));

    partes.push(modelos.gradeRodape || "");

    return limparLinhasVazias(partes.filter(Boolean).join("\n\n"));
  }

  partes.push(modelos.gradeSemanaCabecalho || "");

  const ordemDias = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"];

  for (const diaSemana of ordemDias) {
    if (!grade[diaSemana]) continue;

    const textoDia = await montarDia({
      sub,
      dia: diaSemana,
      grade,
      obrasPorId,
      membros,
      modelos
    });

    if (textoDia) {
      partes.push(textoDia);
    }
  }

  partes.push(modelos.gradeRodape || "");

  return limparLinhasVazias(partes.filter(Boolean).join("\n\n"));
}

async function montarDia({ sub, dia, grade, obrasPorId, membros, modelos }) {
  const obra1 = getObraDaGrade(obrasPorId, grade[dia]?.obra1);
  const obra2 = getObraDaGrade(obrasPorId, grade[dia]?.obra2);

  const temObra1 = !isSemObra(obra1);
  const temObra2 = !isSemObra(obra2);
  const mostrarNumero = temObra1 && temObra2;

  const blocos = [];

  const bloco1 = montarBlocoObra({
    template: modelos.gradeObra,
    dia,
    numero: 1,
    obra: obra1,
    membros,
    mostrarNumero,
    sub,
    modelos
  });

  const bloco2 = montarBlocoObra({
    template: modelos.gradeObra,
    dia,
    numero: 2,
    obra: obra2,
    membros,
    mostrarNumero,
    sub,
    modelos
  });

  if (bloco1) blocos.push(bloco1);
  if (bloco2) blocos.push(bloco2);

  const textoObras = blocos.join(modelos.gradeSeparador ? `\n\n${modelos.gradeSeparador}\n\n` : "\n\n");

  return textoObras;
}
