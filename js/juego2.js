
// ===================== VARIABLES GENERALES ============================ //

let posicionActual = 0;
let intentosRestantes = 5;
let tiempoRestante = 60; // 1 minuto en segundos.
let reloj = null;
let intervaloPasos = null;
let esperaCasillaEspecial = null;
let juegoTerminado = false;

// ==================== CASILLAS ESPECIALES ============================= //

const casillasMalas = [5, 6, 13, 19];  // Si caen acá retroceden 3 casilleros
const casillasBuenas = [3, 9, 15];  // Si caen acá avanzan dos casilleros

function contieneElemento(array, valor) {
  for (let i = 0; i < array.length; i++) {
    if (array[i] === valor) {
      return true;
    }
  }
  return false;
}


// ==================== fUNCIÓN RELOJ ============================= //

function iniciarReloj() {
  if (reloj !== null) return; // Si ya arrancó, no hace nada

  reloj = setInterval(function() {
    tiempoRestante--; // resta 1 segundo
    

    // === Mostramos los segundos en pantalla === //
    const contador = document.getElementById("timer");
    if (contador) {
      contador.textContent = tiempoRestante;
    }



    // === Si llega a 0, se termina el juego === //
    if (tiempoRestante <= 0) {
      terminarJuegoCarrera(false, "⏰ Te quedaste sin tiempo. Juego terminado.");
    }
  }, 1000);
}


// ==================== CREAMOS TABLERO ============================= //

const tablero = document.getElementById('tablero');

for (let i = 1; i <= 20; i++) {
  let casilla = document.createElement('div');
  casilla.classList.add('casilla');
  casilla.id = "casilla-" + i;


  // === Agregamos íconos para identificar casillas bomba y casillas propulsoras === //
  if (contieneElemento(casillasMalas, i)) {
    casilla.classList.add('casillaBomba');
    casilla.textContent = i;
  } else if (contieneElemento(casillasBuenas, i)) {
    casilla.classList.add('casillaBoost');
    casilla.textContent = i;
  } else {
    casilla.textContent = i;
  }

  tablero.append(casilla); // lo agregamos al html
}




// ==================== FUNCIÓN PARA LOS DADOS (AZAR) ============================= //

function generarAzar() {
  if (juegoTerminado) return;

  // === Arrancamos el reloj === //
  iniciarReloj();

  // ========= AZAR DADOS ======== //

  let azar1 = Math.floor(Math.random() * 6) + 1; 
  document.getElementById('imagen-dado1').src = "img/" + azar1 + ".gif";

  let azar2 = Math.floor(Math.random() * 6) + 1; 
  document.getElementById('imagen-dado2').src = "img/" + azar2 + ".gif";

  let avance = azar1 + azar2;
  // === Calculamos posición final === //

  let posicionDestino = posicionActual + avance;
  if (posicionDestino > 20) {
    posicionDestino = 20;
  }



  // === Descontamos el intento (1) === //

  intentosRestantes--;
  document.getElementById("intentos").textContent = intentosRestantes;



  // === Deshabilitamos los botones mientras avanza la fichita === //

  const btnLanzar = document.getElementById("btn-lanzar");
  if (btnLanzar) btnLanzar.disabled = true;




  // ================== MOVIMIENTO DE FICHA ======================== //

  intervaloPasos = setInterval(function() {
    
    if (posicionActual > 0) {
      let casillaAnterior = document.getElementById("casilla-" + posicionActual);
      if (casillaAnterior) casillaAnterior.classList.remove("jugador");    // Borramos la ficha de la casilla en la que ya no está
    }


    posicionActual++;  // Avanzamos el casillero


    let casillaNueva = document.getElementById("casilla-" + posicionActual);
    if (casillaNueva) casillaNueva.classList.add("jugador");     // Destacamos la nueva casilla


    document.getElementById("posicion").textContent = posicionActual;  // Actualizamos el número que se muestra en la pantalla.


    if (posicionActual === posicionDestino) {
      clearInterval(intervaloPasos); // Verificamos si llegó a destino y, si llegó, la frenamos.
      intervaloPasos = null;


      verificarCasillaEspecial();  // Chequeamos si cayó en una casilla buena o mala.
    }

  }, 500); // 500 milisegundos por paso
}


// ============ VERIFICAMOS CASILLAS ================ //

