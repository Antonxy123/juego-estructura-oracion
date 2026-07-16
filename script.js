// --- 1. GENERACIÓN DE BURBUJAS DE FONDO ---
const bContainer = document.getElementById('bubblesContainer');
for (let i = 0; i < 15; i++) {
    const bubble = document.createElement('div');
    bubble.classList.add('bubble');
    const size = Math.random() * 60 + 20;
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    bubble.style.left = `${Math.random() * 100}%`;
    bubble.style.animationDelay = `${Math.random() * 8}s`;
    bubble.style.animationDuration = `${Math.random() * 10 + 10}s`;
    bContainer.appendChild(bubble);
}

// --- 2. SINTETIZADOR DE SONIDOS (Web Audio API) ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSoundEffect(type) {
    const now = audioCtx.currentTime;

    if (type === 'success') {
        // Dos notas ascendentes alegres
        [523.25, 783.99].forEach((freq, i) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.value = freq;
            gain.gain.setValueAtTime(0.2, now + i * 0.12);
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.3);
            osc.connect(gain).connect(audioCtx.destination);
            osc.start(now + i * 0.12);
            osc.stop(now + i * 0.12 + 0.3);
        });
    } else if (type === 'error') {
        // Sonido suave descendente, nunca agresivo
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(180, now + 0.25);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.connect(gain).connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.25);
    } else if (type === 'click') {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = 440;
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.connect(gain).connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.08);
    }
}

// --- 3. VOZ (Web Speech API) ---
function speak(text) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = 0.9;
    utterance.pitch = 1.2;
    window.speechSynthesis.speak(utterance);
}

// --- 4. NAVEGACIÓN ENTRE PANTALLAS ---
function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    document.getElementById('globalBackBtn').style.display = (id === 'welcomeScreen') ? 'none' : 'flex';
}

function goHome() {
    window.speechSynthesis.cancel();
    playSoundEffect('click');
    showScreen('welcomeScreen');
}

function showLearnSelection() {
    playSoundEffect('click');
    showScreen('learnSelectionScreen');
}

// --- 5. DATOS DE LOS CONCEPTOS (TUTORIAL) ---
const conceptOrder = ['sujeto', 'predicado', 'pronombre', 'adjetivo'];

const concepts = {
    sujeto: {
        title: 'Sujeto',
        emoji: '🐶',
        text: '¡El sujeto es quien hace la acción! Como el perrito.',
        audio: 'El sujeto es quien hace la acción. Por ejemplo, el perrito.'
    },
    predicado: {
        title: 'Predicado',
        emoji: '🏃',
        text: '¡El predicado es lo que hace el sujeto! Como correr.',
        audio: 'El predicado es lo que hace el sujeto. Por ejemplo, correr muy rápido.'
    },
    pronombre: {
        title: 'Pronombre',
        emoji: '🎭',
        text: '¡El pronombre es un disfraz! Reemplaza el nombre, como él o ella.',
        audio: 'El pronombre es como un disfraz. Reemplaza los nombres, como él o ella.'
    },
    adjetivo: {
        title: 'Adjetivo',
        emoji: '🎨',
        text: '¡El adjetivo dice cómo son las cosas! Como grande o rojo.',
        audio: 'El adjetivo nos dice cómo son las cosas. Por ejemplo, grande o rojo.'
    }
};

let currentTutorialIndex = 0;

function exploreConcept(key) {
    playSoundEffect('click');
    currentTutorialIndex = conceptOrder.indexOf(key);
    loadTutorial();
    showScreen('introDetailScreen');
}

function loadTutorial() {
    const key = conceptOrder[currentTutorialIndex];
    const c = concepts[key];

    document.getElementById('detailTitle').textContent = c.title;
    document.getElementById('detailImg').textContent = c.emoji;
    document.getElementById('detailText').textContent = c.text;

    const nextBtn = document.getElementById('tutorialNextBtn');
    const esUltimo = currentTutorialIndex === conceptOrder.length - 1;
    nextBtn.innerHTML = esUltimo ? '¡A jugar! 🚀' : '¡Siguiente! ➡️';

    speak(c.audio);
}

function speakCurrentTutorial() {
    const key = conceptOrder[currentTutorialIndex];
    speak(concepts[key].audio);
}

function nextTutorial() {
    playSoundEffect('click');
    currentTutorialIndex++;
    if (currentTutorialIndex >= conceptOrder.length) {
        startGames();
    } else {
        loadTutorial();
    }
}

function backToSelection() {
    window.speechSynthesis.cancel();
    playSoundEffect('click');
    showScreen('learnSelectionScreen');
}

