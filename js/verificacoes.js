import {
  listarMembros,
  listarObras,
  buscarGrade,
  buscarVerificacaoDia,
  salvarVerificacaoDia
} from "./data.js";

import {
  DIAS_SEMANA,
  STATUS_LEITURA,
  STATUS_QUE_CONTAM_LEITURA,
  SEM_OBRA_ID
} from "./config.js";

import {
  escapeHTML,
  mostrarToast,
  normalizarTexto
} from "./utils.js";

function isSemObraId(obraId) {
  return !obraId || obraId === SEM_OBRA_ID || obraId === "__SEM_OBRA__";
}

function getObraPorId(obras, obraId) {
  if (isSemObraId(obraId)) {
    return null;
  }

  return obras.find(obra => obra.id === obraId) || null;
}

function isObraDoProprioMembro(obra, membroId) {
  return Boolean(obra && obra.membroId === membroId);
}

function getStatusRegistro(registro, numeroObra) {
  return registro?.[`obra${numeroObra}`] || "";
}

function getFeedbackRegistro(registro, numeroObra) {
  return Boolean(registro?.[`feedback${numeroObra}`]);
}

function getExtraAtivoRegistro(registro, numeroObra) {
  return Boolean(registro?.[`extra${numeroObra}`]);
}

function getExtraQtdRegistro(registro, numeroObra) {
  const valor = Number(registro?.[`extraQtd${numeroObra}`] || 1);

  if (!Number.isFinite(valor) || valor < 1) {
    return 1;
  }

  return valor;
}

function getLeituraLunarRegistro(registro) {
  return Boolean(registro?.leituraLunar);
}

