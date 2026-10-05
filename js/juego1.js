const endpoint = "https://opentdb.com/api.php?amount=10&category=9&difficulty=medium&type=boolean";

const pantallaRegistro = document.querySelector("#pantalla-registro");
const pantallaJuego = document.querySelector("#pantalla-juego");
const inputNombre = document.querySelector("#input-nombre");
const btnComenzar = document.querySelector("#btn-comenzar");
const mostrarNombre = document.querySelector("#mostrar-nombre");
const mostrarPuntaje = document.querySelector("#mostrar-puntaje");
const estado = document.querySelector("#estado");
const elementoPregunta = document.querySelector("#pregunta");
const opciones = document.querySelector("#opciones");
const resultado = document.querySelector("#resultado");
const nueva = document.querySelector("#nueva");
const btnFinalizar = document.querySelector("#btn-finalizar");

let respuestaCorrecta = "";
let puntaje = 0;
let preguntas = [];
let indicePregunta = 0;

btnComenzar.addEventListener("click", function () {
    mostrarNombre.textContent = inputNombre.value.trim() || "Jugador Anónimo";
    pantallaRegistro.style.display = "none";
    pantallaJuego.style.display = "block";
    cargarPregunta();
});

async function cargarPregunta() {
    try {
        if (preguntas.length === 0) {
            estado.textContent = "Cargando preguntas...";
            nueva.hidden = true;
            btnFinalizar.hidden = true;

            const respuesta = await fetch(endpoint);

            if (!respuesta.ok) {
                throw new Error("No se pudo conectar con el servidor.");
            }

            const datos = await respuesta.json();

            if (datos.response_code !== 0 || datos.results.length === 0) {
                throw new Error("No hay preguntas disponibles.");
            }

            preguntas = datos.results;
            indicePregunta = 0;
        } else {
            indicePregunta++;
        }

        if (indicePregunta >= preguntas.length) {
            estado.textContent = "Terminaste las " + preguntas.length + " preguntas.";
            elementoPregunta.textContent = "";
            opciones.innerHTML = "";
            resultado.textContent = "Puntaje final: " + puntaje;
            nueva.hidden = true;
            btnFinalizar.hidden = false;
            return;
        }

        mostrarPregunta(preguntas[indicePregunta]);
    } catch (error) {
        mostrarError("No se pudieron cargar las preguntas. " + error.message);
    }
}

function mostrarPregunta(pregunta) {
    elementoPregunta.textContent = "";
    opciones.innerHTML = "";
    resultado.textContent = "";
    nueva.hidden = true;
    btnFinalizar.hidden = true;

    respuestaCorrecta = pregunta.correct_answer;
    elementoPregunta.innerHTML = pregunta.question;
    estado.textContent = "Pregunta " + (indicePregunta + 1) + " de " + preguntas.length + ". ¿Es correcto o incorrecto?";

    ["True", "False"].forEach(function (valor) {
        const boton = document.createElement("button");
        boton.type = "button";
        boton.textContent = valor === "True" ? "Verdadero" : "Falso";
        boton.addEventListener("click", function () {
            responder(valor);
        });
        opciones.appendChild(boton);
    });
}

function mostrarError(mensaje) {
    estado.textContent = mensaje;
    elementoPregunta.textContent = "";
    opciones.innerHTML = "";
    resultado.textContent = "";
    nueva.hidden = false;
}

function responder(eleccion) {
    const botones = document.querySelectorAll("#opciones button");

    botones.forEach(function (boton) {
        boton.disabled = true;
    });

    guardarRespuestaTrivia(eleccion);

    if (eleccion === respuestaCorrecta) {
        resultado.textContent = "¡Correcto! (+10 puntos)";
        puntaje += 10;
        mostrarPuntaje.textContent = puntaje;
    } else {
        const respuestaEnEspanol = respuestaCorrecta === "True" ? "Verdadero" : "Falso";
        resultado.textContent = "Incorrecto. La respuesta era " + respuestaEnEspanol + ".";
    }

    nueva.hidden = false;
    btnFinalizar.hidden = false;
}

function guardarRespuestaTrivia(eleccion) {
    const datosGuardados = localStorage.getItem("respuestasTrivia");
    let respuestas = { verdaderas: 0, falsas: 0 };

    if (datosGuardados !== null) {
        respuestas = JSON.parse(datosGuardados);
    }

    if (eleccion === "True") {
        respuestas.verdaderas++;
    } else {
        respuestas.falsas++;
    }

    localStorage.setItem("respuestasTrivia", JSON.stringify(respuestas));
}

nueva.addEventListener("click", cargarPregunta);

btnFinalizar.addEventListener("click", function () {
    window.location.href = "puntajes.html";
});