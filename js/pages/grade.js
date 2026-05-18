import { diasSemana, SEM_OBRA_ID } from "../constants.js";
import { state } from "../state.js";
import { getGrade, listObras, saveGrade } from "../services/firestore.js";
import { escapeHTML, copyToClipboard } from "../utils.js";
import { exportarGradeDia, exportarGradeSemana } from "../exporters/gradeExport.js";

function optionList(obras, selected) {
  return `
    <option value="">Selecione</option>
    <option value="${SEM_OBRA_ID}" ${selected === SEM_OBRA_ID ? "selected" : ""}>⏳ Sem Obra</option>
    ${obras.map((obra) => `<option value="${obra.id}" ${selected === obra.id ? "selected" : ""}>${escapeHTML(obra.titulo)}</option>`).join("")}
  `;
}

function collectGrade() {
  const grade = {};
  diasSemana.forEach((dia) => {
    grade[dia] = {
      obra1: document.getElementById(`${dia}_obra1`).value,
      obra2: document.getElementById(`${dia}_obra2`).value
    };
  });
  return grade;
}

export async function renderGrade(app) {
  const [grade, obras] = await Promise.all([getGrade(state.sub), listObras(state.sub)]);

  if (!obras.length) {
    app.innerHTML = `
      <section class="panel">
        <h1>🗓️ Grade Semanal</h1>
        <div class="empty-state">Cadastre pelo menos uma obra antes de montar a grade.</div>
        <div class="toolbar"><button data-route="obras">Cadastrar obra</button></div>
      </section>
    `;
    app.querySelector("[data-route]").addEventListener("click", () => { location.hash = "obras"; });
    return;
  }

  app.innerHTML = `
    <section class="panel">
      <div class="panel-header">
        <div>
          <h1>🗓️ Grade Semanal</h1>
          <p class="panel-subtitle">Escolha as duas obras de cada dia. As regras de +4,1k, -500 e prólogo vêm do cadastro da obra.</p>
        </div>
      </div>

      <div class="notice">Use <strong>⏳ Sem Obra</strong> quando o dia tiver apenas uma obra.</div>

      <form id="gradeForm" class="form-grid">
        ${diasSemana.map((dia) => `
          <section class="grade-day">
            <h3>${dia}</h3>
            <div class="grade-row">
              <div class="grade-slot">
                <label>Obra 1</label>
                <select id="${dia}_obra1">${optionList(obras, grade[dia]?.obra1 || "")}</select>
              </div>
              <div class="grade-slot">
                <label>Obra 2</label>
                <select id="${dia}_obra2">${optionList(obras, grade[dia]?.obra2 || "")}</select>
              </div>
            </div>
          </section>
        `).join("")}

        <div class="toolbar">
          <button type="submit">Salvar Grade</button>
          <select id="diaExportar">
            ${diasSemana.map((dia) => `<option value="${dia}">${dia}</option>`).join("")}
          </select>
          <button type="button" class="secondary" id="exportDay">Exportar dia</button>
          <button type="button" class="secondary" id="exportWeek">Exportar semana</button>
        </div>
      </form>
    </section>
  `;

  app.querySelector("#gradeForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    await saveGrade(state.sub, collectGrade());
    alert("Grade salva com sucesso.");
  });

  app.querySelector("#exportWeek").addEventListener("click", async () => {
    const novaGrade = collectGrade();
    await saveGrade(state.sub, novaGrade);
    const texto = await exportarGradeSemana(novaGrade);
    renderExport(app, "Grade da Semana", texto);
  });

  app.querySelector("#exportDay").addEventListener("click", async () => {
    const novaGrade = collectGrade();
    await saveGrade(state.sub, novaGrade);
    const dia = document.getElementById("diaExportar").value;
    const texto = await exportarGradeDia(novaGrade, dia);
    renderExport(app, `Grade de ${dia}`, texto);
  });
}

function renderExport(app, titulo, texto) {
  app.innerHTML = `
    <section class="panel">
      <div class="panel-header">
        <div>
          <h1>${titulo}</h1>
          <p class="panel-subtitle">Confira e copie o texto exportado.</p>
        </div>
      </div>
      <textarea id="exportText" class="export-textarea" readonly>${escapeHTML(texto)}</textarea>
      <div class="toolbar">
        <button id="copyExport">Copiar grade</button>
        <button class="secondary" id="backGrade">Voltar para grade</button>
      </div>
    </section>
  `;
  app.querySelector("#copyExport").addEventListener("click", async () => {
    await copyToClipboard(document.getElementById("exportText").value);
    alert("Grade copiada.");
  });
  app.querySelector("#backGrade").addEventListener("click", () => renderGrade(app));
}
