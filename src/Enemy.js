function Enemy(x) {
    this.position = createVector(x, 0);
    this.velocity = createVector(0, 10);
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
        if (dist(this.position.x + this.size/2, this.position.y + this.size/2, bullet.x, bullet.y) <= this.size/2) {
            this.isDead = true;
            return true;
        } else {
            return false;
        }
    }
}