# 🛸 UFO Battle

_UFO Battle_ es un minijuego web retro-futurista desarrollado como práctica de la asignatura **Web Development (curso 2025/26)**.  
El objetivo es derribar naves enemigas (UFOs) disparando misiles, obteniendo la mayor puntuación posible antes de que se acabe el tiempo.

---

## 🚀 Características principales

- **Arquitectura POO en JavaScript**: uso de clases `Game`, `UFO` y `Missile`.
- **Interfaz retro-futurista** en tonos oscuros y morados, inspirada en el neón arcade.
- **Sistema de preferencias**: permite configurar tiempo de juego, número de UFOs y modo “doble velocidad”.
- **Temporizador de partida** con final automático y cálculo del **score final** según:
  - Duración elegida (1, 2 o 3 minutos)
  - Número de UFOs seleccionados
  - Activación del modo doble velocidad (+250 puntos)
- **Rankings globales** obtenidos desde servidor remoto vía REST API (`GET /records`).
- **Login y registro de usuarios**, con almacenamiento seguro del token (Web Storage).
- **Diseño modular** con HTML5, CSS3 y JavaScript separados.
- Compatible con **Bootstrap** y **Google Fonts (Orbitron)**.

---

## 🗂️ Estructura del proyecto
ufo_battle/
│
├── index.html # Página principal (menú)
├── login.html # Inicio de sesión
├── register.html # Registro de usuario
├── preferences.html # Configuración de partida
├── play.html # Pantalla de juego
├── rankings.html # Clasificación (top 10)
│
├── css/
│ └── style.css # Estilos globales (tema oscuro, neón)
│
├── js/
│ ├── play.js # Lógica del juego (POO)
│ ├── preferences.js # Gestión de ajustes
│ ├── login.js # Autenticación de usuario
│ ├── register.js # Registro de usuarios
│ └── rankings.js # Consulta y renderizado del ranking
│
├── imgs/
│ ├── ufo.png # Imagen del ovni
│ ├── explosion.gif # Efecto de explosión
│ └── otros recursos...
│
└── README.md

## 👨‍💻 Autor

Gabriel Serrano
Estudiante de Ingeniería del Software – UPM
Curso 2025/2026

GitHub: @gbrisc427
