const chat = document.getElementById("chat-box");
const input = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");
const micBtn = document.getElementById("mic-btn");

function scrollToBottom() {
  chat.scrollTop = chat.scrollHeight;
}

function addMessage(message, isUser = false) {
  const div = document.createElement("div");
  div.className = isUser ? "user-message" : "lia-message";
  div.textContent = message;
  chat.appendChild(div);
  scrollToBottom();
}

function mostrarTyping() {
  const typing = document.createElement("div");
  typing.className = "typing-indicator";
  typing.innerHTML = `<span></span><span></span><span></span>`;
  chat.appendChild(typing);
  scrollToBottom();
  return typing;
}

function respuestaLia(texto) {
  const typing = mostrarTyping();

  setTimeout(() => {
    typing.remove();
    let r = "No entendí muy bien... 😅";
    const t = texto.toLowerCase();

    if (t.includes("hola")) r = "¡Hola, papá! ¿Querés charlar conmigo? 😊";
    else if (t.includes("fruta")) r = "Me encantan las frutas 🍌🍓🍇";
    else if (t.includes("adiós")) r = "¡Hasta luego! 👋";

    addMessage(r);
  }, 1200);
}

function procesarMensaje() {
  const mensaje = input.value.trim();
  if (!mensaje) return;

  try {
    addMessage(mensaje, true);
    input.value = "";
    respuestaLia(mensaje);
  } catch (e) {
    console.error("Error procesando el mensaje:", e);
    addMessage("😢 Ocurrió un error al procesar tu mensaje.");
  }
}

sendBtn.addEventListener("click", procesarMensaje);

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") procesarMensaje();
});

// 🎤 Micrófono
if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recog = new Recognition();
  recog.lang = "es-AR";
  recog.continuous = false;
  recog.interimResults = false;

  micBtn.addEventListener("click", () => {
    try {
      recog.start();
    } catch (e) {
      console.warn("No se pudo activar el micrófono:", e);
    }
  });

  recog.onresult = (event) => {
    const texto = event.results[0][0].transcript;
    input.value = texto;
    procesarMensaje();
  };

  recog.onerror = (event) => {
    console.error("🎤 Error de voz:", event.error);
  };
} else {
  micBtn.disabled = true;
  micBtn.title = "Reconocimiento de voz no disponible";
}
