const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');

// ✉️ Enviar mensaje al backend
function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  addMessage(text, 'user-message');
  userInput.value = '';

  fetch('https://lia-backend-v0ta.onrender.com/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: text })
  })
    .then(res => res.json())
    .then(data => {
      const reply = data.reply || "Uy, no entendí 😕";
      addMessage(reply, 'lia-message');
      speak(reply);
    })
    .catch(err => {
      console.error("Error al conectar con el backend:", err);
      addMessage("Uy, no pude responder 😢", 'lia-message');
    });
}

// 🗨️ Mostrar mensaje en el chat
function addMessage(text, className) {
  const msg = document.createElement('div');
  msg.className = className;
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// 🗣️ Hablar en voz alta
function speak(text) {
  const synth = window.speechSynthesis;
  const voices = synth.getVoices();
  const argentinian = voices.find(v => v.lang === 'es-AR');
  const utter = new SpeechSynthesisUtterance(text);
  utter.voice = argentinian || voices[0];
  utter.lang = 'es-AR';
  synth.cancel();
  synth.speak(utter);
}

// 🎙️ Escuchar por voz
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
    userInput.value = spokenText;
    sendMessage();
  };

  recognition.onerror = function (event) {
    console.error("Error al escuchar: ", event.error);
    addMessage("No pude escucharte bien 😕", 'lia-message');
  };
}
