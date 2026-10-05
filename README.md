# EYEVT — Eye Visual Training

Plataforma web interactiva para entrenamiento visual y desarrollo de habilidades de visión de forma dinámica y accesible.

> **"¡Elige un juego y entrena tu visión!"**

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

### 5. Convergencia (`/games/convergence`)
- **Categoría:** Binocularidad
- **Objetivo:** Control de vergencias frente a estímulos con demanda convergente.

### 6. Divergencia (`/games/divergence`)
- **Categoría:** Binocularidad
- **Objetivo:** Control de vergencias frente a estímulos con demandas divergentes.

### 7. Flexibilidad (`/games/vergence-flexibility`)
- **Categoría:** Binocularidad
- **Objetivo:** Alternancia entre demandas de convergencia y divergencia con distintos niveles de dificultad.

### 8. Memoria visual (`/games/visual-memory`)
- **Categoría:** Percepción Visual
- **Objetivo:** Reconocimiento y memorización de distintos patrones visuales fijos.

---

## 🎨 Catálogo Modular de Estímulos

La plataforma cuenta con un amplio repertorio de estímulos vectoriales en alta definición, con selector de tamaño universal y tiempos de cambio adaptables:

| Estímulo | Descripción |
| :--- | :--- |
| **Punto fijo** | Estímulo clásico celeste de alto contraste |
| **Colores** | Cambio dinámico entre 8 colores de alto contraste |
| **Letras** | Letras sueltas del abecedario en mayúsculas |
| **Palabras** | Bancos de palabras cotidianas por longitud (3 a 6 letras) |
| **Números** | Cifras numéricas aleatorias de 1 a 5 dígitos |
| **Flechas** | Flechas cardinales en 4 direcciones (↑, ↓, ←, →) |
| **Animales** | Ilustraciones vectoriales de animales |
| **Frutas** | Ilustraciones vectoriales de frutas |
| **Comida** | Ilustraciones vectoriales de alimentos |
| **Emojis** | Caras y expresiones vectoriales |
| **Vehículos** | Medios de transporte y vehículos vectoriales |
| **Objetos** | Elementos y herramientas cotidianas vectoriales |
| **Naturaleza** | Elementos naturales (sol, árbol, lluvia, luna...) |
| **Banderas** | Banderas de países del mundo en formato SVG |

> **Diseño visual:** Tipografías legibles sobre fondos oscuros de alto contraste, minimizando el cansancio ocular y maximizando el foco en la tarea visual.

---

## 🖥️ Interfaz y Experiencia de Usuario

- **Panel de configuración previo:** Cada actividad cuenta con un menú inicial con tarjetas táctiles (Tipo de estímulo, Tamaño, Velocidad/Cadencia y Duración), adaptable a ordenadores, tablets y pantallas táctiles.
- **Área de juego a pantalla completa:** Al iniciar, los controles se ocultan para mantener el foco en la actividad, con una barra de estado superior para pausar o reiniciar cuando sea necesario.
- **Atajos de teclado:** Control rápido mediante teclado (`Espacio` para pausa, `R` para reiniciar, flechas para velocidad y tamaño).
- **Previsualizaciones interactivas:** Las tarjetas del menú principal incorporan previsualizaciones animadas que ilustran la dinámica de cada juego.

---

## 📁 Arquitectura del Proyecto

```text
eyevt/
├── app/
│   ├── components/               # Componentes globales de la interfaz
│   │   ├── Footer.js             # Pie de página responsive
│   │   ├── GamePreviews.js       # Previsualizaciones animadas SVG/CSS
│   │   └── previews.css          # Estilos y keyframes de previsualizaciones
│   ├── data/
│   │   └── categories.js         # Catálogo de categorías y configuración de actividades
│   ├── games/
│   │   ├── _shared/              # Módulo compartido de actividades y utilidades
│   │   │   ├── components/       # Layout y controles (GameShell, OptionPicker, StimulusGrid)
│   │   │   ├── data/             # Catálogos de palabras, números, letras, flechas e ilustraciones
│   │   │   ├── hooks/            # Hooks de ciclo de vida (useGameSession, useStimulusManager)
│   │   │   ├── stimuli/          # Componentes de renderizado de estímulos
│   │   │   ├── utils/            # Formateadores e iconos SVG
│   │   │   └── index.js          # Exportaciones centralizadas de _shared
│   │   ├── convergence/          # Actividad de Convergencia
│   │   ├── divergence/           # Actividad de Divergencia
│   │   ├── eye-tracking/         # Actividad de Seguimientos
│   │   ├── fixation/             # Actividad de Fijación
│   │   ├── periphery/            # Actividad de Periferia
│   │   ├── sacades/              # Actividad de Sacádicos
│   │   ├── vergence-flexibility/ # Actividad de Flexibilidad
│   │   └── visual-memory/        # Actividad de Memoria Visual
│   ├── favicon.ico
│   ├── globals.css               # Estilos globales y tokens de diseño
│   ├── layout.js                 # Layout raíz de Next.js
│   └── page.js                   # Página principal con menú de actividades
└── public/
    ├── animals/                  # SVGs de animales
    ├── faces/                    # SVGs de emojis
    ├── flags/                    # SVGs de banderas
    ├── food/                     # SVGs de comida
    ├── fruits/                   # SVGs de frutas
    ├── nature/                   # SVGs de naturaleza
    ├── objects/                  # SVGs de objetos
    ├── vehicles/                # SVGs de vehículos
    └── logo.png                  # Logotipo de EYEVT
```

---

## 🛠️ Stack Tecnológico

- **Framework:** Next.js 16 (App Router con Turbopack)
- **Librería UI:** React 19
- **Estilos:** Vanilla CSS modular con tokens de diseño, diseño adaptable y animaciones fluidas
- **Linter:** ESLint con configuración Next.js
