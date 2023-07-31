export class GraphicalObject {
  constructor({
    position,
    context,
    assetObject,
    mathematicalObject,
    radius,
    offset = { x: 0, y: 0 },
    color,
  }) {
    this.position = position;
    this.context = context;
    this.mathematicalObject = mathematicalObject;
    this.assetObject = assetObject;
    this.radius = radius;
    this.offset = offset;
    this.color = color;
  }

  drawCircle() {
    this.context.beginPath();
    this.context.arc(
      this.position.x,
      this.position.y,
      this.radius,
      0,
      2 * Math.PI
    );
    this.context.fillStyle = this.color;
    this.context.fill();
  }

  draw() {
    if (this.assetObject == null) {
      this.drawCircle();
    }
  }
}
