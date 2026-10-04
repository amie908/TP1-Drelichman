// 1. Constante para conectar con la API de trivia (preguntas V/F)
const endpoint = "https://opentdb.com/api.php?amount=10&category=9&difficulty=medium&type=boolean";

/*
1 Capturar elementos del dom. Solo captura. Primero creamos las variables utiles según el juego. CONST para que no puedan ser modificadas. Sirven para capturar elementos del DOM con document.querySelector con el id asignado. 
Luego declaracion de variables 
2 Comienza el bucle del juego.   
3 Se procesa la pregunta 
4 Guardar puntaje
5

/* Notificación de errores (docu)
Muestra un mensaje en caso de error con la respuesta de la api:
	Code 0: Success Returned results successfully.
    Code 1: No Results Could not return results. The API doesn't have enough questions for your query. (Ex. Asking for 50 Questions in a Category that only has 20.)
    Code 2: Invalid Parameter Contains an invalid parameter. Arguements passed in aren't valid. (Ex. Amount = Five)
    Code 3: Token Not Found Session Token does not exist.
    Code 4: Token Empty Session Token has returned all possible questions for the specified query. Resetting the Token is necessary.
    Code 5: Rate Limit Too many requests have occurred. Each IP can only access the API once every 5 seconds.

*/




/* Captura de elementos del DOM de la pantalla de registro de nombre*/
const pantallaRegistro = document.querySelector("#pantalla-registro"); /* contenedor del registro */
const inputNombre = document.querySelector("#input-nombre"); /* elemento input del nombre */
const btnComenzar = document.querySelector("#btn-comenzar"); /* captura boton de inicio */



/* Captura de lementos de la pantalla de juego */
const pantallaJuego = document.querySelector("#pantalla-juego"); /*comtemedor de inicio por id*/
const mostrarNombre = document.querySelector("#mostrar-nombre"); /* captura el nombre que se va a mostrar*/
const mostrarPuntaje = document.querySelector("#mostrar-puntaje"); /* captura puntaje a mostrar */
const estado = document.querySelector("#estado"); /* mostrara informacion de estado */
const elementoPregunta = document.querySelector("#pregunta"); /* elemento p donde se va a mostrar la pregunta */
const opciones = document.querySelector("#opciones"); /* contenedor v/f */
const resultado = document.querySelector("#resultado"); // contenedor de respuesta correcta o incorrecta
const nueva = document.querySelector("#nueva"); //boton para seguir respondiendo
const btnFinalizar = document.querySelector("#btn-finalizar"); //guardar y ver tablero de puntaje
//variables que se van a manipular mas adelante
let respuestaCorrecta = ""; //aca se guarda la solucion v o f de la api 
let nombreJugador = ""; //el nombre del jugador  
let puntaje = 0; //inicia el contador en 0 (sugerido por la ia)



//Mostrar pantalla de juego
btnComenzar.addEventListener("click", () => { //escuchar el evento click
    /* Tomamos el nombre ingresado o asignamos un nombre por defecto si está vacío
	quitar espacios y nombre por defecto fue sugerido por la ia */
    nombreJugador = inputNombre.value.trim() || "Jugador Anónimo";  
    mostrarNombre.textContent = nombreJugador; //incluye en texto en el elemto html con id mostrarnombre
    // Ocultamos la pantalla de registro y mostramos la pantalla de la trivia (comentar solucion ia)
	pantallaRegistro.style.display = "none"; 
    pantallaJuego.style.display = "block";
    cargarPregunta(); // llama a la funcion para comenzar el bucle del juego
});



