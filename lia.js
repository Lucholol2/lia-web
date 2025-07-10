const API_KEY = 'AIzaSyCPafK6G0bNRhRR_WVXIr1EZW-UHTk-0k8';
const CX = '232b2051090784dc2';

const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');

function scrollToBottom() {
  chatBox.scrollTop = chatBox.scrollHeight;
}

function agregarMensaje(texto, clase) {
  const div = document.createElement('div');
  div.className = clase;
  if (clase === 'lia-message' && texto.includes('<a ')) {
    div.innerHTML = texto;
  } else {
    div.textContent = texto;
  }
  chatBox.appendChild(div);
  scrollToBottom();
}

async function buscarGoogle(query) {
  try {
    const url = `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${CX}&q=${encodeURIComponent(query)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Error en búsqueda');
    const data = await res.json();
    return data.items || [];
  } catch (e) {
    console.error('Error en buscarGoogle:', e);
    return [];
  }
}

async function sendMessage() {
  const texto = userInput.value.trim();
  if (!texto) return;

  agregarMensaje(texto, 'user-message');
  userInput.value = '';
  userInput.disabled = true;

  if (texto.toLowerCase().startsWith('busca ') || texto.toLowerCase().startsWith('google ')) {
    agregarMensaje('🔎 Buscando en Google...', 'lia-message');
    const query = texto.replace(/^busca |^google /i, '');
    const resultados = await buscarGoogle(query);

    if (resultados.length === 0) {
      agregarMensaje('No encontré nada 😕', 'lia-message');
    } else {
      resultados.slice(0, 3).forEach(item => {
        const link = `<a href="${item.link}" target="_blank" rel="noopener">${item.title}</a><br>${item.snippet}`;
        agregarMensaje(link, 'lia-message');
      });
    }
  } else {
    // Si no es búsqueda, respondemos con función local (simplificada)
    const respuesta = elegirRespuesta(texto);
    agregarMensaje(respuesta, 'lia-message');
  }

  userInput.disabled = false;
  userInput.focus();
}

// Ejemplo simple de respuestas automáticas
function elegirRespuesta(input) {
  input = input.toLowerCase();
  if (input.includes('hola')) return '¡Hola, papá! 💕';
  if (input.includes('cómo estás')) return '¡Muy bien! ¿Y vos, papá? 🥰';
  return 'No entendí muy bien... 😅';
}

userInput.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

window.onload = () => {
  setTimeout(() => agregarMensaje('¡Hola, papá! ¿Querés charlar conmigo? 😄', 'lia-message'), 500);
};
