function PowerUp(inX, inY, indX, indY, PowerUpType) {
    this.x = inX;
    this.y = inY;
    this.dx = indX;
    this.dy = indY;
    this.isDead = false;
    this.PowerUpType = PowerUpType;
    this.size = 20;
    this.iFrames = 15;

    this.Update = function () {
        this.x += this.dx;
        this.y += this.dy;
        if (this.iFrames > 0)
            this.iFrames--;

        if (this.x > width || this.x < 0 || this.y > height || this.y < 0)
            this.isDead = true;
    }


    this.Show = function () {
        if ((this.iFrames % 3 != 0) || (this.iFrames == 0))
        ellipse(this.x, this.y, this.size);

    }

    this.CheckBulletCollision = function (bullet) {
        if (this.iFrames == 0) {
            if (dist(this.x, this.y, bullet.x, bullet.y) <= this.size / 2 + 2) {
                this.isDead = true;
                return true;
            } 
        }
        
        return false;
    }
}