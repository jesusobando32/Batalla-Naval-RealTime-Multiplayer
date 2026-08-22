# ⚓ Batalla Naval: Real-Time Multiplayer (Deno & WebSockets)

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Deno](https://img.shields.io/badge/Deno-000000?style=for-the-badge&logo=deno&logoColor=white)
![WebSocket](https://img.shields.io/badge/WebSocket-010101?style=for-the-badge&logo=socket.io&logoColor=white)

Una reinterpretación moderna e interactiva del clásico juego de estrategia **Batalla Naval**. Desarrollado con una arquitectura cliente-servidor orientada a eventos, permitiendo partidas multijugador en tiempo real mediante **WebSockets** y el entorno de ejecución **Deno**.

## 📸 Vistas del Proyecto

<div align="center">
  <img src="docs/battleship-gameplay.png" alt="Vista del Tablero" width="45%" />
  <img src="docs/battleship-multiplayer.png" alt="Modo Multijugador / Torneo" width="45%" />
</div>

## ✨ Características Principales

- **Multijugador en Tiempo Real:** Comunicación bidireccional de baja latencia mediante WebSockets.
- **Batallas Épicas de hasta 4 Jugadores:** Soporte nativo para modos de 2 o 4 jugadores simultáneos.
- **Sistema de Torneos:** Crea salas, empareja jugadores, avanza de rondas dinámicamente y corónate campeón.
- **Power-Ups Estratégicos:** Habilidades especiales que pueden alterar el curso de la partida (ej. ataques en área).
- **Interfaz Reactiva (Vanilla JS):** Actualizaciones instantáneas del DOM basadas en los eventos del servidor sin necesidad de frameworks pesados.

## 🏗️ Arquitectura y Stack Tecnológico

- **Frontend:** HTML5, CSS3, Vanilla JavaScript (Manipulación de DOM y API WebSockets).
- **Backend:** Deno (TypeScript/JS), manejo concurrente de múltiples salas y estados de juego.
- **Red:** WebSockets para la sincronización de estados y eventos de la partida.

## 🚀 Instalación y Uso

### Prerrequisitos
- [Deno](https://deno.land/) instalado en tu máquina.
- [Visual Studio Code](https://code.visualstudio.com/) con la extensión **Live Server** o un servidor de archivos estáticos (ej. Python `http.server`).

### Ejecución Local
1. Clona este repositorio:
   ```bash
   git clone https://github.com/tu-usuario/Battleship-WEB.git
   ```
2. Inicia el servidor WebSocket con Deno:
   ```bash
   deno run --allow-net --watch server/server.ts
   ```
3. Ejecuta el cliente:
   - Abre la carpeta del proyecto en VS Code.
   - Haz clic derecho sobre `client/html/Battleship.html` (o la versión multijugador) y selecciona **Open with Live Server**.
   - Alternativamente, corre `python -m http.server 5500` en la raíz y entra a `http://localhost:5500/client/html/Battleship.html`.
4. ¡Abre varias pestañas para simular múltiples jugadores y probar la creación de salas!
