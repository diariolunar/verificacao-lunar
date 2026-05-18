import { auth } from "../../firebase.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";

export function renderLogin(app) {
  app.innerHTML = `
    <div class="center-page">
      <form class="auth-card" id="loginForm">
        <h1>🌙 Verificação Lunar V2</h1>
        <p>Entre com o login do ADM para gerenciar os subs.</p>

        <div class="form-grid">
          <div class="form-row">
            <label for="email">E-mail</label>
            <input id="email" name="email" type="email" autocomplete="email" required />
          </div>

          <div class="form-row">
            <label for="senha">Senha</label>
            <input id="senha" name="senha" type="password" autocomplete="current-password" required />
          </div>

          <button type="submit">Entrar</button>
        </div>
      </form>
    </div>
  `;

  document.getElementById("loginForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      await signInWithEmailAndPassword(auth, form.get("email"), form.get("senha"));
    } catch (error) {
      alert("Erro ao entrar. Confira o e-mail e a senha.");
    }
  });
}
