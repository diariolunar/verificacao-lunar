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

function regraLeitura(obra, modelo = "normal") {
  if (obra?.isPoesia) {
    if (modelo === "trono") {
      return "Leiam os especiais votando e deixando pelo menos 1 comentário + 5 capítulos deixando no 𝐌𝐈́𝐍𝐈𝐌𝐎 3 comentários.";
    }

    return "Leiam os especiais votando e deixando pelo menos 1 comentário + 5 capítulos deixando no mínimo 3 comentários.";
  }

  if (modelo === "trono") {
    return "Leiam os especiais votando e deixando pelo menos 1 comentário + 2 capítulos comentando no 𝐌𝐈́𝐍𝐈𝐌𝐎 6 vezes em cada.";
  }

  return "Leiam os especiais votando e deixando pelo menos 1 comentário + 2 capítulos comentando no mínimo 6 vezes em cada.";
}

function montarObservacoes(obra) {
  const linhas = [];

  if (obra.prologoMais1000) {
    linhas.push("O prólogo tem +1k de palavras, então conta como capítulo normal.");
  }

  if (obra.capitulosMais4100) {
    linhas.push(`Capítulos com +4,1k palavras: ${obra.capitulosMais4100}.`);
  }

  if (obra.capitulosMenos500) {
    linhas.push(`Capítulos com -500 palavras: ${obra.capitulosMenos500}.`);
  }

  if (obra.observacoes) {
    linhas.push(obra.observacoes);
  }

  return linhas.join("\n");
}

function montarAlternativa(obra) {
  if (!obra.alternativaTitulo && !obra.alternativaLink && !obra.alternativaObservacoes) {
    return "";
  }

  const linhas = [];

  linhas.push("Para quem já leu:");

  if (obra.alternativaTitulo) {
    linhas.push(`Obra: ${obra.alternativaTitulo}`);
  }

  if (obra.alternativaLink) {
    linhas.push(`Link: ${obra.alternativaLink}`);
  }

  if (obra.alternativaObservacoes) {
    linhas.push(`Obs.: ${obra.alternativaObservacoes}`);
  }

  return linhas.join("\n");
}

function montarBlocoObra({ template, dia, numero, obra, membros, mostrarNumero, sub }) {
  if (isSemObra(obra)) return "";

  const membro = getMembroDaObra(obra, membros);

  const valores = {
    dia,
    diaTitulo: normalizarDiaTitulo(dia),
    diaMaiusculo: normalizarDiaMaiusculo(dia),
    numeroObra: mostrarNumero ? numeroObra(numero) : "",
    autor: membro?.nome || "",
    user: limparUser(membro?.user || ""),
    tituloObra: obra.titulo || "",
    link: obra.link || "",
    regraLeitura: regraLeitura(obra, sub?.modelo),
    observacoes: montarObservacoes(obra),
    alternativa: montarAlternativa(obra)
  };

  return renderTemplate(template, valores);
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
    partes.push(modelos.gradeDiaCabecalho || "");
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

  for (const diaSemana of Object.keys(grade)) {
    if (diaSemana === "atualizadoEm") continue;

    partes.push(await montarDia({
      sub,
      dia: diaSemana,
      grade,
      obrasPorId,
      membros,
      modelos
    }));
  }

  partes.push(modelos.gradeRodape || "");

  return limparLinhasVazias(partes.filter(Boolean).join("\n\n"));
}

async function montarDia({ sub, dia, grade, obrasPorId, membros, modelos }) {
  const obra1 = obrasPorId.get(grade[dia]?.obra1);
  const obra2 = obrasPorId.get(grade[dia]?.obra2);

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
    sub
  });

  const bloco2 = montarBlocoObra({
    template: modelos.gradeObra,
    dia,
    numero: 2,
    obra: obra2,
    membros,
    mostrarNumero,
    sub
  });

  if (bloco1) blocos.push(bloco1);
  if (bloco2) blocos.push(bloco2);

  return blocos.join(modelos.gradeSeparador ? `\n\n${modelos.gradeSeparador}\n\n` : "\n\n");
}