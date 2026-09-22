import {
  listarMembros,
  listarVerificacoes,
  buscarVerificacaoSemanal
} from "./data.js";

import { DIAS_SEMANA, STATUS_QUE_CONTAM_LEITURA } from "./config.js";

import {
  copiarTexto,
  diasComVerificacao,
  escapeHTML,
  mostrarToast,
  repetirCheck
} from "./utils.js";

import {
  getModelosDoSub,
  renderTemplate,
  limparLinhasVazias
} from "./templates.js";

function membroAtivo(membro) {
  return membro?.ativo !== false;
}

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

function statusNaoLeu(status) {
  return status === "☠";
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
    return 0;
  }

  const pendenciasSemPenalidade = obrigatorias.filter(item => {
    return !statusContaLeitura(item.status) && !statusNaoLeu(item.status);
  });
  const penalidadeNaoLeu = obrigatorias.filter(item => statusNaoLeu(item.status)).length * 20;

  if (pendenciasSemPenalidade.length) {
    return -penalidadeNaoLeu;
  }

  let pontos = -penalidadeNaoLeu;

  obrigatorias.forEach(item => {
    if (statusNaoLeu(item.status)) {
      return;
    }

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

function getAtividadesSemanaisMembro(membroId, verificacoes, verificacaoSemanal) {
  const registroSemanal = verificacaoSemanal?.membros?.[membroId];

  if (registroSemanal) {
    return {
      leituraLunar: Boolean(registroSemanal.leituraLunar),
      chuvaEstrelas: Boolean(registroSemanal.chuvaEstrelas)
    };
  }

  return {
    leituraLunar: DIAS_SEMANA.some(dia => {
      return Boolean(verificacoes?.[dia]?.membros?.[membroId]?.leituraLunar);
    }),
    chuvaEstrelas: false
  };
}

function montarDadosMembro(membro, verificacoes, verificacaoSemanal) {
  let pontos = 0;
  let feedbacks = 0;
  let extras = 0;
  const atividadesSemanais = getAtividadesSemanaisMembro(
    membro.id,
    verificacoes,
    verificacaoSemanal
  );

  const obra1 = [];
  const obra2 = [];

  DIAS_SEMANA.forEach(dia => {
    const registro = verificacoes?.[dia]?.membros?.[membro.id];

    if (!registro) return;

    const status1 = getStatus(registro, 1);
    const status2 = getStatus(registro, 2);

    if (status1) obra1.push(status1);
    if (status2) obra2.push(status2);

    pontos += calcularPontosDia(registro);

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

  });

  return {
    nome: membro.nome || "",
    user: membro.user || "",
    semana: Number(membro.semana || 0),
    dias: diasComVerificacao(verificacoes),
    pontos,
    feedbacks: repetirCheck(feedbacks),
    extras: repetirCheck(extras),
    leituraLunar: atividadesSemanais.leituraLunar ? "✅" : "",
    chuvaEstrelas: atividadesSemanais.chuvaEstrelas ? "✅" : "",
    obra1: obra1.join(""),
    obra2: obra2.join("")
  };
}

function normalizarLinhaParaBusca(linha) {
  return String(linha || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function contemLabelLeituraLunar(linha) {
  const texto = normalizarLinhaParaBusca(linha);

  return texto.includes("leitura lunar");
}

function contemLabelChuvaEstrelas(linha) {
  const texto = normalizarLinhaParaBusca(linha);

  return texto.includes("chuva de estrelas");
}

function inserirLeituraLunarNoBloco(bloco, leituraLunar) {
  const valor = leituraLunar || "";

  if (bloco.includes("{{leituraLunar}}")) {
    return bloco.replaceAll("{{leituraLunar}}", valor);
  }

  const linhas = bloco.split("\n");

  if (!linhas.some(contemLabelLeituraLunar)) {
    return `${bloco}\n🌌 Leitura Lunar: ${valor}`.trimEnd();
  }

  if (!valor) {
    return bloco;
  }

  return linhas
    .map(linha => {
      if (!contemLabelLeituraLunar(linha)) {
        return linha;
      }

      const partes = linha.split(":");

      if (partes.length < 2) {
        return `${linha} ${valor}`.trimEnd();
      }

      const antes = partes.shift();
      const depois = partes.join(":").trim();

      if (depois) {
        return linha;
      }

      return `${antes}: ${valor}`;
    })
    .join("\n");
}

function inserirChuvaEstrelasNoBloco(bloco, chuvaEstrelas) {
  const linhas = bloco.split("\n");

  if (linhas.some(contemLabelChuvaEstrelas)) {
    return bloco;
  }

  const indiceLeituraLunar = linhas.findIndex(contemLabelLeituraLunar);
  const linhaChuva = `🌠 Chuva de Estrelas: ${chuvaEstrelas || ""}`.trimEnd();

  if (indiceLeituraLunar < 0) {
    return `${bloco}\n${linhaChuva}`;
  }

  linhas.splice(indiceLeituraLunar + 1, 0, linhaChuva);

  return linhas.join("\n");
}

function gerarFicha({ sub, membros, verificacoes, verificacaoSemanal }) {
  const modelos = getModelosDoSub(sub);
  const partes = [];

  partes.push(modelos.fichaCabecalho || "");

  membros.forEach(membro => {
    const dados = montarDadosMembro(membro, verificacoes, verificacaoSemanal);

    let bloco = renderTemplate(modelos.fichaMembro || "", dados);

    bloco = inserirLeituraLunarNoBloco(bloco, dados.leituraLunar);
    bloco = inserirChuvaEstrelasNoBloco(bloco, dados.chuvaEstrelas);

    partes.push(bloco);
  });

  partes.push(modelos.fichaRodape || "");

  return limparLinhasVazias(partes.filter(Boolean).join("\n\n"));
}

export async function renderFichaPage(context) {
  const { state, setSubtitle } = context;

  setSubtitle("Visualize e copie a ficha acumulada da semana.");

  const view = document.getElementById("view");

  const [membros, verificacoes, verificacaoSemanal] = await Promise.all([
    listarMembros(state.subId),
    listarVerificacoes(state.subId),
    buscarVerificacaoSemanal(state.subId)
  ]);
  const membrosAtivos = membros.filter(membroAtivo);

  const textoFicha = gerarFicha({
    sub: state.subConfig,
    membros: membrosAtivos,
    verificacoes,
    verificacaoSemanal
  });

  view.innerHTML = `
    <section class="card">
      <div class="card-header">
        <div>
          <h3>👁️ Visualizar Ficha</h3>
          <p>A ficha abaixo mostra somente a semana atual salva nas verificações.</p>
        </div>

        <button class="btn" type="button" id="copiarFichaButton">Copiar ficha</button>
      </div>

      <textarea readonly id="textoFicha">${escapeHTML(textoFicha)}</textarea>
    </section>
  `;

  document.getElementById("copiarFichaButton")?.addEventListener("click", async () => {
    try {
      await copiarTexto(textoFicha);
      mostrarToast("Ficha copiada.");
    } catch (error) {
      console.error(error);
      mostrarToast("Não foi possível copiar a ficha.");
    }
  });
}
