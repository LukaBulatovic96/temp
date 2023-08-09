export class Hero {
    constructor({
      position,
      context,
      radius,
    }) {
      this.position = position;
      this.context = context;
      this.radius = radius;
      this.target = null;

      this.speed = 5;
    }
  
    drawCircle(offsetX, offsetY) {
      this.context.beginPath();
      this.context.arc(
        this.position.x+offsetX,
        this.position.y+offsetY,
        this.radius,
        0,
        2 * Math.PI
      );
      this.context.fillStyle = "cyan";
      this.context.fill();
    }
  
    draw(offsetX, offsetY) {
        this.drawCircle(offsetX, offsetY);
    }

    update(){
      this.move();
    }

    move(){
      if(this.target){
        let delta_X;
        let delta_Y;
        let delta_XY;

        delta_X = this.target.x - this.position.x;
        delta_Y = this.target.y - this.position.y;

        delta_XY = Math.sqrt(Math.pow(delta_X, 2) + Math.pow(delta_Y, 2));

        const ratio = this.speed / delta_XY;
        if (ratio >= 1) {
          this.position.x += delta_X;
          this.position.y += delta_Y;
          this.target = null;
        } else {
          this.position.x += ratio * delta_X;
          this.position.y += ratio * delta_Y;
        }
      }
    }


}