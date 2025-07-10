const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const showErrorsBtn = document.getElementById('show-errors-btn');
const errorsContainer = document.getElementById('errors-container');

let erroresNoEntendidos = [];

function agregarMensaje(texto, clase) {
  const msg = document.createElement('div');
  if (clase === 'lia') {
    msg.innerHTML = texto; // Permitimos HTML para respuestas del bot (links, emojis, etc.)
  } else {
    msg.textContent = texto;
  }
  msg.className = clase;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function procesarMensaje(texto) {
  const mensaje = texto.toLowerCase().trim();

  // Comando para mostrar errores desde el chat
  if (mensaje === 'ver errores' || mensaje === 'mostrar errores' || mensaje === 'errores') {
    if (erroresNoEntendidos.length === 0) {
      return 'No hay errores para mostrar.';
    } else {
      return 'Mensajes no entendidos:\n' + erroresNoEntendidos.join('\n');
    }
  }

  // Detectar búsqueda en Google con "buscar ..." o "buscar en google ..."
  const buscarRegex = /^(buscar|busca|buscar en google)\s+(.+)/i;
  const match = texto.match(buscarRegex);
  if (match) {
    const terminoBusqueda = encodeURIComponent(match[2].trim());
    return `<a href="https://www.google.com/search?q=${terminoBusqueda}" target="_blank" rel="noopener noreferrer">Buscar "${match[2].trim()}" en Google 🔍</a>`;
  }

  if (mensaje === 'lista de frutas' || mensaje === 'frutas' || mensaje === 'dame la lista de frutas') {
    return `🍎 Manzana
🍌 Banana
🍊 Naranja
🍓 Frutilla
🥭 Mango
🍇 Uvas`;
  }

  // No entendió, guarda el mensaje
  erroresNoEntendidos.push(texto);
  return 'No entendí muy bien... 😅';
}

function enviarMensaje() {
  const texto = userInput.value.trim();
  if (!texto) return;

  agregarMensaje(texto, 'user');
  const respuesta = procesarMensaje(texto);
  agregarMensaje(respuesta, 'lia');

  userInput.value = '';
  errorsContainer.style.display = 'none'; // Oculta errores al enviar nuevo mensaje

  // Animar ícono del botón enviar
  sendBtn.classList.add('active');
  setTimeout(() => {
    sendBtn.classList.remove('active');
  }, 1000);
}

sendBtn.addEventListener('click', enviarMensaje);

userInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    enviarMensaje();
  }
});

showErrorsBtn.addEventListener('click', () => {
  if (erroresNoEntendidos.length === 0) {
    errorsContainer.textContent = 'No hay errores para mostrar.';
  } else {
    errorsContainer.textContent = 'Mensajes no entendidos:\n' + erroresNoEntendidos.join('\n');
  }
  errorsContainer.style.display = 'block';
});
                               
