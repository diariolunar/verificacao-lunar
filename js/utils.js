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

function criarOverlayModalExtra(id) {
  const antigo = document.getElementById(id);

  if (antigo) {
    antigo.remove();
  }

  const overlay = document.createElement("div");
  overlay.id = id;

  overlay.style.position = "fixed";
  overlay.style.inset = "0";
  overlay.style.zIndex = id === "confirmRoot" ? "500" : "450";
  overlay.style.display = "grid";
  overlay.style.placeItems = "center";
  overlay.style.padding = "18px";
  overlay.style.background = "rgba(5, 2, 10, 0.72)";
  overlay.style.backdropFilter = "blur(8px)";

  return overlay;
}

function criarCardModalExtra() {
  const card = document.createElement("section");

  card.style.width = "min(460px, 100%)";
  card.style.background = "#1b0f2f";
  card.style.border = "1px solid rgba(216, 198, 255, 0.18)";
  card.style.borderRadius = "22px";
  card.style.boxShadow = "0 35px 80px rgba(0, 0, 0, 0.45)";
  card.style.padding = "24px";
  card.style.color = "#f7f0ff";

  return card;
}

function criarBotaoModal(texto, tipo = "primary") {
  const button = document.createElement("button");

  button.type = "button";
  button.textContent = texto;

  button.style.minHeight = "42px";
  button.style.border = "0";
  button.style.borderRadius = "14px";
  button.style.padding = "10px 16px";
  button.style.fontWeight = "850";
  button.style.cursor = "pointer";

  if (tipo === "danger") {
    button.style.background = "#ef4444";
    button.style.color = "#ffffff";
  } else if (tipo === "secondary") {
    button.style.background = "rgba(255, 255, 255, 0.12)";
    button.style.color = "#f7f0ff";
  } else {
    button.style.background = "var(--accent, #7c3aed)";
    button.style.color = "#ffffff";
  }

  return button;
}

export function mostrarToast(mensagem) {
  abrirAviso("Aviso", mensagem);
}

export function abrirAviso(titulo, mensagem) {
  const overlay = criarOverlayModalExtra("alertRoot");
  const card = criarCardModalExtra();

  card.innerHTML = `
    <h3 style="margin:0 0 10px;font-size:1.25rem;">${escapeHTML(titulo)}</h3>
    <p style="margin:0;color:#c7b7dd;line-height:1.5;">${escapeHTML(mensagem)}</p>
  `;

  const actions = document.createElement("div");
  actions.style.display = "flex";
  actions.style.justifyContent = "flex-end";
  actions.style.gap = "10px";
  actions.style.marginTop = "22px";

  const okButton = criarBotaoModal("OK", "primary");

  okButton.addEventListener("click", () => {
    overlay.remove();
  });

  overlay.addEventListener("click", event => {
    if (event.target === overlay) {
      overlay.remove();
    }
  });

  actions.appendChild(okButton);
  card.appendChild(actions);
  overlay.appendChild(card);
  document.body.appendChild(overlay);

  setTimeout(() => okButton.focus(), 30);
}

export function confirmarAcao({
  titulo = "Confirmar ação",
  mensagem = "Tem certeza que deseja continuar?",
  confirmarTexto = "Confirmar",
  cancelarTexto = "Cancelar",
  perigo = false
} = {}) {
  return new Promise(resolve => {
    const overlay = criarOverlayModalExtra("confirmRoot");
    const card = criarCardModalExtra();

    card.innerHTML = `
      <h3 style="margin:0 0 10px;font-size:1.25rem;">${escapeHTML(titulo)}</h3>
      <p style="margin:0;color:#c7b7dd;line-height:1.5;">${escapeHTML(mensagem)}</p>
    `;

    const actions = document.createElement("div");
    actions.style.display = "flex";
    actions.style.justifyContent = "flex-end";
    actions.style.flexWrap = "wrap";
    actions.style.gap = "10px";
    actions.style.marginTop = "22px";

    const cancelarButton = criarBotaoModal(cancelarTexto, "secondary");
    const confirmarButton = criarBotaoModal(confirmarTexto, perigo ? "danger" : "primary");

    function fechar(resultado) {
      overlay.remove();
      resolve(resultado);
    }

    cancelarButton.addEventListener("click", () => fechar(false));
    confirmarButton.addEventListener("click", () => fechar(true));

    overlay.addEventListener("click", event => {
      if (event.target === overlay) {
        fechar(false);
      }
    });

    actions.appendChild(cancelarButton);
    actions.appendChild(confirmarButton);
    card.appendChild(actions);
    overlay.appendChild(card);
    document.body.appendChild(overlay);

    setTimeout(() => cancelarButton.focus(), 30);
  });
}

async function confirmarFechamentoModal() {
  return confirmarAcao({
    titulo: "Sair sem salvar?",
    mensagem: "Você clicou fora do modal. Se sair agora, pode perder as informações preenchidas. Deseja fechar mesmo assim?",
    confirmarTexto: "Sim, fechar",
    cancelarTexto: "Continuar editando",
    perigo: true
  });
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

  modalRoot.addEventListener("click", async event => {
    if (event.target === modalRoot) {
      const podeFechar = await confirmarFechamentoModal();

      if (podeFechar) {
        fecharModal();
      }
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

async function fecharModalComEsc(event) {
  if (event.key === "Escape") {
    const podeFechar = await confirmarFechamentoModal();

    if (podeFechar) {
      fecharModal();
    }
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