import { gerarFicha } from "../exporters/fichaExport.js";
import { escapeHTML, copyToClipboard } from "../utils.js";

export async function renderFicha(app) {
  const texto = await gerarFicha();
  app.innerHTML = `
    <section class="panel">
      <div class="panel-header">
        <div>
          <h1>👁️ Visualizar Ficha</h1>
          <p class="panel-subtitle">Confira a ficha acumulada da semana antes de enviar.</p>
        </div>
      </div>

      <textarea id="fichaTexto" class="export-textarea" readonly>${escapeHTML(texto)}</textarea>

      <div class="toolbar">
        <button id="copyFicha">Copiar ficha</button>
      </div>
    </section>
  `;

  app.querySelector("#copyFicha").addEventListener("click", async () => {
    await copyToClipboard(document.getElementById("fichaTexto").value);
    alert("Ficha copiada.");
  });
}
