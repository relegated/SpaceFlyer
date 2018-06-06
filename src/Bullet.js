function Bullet(inX, inY, indX, indY, fromShip) {
    this.x = inX;
    this.y = inY;
    this.dx = indX;
    this.dy = indY;
    this.isDead = false;
    this.isFromShip = fromShip;

    this.Update = function () {
        this.x += this.dx;
        this.y += this.dy;

        if (this.x > width || this.x < 0 || this.y > height || this.y < 0 )
            this.isDead = true;
    }


    this.Show = function () {
        ellipse(this.x, this.y, 5);

    }
}