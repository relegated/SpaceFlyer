//Class: Star
class Star {
    constructor(x, y) {
        this.pos = createVector(x, y);
        this.vel = createVector(0, Math.random() * 3 + 2.5);
        this.r = this.vel.y / 2;
    }
    update(multiplier) {
        push();
        this.pos.add(createVector(this.vel.x * multiplier, this.vel.y * multiplier));
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
        this.angleOffset = 0;
        this.image = undefined;
        this.HP = 10;
        this.isDead = false;
        this.deadFrameCount = 0;
        this.iFrames = 100;
        this.score = 0;
        this.combo = 0;
        this.image = shipImgs[0];
    }
    setImage(image) {
        this.image = image;
    }
    update(x, y) {
        if (this.isDead) this.deadFrameCount++;
        this.iFrames--;
        this.x += (x - this.x) / 5;
        this.y += ((y - this.y) / 5) - 50;
        this.angle = -(Math.atan2(this.y - y, this.x - x)) + this.angleOffset - Math.PI / 2;
        if (keyIsDown(65) && !keyIsDown(68)) this.angleOffset += ((Math.PI * -0.25) - this.angleOffset) / 2;
        else if (keyIsDown(68) && !keyIsDown(65)) this.angleOffset += ((Math.PI * 0.25) - this.angleOffset) / 2;
        else this.angleOffset /= 2;
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
        this.isDeadFromBullet = false;
    }
    update() {
        this.pos.add(this.Velocity);
        if (dist(this.pos.x + 25, this.pos.y + 25, ship.x, ship.y + 280) <= 80 && ship.iFrames <= 0) {
            ship.iFrames = 50;
            this.isDead = true;
            ship.HP--;
        }
        push();
        translate(this.pos.x, this.pos.y);
        translate(-25, -25);
        image(enemyImgs[0], 0, 0);
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
    update() {
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
        this.HP = 1;
    }
    update(index) {
        if (selectedUpgrade == "return" && this.owner == "ship") {
            this.vel.add(createVector(0, 0.05));
            if (this.vel.y > 0 && dist(this.pos.x, this.pos.y, ship.x, ship.y + 255) <= 50 && !ship.isDead)
                this.isDead = true;
        }
        if (this.pos.y < 0 || this.pos.y > height || this.pos.x < 0 || this.pos.x > width) {
            if (selectedUpgrade == "bounce" && this.HP > 0 && this.owner == "ship") {
                if (this.pos.x < 0 || this.pos.x > width)
                    this.vel.x *= -1;
                if (this.pos.y < 0 || this.pos.y > height)
                    this.vel.y *= -1;
                this.HP--;
            } else {
                this.isDead = true;
                if (this.owner == "ship") ship.combo = 0;
            }
        }
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
                    ship.combo++;
                    if (ship.combo > 10)
                        ship.combo = 10;
                    if (ship.combo > 3)
                        combos.push(new Combo(this.pos.x, this.pos.y, ship.combo));
                    ship.score += ship.combo;
                    enemies[i].isDead = true;
                    enemies[i].isDeadFromBullet = true;
                    if (selectedUpgrade != "slice")
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
//Combo class, for displaying great combos.
class Combo {
    constructor(x, y, comboCount) {
        this.x = x;
        this.y = y;
        this.comboCount = comboCount;
        this.transparency = 0;
    }
    update() {
        this.transparency += 4;
        push();
        fill(0, 150, 256, 256 - this.transparency);
        textFont(fonts.serif);
        textSize(20);
        textAlign(LEFT, TOP);
        text("Combo: " + this.comboCount, this.x, this.y);
        pop();
    }
}
class CollectableHeart {
    constructor(x) {
        this.x = x;
        this.y = -15;
        this.isDead = false;
    }
    update() {
        this.y += 3;
        if (this.y > height) this.isDead = true;
        push();
        translate(this.x, this.y);
        image(heartCollectImg, 0, 0);
        pop();
        if (dist(this.x + 7, this.y + 7, ship.x, ship.y + 250) <= 60) {
            if (ship.HP < 10) ship.HP++;
            this.isDead = true;
        }
    }
}
class CollectableBomb {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.isDead = false;
    }
    update() {
        this.y += 3;
        if (this.y > height) this.isDead = true;
        push();
        translate(this.x, this.y);
        image(bombCollectImg, 0, 0);
        pop();
        if (dist(this.x + 7, this.y + 7, ship.x, ship.y + 250) <= 80) {
            storageBombs++;
            this.isDead = true;
        }
    }
}
class Bomb {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.isDead = false;
    }
    update() {
        this.y -= 5;
        if (this.y < 0) this.isDead = true;
        createOwnedLoop(this, enemies, function(i) {
            
        });
        push();
        translate(this.x, this.y);
        image(bombImg, 0, 0);
        pop();
    }
};
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
    update() {
        push();
        if (mouseX >= this.x && mouseY >= this.y && mouseX <= this.x + 50 && mouseY <= this.y + 20) {
            this.onHover();
            if (mouseIsPressed && !slideswitchbutton__mousewaspressed) {
                this.switch();
                this.onClick();
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
    constructor(x, y, w, h, stroke, color, hoverColor, text, font) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.color = color;
        this.stroke = stroke;
        this.hoverColor = hoverColor;
        this.text = text;
        if (font != undefined)
            this.font = font;
        else
            this.font = fonts.serif;
    }
    update() {
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
        fill("#FFFFFF");
        textAlign(CENTER, CENTER);
        textFont(this.font);
        textSize(16);
        text(this.text, this.x, this.y, this.w, this.h);
        pop();
    }
    onClick() { }
}
class UpgradeButton {
    constructor(x, y, color, hoverColor, upgrade, cost, purchased) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.hoverColor = hoverColor;
        this.upgrade = upgrade;
        this.cost = cost;
        this.purchased = purchased;
        this.frame = 0;
    }
    update() {
        push();
        noStroke();
        if (mouseX >= this.x && mouseY >= this.y && mouseX <= this.x + 100 && mouseY <= this.y + 100 && (coinsCollected >= this.cost || this.purchased)) {
            fill(this.hoverColor);
            if (mouseIsPressed && !slideswitchbutton__mousewaspressed)
                this.onClick();
        } else {
            fill(this.color);
        }
        rect(this.x, this.y, 100, 100);
        noStroke();
        fill("#FFFFFF");
        textAlign(CENTER, TOP);
        textFont(fonts.serif);
        textSize(25);
        text(this.upgrade, this.x, this.y, 100, 100);
        if (this.purchased) {
            textAlign(CENTER, BOTTOM);
            if (this.upgrade == selectedUpgrade)
                text("Selected!", this.x + 4, this.y, 100, 95);
            else
                text("Owned", this.x, this.y, 100, 95);
        } else {
            textAlign(LEFT, BOTTOM);
            text(this.cost, this.x + 5, this.y + 5, 95, 97);
            this.frame += 0.5;
            var dataNum = Math.floor(this.frame) % 10;
            if (dataNum > 5)
                image(coinImage.flip, this.x + 75, this.y + 75, 25, 25, coinImageData[dataNum], 0, 127, 127);
            else
                image(coinImage.normal, this.x + 75, this.y + 75, 25, 25, coinImageData[dataNum], 0, 127, 127);
        }
        pop();
    }
    onClick() {
        if (this.purchased) {
            selectedUpgrade = this.upgrade;
        } else {
            coinsCollected -= this.cost;
            this.purchased = true;
            currentUpgrades.push(this.upgrade);
        }
    }
}
//Coin class. Get coins to buy cool things at the Shop!
class Coin {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.frame = 0;
        this.isDead = false;
    }
    update() {
        this.y += 2;
        this.frame += 0.5;
        var dataNum = Math.floor(this.frame) % 10;
        if (dataNum > 5)
            image(coinImage.flip, this.x, this.y, 25, 25, coinImageData[dataNum], 0, 127, 127);
        else
            image(coinImage.normal, this.x, this.y, 25, 25, coinImageData[dataNum], 0, 127, 127);
        if (dist(this.x + 12, this.y + 12, ship.x + 50, ship.y + 256) <= 80) {
            coinsCollected++;
            this.isDead = true;
        }
        if (this.y > height) this.isDead = true;
    }
}