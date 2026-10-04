function formatearTiempoPuntajes(segundos) {
    let minutos = Math.floor(segundos / 60);
    let restoSegundos = segundos % 60;

    if (minutos < 10) {
        minutos = "0" + minutos;
    }

    if (restoSegundos < 10) {
        restoSegundos = "0" + restoSegundos;
    }

    return minutos + ":" + restoSegundos;
}

function crearCelda(fila, texto) {
    let celda = document.createElement("td");
    celda.textContent = texto;
    fila.appendChild(celda);
}

// ============================ PUNTAJE TRIVIA ================================ //
// Se ejecuta automáticamente cuando todo el HTML de la página termina de cargarse
document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Capturamos los elementos donde mostraremos los datos de la Trivia
    const cuerpoTabla = document.querySelector("#historial-trivia");
    const contenedorRecord = document.querySelector("#record-trivia");

    // 2. Leemos la clave "historialTrivia" almacenada en el sessionStorage
    const datosGuardados = sessionStorage.getItem("historialTrivia");

    // 3. Verificamos si existen datos guardados en la sesión
    if (datosGuardados) {
        // Convertimos la cadena de texto JSON de vuelta a un arreglo de objetos JavaScript
        const listaPartidas = JSON.parse(datosGuardados);

        // Limpiamos el texto por defecto de la tabla
        cuerpoTabla.innerHTML = "";

        // Variable para rastrear el puntaje más alto
        let mejorPuntaje = 0;
        let mejorJugador = "";

        // 4. Recorremos cada partida registrada en la lista
        listaPartidas.forEach((partida) => {
            // Evaluamos si esta partida supera el récord actual
            if (partida.puntos > mejorPuntaje) {
                mejorPuntaje = partida.puntos;
                mejorJugador = partida.jugador;
            }

            // Creamos una nueva fila (tr) para la tabla
            const fila = document.createElement("tr");

            // Rellenamos el contenido HTML de la fila con las celdas (td)
            fila.innerHTML = `
                <td>${partida.fecha}</td>
                <td>${partida.jugador}</td>
                <td>${partida.puntos} pts</td>
            `;

            // Insertamos la fila dentro del tbody
            cuerpoTabla.appendChild(fila);
        });

        // 5. Mostramos el mejor récord encontrado
        if (mejorJugador !== "") {
            contenedorRecord.textContent = `🏆 ${mejorJugador} con ${mejorPuntaje} puntos.`;
        } else {
            contenedorRecord.textContent = `Aún no hay récords registrados.`;
        }

    } else {
        // Si no se encuentra nada guardado en sessionStorage
        cuerpoTabla.innerHTML = `
            <tr>
                <td colspan="3">Aún no hay partidas de Trivia registradas en esta sesión.</td>
            </tr>
        `;
        contenedorRecord.textContent = "Todavía no hay partidas registradas.";
    }
});

// ============================ PUNTAJE MEMOTEST ================================ //

function mostrarHistorialMemotest(historial) {
    let cuerpoTabla = document.getElementById("historial-memotest");
    cuerpoTabla.innerHTML = "";

    if (historial.length === 0) {
        let fila = document.createElement("tr");
        let celda = document.createElement("td");
        celda.textContent = "Todavía no hay partidas registradas.";
        celda.colSpan = 5;
        fila.appendChild(celda);
        cuerpoTabla.appendChild(fila);
        return;
    }

    for (let i = 0; i < historial.length; i++) {
        let partida = historial[i];
        let fila = document.createElement("tr");

        crearCelda(fila, "Partida " + (historial.length - i));
        crearCelda(fila, partida.resultado);
        crearCelda(fila, partida.movimientos);
        crearCelda(fila, partida.parejas + " de 8");
        crearCelda(fila, formatearTiempoPuntajes(partida.tiempoRestante));

        cuerpoTabla.appendChild(fila);
    }
}

function mostrarMejorRecordMemotest(historial) {
    let mejorPartida = null;

    for (let i = 0; i < historial.length; i++) {
        let partida = historial[i];

        if (partida.ganada) {
            if (mejorPartida === null || partida.movimientos < mejorPartida.movimientos) {
                mejorPartida = partida;
            } else if (partida.movimientos === mejorPartida.movimientos && partida.tiempoRestante > mejorPartida.tiempoRestante) {
                mejorPartida = partida;
            }
        }
    }

    let textoRecord = document.getElementById("record-memotest");

    if (mejorPartida === null) {
        textoRecord.textContent = "Todavía no hay partidas ganadas.";
    } else {
        textoRecord.textContent = mejorPartida.movimientos + " movimientos; terminó con " + formatearTiempoPuntajes(mejorPartida.tiempoRestante) + " restantes.";
    }
}

function cargarPuntajesMemotest() {
    let historialGuardado = localStorage.getItem("historialMemotest");
    let historial = [];

    if (historialGuardado !== null) {
        historial = JSON.parse(historialGuardado);
    }

    mostrarHistorialMemotest(historial);
    mostrarMejorRecordMemotest(historial);
}

cargarPuntajesMemotest();


// ============================ PUNTAJE CARRERA DADOS ================================ //

function mostrarHistorialCarrera(historial) {
    let cuerpoTabla = document.getElementById("historial-carrera");
    if (!cuerpoTabla) return;

    cuerpoTabla.innerHTML = "";

    if (historial.length === 0) {
        let fila = document.createElement("tr");
        let celda = document.createElement("td");
        celda.textContent = "Todavía no hay partidas registradas.";
        celda.colSpan = 3;
        fila.appendChild(celda);
        cuerpoTabla.appendChild(fila);
        return;
    }

    for (let i = 0; i < historial.length; i++) {
        let partida = historial[i];
        let fila = document.createElement("tr");

        // uso la funcion crearCelda que creó Lili
        crearCelda(fila, "Partida " + (historial.length - i));
        crearCelda(fila, partida.resultado);
        crearCelda(fila, partida.detalle);

        cuerpoTabla.appendChild(fila);
    }
}

// MEJOR RECORD 

function mostrarMejorRecordCarrera(historial) {
    let mejorPartida = null;

    // Buscamos la partida ganada en la que haya sobrado más tiempo
    for (let i = 0; i < historial.length; i++) {
        let partida = historial[i];

        if (partida.ganada) {
            if (mejorPartida === null || partida.tiempoRestante > mejorPartida.tiempoRestante) {
                mejorPartida = partida;
            }
        }
    }

    let textoRecord = document.getElementById("record-carrera");

    if (textoRecord) {
        if (mejorPartida === null) {
            textoRecord.textContent = "Todavía no hay partidas ganadas.";
        } else {
            textoRecord.textContent = "Terminó con " + formatearTiempoPuntajes(mejorPartida.tiempoRestante) + " restantes.";
        }
    }
}

// CARGA DE PUNTOS 

function cargarPuntajesCarrera() {
    let historialGuardado = localStorage.getItem("historialCarrera");
    let historial = [];

    if (historialGuardado !== null) {
        historial = JSON.parse(historialGuardado);
    }

    mostrarHistorialCarrera(historial);   // Llena la tabla
    mostrarMejorRecordCarrera(historial); // Actualiza el texto del récord
}

cargarPuntajesCarrera();