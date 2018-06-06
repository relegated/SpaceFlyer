//constants
const SPACE = 32;

//variables
let ship = new Ship(0, 0);
let enemies = [];
let bullets = [];
let score = 0;
let shipImg;
let enemyImg;

function preload() {
    shipImg = loadImage('assets/ship.png');
    enemyImg = loadImage('assets/enemy.png');
}

function setup() {
    createCanvas(1300, 900);
    background(0);
    stroke(255);
    noFill();


}

function draw() {

    if (!ship.isDead) {

        background(0);

        ShowScore();

        if (random(1) < 0.03) {
            enemies.push(new Enemy(floor(random(width))));
        }

        ship.Update(mouseX, mouseY);
        ship.Show(shipImg);
        if (keyIsDown(SPACE) && frameCount % 5 == 0) {
            bullets.push(new Bullet(mouseX, mouseY - 5, 0, -7));

        }

        //update bullets
        for (var i = 0; i < bullets.length; i++) {
            bullets[i].Update();
            stroke (239,62,43);
            bullets[i].Show();
            stroke(255);
        }

        //update enemies
        for (var i = 0; i < enemies.length; i++) {
            enemies[i].Update();
            enemies[i].Show(enemyImg);
            ship.CheckCollision(enemies[i]);
            for (var j = 0; j < bullets.length; j++) {
                if (enemies[i].CheckBulletCollision(bullets[j])) {
                    bullets[j].isDead = true;
                    score += 5;
                }
            }
        }




        //cleanup dead enemeies
        for (var i = enemies.length - 1; i > 0; i--) {
            if (enemies[i].isDead) {
                enemies.splice(i, 1);
            }
        }

        //cleanup dead bullets
        for (var i = bullets.length - 1; i > 0; i--) {
            if (bullets[i].isDead) {
                bullets.splice(i, 1);
            }
        }

    } else {
        stroke('red');
        ship.Show();
        ShowScore();
        DisplayGameOver();
    }

}

function keyPressed(){
    if (keyCode === 13 && ship.isDead){
        ship.isDead = false;
        score = 0;
        enemies.splice(0,enemies.length);
        bullets.splice(0,bullets.length);
    }
}

function ShowScore() {
    //show score
    textSize(32);
    fill("blue");
    noStroke();
    text("Score: " + score, 10, 40);
    stroke(255);
    noFill();
}

function DisplayGameOver(){
    textSize(48);
    fill(255);
    noStroke();
    text("GAME OVER -- Press Enter to restart", 300, height/2);
    stroke(255);
    noFill();
}