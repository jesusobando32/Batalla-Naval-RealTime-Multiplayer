# Batalla Naval

¡Bienvenido al juego de **Batalla Naval**! Este es un clásico juego de estrategia en el que los jugadores intentan hundir los barcos del oponente. Este proyecto ha sido desarrollado utilizando **HTML**, **CSS** y **JavaScript**, y se ejecuta en un entorno **Deno**.

## Requisitos

Antes de comenzar, asegúrate de tener instalado **Deno** en tu máquina. Puedes descargarlo desde [la página oficial de Deno](https://deno.land/).

## Instrucciones para ejecutar el juego

Sigue estos pasos para poner en marcha el juego:

1. **Instalar Deno**:
   - Si aún no tienes Deno instalado, descárgalo e instálalo siguiendo las instrucciones en [la documentación de Deno](https://deno.land/manual/getting_started/installation).

2. **Ejecutar el servidor**:
   - Abre la terminal (CMD) y navega hasta la carpeta donde se encuentra tu archivo `server.ts`.
   - Ejecuta el siguiente comando:

     ```bash
     deno run --allow-net --watch server.ts
     ```

     (Asegúrate de poner la ruta correcta donde se encuentra `server.ts`).

   - Este comando iniciará el servidor y permitirá la conexión de red necesaria para el juego.

3. **Abrir el juego en el navegador**:
   - Abre **Visual Studio Code** y asegúrate de tener instalada la extensión **Live Server**.
   - Abre el archivo `Battleship.html`.
   - Haz clic derecho en el archivo y selecciona "Open with Live Server" para iniciar el juego en tu navegador.
   - También puedes hacer este proceso con el archivo `Battleship_multijugador.html`, que permite partidas de hasta 4 personas.

## Cómo jugar

1. **Configuración inicial**:
   - Una vez que tengas abierto `Battleship.html`, abre otra pestaña en tu navegador. Puedes verificar las interacciones con WebSocket en la terminal de CMD, así como en la consola de desarrollador de tu navegador.

2. **Interacción en el juego**:
   - Con dos pestañas abiertas en el navegador, desplázate hasta el final de `Battleship.html`, donde encontrarás los siguientes botones:
     - **Crear Nuevo Juego**
     - **Unirse a Juego Existente**
     - **Iniciar la Partida**
     - **Enviar el Movimiento**
     - **Abandonar la Partida**
     - **Cerrar la Conexión con el Servidor**

3. **Pasos para jugar**:
   - Desde cualquiera de las dos pestañas, haz clic en el botón **Crear Nuevo Juego**. El servidor te proporcionará una clave generada aleatoriamente.
   - Copia esa clave y pégala en la segunda pestaña, luego haz clic en **Unirse a Juego Existente**.
   - El creador de la partida debe hacer clic en **Iniciar la Partida** para comenzar el juego.
   - En el campo de entrada al lado, escribe la casilla a la que deseas realizar una acción (por ejemplo, B5) y haz clic en **Enviar el Movimiento**.
   - Si en algún momento deseas abandonar la partida, puedes hacer clic en el botón **Abandonar la Partida**.
   - Finalmente, si deseas desconectarte del servidor, haz clic en **Cerrar la Conexión con el Servidor**.

4. **Modo torneo**:
   - Desde cualquier pestaña, presiona **Crear Torneo**.
   - Luego, en las otras pestañas, presiona **Unirse a Torneo Existente** e ingresa el ID del torneo.
   - Una vez que se hayan unido los jugadores, cualquier jugador puede presionar **Iniciar Round**. Esto creará los juegos y emparejará a los jugadores.
   - Es importante que, después de iniciar la ronda, al menos un jugador por partida presione **Unirse a Juego**.
   - Repite el proceso de unirse al juego después de pasar de ronda. 
   - Cuando se está jugando con cuatro personas o más, cuando una pareja termina de jugar (es decir, un juego termina ganando), deben presionar el botón de **Avanzar Ronda** y no volver a tocar nada más ni entrar en la pestaña del rival. Posteriormente, se jugarán las partidas paralelas. 
   - Una vez que un jugador gane, debe presionar **Avanzar Ronda**. Se enviarán mensajes indicando que se avanzó de ronda y se repetirá el mismo proceso. 
   - Cuando quede solo un contrincante, se iniciará una nueva ronda y se repetirá el proceso de unirse al juego.
   - Posteriormente, se colocan los barcos y se juega de manera normal. Cuando finalice la ronda, el jugador que gane avanzará a la siguiente ronda. Si es el último en pie, habrá ganado la partida final y el torneo.

5. **Modo de 2 o 4 jugadores**:
   - El modo de 2 o 4 jugadores funciona de manera sencilla. Abre dos o cuatro pestañas, dependiendo de la modalidad que elijas.
   - Haz clic en **Crear Nuevo Juego** en una de las pestañas. El sistema generará un ID que debes copiar y pegar en las otras pestañas y hacer click en **Unirse a un juego existente** para unirte al juego.
   - Una vez que todos los jugadores hayan ingresado y colocado sus barcos en las posiciones deseadas, haz clic en **Iniciar Partida**.
   - Durante el juego, cada jugador podrá atacar a cualquiera de los tableros de sus oponentes. 
   - Los Power-Ups funcionan en ambos modos. Para usarlos, selecciona la casilla donde deseas lanzar el Power-Up (por ejemplo, "A4") y elige qué Power-Up deseas utilizar. En el modo de 4 jugadores, además de seleccionar la casilla, también debes elegir a qué tablero lanzar el Power-Up.

¡Diviértete jugando a Batalla Naval!
