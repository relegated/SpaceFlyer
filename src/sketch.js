let ship = new Ship(0, 0);
let enemies = [];

function setup() {
    createCanvas(1300, 900);
    background(0);
    stroke(255);
    noFill();


}

function draw() {
    if (!ship.isDead) {

        background(0);

        if (random(1) < 0.03) {
            enemies.push(new Enemy(floor(random(width))));
        }


        ship.Update(mouseX, mouseY);
        ship.Show();

        for (var i = 0; i < enemies.length; i++) {
            enemies[i].Update();
            enemies[i].Show();
            if (ship.CheckCollision(enemies[i]) === true) {
                //stroke('red');
            }
        }

        for (var i = enemies.length - 1; i > 0; i--) {
            if (enemies[i].isDead()) {
                enemies.splice(i, 1);
            }
        }
    } else {
        stroke('red');
        ship.Show();
    }

}