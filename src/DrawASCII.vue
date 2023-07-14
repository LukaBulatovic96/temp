<script setup>
import { ref, onMounted } from "vue";

const asciiCanvas = ref(null);
const context = ref();
const imgData = ref();
const loaded = ref(false);
const asciiWith = ref(30);
const asciiHeight = ref(20);
const canvasCharWidth = ref(12);
const canvasCharHeight = ref(20);
const characters = ref(["⠁", "⣿", "█", "▄", "▀", "▌", "▐", "⊙"]);
const selectedCharacter = ref(1);
const isMousePressed = ref(false);
const posX = ref(0);
const posY = ref(0);
const grid = ref([]);

const asciiWithTemp = ref(30);
const asciiHeightTemp = ref(20);
const canvasCharWidthTemp = ref(12);
const canvasCharHeightTemp = ref(20);

const period = () => {
  update();
  draw();
};
const reset = () => {
  grid.value.forEach((row, i) => {
    row.forEach((element, j) => {
      grid.value[i][j] = 0;
    });
  });
};

const draw = () => {
  context.value.clearRect(
    0,
    0,
    asciiWith.value * canvasCharWidth.value,
    asciiHeight.value * canvasCharHeight.value
  );
  imgData.value = context.value.createImageData(
    asciiWith.value * canvasCharWidth.value,
    asciiHeight.value * canvasCharHeight.value
  );
  context.value.fillStyle = "black";
  context.value.fillRect(
    0,
    0,
    asciiWith.value * canvasCharWidth.value,
    asciiHeight.value * canvasCharHeight.value
  );
  for (let i = 0; i < asciiHeight.value; i++) {
    for (let j = 0; j < asciiWith.value; j++) {
      switch (grid.value[i][j]) {
        case 0:
          context.value.fillStyle = "white";
          context.value.beginPath();
          context.value.fillRect(
            j * canvasCharWidth.value,
            i * canvasCharHeight.value,
            canvasCharWidth.value,
            canvasCharHeight.value
          );
          context.value.stroke();
          break;
        case 1:
          context.value.fillStyle = "gray";
          context.value.beginPath();
          context.value.fillRect(
            j * canvasCharWidth.value,
            i * canvasCharHeight.value,
            canvasCharWidth.value,
            canvasCharHeight.value
          );
          context.value.stroke();
          break;
        case 2:
          context.value.fillStyle = "black";
          context.value.beginPath();
          context.value.fillRect(
            j * canvasCharWidth.value,
            i * canvasCharHeight.value,
            canvasCharWidth.value,
            canvasCharHeight.value
          );
          context.value.stroke();
          break;
        case 3:
          context.value.fillStyle = "white";
          context.value.beginPath();
          context.value.fillRect(
            j * canvasCharWidth.value,
            i * canvasCharHeight.value ,
            canvasCharWidth.value,
            canvasCharHeight.value/2
          );
          context.value.stroke();  
          context.value.fillStyle = "black";
          context.value.beginPath();
          context.value.fillRect(
            j * canvasCharWidth.value,
            i * canvasCharHeight.value + canvasCharHeight.value / 2,
            canvasCharWidth.value,
            canvasCharHeight.value/2
          );
          context.value.stroke();
          break;
         case 4:
          context.value.fillStyle = "black";
          context.value.beginPath();
          context.value.fillRect(
            j * canvasCharWidth.value,
            i * canvasCharHeight.value ,
            canvasCharWidth.value,
            canvasCharHeight.value/2
          );
          context.value.stroke();  
          context.value.fillStyle = "white";
          context.value.beginPath();
          context.value.fillRect(
            j * canvasCharWidth.value,
            i * canvasCharHeight.value + canvasCharHeight.value / 2,
            canvasCharWidth.value,
            canvasCharHeight.value/2
          );
          context.value.stroke();
          break;
        case 5:
          context.value.fillStyle = "black";
          context.value.beginPath();
          context.value.fillRect(
            j * canvasCharWidth.value,
            i * canvasCharHeight.value ,
            canvasCharWidth.value/2,
            canvasCharHeight.value
          );
          context.value.stroke();  
          context.value.fillStyle = "white";
          context.value.beginPath();
          context.value.fillRect(
            j * canvasCharWidth.value+ canvasCharWidth.value / 2,
            i * canvasCharHeight.value ,
            canvasCharWidth.value/2,
            canvasCharHeight.value
          );
          context.value.stroke();
          break;
        case 6:
          context.value.fillStyle = "white";
          context.value.beginPath();
          context.value.fillRect(
            j * canvasCharWidth.value,
            i * canvasCharHeight.value ,
            canvasCharWidth.value/2,
            canvasCharHeight.value
          );
          context.value.stroke();  
          context.value.fillStyle = "black";
          context.value.beginPath();
          context.value.fillRect(
            j * canvasCharWidth.value+ canvasCharWidth.value / 2,
            i * canvasCharHeight.value ,
            canvasCharWidth.value/2,
            canvasCharHeight.value
          );
          context.value.stroke();
          break;
          case 7:
          context.value.fillStyle = "white";
          context.value.beginPath();
          context.value.fillRect(
            j * canvasCharWidth.value,
            i * canvasCharHeight.value,
            canvasCharWidth.value,
            canvasCharHeight.value
          );
          context.value.stroke();
          context.value.fillStyle = "black";
          context.value.beginPath();
          context.value.arc(j * canvasCharWidth.value + canvasCharWidth.value/2,
            i * canvasCharHeight.value+ canvasCharHeight.value/2, canvasCharWidth.value/3, 0, Math.PI*2, true);

          context.value.stroke();
          break;

        default:
          break;
      }
      //   context.value.fillStyle = grid.value[i][j] == 0 ? "black" : "white";
      //   context.value.beginPath();
      //   context.value.fillRect(j * canvasCharWidth.value, i * canvasCharHeight.value, canvasCharWidth.value, canvasCharHeight.value);
      //   context.value.stroke();
    }
  }
};
const update = () => {
  if (isMousePressed.value) {
    let gridX = Math.floor(posX.value / canvasCharWidth.value);
    let gridY = Math.floor(posY.value / canvasCharHeight.value);
    grid.value[gridY][gridX] = selectedCharacter.value;
  }
};
const getMousePos = (canvas, evt) => {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top,
  };
};

