export const ROOT_COLLECTION = "v2_subs";
export const SEM_OBRA_ID = "__SEM_OBRA__";

export const diasSemana = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"];

export const statusLeitura = [
  { emoji: "", texto: "Selecione" },
  { emoji: "🌙", texto: "Leu" },
  { emoji: "☠", texto: "Não leu" },
  { emoji: "💅", texto: "Justificado" },
  { emoji: "🌼", texto: "Já havia lido antes" },
  { emoji: "🙍", texto: "Falta algo" },
  { emoji: "✨", texto: "Obra do dia" },
  { emoji: "⏳", texto: "Sem obra" },
  { emoji: "⚰", texto: "Saiu do grupo" },
  { emoji: "🧕🏻", texto: "Leitura em andamento" },
  { emoji: "⚠", texto: "Infração das regras" },
  { emoji: "🚫", texto: "Infração no tempo de leitura" },
  { emoji: "📲", texto: "Prints no PV" },
  { emoji: "⛔", texto: "Removido por infração" },
  { emoji: "⏰", texto: "Leitura feita em tempo estimado" }
];

export const statusQueCompletamLeitura = ["🌙", "✨"];

export const subs = {
  A1: {
    codigo: "A1",
    nome: "🔥 Chama Eterna",
    subtitulo: "Luna A-1",
    cor: "#f97316",
    modelo: "chama"
  },
  A2: {
    codigo: "A2",
    nome: "📖 Página Livre",
    subtitulo: "Página Livre A-2",
    cor: "#0ea5e9",
    modelo: "pagina"
  },
  A6: {
    codigo: "A6",
    nome: "𖤐 Trono Profano",
    subtitulo: "A-6 Trono Profano",
    cor: "#7f1d1d",
    modelo: "trono"
  },
  A7: {
    codigo: "A7",
    nome: "✦ 🗺️ 📖 Margens de Mundos",
    subtitulo: "A-7 Margens de Mundos",
    cor: "#10b981",
    modelo: "margens"
  }
};
