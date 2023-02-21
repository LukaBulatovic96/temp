<script setup>
import { ref, onMounted } from "vue";
import { map } from "./pathMap";

const gridSize = ref(10);
const gridResolution = ref(30);
const context = ref();
const imgData = ref();
const myCanvas = ref(null);
const unitRadius = ref(5);

const unit = ref({
  x: 200,
  y: 200,
  velocity:0,
  acceleration: 0,
  angle: 0,
  angleRotationSpeed: 0,
});

const draw = () => {
  context.value.clearRect(
    0,
    0,
    gridSize.value * gridResolution.value,
    gridSize.value * gridResolution.value
  );
  imgData.value = context.value.createImageData(
    gridSize.value * gridResolution.value,
    gridSize.value * gridResolution.value
  );

  draw_Map();
  draw_Unit();
  context.value.putImageData(imgData.value, 0, 0);
};
const draw_Map = () => {
  for (let i = 0; i < gridSize.value; i++) {
    for (let j = 0; j < gridSize.value; j++) {
      for (let index = 0; index < gridResolution.value; index++) {
        for (let jndex = 0; jndex < gridResolution.value; jndex++) {
          if (map[i][j] == 1) {
            imgData.value.data[
              ((i * gridResolution.value + index) *
                gridSize.value *
                gridResolution.value +
                (j * gridResolution.value + jndex)) *
                4 +
                0
            ] = parseInt("ff", 16);
            imgData.value.data[
              ((i * gridResolution.value + index) *
                gridSize.value *
                gridResolution.value +
                (j * gridResolution.value + jndex)) *
                4 +
                1
            ] = parseInt("ff", 16);
            imgData.value.data[
              ((i * gridResolution.value + index) *
                gridSize.value *
                gridResolution.value +
                (j * gridResolution.value + jndex)) *
                4 +
                2
            ] = parseInt("ff", 16);
            imgData.value.data[
              ((i * gridResolution.value + index) *
                gridSize.value *
                gridResolution.value +
                (j * gridResolution.value + jndex)) *
                4 +
                3
            ] = parseInt("ff", 16);
          } else {
            imgData.value.data[
              ((i * gridResolution.value + index) *
                gridSize.value *
                gridResolution.value +
                (j * gridResolution.value + jndex)) *
                4 +
                0
            ] = parseInt("00", 16);
            imgData.value.data[
              ((i * gridResolution.value + index) *
                gridSize.value *
                gridResolution.value +
                (j * gridResolution.value + jndex)) *
                4 +
                1
            ] = parseInt("00", 16);
            imgData.value.data[
              ((i * gridResolution.value + index) *
                gridSize.value *
                gridResolution.value +
                (j * gridResolution.value + jndex)) *
                4 +
                2
            ] = parseInt("00", 16);
            imgData.value.data[
              ((i * gridResolution.value + index) *
                gridSize.value *
                gridResolution.value +
                (j * gridResolution.value + jndex)) *
                4 +
                3
            ] = parseInt("ff", 16);
          }
        }
      }
    }
  }
};
const getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
};
const checkCollision = (i, j) => {
  imgData.value = context.value.createImageData(
    gridSize.value * gridResolution.value,
    gridSize.value * gridResolution.value
  );
  for (
    let offSet_i = -unitRadius.value;
    offSet_i < unitRadius.value;
    offSet_i++
  ) {
    for (
      let offSet_j = -unitRadius.value;
      offSet_j < unitRadius.value;
      offSet_j++
    ) {
      if (
        offSet_i * offSet_i + offSet_j * offSet_j <=
        unitRadius.value * unitRadius.value
      ) {
        if (
          map[Math.floor((i + offSet_i) / gridResolution.value)][
            Math.floor((j + offSet_j) / gridResolution.value)
          ] == 0
        ) {
          return false;
        }
      }
    }
  }
  return true;
};

const draw_Unit = () => {
  for (let i = -unitRadius.value; i < unitRadius.value; i++) {
    for (let j = -unitRadius.value; j < unitRadius.value; j++) {
      if (i * i + j * j <= unitRadius.value * unitRadius.value) {
        imgData.value.data[
          ((Math.round(unit.value.y) + i) * gridSize.value * gridResolution.value +
            Math.round(unit.value.x) +
            j) *
            4 +
            0
        ] = parseInt("ff", 16);
        imgData.value.data[
          ((Math.round(unit.value.y) + i) * gridSize.value * gridResolution.value +
            Math.round(unit.value.x) +
            j) *
            4 +
            1
        ] = parseInt("00", 16);
        imgData.value.data[
          ((Math.round(unit.value.y) + i) * gridSize.value * gridResolution.value +
            Math.round(unit.value.x) +
            j) *
            4 +
            2
        ] = parseInt("00", 16);
        imgData.value.data[
          ((Math.round(unit.value.y) + i) * gridSize.value * gridResolution.value +
            Math.round(unit.value.x) +
            j) *
            4 +
            3
        ] = parseInt("ff", 16);
      }
    }
  }
};

const updateUnit = () => {
  unit.value.velocity += unit.value.acceleration;
  unit.value.angle += unit.value.angleRotationSpeed;

  unit.value.x = unit.value.x + unit.value.velocity * Math.cos(unit.value.angle);
  unit.value.y = unit.value.y+ unit.value.velocity * Math.sin(unit.value.angle);
};

const period = () => {
  updateUnit();
  draw();
};

const handleKeyDown = (event) => {
  if(event.key=='a'){
    unit.value.angle -= 0.1;
  }
  if(event.key=='d'){
    unit.value.angle += 0.1;
  }
  if(event.key=='w'){
    unit.value.velocity += 0.1;
  }
  if(event.key=='s'){
    unit.value.velocity -= 0.1;
  }
  
console.log("KEYDOWN: ",event.key);
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
  context.value = myCanvas.value.getContext("2d");
  setInterval(period, 16);
});
</script>
<template>
  <div>
    <canvas
      style="border: 4px solid #000"
      ref="myCanvas"
      :width="gridSize * gridResolution"
      :height="gridSize * gridResolution"
    ></canvas>
  </div>
</template>
