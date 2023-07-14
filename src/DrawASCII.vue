<script setup>
import { ref, onMounted } from "vue";

const size = ref(400);
const asciiCanvas = ref(null);
const context = ref();
const imgData = ref();

const isMousePressed = ref(false);

const posX = ref(0);
const posY = ref(0);

const mouseDraw = ref(true);

const grid = ref([
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
]);

const blackChar = ref("⣿"); //● ○
const whiteChar = ref(`⠁`);

const period = () => {
  update();
  draw();
};
const draw = () => {
  context.value.clearRect(0, 0, size.value, size.value);
  imgData.value = context.value.createImageData(size.value, size.value);
  context.value.fillStyle = "black";
  context.value.fillRect(0, 0, size.value, size.value);
  // console.log("IMG DATA: ",imgData.value.data.length);

  for (let i = 0; i < grid.value.length; i++) {
    for (let j = 0; j < grid.value.length; j++) {
      context.value.fillStyle = grid.value[i][j] == 0 ? "black" : "white";
      context.value.beginPath();
      context.value.fillRect(j * 20, i * 20, 20, 20);
      context.value.stroke();
    }
  }

  // context.value.putImageData(imgData.value, 0, 0);
};
const reset = () => {
  grid.value.forEach((row, i) => {
    row.forEach((element, j) => {
      grid.value[i][j] = 0;
    });
  });
};
const update = () => {
  if (isMousePressed.value) {
    let gridX = Math.floor(posX.value / 20);
    let gridY = Math.floor(posY.value / 20);

    grid.value[gridY][gridX] = mouseDraw.value ? 1 : 0;
  }
};
const getMousePos = (canvas, evt) => {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top,
  };
};
onMounted(() => {
  context.value = asciiCanvas.value.getContext("2d");
  draw();
  setInterval(period, 16);
//   setInterval(update, 5);
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
  //   asciiCanvas.value.addEventListener(
  //     "mouseleave",
  //     function (event) {
  //       isMousePressed.value = false;
  //     },
  //     false
  //   );
});
</script>
<template lang="">
  <div class="fit-content mx-auto my-3">
    <button
      type="button"
      class="btn mx-3"
      :class="mouseDraw ? 'btn-warning' : 'btn-secondary'"
      @click="mouseDraw = true"
    >
      Draw
    </button>
    <button
      type="button"
      class="btn mx-3"
      :class="!mouseDraw ? 'btn-warning' : 'btn-secondary'"
      @click="mouseDraw = false"
    >
      Erase
    </button>
    <button type="button" class="btn btn-danger mx-3" @click="reset">
      Reset
    </button>
  </div>
  <p class="mx-auto fit-content">
    Position x: {{ posX }} y: {{ posY }} Pressed: {{ isMousePressed }}
  </p>
  <div class="mx-auto fit-content d-flex flex">
    <canvas
      ref="asciiCanvas"
      :width="size"
      :height="size"
      :style="'height:400px'"
    ></canvas>
    <div class="mx-5">
      <span class="lineheight" v-for="(row, i) in grid" :key="i"
        ><span v-for="(char, j) in row">{{
          char == 0 ? whiteChar : blackChar
        }}</span
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
