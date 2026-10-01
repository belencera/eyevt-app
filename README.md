# EYEVT — Eye Visual Training

Plataforma web clínica interactiva para terapia visual y rehabilitación optométrica digital. Diseñada para su uso por pacientes bajo la supervisión de un especialista o terapeuta visual.

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

## 🎯 Ejercicios Clínicos

### 1. Fijación (`/games/fixation`)
- **Objetivo:** Estimulación de la estabilidad foveal y entrenamiento de la capacidad del paciente para mantener la mirada fija en un punto central estable sin desviar los ojos ni mover la cabeza.
- **Configuración:**
  - Estímulo central elegible entre todos los disponibles (Punto, Colores, Letras, Palabras, Números, Flechas, Animales, Frutas).
  - Velocidad de cambio / cadencia regulable (1 s a 10 s).
  - Temporizador de sesión (1 a 5 min, o modo infinito).
  - Panel superior flotante durante la sesión para pausar, reanudar o reiniciar.

### 2. Seguimientos (`/games/eye-tracking`)
- **Objetivo:** Estimulación de movimientos oculares suaves (*pursuits*) siguiendo un estímulo en movimiento continuo dentro del área visual.
- **Configuración:**
  - Velocidad de desplazamiento regulable (8 a 60).
  - Temporizador de sesión (1 a 5 min, o modo infinito).
  - Intervalos de rotación periódica del estímulo configurables (1 s a 5 s).
  - Panel superior flotante durante la sesión para control rápido (pausa, reanudación y parada).

### 3. Sacádicos (`/games/sacades`)
- **Objetivo:** Entrenamiento de movimientos sacádicos rápidos y precisos mediante fijaciones alternantes aleatorias.
- **Configuración:**
  - Cadencia y velocidad entre saltos (12 a 48).
  - Rotación dinámica de estímulo en cada salto (color, letra, palabra, número, flecha o ilustración diferente).
  - Temporizador de sesión con barra de progreso y control flotante.

### 4. Periferia (`/games/periphery`)
- **Objetivo:** Entrenamiento y ampliación del campo visual periférico manteniendo una fijación central estable.
- **Modos de Juego:**
  - **Foco Central:** El paciente mantiene la mirada en el punto central mientras detecta estímulos intermitentes en la periferia.
  - **Nombra y Pulsa:** Estimulación periférica interactiva donde el paciente debe tocar o hacer clic sobre el estímulo detectado, con contador de aciertos y feedback audiovisual.
- **Configuración:**
  - Distancia al centro / Excentricidad (Cercana, Media, Lejana o Mixta).
  - Cadencia de aparición (1 s a 5 s).
  - Duración de sesión y pantalla resumen de resultados al finalizar.

### 5. Convergencia (`/games/convergence`)
- **Categoría:** Binocularidad
- **Objetivo:** Control de vergencias frente a estímulos con demanda convergente y control antisupresión.

### 6. Divergencia (`/games/divergence`)
- **Categoría:** Binocularidad
- **Objetivo:** Control de vergencias frente a estímulos con diferentes demandas divergentes.

### 7. Flexibilidad (`/games/vergence-flexibility`)
- **Categoría:** Binocularidad
- **Objetivo:** Alternancia entre demandas de convergencia y divergencia con distintos niveles de dificultad.

### 8. Memoria visual (`/games/visual-memory`)
- **Categoría:** Percepción Visual
- **Objetivo:** Reconocimiento y memorización de distintos patrones visuales fijos.

---

## 🎨 Tipos de Estímulos Visuales

| Estímulo | Descripción | Opciones Configurables |
| :--- | :--- | :--- |
| **Punto fijo** | Estímulo clásico celeste de alto contraste | Posición y velocidad |
| **Colores** | Cambio dinámico entre 8 colores de alto contraste | Intervalo de cambio (1 a 5 s) |
| **Letras** | Letras sueltas del abecedario español en mayúsculas (con Ñ) | Tamaño (Pequeño, Mediano, Grande, Muy grande) e intervalo |
| **Palabras** | Bancos de 96 palabras cotidianas por longitud en mayúsculas | **Tamaño** (Pequeño, Mediano, Grande, Muy grande), **Longitud** (3, 4, 5, 6 letras o Mixto) e intervalo |
| **Números** | Cifras numéricas aleatorias de 1 a 5 dígitos | **Tamaño** (Pequeño, Mediano, Grande, Muy grande), **Cifras** (1, 2, 3, 4, 5 o Mixto) e intervalo |
| **Flechas** | Flechas cardinales en 4 direcciones (↑, ↓, ←, →) | **Tamaño** (Pequeño, Mediano, Grande, Muy grande) e intervalo |
| **Animales** | 28 ilustraciones vectoriales de alta definición | **Tamaño** (Pequeño, Mediano, Grande, Muy grande) e intervalo |
| **Frutas** | 12 ilustraciones vectoriales en formato SVG | **Tamaño** (Pequeño, Mediano, Grande, Muy grande) e intervalo |

