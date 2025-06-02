//el cada array corresponde a las traducciones para cada id de ESTE jugador
//ejemplo, si tengo el id 0, mi traduccion será [1,2,3]
//cada elemento de cada array corresponde a un tablero para el jugador
//Así que, si por ejemplo yo como jugador 3 quiero atacar al jugador 2 (desde mi punto de vista)
//el id dle jugador que estaré atacando será 0
let transformMatrix=[
  ['1','2','3'],
  ['0','2','3'],
  ['0','1','3'],
  ['0','1','2']
]

//Calcula a que tablero le debe representar un golpe
let detransforMatrix=[
  ['1','2','3','4'],
  ['2','1','3','4'],
  ['2','3','1','4'],
  ['2','3','4','1']
]

let idThisPlayer;
let puntaje=0;
const socket = new WebSocket(crearURLConexion());
function agregarTablero(playerID){
  const tableros= document.getElementById("tableros");
  let tablero=document.createElement("div");
  tablero.className="tablero-jugador";
  tablero.id=playerID;
  
  for(let i=0; i<121;i++){
      let element=document.createElement("div");
      const letra= 64+(i%11);
      const numero=Number.parseInt(i/11);
      if(i==0){
          element.className="position";
      }else if(i<11){
          element.innerHTML=String.fromCharCode(letra);
          element.classList.add("columna");
      }else if(i%11==0){
          element.innerHTML=i/11;
          element.classList.add("fila");
      }else{
          element.className="position";
      }
      element.id="t"+playerID+"@"+String.fromCharCode(letra)+numero;
      tablero.appendChild(element);
  }
  tableros.appendChild(tablero);
}

