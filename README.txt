# Galería de juegos — TP1

## Datos del grupo

- **Integrantes:** Lilén Buckley, Victoria González y Alejandro Iribarren
- **Materia:** Informática General
- **Cátedra:** Drelichman
- **Comisión:** Turno noche
- **Año:** 2026

## Descripción del proyecto

Este sitio reúne tres juegos desarrollados con HTML, CSS y JavaScript. Cada juego se puede jugar desde el navegador y las páginas comparten un menú de navegación. La página de Puntajes presenta los resultados guardados en el navegador.

**Idea del proyecto y decisiones del grupo:** El proceso del reparto del trabajo fue bastante orgánico. Cada quien escogió la parte que mas le interesaba y se puso a trabajar por su cuenta, unificando criterios por mensaje y mediante commits de github. Lilén realizó la primera propuesta concreta del diseño y desde ahí comenzamos a codificar el proyecto. Los últimos días antes de la entrega se utilizaron para revisar y unificar todas las páginas del proyecto.

## Juegos

### 1. Trivia

- **Objetivo:** responder preguntas de verdadero o falso.
- **Cómo se juega:** se ingresa un nombre y se responde cada pregunta eligiendo Verdadero o Falso. La Trivia carga hasta 10 preguntas y permite finalizar antes.
- **Puntajes:** durante la partida se suman puntos por las respuestas correctas. En la página de Puntajes se acumula cuántas veces se eligió cada opción: Verdadero o Falso.
- **API:** las preguntas se obtienen de [Open Trivia DB](https://opentdb.com/).

### 2. Carrera de la suerte

- **Objetivo:** llegar a la casilla 20 antes de quedarse sin lanzamientos o tiempo.
- **Cómo se juega:** se lanzan dos dados y la ficha avanza según su resultado, en el recorrido por el tablero hay casillas especiales que te hacen retroceder o avanzar.
- **Fin de la partida:** se gana al llegar a la meta. Se pierde al agotar los cinco lanzamientos o el minuto disponible.
- **Puntajes:** se guarda el historial de partidas y el mejor récord de victoria.
- **Detalles:** el juego Carrera de la Suerte busca generar una expectativa en el usuario y dejar su triunfo al azar. Desde JavaScript se crea el tablero, se mueve la ficha y se evalúa la posición de ésta. Contiene casillas especiales Bomba y Boost (destacadas desde el css), las cuales te hacen avanzar o retroceder casilleros. El juego se gana cuando llegás a la casilla número 20 antes de que se acabe el minuto o te quedes sin intentos. Observamos capacidad de mejora en su dificultad y re-jugabilidad. También en la experiencia de usuario donde podría ser más claro el estado actual en el que se encuentra el jugador en cada momento del juego.


### 3. Memotest

- **Objetivo:** encontrar ocho pares de cartas españolas.
- **Cómo se juega:** se inicia la partida y se descubren dos cartas por turno.
- **Fin de la partida:** se gana al encontrar todos los pares antes de que termine el minuto y medio disponible; si el tiempo llega a cero, se pierde.
- **Puntajes:** se guardan el historial, los movimientos y el tiempo restante. El mejor récord prioriza menos movimientos y, en caso de empate, más tiempo restante.

## Estructura de archivos

```text
TP1-Drelichman/
├── README.md
├── index.html             # Inicio
├── primerjuego.html       # Trivia
├── segundojuego.html      # Carrera de la suerte
├── tercerjuego.html       # Memotest
├── puntajes.html          # Página de puntajes
├── proyecto.html          # Integrantes y desarrollo del proyecto
├── css/
│   └── estilo.css         # Estilos compartidos
├── img/                   # Cartas, dados, encabezados e integrantes
└── js/
    ├── juego1.js          # Lógica de la Trivia
    ├── juego2.js          # Lógica de la Carrera
    ├── juego3.js          # Lógica del Memotest
    └── puntajes.js        # Lógica de la página de puntajes
```

## Recursos, API y almacenamiento

- **Imágenes:** cartas, dados, encabezados e integrantes, dentro de `img/`.
- **Fuentes:** [Press Start 2P](https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap) y Geist Pixel.
- **API:** [Open Trivia DB](https://opentdb.com/), utilizada para las preguntas de la Trivia.
- **Almacenamiento:** se usa `localStorage` y JSON para conservar los contadores de la Trivia y los historiales de la Carrera y el Memotest en el navegador.
- **Temporizadores:** la Carrera tiene un minuto y el Memotest, un minuto y treinta segundos.

## Tecnologías

- **HTML** para estructurar las páginas y la navegación.
- **CSS** para los estilos compartidos y la disposición de los elementos con Flexbox.
- **JavaScript** para variables, condicionales, ciclos, funciones, arreglos, eventos, manipulación del DOM, temporizadores, almacenamiento local y conexión con una API.

## Reparto del trabajo

| Integrante | Tareas realizadas |
| --- | --- |
| Lilén Buckley | Armado de la base de las páginas HTML, desarrollo del Memotest y armado del estilo base del CSS. |
| Alejandro Iribarren  | Juego de trivia conectando una API abierta y su respectivo manejo de registro de resultados del jugador. |
| Victoria González | Desarrollo del juego Carrera de la Suerte y contribuciones al CSS y HTML del sitio general. |

## Declaración de uso de inteligencia artificial

Durante el desarrollo se utilizaron ChatGPT y Gemini como herramientas de apoyo para proponer ideas, revisar y corregir código, y recibir sugerencias para organizar el CSS, las cajas y los márgenes.

Algunas sugerencias incorporadas fueron ajustar el tamaño de las cartas y usar recuadros para separar mejor los textos. También se evaluaron distintas paletas de colores. Se descartó, entre otras propuestas, usar CSS Grid porque no se había trabajado en clase y podía hacer el código más complejo para este proyecto.

En el juego de Memotest se utilizó para acomodar las cartas en la posición correcta en el tablero y reencuadrar las imágenes para que coincidan entre sí y no den error. Se utilizó también para corregir código y buscar sugerencias y para armar un CSS que coordine con el resto de la página. 

En el juego de trivia se uso para ayudar a unificar código del juego a los puntos, así también sugerir soluciones lógicas para la estructura de la página. No se debe confiar plenamente en su uso, ya que utiliza atributos y métodos que no están listados en las clases. Se requiere ser muy específico en la descripción y a veces es mejor buscar la solución por nuestra cuenta en lugar de buscar el prompt perfecto.

En el juego de dados fue utilizada para buscar un código más concreto y simple que funcione correctamente para el sistema de puntos, pidiéndole también más información sobre el funcionamiento de localStorage y el formato JSON.

Las herramientas también ayudaron a revisar posibles errores y repeticiones, y a redactar o sintetizar textos para las páginas del proyecto. El grupo evaluó las sugerencias y decidió cuáles usar. Las decisiones finales y la revisión del trabajo estuvieron a cargo de sus integrantes.




