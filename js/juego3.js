
// Cartas del juego
let cartas = [
    "🐶", "🐶",
    "🐱", "🐱",
    "🐭", "🐭",
    "🐹", "🐹",
    "🦊", "🦊",
    "🐻", "🐻",
    "🐼", "🐼",
    "🐸", "🐸"
];

// Variables del juego
let primeraCarta = null;
let segundaCarta = null;
let bloqueo = false;
let movimientos = 0;
let parejas = 0;


// Mezclar las cartas
function mezclar() {
    cartas.sort(function() {
        return Math.random() - 0.5;
    });
}


// Crear el tablero
function crearTablero() {

    let tablero = document.getElementById("tablero");

    tablero.innerHTML = "";

    for (let i = 0; i < cartas.length; i++) {

        let carta = document.createElement("div");

        carta.classList.add("carta");
        carta.classList.add("oculta");

        carta.textContent = "?";

        carta.dataset.valor = cartas[i];

        carta.onclick = function() {
            descubrirCarta(carta);
        };

        tablero.appendChild(carta);
    }
}


// Descubrir una carta
function descubrirCarta(carta) {

    // No hacer nada si el tablero está bloqueado
    if (bloqueo) {
        return;
    }

    // No permitir seleccionar la misma carta
    if (carta === primeraCarta) {
        return;
    }

    // Mostrar la carta
    carta.textContent = carta.dataset.valor;
    carta.classList.remove("oculta");

    // Primera carta
    if (primeraCarta === null) {

        primeraCarta = carta;

    } else {

        // Segunda carta
        segundaCarta = carta;

        movimientos++;

        document.getElementById("movimientos").textContent = movimientos;

        comprobarPareja();
    }
}


// Comprobar si las cartas son iguales
function comprobarPareja() {

    if (primeraCarta.dataset.valor === segundaCarta.dataset.valor) {

        // Las cartas coinciden
        parejas++;

        primeraCarta = null;
        segundaCarta = null;

        if (parejas === cartas.length / 2) {
            setTimeout(function() {
                alert("¡Ganaste! Encontraste todas las parejas.");
            }, 300);
        }

    } else {

        // Las cartas no coinciden
        bloqueo = true;

        setTimeout(function() {

            primeraCarta.textContent = "?";
            segundaCarta.textContent = "?";

            primeraCarta.classList.add("oculta");
            segundaCarta.classList.add("oculta");

            primeraCarta = null;
            segundaCarta = null;

            bloqueo = false;

        }, 1000);
    }
}


// Comenzar un nuevo juego
function nuevoJuego() {

    primeraCarta = null;
    segundaCarta = null;
    bloqueo = false;
    movimientos = 0;
    parejas = 0;

    document.getElementById("movimientos").textContent = "0";

    mezclar();
    crearTablero();
}


// Iniciar el juego
nuevoJuego();