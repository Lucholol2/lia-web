// Selección de elementos del DOM
const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');

// Utilidad: Scroll suave al final del chat
function scrollToBottom() {
  chatBox.scrollTo({ top: chatBox.scrollHeight, behavior: 'smooth' });
}

// Mostrar mensaje en el chat
function addMessage(text, className) {
  const msg = document.createElement('div');
  msg.className = className;
  msg.textContent = text;
  chatBox.appendChild(msg);
  scrollToBottom();
}

// TTS: Hablar en voz alta (voz argentina si está disponible)
function speak(text) {
  if (!window.speechSynthesis) return;

  const synth = window.speechSynthesis;
  let voices = synth.getVoices();

  // Manejo para Safari y otros navegadores donde `getVoices` puede tardar
  if (!voices.length) {
    synth.onvoiceschanged = () => speak(text);
    return;
  }

  const argentinian = voices.find(v => v.lang === 'es-AR');
  const fallback = voices.find(v => v.lang.startsWith('es')) || voices[0];

  const utter = new SpeechSynthesisUtterance(text);
  utter.voice = argentinian || fallback;
  utter.lang = utter.voice?.lang || 'es-AR';

  synth.cancel(); // Detiene cualquier voz anterior
  synth.speak(utter);
}

// Enviar mensaje al backend y manejar respuesta
async function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  addMessage(text, 'user-message');
  userInput.value = '';
  userInput.disabled = true;

  try {
    const res = await fetch('https://lia-backend-v0ta.onrender.com/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text })
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    const reply = data.reply?.trim() || "Uy, no entendí 😕";

    addMessage(reply, 'lia-message');
    speak(reply);
  } catch (err) {
    console.error("Error al conectar con el backend:", err);
    addMessage("Uy, no pude responder 😢", 'lia-message');
  } finally {
    userInput.disabled = false;
    userInput.focus();
  }
}

// Escuchar voz y enviar mensaje
function startListening() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert("Tu navegador no soporta reconocimiento de voz 😢");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = 'es-AR';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.start();

  recognition.onresult = function (event) {
    const spokenText = event.results[0][0].transcript;
    if (spokenText) {
      userInput.value = spokenText;
      sendMessage(); // Ya se llama directo
    }
  };

  recognition.onerror = function (event) {
    console.error("Error al escuchar: ", event.error);
    addMessage("No pude escucharte bien 😕", 'lia-message');
  };
}

// Atajo de teclado: Enter para enviar
userInput.addEventListener('keydown', function (e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});
