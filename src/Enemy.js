function Enemy(x){
    this.position = createVector(x,0);
    this.velocity = createVector(0, 10);
    
    this.isDead = function() {
         if (this.position.y >= height){
             return true;
         } else {
             return false;
         }
        
    }

    this.Update = function() {
        this.position.add(this.velocity);
        
    }

    this.Show = function() {
        rect(this.position.x, this.position.y, 10, 10);
    }
}