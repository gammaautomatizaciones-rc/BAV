// =========================
//  CONFIGURACIÓN GLOBAL
// =========================
const toursContainer = document.getElementById("tours-container");
const experienciasContainer = document.getElementById("experiencias-container");
const searchInput = document.getElementById("search");

// =========================
//  MODAL - CREACIÓN Y MANEJO
// =========================

// Creamos dinámicamente el modal (el estilo viene desde detalle.css)
const modal = document.createElement("div");
modal.classList.add("modal");
modal.innerHTML = `
  <div class="modal-content">
    <span class="close-modal">&times;</span>
    <div class="modal-body">
      <div class="modal-left">
        <img id="modal-img" src="" alt="Tour Imagen" class="modal-img">
        <h3 id="modal-nombre"></h3>
        <p id="modal-descripcion"></p>
      </div>
      <div class="modal-right">
        <h4>Itinerario:</h4>
        <ul id="modal-itinerario"></ul>
        <h4>Incluye:</h4>
        <ul id="modal-incluye"></ul>
        <p><strong>Duración:</strong> <span id="modal-duracion"></span></p>
        <p><strong>Salida:</strong> <span id="modal-salida"></span></p>
        <p><strong>Idioma:</strong> <span id="modal-idioma"></span></p>
        <a id="modal-reservar" href="#" target="_blank" class="btn-secondary">Reservar por WhatsApp</a>
        <button id="modal-volver" class="btn-secondary volver-btn">⬅️ Volver</button>
      </div>
    </div>
  </div>
`;
document.body.appendChild(modal);

// Referencias internas
const modalImg = modal.querySelector("#modal-img");
const modalNombre = modal.querySelector("#modal-nombre");
const modalDescripcion = modal.querySelector("#modal-descripcion");
const modalItinerario = modal.querySelector("#modal-itinerario");
const modalIncluye = modal.querySelector("#modal-incluye");
const modalDuracion = modal.querySelector("#modal-duracion");
const modalSalida = modal.querySelector("#modal-salida");
const modalIdioma = modal.querySelector("#modal-idioma");
const modalReservar = modal.querySelector("#modal-reservar");
const closeModalBtn = modal.querySelector(".close-modal");
const volverBtn = modal.querySelector("#modal-volver");

// =========================
//  FUNCIONES MODAL
// =========================
function abrirModal(tour) {
  modal.classList.add("show");
  modalImg.src = tour.imagen;
  modalNombre.textContent = tour.nombre;
  modalDescripcion.textContent = tour.descripcion;

  modalItinerario.innerHTML = tour.itinerario
    ? tour.itinerario.map(i => `<li>• ${i}</li>`).join("")
    : "<li>No disponible</li>";

  modalIncluye.innerHTML = tour.incluye
    ? tour.incluye.map(i => `<li>✔️ ${i}</li>`).join("")
    : "<li>No especificado</li>";

  modalDuracion.textContent = tour.duracion || "-";
  modalSalida.textContent = tour.salida || "-";
  modalIdioma.textContent = tour.idioma || "-";
  modalReservar.href = `https://wa.me/5491176158609?text=Hola!%20Quiero%20más%20info%20del%20${encodeURIComponent(tour.nombre)}`;
}

function cerrarModal() {
  modal.classList.remove("show");
}

// Eventos para cerrar
closeModalBtn.addEventListener("click", cerrarModal);
volverBtn.addEventListener("click", cerrarModal);
modal.addEventListener("click", e => { if (e.target === modal) cerrarModal(); });
document.addEventListener("keydown", e => { if (e.key === "Escape") cerrarModal(); });

// =========================
//  CARGA DE TOURS DESDE JSON
// =========================
let toursData = [];

fetch("data/tours.json")
  .then(res => res.json())
  .then(data => {
    toursData = data;
    mostrarTours(data);
    mostrarExperiencias(data);
  })
  .catch(err => {
    console.error("Error al cargar tours:", err);
    toursContainer.innerHTML = "<p>No se pudieron cargar los tours 😢</p>";
  });

// =========================
//  MOSTRAR TOURS
// =========================
function mostrarTours(tours) {
  toursContainer.innerHTML = "";
  const toursFiltrados = tours.filter(t =>
    !t.categoria || (
      !t.categoria.toLowerCase().includes("experiencia") &&
      !t.categoria.toLowerCase().includes("estancia")
    )
  );

  if (toursFiltrados.length === 0) {
    toursContainer.innerHTML = "<p>No hay tours disponibles.</p>";
    return;
  }

  toursFiltrados.forEach(tour => {
    const card = crearCard(tour);
    toursContainer.appendChild(card);
  });
  animarCards();
}

// =========================
//  MOSTRAR EXPERIENCIAS
// =========================
function mostrarExperiencias(data) {
  experienciasContainer.innerHTML = "";
  const experiencias = data.filter(t =>
    t.categoria &&
    (t.categoria.toLowerCase().includes("experiencia") ||
     t.categoria.toLowerCase().includes("estancia"))
  );

  if (experiencias.length === 0) {
    experienciasContainer.innerHTML = "<p>No hay experiencias disponibles.</p>";
    return;
  }

  experiencias.forEach(exp => {
    const card = crearCard(exp);
    experienciasContainer.appendChild(card);
  });
  animarCards();
}

// =========================
//  CREAR CARD CON BOTONES
// =========================
function crearCard(tour) {
  const div = document.createElement("div");
  div.classList.add("tour-card");
  div.innerHTML = `
    <img src="${tour.imagen}" alt="${tour.nombre}">
    <h3>${tour.nombre}</h3>
    <p><strong>Duración:</strong> ${tour.duracion}</p>
    <p>${tour.descripcion}</p>
    <div class="card-buttons">
      <button class="btn-secondary ver-detalle">Ver Detalles</button>
      <a href="https://wa.me/5491176158609?text=Hola!%20Quisiera%20reservar%20el%20${encodeURIComponent(tour.nombre)}" 
         target="_blank" 
         class="btn-secondary">Reservar</a>
    </div>
  `;
  div.querySelector(".ver-detalle").addEventListener("click", () => abrirModal(tour));
  return div;
}

// =========================
//  BUSCADOR
// =========================
searchInput.addEventListener("input", e => {
  const valor = e.target.value.toLowerCase();
  const filtrados = toursData.filter(tour =>
    tour.nombre.toLowerCase().includes(valor) ||
    tour.descripcion.toLowerCase().includes(valor) ||
    tour.categoria.toLowerCase().includes(valor)
  );
  mostrarTours(filtrados);
});

// =========================
//  ANIMACIÓN DE CARDS
// =========================
function animarCards() {
  const cards = document.querySelectorAll(".tour-card");
  cards.forEach((card, i) => {
    card.style.opacity = 0;
    card.style.transform = "translateY(30px)";
    setTimeout(() => {
      card.style.transition = "opacity 0.6s ease, transform 0.6s ease";
      card.style.opacity = 1;
      card.style.transform = "translateY(0)";
    }, i * 100);
  });
}