const initiate = () => {
  loaded.value = false;
  grid.value = [];
  for (let i = 0; i < asciiHeight.value; i++) {
    grid.value.push([]);
    for (let j = 0; j < asciiWith.value; j++) {
      grid.value[i].push(0);
    }
  }
  loaded.value = true;
  context.value = asciiCanvas.value.getContext("2d");
};

const apply = () => {

asciiWith.value  = asciiWithTemp.value;
asciiHeight.value  = asciiHeightTemp.value;
canvasCharWidth.value  = canvasCharWidthTemp.value;
canvasCharHeight.value  = canvasCharHeightTemp.value;

    initiate();
}
onMounted(() => {
  initiate();

  draw();
  setInterval(period, 16);
  asciiCanvas.value.addEventListener(
    "mousemove",
    function (event) {
      var mousePos = getMousePos(asciiCanvas.value, event);
      posX.value = mousePos.x;
      posY.value = mousePos.y;
    },
    false
  );
  asciiCanvas.value.addEventListener(
    "mousedown",
    function (event) {
      isMousePressed.value = true;
    },
    false
  );
  asciiCanvas.value.addEventListener(
    "mouseup",
    function (event) {
      isMousePressed.value = false;
    },
    false
  );
});
</script>
<template lang="">
<div>
    <h3 class="text-center my-3 ">Settings</h3>
    <!-- const asciiWith = ref(30);
