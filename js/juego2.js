
// ===================== VARIABLES GENERALES ============================ //

let posicionActual = 0;
let intentosRestantes = 10;
let tiempoRestante = 120; // 2 minutos expresados en segundos
let reloj = null;

// ==================== CASILLAS ESPECIALES ============================= //

const casillasMalas = [5, 12, 17];  // Si caen acá retroceden 3 casilleros
const casillasBuenas = [3, 9, 15];  // Si caen acá avanzan dos casilleros


// ==================== fUNCIÓN RELOJ ============================= //

function iniciarReloj() {
  if (reloj !== null) return; // Si ya arrancó, no hace nada

  reloj = setInterval(function() {
    tiempoRestante--; // resta 1 segundo
    

    // === Mostramos los segundos en pantalla === //
    const elemTimer = document.getElementById("timer");
    if (elemTimer) {
      elemTimer.textContent = tiempoRestante;
    }



    // === Si llega a 0, se termina el juego === //
    if (tiempoRestante <= 0) {
      clearInterval(reloj);
      const btnLanzar = document.getElementById("btn-lanzar");
      if (btnLanzar) btnLanzar.disabled = true;
      alert("⏰ Te quedaste sin tiempo. Juego terminado.");
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
  if (casillasMalas.includes(i)) {
    casilla.classList.add('trampa');
    casilla.textContent = i + " 💣";
  } else if (casillasBuenas.includes(i)) {
    casilla.classList.add('boost');
    casilla.textContent = i + " 🚀";
  } else {
    casilla.textContent = i;
  }

  tablero.append(casilla); // lo agregamos al html
}




// ==================== FUNCIÓN PARA LOS DADOS (AZAR) ============================= //

function generarAzar() {

  // === Arrancamos el reloj === //
  iniciarReloj();

  // ========= AZAR DADOS ======== //

  let azar1 = Math.floor(Math.random() * 6) + 1; 
  document.getElementById('imagen-dado1').src = "img/" + azar1 + ".gif";

  let azar2 = Math.floor(Math.random() * 6) + 1; 
  document.getElementById('imagen-dado2').src = "img/" + azar2 + ".gif";

  let avance = azar1 + azar2;
  console.log("Avanza:", avance, "casilleros");



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

  let pasoAMp = setInterval(function() {
    
    if (posicionActual > 0) {
      let casillaAnterior = document.getElementById("casilla-" + posicionActual);
      if (casillaAnterior) casillaAnterior.classList.remove("jugador");    // Borramos la ficha de la casilla en la que ya no está
    }


    posicionActual++;  // Avanzamos el casillero


    let casillaNueva = document.getElementById("casilla-" + posicionActual);
    if (casillaNueva) casillaNueva.classList.add("jugador");     // Destacamos la nueva casilla


    document.getElementById("posición").textContent = posicionActual;  // Actualizamos el número que se muestra en la pantalla.


    if (posicionActual === posicionDestino) {
      clearInterval(pasoAMp); // Verificamos si llegó a destino y, si llegó, la frenamos.


      if (intentosRestantes > 0 && posicionActual < 20 && tiempoRestante > 0) {
        if (btnLanzar) btnLanzar.disabled = false;   // Habilitamos el botón si quedan intentos
      }

      verificarCasillaEspecial();  // Chequeamos si cayó en una casilla buena o mala.
    }

  }, 500); // 500 milisegundos por paso
}


// ============ VERIFICAMOS CASILLAS ================ //

function verificarCasillaEspecial() {
  let casillaActualElem = document.getElementById("casilla-" + posicionActual);


  // === SI CAYÓ EN UNA CASILLA MALA === //

  if (casillasMalas.includes(posicionActual)) {
    casillaActualElem.classList.add("explosion"); // le agregamos una clase con estilo de bomba pum
    
    setTimeout(function() {
      alert("💣 ¡Caíste en una casilla bomba! Retrocedés 3 casilleros.");
      
      // Le quitamos la ficha y la clase de explosión
      casillaActualElem.classList.remove("jugador", "explosion");
      
      // Retrocede 3 casilleros
      posicionActual -= 3;
      if (posicionActual < 1) posicionActual = 1;
      
      // Ubicamos la ficha en la nueva posición de castigo
      document.getElementById("casilla-" + posicionActual).classList.add("jugador");
      document.getElementById("posición").textContent = posicionActual;
    }, 300);
  } 
  


  // === SI CAYÓ EN UNA CASILLA BUENA === //

  else if (casillasBuenas.includes(posicionActual)) {
    casillaActualElem.classList.add("super-boost"); // Clase CSS para efecto visual
    
    setTimeout(function() {
      alert("🚀 ¡Obtuviste un BOOST! Avanzas dos casilleros.");
      
      casillaActualElem.classList.remove("jugador", "super-boost");
      
      // Avanza 2 casilleros
      posicionActual += 2;
      if (posicionActual > 20) posicionActual = 20;
      
      document.getElementById("casilla-" + posicionActual).classList.add("jugador");
      document.getElementById("posición").textContent = posicionActual;
    }, 300);
  }

  // Verificamos si ganó o perdió la partida
  verificarFinJuego();
}

function verificarFinJuego() {
  if (posicionActual >= 20) {
    clearInterval(reloj); // Frenamos el timer
    alert("🎉 ¡Llegaste a la meta y ganaste la carrera!");
    document.getElementById("btn-lanzar").disabled = true;
  } else if (intentosRestantes <= 0) {
    clearInterval(reloj);
    alert("Te quedaste sin intentos. ¡Intenta de nuevo!");
    document.getElementById("btn-lanzar").disabled = true;
  }
}
