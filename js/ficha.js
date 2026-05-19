import { DIAS_SEMANA } from "./config.js";

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
  mostrarToast,
  repetirCheck,
  ultimoDiaVerificado
} from "./utils.js";

import {
  getModelosDoSub,
  renderTemplate,
  limparLinhasVazias
} from "./templates.js";

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
    sub: state.subConfig,
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

function gerarFicha({ sub, membros, verificacoes }) {
  const modelos = getModelosDoSub(sub);
  const dias = diasComVerificacao(verificacoes);

  const partes = [];

  partes.push(modelos.fichaCabecalho || "");

  membros.forEach(membro => {
    const valores = {
      nome: membro.nome || "",
      user: membro.user || "",
      semana: membro.semana ?? 0,
      dias,
      pontos: pontosAcumulados(membro.id, verificacoes),
      feedbacks: repetirCheck(feedbacksAcumulados(membro.id, verificacoes)),
      extras: repetirCheck(extrasAcumulados(membro.id, verificacoes)),
      obra1: emojisAcumulados(membro.id, verificacoes, "obra1Status"),
      obra2: emojisAcumulados(membro.id, verificacoes, "obra2Status")
    };

    partes.push(renderTemplate(modelos.fichaMembro, valores));
  });

  partes.push(modelos.fichaRodape || "");

  return limparLinhasVazias(partes.filter(Boolean).join("\n\n"));
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