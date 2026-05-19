import { DIAS_SEMANA, SEM_OBRA_ID } from "./config.js";

import {
  listarMembros,
  listarObras,
  buscarGrade,
  salvarGrade
} from "./data.js";

import { gerarGradeExportada } from "./exportar-grade.js";

import {
  abrirModal,
  copiarTexto,
  escapeHTML,
  mostrarToast
} from "./utils.js";

export async function renderGradePage(context) {
  const { state, setSubtitle, refresh } = context;

  setSubtitle("Montagem e exportação da grade semanal.");

  const view = document.getElementById("view");

  const [membros, obras, grade] = await Promise.all([
    listarMembros(state.subId),
    listarObras(state.subId),
    buscarGrade(state.subId)
  ]);

  if (!membros.length || !obras.length) {
    view.innerHTML = `
      <section class="card">
        <div class="card-header">
          <div>
            <h3>📅 Grade Semanal</h3>
            <p>Antes de montar a grade, cadastre membros e obras.</p>
          </div>
        </div>

        <div class="empty-state">
          ${!membros.length ? "Cadastre pelo menos um membro." : "Cadastre pelo menos uma obra."}
        </div>
      </section>
    `;

    return;
  }

  const obrasPorDia = Number(state.subConfig?.obrasPorDia || 2);

  const opcoesObras = obras.map(obra => `
    <option value="${obra.id}">${escapeHTML(obra.titulo)}</option>
  `).join("");

  const diasHTML = DIAS_SEMANA.map(dia => {
    const dadosDia = grade[dia] || {};

    return `
      <article class="grade-day">
        <h4>${dia}</h4>

        <div class="grade-columns ${obrasPorDia === 1 ? "grid-1" : ""}">
          <div class="grade-slot">
            <h5>Obra 01</h5>

            <label for="${dia}_obra1">Selecione a obra</label>
            <select id="${dia}_obra1">
              <option value="">Selecione</option>
              <option value="${SEM_OBRA_ID}">⏳ Sem Obra</option>
              ${opcoesObras}
            </select>
          </div>

          ${obrasPorDia === 2 ? `
            <div class="grade-slot">
              <h5>Obra 02</h5>

              <label for="${dia}_obra2">Selecione a obra</label>
              <select id="${dia}_obra2">
                <option value="">Selecione</option>
                <option value="${SEM_OBRA_ID}">⏳ Sem Obra</option>
                ${opcoesObras}
              </select>
            </div>
          ` : ""}
        </div>
      </article>
    `;
  }).join("");

  view.innerHTML = `
    <section class="card">
      <div class="card-header">
        <div>
          <h3>📅 Grade Semanal</h3>
          <p>Escolha as obras de segunda a sexta. As observações são puxadas automaticamente do cadastro da obra.</p>
        </div>
      </div>

      <div class="grid">
        ${diasHTML}
      </div>

      <div class="card" style="box-shadow:none; margin-top:18px;">
        <div class="card-header">
          <div>
            <h3>📤 Exportar grade</h3>
            <p>Você pode exportar a semana completa ou apenas um dia.</p>
          </div>
        </div>

        <div class="export-panel">
          <div class="form-row">
            <label for="diaExportar">Dia para exportar</label>
            <select id="diaExportar">
              ${DIAS_SEMANA.map(dia => `<option value="${dia}">${dia}</option>`).join("")}
            </select>
          </div>

          <button class="btn secondary" id="exportarDiaButton">Exportar dia</button>
          <button class="btn" id="exportarSemanaButton">Exportar semana</button>
        </div>
      </div>

      <div class="form-actions">
        <button class="btn" id="salvarGradeButton">Salvar Grade</button>
      </div>
    </section>
  `;

  DIAS_SEMANA.forEach(dia => {
    document.getElementById(`${dia}_obra1`).value = grade[dia]?.obra1 || "";

    if (obrasPorDia === 2) {
      document.getElementById(`${dia}_obra2`).value = grade[dia]?.obra2 || "";
    }
  });

  document.getElementById("salvarGradeButton").addEventListener("click", async () => {
    await salvarGradeDaTela(state.subId, obrasPorDia);
    mostrarToast("Grade salva.");
    await refresh();
  });

  document.getElementById("exportarDiaButton").addEventListener("click", async () => {
    const gradeAtual = await salvarGradeDaTela(state.subId, obrasPorDia);
    const dia = document.getElementById("diaExportar").value;

    const texto = await gerarGradeExportada({
      sub: state.subConfig,
      tipo: "dia",
      dia,
      grade: gradeAtual,
      obras,
      membros
    });

    abrirExportacao(`Grade de ${dia}`, texto);
  });

  document.getElementById("exportarSemanaButton").addEventListener("click", async () => {
    const gradeAtual = await salvarGradeDaTela(state.subId, obrasPorDia);

    const texto = await gerarGradeExportada({
      sub: state.subConfig,
      tipo: "semana",
      dia: null,
      grade: gradeAtual,
      obras,
      membros
    });

    abrirExportacao("Grade da semana", texto);
  });
}

async function salvarGradeDaTela(subId, obrasPorDia) {
  const novaGrade = {};

  DIAS_SEMANA.forEach(dia => {
    novaGrade[dia] = {
      obra1: document.getElementById(`${dia}_obra1`).value,
      obra2: obrasPorDia === 2
        ? document.getElementById(`${dia}_obra2`).value
        : SEM_OBRA_ID
    };
  });

  await salvarGrade(subId, novaGrade);

  return novaGrade;
}

function abrirExportacao(titulo, texto) {
  abrirModal(titulo, `
    <div class="grid">
      <textarea id="textoExportado" readonly>${escapeHTML(texto)}</textarea>

      <div class="form-actions">
        <button class="btn" id="copiarExportacaoButton">Copiar grade</button>
      </div>
    </div>
  `);

  document.getElementById("copiarExportacaoButton").addEventListener("click", async () => {
    const conteudo = document.getElementById("textoExportado").value;
    await copiarTexto(conteudo);
    mostrarToast("Grade copiada.");
  });
}
