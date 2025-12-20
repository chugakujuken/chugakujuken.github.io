document.addEventListener("DOMContentLoaded", () => {
    const kanjiPairs = [
        { kanji: "日", reading: "ひ" },
        { kanji: "月", reading: "つき" },
        { kanji: "山", reading: "やま" },
        { kanji: "川", reading: "かわ" },
        { kanji: "田", reading: "た" },
        { kanji: "木", reading: "き" },
        { kanji: "本", reading: "ほん" },
        { kanji: "大", reading: "おお" },
    ];

    let cards = [];
    let flippedCards = [];
    let matchedPairs = 0;
    let lockBoard = false;

    const gameBoard = document.getElementById("game-board");
    const resetButton = document.getElementById("reset-button");
    const messageDisplay = document.getElementById("message");

    function initializeGame() {
        cards = [];
        flippedCards = [];
        matchedPairs = 0;
        lockBoard = false;
        messageDisplay.textContent = "";
        gameBoard.innerHTML = "";

        // Create cards from kanji pairs
        kanjiPairs.forEach(pair => {
            cards.push({ value: pair.kanji, type: "kanji", id: pair.kanji + "_kanji" });
            cards.push({ value: pair.reading, type: "reading", id: pair.kanji + "_reading" });
        });

        shuffleCards(cards);
        generateCards();
    }

    function shuffleCards(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; // Swap
        }
    }

    function generateCards() {
        cards.forEach(card => {
            const cardElement = document.createElement("div");
            cardElement.classList.add("card");
            cardElement.dataset.id = card.id;
            cardElement.dataset.value = card.value;
            cardElement.dataset.type = card.type;

            const cardContent = document.createElement("div");
            cardContent.classList.add("card-content");
            cardContent.textContent = card.value;
            cardElement.appendChild(cardContent);

            cardElement.addEventListener("click", () => flipCard(cardElement));
            gameBoard.appendChild(cardElement);
        });
    }

    function flipCard(cardElement) {
        if (lockBoard) return;
        if (cardElement === flippedCards[0]) return; // Prevent double clicking the same card

        cardElement.classList.add("flipped");
        flippedCards.push(cardElement);

        if (flippedCards.length === 2) {
            lockBoard = true;
            checkForMatch();
        }
    }

    function checkForMatch() {
        const [card1, card2] = flippedCards;
        const isMatch = (card1.dataset.type !== card2.dataset.type) && // Kanji matches reading, not kanji matches kanji
                        (card1.dataset.value === card2.dataset.value); // Values match

        if (isMatch) {
            disableCards();
        } else {
            unflipCards();
        }
    }

    function disableCards() {
        flippedCards[0].classList.add("matched");
        flippedCards[1].classList.add("matched");
        matchedPairs++;
        resetBoard();

        if (matchedPairs === kanjiPairs.length) {
            messageDisplay.textContent = "おめでとうございます！全てのペアを見つけました！";
        }
    }

    function unflipCards() {
        setTimeout(() => {
            flippedCards[0].classList.remove("flipped");
            flippedCards[1].classList.remove("flipped");
            resetBoard();
        }, 1000);
    }

    function resetBoard() {
        [flippedCards, lockBoard] = [[], false];
    }

    resetButton.addEventListener("click", initializeGame);

    initializeGame();
});
