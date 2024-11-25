/////////////////////////////
//Sketch.js: Spaceflyer 2.0//
/////////////////////////////



//Setting it up: Loading
function preload() {
    shipImgs = [
        loadImage("assets/ship.png"),
        loadImage("assets/ship2.png"),
        loadImage("assets/ship3.png")
    ];
    enemyImgs = [
        loadImage("assets/enemy.png"),
        loadImage("assets/enemyBoss.png"),
        {
            D: loadImage("assets/Eship.png"),
            L: loadImage("assets/EshipL.png"),
            R: loadImage("assets/EshipR.png")
        }
    ];
    heartImg = loadImage("assets/heart.png");
    heartCollectImg = loadImage("assets/heartCollect.png");
    closeImg = loadImage("assets/close.png");
    coinImage = {
        normal: loadImage("assets/coinAnimation.png"),
        flip: loadImage("assets/coinAnimationFlip.png")
    }
    bombImg = loadImage("assets/bomb.png");
    bombCollectImg = loadImage("assets/bombcollect.png");
    fonts = {
        serif: loadFont("assets/serif.ttf")
    };
}
//Setting it up
function setup() {
    if (typeof getURLParams().width == 'number' && typeof getURLParams().height == 'number')
        createCanvas(getURLParams().width, getURLParams().height);
    else createCanvas(windowWidth, windowHeight);
    loadMenu();
}
//Load the menu
function menuFrame() {
    lagMode.update();
    playButton.update();
    upgradeButton.update();
    push();
    fill("#FFFFFF");
    textFont(fonts.serif);
    textSize(16);
    textAlign(RIGHT, TOP);
    text("Lag Mode", width - 12, 30);
    pop();
    push();
    fill("#00AA44");
    noStroke();
    var modX = playButton.x + 55;
    var modY = playButton.y + 5;
    triangle(modX, modY, modX, modY + 90, modX + 90, modY + 45);
    pop();
}
function loadMenu() {
    mode = "menu";
    lagMode = new SlideSwitch(width - 70, 10, "#00AA22", "#333333", false);
    if (getCookie("lag") == "true") lagMode.isOn = true;
    lagMode.onClick = function () {
        setCookie("lag", "" + lagMode.isOn);
    };
    playButton = new Button((width - 200) / 2, (height - 100) / 2, 200, 100, "#000000", "#555555", "#AAAAAA", "");
    playButton.onClick = playGame;
    upgradeButton = new Button(width - 110, 200, 100, 50, "#000000", "#333333", "#666666", "Upgrades");
    upgradeButton.onClick = loadUpgradeMenu;
}
//Upgrade menu -- Use this to buy new upgrades to help attack!
function loadUpgradeMenu() {
    mode = "upgrade-menu";
    upgradeMenu = [];
    upgradeMenu.push(new Button(width - 75, height - 75, 50, 50, "#000000", "#CC0000", "#FF0000", "X"));
    upgradeMenu[0].onClick = function () {
        loadMenu();
    };
    var x = 50, y = 50;
    createLoop(possibleUpgrades.length - 1, function (i) {
        upgradeMenu.push(new UpgradeButton(x, y, "#666666", "#999999", possibleUpgrades[i + 1], costs[i], currentUpgrades.contains(possibleUpgrades[i + 1])));
        if (x == 50)
            x = (width - 100) / 2;
        else if (x == (width - 100) / 2)
            x = width - 150;
        else {
            x = 50;
            y += 150;
        }
    });
}
//Setting it up -- in-game
function playGame() {
    mode = "play";
    ship = new Ship(mouseX, mouseY + 30);
    stars = [];
    enemies = [];
    particles = [];
    bullets = [];
    collectableHearts = [];
    combos = [];
    for (var i = 0; i < 100; i++) {
        stars.push(new Star(Math.random() * width, Math.random() * height));
    }
}
//Drawing the game
function draw() {
    //Don't show the cursor
    noCursor();
    //Reset the canvas ('#000000' = black)
    background('#000000');
    if (mode == "upgrade-menu") {
        if (ship == undefined || ship.isDead)
            ship = new Ship(mouseX, mouseY + 30);
        ship.iFrames = 0;
        createLoop(upgradeMenu, function (i) {
            upgradeMenu[i].update();
        });
        ship.update(mouseX, mouseY + 30);
    }
    if (mode == "menu") {
        if (ship == undefined || ship.isDead)
            ship = new Ship(mouseX, mouseY);
        ship.iFrames = 0;
        menuFrame();
        ship.update(mouseX, mouseY + 30);
    }
    if (mode == "play") {
        //Decrement the keyWait variable every frame.
        keyWait--;
        //Only update the stars if you're not dead. Otherwise, just draw them.
        if (!lagMode.isOn) {
            if (ship.isDead) {
                createLoop(stars, function (i) {
                    stars[i].update(Math.max(0, (200 - ship.deadFrameCount) / 200));
                    if (stars[i].pos.y > height + (stars[i].r * 2))
                        stars[i] = new Star(Math.random() * width, -15);
                });
            } else {
                //update the stars
                createLoop(stars, function (i) {
                    stars[i].update(1);
                    if (stars[i].pos.y > height + (stars[i].r * 2))
                        stars[i] = new Star(Math.random() * width, -15);
                });
            }
        }
        //update your ship
        ship.update(mouseX, mouseY + 30);
        //Check if [space] or mouse is pressed to shoot
        if ((keyIsDown(32) || mouseIsPressed) && keyWait <= 0 && !ship.isDead) {
            if (selectedUpgrade == "split") {
                bullets.push(new Bullet(ship.x, ship.y + 265, ship.angle - 0.5, "ship"));
                bullets.push(new Bullet(ship.x, ship.y + 265, ship.angle + 0.5, "ship"));
            } else
                bullets.push(new Bullet(ship.x, ship.y + 265, ship.angle, "ship"));
            keyWait = 10;
        }
        //Check if [x] or [m] is pressed to shoot a bomb or laser
        if ((keyIsDown(88) || keyIsDown(77)) && !ship.isDead) {
            if (selectedUpgrade == "laser")
                laser = new Laser(ship.x, ship.y + 265, ship.angle);
            if (selectedUpgrade == "bomb" && storageBombs > 0) {
                storageBombs--;
                bombs.push(new Bomb(ship.x, ship.y + 265, ship.angle));
            }
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
                collectableHearts[i].update();
                if (collectableHearts[i].isDead) collectableHearts.remove(i);
            })
        }
        //Only update the coins if you're not dead. Otherwise, just draw them.
        if (ship.isDead) {
            createLoop(coins, function (i) {
                var dataNum = Math.floor(coins[i].frame) % 10;
                if (dataNum > 5)
                    image(coinImage.flip, coins[i].x, coins[i].y, 25, 25, coinImageData[dataNum], 0, 127, 127);
                else
                    image(coinImage.normal, coins[i].x, coins[i].y, 25, 25, coinImageData[dataNum], 0, 127, 127);
            });
            createLoop(collectableBombs, function (i) {
                image(bombImg, collectableBombs[i].x, collectableBombs[i].y);
            });
            createLoop(bombs, function (i) {
                image(bombImg, bombs[i].x, bombs[i].y);
            });
        } else {
            createLoop(coins, function (i) {
                coins[i].update();
                if (coins[i].isDead) coins.remove(i);
            });
            createLoop(collectableBombs, function (i) {
                collectableBombs[i].update();
                if (collectableBombs[i].isDead) collectableBombs.remove(i);
            });
            createLoop(bombs, function (i) {
                bombs[i].update();
                if (bombs[i].isDead) bombs.remove(i);
            });
        }
        //Only update the ships if you aren't dead. Otherwise, just draw them.
        if (ship.isDead) {
            createLoop(enemies, function (i) {
                push();
                translate(enemies[i].pos.x, enemies[i].pos.y);
                translate(-25, -25);
                image(enemyImgs[0], 0, 0);
                pop();
            });
        } else {
            //5% chance to spawn a new enemy -- Spawns way more than you think XD
            if (Math.random() < 0.05)
                enemies.push(new Enemy(Math.random() * width));
            //update all of the enemy ships
            createLoop(enemies, function (i) {
                enemies[i].update();
                if (enemies[i].isDead) {
                    createLoop(50, function () {
                        particles.push(new Particle(
                            (Math.random() * 50) + enemies[i].pos.x,
                            (Math.random() * 50) + enemies[i].pos.y,
                            (Math.random() - 0.5) * 20,
                            (Math.random() - 0.5) * 20
                        ));
                    });
                    if (Math.random() < 0.5 && enemies[i].isDeadFromBullet)
                        coins.push(new Coin(enemies[i].pos.x, enemies[i].pos.y));
                    if (Math.random() < 0.3 && selectedUpgrade == "bomb")
                        collectableBombs.push(new CollectableBomb(enemies[i].pos.x, enemies[i].pos.y));
                }
                if (enemies[i].pos.y > height + 50 || enemies[i].isDead)
                    enemies.remove(i);
            });
        }
        //update the bullets
        createLoop(bullets, function (i) {
            bullets[i].update(i);
            if (bullets[i].isDead) bullets.remove(i);
        });
        if (!lagMode.isOn) {
            //update the particles...
            createLoop(particles, function (i) {
                particles[i].update();
                if (particles[i].isDead) particles.remove(i);
            });
        } else particles = [];
        //... and draw the hearts
        createLoop(ship.HP, function (i) {
            image(heartImg, (width - 40) - (i * 35), 5);
        });
        createLoop(combos, function (i) {
            combos[i].update();
            if (combos[i].transparency >= 256) combos.remove(i);
        });
        //Show your score & your money.
        push();
        fill("#FFFFFF");
        textFont(fonts.serif);
        textSize(20);
        textAlign(LEFT, TOP);
        text("Score: " + ship.score, 10, 10);
        var dataNum = Math.floor(frameCount / 2) % 10;
        if (dataNum > 5)
            image(coinImage.flip, 5, 40, 25, 25, coinImageData[dataNum], 0, 127, 127);
        else
            image(coinImage.normal, 5, 40, 25, 25, coinImageData[dataNum], 0, 127, 127);
        text(coinsCollected, 30, 42);
        pop();
        //If the ship IS dead, Tell them to push Enter. If they do, they can play again!
        if (ship.isDead) {
            push();
            textAlign(CENTER, CENTER);
            textFont(fonts.serif);
            textSize(50);
            stroke("#FFFFFF");
            strokeWeight(2);
            fill("#000000");
            text("Push Enter to go to the menu.", 0, 0, width, height);
            pop();
            if (keyIsDown(13))
                loadMenu();
        }
        //If the Escape key is pressed, go to the main menu.
        if (keyIsDown(27)) loadMenu();
    }
    slideswitchbutton__mousewaspressed = mouseIsPressed;
}