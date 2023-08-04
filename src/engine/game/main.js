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

    this.colorShades = [
      "#ffffff",
      "#fff2f2",
      "#ffe6e6",
      "#ffdbdb",
      "#ffd0d0",
      "#ffc4c4",
      "#ffb9b9",
      "#ffadad",
      "#ffa2a2",
      "#ff9696",
      "#ff8b8b",
      "#ff8080",
      "#ff7474",
      "#ff6969",
      "#ff5d5d",
      "#ff5252",
      "#ff4747",
      "#ff3b3b",
      "#ff3030",
      "#ff2424",
      "#ff1919",
      "#ff0d0d",
      "#ff0202",
      "#ff0000",
      "#f20000",
      "#e60000",
      "#db0000",
      "#d00000",
      "#c40000",
      "#b90000",
      "#ad0000",
    ];

    console.log("SHADE COUNT: ", this.colorShades.length);
    this.canvas = canvas;
    this.initialize(this);
  }

  initialize(instance) {
    this.canvas.addEventListener("mousedown", async function (e) {
      let position = getMousePosition(instance.context.canvas, e);

      if (position.button == 0) {
        let newObject = new GameObject({
          gameProperties: {
            eaten: 0,
            shade: 0,
          },
          physics: {
            graphicalObject: {
              position: { x: position.x, y: position.y },
              context: instance.context,
              assetObject: null,
              mathematicalObject: true,
              color: "#ffffff",
              radius: 20,
            },
            physicalProperty: {
              speed: 5,
              target: {
                x: null,
                y: null,
                object: null,
              },
            },
          },
        });
        instance.herbEaters.push(newObject);
      }
      if (position.button == 1) {
        await instance.resetGame();
      }
    });
  }

  async resetGame() {
    this.herbEaters = [];
    this.plants = this.initialPlants;
  }

  async gameTick() {
    try {
      this.frame();
      await this.update();
      await this.wigglePlant();
    } catch (error) {
      console.log("cannot perform tick: ", error);
      this.resetGame();
    }
  }

  async update() {
    this.plants = this.plants.filter((plant) => plant.delete == null);
    this.herbEaters = this.herbEaters.filter((herbeater) => herbeater.delete == null);
    await this.findHerbPaths();
    await this.moveEater();
    await this.eaterCollision();
  }

  async wigglePlant() {
    this.plants.forEach((plant) => {
      const wiggleDirection = Math.floor(Math.random() * 4);
      const wiggleSpeed = Math.floor(Math.random() * 3);
      switch (wiggleDirection) {
        case 0:
          plant.position.y -= wiggleSpeed;
          break;
        case 1:
          plant.position.y += wiggleSpeed;
          break;
        case 2:
          plant.position.x += wiggleSpeed;
          break;
        case 3:
          plant.position.x -= wiggleSpeed;
          break;

        default:
          break;
      }
      if (plant.position.x < plant.radius) plant.position.x = plant.radius;
      if (plant.position.y < plant.radius) plant.position.y = plant.radius;

      if (plant.position.x > 900 - plant.radius)
        plant.position.x = 900 - plant.radius;
      if (plant.position.y > 700 - plant.radius)
        plant.position.y = 700 - plant.radius;
    });
  }

  async eaterCollision(){
    this.herbEaters.forEach((herbEater1,i) => {
      this.herbEaters.forEach((herbEater2,j) => {
          if(i!=j){
            let currDistance = this.calcDistance(
              herbEater1.position.x,
              herbEater1.position.y,
              herbEater2.position.x,
              herbEater2.position.y,
            );
            if(currDistance < (herbEater1.radius + herbEater2.radius)/2){
              //1 eats 2
              if(herbEater1.radius >= herbEater2.radius){
                herbEater1.radius += Math.sqrt(herbEater2.radius);
                herbEater2.delete=true
                if (herbEater1.gameProperties.shade < 29) {
                  herbEater1.gameProperties.shade++;
                  herbEater1.color =
                    this.colorShades[herbEater1.gameProperties.shade];
                }
              }//2 eats 1
              else{
                herbEater2.radius += Math.sqrt(herbEater1.radius);
                herbEater1.delete=true
                if (herbEater2.gameProperties.shade < 28) {
                  herbEater2.gameProperties.shade+=2;
                  herbEater2.color =
                    this.colorShades[herbEater2.gameProperties.shade];
                }
              }
            }
          }
        })})}
  async findHerbPaths() {
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
      if (target != null) {
        herbEater.physicalProperty.target.x = target.position.x;
        herbEater.physicalProperty.target.y = target.position.y;
      }
    });
  }

  calcDistance(x1, y1, x2, y2) {
    return Math.pow((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1), 1 / 2);
  }

  async moveEater() {
    this.herbEaters.forEach(async (herbEater) => {
      if (herbEater.physicalProperty.target.object != null) {
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
          herbEater.gameProperties.eaten++;

          if (
            herbEater.gameProperties.eaten == 5 ||
            herbEater.gameProperties.eaten == 10 ||
            herbEater.gameProperties.eaten == 15
          ) {
            if (herbEater.gameProperties.shade < 29) {
              herbEater.gameProperties.shade++;
              herbEater.color =
                this.colorShades[herbEater.gameProperties.shade];
            }
          }

          if (herbEater.gameProperties.eaten >= 15) {
            herbEater.radius++;
            herbEater.gameProperties.eaten = 0;
          }

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
