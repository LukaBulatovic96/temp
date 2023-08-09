export class Building {
    constructor({
      position,
      context,
      size,
    }) {
      this.position = position;
      this.context = context;
      this.size = size;
    }
  
    drawRect(offsetX, offsetY) {
      this.context.beginPath();
      this.context.rect(
        this.position.x - this.size.width/2 + offsetX,
        this.position.y- this.size.height/2 +offsetY,
        this.size.width,
        this.size.height
      );
      this.context.fillStyle = "red";
      this.context.fill();
    }
  
    draw(offsetX, offsetY) {
        this.drawRect(offsetX, offsetY);
    }
}