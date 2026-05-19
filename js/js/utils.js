import { DIAS_SEMANA, SEM_OBRA_ID, STATUS_QUE_CONTAM_LEITURA } from "./config.js";

export function escapeHTML(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function limparUser(user) {
  return String(user || "").replace(/^@/, "").trim();
}

export function withAt(user) {
  const clean = limparUser(user);
  return clean ? `@${clean}` : "";
}

export function gerarIdLocal() {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function getTodayISO() {
  return new Date().toISOString();
}

export function getSubAtual() {
  return localStorage.getItem("v2_sub_atual");
}

export function setSubAtual(subId) {
  localStorage.setItem("v2_sub_atual", subId);
}

export function limparSubAtual() {
  localStorage.removeItem("v2_sub_atual");
}

export function getRotaAtual() {
  return localStorage.getItem("v2_rota_atual") || "dashboard";
}

export function setRotaAtual(rota) {
  localStorage.setItem("v2_rota_atual", rota);
}

export function repetirCheck(qtd) {
  const total = Number(qtd || 0);
  if (total <= 0) return "";
  return "✅".repeat(total);
}

export function statusEhSemObra(status) {
  return status === "⏳";
}

export function statusContaComoLeitura(status) {
  return STATUS_QUE_CONTAM_LEITURA.includes(status);
}

export function leituraObrigatoriaValida(status) {
  if (statusEhSemObra(status)) return true;
  return statusContaComoLeitura(status);
}

export function existePeloMenosUmaObraObrigatoria(status1, status2) {
  return !statusEhSemObra(status1) || !statusEhSemObra(status2);
}

export function leiturasDoDiaValidas(status1, status2) {
  return (
    existePeloMenosUmaObraObrigatoria(status1, status2) &&
    leituraObrigatoriaValida(status1) &&
    leituraObrigatoriaValida(status2)
  );
}

export function calcularPontosDoDia(dados) {
  const obra1Status = dados.obra1Status || "";
  const obra2Status = dados.obra2Status || "⏳";

  const diaValido = leiturasDoDiaValidas(obra1Status, obra2Status);

  if (!diaValido) return 0;

  let pontos = 0;

  if (statusContaComoLeitura(obra1Status) && !statusEhSemObra(obra1Status)) {
    pontos += 5;
  }

  if (statusContaComoLeitura(obra2Status) && !statusEhSemObra(obra2Status)) {
    pontos += 5;
  }

  if (obra1Status === "🌙" && dados.obra1Feedback) {
    pontos += 20;
  }

  if (obra2Status === "🌙" && dados.obra2Feedback) {
    pontos += 20;
  }

  if (obra1Status === "🌙" && dados.obra1Extra) {
    pontos += Math.max(1, Number(dados.obra1ExtraQtd || 1)) * 5;
  }

  if (obra2Status === "🌙" && dados.obra2Extra) {
    pontos += Math.max(1, Number(dados.obra2ExtraQtd || 1)) * 5;
  }

  return pontos;
}

export function normalizarDiaMaiusculo(dia) {
  const mapa = {
    Segunda: "SEGUNDA-FEIRA",
    Terça: "TERÇA-FEIRA",
    Quarta: "QUARTA-FEIRA",
    Quinta: "QUINTA-FEIRA",
    Sexta: "SEXTA-FEIRA"
  };

  return mapa[dia] || String(dia || "").toUpperCase();
}

export function normalizarDiaTitulo(dia) {
  const mapa = {
    Segunda: "Segunda-Feira",
    Terça: "Terça-Feira",
    Quarta: "Quarta-Feira",
    Quinta: "Quinta-Feira",
    Sexta: "Sexta-Feira"
  };

  return mapa[dia] || dia;
}

export function numeroObra(numero) {
  return Number(numero) === 1 ? "01" : "02";
}

export function resolverObraDaGrade(id, obras) {
  if (!id || id === SEM_OBRA_ID) {
    return {
      id: SEM_OBRA_ID,
      titulo: "⏳ Sem Obra",
      link: "",
      membroId: "",
      semObra: true
    };
  }

  const obra = obras.find(item => item.id === id);

  if (!obra) {
    return {
      id: "",
      titulo: "Obra não encontrada",
      link: "",
      membroId: "",
      semObra: false
    };
  }

  return {
    ...obra,
    semObra: false
  };
}

export function ordenarPorCriacao(lista) {
  return [...lista].sort((a, b) => {
    return String(a.criadoEm || "").localeCompare(String(b.criadoEm || ""));
  });
}

export function textoBuscaMembro(membro) {
  return `${membro.nome || ""} ${membro.user || ""}`.toLowerCase();
}

export function traduzirEmojisTronoProfano(texto) {
  return String(texto || "")
    .replaceAll("☠", "☠️")
    .replaceAll("🌼", "📜")
    .replaceAll("⚰", "⚰️")
    .replaceAll("🧕🏻", "🕯️")
    .replaceAll("⚠", "⚠️");
}

export function traduzirEmojisMargens(texto) {
  return String(texto || "")
    .replaceAll("☠", "🌑")
    .replaceAll("🌼", "📜")
    .replaceAll("⚰", "🚪")
    .replaceAll("🧕🏻", "🧭")
    .replaceAll("⚠", "⚠️");
}

export function diasComVerificacao(verificacoes) {
  let total = 0;

  DIAS_SEMANA.forEach(dia => {
    if (verificacoes[dia]) total++;
  });

  return total;
}

export function ultimoDiaVerificado(verificacoes) {
  let ultimo = null;

  DIAS_SEMANA.forEach(dia => {
    if (verificacoes[dia]) ultimo = dia;
  });

  return ultimo;
}

export async function copiarTexto(texto) {
  await navigator.clipboard.writeText(texto);
}

export function mostrarToast(mensagem) {
  const antigo = document.querySelector(".toast");
  if (antigo) antigo.remove();

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = mensagem;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 2600);
}

export function abrirModal(titulo, conteudoHTML) {
  fecharModal();

  const modal = document.createElement("div");
  modal.className = "modal-backdrop";
  modal.id = "modalRoot";

  modal.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <h3>${escapeHTML(titulo)}</h3>
        <button class="modal-close" id="modalCloseButton">Fechar</button>
      </div>

      <div>
        ${conteudoHTML}
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  document.getElementById("modalCloseButton").addEventListener("click", fecharModal);

  modal.addEventListener("click", event => {
    if (event.target === modal) fecharModal();
  });
}

export function fecharModal() {
  const modal = document.getElementById("modalRoot");
  if (modal) modal.remove();
}