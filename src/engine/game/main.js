import { renderFrame } from "../graphicalFrame/main";
import { updatePhysics } from "../physics/main";
import { GameObject } from "./model/gameObject";
import { getMousePosition } from "../utils/events";

export class GameInstance {
  constructor({ initObjects, map, UI, state, context, canvas }) {
    this.plants = initObjects;
    this.map = map;
    this.UI = UI;
    this.state = state;
    this.context = context;

    this.herbEaters = [];
    this.predators = [];

    this.initialPlants = initObjects;

    this.canvas = canvas;
    this.initialize(this);
  }

  initialize(instance) {
    this.canvas.addEventListener("mousedown", function (e) {
      let position = getMousePosition(instance.context.canvas, e);

      let newObject = new GameObject({
        gameProperties: "herbEater",
        physics: {
          graphicalObject: {
            position: { x: position.x, y: position.y },
            context: instance.context,
            assetObject: null,
            mathematicalObject: true,
            color: "red",
            radius: 20,
          },
          physicalProperty: {
            speed: 15,
            target: {
              x: null,
              y: null,
              object: null,
            },
          },
        },
      });
      instance.herbEaters.push(newObject);
    });
  }

  resetGame(){
    this.herbEaters = []
  }

  async gameTick() {
    try {
      this.frame();
      await this.update();
    } catch (error) {
      console.log("cannot perform tick: ",error);
      this.resetGame()
    }
   
  }

  async update() {
    this.plants = this.plants.filter((plant) => plant.delete == null);
    await this.findHerbPaths();
    await this.move();
  }
  findHerbPaths() {
    this.herbEaters.forEach((herbEater) => {
      let minDistance = 1500;
      let target = null;
      this.plants.forEach((plant) => {
        let currDistance = this.calcDistance(
          herbEater.position.x,
          herbEater.position.y,
          plant.position.x,
          plant.position.y
        );

        if (minDistance > currDistance) {
          minDistance = currDistance;
          target = plant;
        }
      });
      herbEater.physicalProperty.target.object = target;
      if(target !=null){
        herbEater.physicalProperty.target.x = target.position.x;
        herbEater.physicalProperty.target.y = target.position.y;
      }
      
    });
  }

  calcDistance(x1, y1, x2, y2) {
    return Math.pow((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1), 1 / 2);
  }

  async move() {
    this.herbEaters.forEach(async (herbEater) => {
      if (herbEater.physicalProperty.target.object !=null) {
        let delta_X;
        let delta_Y;
        let delta_XY;

        delta_X = herbEater.physicalProperty.target.x - herbEater.position.x;
        delta_Y = herbEater.physicalProperty.target.y - herbEater.position.y;

        delta_XY = Math.sqrt(Math.pow(delta_X, 2) + Math.pow(delta_Y, 2));

        const ratio = herbEater.physicalProperty.speed / delta_XY;
        if (ratio >= 1) {
          herbEater.position.x += delta_X;
          herbEater.position.y += delta_Y;
            herbEater.physicalProperty.target.object.delete = true;
            herbEater.physicalProperty.target.object = null;

          // herbEater.radius++;
        } else {
          herbEater.position.x += ratio * delta_X;
          herbEater.position.y += ratio * delta_Y;
        }
      }
    });
  }

  frame() {
    renderFrame({
      context: this.context,
      background: this.map.background,
      objects: [...this.plants, ...this.herbEaters, ...this.predators],
    });
    updatePhysics();
  }
}
