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
  tick();
});



const tick =async () => {
  window.requestAnimationFrame(tick);
  await gameInstance.value.gameTick();
}

const generateObjects = () => {
  const colors = [
    "#5eeb60",
    "#7ff581",
    "#4aed4c",
    "#37b839",
    "#21eb24",
    "#0acf0d",
  ];
  for (let index = 0; index < 150; index++) {
    const speed = 0;
    const color = Math.floor(Math.random() * 10);
    const radius = Math.floor(Math.random() * 10) + 3;
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
