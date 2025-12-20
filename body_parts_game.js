// Japanese body parts with English equivalents
const bodyParts = [
    { name: "頭", english: "head", position: { x: 400, y: 150 }, radius: 50 },
    { name: "目", english: "eye", position: { x: 380, y: 130 }, radius: 15 },
    { name: "目", english: "eye", position: { x: 420, y: 130 }, radius: 15 },
    { name: "鼻", english: "nose", position: { x: 400, y: 150 }, radius: 10 },
    { name: "口", english: "mouth", position: { x: 400, y: 170 }, radius: 15 },
    { name: "耳", english: "ear", position: { x: 350, y: 140 }, radius: 20 },
    { name: "耳", english: "ear", position: { x: 450, y: 140 }, radius: 20 },
    { name: "首", english: "neck", position: { x: 400, y: 200 }, radius: 25 },
    { name: "肩", english: "shoulder", position: { x: 350, y: 230 }, radius: 25 },
    { name: "肩", english: "shoulder", position: { x: 450, y: 230 }, radius: 25 },
    { name: "腕", english: "arm", position: { x: 300, y: 300 }, radius: 30 },
    { name: "腕", english: "arm", position: { x: 500, y: 300 }, radius: 30 },
    { name: "肘", english: "elbow", position: { x: 280, y: 350 }, radius: 20 },
    { name: "肘", english: "elbow", position: { x: 520, y: 350 }, radius: 20 },
    { name: "手", english: "hand", position: { x: 250, y: 400 }, radius: 25 },
    { name: "手", english: "hand", position: { x: 550, y: 400 }, radius: 25 },
    { name: "胸", english: "chest", position: { x: 400, y: 280 }, radius: 50 },
    { name: "背中", english: "back", position: { x: 400, y: 300 }, radius: 50 },
    { name: "お腹", english: "stomach", position: { x: 400, y: 350 }, radius: 45 },
    { name: "腰", english: "waist", position: { x: 400, y: 400 }, radius: 30 },
    { name: "足", english: "leg", position: { x: 370, y: 500 }, radius: 35 },
    { name: "足", english: "leg", position: { x: 430, y: 500 }, radius: 35 },
    { name: "膝", english: "knee", position: { x: 370, y: 470 }, radius: 20 },
    { name: "膝", english: "knee", position: { x: 430, y: 470 }, radius: 20 },
    { name: "足首", english: "ankle", position: { x: 370, y: 570 }, radius: 15 },
    { name: "足首", english: "ankle", position: { x: 430, y: 570 }, radius: 15 },
    { name: "足の指", english: "toe", position: { x: 360, y: 600 }, radius: 12 },
    { name: "足の指", english: "toe", position: { x: 440, y: 600 }, radius: 12 }
];

// Game configuration
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 700,
    backgroundColor: "#a0c0e0",
    parent: "game-container",
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 0 }
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let game;
let score = 0;
let questionCount = 0;
let maxQuestions = 10;
let currentQuestion = null;
let bodyPartGraphics = [];
let clickableAreas = [];
let questionText = null;
let scoreText = null;
let questionCounterText = null;
let feedbackText = null;

function preload() {
    // We'll draw everything using graphics, so no external assets needed
}

function create() {
    // Draw human body silhouette
    drawBodySilhouette();
    
    // Create body part circles that will be clickable
    createBodyParts();
    
    // Create UI elements
    questionText = this.add.text(50, 20, "", { 
        fontSize: "24px", 
        fill: "#ffffff",
        backgroundColor: "#000000",
        padding: 10
    }).setScrollFactor(0);
    
    scoreText = this.add.text(650, 20, "スコア: 0", { 
        fontSize: "20px", 
        fill: "#ffffff",
        backgroundColor: "#000000",
        padding: 8
    }).setScrollFactor(0);
    
    questionCounterText = this.add.text(650, 50, "問題: " + questionCount + "/" + maxQuestions, { 
        fontSize: "16px", 
        fill: "#ffffff",
        backgroundColor: "#000000",
        padding: 6
    }).setScrollFactor(0);
    
    feedbackText = this.add.text(400, 350, "", { 
        fontSize: "32px", 
        fill: "#ffff00",
        backgroundColor: "#000000aa",
        padding: 10
    })
    .setOrigin(0.5)
    .setVisible(false);
    
    // Start the first question
    nextQuestion();
}

