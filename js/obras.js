import {
  listarMembros,
  listarObras,
  criarObra,
  atualizarObra,
  excluirObra
} from "./data.js";

import {
  abrirModal,
  fecharModal,
  escapeHTML,
  mostrarToast,
  confirmarAcao
} from "./utils.js";

function membroAtivo(membro) {
  return membro?.ativo !== false;
}

function obraTemAlternativa(obra) {
  return Boolean(
    obra?.alternativaTitulo
    || obra?.alternativaLink
    || obra?.alternativaIsPoesia
    || obra?.alternativaCapitulosMais4100
    || obra?.alternativaCapitulosMenos500
    || obra?.alternativaPrologoMais1000
    || obra?.alternativaObservacoes
  );
}

function getMembrosParaFormulario(membros, obra) {
  const membrosAtivos = membros.filter(membroAtivo);

  if (!obra?.membroId || membrosAtivos.some(membro => membro.id === obra.membroId)) {
    return membrosAtivos;
  }

  const membroAtual = membros.find(membro => membro.id === obra.membroId);

  return membroAtual ? [...membrosAtivos, membroAtual] : membrosAtivos;
}

export async function renderObrasPage(context) {
  const { state, setSubtitle, refresh } = context;

  setSubtitle("Cadastro e edicao de obras.");

  const view = document.getElementById("view");

  const [membros, obras] = await Promise.all([
    listarMembros(state.subId),
    listarObras(state.subId)
  ]);

  const membrosMap = new Map(membros.map(membro => [membro.id, membro]));
  const membrosAtivos = membros.filter(membroAtivo);

  const listaHTML = obras.length
    ? obras.map(obra => {
      const membro = membrosMap.get(obra.membroId);

      return `
        <article class="item-card">
          <div>
            <h4>${escapeHTML(obra.titulo || "")}</h4>
            <p>Autor: ${escapeHTML(membro?.nome || "Membro nao encontrado")} ${membro?.user ? `- ${escapeHTML(membro.user)}` : ""}</p>
            ${membro && !membroAtivo(membro) ? `<p><span class="badge">Autor desativado</span></p>` : ""}
            <p>Link: ${obra.link ? escapeHTML(obra.link) : "Nao informado"}</p>
            <p>Tipo: ${obra.isPoesia ? "Poesia" : "Obra normal"}</p>

            ${
              obra.capitulosMais4100 || obra.capitulosMenos500 || obra.prologoMais1000
                ? `<p>Obs.: ${obra.prologoMais1000 ? "Prologo +1k. " : ""}${obra.capitulosMais4100 ? `+4,1k: ${escapeHTML(obra.capitulosMais4100)}. ` : ""}${obra.capitulosMenos500 ? `-500: ${escapeHTML(obra.capitulosMenos500)}.` : ""}</p>`
                : ""
            }

            ${
              obraTemAlternativa(obra)
                ? `<p>Extra: ${escapeHTML(obra.alternativaTitulo || "Obra adicional")} ${obra.alternativaIsPoesia ? "- Poesia" : "- Obra normal"}</p>`
                : ""
            }
          </div>

          <div class="item-actions">
            <button class="btn secondary" type="button" data-editar-obra="${obra.id}">Editar</button>
            <button class="btn danger" type="button" data-excluir-obra="${obra.id}">Excluir</button>
          </div>
        </article>
      `;
    }).join("")
    : `
      <div class="empty-state">
        Nenhuma obra cadastrada ainda.
      </div>
    `;

  view.innerHTML = `
    <section class="card">
      <div class="card-header">
        <div>
          <h3>📚 Obras</h3>
          <p>Cadastre obras, links, tipo de leitura e observacoes fixas usadas automaticamente na grade.</p>
        </div>

        <button class="btn" type="button" id="novaObraButton" ${membrosAtivos.length ? "" : "disabled"}>+ Nova Obra</button>
      </div>

      ${membrosAtivos.length ? "" : `
        <div class="empty-state" style="margin-bottom: 16px;">
          Cadastre ou reative pelo menos um membro antes de cadastrar novas obras.
        </div>
      `}

      <div class="item-list">
        ${listaHTML}
      </div>
    </section>
  `;

  document.getElementById("novaObraButton")?.addEventListener("click", () => {
    abrirFormularioObra({
      state,
      refresh,
      membros: membrosAtivos,
      obra: null
    });
  });

  document.querySelectorAll("[data-editar-obra]").forEach(button => {
    button.addEventListener("click", () => {
      const obraId = button.dataset.editarObra;
      const obra = obras.find(item => item.id === obraId);

      abrirFormularioObra({
        state,
        refresh,
        membros: getMembrosParaFormulario(membros, obra),
        obra
      });
    });
  });

  document.querySelectorAll("[data-excluir-obra]").forEach(button => {
    button.addEventListener("click", async () => {
      const obraId = button.dataset.excluirObra;
      const obra = obras.find(item => item.id === obraId);

      const confirmar = await confirmarAcao({
        titulo: "Excluir obra?",
        mensagem: `Tem certeza que deseja excluir a obra "${obra?.titulo || ""}"?`,
        confirmarTexto: "Sim, excluir",
        cancelarTexto: "Cancelar",
        perigo: true
      });

      if (!confirmar) return;

      try {
        await excluirObra(state.subId, obraId);
        mostrarToast("Obra excluida.");
        await refresh();
      } catch (error) {
        console.error(error);
        mostrarToast("Erro ao excluir obra. Veja o console.");
      }
    });
  });
}

