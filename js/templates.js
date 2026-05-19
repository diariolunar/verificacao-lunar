import { DEFAULT_MODELOS } from "./config.js";

export function getModelosDoSub(sub) {
  const modeloBase = DEFAULT_MODELOS[sub?.modelo || "trono"] || DEFAULT_MODELOS.trono;

  return {
    ...modeloBase,
    ...(sub?.modelos || {})
  };
}

export function renderTemplate(template, valores) {
  let texto = String(template || "");

  Object.entries(valores).forEach(([chave, valor]) => {
    const regex = new RegExp(`{{\\s*${chave}\\s*}}`, "g");
    texto = texto.replace(regex, String(valor ?? ""));
  });

  return limparLinhasVazias(texto);
}

export function limparLinhasVazias(texto) {
  return String(texto || "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{4,}/g, "\n\n\n")
    .trim();
}

export function getVariaveisFichaTexto() {
  return `Variáveis disponíveis na ficha:

{{nome}}
{{user}}
{{semana}}
{{dias}}
{{pontos}}
{{feedbacks}}
{{extras}}
{{obra1}}
{{obra2}}`;
}

export function getVariaveisGradeTexto() {
  return `Variáveis disponíveis na grade:

{{dia}}
{{diaTitulo}}
{{diaMaiusculo}}
{{numeroObra}}
{{autor}}
{{user}}
{{tituloObra}}
{{link}}
{{regraLeitura}}
{{observacoes}}
{{alternativa}}`;
}