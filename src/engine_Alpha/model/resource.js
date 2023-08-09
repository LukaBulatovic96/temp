export class Resource {
    constructor({
      position,
      context,
      radius,
    }) {
      this.position = position;
      this.context = context;
      this.radius = radius;
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
      this.context.fillStyle = "yellow";
      this.context.fill();
    }
  
    draw(offsetX, offsetY) {
      this.drawCircle(offsetX, offsetY);
  }
}