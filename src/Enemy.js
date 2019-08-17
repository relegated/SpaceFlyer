function Enemy(x) {
    this.position = createVector(x, 0);
    this.velocity = createVector(0, 5);
    this.size = 20;
    this.isDead = false;
    this.type = 0;
    this.img = EshipImgs.Normal;
    this.angle = Math.atan2((returnBullet.y - shipY), (returnBullet.x - shipX));
    if (Math.random() < 0.04) {
        this.type = 1;
        this.img = EshipImgs.Special;
        this.size = 165;
    }
    this.Update = function () {
        if (this.type == 1) {
            this.position.add(this.velocity);
        } else {
            this.position.add(0 - this.velocity)
            if (Math.abs(this.position.x - ship.cursorX) > 200) {
                if (this.position.x > ship.cursorX) {
                    this.position.add(createVector(-5, 0));
                } else if (this.position.x < ship.cursorX) {
                    this.position.add(createVector(5, 0));
                }
            }
        }
        this.angle = Math.atan2((returnBullet.y - shipY), (returnBullet.x - shipX));
        if (this.position.y > height)
            this.isDead = true;
    }

    this.Show = function () {
        //rect(this.position.x, this.position.y, this.size, this.size);
        if (this.img == EshipImgs.Special) {
            translate(this.position.x - 10, this.position.y - 10);
            rotate(this.angle);
            image(this.img, 0, 0);
        } else {
            image(this.img, this.position.x - 10, this.position.y - 10);
        }
    }

    this.CheckBulletCollision = function (bullet) {
        if (dist(this.position.x + this.size / 2, this.position.y + this.size / 2, bullet.x, bullet.y) <= this.size / 2 + 2) {
            this.isDead = true;
            return true;
        } else {
            return false;
        }
    }

    this.ShootBullet = function (shipX, shipY) {
        returnBullet = new Bullet(this.position.x + 7, this.position.y + 10, 0, 0, false);
        const speed = 8.5;
        returnBullet.dx = -1 * speed * Math.cos(this.angle);
        returnBullet.dy = -1 * speed * Math.sin(this.angle);

        return returnBullet;
    }
}