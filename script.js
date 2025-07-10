const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const micBtn = document.getElementById('mic-btn');
const clearBtn = document.getElementById('clear-btn');

let recognition;
let recognizing = false;

// Cargar historial si hay
function cargarHistorial() {
  const historial = localStorage.getItem('chatHistorial');
  if (historial) {
    chatBox.innerHTML = historial;
    chatBox.scrollTop = chatBox.scrollHeight;
  }
}

// Guardar historial
function guardarHistorial() {
  localStorage.setItem('chatHistorial', chatBox.innerHTML);
}

// Agregar mensaje al chat
function agregarMensaje(mensaje, tipo) {
  const div = document.createElement('div');
  div.classList.add(tipo);
  const p = document.createElement('p');
  p.classList.add(tipo + '-message');
  p.textContent = mensaje;
  div.appendChild(p);
  chatBox.appendChild(div);
  chatBox.scrollTo({ top: chatBox.scrollHeight, behavior: 'smooth' });
  guardarHistorial();
}

// Respuesta automática simple mejorada
function responder(mensajeUsuario) {
  let respuesta = "No entendí muy bien... 😅";

  const msg = mensajeUsuario.toLowerCase();

  if (msg.includes('hola')) {
    respuesta = "¡Hola! ¿Cómo estás?";
  } else if (msg.includes('cómo estás') || msg.includes('como estas')) {
    respuesta = "Estoy bien, ¡gracias por preguntar! 😊";
  } else if (msg.includes('adiós') || msg.includes('chao')) {
    respuesta = "¡Hasta luego! Cuídate mucho.";
  } else if (msg.includes('gracias')) {
    respuesta = "De nada, ¡estoy para ayudarte!";
  } else if (msg.includes('qué haces') || msg.includes('que haces')) {
    respuesta = "Estoy aquí para charlar contigo y ayudarte en lo que pueda.";
  } else if (msg.includes('tu nombre')) {
    respuesta = "Me llamo Lia, tu asistente virtual.";
  } else if (msg.includes('hora')) {
    respuesta = "Lo siento, todavía no sé decir la hora. Pero estoy aprendiendo!";
  } else if (msg.includes('broma')) {
    respuesta = "¿Por qué el programador confunde Halloween con Navidad? Porque OCT 31 == DEC 25!";
  }

  return respuesta;
}

// Enviar mensaje (usuario)
function enviarMensaje() {
  const texto = userInput.value.trim();
  if (!texto) return;
  agregarMensaje(texto, 'user');
  userInput.value = '';
  setTimeout(() => {
    const respuesta = responder(texto);
    agregarMensaje(respuesta, 'lia');
  }, 600);
}

// Manejo de reconocimiento de voz
function iniciarReconocimiento() {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    alert('Este navegador no soporta reconocimiento de voz.');
    return;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();

  recognition.lang = 'es-AR';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onstart = () => {
    recognizing = true;
    micBtn.classList.add('active');
  };

  recognition.onerror = (event) => {
    console.error('🎤 Error de voz:', event.error);
    agregarMensaje(`🎤 Error de voz: ${event.error}`, 'lia');
    recognizing = false;
    micBtn.classList.remove('active');
  };

  recognition.onend = () => {
    recognizing = false;
    micBtn.classList.remove('active');
  };

  recognition.onresult = (event) => {
    const speechResult = event.results[0][0].transcript;
    agregarMensaje(speechResult, 'user');
    setTimeout(() => {
      const respuesta = responder(speechResult);
      agregarMensaje(respuesta, 'lia');
    }, 600);
  };

  recognition.start();
}

// Limpiar historial completo
function limpiarHistorial() {
  if (confirm('¿Querés borrar todo el historial de chat?')) {
    chatBox.innerHTML = '';
    localStorage.removeItem('chatHistorial');
    chatBox.scrollTop = 0;
  }
}

// Eventos
sendBtn.addEventListener('click', enviarMensaje);

userInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    enviarMensaje();
  }
});

micBtn.addEventListener('click', () => {
  if (recognizing) {
    recognition.stop();
  } else {
    iniciarReconocimiento();
  }
});

clearBtn.addEventListener('click', limpiarHistorial);

// Carga inicial
cargarHistorial();
