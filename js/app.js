// Grid system follows the same coordinate system computers use-- up-left is (0,0)
// Sample map:

//   0 1 2 3 4
// 0 x x x x x
// 1 x x x x x
// 2 x x x x x
// 3 x x x x x
// 4 x x x x x
// 5 x x x x x

// Since tiles are 101 x 83 px, entities' coords will be multiplied as such, with an offset to account for 
// the 3d box shadow below each tile

// Game class

var Game = function() {
    // The Game class contains vital information about the game, such as
    // level number, number of lives, etc...

    // It is also the way by which everything is initialized upon start, and upon
    // reset (game over).

    this.lives = 3;


    // Initialize levels
    var level1 = new Level(1, [4],
                              ["wgggw",
                               "sssss",
                               "sssss",
                               "sssss",
                               "sssss",
                               "ggggg"]);
    var level2 = new Level(2, [3,2],
                              ["wgggw",
                               "sssss",
                               "sssss",
                               "sssss",
                               "sssss",
                               "ggggg"]);
    var level3 = new Level(3, [1,2,3],
                              ["wgggw",
                               "sssss",
                               "sssss",
                               "sssss",
                               "sssss",
                               "ggggg"]);
    this.levels = [level1,level2,level3];

    this.lvl = 0;

    this.player = new Player(2,5);
}

Game.prototype.reset = function() {
    this.player.x = 2;
    this.player.y = 5;
    this.lives--;

    if (this.lives === 0) {

    }
};

// Level class

var Level = function(num, loc, map) {
    // The Level class will contain information about the level, namely the 
    // tiles used, number of enemies, size, items, etc...

    // The num argument is how many enemies will be present

    // The loc argument is an array of y-coordinates of the enemy(ies)

    // map is an array containing the short-hand code for tiles
    this.map = map;

    this.enemies = []

    var i = 0;

    // en is temp variable for storing enemies in the while loop

    var en;

    while (i < num) {
        en = new Enemy(0,loc);
        this.enemies.push(en);
        i++;
    }
}

Level.prototype.render = function(map) {
        var rowImages = this.map,
        numRows = rowImages.length,
        numCols = rowImages[0].length,
        row, col, img;

        /* Loop through the number of rows and columns we've defined above
         * and, using the rowImages array, draw the correct image for that
         * portion of the "grid"
         */
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                /* The drawImage function of the canvas' context element
                 * requires 3 parameters: the image to draw, the x coordinate
                 * to start drawing and the y coordinate to start drawing.
                 * We're using our Resources helpers to refer to our images
                 * so that we get the benefits of caching these images, since
                 * we're using them over and over.
                 */
                if (rowImages[row][col] === "w") {
                    img = "images/water-block.png";
                } else if (rowImages[row][col] === "s") {
                    img = "images/stone-block.png";
                } else if (rowImages[row][col] === "g") {
                    img = "images/grass-block.png";
                }
                ctx.drawImage(Resources.get(img), col * 101, row * 83);
            }
        }

        // Draw the dude in distress and his attackers! 
        ctx.drawImage(Resources.get("images/enemy-bug.png"), 1 * 101, 0 * 83 - 20);
        ctx.drawImage(Resources.get("images/char-boy.png"), 2 * 101, 0 * 83 - 20);
        ctx.drawImage(Resources.get("images/enemy-bug-flipped.png"), 3 * 101, 0 * 83 - 20);
};

// Enemies our player must avoid
var Enemy = function(x,y) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';

    // generate random speed between 100 and 1000
    this.speed = Math.floor(Math.random()*(1000-100+1)+100);

    // Utilize grid coords
    this.x = x;
    this.y = y;
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    if (this.x > 5){
        this.x = -1
    } else {
       this.x += dt * this.speed / 101;
    }

    // Using box method for collision detection

    if (!(this.x >= game.player.x + 1 ||
          this.x + 1 < game.player.x  ||
          this.y >= game.player.y + 1 ||
          this.y + 1 < game.player.y)) {
        console.log(this.x + " " game.player.x);
        game.reset();
    }

}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x * 101, this.y * 83 - 20);
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function(x,y) {
    this.sprite = 'images/char-horn-girl.png';
    this.x = x;
    this.y = y;
}

Player.prototype.update = function(dt) {
    // Check if player is drowning. It's important to note that 
    // the map property of a level is row by column, not column by row,
    // so coordinates are (y, x)

    if (game.levels[game.lvl].map[this.y][this.x] === "w"){
        // Drowning 
        game.reset();
    }
}

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x * 101, this.y * 83 - 20);
}

Player.prototype.handleInput = function(key){
    switch(key) {
    case 'up':
    case 'w':
        if (this.y > 0){
            this.y -= 1;
        }
        break;
    case 'down':
    case 's':
        if (this.y < 5) {
            this.y += 1;
        }
        break;
    case 'left':
    case 'a':
        if (this.x > 0) {
            this.x -= 1;
        }
        break;
    case 'right':
    case 'd':
        if (this.x < 4){
            this.x += 1;
        }
        break;
    }
}

var Selector = function() {
    this.sprite = 'images/Selector.png';
    this.position = 0;
    this.characters = [
        {name: "cat-girl", sprite: "images/char-cat-girl.png"},
        {name: "horn-girl", sprite: "images/char-horn-girl.png"},
        {name: "pink-girl", sprite: "images/char-pink-girl.png"},
        {name: "princess-girl", sprite: "images/char-princess-girl.png"}
    ];
}

Selector.prototype.handleInput = function(key) {
    switch(key) {
    case 'left':
    case 'a':
        if (this.x > 0) {
            this.x -= 1;
        }
        break;
    case 'right':
    case 'd':
        if (this.x < 4){
            this.x += 1;
        }
        break;
    }
};

// Now instantiate your objects.

//var player = new Player(2,5);

//var levels = [level1,level2,level3];

var selector = new Selector();

var game = new Game();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        87: 'w',
        65: 'a',
        83: 's',
        68: 'd',
        32: 'space',
        13: 'enter'
    };

    game.player.handleInput(allowedKeys[e.keyCode]);

});
