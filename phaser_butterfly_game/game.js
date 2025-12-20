const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }
        }
    }
};

const game = new Phaser.Game(config);

let butterfly;

function preload ()
{
    // Placeholder image for the butterfly.
    // In a real application, you would replace this with your actual butterfly sprite.
    this.load.image('butterfly', 'https://labs.phaser.io/assets/sprites/butterfly.png');
}

function create ()
{
    butterfly = this.physics.add.image(100, 300, 'butterfly');
    butterfly.setScale(0.5); // Adjust scale as needed
    butterfly.setCollideWorldBounds(false); // Allow movement outside world bounds
    butterfly.setVelocityX(100); // Start moving right
}

function update ()
{
    // Wrap the butterfly around the screen horizontally
    if (butterfly.x > config.width + butterfly.width / 2)
    {
        butterfly.x = -butterfly.width / 2;
    }
}
