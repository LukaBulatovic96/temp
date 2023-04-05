export class Entity {
  constructor({
    position,
    imageSrc,
    scale = 1,
    offset = { x: 0, y: 0 },
    context,
    radius=16,
    width=32,
    height=36
  }) {
    this.position = position;
    this.width = width;
    this.height = height;
    this.radius = radius;
    this.currentFrame = 0;
    this.highlight = false;
    this.currentAction = "idle";
    this.orientation =0;
    this.imageFrames = {
      run: 
        {
          left: [],
          right: [],
        },
  
      idle:  {
        left: [],
        right: [],
      },
    };
    for (let index = 0; index < imageSrc.idle.left.length; index++) {
      let image = new Image();
      image.src = imageSrc.idle.left[index];
      this.imageFrames.idle.left.push(image);
         image = new Image();
      image.src = imageSrc.idle.right[index];
      this.imageFrames.idle.right.push(image);
    }
    for (let index = 0; index < imageSrc.run.left.length; index++) {

      let image = new Image();
      image.src = imageSrc.run.left[index];
      this.imageFrames.run.left.push(image);
         image = new Image();
      image.src = imageSrc.run.right[index];
      this.imageFrames.run.right.push(image);
    }

    // this.image = new Image()
    // this.image.src = imageSrc

    this.scale = scale;
    this.framesCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = 8;

    (this.offset = offset), (this.context = context);
    this.speed = 3;
  }

  async draw() {

   

    await this.context.drawImage(
      this.currentAction == "idle"
        ? (this.orientation ==0 ?this.imageFrames.idle.right[this.currentFrame]:this.imageFrames.idle.left[this.currentFrame])
        : (this.orientation ==0 ?this.imageFrames.run.right[this.currentFrame]:this.imageFrames.run.left[this.currentFrame]),
      this.position.x - this.offset.x,
      this.position.y - this.offset.y
    );

    if(this.highlight){
        this.context.beginPath();
        this.context.arc(this.position.x+this.width/2, this.position.y+this.height/2, this.radius, 0, 2 * Math.PI);
        
        this.context.strokeStyle  = "red";
        this.context.stroke();
    }

    
    
  }

  animateFrames() {
    this.framesElapsed++;

    // this.currentFrame =this.currentFrame == 3 ? this.currentFrame = 0 : this.currentFrame+1;
    if (this.framesElapsed % this.framesHold === 0) {
      if (
        this.currentFrame <
        (this.currentAction == "idle"
          ? this.imageFrames.idle.left.length
          : this.imageFrames.run.left.length) -
          1
      ) {
        this.currentFrame++;
      } else {
        this.currentFrame = 0;
      }
    }
  }

  update() {
    this.draw();
    this.animateFrames();
  }
}
