// Define animal data with their classifications
const animalData = [
    { name: 'コウモリ', url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@13.1.0/assets/svg/1f987.svg', classification: '哺乳類' }, // Bat emoji
    { name: 'ペンギン', url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@13.1.0/assets/svg/1f427.svg', classification: '鳥類' }, // Penguin emoji
    { name: 'イモリ', url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@13.1.0/assets/svg/1f98e.svg', classification: '両生類' }, // Newt/Salamander emoji
    { name: 'ヘビ', url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@13.1.0/assets/svg/1f40d.svg', classification: '爬虫類' }, // Snake emoji
    { name: 'クジラ', url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@13.1.0/assets/svg/1f40b.svg', classification: '哺乳類' }, // Whale emoji
    { name: 'イルカ', url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@13.1.0/assets/svg/1f42c.svg', classification: '哺乳類' }, // Dolphin emoji
    { name: 'メダカ', url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@13.1.0/assets/svg/1f420.svg', classification: '魚類' }, // Fish emoji (representing Killifish)
    { name: 'カエル', url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@13.1.0/assets/svg/1f438.svg', classification: '両生類' }  // Frog emoji
];

const PAIRS = animalData.length; // Total pairs of cards

let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let canFlip = true;
let timeElapsed = 0;
let timerInterval = null;

let gameBoard, startGameButton, resetButton, timeDisplay, matchedPairsDisplay, totalPairsDisplay, gameMessage;

function getDOMElements() {
    gameBoard = document.getElementById('game-board');
    startGameButton = document.getElementById('start-game');
    resetButton = document.getElementById('reset-game');
    timeDisplay = document.getElementById('time');
    matchedPairsDisplay = document.getElementById('matched-pairs');
    totalPairsDisplay = document.getElementById('total-pairs');
    gameMessage = document.getElementById('game-message');
}

function initGame() {
    getDOMElements(); 

    if (!gameBoard) {
        console.error("Game board not found. Cannot initialize game.");
        return;
    }

    matchedPairs = 0;
    timeElapsed = 0;
    canFlip = true;
    flippedCards = [];
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    timeDisplay.textContent = timeElapsed;
    matchedPairsDisplay.textContent = matchedPairs;
    totalPairsDisplay.textContent = PAIRS;

    gameBoard.innerHTML = ''; 
    gameMessage.style.display = 'none';
    startGameButton.style.display = 'inline-block';
    resetButton.style.display = 'none';

    addEventListeners();
}

function createBoard() {
    gameBoard.innerHTML = ''; 
    gameBoard.style.display = 'grid'; 

    let cardData = [];
    animalData.forEach(animal => {
        cardData.push({ type: 'animal', matchId: animal.name, displayContent: `<img src="${animal.url}" alt="${animal.name}">` });
        cardData.push({ type: 'classification', matchId: animal.name, displayContent: `<span class="classification-text">${animal.classification}</span>` });
    });
    shuffleArray(cardData);

    cards = []; 
    cardData.forEach((data, index) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.index = index;
        cardElement.dataset.type = data.type;
        cardElement.dataset.matchId = data.matchId;
        
        cardElement.innerHTML = `
            <div class="card-inner">
                <div class="card-back"></div>
                <div class="card-face"></div>
            </div>
        `;

        const cardFace = cardElement.querySelector('.card-face');
        cardElement.addEventListener('click', () => flipCard(cardElement, data.displayContent, cardFace));
        gameBoard.appendChild(cardElement);
        cards.push({ element: cardElement, ...data, isFlipped: false, isMatched: false, cardFace: cardFace });
    });
}

function flipCard(cardElement, displayContent, cardFace) {
    const card = cards[cardElement.dataset.index];

    if (!canFlip || card.isFlipped || card.isMatched || flippedCards.length === 2) {
        return;
    }

    card.isFlipped = true;
    cardElement.classList.add('flipped');
    cardFace.innerHTML = displayContent; 

    flippedCards.push(card);

    if (flippedCards.length === 2) {
        canFlip = false;
        setTimeout(checkForMatch, 1000);
    }
}

function checkForMatch() {
    const [card1, card2] = flippedCards;

    const isMatch = (card1.matchId === card2.matchId) && (card1.type !== card2.type);

    if (isMatch) {
        card1.isMatched = true;
        card2.isMatched = true;
        card1.element.classList.add('matched');
        card2.element.classList.add('matched');
        matchedPairs++;
        matchedPairsDisplay.textContent = matchedPairs;

        if (matchedPairs === PAIRS) {
            endGame();
        }
    } else {
        card1.isFlipped = false;
        card2.isFlipped = false;
        card1.element.classList.remove('flipped');
        card2.element.classList.remove('flipped');
        card1.cardFace.innerHTML = ''; 
        card2.cardFace.innerHTML = ''; 
    }

    flippedCards = [];
    canFlip = true;
}

function startGame() {
    startGameButton.style.display = 'none';
    resetButton.style.display = 'inline-block';
    
    createBoard(); 

    cards.forEach(card => {
        card.element.classList.remove('flipped', 'matched');
        card.cardFace.innerHTML = ''; 
        card.isFlipped = false;
        card.isMatched = false;
    });

    if (timerInterval) {
        clearInterval(timerInterval);
    }
    timeElapsed = 0;
    timeDisplay.textContent = timeElapsed;
    timerInterval = setInterval(() => {
        timeElapsed++;
        timeDisplay.textContent = timeElapsed;
    }, 1000);

    matchedPairs = 0;
    matchedPairsDisplay.textContent = matchedPairs;
    gameMessage.style.display = 'none';
}

function endGame() {
    clearInterval(timerInterval);
    gameMessage.textContent = `ゲームクリア！ ${timeElapsed}秒で${PAIRS}ペアをマッチさせました！`;
    gameMessage.style.display = 'block';
    resetButton.style.display = 'inline-block';
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function addEventListeners() {
    if (startGameButton) {
        startGameButton.removeEventListener('click', startGame); 
        startGameButton.addEventListener('click', startGame);
    }
    if (resetButton) {
        resetButton.removeEventListener('click', initGame); 
        resetButton.addEventListener('click', initGame);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initGame();
});