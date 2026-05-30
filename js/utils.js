export function getTodayISO() {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, "0");
  const dia = String(hoje.getDate()).padStart(2, "0");

  return `${ano}-${mes}-${dia}`;
}

export function escapeHTML(valor) {
  return String(valor ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function ordenarPorCriacao(lista) {
  return [...lista].sort((a, b) => {
    const dataA = String(a.criadoEm || "");
    const dataB = String(b.criadoEm || "");

    if (dataA && dataB && dataA !== dataB) {
      return dataA.localeCompare(dataB);
    }

    const nomeA = String(a.nome || a.titulo || a.user || "");
    const nomeB = String(b.nome || b.titulo || b.user || "");

    return nomeA.localeCompare(nomeB);
  });
}

export function mostrarToast(mensagem) {
  const toastAntigo = document.querySelector(".toast");

  if (toastAntigo) {
    toastAntigo.remove();
  }

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = mensagem;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3200);
}

export function abrirModal(titulo, conteudoHTML) {
  fecharModal();

  const modalRoot = document.createElement("div");
  modalRoot.id = "modalRoot";
  modalRoot.className = "modal-root";

  modalRoot.innerHTML = `
    <section class="modal-card" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
      <header class="modal-header">
        <h3 id="modalTitle">${escapeHTML(titulo)}</h3>
        <button class="modal-close" type="button" id="modalCloseButton" aria-label="Fechar modal">×</button>
      </header>

      <div class="modal-content">
        ${conteudoHTML}
      </div>
    </section>
  `;

  document.body.appendChild(modalRoot);
  document.body.classList.add("modal-open");

  const closeButton = document.getElementById("modalCloseButton");

  if (closeButton) {
    closeButton.addEventListener("click", fecharModal);
  }

  modalRoot.addEventListener("click", event => {
    if (event.target === modalRoot) {
      fecharModal();
    }
  });

  document.addEventListener("keydown", fecharModalComEsc);

  const primeiroCampo = modalRoot.querySelector("input, select, textarea");

  if (primeiroCampo) {
    setTimeout(() => primeiroCampo.focus(), 50);
  }
}

export function fecharModal() {
  const modalRoot = document.getElementById("modalRoot");

  if (modalRoot) {
    modalRoot.remove();
  }

  document.body.classList.remove("modal-open");
  document.removeEventListener("keydown", fecharModalComEsc);
}

function fecharModalComEsc(event) {
  if (event.key === "Escape") {
    fecharModal();
  }
}

export async function copiarTexto(texto) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(texto);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = texto;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  textarea.style.top = "-9999px";

  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
}

export function getSubAtual() {
  return localStorage.getItem("verificacao_lunar_sub_atual") || null;
}

export function setSubAtual(subId) {
  localStorage.setItem("verificacao_lunar_sub_atual", subId);
}

export function limparSubAtual() {
  localStorage.removeItem("verificacao_lunar_sub_atual");
}

export function getRotaAtual() {
  return localStorage.getItem("verificacao_lunar_rota_atual") || "dashboard";
}

export function setRotaAtual(rota) {
  localStorage.setItem("verificacao_lunar_rota_atual", rota);
}

export function limparRotaAtual() {
  localStorage.removeItem("verificacao_lunar_rota_atual");
}

export function limparUser(user) {
  return String(user || "").replace(/^@+/, "").trim();
}

export function repetirCheck(quantidade) {
  const total = Number(quantidade || 0);

  if (!total || total <= 0) {
    return "";
  }

  return "✅".repeat(total);
}

export function diasComVerificacao(verificacoes) {
  const ordem = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"];

  return ordem.filter(dia => {
    const verificacao = verificacoes?.[dia];

    if (!verificacao) return false;

    const membros = verificacao.membros || {};

    return Object.keys(membros).length > 0;
  }).length;
}

export function ultimoDiaVerificado(verificacoes) {
  const ordem = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"];

  let ultimo = null;

  ordem.forEach(dia => {
    const verificacao = verificacoes?.[dia];

    if (!verificacao) return;

    const membros = verificacao.membros || {};

    if (Object.keys(membros).length > 0) {
      ultimo = dia;
    }
  });

  return ultimo;
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

export function normalizarDiaMaiusculo(dia) {
  return normalizarDiaTitulo(dia).toUpperCase();
}

export function numeroObra(numero) {
  const valor = Number(numero || 1);

  if (valor === 1) return "01";
  if (valor === 2) return "02";

  return String(valor).padStart(2, "0");
}

export function formatarNumero(valor) {
  const numero = Number(valor || 0);

  if (!Number.isFinite(numero)) {
    return "0";
  }

  return String(numero);
}

export function apenasNumeros(valor) {
  return String(valor || "").replace(/\D/g, "");
}

export function normalizarTexto(valor) {
  return String(valor || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function filtrarPorBusca(lista, termo, campos = []) {
  const busca = normalizarTexto(termo);

  if (!busca) return lista;

  return lista.filter(item => {
    return campos.some(campo => {
      return normalizarTexto(item?.[campo]).includes(busca);
    });
  });
}

export function criarIdLocal(prefixo = "id") {
  return `${prefixo}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export function isMobileWidth() {
  return window.matchMedia("(max-width: 768px)").matches;
}

export function fecharMenuMobile() {
  document.body.classList.remove("menu-open");
}