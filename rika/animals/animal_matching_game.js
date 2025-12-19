const CARD_WIDTH = 100;
const CARD_HEIGHT = 100;
const CARD_SPACING = 10;
const BOARD_COLS = 4;
const BOARD_ROWS = 4;
const PAIRS = 8; // Total pairs of cards

const animals = [
    'cat', 'dog', 'elephant', 'lion', 'monkey', 'panda', 'tiger', 'zebra'
];

class AnimalMatchingGame extends Phaser.Scene {
    constructor() {
        super('AnimalMatchingGame');
    }

    preload() {
        // Dynamically generate graphics for cards instead of loading images
        for (let i = 0; i < PAIRS; i++) {
            this.load.image(`card_back_${i}`, this.createCardTexture('back', i));
            this.load.image(`card_front_${i}`, this.createCardTexture('front', i, animals[i]));
        }
    }

    createCardTexture(type, index, text = '') {
        const graphics = this.make.graphics({ add: false });
        graphics.fillStyle(type === 'back' ? 0x666666 : 0xffffff, 1);
        graphics.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);
        graphics.lineStyle(2, 0x333333, 1);
        graphics.strokeRect(0, 0, CARD_WIDTH, CARD_HEIGHT);

        if (type === 'front' && text) {
            graphics.fillStyle(0x000000, 1);
            graphics.setFont('20px Arial');
            graphics.fillText(text, (CARD_WIDTH - graphics.getTextMetrics().width) / 2, (CARD_HEIGHT - graphics.getTextMetrics().height) / 2);
        }

        graphics.generateTexture(`card_${type}_${index}`, CARD_WIDTH, CARD_HEIGHT);
        return `card_${type}_${index}`;
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

        // Add start button functionality (assuming it's outside the canvas for now)
        const startGameButton = document.getElementById('start-game');
        if (startGameButton) {
            startGameButton.addEventListener('click', () => this.startGame());
        }
    }

    setupBoard() {
        // Create an array for card data (animal index and its pair)
        let cardData = [];
        for (let i = 0; i < PAIRS; i++) {
            cardData.push({ id: i, animal: animals[i] });
            cardData.push({ id: i, animal: animals[i] }); // Each animal has a pair
        }
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
                    `card_back_${cardData[i * BOARD_COLS + j].id}`
                );
                card.setScale(1); // Ensure correct scaling

                card.cardId = cardData[i * BOARD_COLS + j].id;
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
        // Hide start button, show reset button
        document.getElementById('start-game').style.display = 'none';
        const resetButton = document.getElementById('reset-game');
        if (resetButton) resetButton.style.display = 'inline-block';
        
        // Reset game state
        this.timeElapsed = 0;
        this.matchedPairs = 0;
        this.canFlip = true;
        this.flippedCards = [];
        if (this.timer) this.timer.destroy();
        if (this.timerText) this.timerText.textContent = this.timeElapsed;
        if (this.matchedPairsText) this.matchedPairsText.textContent = this.matchedPairs;

        // Reset and reshuffle cards
        Phaser.Utils.Array.Shuffle(this.cards); // Shuffle the existing card objects

        this.cards.forEach(card => {
            card.isFlipped = false;
            card.isMatched = false;
            card.setTexture(`card_back_${card.cardId}`);
            card.setInteractive();
            card.alpha = 1; // Ensure visibility
        });
        this.setupBoard(); // Re-setup board with new shuffled cards

        this.timer = this.time.addEvent({
            delay: 1000,
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        });
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
        card.setTexture(`card_front_${card.cardId}`);
    }

    checkForMatch() {
        const [card1, card2] = this.flippedCards;

        if (card1.cardId === card2.cardId) {
            // Match found
            card1.isMatched = true;
            card2.isMatched = true;
            card1.disableInteractive();
            card2.disableInteractive();

            // Optional: Fade out matched cards
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
                card1.setTexture(`card_back_${card1.cardId}`);
                card2.setTexture(`card_back_${card2.cardId}`);
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
        const resetButton = document.getElementById('reset-game');
        if (resetButton) resetButton.style.display = 'inline-block';
    }
}

const config = {
    type: Phaser.AUTO,
    width: BOARD_COLS * (CARD_WIDTH + CARD_SPACING) - CARD_SPACING,
    height: BOARD_ROWS * (CARD_HEIGHT + CARD_SPACING) - CARD_SPACING,
    parent: 'phaser-game', // ID of the div where the game canvas will be
    scene: AnimalMatchingGame
};

let game;

document.addEventListener('DOMContentLoaded', () => {
    // Ensure layout.js has run and header/footer are in place
    // The game should only start after the DOM is fully loaded and elements are available
    // For now, attach directly to the DOMContentLoaded
    game = new Phaser.Game(config);

    // Initial setup for the reset button outside of Phaser
    const resetButton = document.getElementById('reset-game');
    if (resetButton) {
        resetButton.addEventListener('click', () => {
            // Restart the game scene
            game.scene.stop('AnimalMatchingGame');
            game.scene.start('AnimalMatchingGame');
            document.getElementById('game-message').style.display = 'none'; // Hide message on reset
            document.getElementById('start-game').style.display = 'inline-block'; // Show start button again
            resetButton.style.display = 'none'; // Hide reset button
        });
    }
});
