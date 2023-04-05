export class Entity {
  constructor({
    position,
    imageSrc,
    scale = 1,
    offset = { x: 0, y: 0 },
    context,
    radius = 16,
    width = 32,
    height = 36,
    hp = 50,
    attack,
  }) {
    this.attack = attack,
    this.path = null,
    this.position = position;
    this.width = width;
    this.height = height;
    this.radius = radius;
    this.hp = hp;
    this.currentHp = this.hp / 2;
    this.hpHeight = 6;
    this.currentFrame = 0;
    this.highlight = false;
    this.currentAction = "idle";
    this.orientation = 0;

    this.attackAnimationFlag = false;
    this.attackAnimationFrames = 5;
    this.attackAnimationCurrentFrame = 0;


    this.imageFrames = {
      run: {
        left: [],
        right: [],
      },

      idle: {
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
    //draw image
    await this.context.drawImage(
      this.currentAction == "idle"
        ? this.orientation == 0
          ? this.imageFrames.idle.right[this.currentFrame]
          : this.imageFrames.idle.left[this.currentFrame]
        : this.orientation == 0
        ? this.imageFrames.run.right[this.currentFrame]
        : this.imageFrames.run.left[this.currentFrame],
      this.position.x - this.offset.x,
      this.position.y - this.offset.y
    );

    //draw highlight
    if (this.highlight) {
      this.context.beginPath();
      this.context.arc(
        this.position.x + this.width / 2,
        this.position.y + this.height / 2,
        this.radius,
        0,
        2 * Math.PI
      );

      this.context.strokeStyle = "red";
      this.context.stroke();
    }

    //draw hp
    this.context.fillStyle = "red";
    this.context.fillRect(
      this.position.x,
      this.position.y - this.hpHeight,
      Math.floor(this.width * (this.currentHp / this.hp)),
      this.hpHeight
    );
    this.context.fillStyle = "black";
    this.context.fillRect(
      this.position.x + Math.floor(this.width * (this.currentHp / this.hp)),
      this.position.y - this.hpHeight,
      this.width - Math.floor(this.width * (this.currentHp / this.hp)),
      this.hpHeight
    );

    //draw attack

    if(this.attackAnimationFlag){
      if(this.attackAnimationCurrentFrame<this.attackAnimationFrames){
        this.context.fillStyle = "blue";
        this.context.beginPath();
        this.context.arc(this.position.x + this.width/2, this.position.y + this.height/2, Math.floor(this.attack.range * ((this.attackAnimationCurrentFrame+1) /this.attackAnimationFrames )), 0, 2 * Math.PI);
        this.context.fill();
        this.attackAnimationCurrentFrame++;
      }else{
        //end of attack
        this.attack.target.currentHp-=this.attack.damage;
        this.attackAnimationFlag=false
      }
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

  handleAttack(){
    if(this.attack){
      if(this.attack.target){
        let x1=this.position.x +this.width/2;
        let y1=this.position.y +this.height/2;

        let x2=this.attack.target.position.x +this.attack.target.width/2;
        let y2=this.attack.target.position.y +this.attack.target.height/2;

        let distance = Math.sqrt( Math.pow(x2-x1,2)+Math.pow(y2-y1,2));

        if(distance <= this.attack.range){
          this.path=null;
          let now = Date.now();
          if(now - this.attack.lastPerformed >= this.attack.attackSpeed * 1000){
           
           this.attack.lastPerformed = now;
           this.initAttackAnimation();
          }
        }
      }
    }
  }
  initAttackAnimation(){
    this.attackAnimationFlag = true;
    this.attackAnimationCurrentFrame = 0;
  }
  update() {
    this.handleAttack();
    this.draw();
    this.animateFrames();
  }
}