> **Diseño visual clínico:** Tipografías limpias flotando sobre fondo oscuro en color marfil suave (`#f8fafc`) sin elementos perimetrales estridentes, favoreciendo la legibilidad sin distracciones lumínicas ni fatiga visual.

---

## 🖥️ Interfaz y Experiencia de Usuario

- **Dashboard modular de configuración:** Cada ejercicio cuenta con un panel inicial organizado en tarjetas accesibles (Estímulo, Ajustes específicos, Velocidad/Cadencia y Duración de sesión), completamente adaptable a pantallas de escritorio, tablets y móviles.
- **Área de juego inmersiva:** Al pulsar "Empezar", la configuración se oculta y el paciente dispone de toda la pantalla con una barra flotante sutil de control para el terapeuta.
- **Previsualizaciones dinámicas:** Las tarjetas del menú principal incorporan previsualizaciones animadas que reflejan la mecánica de cada ejercicio visual a una velocidad suave y continua.

---

## 📁 Arquitectura del Proyecto

```text
eyevt/
├── app/
│   ├── components/               # Componentes globales de la interfaz
│   │   ├── Footer.js             # Pie de página responsive
│   │   ├── GamePreviews.js       # Previsualizaciones animadas SVG/CSS de las tarjetas
│   │   └── previews.css          # Estilos y keyframes de las previsualizaciones
│   ├── data/
│   │   └── categories.js         # Catálogo de categorías clínicas y configuración de ejercicios
│   ├── games/
│   │   ├── _shared/              # Módulo compartido de ejercicios clínicos
│   │   │   ├── components/       # Layout y controles (GameShell, OptionPicker, StimulusGrid, gameShell.css)
│   │   │   ├── data/             # Bancos de palabras, números, letras, flechas, animales, frutas y constantes
│   │   │   ├── hooks/            # Hooks de ciclo de vida (useGameSession, useStimulusManager)
│   │   │   ├── stimuli/          # Componentes de renderizado de estímulos (Dot, Letter, Word, Number, Arrow, Animal, Fruit, Illustration)
│   │   │   ├── utils/            # Formateadores (formatTime) e iconos SVG
│   │   │   └── index.js          # Exportaciones centralizadas de _shared
│   │   ├── convergence/          # Ejercicio de Convergencia
│   │   ├── divergence/           # Ejercicio de Divergencia
│   │   ├── eye-tracking/         # Ejercicio de Seguimientos Oculares
│   │   ├── fixation/             # Ejercicio de Fijación Central Estable
│   │   ├── periphery/            # Ejercicio de Campo Visual Periférico
│   │   ├── sacades/              # Ejercicio de Movimientos Sacádicos
│   │   ├── vergence-flexibility/ # Ejercicio de Flexibilidad de Vergencias
│   │   └── visual-memory/        # Ejercicio de Memoria Visual
│   ├── favicon.ico
│   ├── globals.css               # Estilos globales y tokens de diseño
│   ├── layout.js                 # Layout raíz de Next.js
│   └── page.js                   # Landing page con selector de ejercicios
└── public/
    ├── animals/                  # Catálogo de 28 ilustraciones de animales
    ├── fruits/                   # Catálogo de 12 ilustraciones vectoriales de frutas
    └── logo.png                  # Logotipo de EYEVT
```

---

## 🛠️ Stack Tecnológico

- **Framework:** Next.js 16 (App Router con Turbopack)
- **Librería UI:** React 19
- **Estilos:** Vanilla CSS modular con tokens de diseño, glassmorphism y diseño responsivo
- **Linter:** ESLint con configuración Next.js
