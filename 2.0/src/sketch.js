/////////////////////////////
//Sketch.js: Spaceflyer 2.0//
/////////////////////////////



//Array.remove() function
Array.prototype.remove = function (index) { return this.splice(index, 1); }
//Array.contains() function
Array.prototype.contains = function (item, strict) {
    var contained = false;
    createOwnedLoop(this, function (i) {
        if ((this[i] == item && !strict) || this[i] === item) {
            contained = true;
            return "exit loop";
        }
    });
    return contained;
}
//PointToward function
function pointToward(x1, y1, x2, y2) {
    if (x2 >= x1) return atan((y2 - y1) / (x2 - x1)) + (Math.PI * 0.5);
    else return atan((y2 - y1) / (x2 - x1)) + (Math.PI * 1.5);
}
//Loop function
function createOwnedLoop(owner, count, loop) {
    var counter;
    if (typeof count == 'number') counter = count;
    else if (count.constructor === Array) counter = count.length;
    else throw new Error("Unexpected count for createOwnedLoop().");
    if (typeof loop != 'function') throw new Error("Unexpected type for loop function in createOwnedLoop().");
    while (counter > 0) {
        counter--;
        var exit;
        if (typeof owner == 'object')
            exit = loop.call(owner, counter);
        else
            exit = loop(counter);
        if (exit == "exit" || exit == "exit loop" || exit == "break" || exit == "break;")
            break;
    }
}
function createLoop(count, loop) {
    var counter;
    if (typeof count == 'number') counter = count;
    else if (count.constructor === Array) counter = count.length;
    else throw new Error("Unexpected count for createLoop().");
    if (typeof loop != 'function') throw new Error("Unexpected type for loop function in createLoop().");
    while (counter > 0) {
        counter--;
        var exit = loop(counter);
        if (exit == "exit" || exit == "exit loop" || exit == "break" || exit == "break;")
            break;
    }
}
//displayText function
function displayText(txt) {
    push();
    fill("#FFFFFF");
    textSize(48);
    textFont(font);
    textAlign(CENTER);
    text(txt, 0, 0, width, 300);
    pop();
}
//Class: Star
class Star {
    constructor(x, y) {
        this.pos = createVector(x, y);
        this.vel = createVector(0, Math.random() * 3 + 2.5);
        this.r = this.vel.y / 2;
    }
    Update() {
        push();
        this.pos.add(this.vel);
        noFill();
        for (var i = 0; i < this.r; i++) {
            stroke(255 - ((i / this.r) * 100), 255 - ((i / this.r) * 100), 255 - ((i / this.r) * 100));
            strokeWeight(4);
            ellipse(this.pos.x, this.pos.y, this.r + i);
        }
        pop();
    }
}
//Class: Ship (You)
class Ship {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.angle = Math.PI * 2;
        this.image = undefined;
        this.HP = 10;
        this.isDead = false;
        this.iFrames = 100;
    }
    SetImage(image) {
        this.image = image;
    }
    Update(x, y) {
        this.iFrames--;
        this.x += (x - this.x) / 5;
        this.y += ((y - this.y) / 5) - 50;
        this.angle = (Math.atan2(this.y - y, this.x - x) * -3) + (Math.PI / 2);
        if (keyIsDown(87)) this.angle = ((Math.PI * 2) + this.angle) / 2;
        if (keyIsDown(65)) this.angle = ((Math.PI * 1.5) + this.angle) / 2;
        if (keyIsDown(68)) this.angle = ((Math.PI * -1.5) + this.angle) / 2;
        if (this.HP <= 0 && !this.isDead) {
            this.isDead = true;
            createOwnedLoop(this, 200, function () {
                particles.push(new Particle(
                    this.x + 50, this.y + 265,
                    (Math.random() - 0.5) * 20,
                    (Math.random() - 0.5) * 20
                ));
            });
        }
        push();
        translate(x, y);
        rotate(this.angle);
        translate(-50, -50);
        if (this.iFrames > 0) {
            if (this.iFrames % 10 < 5)
                tint(256, 192);
            else
                tint(256, 64)
        }
        if (!this.isDead)
            image(this.image, 0, 0);
        pop();
    }
}
//Class: Enemy
class Enemy {
    constructor(x) {
        this.pos = createVector(x, -50);
        this.Velocity = createVector(0, 5);
        this.angle = 0;
        this.isDead = false;
    }
    Update() {
        this.pos.add(this.Velocity);
        if (dist(this.pos.x + 25, this.pos.y + 50, ship.x + 40, ship.y + 305) <= 63 && ship.iFrames <= 0) {
            ship.iFrames = 50;
            this.isDead = true;
            ship.HP--;
        }
        push();
        translate(this.pos.x, this.pos.y);
        translate(-25, -25);
        image(enemyImgs[1], 0, 0);
        if (Math.random() < 0.005 && ship.y + 255 > this.pos.y) {
            bullets.push(new Bullet(this.pos.x, this.pos.y + 10, pointToward(this.pos.x, this.pos.y + 10, ship.x, ship.y + 255), "enm"));
        }
        pop();
    }
}
//Class: Particle
class Particle {
    constructor(x, y, Xv, Yv) {
        this.pos = createVector(x, y);
        this.vel = createVector(Xv, Yv);
        this.timeAlive = Math.random();
        this.isDead = false;
    }
    Update() {
        this.timeAlive -= 0.01;
        if (this.timeAlive <= 0)
            this.isDead = true;
        else {
            this.pos.add(this.vel);
            this.vel.mult(0.95);
            push();
            stroke('#CCCCCC');
            strokeWeight(3);
            point(this.pos.x, this.pos.y);
            pop();
        }
    }
}
//Class: Bullet
class Bullet {
    constructor(x, y, angle, owner) {
        this.pos = createVector(x, y);
        this.angle = angle;
        this.vel = createVector(Math.sin(this.angle), -Math.cos(this.angle));
        if (this.owner == "enm") { this.vel.y = -this.vel.y; this.vel.x = -this.vel.x; }
        this.vel.mult(5);
        this.owner = owner;
        this.isDead = false;
    }
    Update(index) {
        if (this.pos.y < 0 || this.pos.y > height || this.pos.x < 0 || this.pos.x > width) this.isDead = true;
        this.pos.add(this.vel);
        if (this.owner == "enm") {
            this.pos.add(1 * this.vel.x, 1 * this.vel.y);
            if (dist(this.pos.x, this.pos.y, ship.x, ship.y + 255) <= 50 && ship.iFrames <= 0) {
                ship.iFrames = 50;
                ship.HP--;
                this.isDead = true;
            }
        } else {
            createOwnedLoop(this, enemies, function (i) {
                if (dist(this.pos.x, this.pos.y, enemies[i].pos.x, enemies[i].pos.y) <= 35) {
                    enemies[i].isDead = true;
                    this.isDead = true;
                }
            });
        }
        createOwnedLoop(this, bullets, function (i) {
            if (i != index) {
                if (dist(this.pos.x, this.pos.y, bullets[i].pos.x, bullets[i].pos.y) <= 6 &&
                    this.owner == "ship" && bullets[i].owner == "enm") {
                    this.isDead = true;
                    bullets[i].isDead = true;
                    particles.push(new Particle(this.x, this.y, (Math.random() * 5) - 3, (Math.random() * 5) - 3));
                    particles.push(new Particle(this.x, this.y, (Math.random() * 5) - 3, (Math.random() * 5) - 3));
                }
            }
        });
        push();
        strokeWeight(6);
        if (this.owner == "enm") stroke("#FF0000");
        else stroke("#0055FF");
        point(this.pos.x, this.pos.y);
        pop();
    }
}
class CollectableHeart {
    constructor(x) {
        this.x = x;
        this.y = -15;
        this.isDead = false;
    }
    Update() {
        this.y += 3;
        if (this.y > height) this.isDead = true;
        push();
        translate(this.x, this.y);
        image(heartCollectImg, 0, 0);
        pop();
        if (dist(this.x + 7, this.y + 7, ship.x + 50, ship.y + 255) <= 63) {
            if (ship.HP < 10) ship.HP++;
            this.isDead = true;
        }
    }
}
var slideswitchbutton__mousewaspressed;
//SlideSwitch class
class SlideSwitch {
    constructor(x, y, onColor, offColor, isOn) {
        this.x = x;
        this.y = y;
        this.__ellipseX = x;
        this.__ellipseY = y;
        this.onColor = onColor;
        this.offColor = offColor;
        this.isOn = isOn;
        if (this.isOn) this.color = this.onColor;
        else this.color = this.offColor;
    }
    Update() {
        push();
        if (mouseX >= this.x && mouseY >= this.y && mouseX <= this.x + 50 && mouseY <= this.y + 20) {
            this.onHover();
            if (mouseIsPressed && !slideswitchbutton__mousewaspressed) {
                this.onClick();
                this.switch();
            }
        }
        noStroke();
        rectMode(CORNER);
        ellipseMode(CORNER);
        if (this.isOn) {
            fill(this.onColor);
            rect(this.x, this.y, 50, 20, 100);
            fill("#AAAAAA");
            this.__ellipseX += (this.x + 30 - this.__ellipseX) / 3;
            ellipse(this.__ellipseX, this.__ellipseY, 20);
        } else {
            fill(this.offColor);
            rect(this.x, this.y, 50, 20, 100);
            fill("#AAAAAA");
            this.__ellipseX += (this.x - this.__ellipseX) / 3;
            ellipse(this.__ellipseX, this.__ellipseY, 20);
        }
        pop();
    }
    onHover() { }
    onClick() { }
    switch() {
        this.isOn = !this.isOn;
        if (this.isOn) this.color = this.onColor;
        else this.color = this.offColor;
    }
}
class Button {
    constructor(x, y, w, h, stroke, color, hoverColor, text) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.color = color;
        this.stroke = stroke;
        this.hoverColor = hoverColor;
        this.text = text;
    }
    Update() {
        push();
        stroke(this.stroke);
        if (mouseX + 50 >= this.x && mouseY + 100 >= this.y && mouseX - 50 <= this.x + this.w && mouseY <= this.y + this.h) {
            fill(this.hoverColor);
            if (mouseIsPressed && !slideswitchbutton__mousewaspressed)
                this.onClick();
        } else {
            fill(this.color);
        }
        rect(this.x, this.y, this.w, this.h);
        noStroke();
        fill("#000000");
        textAlign(CENTER, CENTER);
        textFont(font);
        textSize(16);
        text(this.text, this.x, this.y, this.x + this.w, this.y + this.h);
        pop();
    }
    onClick() { }
}
//Setting it up: Vars
let stars = [];
let ship;
let enemies = [];
let particles = [];
let bullets = [];
let keyWait = 0;
let shipImgs = {};
let enemyImgs = {};
let heartImg;
let heartCollectImg;
let font;
let collectableHearts = [];
let mode;
let lagMode;
let playButton;
//Setting it up: Loading
function preload() {
    shipImgs = {
        1: loadImage("assets/ship.png"),
        2: loadImage("assets/ship2.png"),
        3: loadImage("assets/ship3.png")
    };
    enemyImgs = {
        1: loadImage("assets/enemy.png"),
        2: loadImage("assets/enemyBoss.png"),
        3: {
            D: loadImage("assets/Eship.png"),
            L: loadImage("assets/EshipL.png"),
            R: loadImage("assets/EshipR.png")
        }
    };
    heartImg = loadImage("assets/heart.png");
    heartCollectImg = loadImage("assets/heartCollect.png");
    font = loadFont("assets/serif.ttf");
}
//Setting it up
function setup() {
    if (typeof getURLParams().width == 'number' && typeof getURLParams().height() == 'number')
        createCanvas(getURLParams().width, getURLParams().height);
    else createCanvas(windowWidth - 17, windowHeight - 17);
    loadMenu();
    lagMode = new SlideSwitch(10, height - 30, "#00AA22", "#333333", false);
}
//Load the menu
function menuFrame() {
    noCursor();
    lagMode.Update();
    playButton.Update();
    slideswitchbutton__mousewaspressed = mouseIsPressed;
    push();
    fill("#FFFFFF");
    noStroke();
    textAlign(CENTER);
    textFont(font);
    textSize(16);
    text("Lag Mode", 0, height - 40, 80);
    pop();
    push();
    fill("#00AA44");
    noStroke();
    var modX = playButton.x + 55;
    var modY = playButton.y + 5;
    triangle(modX, modY, modX, modY + 90, modX + 90, modY + 45);
    pop();
    image(shipImgs[1], mouseX - 50, mouseY);
}
function loadMenu() {
    mode = "menu";
    playButton = new Button((width - 200) / 2, (height - 100) / 2, 200, 100, "#000000", "#555555", "#AAAAAA", "");
    playButton.onClick = playGame;
    noCursor();
}
//Setting it up -- in-game
function playGame() {
    mode = "play";
    ship = new Ship(mouseX, mouseY);
    ship.SetImage(shipImgs[1]);
    stars = [];
    enemies = [];
    particles = [];
    bullets = [];
    collectableHearts = [];
    for (var i = 0; i < 100; i++) {
        stars.push(new Star(Math.random() * width, Math.random() * height));
    }
}
//Drawing the game
function draw() {
    //Reset the canvas ('#000000' = black)
    background('#000000');
    if (mode == "menu") {
        menuFrame();
    }
    if (mode == "play") {
        //Decrement the keyWait variable every frame.
        keyWait--;
        //Don't show the cursor
        noCursor();
        //Only update the stars if you're not dead. Otherwise, just draw them.
        if (!lagMode.isOn) {
            if (ship.isDead) {
                createLoop(stars, function (i) {
                    push();
                    noFill();
                    for (var j = 0; j < stars[i].r; j++) {
                        stroke(255 - ((j / stars[i].r) * 100), 255 - ((j / stars[i].r) * 100), 255 - ((j / stars[i].r) * 100));
                        strokeWeight(4);
                        ellipse(stars[i].pos.x, stars[i].pos.y, stars[i].r + j);
                    }
                    pop();
                });
            } else {
                //Update the stars
                createLoop(stars, function (i) {
                    stars[i].Update();
                    if (stars[i].pos.y > height + (stars[i].r * 2)) {
                        stars[i] = new Star(Math.random() * width, -15);
                    }
                });
            }
        }
        //Update your ship
        ship.Update(mouseX, mouseY);
        //Check if [space] or mouse is pressed to shoot
        if ((keyIsDown(32) || mouseIsPressed) && keyWait <= 0 && !ship.isDead) {
            bullets.push(new Bullet(ship.x, ship.y + 265, ship.angle, "ship"));
            keyWait = 10;
        }
        //Refill your life with collectable hearts! Oh, yeah! :D
        if (ship.isDead) {
            createLoop(collectableHearts, function (i) {
                push();
                translate(collectableHearts[i].x, collectableHearts[i].y);
                image(heartCollectImg, 0, 0);
                pop();
            });
        } else {
            //Randomly add more collectable hearts.
            if (Math.random() < 0.005) collectableHearts.push(new CollectableHeart(Math.random() * (width - 15)));
            createLoop(collectableHearts, function (i) {
                collectableHearts[i].Update();
                if (collectableHearts[i].isDead) collectableHearts.remove(i);
            })
        }
        //Only update the ships if you aren't dead. Otherwise, just draw them.
        if (ship.isDead) {
            createLoop(enemies, function (i) {
                push();
                translate(enemies[i].pos.x, enemies[i].pos.y);
                translate(-25, -25);
                image(enemyImgs[1], 0, 0);
                pop();
            });
        } else {
            //5% chance to spawn a new enemy -- Spawns way more than you think XD
            if (Math.random() < 0.05)
                enemies.push(new Enemy(Math.random() * width));
            //Update all of the enemy ships
            createLoop(enemies, function (i) {
                enemies[i].Update();
                if (enemies[i].isDead) {
                    createLoop(50, function () {
                        particles.push(new Particle(
                            (Math.random() * 50) + enemies[i].pos.x,
                            (Math.random() * 50) + enemies[i].pos.y,
                            (Math.random() - 0.5) * 20,
                            (Math.random() - 0.5) * 20
                        ));
                    });
                }
                if (enemies[i].pos.y > height + 50 || enemies[i].isDead)
                    enemies.remove(i);
            });
        }
        //Update the bullets
        createLoop(bullets, function (i) {
            bullets[i].Update(i);
            if (bullets[i].isDead) bullets.remove(i);
        });
        if (!lagMode.isOn) {
            //Update the particles...
            createLoop(particles, function (i) {
                particles[i].Update();
                if (particles[i].isDead) particles.remove(i);
            });
        } else particles = [];
        //... and draw the hearts
        createLoop(ship.HP, function (i) {
            image(heartImg, (width - 40) - (i * 35), 5);
        });
        //If the ship IS dead, Tell them to push Enter. If they do, they can play again!
        if (ship.isDead) {
            push();
            textAlign(CENTER, CENTER);
            textFont(font);
            textSize(50);
            stroke("#FFFFFF");
            strokeWeight(2);
            fill("#000000");
            text("Push Enter to go to the menu.", 0, 0, width, height);
            pop();
            if (keyIsDown(13))
                loadMenu();
        }
    }
}