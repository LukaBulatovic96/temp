<script setup>
import { onMounted, ref } from "vue";
import { Entity } from "./superclass";
import { Map } from "./map";

const emit = defineEmits(["exitGame"]);
const exitgame = () => {
  emit("exitGame");
};
const gameSettings = ref({
  width: 600,
  height: 300,
});

const context = ref(null);
const myCanvas = ref(null);
const audio = ref();

const floorSrc = ref("https://i.ibb.co/dfWQTQF/floor-1.png");

const round = ref(0);
const isShopOpen = ref(true);
const backGround_imageData = ref();
const player_imageData = ref();
const enemy_imageData = ref();
const path = ref(null);
const mainDiv = ref(null);
const cash = ref(1000);

const map = ref();

const mouseOver_selection = ref(null);

const buttonPressed = ref(-1);

const audioHandle = () => {
  audio.value.play();
  // if(audio.value.paused)audio.value.play();
  // else audio.value.pause();
};

const spellImage = ref();
const spellSrc = ref("https://i.ibb.co/ZcXYRst/16-sunburn-spritesheet.png");
const spell = ref({
  exists: false,
  position: {
    x: 0,
    y: 0,
  },
});
const xFrame = ref(0);
const yFrame = ref(0);

onMounted(() => {
  context.value = myCanvas.value.getContext("2d");

  map.value = new Map({
    imageSrc: floorSrc.value,
    imageSize: 16,
    width: gameSettings.value.width,
    height: gameSettings.value.height,
    context: context.value,
  });

  myCanvas.value.addEventListener("mousedown", function (e) {
    // let position = getMousePosition(myCanvas.value, e);
    // buttonPressed.value = position.button;
    // if (position.button == 2) {
    //   cast();
    //   initializePath(position.x, position.y);
    //   entity.value.attack.target = mouseOver_selection.value;
    // }
  });
  myCanvas.value.addEventListener("mousemove", function (e) {
    // let position = getMousePosition(myCanvas.value, e);
    // checkCollisionAllEntities(position.x, position.y);
  });

  mainDiv.value.addEventListener("contextmenu", (event) => {
    event.preventDefault();
  });
  //   initBackground();
  render();
});

const checkCollisionAllEntities = (x, y) => {};

const render = () => {
  window.requestAnimationFrame(render);
  drawBackground();

};

const getMousePosition = (canvas, event) => {
  let rect = canvas.getBoundingClientRect();
  let x = event.clientX - rect.left;
  let y = event.clientY - rect.top;
  //   player.value.position.y = y;
  //   player.value.position.x =x;
  return { x: x, y: y, button: event.button };
};

const drawBackground = () => {
  map.value.update();
};

const initBackground = () => {
  backGround_imageData.value = context.value.createImageData(
    gameSettings.value.width,
    gameSettings.value.height
  );

  for (let i = 0; i < gameSettings.value.height; i++) {
    for (let j = 0; j < gameSettings.value.width * 4; j += 4) {
      backGround_imageData.value.data[
        i * gameSettings.value.width * 4 + j + 0
      ] = 0;
      backGround_imageData.value.data[
        i * gameSettings.value.width * 4 + j + 1
      ] = 0;
      backGround_imageData.value.data[
        i * gameSettings.value.width * 4 + j + 2
      ] = 0;
      backGround_imageData.value.data[
        i * gameSettings.value.width * 4 + j + 3
      ] = 255;
    }
  }
};

const doObjectsCollide = (unit1, unit2) => {
  let distance = Math.sqrt(
    Math.pow(
      unit1.position.x + unit1.width / 2 - unit2.position.x - unit2.width / 2,
      2
    ) +
      Math.pow(
        unit1.position.y +
          unit1.height / 2 -
          unit2.position.y -
          unit2.height / 2,
        2
      )
  );

  if (distance <= unit1.radius + unit2.radius) {
    return true;
  } else {
    return false;
  }
};
</script>

<template>
  <div class="container" ref="mainDiv">
    <audio hidden="true" ref="audio">
      <source src="../assets/sound/Minimalist4.mp3" type="audio/mpeg" />
    </audio>
    <div class="row w-100 mb-3">
      <div class="col-sm text-center">Game</div>
      <div class="col-sm text-center">Round: {{ 0 }}</div>
      <div
        class="col-sm text-center cursor-pointer btn btn-warning"
        @click="exitgame"
      >
        Back to Menu
      </div>
    </div>

    <div class="row w-100 text-center cursor-custom">
      <div>
        <canvas
          ref="myCanvas"
          :width="gameSettings.width"
          :height="gameSettings.height"
        ></canvas>
      </div>
    </div>
    <div class="row w-100 bg-info text-center p-5">
      <div class="col-sm fw-bold" @click="audioHandle()">SHOP</div>
      <div class="col-sm text-center">CASH: {{ cash }}$</div>

      <div class="col-sm text-center">
        Speed: {{ entity ? entity.speed : "No entity" }}
      </div>
      <div
        class="col-sm text-center btn btn-success cursor-pointer"
        @click="increaseSpeed()"
        :class="cash < 10 ? ' disabled ' : ''"
      >
        ++ (10$)
      </div>

      <div class="col-sm text-center">
        Damage: {{ entity ? entity.attack.damage : "No entity" }}
      </div>
      <div
        class="col-sm text-center btn btn-success cursor-pointer"
        @click="incAttack()"
        :class="cash < 10 ? ' disabled ' : ''"
      >
        ++ (10$)
      </div>

      <div class="col-sm text-center">
        Attack Speed: {{ entity ? entity.attack.attackSpeed : "No entity" }}
      </div>
      <div
        class="col-sm text-center btn btn-success cursor-pointer"
        @click="incAttackSpeed()"
        :class="cash < 10 ? ' disabled ' : ''"
      >
        ++ (10$)
      </div>

      <div class="col-sm text-center">HP</div>
      <div
        class="col-sm text-center btn btn-success cursor-pointer"
        :class="false ? ' disabled ' : ''"
        @click="manageHP(5)"
      >
        ++ (2$)
      </div>
      <div
        class="col-sm text-center btn btn-success cursor-pointer"
        :class="false ? ' disabled ' : ''"
        @click="manageHP(-5)"
      >
        -- (2$)
      </div>
    </div>
  </div>
</template>

<style lang="css">
body {
  cursor: url("https://i.ibb.co/n10MnYv/output-onlinepngtools-11.png"), auto;
}
</style>
