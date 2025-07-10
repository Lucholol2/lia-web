// Lista para guardar mensajes no entendidos
const erroresNoEntendidos = [];

// Función que decide la respuesta según mensaje del usuario
function responder(mensajeUsuario) {
  const msg = mensajeUsuario.toLowerCase().trim();

  if ((msg.includes('lista') && msg.includes('frutas')) || msg.includes('fruta')) {
    return 'LISTA_FRUTAS';
  }

  // Guardar el mensaje no reconocido
  erroresNoEntendidos.push(mensajeUsuario);

  return "No entendí muy bien... 😅";
}

// Mensaje con la lista de frutas en HTML
const listaFrutas = `<b>Lista de frutas:</b>
<ul>
  <li>Manzana 🍎</li>
  <li>Banana 🍌</li>
  <li>Naranja 🍊</li>
  <li>Frutilla 🍓</li>
  <li>Mango 🥭</li>
  <li>Uvas 🍇</li>
</ul>`;

// Función que procesa el mensaje
