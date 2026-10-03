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