function crearURLConexion(){
    const WEBSOCKET_SCHEME = 'ws';
    const WEBSOCKET_SERVER = '127.0.0.1';
    const WEBSOCKET_PORT = 8080;
    const WEBSOCKET_URL = `${WEBSOCKET_SCHEME}://${WEBSOCKET_SERVER}:${WEBSOCKET_PORT}`;
    return WEBSOCKET_URL;
  }
  
  function agregarEventosSocket(socket){
  let url=crearURLConexion();
  socket.addEventListener('open', () => {
    console.log(`%cConectado al servidor en ${(url)}`,  'color: #99ff00');
    
  });

  socket.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);
    console.log('%c<- %cMensaje recibido desde el servidor:', 'color: #99ff00', 'color: inherit', message);
    if(message.type=="gameCreated"){
      alert("El id de su juego es: "+ message.gameId);
      document.getElementById("game-id").value=message.gameId;
      idThisPlayer='0';
      const idJugador=idThisPlayer;
      const arrayBarcos=localStorage.getItem('positions').split('_');
      const gameId = document.getElementById('game-id').value;
      socket.send(JSON.stringify({ type: 'positions', gameId: gameId, message: idJugador, shipPositions: arrayBarcos}));
      Array.from(document.getElementsByClassName("boton-barco")).forEach(boton=>{
        boton.disabled=false;
      })
    }
    if(message.type=='turno'){
      iniciarTemporizador();
      alert('Es tu turno!');
    }
    if(message.type=="move"){
      let element=document.createElement("div");
      let element2=document.createElement("div");
      cancelarTemporizador();
      element2.classList.add("miss");
      element.classList.add("fire");
      let casilla
      let casilla2
      if(message.message=='miss'){
        alert("El enemigo ha realizado el movimiento: "+ message.move+ "!");
        alert("El enemigo ha fallado");
        casilla2=document.getElementById("tjugador"+detransforMatrix[idThisPlayer][Number.parseInt(message.gameId)]+"@"+message.move);
        casilla2.appendChild(element2);
        puntaje=puntaje+1;
        document.getElementById('puntaje').innerText=puntaje;
      } else if(message.message=='miss-propio'){
        cancelarTemporizador();
        alert("Hemos fallado!");
        casilla2=document.getElementById("tjugador"+detransforMatrix[idThisPlayer][Number.parseInt(message.gameId)]+"@"+message.move);
        casilla2.appendChild(element2);
        puntaje=puntaje+1;
        document.getElementById('puntaje').value=puntaje;
      }else if(message.message=='daño'){
        alert("El enemigo ha realizado el movimiento: "+ message.move+ "!");
        alert("El enemigo ha acertado!");
        casilla=document.getElementById("tjugador"+detransforMatrix[idThisPlayer][Number.parseInt(message.gameId)]+"@"+message.move);
        casilla.appendChild(element);
      }else if(message.message=='daño-propio'){
        cancelarTemporizador();
        alert("Hemos acertado!");
        casilla=document.getElementById("tjugador"+detransforMatrix[idThisPlayer][Number.parseInt(message.gameId)]+"@"+message.move);
        casilla.appendChild(element);
        puntaje=puntaje+2;
        document.getElementById('puntaje').innerText=puntaje;
      }
      
      
    }
    else if(message.type=="playerJoined"){
      alert("Se ha unido un jugador a la partida");
      if(idThisPlayer!=(Number.parseInt(message.playerCount)-1)){
        agregarListenersTablero('jugador'+message.playerCount);
      }
    }
    else if(message.type=="playerLeft"){
      alert("Un jugador ha abandonado la partida");
    }
    else if(message.type=="gameStarted"){
      document.getElementById("game-id").disabled=true;
      alert("La partida ha empezado");
    }
    else if(message.type==="joined"){
      idThisPlayer=message.playerCount;
      Array.from(document.getElementsByClassName("boton-barco")).forEach(boton=>{
        boton.disabled=false;
      });
      for(let i=1;i<=Number.parseInt(message.playerCount);i++){
        agregarListenersTablero('jugador'+(i+1));
      }
    }
    else if(message.type=='victoria'){
      let playerID=idThisPlayer;
      if(message.message==playerID){
        alert("Has perdido la partida");
      }else if(message.gameMode==1){
          alert('Un jugador ha sido derrotado!');
        }else{
          alert('has ganado la partida')
        }
    }else if(message.type=='powerUp'){
      if(message.message=='sonar'){
        alert('Se han encontrado barcos en:'+ message.shipPositions);
      }
      if(message.message=='aviones'){
        alert('Hemos recibido un ataque con aviones!');
      }
      if(message.message=='minaPuesta'){
        alert('La mina se ha puesto con éxito');
      }
      if(message.message=='minaDetonada'){
        alert('Ha explotado una mina!');
      }
      if(message.message=='minaFallida'){
        alert('El ataque de la mina no ha tenid éxito...');
      }
      if(message.message=='escudoActivado'){
        alert('Se ha activado el escudo');
      }
      if(message.message=='recuperacion'){
        alert('Se ha reparado la casilla de un barco!');
        if(message.idPowerUp==idThisPlayer){
          let casilla=document.getElementById('tjugador1@'+message.move);
          casilla.removeChild(Array.from(casilla.children)[0])
        }else{
          let casilla=document.getElementById('tjugador2@'+message.move);
          casilla.removeChild(Array.from(casilla.children)[0])
        }
      }
      if(message.message=='EMP'){
        alert('Estaremos bajo un ataque EMP por los sigientes 3 turnos!');
      }
      if(message.message=='bloqueo'){
        alert('Posición invalida, este jugador tiene un escudo activo')
      }
    }
    else if(message.type=="error"){
      alert("Ha ocurrido un error: " + message.message);
    }
  });

  socket.addEventListener('confirmPositions', (event) => {
    socket.send(JSON.stringify({ type: 'positions', gameId: gameId, gameMode:2 }));
    console.log("posiciones enviadas");
  });

  socket.addEventListener('close', () => {
    console.log('%cSe ha cerrado la conexión con el servidor WebSocket', 'color: #ee0000');

    // La conexión se cerró, por lo tanto, se deshabilitan los botones de operaciones del servidor.
    const buttons = document.getElementsByClassName('server-operation');

    [...buttons].forEach((button) => {
      button.disabled = true;
    });

    const closeButton = document.getElementById('close-connection');
    closeButton.parentNode.removeChild(closeButton);

  });
}

function agregarTitulos(jugador1,jugador2){
    const tableros= document.getElementById("tableros");
    let titulo1=document.createElement("h3");
    titulo1.classList.add("titulo-tablero");
    titulo1.innerText=("Tablero de " + jugador1);
    tableros.appendChild(titulo1);
    let titulo2=document.createElement("h3");
    titulo2.classList.add("titulo-tablero");

    titulo2.innerText=("Tablero de " + jugador2);
    tableros.appendChild(titulo2);
}

