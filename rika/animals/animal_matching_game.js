const CARD_WIDTH = 100;
const CARD_HEIGHT = 100;
const CARD_SPACING = 10;
const BOARD_COLS = 4;
const BOARD_ROWS = 4;
const PAIRS = 8; // Total pairs of cards

// Define animal images (name and URL) relevant to 中学受験 理科
// Using Twemoji SVG URLs for clarity.
const animalImages = [
    { name: 'コウモリ', url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@13.1.0/assets/svg/1f987.svg' }, // Bat emoji
    { name: 'ペンギン', url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@13.1.0/assets/svg/1f427.svg' }, // Penguin emoji
    { name: 'イモリ', url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@13.1.0/assets/svg/1f98e.svg' }, // Lizard/Newt emoji (best available)
    { name: 'ヤモリ', url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@13.1.0/assets/svg/1f98e.svg' }, // Lizard/Gecko emoji (same as newt, might need clarification if confusing)
    { name: 'クジラ', url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@13.1.0/assets/svg/1f40b.svg' }, // Whale emoji
    { name: 'イルカ', url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@13.1.0/assets/svg/1f42c.svg' }, // Dolphin emoji
    { name: 'メダカ', url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@13.1.0/assets/svg/1f420.svg' }, // Fish emoji (representing Killifish)
    { name: 'カエル', url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@13.1.0/assets/svg/1f438.svg' }  // Frog emoji
];

class AnimalMatchingGame extends Phaser.Scene {
    constructor() {
        super('AnimalMatchingGame');
    }

const CARD_WIDTH = 100;
const CARD_HEIGHT = 100;
const CARD_SPACING = 10;
const BOARD_COLS = 4;
const BOARD_ROWS = 4;
const PAIRS = 8; // Total pairs of cards

// Define animal data with their classifications
const animalData = [
    { name: 'コウモリ', url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@13.1.0/assets/svg/1f987.svg', classification: '哺乳類' }, // Bat emoji
    { name: 'ペンギン', url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@13.1.0/assets/svg/1f427.svg', classification: '鳥類' }, // Penguin emoji
    { name: 'イモリ', url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@13.1.0/assets/svg/1f98e.svg', classification: '両生類' }, // Newt/Salamander emoji
    { name: 'ヤモリ', url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@13.1.0/assets/svg/1f98e.svg', classification: '爬虫類' }, // Gecko/Lizard emoji
    { name: 'クジラ', url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@13.1.0/assets/svg/1f40b.svg', classification: '哺乳類' }, // Whale emoji
    { name: 'イルカ', url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@13.1.0/assets/svg/1f42c.svg', classification: '哺乳類' }, // Dolphin emoji
    { name: 'メダカ', url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@13.1.0/assets/svg/1f420.svg', classification: '魚類' }, // Fish emoji (representing Killifish)
    { name: 'カエル', url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@13.1.0/assets/svg/1f438.svg', classification: '両生類' }  // Frog emoji
];

class AnimalMatchingGame extends Phaser.Scene {
    constructor() {
        super('AnimalMatchingGame');
    }

    preload() {
        this.load.image('card_back', this.createSolidColorTexture('card_back', 0x666666));

        animalData.forEach((animal) => {
            this.load.image(animal.name, animal.url);
            // Generate texture for classification text
            this.createClassificationTexture(animal.classification);
        });
    }

    // Helper to create a solid color texture for card back
    createSolidColorTexture(key, color) {
        const graphics = this.make.graphics({ add: false });
        graphics.fillStyle(color, 1);
        graphics.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);
        graphics.lineStyle(2, 0x333333, 1);
        graphics.strokeRect(0, 0, CARD_WIDTH, CARD_HEIGHT);
        graphics.generateTexture(key, CARD_WIDTH, CARD_HEIGHT);
        return key;
    }

    createClassificationTexture(classificationText) {
        // Create a unique key for this classification text
        const key = `classification_text_${classificationText}`;
        if (this.textures.exists(key)) {
            return key;
        }

        // Create a render texture to draw the text onto
        const renderTexture = this.add.renderTexture(0, 0, CARD_WIDTH, CARD_HEIGHT);
        renderTexture.fill(0xffffff); // White background for the card
        renderTexture.setTint(0xffffff); // Ensure it's not tinted

        const textStyle = {
            fontFamily: 'Arial',
            fontSize: '20px',
            color: '#000000',
            align: 'center',
            wordWrap: { width: CARD_WIDTH - 10, useAdvancedWrap: true } // Ensure word wrap
        };
        const textObject = this.add.text(CARD_WIDTH / 2, CARD_HEIGHT / 2, classificationText, textStyle)
            .setOrigin(0.5, 0.5);

        renderTexture.draw(textObject);
        renderTexture.saveTexture(key); // Save the render texture as a new texture

        textObject.destroy(); // Destroy the text object as it's no longer needed
        renderTexture.destroy(); // Destroy the render texture

        return key;
    }

    create() {
        this.cameras.main.setBackgroundColor('#f5f5f5');

        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.canFlip = true;
        this.timeElapsed = 0;
        this.timer = null;

        this.setupBoard();
        this.setupTimer();
        this.hideGameElements();

        const startGameButton = document.getElementById('start-game');
        if (startGameButton) {
            startGameButton.addEventListener('click', () => this.startGame());
        }

        const resetButton = document.getElementById('reset-game');
        if (resetButton) {
            resetButton.addEventListener('click', () => this.resetGame());
        }
    }

    hideGameElements() {
        this.cards.forEach(card => card.setVisible(false));
    }

    showGameElements() {
        this.cards.forEach(card => card.setVisible(true));
    }

    setupBoard() {
        this.cards.forEach(card => card.destroy());
        this.cards = [];

        let cardData = [];
        animalData.forEach((animal) => {
            // Animal card
            cardData.push({ type: 'animal', matchId: animal.name, displayKey: animal.name });
            // Classification card
            cardData.push({ type: 'classification', matchId: animal.name, displayKey: this.createClassificationTexture(animal.classification) });
        });
        Phaser.Utils.Array.Shuffle(cardData);

        const boardWidth = BOARD_COLS * (CARD_WIDTH + CARD_SPACING) - CARD_SPACING;
        const boardHeight = BOARD_ROWS * (CARD_HEIGHT + CARD_SPACING) - CARD_SPACING;
        const offsetX = (this.sys.game.config.width - boardWidth) / 2;
        const offsetY = (this.sys.game.config.height - boardHeight) / 2;

        for (let i = 0; i < BOARD_ROWS; i++) {
            for (let j = 0; j < BOARD_COLS; j++) {
                const card = this.add.sprite(
                    offsetX + j * (CARD_WIDTH + CARD_SPACING) + CARD_WIDTH / 2,
                    offsetY + i * (CARD_HEIGHT + CARD_SPACING) + CARD_HEIGHT / 2,
                    'card_back'
                );
                card.setScale(1);

                card.type = cardData[i * BOARD_COLS + j].type;
                card.matchId = cardData[i * BOARD_COLS + j].matchId;
                card.displayKey = cardData[i * BOARD_COLS + j].displayKey;
                card.isFlipped = false;
                card.isMatched = false;

                card.setInteractive();
                card.on('pointerdown', () => this.onCardClicked(card));
                this.cards.push(card);
            }
        }
    }

    setupTimer() {
        this.timerText = document.getElementById('time');
        this.matchedPairsText = document.getElementById('matched-pairs');
        this.totalPairsText = document.getElementById('total-pairs');
        if (this.totalPairsText) this.totalPairsText.textContent = PAIRS;
    }

    startGame() {
        document.getElementById('start-game').style.display = 'none';
        document.getElementById('reset-game').style.display = 'inline-block';
        document.getElementById('game-message').style.display = 'none';

        this.timeElapsed = 0;
        this.matchedPairs = 0;
        this.canFlip = true;
        this.flippedCards = [];
        if (this.timer) this.timer.destroy();
        if (this.timerText) this.timerText.textContent = this.timeElapsed;
        if (this.matchedPairsText) this.matchedPairsText.textContent = this.matchedPairs;

        this.setupBoard();
        this.showGameElements();

        this.timer = this.time.addEvent({
            delay: 1000,
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        });
    }

    resetGame() {
        this.startGame();
    }

    updateTimer() {
        this.timeElapsed++;
        if (this.timerText) {
            this.timerText.textContent = this.timeElapsed;
        }
    }

    onCardClicked(card) {
        if (!this.canFlip || card.isFlipped || card.isMatched || this.flippedCards.length === 2) {
            return;
        }

        this.flipCard(card);
        this.flippedCards.push(card);

        if (this.flippedCards.length === 2) {
            this.canFlip = false;
            this.time.delayedCall(1000, this.checkForMatch, [], this);
        }
    }

    flipCard(card) {
        card.isFlipped = true;
        card.setTexture(card.displayKey);
    }

    checkForMatch() {
        const [card1, card2] = this.flippedCards;

        // A match occurs if:
        // 1. Their matchId is the same (i.e., same animal)
        // 2. One is an 'animal' type and the other is a 'classification' type
        const isMatch = (card1.matchId === card2.matchId) &&
                        (card1.type !== card2.type);

        if (isMatch) {
            card1.isMatched = true;
            card2.isMatched = true;
            card1.disableInteractive();
            card2.disableInteractive();

            this.tweens.add({
                targets: [card1, card2],
                alpha: { from: 1, to: 0.5 },
                duration: 500,
                onComplete: () => {
                    this.matchedPairs++;
                    if (this.matchedPairsText) {
                        this.matchedPairsText.textContent = this.matchedPairs;
                    }
                    if (this.matchedPairs === PAIRS) {
                        this.endGame();
                    }
                }
            });
        } else {
            this.time.delayedCall(500, () => {
                card1.isFlipped = false;
                card2.isFlipped = false;
                card1.setTexture('card_back');
                card2.setTexture('card_back');
            }, [], this);
        }

        this.flippedCards = [];
        this.canFlip = true;
    }

    endGame() {
        this.timer.destroy();
        const gameMessage = document.getElementById('game-message');
        if (gameMessage) {
            gameMessage.textContent = `ゲームクリア！ ${this.timeElapsed}秒で${PAIRS}ペアをマッチさせました！`;
            gameMessage.style.display = 'block';
        }
        document.getElementById('reset-game').style.display = 'inline-block';
    }
}

const config = {
    type: Phaser.AUTO,
    width: BOARD_COLS * (CARD_WIDTH + CARD_SPACING) - CARD_SPACING,
    height: BOARD_ROWS * (CARD_HEIGHT + CARD_SPACING) - CARD_SPACING,
    parent: 'phaser-game',
    scene: AnimalMatchingGame
};

let game;

document.addEventListener('DOMContentLoaded', () => {
    game = new Phaser.Game(config);
});

    // Helper to create a solid color texture for card back
    createSolidColorTexture(key, color) {
        const graphics = this.make.graphics({ add: false });
        graphics.fillStyle(color, 1);
        graphics.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);
        graphics.lineStyle(2, 0x333333, 1);
        graphics.strokeRect(0, 0, CARD_WIDTH, CARD_HEIGHT);
        graphics.generateTexture(key, CARD_WIDTH, CARD_HEIGHT);
        return key;
    }

    create() {
        this.cameras.main.setBackgroundColor('#f5f5f5'); // Match body background

        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.canFlip = true;
        this.timeElapsed = 0;
        this.timer = null;

        this.setupBoard();
        this.setupTimer();
        this.hideGameElements(); // Hide cards initially

        const startGameButton = document.getElementById('start-game');
        if (startGameButton) {
            startGameButton.addEventListener('click', () => this.startGame());
        }

        const resetButton = document.getElementById('reset-game');
        if (resetButton) {
            resetButton.addEventListener('click', () => this.resetGame());
        }
    }

    hideGameElements() {
        this.cards.forEach(card => card.setVisible(false));
    }

    showGameElements() {
        this.cards.forEach(card => card.setVisible(true));
    }

    setupBoard() {
        // Clear existing cards
        this.cards.forEach(card => card.destroy());
        this.cards = [];

        let cardData = [];
        animalImages.forEach((animal) => {
            cardData.push({ name: animal.name, key: animal.name });
            cardData.push({ name: animal.name, key: animal.name });
        });
        Phaser.Utils.Array.Shuffle(cardData);

        const boardWidth = BOARD_COLS * (CARD_WIDTH + CARD_SPACING) - CARD_SPACING;
        const boardHeight = BOARD_ROWS * (CARD_HEIGHT + CARD_SPACING) - CARD_SPACING;
        const offsetX = (this.sys.game.config.width - boardWidth) / 2;
        const offsetY = (this.sys.game.config.height - boardHeight) / 2;

        for (let i = 0; i < BOARD_ROWS; i++) {
            for (let j = 0; j < BOARD_COLS; j++) {
                const card = this.add.sprite(
                    offsetX + j * (CARD_WIDTH + CARD_SPACING) + CARD_WIDTH / 2,
                    offsetY + i * (CARD_HEIGHT + CARD_SPACING) + CARD_HEIGHT / 2,
                    'card_back' // All cards start as card_back
                );
                card.setScale(1);

                card.cardKey = cardData[i * BOARD_COLS + j].key; // Store the animal image key
                card.isFlipped = false;
                card.isMatched = false;

                card.setInteractive();
                card.on('pointerdown', () => this.onCardClicked(card));
                this.cards.push(card);
            }
        }
    }

    setupTimer() {
        this.timerText = document.getElementById('time');
        this.matchedPairsText = document.getElementById('matched-pairs');
        this.totalPairsText = document.getElementById('total-pairs');
        if (this.totalPairsText) this.totalPairsText.textContent = PAIRS;
    }

    startGame() {
        document.getElementById('start-game').style.display = 'none';
        document.getElementById('reset-game').style.display = 'none'; // Ensure reset button is hidden at start
        document.getElementById('game-message').style.display = 'none';

        this.timeElapsed = 0;
        this.matchedPairs = 0;
        this.canFlip = true;
        this.flippedCards = [];
        if (this.timer) this.timer.destroy();
        if (this.timerText) this.timerText.textContent = this.timeElapsed;
        if (this.matchedPairsText) this.matchedPairsText.textContent = this.matchedPairs;

        this.setupBoard(); // Re-setup board with new shuffled cards
        this.showGameElements(); // Make cards visible

        this.timer = this.time.addEvent({
            delay: 1000,
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        });
    }

    resetGame() {
        this.startGame(); // Simply restart the game
    }

    updateTimer() {
        this.timeElapsed++;
        if (this.timerText) {
            this.timerText.textContent = this.timeElapsed;
        }
    }

    onCardClicked(card) {
        if (!this.canFlip || card.isFlipped || card.isMatched || this.flippedCards.length === 2) {
            return;
        }

        this.flipCard(card);
        this.flippedCards.push(card);

        if (this.flippedCards.length === 2) {
            this.canFlip = false;
            this.time.delayedCall(1000, this.checkForMatch, [], this);
        }
    }

    flipCard(card) {
        card.isFlipped = true;
        card.setTexture(card.cardKey); // Use the animal image key
    }

    checkForMatch() {
        const [card1, card2] = this.flippedCards;

        if (card1.cardKey === card2.cardKey) {
            // Match found
            card1.isMatched = true;
            card2.isMatched = true;
            card1.disableInteractive();
            card2.disableInteractive();

            this.tweens.add({
                targets: [card1, card2],
                alpha: { from: 1, to: 0.5 },
                duration: 500,
                onComplete: () => {
                    this.matchedPairs++;
                    if (this.matchedPairsText) {
                        this.matchedPairsText.textContent = this.matchedPairs;
                    }
                    if (this.matchedPairs === PAIRS) {
                        this.endGame();
                    }
                }
            });
        } else {
            // No match, flip back
            this.time.delayedCall(500, () => {
                card1.isFlipped = false;
                card2.isFlipped = false;
                card1.setTexture('card_back'); // Use the generic card back
                card2.setTexture('card_back');
            }, [], this);
        }

        this.flippedCards = [];
        this.canFlip = true;
    }

    endGame() {
        this.timer.destroy();
        const gameMessage = document.getElementById('game-message');
        if (gameMessage) {
            gameMessage.textContent = `ゲームクリア！ ${this.timeElapsed}秒で${PAIRS}ペアをマッチさせました！`;
            gameMessage.style.display = 'block';
        }
        document.getElementById('reset-game').style.display = 'inline-block'; // Show reset button
    }
}

const config = {
    type: Phaser.AUTO,
    width: BOARD_COLS * (CARD_WIDTH + CARD_SPACING) - CARD_SPACING,
    height: BOARD_ROWS * (CARD_HEIGHT + CARD_SPACING) - CARD_SPACING,
    parent: 'phaser-game',
    scene: AnimalMatchingGame
};

let game;

document.addEventListener('DOMContentLoaded', () => {
    game = new Phaser.Game(config);
});
