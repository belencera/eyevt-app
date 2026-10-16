# EYEVT — Eye Visual Training

Plataforma web interactiva para entrenamiento visual y desarrollo de habilidades de visión de forma dinámica y accesible.

> **"¡Selecciona una actividad, personaliza los parámetros y comienza a entrenar!"**

---

## 🚀 Inicio Rápido

```bash
# Entrar al directorio de la aplicación
cd eyevt

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

Abre en tu navegador: [http://localhost:3000](http://localhost:3000)

---

## 🎯 Actividades de Entrenamiento

### 1. Fijación (`/games/fixation`)
- **Objetivo:** Entrenamiento de la estabilidad de la mirada y mantenimiento de la atención sobre estímulos visuales estáticos.
- **Configuración:**
  - Estímulo central elegible entre todas las categorías disponibles.
  - Tiempo de cambio / cadencia regulable (0.3 s a 5 s).
  - Selector unificado de tamaño (Muy pequeño a Muy grande).
  - Temporizador de sesión (30 s, 1 min, 2 min, 5 min o infinito).
  - Atajos de teclado para pausar, reiniciar y ajustar el tamaño en tiempo real.

### 2. Seguimientos (`/games/eye-tracking`)
- **Objetivo:** Control visual durante el desplazamiento continuo de estímulos por diferentes trayectorias en pantalla.
- **Configuración:**
  - Velocidad de desplazamiento regulable (1 a 50).
  - Temporizador de sesión con control flotante superior.
  - Intervalos de rotación periódica del estímulo configurables (1 s a 5 s).
  - Atajos de teclado para velocidad, tamaño y pausas.

### 3. Sacádicos (`/games/sacades`)
- **Objetivo:** Cambios rápidos y precisos de fijación entre estímulos situados en diferentes posiciones aleatorias.
- **Configuración:**
  - Cadencia y tiempo entre saltos (0.3 s a 5 s).
  - Rotación dinámica de estímulo en cada salto.
  - Temporizador de sesión con barra de progreso y HUD de control.

### 4. Periferia (`/games/periphery`)
- **Objetivo:** Detección y respuesta ante estímulos presentados fuera del área de fijación central.
- **Modos de Juego:**
  - **Foco Central:** El usuario mantiene la mirada en el punto central mientras detecta e identifica los estímulos que aparecen en la periferia.
  - **Nombra y Pulsa:** Dinámica interactiva donde el usuario pulsa los puntos periféricos que aparecen alrededor, con contador de aciertos y respuesta visual.
- **Configuración:**
  - Distancia al centro / Excentricidad (Cercana, Media, Lejana o Aleatoria).
  - Tiempo de cambio / cadencia (0.3 s a 5 s).
  - Duración de sesión y pantalla resumen de resultados al finalizar.

### 5. Fusión (`/games/fusion`)
- **Categoría:** Binocularidad
- **Objetivo:** Integración y coordinación binocular mediante la fusión de estímulos en convergencia, divergencia y flexibilidad.
- **Modos:**
  - **Fijo:** Fusión estática con ajuste libre y continuo de distancia y tamaño.
  - **En movimiento:** Dinámica con velocidad regulable en dos variantes:
    - *Continuo:* Separación constante hacia afuera.
    - *Alternante:* Ciclos continuos de apertura y cierre (ida y vuelta).

### 6. Memoria visual (`/games/visual-memory`)
- **Categoría:** Percepción
- **Objetivo:** Memorización y recuerdo de varios estímulos presentados a la vez.
- **Modos de Juego:**
  - **Centro:** Los estímulos aparecen juntos en el centro de la pantalla.
  - **Posiciones aleatorias:** Cada estímulo aparece en una zona aleatoria de la pantalla, sin solaparse.
- **Configuración:**
  - Tiempo de exposición (1 s a 5 s).
  - Respuesta en cuadrícula, en cualquier orden.

### 7. Memoria secuencial (`/games/sequential-memory`)
- **Categoría:** Percepción
- **Objetivo:** Memorización de estímulos en su orden de aparición.
- **Configuración:**
  - Los estímulos aparecen de uno en uno, en fila de izquierda a derecha.
  - Tiempo por estímulo regulable (0.5 s a 2 s).
  - Respuesta en el orden exacto, con botón para deshacer.

### 8. Memoria de parejas (`/games/memory-pairs`)
- **Categoría:** Percepción
- **Objetivo:** Encontrar las parejas de estímulos iguales recordando la posición de las cartas.
- **Configuración:**
  - Vista previa con las cartas boca arriba (sin vista previa, 3 s, 5 s, 10 s, 15 s o 20 s).
  - Nivel 1 con 2 parejas y una pareja más en cada nivel, sin tope.
  - Las parejas encontradas se quedan en verde; las fallidas se marcan en rojo y se esconden.

### 9. Taquitoscopio (`/games/tachistoscope`)
- **Categoría:** Percepción
- **Objetivo:** Percepción ultrarrápida de estímulos.
- **Configuración:**
  - Duración del flash regulable (50 ms a 500 ms).
  - Respuesta en cuadrícula, en cualquier orden.

> **Juegos de memoria y percepción:** Nivel adaptativo (2 aciertos seguidos suben de nivel y se añade un estímulo), cuadrícula de respuesta con opciones parecidas entre sí, avance manual con "Siguiente ronda" y resumen al terminar la sesión. En duración infinita, 5 fallos seguidos terminan la sesión.

### 10. Encuentra el diferente (`/games/odd-one-out`)
- **Categoría:** Percepción
- **Objetivo:** Discriminación visual: encontrar entre varios estímulos iguales el que tiene un detalle distinto.
- **Modos de Juego:**
  - **Centro:** Los estímulos aparecen juntos en el centro de la pantalla.
  - **Posiciones aleatorias:** Cada estímulo aparece en una zona aleatoria de la pantalla, sin solaparse.
- **Configuración:**
  - Empieza con 3 estímulos; cada acierto añade uno más, sin tope. Un fallo repite el mismo número.
  - Ilustraciones: al diferente le falta un pequeño detalle del dibujo (un ojo, una rueda, una gota…), detectado automáticamente.
  - Letras, palabras y números: una letra o cifra cambiada por otra parecida (E/F, CAMA/CANA, 3481/3471); pbqd en espejo.
  - Resumen con el máximo de estímulos, la precisión y el tiempo medio de respuesta.

---

## 🎨 Catálogo Modular de Estímulos

La plataforma cuenta con un amplio repertorio de estímulos vectoriales en alta definición, con selector de tamaño universal y tiempos de cambio adaptables:

| Estímulo | Descripción |
| :--- | :--- |
| **Punto fijo** | Estímulo clásico celeste de alto contraste |
| **Colores** | Cambio dinámico entre 8 colores de alto contraste |
| **Letras** | Letras sueltas del abecedario en mayúsculas |
| **pbqd** | Letras p, b, q y d en minúscula, sueltas o combinadas de 2 a 4 letras distintas (bq, pdb, dqbp…) |
| **Palabras** | Bancos de palabras cotidianas por longitud (3 a 6 letras) |
| **Números** | Cifras numéricas aleatorias de 1 a 5 dígitos |
| **Flechas** | Flechas cardinales en 4 direcciones (↑, ↓, ←, →) |
| **Animales** | Ilustraciones vectoriales de animales |
| **Frutas** | Ilustraciones vectoriales de frutas |
| **Comida** | Ilustraciones vectoriales de alimentos |
| **Emojis** | Caras y expresiones vectoriales |
| **Vehículos** | Medios de transporte y vehículos vectoriales |
| **Objetos** | Elementos y herramientas cotidianas vectoriales |
| **Deportes** | Elementos y material deportivo vectoriales |
| **Naturaleza** | Elementos naturales (sol, árbol, lluvia, luna...) |
| **Banderas** | Banderas de países del mundo en formato SVG |

> **Diseño visual:** Tipografías legibles sobre fondos oscuros de alto contraste, minimizando el cansancio ocular y maximizando el foco en la tarea visual.

---

## 🖥️ Interfaz y Experiencia de Usuario

- **Panel de configuración previo:** Cada actividad cuenta con un menú inicial con tarjetas táctiles (Tipo de estímulo, Tamaño, Velocidad/Cadencia y Duración), adaptable a ordenadores, tablets y pantallas táctiles.
- **Área de juego a pantalla completa:** Al iniciar, los controles se ocultan para mantener el foco en la actividad, con una barra de estado superior para pausar o reiniciar cuando sea necesario.
- **Atajos de teclado:** Control rápido mediante teclado (`Espacio` para pausar y reanudar, `R` para reiniciar, `Esc` para salir, flechas para velocidad y tamaño).
- **Resumen de sesión:** Al terminar, una tarjeta muestra los resultados con opciones para jugar de nuevo o salir.
- **Menú principal con filtros:** Todos los juegos en una sola rejilla, con botones para filtrar por categoría (Todas, Oculomotricidad, Binocularidad y Percepción).
- **Previsualizaciones interactivas:** Las tarjetas del menú principal incorporan previsualizaciones animadas que ilustran la dinámica de cada juego.

---

## 📁 Arquitectura del Proyecto

```text
eyevt/
├── app/
│   ├── components/               # Componentes globales de la interfaz
│   │   ├── Footer.js             # Pie de página responsive
│   │   ├── GamesCatalog.js       # Rejilla de juegos con filtros por categoría
│   │   ├── GamePreviews.js       # Previsualizaciones animadas SVG/CSS
│   │   └── previews.css          # Estilos y keyframes de previsualizaciones
│   ├── data/
│   │   └── categories.js         # Categorías (filtros del menú) y configuración de actividades
│   ├── games/
│   │   ├── _memory/              # Módulo compartido de los juegos de memoria y percepción
│   │   │   ├── common/           # Elementos por categoría y opciones de respuesta parecidas
│   │   │   ├── recall/           # Rondas, presentación y cuadrícula de respuesta (Visual, Secuencial, Taquitoscopio)
│   │   │   ├── pairs/            # Baraja, tablero de cartas y flujo de Memoria de parejas
│   │   │   └── index.js          # Exportaciones centralizadas de _memory
│   │   ├── _shared/              # Módulo compartido de actividades y utilidades
│   │   │   ├── components/       # Layout y controles (GameShell, OptionPicker, ModeSelector, StimulusGrid, SessionSummary)
│   │   │   ├── data/             # Catálogos de palabras, números, letras, flechas e ilustraciones
│   │   │   ├── hooks/            # Hooks de ciclo de vida (useGameSession, useStimulusManager, useTimers, useAdaptiveLevel, useViewportSize)
│   │   │   ├── rounds/           # Juegos por rondas con nivel: barra de nivel, botones de ronda, posiciones y modos
│   │   │   ├── stimuli/          # Componentes de renderizado de estímulos
│   │   │   ├── utils/            # Formateadores, azar, barajado e iconos SVG
│   │   │   └── index.js          # Exportaciones centralizadas de _shared
│   │   ├── eye-tracking/         # Actividad de Seguimientos
│   │   ├── fixation/             # Actividad de Fijación
│   │   ├── fusion/               # Actividad de Fusión (convergencia, divergencia y flexibilidad)
│   │   ├── memory-pairs/         # Actividad de Memoria de parejas
│   │   ├── odd-one-out/          # Actividad de Encuentra el diferente (componentes, datos y hook propios)
│   │   ├── periphery/            # Actividad de Periferia (con sus datos)
│   │   ├── sacades/              # Actividad de Sacádicos
│   │   ├── sequential-memory/    # Actividad de Memoria Secuencial
│   │   ├── tachistoscope/        # Actividad de Taquitoscopio
│   │   └── visual-memory/        # Actividad de Memoria Visual
│   ├── favicon.ico
│   ├── globals.css               # Estilos globales y tokens de diseño
│   ├── layout.js                 # Layout raíz de Next.js
│   └── page.js                   # Página principal con el catálogo de actividades
└── public/
    ├── animals/                  # SVGs de animales
    ├── faces/                    # SVGs de emojis
    ├── flags/                    # SVGs de banderas
    ├── food/                     # SVGs de comida
    ├── fruits/                   # SVGs de frutas
    ├── nature/                   # SVGs de naturaleza
    ├── objects/                  # SVGs de objetos
    ├── sports/                   # SVGs de deportes
    ├── vehicles/                 # SVGs de vehículos
    ├── vergence/                 # SVGs de los estímulos de Fusión
    └── logo.png                  # Logotipo de EYEVT
```

---

## 🛠️ Stack Tecnológico

- **Framework:** Next.js 16 (App Router con Turbopack)
- **Librería UI:** React 19
- **Estilos:** Vanilla CSS modular con tokens de diseño, diseño adaptable y animaciones fluidas
- **Linter:** ESLint con configuración Next.js