const asciiHeight = ref(20);
const canvasCharWidth = ref(12);
const canvasCharHeight = ref(20); -->
         <div class="container w-50">
    <div class="row my-1">
      <div class="col-sm"><label for="">asciiWith</label></div>
      <div class="col-sm"><input v-model="asciiWithTemp" /></div>
    </div>
    <div class="row my-1">
      <div class="col-sm"><label for="">asciiHeight</label></div>
      <div class="col-sm"><input v-model="asciiHeightTemp" /></div>
    </div>
    <div class="row my-1">
      <div class="col-sm"><label for="">canvasCharWidth</label></div>
      <div class="col-sm"><input v-model="canvasCharWidthTemp" /></div>
    </div>
    <div class="row my-1">
      <div class="col-sm"><label for="">canvasCharHeight</label></div>
     <div class="col-sm"><input v-model="canvasCharHeightTemp" /></div>
      <div class="row my-1">
        <button @click="apply" class="btn btn-warning">APPLY</button>
      </div>
    </div>
  </div>
 
</div>
  <div class="fit-content mx-auto my-3">
    <button
      type="button"
      class="btn mx-3"
      :class="selectedCharacter == 1 ? 'btn-warning' : 'btn-secondary'"
      @click="selectedCharacter = 1"
    >
      ⣿
    </button>
    <button
      type="button"
      class="btn mx-3"
      :class="selectedCharacter == 2 ? 'btn-warning' : 'btn-secondary'"
      @click="selectedCharacter = 2"
    >
      █
    </button>
    <button
      type="button"
      class="btn mx-3"
      :class="selectedCharacter == 3 ? 'btn-warning' : 'btn-secondary'"
      @click="selectedCharacter = 3"
    >
      ▄
    </button>
    <button
      type="button"
      class="btn mx-3"
      :class="selectedCharacter == 4 ? 'btn-warning' : 'btn-secondary'"
      @click="selectedCharacter = 4"
    >
      ▀
    </button>
    <button
      type="button"
      class="btn mx-3"
      :class="selectedCharacter == 5 ? 'btn-warning' : 'btn-secondary'"
      @click="selectedCharacter = 5"
    >
      ▌
    </button>
    <button
      type="button"
      class="btn mx-3"
      :class="selectedCharacter == 6 ? 'btn-warning' : 'btn-secondary'"
      @click="selectedCharacter = 6"
    >
      ▐
    </button>
    <button
      type="button"
      class="btn mx-3"
      :class="selectedCharacter == 7 ? 'btn-warning' : 'btn-secondary'"
      @click="selectedCharacter = 7"
    >
      ⊙
    </button>
    <button
      type="button"
      class="btn mx-3"
      :class="selectedCharacter == 0 ? 'btn-warning' : 'btn-secondary'"
      @click="selectedCharacter = 0"
    >
      Erase
    </button>
    <button type="button" class="btn btn-danger mx-3" @click="reset">
      Reset
    </button>
  </div>
  <p class="mx-auto fit-content">
    Selected: {{ characters[selectedCharacter] }} ({{ selectedCharacter }})
  </p>
  <div class="mx-auto fit-content d-flex flex">
    <canvas
      class="border border-5"
      ref="asciiCanvas"
      :width="asciiWith * canvasCharWidth"
      :height="asciiHeight * canvasCharHeight"
      :style="`height: ${asciiHeight * canvasCharHeight}px; width: ${
        asciiWith * canvasCharWidth
      }px`"
    ></canvas>
    <div class="mx-5">
      <span class="lineheight" v-for="(row, i) in grid" :key="i"
        ><span v-for="(char, j) in row">{{ characters[char] }}</span
        ><br />
      </span>
    </div>
  </div>
</template>

<style scoped>
.fit-content {
  height: fit-content;
  width: fit-content;
}
/* .lineheight{
    line-height: 5px;
} */
</style>
