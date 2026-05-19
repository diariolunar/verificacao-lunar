import { DIAS_SEMANA } from "./config.js";

import {
  listarMembros,
  listarVerificacoes
} from "./data.js";

import {
  escapeHTML,
  limparUser
} from "./utils.js";

export async function renderPontuacaoPage(context) {
  const { state, setSubtitle } = context;

  setSubtitle("Pontuação acumulada do sub.");

  const view = document.getElementById("view");

  const [membros, verificacoes] = await Promise.all([
    listarMembros(state.subId),
    listarVerificacoes(state.subId)
  ]);

  const ranking = membros.map(membro => {
    let pontos = 0;
    let feedbacks = 0;
    let extras = 0;
    let diasVerificados = 0;

    DIAS_SEMANA.forEach(dia => {
      const dados = verificacoes[dia]?.membros?.[membro.id];

      if (!dados) return;

      diasVerificados++;
      pontos += Number(dados.pontos || 0);

      if (dados.obra1Feedback) feedbacks++;
      if (dados.obra2Feedback) feedbacks++;

      if (dados.obra1Extra) extras += Math.max(1, Number(dados.obra1ExtraQtd || 1));
      if (dados.obra2Extra) extras += Math.max(1, Number(dados.obra2ExtraQtd || 1));
    });

    return {
      ...membro,
      pontos,
      feedbacks,
      extras,
      diasVerificados
    };
  }).sort((a, b) => {
    if (b.pontos !== a.pontos) return b.pontos - a.pontos;
    return String(a.nome || "").localeCompare(String(b.nome || ""));
  });

  const listaHTML = ranking.length
    ? ranking.map((membro, index) => `
      <article class="item-card">
        <div>
          <h4>${index + 1}º — ${escapeHTML(membro.nome)}</h4>
          <p>User: ${escapeHTML(limparUser(membro.user))}</p>
          <p>Semana: ${membro.semana ?? 0} • Dias verificados: ${membro.diasVerificados}</p>
          <p>Feedbacks: ${membro.feedbacks} • Extras: ${membro.extras}</p>
        </div>

        <div class="points-pill">
          <small>Pontos</small>
          <strong>${membro.pontos}</strong>
        </div>
      </article>
    `).join("")
    : `
      <div class="empty-state">
        Nenhum membro cadastrado.
      </div>
    `;

  view.innerHTML = `
    <section class="card">
      <div class="card-header">
        <div>
          <h3>🏆 Pontuação Geral</h3>
          <p>Ranking acumulado com todos os dias salvos na semana.</p>
        </div>
      </div>

      <div class="item-list">
        ${listaHTML}
      </div>
    </section>
  `;
}