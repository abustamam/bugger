// Grid system follows the same coordinate system computers use-- up-left is (0,0)
// Sample map:

//   0 1 2 3 4
// 0 x x x x x
// 1 x x x x x
// 2 x x x x x
// 3 x x x x x
// 4 x x x x x
// 5 x x x x x

// Game class

var Game = function() {
    // The Game class contains vital information about the game, such as
    // level number, number of lives, etc...

    // It is also the way by which everything is initialized upon start, and upon
    // reset (game over).

    this.lives = 3;


}

// Level class

var Level = function(num) {
    // The Level class will contain information about the level, namely the 
    // tiles used, number of enemies, size, items, etc...

    // The num argument is how many enemies will be present, they will be 
    // randomly generated on the screen

    // map is an array containing the short-hand code for tiles
    this.map = ["wwwwww",
                "ssssss",
                "ssssss",
                "ssssss",
                "ssssss",
                "gggggg"];

    this.enemies = []

    var i = 0;

    // en is temp variable for storing enemies in the while loop

    // locy is the random number generator, it will generate a number between
    // the second-to-most top and second-to-most bottom tiles (to allow for
    // the player to generate and the goal)

    var en, locy;

    while (i < num) {
        locy = Math.floor(Math.random()*(this.map.length-2)+1);
        en = new Enemy(0,locy);
        this.enemies.push(en);
        i++;
    }
}

Level.prototype.render = function(map) {
    
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
    this.x = x * 101;
    this.y = y * 83 - 20;
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    if (this.x > 505){
        this.x = -101
    } else {
       this.x += dt * this.speed;
    }

    if (!(this.x >= player.x + 101 ||
          this.x + 101 < player.x  ||
          this.y >= player.y + 83 ||
          this.y + 83 < player.y)) {
        // Collision detection
    }

}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function(x,y) {
    this.sprite = 'images/char-horn-girl.png';
    this.x = x * 101;
    this.y = y * 83 - 20;
}

Player.prototype.update = function(dt) {

}

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Player.prototype.handleInput = function(key){
    switch(key) {
    case 'up':
    case 'w':
        if (this.y > 0){
            this.y -= 83;
        }
        break;
    case 'down':
    case 's':
        if (this.y < 394) {
            this.y += 83;
        }
        break;
    case 'left':
    case 'a':
        if (this.x > 0) {
            this.x -= 101;
        }
        break;
    case 'right':
    case 'd':
        if (this.x < 404){
            this.x += 101;
        }
        break;
    }
}

var Selector = function() {
    this.sprite = 'images/Selector.png';
    this.position = 0;

}

Selector.prototype.handleInput = function(key) {
    switch(key) {
    case 'left':
    case 'a':
        if (this.x > 0) {
            this.x -= 101;
        }
        break;
    case 'right':
    case 'd':
        if (this.x < 404){
            this.x += 101;
        }
        break;
    }
};

// Now instantiate your objects.

var player = new Player(2,5);

var level1 = new Level(1);
var level2 = new Level(2);
var level3 = new Level(3);

var levels = [level1,level2,level3];

var selector = new Selector();

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

    player.handleInput(allowedKeys[e.keyCode]);

});
