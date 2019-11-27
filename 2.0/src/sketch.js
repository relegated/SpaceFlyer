//Sketch.js: Spaceflyer 2.0
//Class: Star
class Star {
    constructor(x, y) {
        this.pos = createVector(x, y);
        this.vel = createVector(0, Math.random() * 4 + 2.5);
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
class Ship {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.angle = Math.PI;
        this.image = undefined;
    }
    SetImage(image) {
        this.image = image;
    }
    Update(x, y) {
        this.x += (x - this.x) / 3;
        this.y += (y - this.y) / 3;
        this.angle = Math.atan2(this.x - x, this.y - y);
        push();
        translate(x, y);
        rotate(this.angle);
        image(this.image, 0, 0);
        pop();
    }
}
//Setting it up: Vars
let stars = [];
let ship = new Ship(mouseX, mouseY);
let shipImgs = [];
//Setting it up: Loading
function preload() {
    shipImgs = {
        1: loadImage("assets/ship.png"),
        2: loadImage("assets/ship2.png"),
        3: loadImage("assets/ship3.png")
    };
    ship.SetImage(shipImgs[1]);
}
//Setting it up
function setup() {
    createCanvas(500, 500);
    for (var i = 0; i < 50; i++) {
        stars.push(new Star(Math.random() * width, Math.random() * height));
    }
}
//Drawing the game
function draw() {
    //Reset the canvas ('#000000' = black)
    background('#000000');
    //Update the stars
    for (var i = stars.length - 1; i > 0; i--) {
        stars[i].Update();
        if (stars[i].pos.y > width + (stars[i].r * 2)) {
            stars[i] = new Star(Math.random() * width, -15);
        }
    }
    ship.Update(mouseX, mouseY);
}