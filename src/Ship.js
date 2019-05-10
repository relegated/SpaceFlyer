

function Ship(inCursorX, inCursorY) {

    this.isDead = false;
    this.cursorX = inCursorX;
    this.cursorY = inCursorY;
    this.health = 5;
    this.IFrames = 0;
    this.width = 80;
    this.height = 80;

    this.Update = function (inCursorX, inCursorY, sprite) {
        this.cursorX = inCursorX;
        this.cursorY = inCursorY;
        if (sprite == 1) {
            this.cursorX -= 25;
            this.cursorY -= 30;
        }
        if (sprite == 2) 
            this.cursorX -= 41;
        //update Iframes if needed
        if (this.IFrames > 0)
            this.IFrames--;
        //Update width, height, and diameter of sprite for the p5.collide2D to function
        if (sprite == 1) {
            this.width = 126
            this.height = 36
        }
        if (sprite == 2) {
            this.width = 111
            this.height = 36
        }
        if (sprite == 0) {
            this.width = 80
            this.height = 80
        }
    }

    this.Show = function (sprite) {
        //triangle(this.cursorX, this.cursorY - 40, this.cursorX + 33, this.cursorY + 40, this.cursorX - 33, this.cursorY + 40);

        if ((this.IFrames > 0 && frameCount % 10 <= 3) || (this.IFrames <= 0)) {
            if (this.IFrames > 0) {
                tint(125, 125, 125, 255)
                image(sprite, this.cursorX - 40, this.cursorY - 40);
                noTint()
            } else {
                image(sprite, this.cursorX - 40, this.cursorY - 40);
            }
        }
    }

    this.CheckBulletCollision = function (bullet) {
        if (this.IFrames > 0)
            return false;

        if (collidePointEllipse(bullet.x, bullet.y, this.cursorX + (this.width / 2), this.cursorY + (this.height / 2), this.width, this.height)) {
            this.TakeDamage();
            return true;
        } else {
            return false;
        }
    }


    this.CheckCollision = function (enemy, sprite) {
        if (this.IFrames > 0)
            return false;
        if (sprite == 2)
            this.cursorX -= this.width/2
        if (collideRectRect(enemy.position.x + 1, enemy.position.y + 1, 8, 8, this.cursorX, this.cursorY, this.width, this.height)) {
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
