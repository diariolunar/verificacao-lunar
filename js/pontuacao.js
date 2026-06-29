import {
  listarMembros,
  listarVerificacoes
} from "./data.js";

import { DIAS_SEMANA, STATUS_QUE_CONTAM_LEITURA } from "./config.js";

import {
  escapeHTML,
  repetirCheck
} from "./utils.js";

function getStatus(registro, numeroObra) {
  return registro?.[`obra${numeroObra}`] || "";
}

function getFeedback(registro, numeroObra) {
  return Boolean(registro?.[`feedback${numeroObra}`]);
}

function getExtra(registro, numeroObra) {
  return Boolean(registro?.[`extra${numeroObra}`]);
}

function getExtraQtd(registro, numeroObra) {
  const valor = Number(registro?.[`extraQtd${numeroObra}`] || 1);

  if (!Number.isFinite(valor) || valor < 1) {
    return 1;
  }

  return valor;
}

function getPontosAdicionais(registro) {
  const valor = Number(registro?.pontosAdicionais || 0);

  if (!Number.isFinite(valor) || valor < 0) {
    return 0;
  }

  return Math.floor(valor);
}

function statusContaLeitura(status) {
  return STATUS_QUE_CONTAM_LEITURA.includes(status);
}

function statusPermiteFeedbackEExtra(status) {
  return status === "🌙";
}

function calcularPontosDia(registro) {
  const status1 = getStatus(registro, 1);
  const status2 = getStatus(registro, 2);
  const pontosAdicionais = getPontosAdicionais(registro);

  const temObra1 = status1 && status1 !== "⏳";
  const temObra2 = status2 && status2 !== "⏳";

  const obrigatorias = [];

  if (temObra1) obrigatorias.push({ numero: 1, status: status1 });
  if (temObra2) obrigatorias.push({ numero: 2, status: status2 });

  if (!obrigatorias.length) {
    return pontosAdicionais;
  }

  const cumpriuTodas = obrigatorias.every(item => statusContaLeitura(item.status));

  if (!cumpriuTodas) {
    return pontosAdicionais;
  }

  let pontos = 0;

  obrigatorias.forEach(item => {
    pontos += 5;

    if (statusPermiteFeedbackEExtra(item.status)) {
      if (getFeedback(registro, item.numero)) {
        pontos += 20;
      }

      if (getExtra(registro, item.numero)) {
        pontos += getExtraQtd(registro, item.numero) * 5;
      }
    }
  });

  return pontos + pontosAdicionais;
}

function calcularPontuacaoMembroSemana(membro, verificacoes) {
  let pontos = 0;
  let feedbacks = 0;
  let extras = 0;
  let pontosAdicionais = 0;
  let diasComRegistro = 0;
  let leituraLunar = false;

  DIAS_SEMANA.forEach(dia => {
    const registro = verificacoes?.[dia]?.membros?.[membro.id];

    if (!registro) return;

    diasComRegistro += 1;
    pontos += calcularPontosDia(registro);
    pontosAdicionais += getPontosAdicionais(registro);

    [1, 2].forEach(numero => {
      const status = getStatus(registro, numero);

      if (statusPermiteFeedbackEExtra(status)) {
        if (getFeedback(registro, numero)) {
          feedbacks += 1;
        }

        if (getExtra(registro, numero)) {
          extras += getExtraQtd(registro, numero);
        }
      }
    });

    if (registro.leituraLunar) {
      leituraLunar = true;
    }
  });

  return {
    id: membro.id,
    nome: membro.nome || "",
    user: membro.user || "",
    semana: Number(membro.semana || 0),
    pontos,
    feedbacks,
    extras,
    pontosAdicionais,
    diasComRegistro,
    leituraLunar
  };
}

function ordenarRanking(lista) {
  return [...lista].sort((a, b) => {
    if (b.pontos !== a.pontos) return b.pontos - a.pontos;
    return String(a.nome || "").localeCompare(String(b.nome || ""));
  });
}

export async function renderPontuacaoPage(context) {
  const { state, setSubtitle } = context;

  setSubtitle("Ranking da semana atual.");

  const view = document.getElementById("view");

  const [membros, verificacoes] = await Promise.all([
    listarMembros(state.subId),
    listarVerificacoes(state.subId)
  ]);

  const ranking = ordenarRanking(
    membros.map(membro => calcularPontuacaoMembroSemana(membro, verificacoes))
  );

  const totalPontos = ranking.reduce((acc, item) => acc + item.pontos, 0);
  const totalFeedbacks = ranking.reduce((acc, item) => acc + item.feedbacks, 0);
  const totalExtras = ranking.reduce((acc, item) => acc + item.extras, 0);
  const membrosPontuados = ranking.filter(item => item.pontos > 0).length;

  const linhas = ranking.length
    ? ranking.map((item, index) => `
      <article class="item-card">
        <div>
          <h4>${index + 1}º • ${escapeHTML(item.nome)}</h4>
          <p>User: ${escapeHTML(item.user)}</p>
          <p>Semana do membro: ${item.semana}</p>
          <p>Dias com registro nesta semana: ${item.diasComRegistro}</p>
          <p>Pontos adicionais: ${item.pontosAdicionais || "-"}</p>
          <p>Feedbacks: ${item.feedbacks ? repetirCheck(item.feedbacks) : "—"}</p>
          <p>Extras: ${item.extras ? repetirCheck(item.extras) : "—"}</p>
          <p>Leitura Lunar: ${item.leituraLunar ? "✅" : "—"}</p>
        </div>

        <div class="points-pill">
          <small>Pontos</small>
          <strong>${item.pontos}</strong>
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
          <h3>🏆 Pontuação da Semana</h3>
          <p>Esta tela usa apenas as verificações salvas da semana atual. Ao resetar a ficha da semana, este ranking também zera.</p>
        </div>
      </div>

      <div class="dashboard-grid">
        <div class="dashboard-card">
          <div class="icon">⭐</div>
          <strong>${totalPontos}</strong>
          <span>Total de pontos da semana</span>
        </div>

        <div class="dashboard-card">
          <div class="icon">👥</div>
          <strong>${membrosPontuados}</strong>
          <span>Membros pontuados na semana</span>
        </div>

        <div class="dashboard-card">
          <div class="icon">💬</div>
          <strong>${totalFeedbacks}</strong>
          <span>Feedbacks válidos na semana</span>
        </div>

        <div class="dashboard-card">
          <div class="icon">📚</div>
          <strong>${totalExtras}</strong>
          <span>Capítulos extras lidos na semana</span>
        </div>
      </div>
    </section>

    <section class="card">
      <div class="card-header">
        <div>
          <h3>Ranking</h3>
          <p>Ordenado pela pontuação da semana atual.</p>
        </div>
      </div>

      <div class="item-list">
        ${linhas}
      </div>
    </section>
  `;
}
