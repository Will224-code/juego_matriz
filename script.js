const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const btnMostrar = document.getElementById("btnMostrar");
const btnBorrar = document.getElementById("btnBorrar");
const mensaje = document.getElementById("mensaje");
const listaAdyacenciaDiv = document.getElementById("listaAdyacencia");
const listaIncidenciaDiv = document.getElementById("listaIncidencia");

let nodos = [];
let aristas = [];
let nodoSeleccionado = null;
let mostrarMatrices = false;

canvas.addEventListener("click", e => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const nodoClicado = buscarNodoEnPosicion(x, y);

  if (nodoSeleccionado && nodoClicado && nodoSeleccionado !== nodoClicado) {
    aristas.push({ a: nodoSeleccionado, b: nodoClicado });
    nodoSeleccionado.conexiones.push(nodos.indexOf(nodoClicado));
    nodoClicado.conexiones.push(nodos.indexOf(nodoSeleccionado));
    nodoSeleccionado = null;
  } else if (nodoClicado) {
    nodoSeleccionado = nodoClicado;
  } else {
    const nuevoNodo = { x, y, conexiones: [] };
    nodos.push(nuevoNodo);
    nodoSeleccionado = nuevoNodo;
  }
  dibujar();
});

btnMostrar.addEventListener("click", () => {
  if (nodos.length === 0) {
    mensaje.textContent = "No hay nada que mostrar";
    return;
  }
  mensaje.textContent = "";
  mostrarMatrices = true;
  dibujar();
  mostrarListasHTML();
});

btnBorrar.addEventListener("click", () => {
  if (nodos.length === 0) {
    mensaje.textContent = "No hay nada que borrar";
    return;
  }
  mensaje.textContent = "";
  nodos = [];
  aristas = [];
  nodoSeleccionado = null;
  mostrarMatrices = false;
  listaAdyacenciaDiv.innerHTML = "";
  listaIncidenciaDiv.innerHTML = "";
  dibujar();
});

function buscarNodoEnPosicion(x, y) {
  return nodos.find(n => Math.hypot(n.x - x, n.y - y) < 15);
}

function dibujar() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  aristas.forEach(({ a, b }) => {
    ctx.strokeStyle = "white";
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  });

  nodos.forEach((nodo, i) => {
    ctx.fillStyle = nodo === nodoSeleccionado ? "orange" : "skyblue";
    ctx.beginPath();
    ctx.arc(nodo.x, nodo.y, 10, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = "white";
    ctx.fillText(String.fromCharCode(65 + i), nodo.x - 10, nodo.y - 15);
  });

  if (mostrarMatrices) {
    mostrarListasHTML();
  }
}

function mostrarListasHTML() {
  // Matriz y lista de adyacencia
  let adyHTML = `<h3>Matriz de Adyacencia</h3><table><tr><th></th>`;
  for (let i = 0; i < nodos.length; i++) {
    adyHTML += `<th>${String.fromCharCode(65 + i)}</th>`;
  }
  adyHTML += `</tr>`;
  for (let i = 0; i < nodos.length; i++) {
    adyHTML += `<tr><th>${String.fromCharCode(65 + i)}</th>`;
    for (let j = 0; j < nodos.length; j++) {
      adyHTML += `<td>${nodos[i].conexiones.includes(j) ? 1 : 0}</td>`;
    }
    adyHTML += `</tr>`;
  }
  adyHTML += `</table><h4>Lista de Adyacencia</h4>`;
  for (let i = 0; i < nodos.length; i++) {
    const conexiones = nodos[i].conexiones.map(idx => String.fromCharCode(65 + idx)).join(", ");
    adyHTML += `${String.fromCharCode(65 + i)} → ${conexiones}<br>`;
  }
  listaAdyacenciaDiv.innerHTML = adyHTML;

  // Matriz y lista de incidencia
  let incHTML = `<h3>Matriz de Incidencia</h3><table><tr><th></th>`;
  for (let i = 0; i < aristas.length; i++) {
    incHTML += `<th>e${i + 1}</th>`;
  }
  incHTML += `</tr>`;
  for (let i = 0; i < nodos.length; i++) {
    incHTML += `<tr><th>${String.fromCharCode(65 + i)}</th>`;
    for (let j = 0; j < aristas.length; j++) {
      const { a, b } = aristas[j];
      const indexNodo = nodos[i];
      const valor = (a === indexNodo || b === indexNodo) ? 1 : 0;
      incHTML += `<td>${valor}</td>`;
    }
    incHTML += `</tr>`;
  }
  incHTML += `</table><h4>Lista de Incidencia</h4>`;
  aristas.forEach((arista, idx) => {
    const indexA = nodos.indexOf(arista.a);
    const indexB = nodos.indexOf(arista.b);
    const labelA = String.fromCharCode(65 + indexA);
    const labelB = String.fromCharCode(65 + indexB);
    incHTML += `e${idx + 1}: ${labelA} ↔ ${labelB}<br>`;
  });
  listaIncidenciaDiv.innerHTML = incHTML;
}

dibujar();
