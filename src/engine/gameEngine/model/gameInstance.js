
import { renderBE } from "../../graphicalFrameEngine/main"; 

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
        this.update();
        this.render();
    };

    update () {

    }

    render () {
        renderBE({
          context: this.context,
          background: this.map.background,
          objects: this.objects,
        });
      };



}