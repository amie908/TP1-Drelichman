	
const endpoint = "https://opentdb.com/api.php?amount=10&category=9&difficulty=medium&type=boolean"; /*<- conecta con la api. pide 1 pregunta tipo V-F*/

/*
1 capturar elementos de html
2  
3
4
5
*/


/* Variables de captura.
Primero creamos las variables utiles según el juego. CONST para que no puedan ser modificadas. Sirven para capturar elementos del DOM con document.querySelector con el id asignado (el texto de carga/error, el texto de la pregunta, los botones de opción, el mensaje final y el botón para cargar otra pregunta). 
*/
const espera = document.querySelector("#espera"); /* texto de carga/error */
const elementoPregunta = document.querySelector("#pregunta"); /* el texto de la pregunta */
const opciones = document.querySelector("#opciones"); /* los botones de opción */
const resultado = document.querySelector("#resultado"); /* el mensaje final */
const reintentar = document.querySelector("#reintentar"); /* botón para cargar otra pregunta */
let respuestaCorrecta = ""; /* Se reserva temporalmente para la solución booleana devuelta por la api*/








/* Notificación de errores
Muestra un mensaje en caso de error con la respuesta de la api:
	Code 0: Success Returned results successfully.
    Code 1: No Results Could not return results. The API doesn't have enough questions for your query. (Ex. Asking for 50 Questions in a Category that only has 20.)
    Code 2: Invalid Parameter Contains an invalid parameter. Arguements passed in aren't valid. (Ex. Amount = Five)
    Code 3: Token Not Found Session Token does not exist.
    Code 4: Token Empty Session Token has returned all possible questions for the specified query. Resetting the Token is necessary.
    Code 5: Rate Limit Too many requests have occurred. Each IP can only access the API once every 5 seconds.

La clase rojo en estado es de caracter estetico y funciona en el css.
Visibiliza el boton de nueva pregunta quese mantenía oculto mientras se espera la respuesta de la api.
*/
function mostrarError(mensaje) { /*función para mostrar "mensaje" como error*/
	estado.textContent = mensaje; /* asigna el contenido de "mensaje" al contenido html de "estado" para mostrar en pantalla */
	/*estado.className = "rojo";  asigna clase estetica de css */
	elementoPregunta.textContent = ""; /* igual que estado, pero asiga espacio vacío (no muestra nada) */
	opciones.innerHTML = ""; /* idem que elemento pregunta */
	resultado.textContent = ""; /* idem */
	nueva.hidden = false; /* muestra el boton de nueva pregunta */
}
/* */







/* función asincrónica
usa async y wait para esperar que el servidor responda el pedido.
 */
async function cargarPregunta() { /* función asincrónica para esperar respuesta de api para optener datos */
  /*estado.className = "gris";   actualiza el color de estado */
	estado.textContent = "Cargando pregunta..."; /* asigna un mensaje al contenido html de "estado" */
	elementoPregunta.textContent = ""; /* elemento pregunta pasa a vacío porque no hay pregunta */
	opciones.innerHTML = ""; /* vacia html de "opciones" */
	resultado.textContent = ""; /* vacía el contenido de texto de resultado */
	nueva.hidden = true; /* se oculta nueva pregunta */


	
	
	
	/* validaciones. si da error salta a catch */
		try {
			const respuesta = await fetch(endpoint); /* fetcht permite descargar info de un servidor, se guarda en "respuesta". */
			if (!respuesta.ok) { /* si respuesta difiere de ok... */ 
				throw new Error(`HTTP ${respuesta.status}`); /* throw interrumpe la ejecución y muestra error */
    }
    const datos = await respuesta.json(); /* convierte la respuesta json en un objeto javascript. "respuesta" tiene info sobre la solicitud y "datos" contiene el JSON convertido en objetos y arrays.*/
	
/* Si el código de respuesta difiere de 0, o el largo del string es 0, significa que no llegó respuesta y muestra error HTTP y el còdigo*/
    if (datos.response_code !== 0 || datos.results.length === 0) {       
      throw new Error("No hay preguntas en este momento."); 
    }
	/* elegimos los datos que necesitamos de todas las respuestas de la api*/
	const pregunta = datos.results[0];	/* Accede a la lista o arreglo results dentro del objeto datos y toma el primer elemento ([0]) en una constante llamada pregunta. En results estan todos los resultados enviados por la api*/
    respuestaCorrecta = pregunta.correct_answer; /* toma el valor correct_answer de la pregunta y lo guarda en respuestaCorrecta */
    elementoPregunta.innerHTML = pregunta.question; /* asigna el contenido de pregunta.questionen en el html pregunta */
    estado.textContent = "¿Es correcto o incorrecto?"; /* inserta el texto en estado para mostrar en pantalla */





/* botones v y f */
    ["True", "False"].forEach((valor) => { /* crea un array con los elementos de la api. con foreach corre una funcion en cada elemento: crea botones para cada elemento del array */
      const boton = document.createElement("button"); /* crea el elemento boton en el DOM*/
      boton.type = "button"; /* atributo de tipo boton */
      boton.textContent = valor === "True" ? "Verdadero" : "Falso"; /* if ternario. si es true llamarlo verdadero. sino, falso */
      boton.addEventListener("click", () => responder(valor, boton)); /* escucha el evento click. activa la funcion flecha "responder" */
      opciones.append(boton); /* agrega al contenedor html el boton creado anteriormente*/
	 
    });
  } catch (error) { /* si ocurre un error en el bloque de codigo del tray de cargar pregunta lo atrapa aca */
    mostrarError(`No se pudo cargar la pregunta: ${error.message}`); /*recurre a la funcion mostrarError con un mensaje para el html*/
  }
}

function responder(eleccion, botonElegido) { /* funcion "pregunta" recibe "eleccion" del usuario y "botonElegido" */
  document.querySelectorAll("#opciones button").forEach((boton) => { /* toma todo lo que tenga id opciones y button en el dom */
    boton.disabled = true; /* desactiva boton */
  });

  if (eleccion === respuestaCorrecta) { /* compara eleccion con respuesta correcta... */
    resultado.textContent = "Correcto"; /* ...si son iguales muestra correcto... */
  } else { /* ...sino... */
    resultado.textContent = `Incorrecto. La respuesta era ${respuestaCorrecta === "True" ? "Verdadero" : "Falso"}.`;
  } /* ...muestra si la correcta era v o f (si es true: V, sino, F) */

  /* botonElegido.focus(); */
  nueva.hidden = false; /* habilita el boton para preguntar otra vez */
}

nueva.addEventListener("click", cargarPregunta); /* captura el evento click y llama a la funcion cargar pregunta */
cargarPregunta();
