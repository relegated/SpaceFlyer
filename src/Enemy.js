function Enemy(x) {
    this.position = createVector(x, 0);
    this.velocity = createVector(0, 5);
    this.size = 20;
    this.isDead = false;

    this.Update = function () {
        this.position.add(this.velocity);

        if (this.position.y > height)
            this.isDead = true;
    }

    this.Show = function (sprite) {
        //rect(this.position.x, this.position.y, this.size, this.size);
        image(sprite, this.position.x - 10, this.position.y - 10);
    }

    this.CheckBulletCollision = function (bullet) {
        if (dist(this.position.x + this.size/2, this.position.y + this.size/2, bullet.x, bullet.y) <= this.size/2 + 2) {
            this.isDead = true;
            return true;
        } else {
            return false;
        }
    }
    
    this.ShootBullet = function (shipX, shipY){
        returnBullet = new Bullet(this.position.x + 7, this.position.y + 10, 0, 0, false);
        
        var angle = Math.atan2((returnBullet.y - shipY), (returnBullet.x - shipX));
        const speed = 8.5;

        returnBullet.dx = -1 * speed * Math.cos(angle);
        returnBullet.dy = -1 * speed * Math.sin(angle);        

        return returnBullet;
    }
}