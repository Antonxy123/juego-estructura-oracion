let puntaje = 0;
let paso = 0;

const preguntas = [
{
titulo:"Pregunta 1",
pregunta:"¿Cuál es el sujeto de la oración?",
oracion:"🐶 El perro corre rápido.",
opciones:["Perro","Corre","Rápido"],
correcta:"Perro"
},

{
titulo:"Pregunta 2",
pregunta:"¿Cuál es el verbo?",
oracion:"🐱 El gato duerme.",
opciones:["Gato","Duerme","Bonito"],
correcta:"Duerme"
},

{
titulo:"Pregunta 3",
pregunta:"¿Cuál es el adjetivo?",
oracion:"🌸 La flor es hermosa.",
opciones:["Flor","Hermosa","Es"],
correcta:"Hermosa"
},

{
titulo:"Pregunta 4",
pregunta:"¿Cuál es el pronombre?",
oracion:"👧 Ella juega con la pelota.",
opciones:["Ella","Juega","Pelota"],
correcta:"Ella"
}
];

function cargarPregunta(){

document.getElementById("titulo").innerHTML=preguntas[paso].titulo;

document.getElementById("pregunta").innerHTML=preguntas[paso].pregunta;

document.getElementById("oracion").innerHTML=preguntas[paso].oracion;

let botones=document.querySelectorAll(".opciones button");

for(let i=0;i<3;i++){

botones[i].innerHTML=preguntas[paso].opciones[i];

botones[i].onclick=function(){

responder(preguntas[paso].opciones[i]);

}

}

document.getElementById("mensaje").innerHTML="";

document.getElementById("siguiente").style.display="none";

}

function responder(respuesta){

if(respuesta==preguntas[paso].correcta){

puntaje++;

document.getElementById("mensaje").innerHTML="✅ ¡Muy bien!";

document.getElementById("mensaje").style.color="green";

}else{

document.getElementById("mensaje").innerHTML="❌ Inténtalo otra vez";

document.getElementById("mensaje").style.color="red";

}

document.getElementById("puntaje").innerHTML=puntaje;

document.getElementById("siguiente").style.display="inline-block";

}

function siguiente(){

paso++;

if(paso<preguntas.length){

cargarPregunta();

}else{

document.querySelector(".contenedor").innerHTML=`
<h1>🎉 ¡Felicidades!</h1>

<h2>Terminaste el juego.</h2>

<h2>Puntaje: ${puntaje} / ${preguntas.length}</h2>

<h1>⭐⭐⭐⭐⭐</h1>

<button onclick="location.reload()">Jugar otra vez</button>
`;

}

}

cargarPregunta();