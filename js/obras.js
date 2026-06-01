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

export async function renderObrasPage(context) {
  const { state, setSubtitle, refresh } = context;

  setSubtitle("Cadastro e edição de obras.");

  const view = document.getElementById("view");

  const [membros, obras] = await Promise.all([
    listarMembros(state.subId),
    listarObras(state.subId)
  ]);

  const membrosMap = new Map(membros.map(membro => [membro.id, membro]));

  const listaHTML = obras.length
    ? obras.map(obra => {
      const membro = membrosMap.get(obra.membroId);

      return `
        <article class="item-card">
          <div>
            <h4>${escapeHTML(obra.titulo || "")}</h4>
            <p>Autor: ${escapeHTML(membro?.nome || "Membro não encontrado")} ${membro?.user ? `• ${escapeHTML(membro.user)}` : ""}</p>
            <p>Link: ${obra.link ? escapeHTML(obra.link) : "Não informado"}</p>
            <p>Tipo: ${obra.isPoesia ? "Poesia" : "Obra normal"}</p>

            ${
              obra.capitulosMais4100 || obra.capitulosMenos500 || obra.prologoMais1000
                ? `<p>Obs.: ${obra.prologoMais1000 ? "Prólogo +1k. " : ""}${obra.capitulosMais4100 ? `+4,1k: ${escapeHTML(obra.capitulosMais4100)}. ` : ""}${obra.capitulosMenos500 ? `-500: ${escapeHTML(obra.capitulosMenos500)}.` : ""}</p>`
                : ""
            }

            ${
              obra.alternativaTitulo
                ? `<p>Extra: ${escapeHTML(obra.alternativaTitulo)} ${obra.alternativaIsPoesia ? "• Poesia" : "• Obra normal"}</p>`
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
          <p>Cadastre obras, links, tipo de leitura e observações fixas usadas automaticamente na grade.</p>
        </div>

        <button class="btn" type="button" id="novaObraButton" ${membros.length ? "" : "disabled"}>+ Nova Obra</button>
      </div>

      ${membros.length ? "" : `
        <div class="empty-state" style="margin-bottom: 16px;">
          Cadastre pelo menos um membro antes de cadastrar obras.
        </div>
      `}

      <div class="item-list">
        ${listaHTML}
      </div>
    </section>
  `;

  const novaObraButton = document.getElementById("novaObraButton");

  if (novaObraButton) {
    novaObraButton.addEventListener("click", () => {
      abrirFormularioObra({
        state,
        refresh,
        membros,
        obra: null
      });
    });
  }

  document.querySelectorAll("[data-editar-obra]").forEach(button => {
    button.addEventListener("click", () => {
      const obraId = button.dataset.editarObra;
      const obra = obras.find(item => item.id === obraId);

      abrirFormularioObra({
        state,
        refresh,
        membros,
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
        mostrarToast("Obra excluída.");
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

  const opcoesMembros = membros.map(membro => `
    <option value="${membro.id}" ${obra?.membroId === membro.id ? "selected" : ""}>
      ${escapeHTML(membro.nome || "")} (${escapeHTML(membro.user || "")})
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
            <label for="membroObra">Autor / membro responsável</label>
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
          Esta obra é poesia
        </label>

        <div class="grid grid-2">
          <div class="form-row">
            <label for="capitulosMais4100">Capítulos com +4,1k palavras</label>
            <input
              id="capitulosMais4100"
              type="text"
              placeholder="Ex: 2, 10 e 11"
              value="${escapeHTML(obra?.capitulosMais4100 || "")}"
            />
          </div>

          <div class="form-row">
            <label for="capitulosMenos500">Capítulos com -500 palavras</label>
            <input
              id="capitulosMenos500"
              type="text"
              placeholder="Ex: Capítulo 5, Especial..."
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
          Prólogo tem +1k palavras
        </label>

        <div class="form-row">
          <label for="observacoesObra">Observações extras da obra</label>
          <textarea
            id="observacoesObra"
            placeholder="Ex: contém gatilhos, especiais, capítulos específicos..."
          >${escapeHTML(obra?.observacoes || "")}</textarea>
        </div>
      </div>

      <div class="card" style="box-shadow:none;">
        <div class="card-header">
          <div>
            <h3>🌌 Obra extra / alternativa</h3>
            <p>Use quando existir uma obra para quem já leu a principal.</p>
          </div>
        </div>

        <div class="grid grid-2">
          <div class="form-row">
            <label for="alternativaTitulo">Nome da obra extra</label>
            <input
              id="alternativaTitulo"
              type="text"
              placeholder="Ex: Não é uma maldição"
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
          Esta obra extra é poesia
        </label>

        <div class="grid grid-2">
          <div class="form-row">
            <label for="alternativaCapitulosMais4100">Capítulos da obra extra com +4,1k palavras</label>
            <input
              id="alternativaCapitulosMais4100"
              type="text"
              placeholder="Ex: 2, 10 e 11"
              value="${escapeHTML(obra?.alternativaCapitulosMais4100 || "")}"
            />
          </div>

          <div class="form-row">
            <label for="alternativaCapitulosMenos500">Capítulos da obra extra com -500 palavras</label>
            <input
              id="alternativaCapitulosMenos500"
              type="text"
              placeholder="Ex: Capítulo 5, Especial..."
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
          Prólogo da obra extra tem +1k palavras
        </label>

        <div class="form-row">
          <label for="alternativaObservacoes">Observações da obra extra</label>
          <textarea
            id="alternativaObservacoes"
            placeholder="Observações específicas da obra extra..."
          >${escapeHTML(obra?.alternativaObservacoes || "")}</textarea>
        </div>
      </div>

      <div class="form-actions">
        <button class="btn" type="submit">${editando ? "Salvar alterações" : "Cadastrar obra"}</button>
        <button class="btn secondary" type="button" id="cancelarObra">Cancelar</button>
      </div>
    </form>
  `);

  const cancelarButton = document.getElementById("cancelarObra");
  const form = document.getElementById("obraForm");

  if (cancelarButton) {
    cancelarButton.addEventListener("click", fecharModal);
  }

  if (!form) {
    mostrarToast("Erro ao abrir formulário de obra.");
    return;
  }

  form.addEventListener("submit", async event => {
    event.preventDefault();

    const dados = {
      titulo: document.getElementById("tituloObra")?.value.trim(),
      membroId: document.getElementById("membroObra")?.value,
      link: document.getElementById("linkObra")?.value.trim(),

      isPoesia: document.getElementById("isPoesia")?.checked || false,

      capitulosMais4100: document.getElementById("capitulosMais4100")?.value.trim(),
      capitulosMenos500: document.getElementById("capitulosMenos500")?.value.trim(),
      prologoMais1000: document.getElementById("prologoMais1000")?.checked || false,

      observacoes: document.getElementById("observacoesObra")?.value.trim(),

      alternativaTitulo: document.getElementById("alternativaTitulo")?.value.trim(),
      alternativaLink: document.getElementById("alternativaLink")?.value.trim(),

      alternativaIsPoesia: document.getElementById("alternativaIsPoesia")?.checked || false,
      alternativaCapitulosMais4100: document.getElementById("alternativaCapitulosMais4100")?.value.trim(),
      alternativaCapitulosMenos500: document.getElementById("alternativaCapitulosMenos500")?.value.trim(),
      alternativaPrologoMais1000: document.getElementById("alternativaPrologoMais1000")?.checked || false,

      alternativaObservacoes: document.getElementById("alternativaObservacoes")?.value.trim()
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