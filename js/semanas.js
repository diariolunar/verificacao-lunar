import {
  listarSubs,
  listarMembros,
  atualizarSemanaMembro,
  buscarConfigGeral,
  salvarConfigGeral
} from "./data.js";

import { mostrarToast } from "./utils.js";

function hojeEhDomingo() {
  const hoje = new Date();
  return hoje.getDay() === 0;
}

function dataLocalISO(date = new Date()) {
  const ano = date.getFullYear();
  const mes = String(date.getMonth() + 1).padStart(2, "0");
  const dia = String(date.getDate()).padStart(2, "0");

  return `${ano}-${mes}-${dia}`;
}

export async function atualizarSemanasGeralSeDomingo() {
  if (!hojeEhDomingo()) return;

  const hoje = dataLocalISO();
  const config = await buscarConfigGeral("semanas");

  if (config?.ultimaAtualizacaoSemanal === hoje) {
    return;
  }

  const subs = await listarSubs();

  let totalMembrosAtualizados = 0;
  let totalSubsAtualizados = 0;

  for (const sub of subs) {
    const membros = await listarMembros(sub.id);

    if (!membros.length) continue;

    totalSubsAtualizados++;

    for (const membro of membros) {
      const semanaAtual = Number(membro.semana || 0);
      await atualizarSemanaMembro(sub.id, membro.id, semanaAtual + 1);
      totalMembrosAtualizados++;
    }
  }

  await salvarConfigGeral("semanas", {
    ultimaAtualizacaoSemanal: hoje,
    totalMembrosAtualizados,
    totalSubsAtualizados
  });

  if (totalMembrosAtualizados > 0) {
    mostrarToast(`Semanas atualizadas: ${totalMembrosAtualizados} membros.`);
  }
}