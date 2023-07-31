<script setup>
import { ref, onMounted, computed } from "vue";
import { renderFrame } from "../engine/graphicalFrame/main";
import { GraphicalObject } from "../engine/graphicalFrame/model/object";
import {PhysicalObject} from "../engine/physics/model/physicalObject";
import {GameInstance} from "../engine/game/main";

const gameSettings = ref({
  width: 900,
  height: 700,
});

const context = ref(null);
const myCanvas = ref(null);

const tileSrc = ref("https://i.ibb.co/dfWQTQF/floor-1.png");
const background = ref({
  tile: new Image(),
  tileCountX: Math.ceil(gameSettings.value.width / 16),
  tileCountY: Math.ceil(gameSettings.value.height / 16),
  tileSizeX: 16,
  tileSizeY: 16,
});

const objects = ref([]);
const gameInstance = ref();

onMounted(() => {
  context.value = myCanvas.value.getContext("2d");
  background.value.tile.src = tileSrc.value;
  generateObjects();
  gameInstance.value = new GameInstance({
    initObjects:objects.value,
    map: { background: background.value},
    context: context.value,
    canvas: myCanvas.value
  })
  
  // gameInstance.value.gameTick();
  // gameTick();
  tick();
});



const tick =() => {
  window.requestAnimationFrame(tick);
  gameInstance.value.gameTick();
}

const flags = ref([]);
const generateObjects = () => {
  const colors = [
    "#2391cc",
    "#167fb8",
    "#0b6ca1",
    "#06517a",
    "#46067a",
    "#5e0ba1",
    "#7816c7",
    "#a80d2f",
    "#22c75e",
    "#128a3d",
  ];
  for (let index = 0; index < 50; index++) {
    const speed = Math.floor(Math.random() * 20) + 8;
    flags.value.push({ dierction: true, speed: speed });
    const color = Math.floor(Math.random() * 10);
    const radius = Math.floor(Math.random() * 50) + 5;
    const posX = Math.floor(Math.random() *( gameSettings.value.width-radius*2)) + radius;
    const posY = Math.floor(Math.random() *( gameSettings.value.height-radius*2)) + radius;
    
    const tempObject = new PhysicalObject({graphicalObject:{
      position: { x: posX, y: posY },
      context: context.value,
      assetObject: null,
      mathematicalObject: true,
      color: colors[color],
      radius: radius,
    },
    physicalProperty:'test'
});
    objects.value.push(tempObject);
  }
};

const render = () => {
  renderFrame({
    context: context.value,
    background: background.value,
    objects: objects.value,
  });
};

const update = () => {
    const maxRAD = 100;
    const minRAD = 5
  objects.value.forEach((object, i) => {
    if (flags.value[i].dierction) {
      object.position.x += flags.value[i].speed;
      if(object.radius<maxRAD) object.radius++;
      if (object.position.x > 900 - object.radius) {
        flags.value[i].dierction = false;
      }
    } else {
      object.position.x -= flags.value[i].speed;
      if(object.radius>minRAD) object.radius--;
      if (object.position.x < object.radius) flags.value[i].dierction = true;
    }
  });
};

const gameTick = () => {
  window.requestAnimationFrame(gameTick);
  update();
  render();
};
</script>

<template>
  <div class="w-100">
    <div class="fit-content mx-auto">
      <canvas
        class="border border-4 border-dark"
        ref="myCanvas"
        :width="gameSettings.width"
        :height="gameSettings.height"
      ></canvas>
    </div>
  </div>
</template>
<style lang="css">
.fit-content {
  width: fit-content;
}
</style>
