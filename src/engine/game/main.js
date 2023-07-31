
import { renderFrame } from "../graphicalFrame/main"; 
import {updatePhysics} from "../physics/main";

export class GameInstance{

    constructor({
        initObjects, map, UI, state,context
    }){
        this.objects = initObjects;
        this.map = map;
        this.UI = UI;
        this.state = state;
        this.context = context;

    }

    gameTick() {
        window.requestAnimationFrame(()=>this.gameTick);
        this.frame();
        this.update();
    };

    update () {

    }

    frame () {
        renderFrame({
            context: this.context,
            background: this.map.background,
            objects: this.objects,
          });
        updatePhysics();
    }





}