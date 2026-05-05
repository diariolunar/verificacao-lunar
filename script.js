function carregarComponente(id, arquivo) {
  fetch(arquivo)
    .then(res => res.text())
    .then(data => {
      document.getElementById(id).innerHTML = data;
    })
    .catch(() => {
      document.getElementById(id).innerHTML = "Erro ao carregar";
    });
}

// Carregar header e footer
carregarComponente("header", "header.html");
carregarComponente("footer", "footer.html");
