export class Map {
  constructor({
    position = { x: 0, y: 0 },
    imageSrc,
    imageSize,
    width,
    height,
    context,
  }) {
    this.position = position;
    this.width = width;
    this.height = height;
    this.context = context;
    this.image = new Image();
    this.image.src = imageSrc;
    this.imageSize = imageSize;

    this.tileCountX = Math.ceil(this.width / this.imageSize);
    this.tileCountY = Math.ceil(this.height / this.imageSize);
  }

  draw() {
    for (let i = 0; i < this.tileCountY; i++) {
      for (let j = 0; j < this.tileCountX; j++) {
        this.context.drawImage(
          this.image,
          this.imageSize * j,
          this.imageSize * i
        );
      }
    }
  }

  update() {
    this.draw();
  }
}