window.addEventListener("DOMContentLoaded", (event)=>{  
  agregarTitulos("jugador 1", "jugador 2");
  agregarTablero("jugador1");
  agregarTablero("jugador2");
  agregarTitulos("jugador 3", "jugador 4");
  agregarTablero("jugador3");
  agregarTablero("jugador4");
  agregarEventosSocket(socket);
  agregarListenersPowerUps();

  Array.from(document.getElementsByClassName("boton-barco")).forEach(boton=>{
    boton.disabled=true;
  });
  
  document.getElementById("create-game").addEventListener('click', () => {
    socket.send(JSON.stringify({ type: 'create', gameMode: 4 }));
  });
  document.getElementById('join-game').addEventListener('click', () => {
    const gameId = document.getElementById('game-id').value;

    socket.send(JSON.stringify({ type: 'join', gameId: gameId, gameMode: 4 }));
  });

  document.getElementById('start-game').addEventListener('click', () => {
      const gameId = document.getElementById('game-id').value;
      socket.send(JSON.stringify({ type: 'start', gameId: gameId }));
    });


  document.getElementById('send-move').addEventListener('click', () => {
      const gameId = document.getElementById('game-id').value;
      const move = document.getElementById('move').value;
      socket.send(JSON.stringify({ type: 'move', gameId, move }));

    });

    
  document.getElementById('leave-game').addEventListener('click', () => {
    const response=confirm("Seguro que quiere abandonar la partida?");
    if(response){
      const gameId = document.getElementById('game-id').value;
      document.getElementById("game-id").disabled=false;
      alert("Has abandonado la partida")
      socket.send(JSON.stringify({ type: 'leave', gameId }));
    }
    });


  document.getElementById('close-connection').addEventListener('click', () => {
      const response = confirm('¿Estás seguro de que deseas cerrar la conexión con el servidor de WebSocket?\n\nSi la cierras, no podrás enviar ni recibir más mensajes y, de acuerdo a esta implementación, tendrás que recargar la página.');
      if (response) {
        socket.close();
      }
    });
})

function agregarListenersTablero(id){
  const tablero=document.getElementById(id);
  const posiciones=Array.from(tablero.getElementsByClassName("position"));
  posiciones.forEach(pos =>{
      pos.addEventListener("click", event=>{
          const posiconCheck=pos.id.split('@')[1];
          const gameId = document.getElementById('game-id').value;
          let idJugador;
          idJugador=transformMatrix[idThisPlayer][id.split('r')[1]-2];
          console.log(idJugador)
          socket.send(JSON.stringify({ type: 'move', gameId: gameId, message:idJugador, move:posiconCheck}));
      });
  });
}

function enviarBarcos(){
  let arrayBarcos= [];
  let barcos= new Map();
  barcos.set(0,'portaaviones');
  barcos.set(1,'acorazado');
  barcos.set(2,'crucero');
  barcos.set(3,'submarino');
  barcos.set(4,'destructor');
  let sizes= [5,4,3,3,2];
  for(let i=0;i<5;i++){
    for(let j=0;j<=sizes[i];j++){
      const clase='barco'+i+'-'+(j+1);
      const coleccion=document.getElementsByClassName(clase);
      let casillas=Array.from(coleccion);
      casillas.forEach(casilla=>{
        let pos=casilla.id;
        pos=pos.split('@')[1];
        pos=barcos.get(i)+'@'+pos;
        arrayBarcos[arrayBarcos.length]=pos;
      })
    }
  } 
  localStorage.setItem('positions',convertArrayToString(arrayBarcos));
  const idJugador=idThisPlayer;
  const gameId = document.getElementById('game-id').value;
  socket.send(JSON.stringify({ type: 'positions', gameId: gameId, message: idJugador, shipPositions: arrayBarcos}));
}

function convertArrayToString(array){
  let stringArray='';
  array.forEach(pos=>{
      stringArray=stringArray+'_'+pos;
  })
  return stringArray;
}

export {enviarBarcos}