function getPontosAdicionaisRegistro(registro) {
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

function statusOptions(statusAtual = "") {
  return STATUS_LEITURA.map(status => `
    <option value="${escapeHTML(status.emoji)}" ${statusAtual === status.emoji ? "selected" : ""}>
      ${status.emoji ? `${status.emoji} ` : ""}${escapeHTML(status.label)}
    </option>
  `).join("");
}

function aplicarTravasObraPropria(registro, membroId, obra1, obra2) {
  const novoRegistro = {
    ...registro
  };

  if (isObraDoProprioMembro(obra1, membroId)) {
    novoRegistro.obra1 = "✨";
    novoRegistro.feedback1 = false;
    novoRegistro.extra1 = false;
    novoRegistro.extraQtd1 = 1;
  }

  if (isObraDoProprioMembro(obra2, membroId)) {
    novoRegistro.obra2 = "✨";
    novoRegistro.feedback2 = false;
    novoRegistro.extra2 = false;
    novoRegistro.extraQtd2 = 1;
  }

  return novoRegistro;
}

function calcularPontosMembro({ registro, gradeDia, obras, membroId }) {
  const obra1 = getObraPorId(obras, gradeDia?.obra1);
  const obra2 = getObraPorId(obras, gradeDia?.obra2);

  const registroComTravas = aplicarTravasObraPropria(registro, membroId, obra1, obra2);

  const slots = [
    {
      numero: 1,
      obra: obra1,
      status: getStatusRegistro(registroComTravas, 1)
    },
    {
      numero: 2,
      obra: obra2,
      status: getStatusRegistro(registroComTravas, 2)
    }
  ];

  const obrasObrigatorias = slots.filter(slot => {
    return Boolean(slot.obra);
  });
  const pontosAdicionais = getPontosAdicionaisRegistro(registroComTravas);

  if (!obrasObrigatorias.length) {
    return pontosAdicionais;
  }

  const cumpriuTodas = obrasObrigatorias.every(slot => statusContaLeitura(slot.status));

  if (!cumpriuTodas) {
    return pontosAdicionais;
  }

  let pontos = 0;

  obrasObrigatorias.forEach(slot => {
    const ehObraPropria = isObraDoProprioMembro(slot.obra, membroId);

    pontos += 5;

    if (ehObraPropria) {
      return;
    }

    if (statusPermiteFeedbackEExtra(slot.status)) {
      if (getFeedbackRegistro(registroComTravas, slot.numero)) {
        pontos += 20;
      }

      if (getExtraAtivoRegistro(registroComTravas, slot.numero)) {
        pontos += getExtraQtdRegistro(registroComTravas, slot.numero) * 5;
      }
    }
  });

  return pontos + pontosAdicionais;
}

function montarCardObra({ numero, obra, registro, membroId }) {
  const obraPropria = isObraDoProprioMembro(obra, membroId);

  const status = obraPropria ? "✨" : getStatusRegistro(registro, numero);
  const feedbackMarcado = obraPropria ? false : getFeedbackRegistro(registro, numero);
  const extraMarcado = obraPropria ? false : getExtraAtivoRegistro(registro, numero);
  const extraQtd = obraPropria ? 1 : getExtraQtdRegistro(registro, numero);
  const podeFeedbackEExtra = !obraPropria && statusPermiteFeedbackEExtra(status);

  if (!obra) {
    return `
      <div class="check-slot">
        <h5>Obra ${String(numero).padStart(2, "0")}</h5>
        <p>⏳ Sem obra cadastrada para este campo.</p>

        <input type="hidden" data-field="obra${numero}" value="⏳" />
      </div>
    `;
  }

  return `
    <div class="check-slot">
      <h5>Obra ${String(numero).padStart(2, "0")}</h5>
      <p>${escapeHTML(obra.titulo || "Obra sem título")}</p>

      ${
        obraPropria
          ? `<p class="muted">✨ Obra do próprio membro. Status travado automaticamente e vale 5 pontos ao salvar a verificação.</p>`
          : ""
      }

      <div class="form-row">
        <label>Status da leitura</label>
        <select data-field="obra${numero}" ${obraPropria ? "disabled" : ""}>
          ${statusOptions(status)}
        </select>

        ${
          obraPropria
            ? `<input type="hidden" data-field="obra${numero}" value="✨" />`
            : ""
        }
      </div>

      <label class="checkbox-row">
        <input
          type="checkbox"
          data-field="feedback${numero}"
          ${feedbackMarcado ? "checked" : ""}
          ${podeFeedbackEExtra ? "" : "disabled"}
        />
        Feedback entregue nesta obra
      </label>

      <label class="checkbox-row">
        <input
          type="checkbox"
          data-field="extra${numero}"
          ${extraMarcado ? "checked" : ""}
          ${podeFeedbackEExtra ? "" : "disabled"}
        />
        Teve capítulo extra nesta obra
      </label>

      <div class="form-row">
        <label>Quantidade de capítulos extras</label>
        <input
          type="number"
          min="1"
          step="1"
          data-field="extraQtd${numero}"
          value="${extraQtd}"
          ${extraMarcado && podeFeedbackEExtra ? "" : "disabled"}
        />
      </div>

      <div class="note-warning" data-warning="obra${numero}">
        ${
          obraPropria
            ? "Obra do próprio membro: vale 5 pontos, mas feedback e extra ficam bloqueados."
            : podeFeedbackEExtra
              ? ""
              : "Feedback e extra só contam quando o status for 🌙 Leu."
        }
      </div>
    </div>
  `;
}

function montarCardMembro({ membro, registro, obra1, obra2, pontos }) {
  const registroComTravas = aplicarTravasObraPropria(registro, membro.id, obra1, obra2);
  const leituraLunarMarcada = getLeituraLunarRegistro(registroComTravas);
  const pontosAdicionais = getPontosAdicionaisRegistro(registroComTravas);

  return `
    <article class="member-check-card" data-member-card="${membro.id}">
      <div class="member-check-header">
        <div>
          <h4>${escapeHTML(membro.nome || "")}</h4>
          <p>${escapeHTML(membro.user || "")} • Semana ${Number(membro.semana || 0)}</p>
        </div>

        <div class="points-pill">
          <small>Pontos</small>
          <strong data-pontos-membro="${membro.id}">${pontos}</strong>
        </div>
      </div>

      <label class="checkbox-row" style="margin-bottom: 14px;">
        <input
          type="checkbox"
          data-field="leituraLunar"
          ${leituraLunarMarcada ? "checked" : ""}
        />
        🌌 Fez Leitura Lunar da semana
      </label>

      <div class="form-row" style="margin-bottom: 14px;">
        <label>Pontos adicionais</label>
        <input
          type="number"
          min="0"
          step="1"
          data-field="pontosAdicionais"
          value="${pontosAdicionais}"
          placeholder="0"
        />
      </div>

      <div class="check-columns">
        ${montarCardObra({ numero: 1, obra: obra1, registro: registroComTravas, membroId: membro.id })}
        ${montarCardObra({ numero: 2, obra: obra2, registro: registroComTravas, membroId: membro.id })}
      </div>
    </article>
  `;
}

function coletarRegistroDoCard(card) {
  const registro = {};

  card.querySelectorAll("[data-field]").forEach(campo => {
    const nomeCampo = campo.dataset.field;

    if (campo.type === "checkbox") {
      registro[nomeCampo] = campo.checked;
      return;
    }

    if (campo.type === "number") {
      registro[nomeCampo] = Number(campo.value || (nomeCampo === "pontosAdicionais" ? 0 : 1));
      return;
    }

    registro[nomeCampo] = campo.value;
  });

  [1, 2].forEach(numero => {
    const status = registro[`obra${numero}`];

    if (!statusPermiteFeedbackEExtra(status)) {
      registro[`feedback${numero}`] = false;
      registro[`extra${numero}`] = false;
      registro[`extraQtd${numero}`] = 1;
    }

    if (registro[`extra${numero}`] && (!registro[`extraQtd${numero}`] || registro[`extraQtd${numero}`] < 1)) {
      registro[`extraQtd${numero}`] = 1;
    }
  });

  if (!Number.isFinite(registro.pontosAdicionais) || registro.pontosAdicionais < 0) {
    registro.pontosAdicionais = 0;
  }

  registro.pontosAdicionais = Math.floor(registro.pontosAdicionais);

  return registro;
}

function atualizarEstadoCard({ card, gradeDia, obras, obra1, obra2 }) {
  const membroId = card.dataset.memberCard;

  const registro = aplicarTravasObraPropria(
    coletarRegistroDoCard(card),
    membroId,
    obra1,
    obra2
  );

  [1, 2].forEach(numero => {
    const obra = numero === 1 ? obra1 : obra2;
    const obraPropria = isObraDoProprioMembro(obra, membroId);
    const status = registro[`obra${numero}`];
    const podeFeedbackEExtra = !obraPropria && statusPermiteFeedbackEExtra(status);

    const select = card.querySelector(`select[data-field="obra${numero}"]`);
    const feedback = card.querySelector(`[data-field="feedback${numero}"]`);
    const extra = card.querySelector(`[data-field="extra${numero}"]`);
    const extraQtd = card.querySelector(`[data-field="extraQtd${numero}"]`);
    const warning = card.querySelector(`[data-warning="obra${numero}"]`);

    if (select && obraPropria) {
      select.value = "✨";
      select.disabled = true;
    }

    if (feedback) {
      feedback.disabled = !podeFeedbackEExtra;

      if (!podeFeedbackEExtra) {
        feedback.checked = false;
      }
    }

    if (extra) {
      extra.disabled = !podeFeedbackEExtra;

      if (!podeFeedbackEExtra) {
        extra.checked = false;
      }
    }

    if (extraQtd) {
      extraQtd.disabled = !podeFeedbackEExtra || !extra?.checked;

      if (!extraQtd.value || Number(extraQtd.value) < 1) {
        extraQtd.value = 1;
      }
    }

    if (warning) {
      warning.textContent = obraPropria
        ? "Obra do próprio membro: vale 5 pontos, mas feedback e extra ficam bloqueados."
        : podeFeedbackEExtra
          ? ""
          : "Feedback e extra só contam quando o status for 🌙 Leu.";
    }
  });

  const pontos = calcularPontosMembro({
    registro: coletarRegistroDoCard(card),
    gradeDia,
    obras,
    membroId
  });

  const pontosEl = card.querySelector("[data-pontos-membro]");

  if (pontosEl) {
    pontosEl.textContent = String(pontos);
  }
}

function filtrarCardsMembros(termo) {
  const busca = normalizarTexto(termo);

  document.querySelectorAll("[data-member-card]").forEach(card => {
    const texto = normalizarTexto(card.textContent || "");
    card.style.display = !busca || texto.includes(busca) ? "" : "none";
  });
}

export async function renderVerificacoesPage(context) {
  const { state, setSubtitle } = context;

  setSubtitle("Marque leituras, feedbacks, extras e Leitura Lunar semanal.");

  const view = document.getElementById("view");

  const [membros, obras, grade] = await Promise.all([
    listarMembros(state.subId),
    listarObras(state.subId),
    buscarGrade(state.subId)
  ]);

  const diaAtual = localStorage.getItem(`verificacao_lunar_dia_${state.subId}`) || DIAS_SEMANA[0];
  const verificacaoSalva = await buscarVerificacaoDia(state.subId, diaAtual);
  const gradeDia = grade?.[diaAtual] || {};

  const obra1 = getObraPorId(obras, gradeDia.obra1);
  const obra2 = getObraPorId(obras, gradeDia.obra2);

  const cards = membros.length
    ? membros.map(membro => {
      const registroOriginal = verificacaoSalva?.membros?.[membro.id] || {};
      const registro = aplicarTravasObraPropria(registroOriginal, membro.id, obra1, obra2);

      const pontos = calcularPontosMembro({
        registro,
        gradeDia,
        obras,
        membroId: membro.id
      });

      return montarCardMembro({
        membro,
        registro,
        obra1,
        obra2,
        pontos
      });
    }).join("")
    : `
      <div class="empty-state">
        Nenhum membro cadastrado neste sub.
      </div>
    `;

  view.innerHTML = `
    <section class="card">
      <div class="card-header">
        <div>
          <h3>📜 Verificações</h3>
          <p>Escolha o dia, marque os status e salve. Obras do próprio membro ficam travadas automaticamente como ✨ e entram na ficha apenas depois de salvar a verificação.</p>
        </div>
      </div>

      <div class="grid grid-2">
        <div class="form-row">
          <label for="diaVerificacao">Dia da verificação</label>
          <select id="diaVerificacao">
            ${DIAS_SEMANA.map(dia => `
              <option value="${dia}" ${dia === diaAtual ? "selected" : ""}>${dia}</option>
            `).join("")}
          </select>
        </div>

        <div class="form-row">
          <label for="buscaMembroVerificacao">Buscar membro</label>
          <input
            id="buscaMembroVerificacao"
            type="search"
            placeholder="Digite nome ou user..."
          />
        </div>
      </div>
    </section>

    <section class="card">
      <div class="card-header">
        <div>
          <h3>Obras do dia</h3>
          <p>
            Obra 01: ${obra1 ? escapeHTML(obra1.titulo || "") : "⏳ Sem obra"}
            <br />
            Obra 02: ${obra2 ? escapeHTML(obra2.titulo || "") : "⏳ Sem obra"}
          </p>
        </div>

        <button class="btn" type="button" id="salvarVerificacaoButton">Salvar verificação</button>
      </div>

      <div class="item-list" id="listaVerificacaoMembros">
        ${cards}
      </div>

      <div class="form-actions">
        <button class="btn" type="button" id="salvarVerificacaoButtonBottom">Salvar verificação</button>
      </div>
    </section>
  `;

  document.getElementById("diaVerificacao")?.addEventListener("change", event => {
    localStorage.setItem(`verificacao_lunar_dia_${state.subId}`, event.target.value);
    renderVerificacoesPage(context);
  });

  document.getElementById("buscaMembroVerificacao")?.addEventListener("input", event => {
    filtrarCardsMembros(event.target.value);
  });

  document.querySelectorAll("[data-member-card]").forEach(card => {
    card.addEventListener("change", () => {
      atualizarEstadoCard({
        card,
        gradeDia,
        obras,
        obra1,
        obra2
      });
    });

    card.addEventListener("input", () => {
      atualizarEstadoCard({
        card,
        gradeDia,
        obras,
        obra1,
        obra2
      });
    });

    atualizarEstadoCard({
      card,
      gradeDia,
      obras,
      obra1,
      obra2
    });
  });

  async function salvar() {
    const dadosMembros = {};

    document.querySelectorAll("[data-member-card]").forEach(card => {
      const membroId = card.dataset.memberCard;

      const registro = aplicarTravasObraPropria(
        coletarRegistroDoCard(card),
        membroId,
        obra1,
        obra2
      );

      dadosMembros[membroId] = registro;
    });

    try {
      await salvarVerificacaoDia(state.subId, diaAtual, {
        membros: dadosMembros
      });

      mostrarToast("Verificação salva.");
    } catch (error) {
      console.error(error);
      mostrarToast("Erro ao salvar verificação.");
    }
  }

  document.getElementById("salvarVerificacaoButton")?.addEventListener("click", salvar);
  document.getElementById("salvarVerificacaoButtonBottom")?.addEventListener("click", salvar);
}
