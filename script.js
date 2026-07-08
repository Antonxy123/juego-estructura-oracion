// Banco de preguntas adaptado a niños pequeños
const challenges = [
    {
        text: "El <span class='highlight-word'>perrito</span> corre feliz",
        type: "Sujeto",
        audioText: "¡El perrito!"
    },
    {
        text: "El gato <span class='highlight-word'>duerme mucho</span>",
        type: "Predicado",
        audioText: "¡Duerme mucho!"
    },
    {
        text: "<span class='highlight-word'>Ella</span> juega con la pelota",
        type: "Pronombre",
        audioText: "¡Ella!"
    },
    {
        text: "El carro es <span class='highlight-word'>rojo</span>",
        type: "Adjetivo",
        audioText: "¡Rojo!"
    },
    {
        text: "La <span class='highlight-word'>mariposa</span> vuela alto",
        type: "Sujeto",
        audioText: "¡La mariposa!"
    },
    {
        text: "Mi amigo es <span class='highlight-word'>bueno</span>",
        type: "Adjetivo",
        audioText: "¡Bueno!"
    },
    {
        text: "<span class='highlight-word'>Él</span> come una manzana",
        type: "Pronombre",
        audioText: "¡Él!"
    },
    {
        text: "El oso <span class='highlight-word'>come miel</span>",
        type: "Predicado",
        audioText: "¡Come miel!"
    }
];

let currentChallengeIndex = 0;
let score = 0;

// Función para que la computadora hable (Audio integrado sin archivos externos)
function speak(text) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel(); // Detener audios anteriores
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-ES';
        utterance.rate = 0.9; // Un poco más lento para niños
        utterance.pitch = 1.3; // Tono más tierno/infantil
        window.speechSynthesis.speak(utterance);
    }
}

// Sonidos explicativos al tocar las tarjetas superiores
function playSound(type) {
    if (type === 'sujeto') speak("¡Sujeto! Es quien hace la acción. Por ejemplo: El perrito.");
    if (type === 'predicado') speak("¡Predicado! Es lo que hace el sujeto. Por ejemplo: Salta muy alto.");
    if (type === 'pronombre') speak("¡Pronombre! Son palabras mágicas como Él o Ella que reemplazan los nombres.");
    if (type === 'adjetivo') speak("¡Adjetivo! Nos dice cómo son las cosas. Por ejemplo: ¡Grande o bonito!");
}

// Cargar el reto actual en pantalla
function loadChallenge() {
    const challenge = challenges[currentChallengeIndex];
    const box = document.getElementById("sentenceBox");
    box.innerHTML = challenge.text;
    
    // Leer la oración automáticamente al cargar para ayudar a los niños que no leen aún
    const cleanText = box.innerText;
    speak("¿Qué es la palabra brillante en: " + cleanText + "?");
}

// Verificar la respuesta seleccionada por el niño
function checkAnswer(selectedType) {
    const challenge = challenges[currentChallengeIndex];
    const scoreText = document.getElementById("scoreText");

    if (selectedType === challenge.type) {
        // Sonido de éxito y felicitación
        speak("¡Sí! ¡Excelente! Es un " + challenge.type);
        score++;
        scoreText.innerText = score;
        scoreText.parentElement.classList.add("success-animate");
        setTimeout(() => scoreText.parentElement.classList.remove("success-animate"), 500);
        
        // Pasar al siguiente juego
        currentChallengeIndex = (currentChallengeIndex + 1) % challenges.length;
        setTimeout(loadChallenge, 1500);
    } else {
        // Sonido de aliento si se equivoca
        speak("¡Cerca! Inténtalo otra vez, tú puedes.");
    }
}

// Iniciar el juego automáticamente al abrir la página
window.onload = loadChallenge;