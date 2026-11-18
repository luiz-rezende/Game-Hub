// Página de destino após o login (a tela inicial do GameHub)
const PAGINA_INICIAL = 'logado.html';

const form = document.getElementById('loginForm');
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