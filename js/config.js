export const APP_VERSION = "2.1.0";

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

export const DEFAULT_SUBS = {
  A1: {
    id: "A1",
    nome: "Chama Eterna",
    botao: "🔥 Chama Eterna",
    subtitulo: "Sub Lunar A-1",
    cor: "#f97316",
    modelo: "chama",
    obrasPorDia: 2,
    ativo: true
  },

  A2: {
    id: "A2",
    nome: "Página Livre",
    botao: "📖 Página Livre",
    subtitulo: "Sub Lunar A-2",
    cor: "#0ea5e9",
    modelo: "pagina",
    obrasPorDia: 2,
    ativo: true
  },

  A6: {
    id: "A6",
    nome: "Trono Profano",
    botao: "𖤐 Trono Profano",
    subtitulo: "Sub Lunar A-6",
    cor: "#7f1d1d",
    modelo: "trono",
    obrasPorDia: 2,
    ativo: true
  },

  A7: {
    id: "A7",
    nome: "Margens de Mundos",
    botao: "✦ 🗺️ 📖 Margens de Mundos",
    subtitulo: "Sub Lunar A-7",
    cor: "#10b981",
    modelo: "margens",
    obrasPorDia: 2,
    ativo: true
  },

  A9: {
    id: "A9",
    nome: "Cicatrizes Literárias",
    botao: "🫀 Cicatrizes Literárias",
    subtitulo: "Sub Lunar A-9",
    cor: "#d4af37",
    modelo: "cicatrizes",
    obrasPorDia: 2,
    ativo: true
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
