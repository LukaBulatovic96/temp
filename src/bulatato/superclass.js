export class Entity {
  constructor({ position, imageAnimation, speed, hp, radius, path = null, context }) {
    this.position = position;
    this.imageAnimation = imageAnimation;
    this.speed = speed;
    this.hp = hp;
    this.radius = radius;
    this.path = path;
    this.context = context;
  }

  draw() {
     this.context.beginPath();
     this.context.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI, false);
     this.context.fillStyle = 'green';
     this.context.fill();
  }

  updatePosition() {
    if (this.path) {
      let delta_X;
      let delta_Y;
      let delta_XY;
      if (this.path.position) {
         delta_X = this.path.position.x - (this.position.x + this.radius);
         delta_Y = this.path.position.y - (this.position.y + this.radius);

      }
      if (this.path.target) {
        delta_X = this.path.target.position.x - (this.position.x + this.radius);
        delta_Y = this.path.target.position.y - (this.position.y + this.radius);
      }

      delta_XY = Math.sqrt(Math.pow(delta_X, 2) + Math.pow(delta_Y, 2));

        if (delta_X > 0) {
          this.orientation = 0;
        } else {
          this.orientation = 1;
        }

        const ratio = this.speed / delta_XY;
        if (ratio >= 1) {
          this.position.x += delta_X;
          this.position.y += delta_Y;
          this.path = null;
        } else {
          this.position.x += ratio * delta_X;
          this.position.y += ratio * delta_Y;
        }

        this.currentAction = "run";
   
     
    }
  }

  update() {
    this.updatePosition();
    this.draw();
  }
  /////
}