// funcion para errores de la API
function mostrarError(mensaje) {  
    estado.textContent = mensaje; // texto del error en el elemento estado
    elementoPregunta.textContent = ""; //limpia el texto del elemento de la pregunta para evitar jugar
    opciones.innerHTML = ""; // idem opciones
    resultado.textContent = ""; //idem resultado 
    nueva.hidden = false; // se muestra el boton de nueva pregunta para poder continuar

}
//comienza el bucle del juego
/* función asincrónica: usa async y wait para esperar que el servidor responda el pedido */
async function cargarPregunta() {
    estado.textContent = "Cargando pregunta..."; //estado del juego
    elementoPregunta.textContent = ""; //limpia el espacio de la pregunta
    opciones.innerHTML = ""; //limpia botones del intento anterior
    resultado.textContent = ""; //limpia el resultado del intento anterior 
    nueva.hidden = true; // oculta nueva pregunta mientras se carga la actual


	/* validaciones. si da error salta a catch */
    try { //para capturar errores. se intento responder a todos los codigod pero no tenia sentido
        const respuesta = await fetch(endpoint); /* fetcht permite descargar info de un servidor, se guarda en "respuesta". */
        if (!respuesta.ok) {/* si respuesta difiere de ok... */ 
            throw new Error(`HTTP ${respuesta.status}`);/* throw interrumpe la ejecución y muestra error */
        }
        
        const datos = await respuesta.json();/* convierte la respuesta json en un objeto javascript. "respuesta" tiene info sobre la solicitud y "datos" contiene el JSON convertido en objetos y arrays.*/
/* Si el código de respuesta difiere de 0, o el largo del string es 0, significa que no llegó respuesta y muestra error HTTP y el còdigo*/
        if (datos.response_code !== 0 || datos.results.length === 0) {
            throw new Error("No hay preguntas en este momento.");
        }
/* elegimos los datos que necesitamos de todas las respuestas de la api*/
        const pregunta = datos.results[0]; /* Accede a la lista o arreglo results dentro del objeto datos y toma el primer elemento ([0]) en una constante llamada pregunta. En results estan todos los resultados enviados por la api*/
        respuestaCorrecta = pregunta.correct_answer; /* toma el valor correct_answer de la pregunta y lo guarda en respuestaCorrecta */
        elementoPregunta.innerHTML = pregunta.question; /* asigna el contenido de pregunta.questionen en el html pregunta */
        estado.textContent = "¿Es correcto o incorrecto?"; /* inserta el texto en estado para mostrar en pantalla */

        /* botones v y f. en lugar de hacer los botones por sepado se aplica foreach para aplicar el codigo a cada boton */
        ["True", "False"].forEach((valor) => {
            const boton = document.createElement("button"); /* crea el elemento boton en el DOM*/
            boton.type = "button"; /* atributo de tipo boton */
            boton.textContent = valor === "True" ? "Verdadero" : "Falso"; /* if ternario. si es true llamarlo verdadero. sino, falso */
            boton.addEventListener("click", () => responder(valor, boton)); /* escucha el evento click. activa la funcion flecha "responder" */
            opciones.append(boton); /* agrega al contenedor html el boton creado anteriormente*/
        });


/* si ocurre un error en el bloque de codigo del tray de cargar pregunta lo atrapa aca */
    } catch (error) { 
        mostrarError(`No se pudo cargar la pregunta: ${error.message}`); /*recurre a la funcion mostrarError con un mensaje para el html*/
    }
}


function responder(eleccion, botonElegido) { // Deshabilitamos todos los botones una vez elegido
    document.querySelectorAll("#opciones button").forEach((boton) => {
        boton.disabled = true;
    });

    //Validacion de respuesta. Puntaje con ayuda de ia
    if (eleccion === respuestaCorrecta) { //comparacion entre respuesta y respuesta correcta
        resultado.textContent = "¡Correcto! (+10 puntos)";
        puntaje += 10; // Sumamos 10 puntos al puntaje acumulado
        mostrarPuntaje.textContent = puntaje; // Actualizamos en la pantalla
    } else { //si el jugador no eligio la correcta
        resultado.textContent = `Incorrecto. La respuesta era ${respuestaCorrecta === "True" ? "Verdadero" : "Falso"}.`;
    }

    // Se habilitan los botones de jugar o guardar y salir.
    nueva.hidden = false;
    btnFinalizar.hidden = false;
}

//Al capturar evento click guardar puntaje con sessionStorage y pasa al puntaje (sugerencia de ia)
btnFinalizar.addEventListener("click", () => {
    // cadena con la fecha de ese momento
    const fechaActual = new Date().toLocaleDateString();
    // Objeto con los datos de la partida
    const nuevaPartida = { 
        jugador: nombreJugador,
        puntos: puntaje,
        fecha: fechaActual
    };

    // consultar en el historial si ya tiene una partida (sugerencia ia)
    const historialPrevio = sessionStorage.getItem("historialTrivia");
	//Si hay datos, transforma el JSON a lista JavaScript; si no, crea una lista vacía (sugerencia ia)
    const listaPartidas = historialPrevio ? JSON.parse(historialPrevio) : [];
    // Pushea una nueva partida para añadie elementos al final del array
    listaPartidas.push(nuevaPartida);
    // convierte la linsta en texti json  y guarda en sessionStorage
    sessionStorage.setItem("historialTrivia", JSON.stringify(listaPartidas));
    //Envia a la pagina de puntajes (sugerencia de ia)
    window.location.href = "puntajes.html";
});

// Evento para el botón de "Siguiente Pregunta"
nueva.addEventListener("click", cargarPregunta);