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

        crearCelda(fila, partida.fecha);
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
        crearCelda(fila, partida.fecha);
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

    let textoRecord = document.querySelector("record-carrera");

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