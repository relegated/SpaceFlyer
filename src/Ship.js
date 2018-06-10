

function Ship(inCursorX, inCursorY) {

    this.isDead = false;
    this.cursorX = inCursorX;
    this.cursorY = inCursorY;


    this.Update = function (inCursorX, inCursorY) {
        this.cursorX = inCursorX;
        this.cursorY = inCursorY;

    }

    this.Show = function (sprite) {
        //triangle(this.cursorX, this.cursorY - 40, this.cursorX + 33, this.cursorY + 40, this.cursorX - 33, this.cursorY + 40);
        image(sprite, this.cursorX - 40, this.cursorY - 40);
    }

    this.CheckBulletCollision = function (bullet) {
        var distanceToBullet = dist(this.cursorX, this.cursorY, bullet.x, bullet.y);
        if (distanceToBullet <= 20) {
            this.isDead = true;
            return true;
        } else {
            return false;
        }
    }


this.CheckCollision = function (enemy) {
    var distanceToEnemy = dist(this.cursorX, this.cursorY, enemy.position.x + 5, enemy.position.y + 5);

    if (distanceToEnemy <= 40) {
        this.isDead = true;
        return true;
    } else {
        return false;
    }
}
}

