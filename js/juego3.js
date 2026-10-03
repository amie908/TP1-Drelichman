// Cada imagen representa una carta distinta. Cada una aparece dos veces.
let frentes = [
    { valor: "basto1", imagen: "img/basto1.png" },
    { valor: "basto2", imagen: "img/basto2.png" },
    { valor: "copa1", imagen: "img/copa1.png" },
    { valor: "copa2", imagen: "img/copa2.png" },
    { valor: "espada1", imagen: "img/espada1.png" },
    { valor: "espada2", imagen: "img/espada2.png" },
    { valor: "oro1", imagen: "img/oro1.png" },
    { valor: "oro2", imagen: "img/oro2.png" }
];

let dorso = "img/dorso.jpg";
let cartas = [];

// Variables del juego
let primeraCarta = null;
let segundaCarta = null;
let bloqueo = false;
let movimientos = 0;
let parejas = 0;
let tiempoRestante = 90;
let temporizador = null;
let juegoTerminado = false;
let juegoIniciado = false;

function guardarPartidaMemotest(ganada) {
    let historialGuardado = localStorage.getItem("historialMemotest");
    let historial = [];

    if (historialGuardado !== null) {
        historial = JSON.parse(historialGuardado);
    }

    let partida = {
        fecha: new Date().toLocaleString("es-AR"),
        resultado: ganada ? "Victoria" : "Tiempo agotado",
        movimientos: movimientos,
        parejas: parejas,
        tiempoRestante: tiempoRestante,
        ganada: ganada
    };

    historial.unshift(partida);
    localStorage.setItem("historialMemotest", JSON.stringify(historial));
}

// Agregar dos copias de cada frente al mazo
function armarMazo() {
    cartas = [];

    for (let i = 0; i < frentes.length; i++) {
        cartas.push(frentes[i]);
        cartas.push(frentes[i]);
    }
}

// Mezclar las cartas
function mezclar() {
    for (let i = cartas.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let cartaTemporal = cartas[i];
        cartas[i] = cartas[j];
        cartas[j] = cartaTemporal;
    }
}

// Crear el tablero
function crearTablero() {
    let tablero = document.getElementById("tablero");
    tablero.innerHTML = "";

    cartas.forEach((datosCarta) => {
        let carta = document.createElement("div");
        carta.classList.add("carta");
        carta.classList.add("oculta");
        carta.dataset.valor = datosCarta.valor;
        carta.dataset.imagen = datosCarta.imagen;

        let imagen = document.createElement("img");
        imagen.src = dorso;
        imagen.alt = "Dorso de la carta";
        imagen.draggable = false;
        carta.appendChild(imagen);

        carta.addEventListener("click", function () {
            descubrirCarta(carta);
        });

        tablero.appendChild(carta);
    });
}

// Mostrar u ocultar el frente de una carta
function mostrarFrente(carta) {
    let imagen = carta.querySelector("img");
    imagen.src = carta.dataset.imagen;
    imagen.alt = carta.dataset.valor;
    carta.classList.remove("oculta");
}

function mostrarDorso(carta) {
    let imagen = carta.querySelector("img");
    imagen.src = dorso;
    imagen.alt = "Dorso de la carta";
    carta.classList.add("oculta");
}

// Actualizar la cuenta regresiva en pantalla
function actualizarTiempo() {
    let minutos = Math.floor(tiempoRestante / 60);
    let segundos = tiempoRestante % 60;

    if (minutos < 10) {
        minutos = "0" + minutos;
    }

    if (segundos < 10) {
        segundos = "0" + segundos;
    }

    document.getElementById("tiempo").textContent = minutos + ":" + segundos;
}

function iniciarTemporizador() {
    actualizarTiempo();
    temporizador = setInterval(function () {
        tiempoRestante--;
        actualizarTiempo();

        if (tiempoRestante <= 0) {
            clearInterval(temporizador);
            temporizador = null;
            juegoTerminado = true;
            guardarPartidaMemotest(false);
            bloqueo = true;
            alert("¡se acabó el tiempo! intentalo otra vez");
        }
    }, 1000);
}

// Iniciar el juego y poner en marcha el cronómetro
function iniciarJuego() {
    if (juegoIniciado || juegoTerminado) {
        return;
    }

    juegoIniciado = true;
    document.getElementById("iniciar").disabled = true;
    iniciarTemporizador();
}

// Descubrir una carta
function descubrirCarta(carta) {
    if (!juegoIniciado || juegoTerminado || bloqueo || carta === primeraCarta || !carta.classList.contains("oculta")) {
        return;
    }

    mostrarFrente(carta);

    if (primeraCarta === null) {
        primeraCarta = carta;
        return;
    }

    segundaCarta = carta;
    movimientos++;
    document.getElementById("movimientos").textContent = movimientos;
    comprobarPareja();
}

// Comprobar si las cartas son iguales
function comprobarPareja() {
    if (primeraCarta.dataset.valor === segundaCarta.dataset.valor) {
        parejas++;
        primeraCarta = null;
        segundaCarta = null;

        if (parejas === cartas.length / 2) {
            juegoTerminado = true;
            guardarPartidaMemotest(true);
            clearInterval(temporizador);
            temporizador = null;
            setTimeout(function () {
                alert("¡Ganaste! Encontraste todas las parejas.");
            }, 300);
        }
        return;
    }

    bloqueo = true;
    setTimeout(function () {
        mostrarDorso(primeraCarta);
        mostrarDorso(segundaCarta);
        primeraCarta = null;
        segundaCarta = null;
        bloqueo = juegoTerminado;
    }, 1000);
}

// Comenzar un nuevo juego
function nuevoJuego() {
    clearInterval(temporizador);
    temporizador = null;
    primeraCarta = null;
    segundaCarta = null;
    bloqueo = false;
    movimientos = 0;
    parejas = 0;
    tiempoRestante = 90;
    juegoTerminado = false;
    juegoIniciado = false;

    document.getElementById("movimientos").textContent = "0";
    document.getElementById("iniciar").disabled = false;
    armarMazo();
    mezclar();
    crearTablero();
    actualizarTiempo();
}

// Iniciar el juego
document.getElementById("iniciar").addEventListener("click", iniciarJuego);
document.getElementById("nuevo").addEventListener("click", nuevoJuego);
nuevoJuego();