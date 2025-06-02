let SelectedButtonID = null;
let botonOrientacion = null;

window.onload = function() {
    enableButtonSelection();
    enableBoardSelection();
    botonOrientacion = document.getElementById("orientacion");
    botonOrientacion.addEventListener('click', () => {
        if (botonOrientacion.innerText == "Vertical") {
            botonOrientacion.innerText = "Horizontal";
        } else {
            botonOrientacion.innerText = "Vertical";
        }
    });
}

function enableButtonSelection() {
    let buttons = Array.from(document.getElementsByClassName("boton-barco"));

    buttons.forEach(button => {
        button.addEventListener("click", event => {
            buttons.forEach(b => b.classList.remove("selected"));

            button.classList.add("selected");
            SelectedButtonID = button.id;
        });
    });
}

function enableBoardSelection(){
    const tablero=document.getElementById("jugador1");
    const posiciones=Array.from(tablero.getElementsByClassName("position"));
    posiciones.forEach(pos =>{
        pos.addEventListener("click", event=>{
            if(SelectedButtonID!=null){
                agregarBarco(SelectedButtonID,pos.id);
            }
        });
    });
}

function agregarBarco(buttonID, pos){
    switch (buttonID) {
        case "portaaviones":
            agregarPortaaviones(pos);
            break;
        case "acorazado":
            agregarAcorazado(pos);
            break;
        case "crucero":
            agregarCrucero(pos);
            break;
        case "submarino":
            agregarSubmarino(pos);
            break;
        case  "destructor":
            agregarDestructor(pos);
            break;
    }
}

function vaciarBarco(barco,size){
    for(let i=0;i<size;i++){
        const clase="barco"+barco+"-"+(i+1);
        const coleccion=document.getElementsByClassName(clase);
        let casillas=Array.from(coleccion);
        casillas.forEach(casilla =>{
            casilla.classList.remove(clase);
            casilla.classList.remove('rotated');
        });
    }
}

function agregarPortaaviones(pos){
    let posSeparado=pos.split('@');
    let casilla=posSeparado[1];
    let columna=casilla.charAt(0);
    let fila
    if(casilla.length==2){
        fila=casilla.charAt(1);
    }else{
        fila=casilla.charAt(1)+casilla.charAt(2);
    } 
    if(botonOrientacion.innerText=="Vertical"){
        let subId=posSeparado[0]+'@'+columna;
        ponerBarcoVertical(0,5,subId,fila);
    }else{
        let subId=posSeparado[0]+'@';
        ponerBarcoHorizontal(0,5,subId,fila,columna);
    } 
}

function agregarAcorazado(pos){
    let posSeparado=pos.split('@');
    let casilla=posSeparado[1];
    let columna=casilla.charAt(0);
    let fila
    if(casilla.length==2){
        fila=casilla.charAt(1);
    }else{
        fila=casilla.charAt(1)+casilla.charAt(2);
    }
    if(botonOrientacion.innerText=="Vertical"){
        let subId=posSeparado[0]+'@'+columna;
        ponerBarcoVertical(1,4,subId,fila);
    }else{
        let subId=posSeparado[0]+'@';
        ponerBarcoHorizontal(1,4,subId,fila,columna);
    }  
}

function agregarCrucero(pos){
    let posSeparado=pos.split('@');
    let casilla=posSeparado[1];
    let columna=casilla.charAt(0);
    let fila
    if(casilla.length==2){
        fila=casilla.charAt(1);
    }else{
        fila=casilla.charAt(1)+casilla.charAt(2);
    } 
    if(botonOrientacion.innerText=="Vertical"){
        let subId=posSeparado[0]+'@'+columna;
        ponerBarcoVertical(2,3,subId,fila);
    }else{
        let subId=posSeparado[0]+'@';
        ponerBarcoHorizontal(2,3,subId,fila,columna);
    } 
}

function agregarSubmarino(pos){
    let posSeparado=pos.split('@');
    let casilla=posSeparado[1];
    let columna=casilla.charAt(0);
    let fila
    if(casilla.length==2){
        fila=casilla.charAt(1);
    }else{
        fila=casilla.charAt(1)+casilla.charAt(2);
    }
    if(botonOrientacion.innerText=="Vertical"){
        let subId=posSeparado[0]+'@'+columna;
        ponerBarcoVertical(3,3,subId,fila);
    }else{
        let subId=posSeparado[0]+'@';
        ponerBarcoHorizontal(3,3,subId,fila,columna);
    }
      
}

function agregarDestructor(pos){
    let posSeparado=pos.split('@');
    let casilla=posSeparado[1];
    let columna=casilla.charAt(0);
    let fila
    if(casilla.length==2){
        fila=casilla.charAt(1);
    }else{
        fila=casilla.charAt(1)+casilla.charAt(2);
    }
    if(botonOrientacion.innerText=="Vertical"){
        let subId=posSeparado[0]+'@'+columna;
        ponerBarcoVertical(4,2,subId,fila);
    }else{
        let subId=posSeparado[0]+'@';
        ponerBarcoHorizontal(4,2,subId,fila,columna);
    }
}

function ponerBarcoVertical(barco,size,subId,fila) {
    let listaBarcos=new Map();
    listaBarcos.set(0,"portaaviones");
    listaBarcos.set(1,"acorazado");
    listaBarcos.set(2,"crucero");
    listaBarcos.set(3,"submarino");
    listaBarcos.set(4,"destructor");
    if((Number.parseInt(fila)+size)>11){
        alert("No cabe el "+listaBarcos.get(barco));
    }else{
        vaciarBarco(barco,size);
        for(let i=0;i<size;i++){
            let casillaBarco=document.getElementById(subId+(Number.parseInt(fila)+i));
            if(Array.from(casillaBarco.classList).length !=1){
                alert("el barco se intercepta con otros, posición inválida");
                vaciarBarco(barco,size);
                break;
            }else{
                casillaBarco.classList.add("barco"+barco+"-"+(i+1));
            }   
        }
    }
    enviarBarcos();
}

function ponerBarcoHorizontal(barco,size,subId,fila,columna){
    let listaBarcos=new Map();
    listaBarcos.set(0,"portaaviones");
    listaBarcos.set(1,"acorazado");
    listaBarcos.set(2,"crucero");
    listaBarcos.set(3,"submarino");
    listaBarcos.set(4,"destructor");
    if((columna.charCodeAt(0)+size)>75){
        alert("No cabe el "+listaBarcos.get(barco));
    }else{
        vaciarBarco(barco,size);
        for(let i=0;i<size;i++){
            let casillaBarco=document.getElementById(subId+(String.fromCharCode(columna.charCodeAt(0)+i))+Number.parseInt(fila));
            if(Array.from(casillaBarco.classList).length !=1){
                alert("el barco se intercepta con otros, posición inválida");
                vaciarBarco(barco,size);
                break;
            }else{
                casillaBarco.classList.add("barco"+barco+"-"+(i+1));
                casillaBarco.classList.add("rotated");
            }   
        }
    }
    enviarBarcos();
}

import { enviarBarcos } from "./modoCuatroJugadores.js"; // Asegúrate de que este archivo exista y esté configurado correctamente