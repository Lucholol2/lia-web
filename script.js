const chat = document.getElementById("chat-box");
const input = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");
const micBtn = document.getElementById("mic-btn");

// Guarda el historial en localStorage
function guardarHistorial() {
  localStorage.setItem("chatHistorial", chat.innerHTML);
}

// Carga historial anterior
function cargarHistorial() {
  const hist = localStorage.getItem("chatHistorial");
  if (hist) {
    chat.innerHTML = hist;
    scrollToBottom();
  }
}

// Scroll automático
function scrollToBottom() {
  chat.scrollTop = chat.scrollHeight;
}

// Añade mensajes al chat
function addMessage(text, isUser = false) {
  const div = document.createElement("div");
  div.className = isUser ? "user-message" : "lia-message";
  div.textContent = text;
  chat.appendChild(div);
  guardarHistorial();
  scrollToBottom();
}

// Simula respuesta de Lia
function respuestaLia(text) {
  const typing = document.createElement("div");
  typing.className = "lia-message";
  typing.textContent = "⏳ Lia está escribiendo...";
  chat.appendChild(typing);
  scrollToBottom();

  setTimeout(() => {
    chat.removeChild(typing);
    // Aquí podés poner respuestas más inteligentes
    let respuesta = "";

    if (text.toLowerCase().includes("hola")) {
      respuesta = "¡Hola! ¿Cómo estás?";
    } else if (text.trim() === "") {
      respuesta = "No entendí muy bien... 😅";
    } else {
      respuesta = "Me gusta que me hables, pero no entendí eso. 🤖";
    }

    addMessage(respuesta, false);
  }, 1200);
}

// Enviar mensaje
function enviarMensaje() {
  const texto = input.value.trim();
  if (!texto) return;
  addMessage(texto, true);
  input.value = "";
  respuestaLia(texto);
}

// Reconocimiento por voz
let reconocimiento;
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  reconocimiento = new SpeechRecognition();
  reconocimiento.lang = 'es-AR';
  reconocimiento.continuous = false;
  reconocimiento.interimResults = false;

  reconocimiento.onstart = () => {
    micBtn.classList.add("active");
    micBtn.title = "Escuchando...";
  };

  reconocimiento.onend = () => {
    micBtn.classList.remove("active");
    micBtn.title = "Hablar 🎤";
  };

  reconocimiento.onerror = (event) => {
    addMessage(`🎤 Error de voz: ${event.error}`, false);
  };

  reconocimiento.onresult = (event) => {
    const speechResult = event.results[0][0].transcript;
    addMessage(speechResult, true);
    respuestaLia(speechResult);
  };
} else {
  micBtn.disabled = true;
  micBtn.title = "Reconocimiento de voz no soportado en este navegador.";
}

// Event listeners
sendBtn.addEventListener("click", enviarMensaje);

input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    enviarMensaje();
  }
});

micBtn.addEventListener("click", () => {
  if (!reconocimiento) return;
  try {
    reconocimiento.start();
  } catch(e) {
    // Evita error si ya está iniciado
  }
});

// Cargar historial al inicio
cargarHistorial();