function drawBodySilhouette() {
    const graphics = this.add.graphics();
    graphics.fillStyle(0x88aacc, 1);
    
    // Head
    graphics.fillCircle(400, 150, 50);
    
    // Body (torso)
    graphics.fillRect(350, 200, 100, 150);  // Chest
    
    // Arms
    graphics.fillRect(280, 220, 70, 30);   // Left arm
    graphics.fillRect(450, 220, 70, 30);   // Right arm
    
    // Legs
    graphics.fillRect(360, 350, 30, 150);  // Left leg
    graphics.fillRect(410, 350, 30, 150);  // Right leg
    
    graphics.fillStyle(0xffffff, 1);
    
    // Eyes
    graphics.fillCircle(380, 140, 8);
    graphics.fillCircle(420, 140, 8);
    
    // Nose
    graphics.fillCircle(400, 160, 5);
    
    // Mouth
    graphics.lineStyle(2, 0x000000, 1);
    graphics.beginPath();
    graphics.moveTo(385, 180);
    graphics.lineTo(415, 180);
    graphics.strokePath();
}

function createBodyParts() {
    // Create invisible circles for each body part that will detect clicks
    bodyParts.forEach((part, index) => {
        const circle = this.add.circle(
            part.position.x, 
            part.position.y, 
            part.radius, 
            0x00ff00, 
            0  // alpha = 0, invisible
        ).setInteractive();
        
        circle.setData("bodyPart", part);
        circle.on("pointerdown", () => handleBodyPartClick(part));
        clickableAreas.push(circle);
    });
}

function handleBodyPartClick(part) {
    if (!currentQuestion) return;
    
    questionCount++;
    questionCounterText.setText("問題: " + questionCount + "/" + maxQuestions);
    
    if (part.name === currentQuestion.bodyPart.name) {
        // Correct answer
        score += 10;
        scoreText.setText("スコア: " + score);
        feedbackText.setText("正解！");
        feedbackText.setFill("#00ff00");
        feedbackText.setVisible(true);
        
        // Visual feedback for correct part
        const highlight = this.add.circle(
            part.position.x, 
            part.position.y, 
            part.radius + 5, 
            0x00ff00, 
            0.5
        );
        
        this.tweens.add({
            targets: highlight,
            scaleX: 1.5,
            scaleY: 1.5,
            alpha: 0,
            duration: 1000,
            onComplete: () => {
                highlight.destroy();
            }
        });
    } else {
        // Incorrect answer
        feedbackText.setText("不正解！答えは「" + currentQuestion.bodyPart.name + "」");
        feedbackText.setFill("#ff0000");
        feedbackText.setVisible(true);
    }
    
    // Move to next question after delay
    this.time.delayedCall(1500, () => {
        feedbackText.setVisible(false);
        if (questionCount < maxQuestions) {
            nextQuestion();
        } else {
            endGame();
        }
    });
}

function nextQuestion() {
    if (questionCount >= maxQuestions) {
        endGame();
        return;
    }
    
    // Select a random body part for the question
    const randomIndex = Math.floor(Math.random() * bodyParts.length);
    const selectedPart = bodyParts[randomIndex];
    
    currentQuestion = {
        bodyPart: selectedPart,
        asked: false
    };
    
    questionText.setText("「" + selectedPart.name + "」をクリックしてください！");
}

function endGame() {
    questionText.setText("ゲーム終了！最終スコア: " + score);
    
    // Show restart button
    const restartButton = this.add.text(350, 400, "もう一度プレイする", {
        fontSize: "24px",
        fill: "#ffffff",
        backgroundColor: "#0077cc",
        padding: 15
    })
    .setOrigin(0.5)
    .setInteractive()
    .on("pointerdown", () => {
        // Reset game
        score = 0;
        questionCount = 0;
        scoreText.setText("スコア: " + score);
        questionCounterText.setText("問題: " + questionCount + "/" + maxQuestions);
        restartButton.destroy();
        nextQuestion();
    })
    .on("pointerover", function() {
        this.setFill("#ffff00");
    })
    .on("pointerout", function() {
        this.setFill("#ffffff");
    });
}

function update() {
    // Update UI overlay
    document.getElementById("score").textContent = score;
    document.getElementById("question-count").textContent = questionCount;
}

// Start the game
window.onload = function() {
    game = new Phaser.Game(config);
};