// Función que decide la respuesta según mensaje del usuario
function responder(mensajeUsuario) {
  const msg = mensajeUsuario.toLowerCase().trim();

  // Detecta cualquier mensaje que contenga "lista" y "frutas" o solo "fruta(s)"
  if ((msg.includes('lista') && msg.includes('frutas')) || msg.includes('fruta')) {
    return 'LISTA_FRUTAS';
  }

  return "No entendí muy bien... 😅";
}

// Mensaje con la lista de frutas
const listaFrutas = `<b>Lista de frutas:</b>
<ul>
  <li>Manzana 🍎</li>
  <li>Banana 🍌</li>
  <li>Naranja 🍊</li>
  <li>Frutilla 🍓</li>
  <li>Mango 🥭</li>
  <li>Uvas 🍇</li>
</ul>`;

// Función que agrega mensajes al chat visualmente
function agregarMensaje(tipo, texto) {
  const chatBox = document.getElementById('chat-box');
  if (!chatBox) return; // Seguridad: si no existe chat-box, no hacer nada

  const contenedor = document.createElement('div');
  contenedor.classList.add(tipo);

  const mensaje = document.createElement('div');
  mensaje.classList.add(`${tipo}-message`);
  mensaje.innerHTML = texto;

  contenedor.appendChild(mensaje);
  chatBox.appendChild(contenedor);
  chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll al final
}

// Función que procesa el mensaje del usuario y agrega la respuesta en el chat
function procesarMensaje(mensaje) {
  agregarMensaje('user', mensaje);

  const respuesta = responder(mensaje);

  if (respuesta === 'LISTA_FRUTAS') {
    agregarMensaje('lia', listaFrutas);
  } else {
    agregarMensaje('lia', respuesta);
  }
}

// Evento para escuchar el input y enviar mensaje al presionar Enter
const inputUsuario = document.getElementById('user-input');
if (inputUsuario) {
  inputUsuario.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      const texto = e.target.value.trim();
      if (texto.length > 0) {
        procesarMensaje(texto);
        e.target.value = '';
      }
    }
  });
}