function verificarCasillaEspecial() {
  let casillaActual = document.getElementById("casilla-" + posicionActual);


  // === SI CAYÓ EN UNA CASILLA MALA === //

  if (contieneElemento(casillasMalas, posicionActual)) {
    casillaActual.classList.add("explosion"); // le agregamos una clase con estilo de bomba pum
    
    esperaCasillaEspecial = setTimeout(function() {
      esperaCasillaEspecial = null;
      if (juegoTerminado) return;
      alert("💣 ¡Caíste en una casilla bomba! Retrocedés 3 casilleros.");
      
      // Le quitamos la ficha y la clase de explosión
      casillaActual.classList.remove("jugador", "explosion");
      
      // Retrocede 3 casilleros
      posicionActual -= 3;
      if (posicionActual < 1) posicionActual = 1;
      
      // Ubicamos la ficha en la nueva posición 
      document.getElementById("casilla-" + posicionActual).classList.add("jugador");
      document.getElementById("posicion").textContent = posicionActual;
      verificarFinJuego();
    }, 300);
  } 
  


  // === SI CAYÓ EN UNA CASILLA BUENA === //

  else if (contieneElemento(casillasBuenas, posicionActual)) {
    casillaActual.classList.add("super-boost"); // Clase CSS para efecto visual
    
    esperaCasillaEspecial = setTimeout(function() {
      esperaCasillaEspecial = null;
      if (juegoTerminado) return;
      alert("🚀 ¡Obtuviste un BOOST! Avanzas dos casilleros.");
      
      casillaActual.classList.remove("jugador", "super-boost");
      
      // Avanza 2 casilleros
      posicionActual += 2;
      if (posicionActual > 20) posicionActual = 20;
      
      document.getElementById("casilla-" + posicionActual).classList.add("jugador");
      document.getElementById("posicion").textContent = posicionActual;
      verificarFinJuego();
    }, 300);
  } else {
    verificarFinJuego();
  }
}


 // ============= VERIFICAMOS SI LA PARTIDA TERMINÓ, SI GANÓ O PERDIÓ POR INTENTOS ================== //

function verificarFinJuego() {
  if (juegoTerminado) return;

  if (posicionActual >= 20) {
    terminarJuegoCarrera(true, "🎉 ¡Estas con suerte! ¡Ganaste!");

  } else if (intentosRestantes <= 0) {
    terminarJuegoCarrera(false, "Te quedaste sin intentos. ¡Intenta de nuevo!");
  } else {
    document.getElementById("btn-lanzar").disabled = false;
  }
}

function terminarJuegoCarrera(ganada, mensaje) {
  if (juegoTerminado) return;

  juegoTerminado = true;
  clearInterval(reloj);
  reloj = null;

  if (intervaloPasos !== null) {
    clearInterval(intervaloPasos);
    intervaloPasos = null;
  }

  document.getElementById("btn-lanzar").disabled = true;
  guardarPartidaCarrera(ganada);
  alert(mensaje);
}

// ================= FUNCIÓN PARA GUARDAR EN EL LOCAL STORAGE ================ //

function guardarPartidaCarrera(ganada) {
    let historialGuardado = localStorage.getItem("historialCarrera");
    let historial = [];

    if (historialGuardado !== null) {
        historial = JSON.parse(historialGuardado);
    }

    let intentosUsados = 5 - intentosRestantes;

    let partida = {
        resultado: ganada ? "Victoria" : "Derrota",
        detalle: ganada 
            ? intentosUsados + " intentos | Sobraron " + tiempoRestante + "s"
            : "Llegó al casillero " + posicionActual,
        ganada: ganada, 
        tiempoRestante: tiempoRestante, 
        intentosUsados: intentosUsados
    };

    let historialNuevo = [partida];
    for (let i = 0; i < historial.length; i++) {
        historialNuevo[i + 1] = historial[i];
    }
    historial = historialNuevo;
    localStorage.setItem("historialCarrera", JSON.stringify(historial));
}


// ================= FUNCIÓN DEL BOTÓN PARA INICIAR UN NUEVO JUEGO ================ //

function reiniciarJuego() {
  
  if (intervaloPasos) {
    clearInterval(intervaloPasos);
    intervaloPasos = null;
  }

  if (esperaCasillaEspecial !== null) {
    clearTimeout(esperaCasillaEspecial);
    esperaCasillaEspecial = null;
  }

  const btnLanzar = document.getElementById("btn-lanzar");
  if (btnLanzar) btnLanzar.disabled = false;

  clearInterval(reloj);   //limpiamos el reloj


  //removemos las clases
  if (posicionActual > 0) {
    let casillaAnterior = document.getElementById("casilla-" + posicionActual);
    if (casillaAnterior) {
      casillaAnterior.classList.remove("jugador", "explosion", "super-boost");
    }
  }

  posicionActual = 0;
  intentosRestantes = 5;
  tiempoRestante = 60; // 1 minuto en segundos.
  reloj = null;
  intervaloPasos = null;
  juegoTerminado = false;

  document.getElementById("posicion").textContent = posicionActual;
  document.getElementById("intentos").textContent = intentosRestantes;
  document.getElementById("timer").textContent = tiempoRestante;


  const dado1 = document.getElementById('imagen-dado1');
  const dado2 = document.getElementById('imagen-dado2');
  if (dado1) dado1.src = "img/1.gif"; 
  if (dado2) dado2.src = "img/1.gif";


}

document.getElementById("btn-lanzar").addEventListener("click", generarAzar);
document.getElementById("btn-reiniciar").addEventListener("click", reiniciarJuego);