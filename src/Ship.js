

function Ship(inCursorX, inCursorY) {

    this.isDead = false;
    this.cursorX = inCursorX;
    this.cursorY = inCursorY;
    this.health = 5;
    this.IFrames = 0;

    this.Update = function (inCursorX, inCursorY) {
        this.cursorX = inCursorX;
        this.cursorY = inCursorY;

        //update Iframes if needed
        if (this.IFrames > 0)
            this.IFrames--;
    }

    this.Show = function (sprite) {
        //triangle(this.cursorX, this.cursorY - 40, this.cursorX + 33, this.cursorY + 40, this.cursorX - 33, this.cursorY + 40);

        if ((this.IFrames > 0 && frameCount % 10 == 0) || (this.IFrames <= 0))
            image(sprite, this.cursorX - 40, this.cursorY - 40);
    }

    this.CheckBulletCollision = function (bullet) {
        if (this.IFrames > 0)
            return false;

        var distanceToBullet = dist(this.cursorX, this.cursorY, bullet.x, bullet.y);
        if (distanceToBullet <= 20) {
            this.TakeDamage();
            return true;
        } else {
            return false;
        }
    }


    this.CheckCollision = function (enemy) {
        if (this.IFrames > 0)
            return false;

        var distanceToEnemy = dist(this.cursorX, this.cursorY, enemy.position.x + 5, enemy.position.y + 5);
        if (distanceToEnemy <= 40) {
            this.TakeDamage();
            return true;
        } else {
            return false;
        }
    }

    this.TakeDamage = function () {
        this.health--;
        this.IFrames = 60;
        if (this.health <= 0) {
            this.isDead = true;
            this.IFrames = 0;
        }
    }
}

