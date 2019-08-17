//constants
const SPACE = 32;
//variables
let ship = new Ship(0, 0);
let enemies = [];
let bullets = [];
let powerUps = [];
let score = 0;
let spread = false;
let shipImg;
let ship2Img;
let ship3Img;
let enemyImg;
let heartImg;
let EshipImgs;
let cPressed = false;
let costume = 0
let sprite;

//Classes
//Not working
//Constructs, creates, and updates stars. class StarWorker(){
let starsR = [];
let starsX = [];
let starsY = [];
function Stars_SpawnOrigin() {
    starsX = []; //X pos of stars
    starsY = []; //Y pos of stars
    starsR = []; //Radius of stars
    for (var i = 0; i < Math.floor(random(15, 20) + (height / 30)); i++) {
        starsR.push(random(3, 6))
        starsX.push(random(width - starsR[starsR.length - 1]))
        starsY.push(random(height))
    }
}
function Stars_Update() {
    for (var i = 0; i < starsR.length; i++) {
        starsY[i] += Math.round(starsR[i] / 5)
        noStroke()
        fill('#FFFFFF')
        ellipse(starsX[i], starsY[i], starsR[i])
        if (starsY[i] + (2 * starsR[i]) > height) {
            starsR.splice(i)
            starsX.splice(i)
            starsY.splice(i)
            i--;
        }
    }
    if (random() >= 0.75) {
        starsR.push(random(15, 20))
        starsX.push(random(width - starsR[starsR.length]))
        starsY.push(random(height))
    }
}
//}

function preload() {
    shipImg = loadImage('assets/ship.png');
    ship2Img = loadImage('assets/ship2.png');
    ship3Img = loadImage('assets/ship3.png');
    heartImg = loadImage('assets/heart.png');
    EshipImgs = {
        Super: loadImage('assets/Eship.png'),
        Normal: loadImage('assets/enemy.png')
    };
    font = loadFont('assets/serif.ttf')
}

function setup() {
    createCanvas(windowWidth - 10, windowHeight - 17);
    background(0);
    stroke(255);
    noFill();
    frameRate(70);
    Stars_SpawnOrigin();
}

function draw() {

    if (!ship.isDead) {
        noCursor();
        background(0);
        Stars_Update();
        ShowScore();
        DisplayHealth();

        if (random(1) < 0.03) {
            enemies.push(new Enemy(floor(random(width))));
        }
        sprite = costume % 3
        ship.Update(mouseX, mouseY, sprite);
        if (sprite == 0) {
            ship.Show(shipImg);
        } else if (sprite == 1) {
            ship.Show(ship2Img);
        } else {
            ship.Show(ship3Img);
        }
        if ((keyIsDown(SPACE) || mouseIsPressed) && frameCount % 5 == 0) {
            if (sprite == 2) {
                bullets.push(new Bullet(mouseX - 31, mouseY - 5, 0, -7, true));
                if (spread == true) {
                    //Adds 2 new bullets for "spread" powerup
                    bullets.push(new Bullet(mouseX + 10, mouseY - 5, -3, -7, true))
                    bullets.push(new Bullet(mouseX + 10, mouseY - 5, 3, -7, true))
                }
            } else if (sprite == 1) {
                bullets.push(new Bullet(mouseX + 7, mouseY - 5, 0, -7, true));
                if (spread == true) {
                    //Adds 2 new bullets for "spread" powerup
                    bullets.push(new Bullet(mouseX + 10, mouseY - 5, -3, -7, true))
                    bullets.push(new Bullet(mouseX + 10, mouseY - 5, 3, -7, true))
                }
            } else {
                bullets.push(new Bullet(mouseX + 10, mouseY - 5, 0, -7, true));
                if (spread == true) {
                    //Adds 2 new bullets for "spread" powerup
                    bullets.push(new Bullet(mouseX + 10, mouseY - 5, -3, -7, true))
                    bullets.push(new Bullet(mouseX + 10, mouseY - 5, 3, -7, true))
                }
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
                if (enemies[i].type != 1) {
                    bullets.push(enemies[i].ShootBullet(ship.cursorX - 50, ship.cursorY));
                    bullets.push(enemies[i].ShootBullet(ship.cursorX + 50, ship.cursorY));
                }
            }
            enemies[i].Update();
                enemies[i].Show();
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
                            powerUps.push(new PowerUp(enemies[i].position.x, enemies[i].position.y, random(-3, 3), random(-3, 3)/*, activePowerUps[floor(random(activePowerUps.length))]*/));
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
                //activePowerUps[powerUps[i].PowerUpType] = true
                powerUps.splice(i, 1);
            }
        }
        //update costume if needed
        if (keyIsDown(67) && !cPressed) {
            costume++;
            cPressed = true;
        }
        if (!keyIsDown(67) && cPressed)
            cPressed = false;
    } else {
        cursor(ARROW);
        background(0);
        stroke('red');
        if (costume % 3 == 0) {
            ship.Show(shipImg);
        } else if (costume % 3 == 1) {
            ship.Show(ship2Img);
        } else {
            ship.Show(ship3Img);
        }
        ShowScore();
        DisplayGameOver();
        for (var i = 0; i < enemies.length; i++)
            enemies[i].Show(enemyImg);
        //Restart Game
        if (keyIsDown(13)) {
            //activePowerUps =
            ship.isDead = false;
            score = 0;
            enemies.splice(0, enemies.length);
            bullets.splice(0, bullets.length);
            //activePowerUps.splice(0, activePowerUps.length);
            ship.health = 5;
            costume = 0;
        }
    }
}

function ShowScore() {
    //show score
    textSize(32);
    textFont(font);
    fill("#FFFFFF");
    noStroke();
    textAlign(LEFT, TOP)
    text("Score: " + score, 10, 10);
    stroke(255);
    noFill();
}

function DisplayGameOver() {
    textSize(48);
    fill(255);
    noStroke();
    textAlign(CENTER, CENTER)
    text("GAME OVER -- Press Enter to restart", 0, 0, width, height);
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
    if (ship.isDead) {
        resizeCanvas(windowWidth - 100, windowHeight - 107)
    }
}