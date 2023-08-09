import { Unit } from "../model/unit";
import { Resource } from "../model/resource";
import { Building } from "../model/building";
import { Hero } from "../model/hero";
import { renderFrame } from "../frameEngine/renderer";
import { getMousePosition } from "../utils/events";

export class GameInstance {
  buildings = [];
  units = [];
  resources = [];
  UIs = [{
    position:{ x: 15,y:500},
    width:100,
    height:90
  }
  ];
  hero = null;

  map = {
    width: 3000,
    height: 3000,
    window: {
      position: {
        x: 100,
        y: 100,
      },
      width: 800,
      height: 600,
    },
  };

  constructor({ context, canvas }) {
   
    this.context = context;
    this.canvas = canvas;

    this.map.tile = {
      image: new Image(),
      tileSizeX: 32,
      tileSizeY: 32,
    };
    this.map.tile.image.src = "https://i.ibb.co/dfWQTQF/floor-1.png";
    this.hero=new Hero({
        position: { x: 600, y: 400 },
        context: this.context,
        radius: 20,
      });
    this.mockInit();
    this.initialize(this);
  }

  handleKeyDown = (event) => {
    if (event.key == "w") {
      if (this.map.window.position.y >= 10) this.map.window.position.y -= 10;
      else {
        this.map.window.position.y = 0;
      }
    }
    if (event.key == "s") {
      this.map.window.position.y += 10;
    }
    if (event.key == "a") {
      if (this.map.window.position.x >= 10) this.map.window.position.x -= 10;
      else {
        this.map.window.position.x = 0;
      }
    }
    if (event.key == "d") {
      this.map.window.position.x += 10;
    }

    console.log("KEYDOWN: ", event.key);
  };

  initialize(instance) {
    this.canvas.oncontextmenu = function (e) {
      e.preventDefault();
  };
    this.canvas.addEventListener("keydown", async function (e) {
      instance.handleKeyDown(e);
    });
    this.canvas.addEventListener("keyup", async function (e) {
      console.log("RELEASED: ",e);
    });
    this.canvas.addEventListener("mousedown", async function (e) {
      let position = getMousePosition(instance.context.canvas, e);

      if (position.button == 2) {
        instance.hero.target={x:position.x+instance.map.window.position.x,
        y:position.y+instance.map.window.position.y}
      } 
   
    });
  }

  async gameTick() {
    try {
      this.frame();
      await this.update();
    } catch (error) {
      console.log("cannot perform tick: ", error);
    }
  }

  async update() {
    this.hero.update();
  }
  calcDistance(x1, y1, x2, y2) {
    return Math.pow((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1), 1 / 2);
  }
  frame() {
    renderFrame({
      context: this.context,
      map: this.map,
      objects: [...this.resources, ...this.buildings, ...this.units, ...[this.hero]],
      UIs: this.UIs
    });
  }

  mockInit() {
    this.units.push(
      new Unit({
        position: { x: 400, y: 200 },
        context: this.context,
        radius: 15,
      })
    );
    this.buildings.push(
      new Building({
        position: { x: 50, y: 50 },
        context: this.context,
        size: { width: 40, height: 80 },
      })
    );
    this.resources.push(
      new Resource({
        position: { x: 600, y: 77 },
        context: this.context,
        radius: 5,
      })
    );
    this.resources.push(
      new Resource({
        position: { x: 300, y: 300 },
        context: this.context,
        radius: 5,
      })
    );
  }
}
