const socket = new WebSocket(crearURLConexion());
let idThisPlayer;
let puntaje=0;
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
    if(message.type=="playerJoinedTournament"){
        alert("un jugador se unio a este torneo:"+ message.tournamentid);
    }
    if(message.type=="gameCreated"){
      alert("El id de su juego es: "+ message.gameId);
      idThisPlayer='0';
      const idJugador=idThisPlayer;
      const arrayBarcos=localStorage.getItem('positions').split('_');
      document.getElementById("game-id").value=message.gameId;
      Array.from(document.getElementsByClassName("boton-barco")).forEach(boton=>{
        boton.disabled=false;
      })
    }
    if(message.type=="gameEnded"){
      vaciarBarco(0,5);
      vaciarBarco(1,4);
      vaciarBarco(2,3);
      vaciarBarco(3,3);
      vaciarBarco(4,2);
      const tablero=document.getElementById("jugador2");
      const posiciones=Array.from(tablero.getElementsByClassName("position"));
      
      posiciones.forEach(pos =>{
        if(Array.from(pos.children)[0]){
          pos.removeChild(Array.from(pos.children)[0])
        }
          
      });
      alert("se va empezar un nuevo torneo: "+ message.gameId);
      document.getElementById('torneo-id').value=message.gameId;
    }
    if(message.type=="move"){
      let element=document.createElement("div");
      let element2=document.createElement("div");
      element2.classList.add("miss");
      element.classList.add("fire");
      let casilla
      let casilla2
      if(message.message=='miss'){
        alert("El enemigo ha realizado el movimiento: "+ message.move+ "!");
        alert("El enemigo ha fallado");
        puntaje=puntaje+1;
        document.getElementById('puntaje').value=puntaje;
        casilla2=document.getElementById("tjugador1@"+message.move);
        casilla2.appendChild(element2);
      } else if(message.message=='miss-propio'){
        alert("Hemos fallado!");
        casilla2=document.getElementById("tjugador2@"+message.move);
        casilla2.appendChild(element2);
      }else if(message.message=='daño'){
        alert("El enemigo ha realizado el movimiento: "+ message.move+ "!");
        alert("El enemigo ha acertado!");
        casilla=document.getElementById("tjugador1@"+message.move);
        casilla.appendChild(element);
      }else if(message.message=='daño-propio'){
        alert("Hemos acertado!");
        casilla=document.getElementById("tjugador2@"+message.move);
        casilla.appendChild(element);
        puntaje=puntaje+2;
        document.getElementById('puntaje').innerText=puntaje;
      }
      
      
    }
    if(message.type=="playerJoined"){
      alert("Se ha unido un jugador a la partida");
    }
    if(message.type=="WinT"){
      alert("Has Ganado el torneo");
    }
    if(message.type=="noJ"){
      alert("No hay suficientes ganadores");
    }
    if(message.type=="T-created"){
      alert("se creo el toreno"+message.gameId);
      document.getElementById('torneo-id').value=message.gameId;
    }
    if(message.type=="playerLeft"){
      alert("Un jugador ha abandonado la partida");
    }
    if(message.type=="gameStarted"){
      document.getElementById("game-id").disabled=true;
      alert("La partida ha empezado");
    }
    if(message.type=="joined"){
        idThisPlayer=message.playerCount;
        Array.from(document.getElementsByClassName("boton-barco")).forEach(boton=>{
          boton.disabled=false;
        })
    }
    if(message.type=='victoria'){
        let playerID=idThisPlayer;
        if(message.message!=playerID){
          alert("Has ganado la partida");
        }else{
          alert("Has perdido la partida");
        }
    }
    if(message.type=='powerUp'){
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
    if(message.type=="error"){
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

window.addEventListener("DOMContentLoaded", (event)=>{
      
  agregarTitulos("jugador 1", "jugador 2");
  agregarTablero("jugador1");
  agregarTablero("jugador2");
 
  localStorage.setItem('positions','');
  agregarEventosSocket(socket);
  agregarListenersPowerUps();
  const tablero=document.getElementById("jugador2");
  const posiciones=Array.from(tablero.getElementsByClassName("position"));
  
  posiciones.forEach(pos =>{
      pos.addEventListener("click", event=>{
          const posiconCheck=pos.id.split('@')[1];
          console.log(posiconCheck);
          const gameId = document.getElementById('game-id').value;
        
          let idJugador;
          if(idThisPlayer==0){
            idJugador='1';
          }else{
            idJugador='0';
          }
          console.log(idJugador)
          socket.send(JSON.stringify({ type: 'moveT', gameId: gameId, message:idJugador, move:posiconCheck,tournamentid:document.getElementById('torneo-id').value}));
          if(gameId){
            
            
          }
      });
  });
  Array.from(document.getElementsByClassName("boton-barco")).forEach(boton=>{
    boton.disabled=true;
  })
  document.getElementById("create-T").addEventListener('click', () => {
    socket.send(JSON.stringify({ type: 'create-T'}));
    
    
  });
  document.getElementById("Advance").addEventListener('click', () => {
    const gameId = document.getElementById('torneo-id').value;
    socket.send(JSON.stringify({ type: 'advanceT',gameId}));
    
    
  });
  document.getElementById('join-T').addEventListener('click', () => {
    const gameId = document.getElementById('torneo-id').value;
    socket.send(JSON.stringify({ type: 'join-T', gameId: gameId}));
  });

  document.getElementById('start-Round').addEventListener('click', () => {
      const gameId = document.getElementById('torneo-id').value;
      socket.send(JSON.stringify({ type: 'Start-T', gameId: gameId }));
    });
    document.getElementById('start-game').addEventListener('click', () => {
        const gameId = document.getElementById('game-id').value;
        socket.send(JSON.stringify({ type: 'start', gameId: gameId }));
      });


  document.getElementById('send-move').addEventListener('click', () => {
      alert("te has unido a el juego")
      const gameId = document.getElementById('game-id').value;
      
      socket.send(JSON.stringify({ type: 'joinG'}));
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
function agregarListenersPowerUps(){
  document.getElementById('sonar').addEventListener('click',()=>{
    let move=document.getElementById('move-power-up').value;
    let gameId=document.getElementById('game-id').value;
    let idAtacado
    if(idThisPlayer=='1'){
      idAtacado='0';
    }
    else{
      idAtacado='1'
    }
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
    if(idThisPlayer=='1'){
      idAtacado='0';
    }
    else{
      idAtacado='1'
    }
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
    if(idThisPlayer=='1'){
      idAtacado='0';
    }
    else{
      idAtacado='1'
    }
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
    if(idThisPlayer=='1'){
      idAtacado='0';
    }
    else{
      idAtacado='1'
    }
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
    if(idThisPlayer=='1'){
      idAtacado='0';
    }
    else{
      idAtacado='1'
    }
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
    if(idThisPlayer=='1'){
      idAtacado='0';
    }
    else{
      idAtacado='1'
    }
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
    if(idThisPlayer=='1'){
      idAtacado='0';
    }
    else{
      idAtacado='1'
    }
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

export {enviarBarcos}

import { vaciarBarco } from "./enviarBarcosT.js";