function agregarListenersPowerUps(){
  document.getElementById('sonar').addEventListener('click',()=>{
    let move=document.getElementById('move-power-up').value;
    let gameId=document.getElementById('game-id').value;
    let idAtacado
    idAtacado=transformMatrix[idThisPlayer][document.getElementById('player-power-up').value-2];
    if(puntaje>=5){
      socket.send(JSON.stringify({ type: 'powerUp', powerUp:'sonar', message: idThisPlayer, idPowerUp:idAtacado, move:move, gameId:gameId}));
      puntaje=puntaje-5;
      document.getElementById("puntaje").innerText=puntaje;
    }
    else{ 
      alert('No tienes suficientes puntos para usar este power up');
    }
  })
  document.getElementById('aviones').addEventListener('click',()=>{
    let gameId=document.getElementById('game-id').value;
    let move='placeholder';
    let idAtacado
    idAtacado=transformMatrix[idThisPlayer][document.getElementById('player-power-up').value-2];
    if(puntaje>=10){
      socket.send(JSON.stringify({ type: 'powerUp', powerUp:'aviones', message: idThisPlayer, idPowerUp:idAtacado,gameId:gameId, move:move}));      puntaje=puntaje-5;
      puntaje=puntaje-10;
      document.getElementById("puntaje").innerText=puntaje;
    }
    else{
      alert('No tienes suficientes puntos para usar este power up');
    }
  })
  document.getElementById('mina').addEventListener('click',()=>{
    let gameId=document.getElementById('game-id').value;
    let move=document.getElementById('move-power-up').value;
    let idAtacado
    idAtacado=transformMatrix[idThisPlayer][document.getElementById('player-power-up').value-2];
    if(puntaje>=5){
      socket.send(JSON.stringify({ type: 'powerUp', powerUp:'mina', message: idThisPlayer, idPowerUp:idAtacado,move:move,gameId:gameId}));
      puntaje=puntaje-5;
      document.getElementById("puntaje").innerText=puntaje;
    }
    else{
      alert('No tienes suficientes puntos para usar este power up');
    }
  })
  document.getElementById('escudo').addEventListener('click',()=>{
    let gameId=document.getElementById('game-id').value;
    let move=document.getElementById('move-power-up').value;
    let idAtacado
    idAtacado=transformMatrix[idThisPlayer][document.getElementById('player-power-up').value-2];
    if(puntaje>=15){
      socket.send(JSON.stringify({ type: 'powerUp', powerUp:'escudo', message: idThisPlayer, idPowerUp:idAtacado,move:move,gameId:gameId}));
      puntaje=puntaje-15;
      document.getElementById("puntaje").innerText=puntaje;
    }
    else{
      alert('No tienes suficientes puntos para usar este power up');
    }
  })
  document.getElementById('misil').addEventListener('click',()=>{
    let move=document.getElementById('move-power-up').value;
    let gameId=document.getElementById('game-id').value;
    let idAtacado
    idAtacado=transformMatrix[idThisPlayer][document.getElementById('player-power-up').value-2];
    if(puntaje>=15){
      socket.send(JSON.stringify({ type: 'powerUp', powerUp:'misil', message: idThisPlayer, idPowerUp:idAtacado, move:move,gameId:gameId}));
      puntaje=puntaje-15;
      document.getElementById("puntaje").innerText=puntaje;
    }
    else{
      alert('No tienes suficientes puntos para usar este power up');
    }
  })
  document.getElementById('reparacion').addEventListener('click',()=>{
    let move=document.getElementById('move-power-up').value;
    let gameId=document.getElementById('game-id').value;
    let idAtacado
    idAtacado=transformMatrix[idThisPlayer][document.getElementById('player-power-up').value-2];
    if(puntaje>=10){
      socket.send(JSON.stringify({ type: 'powerUp', powerUp:'recuperacion', message: idThisPlayer, idPowerUp:idAtacado,gameId:gameId, move:move}));
      puntaje=puntaje-10;
      document.getElementById("puntaje").innerText=puntaje;
    }
    else{
      alert('No tienes suficientes puntos para usar este power up');
    }
  })
  document.getElementById('EMP').addEventListener('click',()=>{
    let gameId=document.getElementById('game-id').value;
    let idAtacado
    idAtacado=transformMatrix[idThisPlayer][document.getElementById('player-power-up').value-2];
    if(puntaje>=25){
      socket.send(JSON.stringify({ type: 'powerUp', powerUp:'EMP', message: idThisPlayer, idPowerUp:idAtacado,gameId:gameId,move:'placeholder'}));
      puntaje=puntaje-25;
      document.getElementById("puntaje").innerText=puntaje;
    }
    else{
      alert('No tienes suficientes puntos para usar este power up');
    }
  })
}

function temporizador(ms) {
  let timerId;
  const promesa = new Promise((resolve, reject) => {
      timerId = setTimeout(resolve, ms);
  });
  return {
      promesa,
      cancelar: () => clearTimeout(timerId)
  };
}

let miTemporizador;

function iniciarTemporizador() {
  miTemporizador = temporizador(60000);
  console.log('Temporizador iniciado');

  miTemporizador.promesa
      .then(() => {
          console.log('Temporizador completado');
          socket.send(JSON.stringify({ type:'timeout',gameId:document.getElementById('game-id').value}));
          alert('Turno excedido!'); // Muestra el alert cuando el tiempo se cumple
      })
      .catch(err => console.log('Temporizador cancelado: ' + err));
}

function cancelarTemporizador() {
  if (miTemporizador) {
      miTemporizador.cancelar();
      console.log('Temporizador cancelado');
  }
}