function abrirFormularioObra({ state, refresh, membros, obra }) {
  const editando = Boolean(obra);
  const temAlternativa = obraTemAlternativa(obra);

  const opcoesMembros = membros.map(membro => `
    <option value="${membro.id}" ${obra?.membroId === membro.id ? "selected" : ""}>
      ${escapeHTML(membro.nome || "")} (${escapeHTML(membro.user || "")})${membroAtivo(membro) ? "" : " - desativado"}
    </option>
  `).join("");

  abrirModal(editando ? "Editar obra" : "Nova obra", `
    <form id="obraForm" class="grid">
      <div class="card" style="box-shadow:none;">
        <div class="card-header">
          <div>
            <h3>📖 Obra principal</h3>
            <p>Dados da obra que aparece na grade do dia.</p>
          </div>
        </div>

        <div class="grid grid-2">
          <div class="form-row">
            <label for="tituloObra">Nome da obra</label>
            <input
              id="tituloObra"
              type="text"
              placeholder="Ex: Sancta Corrupta"
              value="${escapeHTML(obra?.titulo || "")}"
            />
          </div>

          <div class="form-row">
            <label for="membroObra">Autor / membro responsavel</label>
            <select id="membroObra">
              <option value="">Selecione</option>
              ${opcoesMembros}
            </select>
          </div>
        </div>

        <div class="form-row">
          <label for="linkObra">Link da obra</label>
          <input
            id="linkObra"
            type="text"
            placeholder="https://www.wattpad.com/story/..."
            value="${escapeHTML(obra?.link || "")}"
          />
        </div>

        <label class="checkbox-row">
          <input
            id="isPoesia"
            type="checkbox"
            ${obra?.isPoesia ? "checked" : ""}
          />
          Esta obra e poesia
        </label>

        <div class="grid grid-2">
          <div class="form-row">
            <label for="capitulosMais4100">Capitulos com +4,1k palavras</label>
            <input
              id="capitulosMais4100"
              type="text"
              placeholder="Ex: 2, 10 e 11"
              value="${escapeHTML(obra?.capitulosMais4100 || "")}"
            />
          </div>

          <div class="form-row">
            <label for="capitulosMenos500">Capitulos com -500 palavras</label>
            <input
              id="capitulosMenos500"
              type="text"
              placeholder="Ex: Capitulo 5, Especial..."
              value="${escapeHTML(obra?.capitulosMenos500 || "")}"
            />
          </div>
        </div>

        <label class="checkbox-row">
          <input
            id="prologoMais1000"
            type="checkbox"
            ${obra?.prologoMais1000 ? "checked" : ""}
          />
          Prologo tem +1k palavras
        </label>

        <div class="form-row">
          <label for="observacoesObra">Observacoes extras da obra</label>
          <textarea
            id="observacoesObra"
            placeholder="Ex: contem gatilhos, especiais, capitulos especificos..."
          >${escapeHTML(obra?.observacoes || "")}</textarea>
        </div>
      </div>

      <div class="card" style="box-shadow:none;">
        <label class="checkbox-row" style="margin-bottom:0;">
          <input
            id="temObraAlternativa"
            type="checkbox"
            ${temAlternativa ? "checked" : ""}
          />
          Tem obra adicional para quem ja leu a principal
        </label>

        <div id="camposObraAlternativa" class="grid" style="${temAlternativa ? "" : "display:none;"} margin-top:18px;">
          <div class="card-header">
            <div>
              <h3>🌌 Obra extra / alternativa</h3>
              <p>Use quando existir uma obra para quem ja leu a principal.</p>
            </div>
          </div>

          <div class="grid grid-2">
            <div class="form-row">
              <label for="alternativaTitulo">Nome da obra extra</label>
              <input
                id="alternativaTitulo"
                type="text"
                placeholder="Ex: Nao e uma maldicao"
                value="${escapeHTML(obra?.alternativaTitulo || "")}"
              />
            </div>

            <div class="form-row">
              <label for="alternativaLink">Link da obra extra</label>
              <input
                id="alternativaLink"
                type="text"
                placeholder="https://www.wattpad.com/story/..."
                value="${escapeHTML(obra?.alternativaLink || "")}"
              />
            </div>
          </div>

          <label class="checkbox-row">
            <input
              id="alternativaIsPoesia"
              type="checkbox"
              ${obra?.alternativaIsPoesia ? "checked" : ""}
            />
            Esta obra extra e poesia
          </label>

          <div class="grid grid-2">
            <div class="form-row">
              <label for="alternativaCapitulosMais4100">Capitulos da obra extra com +4,1k palavras</label>
              <input
                id="alternativaCapitulosMais4100"
                type="text"
                placeholder="Ex: 2, 10 e 11"
                value="${escapeHTML(obra?.alternativaCapitulosMais4100 || "")}"
              />
            </div>

            <div class="form-row">
              <label for="alternativaCapitulosMenos500">Capitulos da obra extra com -500 palavras</label>
              <input
                id="alternativaCapitulosMenos500"
                type="text"
                placeholder="Ex: Capitulo 5, Especial..."
                value="${escapeHTML(obra?.alternativaCapitulosMenos500 || "")}"
              />
            </div>
          </div>

          <label class="checkbox-row">
            <input
              id="alternativaPrologoMais1000"
              type="checkbox"
              ${obra?.alternativaPrologoMais1000 ? "checked" : ""}
            />
            Prologo da obra extra tem +1k palavras
          </label>

          <div class="form-row">
            <label for="alternativaObservacoes">Observacoes da obra extra</label>
            <textarea
              id="alternativaObservacoes"
              placeholder="Observacoes especificas da obra extra..."
            >${escapeHTML(obra?.alternativaObservacoes || "")}</textarea>
          </div>
        </div>
      </div>

      <div class="form-actions">
        <button class="btn" type="submit">${editando ? "Salvar alteracoes" : "Cadastrar obra"}</button>
        <button class="btn secondary" type="button" id="cancelarObra">Cancelar</button>
      </div>
    </form>
  `);

  const cancelarButton = document.getElementById("cancelarObra");
  const form = document.getElementById("obraForm");
  const temAlternativaInput = document.getElementById("temObraAlternativa");
  const camposAlternativa = document.getElementById("camposObraAlternativa");

  if (cancelarButton) {
    cancelarButton.addEventListener("click", fecharModal);
  }

  if (temAlternativaInput && camposAlternativa) {
    temAlternativaInput.addEventListener("change", () => {
      camposAlternativa.style.display = temAlternativaInput.checked ? "" : "none";
    });
  }

  if (!form) {
    mostrarToast("Erro ao abrir formulario de obra.");
    return;
  }

  form.addEventListener("submit", async event => {
    event.preventDefault();

    const temObraAlternativa = document.getElementById("temObraAlternativa")?.checked || false;

    const dados = {
      titulo: document.getElementById("tituloObra")?.value.trim(),
      membroId: document.getElementById("membroObra")?.value,
      link: document.getElementById("linkObra")?.value.trim(),

      isPoesia: document.getElementById("isPoesia")?.checked || false,

      capitulosMais4100: document.getElementById("capitulosMais4100")?.value.trim(),
      capitulosMenos500: document.getElementById("capitulosMenos500")?.value.trim(),
      prologoMais1000: document.getElementById("prologoMais1000")?.checked || false,

      observacoes: document.getElementById("observacoesObra")?.value.trim(),

      alternativaTitulo: temObraAlternativa ? document.getElementById("alternativaTitulo")?.value.trim() : "",
      alternativaLink: temObraAlternativa ? document.getElementById("alternativaLink")?.value.trim() : "",

      alternativaIsPoesia: temObraAlternativa ? document.getElementById("alternativaIsPoesia")?.checked || false : false,
      alternativaCapitulosMais4100: temObraAlternativa ? document.getElementById("alternativaCapitulosMais4100")?.value.trim() : "",
      alternativaCapitulosMenos500: temObraAlternativa ? document.getElementById("alternativaCapitulosMenos500")?.value.trim() : "",
      alternativaPrologoMais1000: temObraAlternativa ? document.getElementById("alternativaPrologoMais1000")?.checked || false : false,

      alternativaObservacoes: temObraAlternativa ? document.getElementById("alternativaObservacoes")?.value.trim() : ""
    };

    if (!dados.titulo || !dados.membroId) {
      mostrarToast("Preencha o nome da obra e selecione o autor.");
      return;
    }

    try {
      if (editando) {
        await atualizarObra(state.subId, obra.id, dados);
        mostrarToast("Obra atualizada.");
      } else {
        await criarObra(state.subId, dados);
        mostrarToast("Obra cadastrada.");
      }

      fecharModal();
      await refresh();
    } catch (error) {
      console.error(error);
      mostrarToast("Erro ao salvar obra. Veja o console.");
    }
  });
}
