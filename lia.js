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
  if (className === 'lia-message') {
    msg.innerHTML = text; // permite HTML como enlaces
  } else {
    msg.textContent = text;
  }
  chatBox.appendChild(msg);
  scrollToBottom();
}

// TTS: Hablar en voz alta (voz argentina si está disponible)
function speak(text) {
  if (!window.speechSynthesis) return;
  const synth = window.speechSynthesis;
  let voices = synth.getVoices();

  // Safari: puede estar vacío al principio
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

// Consultar a Google con Custom Search API
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

// Enviar mensaje al backend o consultar Google
async function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  addMessage(text, 'user-message');
  userInput.value = '';
  userInput.disabled = true;

  // Detectar comando de búsqueda
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
        addMe
        
