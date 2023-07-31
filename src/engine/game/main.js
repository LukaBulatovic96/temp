import { renderFrame } from "../graphicalFrame/main";
import { updatePhysics } from "../physics/main";
import { PhysicalObject } from "../physics/model/physicalObject";
import { getMousePosition } from "../utils/events";

export class GameInstance {
  constructor({ initObjects, map, UI, state, context, canvas }) {
    this.objects = initObjects;
    this.map = map;
    this.UI = UI;
    this.state = state;
    this.context = context;

    this.canvas = canvas;
    this.initialize(this);
  }

  initialize(instance) {
    this.canvas.addEventListener("mousedown", function (e) {
  
      let position = getMousePosition(instance.context.canvas, e);

      let newObject = new PhysicalObject({
        graphicalObject: {
          position: { x: position.x, y: position.y },
          context: instance.context,
          assetObject: null,
          mathematicalObject: true,
          color: "red",
          radius: 50,
        },
        physicalProperty: "test",
      });
      instance.objects.push(newObject);
    });
  }

  gameTick() {
    this.frame();
    this.update();
  }

  update() {
    this.objects.forEach((object) => {
      object.radius--;
    });

    this.objects = this.objects.filter((object) => object.radius >= 5);
  }

  frame() {
    renderFrame({
      context: this.context,
      background: this.map.background,
      objects: this.objects,
    });
    updatePhysics();
  }
}
