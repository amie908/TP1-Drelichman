
//Creamos tablero con bucle

const tablero = document.getElementById('tablero');

for (let i = 1; i <= 20; i++) {
  let casilla= document.createElement('div');
  casilla.classList.add('casilla');  //Le agregamos la clase del css
  casilla.textContent = i;
  tablero.append(casilla);      //Agregamos al html lo que acabamos de crear
}

// Creamos la función de los dados

function generarAzar() {

// AZAR DADO 1 
let azar1 = Math.floor(Math.random() * 6) + 1; 
let imagen1 = document.getElementById('imagen-dado1');
imagen1.src = "img/" + azar1 + ".gif";

//AZAR DADO 2
let azar2 = Math.floor(Math.random() * 6) + 1; 
let imagen2 = document.getElementById('imagen-dado2');
imagen2.src = "img/" + azar2 + ".gif";

//resultado

let avance = azar1 + azar2;
console.log("Avanza:", avance, "casilleros");

}