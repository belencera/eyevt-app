# EYEVT — Eye Visual Therapy

Plataforma web clínica interactiva para terapia visual y rehabilitación optométrica digital. Diseñada para su uso por pacientes bajo la supervisión de un terapeuta visual.

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

### 1. Seguimientos (`/games/eye-tracking`)
- **Objetivo:** Estimulación de movimientos oculares suaves (*pursuits*) siguiendo un estímulo en movimiento continuo continuo dentro del área visual.
- **Controles:**
  - Velocidad de desplazamiento regulable (8 a 60).
  - Temporizador de sesión con cuenta atrás y modo infinito.
  - Intervalos de rotación periódica del estímulo configurables (1 s a 5 s).
  - Panel flotante de pausa/reinicio y feedback en tiempo real para el terapeuta.

### 2. Sacádicos (`/games/sacades`)
- **Objetivo:** Entrenamiento de movimientos sacádicos rápidos y precisos mediante fijaciones alternantes aleatorias.
- **Controles:**
  - Velocidad / cadencia entre saltos (12 a 48).
  - Rotación automática de estímulo en cada salto (color, letra, palabra o animal diferente).
  - Temporizador de sesión con barra de progreso.

---

## 🎨 Tipos de Estímulos Visuales

| Estímulo | Descripción | Opciones Configurables |
| :--- | :--- | :--- |
| **Punto fijo** | Estímulo clásico celeste de alto contraste | Posición y velocidad |
| **Colores** | Cambio dinámico entre 8 colores de alto contraste | Intervalo de cambio (1 a 5 s) |
| **Letras** | Letras sueltas del abecedario español en mayúsculas (con Ñ) | Tamaño (Pequeña 28px, Mediana 44px, Grande 64px, Muy grande 88px) e intervalo |
| **Palabras** | Bancos de 96 palabras cotidianas por longitud en mayúsculas | **Tamaño** (Pequeña 26px, Mediana 38px, Grande 54px, Muy grande 74px), **Longitud** (3, 4, 5, 6 letras o Mixto) e intervalo |
| **Animales** | 28 ilustraciones vectoriales de alta definición | **Tamaño** (Pequeño 48px, Mediano 72px, Grande 96px, Muy grande 124px) e intervalo |
| **Frutas** | 12 ilustraciones vectoriales en formato SVG | **Tamaño** (Pequeño 48px, Mediano 72px, Grande 96px, Muy grande 124px) e intervalo |

> **Nota de diseño visual:** Las letras y palabras flotan limpias sobre el fondo oscuro sin cajas, bordes ni neón perimetral, favoreciendo la legibilidad sin distracciones lumínicas.

---

## 👨‍⚕️ Panel de Supervisión del Terapeuta

Tanto en *Seguimientos* como en *Sacádicos*, la interfaz incluye un indicador en tiempo real (`TherapistBadge`) que muestra al profesional exactamente qué debe verbalizar o identificar el paciente en cada momento:
- Nombre del color activo.
- Letra mayúscula activa.
- Palabra exacta en visualización.
- Nombre y miniatura del animal o fruta actual.

---

## 📁 Arquitectura del Proyecto

```text
eyevt/
├── app/
│   ├── components/               # Componentes globales de la web
│   │   ├── Footer.js             # Pie de página responsive
│   │   ├── GamePreviews.js       # Previsualizaciones animadas SVG/CSS de las cards
│   │   └── previews.css          # Estilos de las previews
│   ├── games/
│   │   ├── _shared/              # Módulo compartido de ejercicios
│   │   │   ├── components/       # Layouts y controles (GameShell, OptionPicker, StimulusGrid, TherapistBadge)
│   │   │   ├── data/             # Bancos de palabras, alfabeto, animales, frutas y constantes
│   │   │   ├── hooks/            # useGameSession y useStimulusManager
│   │   │   ├── stimuli/          # Componentes de renderizado (Dot, Letter, Word, Animal, Fruit, Illustration)
│   │   │   ├── utils/            # formatTime, iconos SVG
│   │   │   └── index.js          # Barril de exportación central
│   │   ├── eye-tracking/         # Juego de seguimientos
│   │   └── sacades/              # Juego de sacádicos
│   ├── globals.css               # Estilos globales y tokens de diseño
│   ├── layout.js                 # Layout raíz Next.js
│   └── page.js                   # Landing page con selector de ejercicios
└── public/
    ├── animals/                  # Catálogo de 28 imágenes de animales en alta resolución
    └── fruits/                   # Directorio para subir las ilustraciones de frutas (SVG / PNG)
```

---

## 🛠️ Stack Tecnológico

- **Framework:** Next.js 16 (App Router con Turbopack)
- **Librería UI:** React 19
- **Estilos:** Vanilla CSS modular con variables de diseño, glassmorphism y animaciones fluidas
- **Linter:** ESLint con configuración estricta para Next.js
