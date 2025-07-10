// Selección de elementos del DOM
const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');

// Scroll suave al fondo
function scrollToBottom() {
  chatBox.scrollTo({ top: chatBox.scrollHeight, behavior: 'smooth' });
}

// Mostrar mensaje en el chat
function addMessage(text, className) {
  const msg = document.createElement('div');
  msg.className = className;
  if (className === 'lia-message') {
    msg.innerHTML = text; // permite HTML como enlaces
  } else {
    msg.textContent = text;
  }
  chatBox.appendChild(msg);
  scrollToBottom();
}

// TTS: Hablar en voz alta
function speak(text) {
  if (!window.speechSynthesis) return;
  const synth = window.speechSynthesis;
  let voices = synth.getVoices();

  if (!voices.length) {
    synth.onvoiceschanged = () => speak(text);
    return;
  }

  const argentinian = voices.find(v => v.lang === 'es-AR');
  const fallback = voices.find(v => v.lang.startsWith('es')) || voices[0];
  const utter = new SpeechSynthesisUtterance(text);
  utter.voice = argentinian || fallback;
  utter.lang = utter.voice?.lang || 'es-AR';
  synth.cancel();
  synth.speak(utter);
}

// 🔎 Buscar en Google con la API Custom Search
async function buscarEnGoogle(query) {
  const apiKey = 'AIzaSyBVyQ1CmpzvKUqlpPDSskFkR9v2hqoU-Cg';
  const cx = '232b2051090784dc2';

  try {
    const res = await fetch(
      `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(query)}`
    );
    if (!res.ok) throw new Error("Error de búsqueda");
    const data = await res.json();
    return data.items || [];
  } catch (e) {
    console.error("Error al buscar en Google:", e);
    return null;
  }
}

// Enviar mensaje al backend o usar Google
async function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  addMessage(text, 'user-message');
  userInput.value = '';
  userInput.disabled = true;

  // Buscar en Google si empieza con "busca" o "/google"
  if (/^(busca |\/google )/i.test(text)) {
    const query = text.replace(/^(busca |\/google )/i, "").trim();
    if (!query) {
      addMessage("¿Qué querés que busque? 🧐", 'lia-message');
      userInput.disabled = false;
      return;
    }

    addMessage("🔎 Buscando en Google…", 'lia-message');

    const resultados = await buscarEnGoogle(query);
    if (resultados && resultados.length > 0) {
      resultados.slice(0, 3).forEach(item => {
        const html = `
          <strong>📌 ${item.title}</strong><br>
          <a href="${item.link}" target="_blank">${item.link}</a><br>
          <em>${item.snippet}</em>
        `;
        addMessage(html, 'lia-message');
      });
    } else {
      addMessage("No encontré resultados 😕", 'lia-message');
    }

    userInput.disabled = false;
    userInput.focus();
    return;
  }

  // Envío normal al backend
  try {
    const res = await fetch('https://lia-backend-v0ta.onrender.com/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text })
    });

    const data = await res.json();
    const reply = data.reply || "Uy, no entendí 😕";
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
    userInput.value = spokenText;
    sendMessage();
  };

  recognition.onerror = function (event) {
    console.error("Error al escuchar: ", event.error);
    addMessage("No pude escucharte bien 😕", 'lia-message');
  };
}

// Atajo Enter para enviar
userInput.addEventListener('keydown', function (e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});
