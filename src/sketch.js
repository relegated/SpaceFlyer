//constants
const SPACE = 32;

//variables
let ship = new Ship(0, 0);
let enemies = [];
let bullets = [];
let powerUps = [];
let possiblePowerUps = ["spread"];
let score = 0;
let shipImg;
let enemyImg;
let NoWayImg;
let HitY = 0;
let activePowerUps = [];

function preload() {
    shipImg = loadImage('assets/ship.png')
    enemyImg = loadImage('assets/enemy.png');
    heartImg = loadImage('assets/heart.png');
    NoWayImg = loadImage('assets/no.cur')
    font = loadFont('assets/serif.ttf')
}

function setup() {
    createCanvas(windowWidth - 10, windowHeight - 17);
    background(0);
    stroke(255);
    noFill();
    noCursor();
    frameRate(70);
}

function draw() {

    if (!ship.isDead) {

        background(0);

        ShowScore();

        DisplayHealth();

        if (random(1) < 0.03) {
            enemies.push(new Enemy(floor(random(width))));
        }

        ship.Update(mouseX, mouseY);
        ship.Show(shipImg);
        if ((keyIsDown(SPACE) || mouseIsPressed) && frameCount % 5 == 0) {
            bullets.push(new Bullet(mouseX + 10, mouseY - 5, 0, -7, true));
            if (contains(activePowerUps, "spread")) {
                //Adds 2 new bullets for "spread" powerup
                bullets.push(new Bullet(mouseX + 10, mouseY - 5, -3, -7, true))
                bullets.push(new Bullet(mouseX + 10, mouseY - 5, 3, -7, true))
            }
        }

        //update bullets
        for (var i = 0; i < bullets.length; i++) {
            bullets[i].Update();
            noStroke()
            if (bullets[i].isFromShip) {
                fill(70, 50, 255);
            }
            else {
                fill(239, 62, 43);
            }
            bullets[i].Show();
            stroke(255);

            if (bullets[i].isFromShip == false) {
                if (ship.CheckBulletCollision(bullets[i])) {
                    bullets[i].isDead = true;
                }
            }
        }
        //update enemies
        for (var i = 0; i < enemies.length; i++) {
            //shoot
            if (frameCount % 50 == 0 && random(1) < 0.3) {
                bullets.push(enemies[i].ShootBullet(ship.cursorX, ship.cursorY));
            }
            enemies[i].Update();
            enemies[i].Show(enemyImg);
            if (ship.CheckCollision(enemies[i]) == true) {
                enemies[i].isDead = true;
            }
            for (var j = 0; j < bullets.length; j++) {
                if (bullets[j].isFromShip) {
                    if (enemies[i].CheckBulletCollision(bullets[j])) {
                        bullets[j].isDead = true;
                        score += 5;
                        //chance to spawn PowerUp
                        if (random() >= 0.75) {
                            powerUps.push(new PowerUp(enemies[i].position.x, enemies[i].position.y, random(-3, 3), random(-3, 3), possiblePowerUps[floor(random(possiblePowerUps.len))]));
                        }
                    }
                }
            }
        }

        //update powerups
        for (var i = 0; i < powerUps.length; i++) {
            powerUps[i].Update();
            stroke(255);
            noFill()
            powerUps[i].Show();
            for (var j = 0; j < bullets.length; j++) {
                if (bullets[j].isFromShip) {
                    if (powerUps[i].CheckBulletCollision(bullets[j])) {
                        bullets[j].isDead = true;
                    }
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

        //cleanup dead powerups
        for (var i = powerUps.length - 1; i >= 0; i--) {
            if (powerUps[i].isDead) {
                //Add dead powerup's type to active powerups
                activePowerUps.push(powerUps[i].PowerUpType)
                powerUps.splice(i, 1);
            }
        }

    } else {
        cursor(ARROW)
        if (mouseIsPressed)
            cursor(NoWayImg)
        background(0);
        stroke('red');
        ship.Show(shipImg);
        ShowScore();
        DisplayGameOver();
        for (var i = 0; i < enemies.length; i++)
            enemies[i].Show(enemyImg);
    }

}
//Restart Game
function keyPressed() {
    if (keyCode === 13 && ship.isDead) {
        ship.isDead = false;
        score = 0;
        enemies.splice(0, enemies.length);
        bullets.splice(0, bullets.length);
        activePowerUps.splice(0, activePowerUps.length)
        ship.health = 5;
    }
}
function contains(list, item) {
    for (var i = 0; i++; i < list.length) {
        if (list[i] == item)
            return true
    }
    return false
}
function ShowScore() {
    //show score
    textSize(32);
    textFont(font);
    fill("#FFFFFF");
    noStroke();
    textAlign(LEFT)
    text("Score: " + score, 10, 40);
    stroke(255);
    noFill();
}

function DisplayGameOver() {
    textSize(48);
    fill(255);
    noStroke();
    textAlign(CENTER)
    text("GAME OVER -- Press Enter to restart", 0, height / 2, width, height);
    stroke(255);
    noFill();
}

function DisplayHealth() {
    let CurrentX = width - 60;
    for (var i = 0; i < ship.health; i++) {
        image(heartImg, CurrentX, 15);
        CurrentX -= 50;
    }
}
function windowResized() {
    resizeCanvas(windowWidth - 10, windowHeight - 17)
}