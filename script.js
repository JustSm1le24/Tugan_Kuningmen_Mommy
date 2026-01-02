// DOM Elements
const giftScreen = document.getElementById('gift-screen');
const giftBox = document.getElementById('gift-box');
const mainContent = document.getElementById('main-content');
const gameBoard = document.getElementById('game-board');
const gameMessage = document.getElementById('game-message');
const restartBtn = document.getElementById('restart-btn');
const canvas = document.getElementById('confetti');
const ctx = canvas.getContext('2d');

// Game State
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
const totalPairs = 6; // adjust based on board size (4x3 grid = 12 cards = 6 pairs)

// --- Gift Unwrapping Logic ---
giftBox.addEventListener('click', () => {
    giftBox.classList.add('shake');
    setTimeout(() => {
        giftScreen.style.opacity = '0';
        setTimeout(() => {
            giftScreen.classList.add('hidden');
            mainContent.classList.remove('hidden');
            startConfetti();
            initGame();
        }, 1000);
    }, 500);
});

// --- Memory Game Logic ---
// User: Replace these files in the folder to change game images!
const gameImages = [
    'game1.jpg',
    'game2.jpg',
    'game3.jpg',
    'game4.jpg',
    'game5.jpg',
    'game6.jpg'
];

function initGame() {
    gameBoard.innerHTML = '';
    matchedPairs = 0;
    gameMessage.classList.add('hidden');
    restartBtn.classList.add('hidden');
    cards = [];
    flippedCards = [];

    // Create pairs
    const deck = [...gameImages, ...gameImages];
    // Shuffle
    deck.sort(() => 0.5 - Math.random());

    // Build grid (4x3 for 12 cards)
    gameBoard.style.gridTemplateColumns = 'repeat(4, 1fr)';

    deck.forEach((imgSrc, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.id = index;
        card.dataset.img = imgSrc;

        const front = document.createElement('div');
        front.classList.add('card-face', 'card-front');
        front.textContent = '?';

        const back = document.createElement('div');
        back.classList.add('card-face', 'card-back');
        const img = document.createElement('img');
        img.src = imgSrc;
        back.appendChild(img);

        card.appendChild(front);
        card.appendChild(back);

        card.addEventListener('click', flipCard);
        gameBoard.appendChild(card);
        cards.push(card);
    });
}

function flipCard() {
    if (flippedCards.length < 2 && !this.classList.contains('flipped')) {
        this.classList.add('flipped');
        flippedCards.push(this);

        if (flippedCards.length === 2) {
            checkMatch();
        }
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    if (card1.dataset.img === card2.dataset.img) {
        matchedPairs++;
        flippedCards = [];
        if (matchedPairs === totalPairs) {
            gameMessage.classList.remove('hidden');
            restartBtn.classList.remove('hidden');
            startConfetti();
        }
    } else {
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCards = [];
        }, 1000);
    }
}

restartBtn.addEventListener('click', initGame);

// --- Simple Confetti Effect ---
let confettiParticles = [];

function startConfetti() {
    resizeCanvas();
    for (let i = 0; i < 100; i++) {
        confettiParticles.push(createParticle());
    }
    requestAnimationFrame(updateConfetti);
}

function createParticle() {
    return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        color: `hsl(${Math.random() * 360}, 100%, 50%)`,
        size: Math.random() * 10 + 5,
        speedY: Math.random() * 3 + 2,
        speedX: Math.random() * 2 - 1
    };
}

function updateConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    confettiParticles.forEach((p, index) => {
        p.y += p.speedY;
        p.x += p.speedX;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);

        if (p.y > canvas.height) {
            confettiParticles[index] = createParticle();
        }
    });
    if (matchedPairs === totalPairs || !mainContent.classList.contains('hidden')) {
        // Keep running if game won or just unwrapped
        // But maybe stop after a while? For now, infinite loop on unwrapping/win
        requestAnimationFrame(updateConfetti);
    }
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