// --- 6. JUEGO ---
const gameQuestions = [
    {
        concept: 'sujeto',
        prompt: '¿Dónde está el Sujeto?',
        helper: 'Toca quién hace la acción',
        options: [
            { emoji: '🐶', label: 'Perrito', correct: true },
            { emoji: '🏃', label: 'Corre' },
            { emoji: '🔴', label: 'Rojo' }
        ]
    },
    {
        concept: 'predicado',
        prompt: '¿Dónde está el Predicado?',
        helper: 'Toca lo que hace el sujeto',
        options: [
            { emoji: '🐱', label: 'Gato' },
            { emoji: '😴', label: 'Duerme', correct: true },
            { emoji: '🟡', label: 'Amarillo' }
        ]
    },
    {
        concept: 'pronombre',
        prompt: '¿Dónde está el Pronombre?',
        helper: 'Toca el disfraz del nombre',
        options: [
            { emoji: '👧', label: 'Ella', correct: true },
            { emoji: '🍎', label: 'Manzana' },
            { emoji: '🏠', label: 'Casa' }
        ]
    },
    {
        concept: 'adjetivo',
        prompt: '¿Dónde está el Adjetivo?',
        helper: 'Toca cómo es la cosa',
        options: [
            { emoji: '🚗', label: 'Carro' },
            { emoji: '🔴', label: 'Rojo', correct: true },
            { emoji: '🏃', label: 'Corre' }
        ]
    },
    {
        concept: 'sujeto',
        prompt: '¿Dónde está el Sujeto?',
        helper: 'Toca quién hace la acción',
        options: [
            { emoji: '🐦', label: 'Pajarito', correct: true },
            { emoji: '✈️', label: 'Vuela' },
            { emoji: '🔵', label: 'Azul' }
        ]
    },
    {
        concept: 'predicado',
        prompt: '¿Dónde está el Predicado?',
        helper: 'Toca lo que hace el sujeto',
        options: [
            { emoji: '🐻', label: 'Oso' },
            { emoji: '🍯', label: 'Come miel', correct: true },
            { emoji: '🟢', label: 'Verde' }
        ]
    },
    {
        concept: 'pronombre',
        prompt: '¿Dónde está el Pronombre?',
        helper: 'Toca el disfraz del nombre',
        options: [
            { emoji: '👦', label: 'Él', correct: true },
            { emoji: '🎈', label: 'Globo' },
            { emoji: '🌟', label: 'Estrella' }
        ]
    },
    {
        concept: 'adjetivo',
        prompt: '¿Dónde está el Adjetivo?',
        helper: 'Toca cómo es la cosa',
        options: [
            { emoji: '🎈', label: 'Globo', estilo: 'font-size: 3.5rem' },
            { emoji: '🎈', label: 'Grande', correct: true, estilo: 'font-size: 6rem' },
            { emoji: '🏃', label: 'Corre' }
        ]
    }
];

let currentQuestionIndex = 0;
let score = 0;

function startGames() {
    playSoundEffect('click');
    currentQuestionIndex = 0;
    score = 0;
    showScreen('gameScreen');
    loadGameQuestion();
}

function loadGameQuestion() {
    const q = gameQuestions[currentQuestionIndex];
    const progress = ((currentQuestionIndex) / gameQuestions.length) * 100;
    document.getElementById('progressBar').style.width = progress + '%';
    document.getElementById('gameQuestion').textContent = q.prompt;
    document.getElementById('gameSubtitle').textContent = q.helper;

    const grid = document.getElementById('optionsGrid');
    grid.innerHTML = '';

    const opciones = shuffle(q.options);
    opciones.forEach(o => {
        const card = document.createElement('div');
        card.className = 'game-option-card';

        const emojiDiv = document.createElement('div');
        emojiDiv.className = 'option-emoji';
        emojiDiv.textContent = o.emoji;
        if (o.estilo) emojiDiv.style.cssText += o.estilo;

        const label = document.createElement('span');
        label.className = 'option-label';
        label.textContent = o.label;

        card.appendChild(emojiDiv);
        card.appendChild(label);
        card.onclick = () => checkGameAnswer(card, !!o.correct);
        grid.appendChild(card);
    });

    speak(q.prompt + '. ' + q.helper);
}

function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function speakCurrentQuestion() {
    const q = gameQuestions[currentQuestionIndex];
    speak(q.prompt + '. ' + q.helper);
}

function checkGameAnswer(card, correct) {
    const allCards = document.querySelectorAll('.game-option-card');

    if (correct) {
        playSoundEffect('success');
        card.classList.add('correct');
        speak('¡Muy bien!');
        allCards.forEach(c => c.onclick = null);

        speechSynthesis.addEventListener('end', function avanzar() {
            speechSynthesis.removeEventListener('end', avanzar);
        }, { once: true });

        setTimeout(() => {
            currentQuestionIndex++;
            if (currentQuestionIndex >= gameQuestions.length) {
                showCongrats();
            } else {
                loadGameQuestion();
            }
        }, 1200);
    } else {
        playSoundEffect('error');
        card.classList.add('incorrect');
        speak('Intenta otra vez');
        setTimeout(() => card.classList.remove('incorrect'), 500);
    }
}

// --- 7. PANTALLA FINAL Y CONFETI ---
function showCongrats() {
    document.getElementById('progressBar').style.width = '100%';
    showScreen('congratsScreen');
    speak('¡Felicidades! Terminaste el juego. Eres el rey o la reina de las palabras.');
    fireConfetti();
}

function restartEverything() {
    playSoundEffect('click');
    currentQuestionIndex = 0;
    score = 0;
    currentTutorialIndex = 0;
    showScreen('welcomeScreen');
}

function fireConfetti() {
    const canvas = document.getElementById('confettiCanvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');
    const colors = ['#FF477E', '#FF823A', '#2EC4B6', '#3A86FF', '#8338EC'];

    const piezas = Array.from({ length: 120 }, () => ({
        x: Math.random() * canvas.width,
        y: -20,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: Math.random() * 3 + 2,
        drift: Math.random() * 2 - 1,
        rotation: Math.random() * 360
    }));

    let frames = 0;
    function animar() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        piezas.forEach(p => {
            p.y += p.speed;
            p.x += p.drift;
            p.rotation += 5;
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate((p.rotation * Math.PI) / 180);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
            ctx.restore();
        });
        frames++;
        if (frames < 200) {
            requestAnimationFrame(animar);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }
    animar();
}