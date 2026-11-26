/* =========================================================
   GAMEHUB - script.js (compartilhado)
   Cada bloco só roda na página onde seus elementos existem.
   ========================================================= */

/* ---------------------------------------------------------
   LOGIN (index.html)
   --------------------------------------------------------- */
(function () {
  const form = document.getElementById('loginForm');
  if (!form) return; // não é a página de login

  // Página de destino após o login (a tela inicial do GameHub)
  const PAGINA_INICIAL = 'logado.html';

  const emailInput = document.getElementById('email');
  const senhaInput = document.getElementById('senha');
  const fieldEmail = document.getElementById('fieldEmail');
  const fieldPass = document.getElementById('fieldPass');
  const alertBox = document.getElementById('formAlert');
  const btn = document.getElementById('btnLogin');

  // Se já estiver logado, vai direto para a home
  try {
    if (localStorage.getItem('gamehub_session') || sessionStorage.getItem('gamehub_session')) {
      window.location.replace(PAGINA_INICIAL);
    }
  } catch (e) {}

  // Mostrar / ocultar senha
  document.getElementById('togglePass').addEventListener('click', function () {
    const show = senhaInput.type === 'password';
    senhaInput.type = show ? 'text' : 'password';
    this.textContent = show ? 'OCULTAR' : 'MOSTRAR';
  });

  function showAlert(msg) {
    alertBox.textContent = msg;
    alertBox.classList.add('show');
  }

  function validar() {
    let ok = true;
    alertBox.classList.remove('show');

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim());
    fieldEmail.classList.toggle('invalido', !emailOk);
    if (!emailOk) ok = false;

    const passOk = senhaInput.value.length >= 6;
    fieldPass.classList.toggle('invalido', !passOk);
    if (!passOk) ok = false;

    return ok;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validar()) return;

    btn.disabled = true;
    btn.textContent = 'Entrando...';

    /*
      DEMONSTRAÇÃO: aqui o login é simulado no navegador.
      Em um projeto real, envie e-mail e senha para o seu servidor
      (fetch/POST para sua API) e só salve a sessão se ele responder OK.
    */
    setTimeout(function () {
      const sessao = JSON.stringify({
        email: emailInput.value.trim(),
        logadoEm: new Date().toISOString()
      });

      try {
        const storage = document.getElementById('lembrar').checked ? localStorage : sessionStorage;
        storage.setItem('gamehub_session', sessao);
      } catch (err) {
        showAlert('Não foi possível iniciar a sessão neste navegador.');
        btn.disabled = false;
        btn.textContent = 'Entrar';
        return;
      }

      window.location.href = PAGINA_INICIAL;
    }, 600);
  });

  // Limpa o erro do campo ao digitar
  [emailInput, senhaInput].forEach(function (input) {
    input.addEventListener('input', function () {
      input.closest('.campo').classList.remove('invalido');
      alertBox.classList.remove('show');
    });
  });

  document.getElementById('esqueci').addEventListener('click', function (e) {
    e.preventDefault();
    showAlert('Recuperação de senha ainda não disponível.');
  });

  document.getElementById('criarConta').addEventListener('click', function (e) {
    e.preventDefault();
    showAlert('Cadastro ainda não disponível.');
  });
})();

/* ---------------------------------------------------------
   JOGOS (jogos.html) - filtro por categoria, ordenação e busca
   --------------------------------------------------------- */
(function () {
  const selCategoria = document.getElementById('filtroCategoria');
  const selOrdem = document.getElementById('ordenarJogos');
  const grid = document.querySelector('.grid');
  if (!selCategoria || !selOrdem || !grid) return; // não é a página de jogos

  const msgVazio = document.getElementById('semResultados');
  const campoBusca = document.querySelector('.search-form input[name="q"]');

  // Lê os dados de cada card uma única vez
  const jogos = Array.from(grid.querySelectorAll('.card')).map(function (el, i) {
    const m = el.querySelector('.rating').textContent.match(/\d+(\.\d+)?/);
    return {
      el: el,
      ordem: i, // ordem original = "mais populares"
      titulo: el.querySelector('h3').textContent.trim(),
      nota: m ? parseFloat(m[0]) : 0,
      tags: Array.from(el.querySelectorAll('.tag')).map(function (t) { return t.textContent.trim(); })
    };
  });

  function normalizar(txt) {
    return txt.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  }

  // Termo vindo da busca do cabeçalho (jogos.html?q=...)
  const termo = (new URLSearchParams(window.location.search).get('q') || '').trim();
  if (campoBusca) campoBusca.value = termo;

  function atualizar() {
    const categoria = normalizar(selCategoria.value);
    const ordem = selOrdem.value;
    const busca = normalizar(termo);

    const lista = jogos.filter(function (j) {
      const okCategoria = !categoria || j.tags.some(function (t) { return normalizar(t) === categoria; });
      const okBusca = !busca || normalizar(j.titulo).indexOf(busca) !== -1;
      return okCategoria && okBusca;
    });

    lista.sort(function (a, b) {
      if (ordem === 'avaliados') return b.nota - a.nota || a.ordem - b.ordem;
      if (ordem === 'alfabetica') return a.titulo.localeCompare(b.titulo, 'pt-BR', { sensitivity: 'base' });
      return a.ordem - b.ordem;
    });

    // Remonta o grid só com os jogos filtrados, na ordem escolhida
    while (grid.firstChild) grid.removeChild(grid.firstChild);
    lista.forEach(function (j) { grid.appendChild(j.el); });
    if (msgVazio) msgVazio.hidden = lista.length > 0;
  }

  selCategoria.addEventListener('change', atualizar);
  selOrdem.addEventListener('change', atualizar);
  atualizar();
})();