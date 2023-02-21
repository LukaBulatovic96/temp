<script setup>
import { ref, onMounted } from "vue";
import { map } from "./pathMap";

const gridSize = ref(10);
const gridResolution = ref(30);
const context = ref();
const imgData = ref();
const myCanvas = ref(null);
const unitRadius = ref(3);

const unit = ref();
const physical_Unit = ref();

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

  for (let i = -unitRadius.value; i < unitRadius.value; i++) {
    for (let j = -unitRadius.value; j < unitRadius.value; j++) {
      if (i * i + j * j <= unitRadius.value * unitRadius.value) {
        imgData.value.data[
          ((unit.value[0] + i) * gridSize.value * gridResolution.value +
            unit.value[1] +
            j) *
            4 +
            0
        ] = parseInt("ff", 16);
        imgData.value.data[
          ((unit.value[0] + i) * gridSize.value * gridResolution.value +
            unit.value[1] +
            j) *
            4 +
            1
        ] = parseInt("00", 16);
        imgData.value.data[
          ((unit.value[0] + i) * gridSize.value * gridResolution.value +
            unit.value[1] +
            j) *
            4 +
            2
        ] = parseInt("00", 16);
        imgData.value.data[
          ((unit.value[0] + i) * gridSize.value * gridResolution.value +
            unit.value[1] +
            j) *
            4 +
            3
        ] = parseInt("ff", 16);

    ////////////////////////////////////////////////////
        imgData.value.data[
          ((physical_Unit.value[0] + i) * gridSize.value * gridResolution.value +
            physical_Unit.value[1] +
            j) *
            4 +
            0
        ] = parseInt("00", 16);
        imgData.value.data[
          ((physical_Unit.value[0] + i) * gridSize.value * gridResolution.value +
            physical_Unit.value[1] +
            j) *
            4 +
            1
        ] = parseInt("00", 16);
        imgData.value.data[
          ((physical_Unit.value[0] + i) * gridSize.value * gridResolution.value +
            physical_Unit.value[1] +
            j) *
            4 +
            2
        ] = parseInt("ff", 16);
        imgData.value.data[
          ((physical_Unit.value[0] + i) * gridSize.value * gridResolution.value +
            physical_Unit.value[1] +
            j) *
            4 +
            3
        ] = parseInt("ff", 16);
      }
    }
  }

  context.value.putImageData(imgData.value, 0, 0);
};

const getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
};

const checkCollision = (i,j) => {
     imgData.value = context.value.createImageData(
    gridSize.value * gridResolution.value,
    gridSize.value * gridResolution.value
  );
    for (let offSet_i = -unitRadius.value; offSet_i < unitRadius.value; offSet_i++) {
        for (let offSet_j = -unitRadius.value; offSet_j < unitRadius.value; offSet_j++) {
            if(offSet_i * offSet_i + offSet_j * offSet_j <= unitRadius.value * unitRadius.value){
                if( map[Math.floor((i+offSet_i)/gridResolution.value)][Math.floor((j+offSet_j)/gridResolution.value)]==0){
                    return false
                }
            }
    }
    }
    return true;
}

const moveUnit = () => {
  const rememberedUnit = JSON.parse(JSON.stringify(unit.value));
  let i=0;
  while (i<100) {
    unit.value = JSON.parse(JSON.stringify(rememberedUnit));
    unit.value[0] += getRandomInt(15) - 4;
    unit.value[1] += getRandomInt(15) - 4;

    if(unit.value[0] <= unitRadius.value ){
    unit.value[0] = unitRadius.value*2
  }
   if(unit.value[1] <= unitRadius.value ){
    unit.value[1] = unitRadius.value*2
  }
    //CHECK COLLISION
    if (checkCollision( unit.value[0], unit.value[1])) {
        console.log("HIT: ",i);
        i=100;
    }
    i++;
  }
  
};

const period = () => {
  moveUnit()
  draw();
};

onMounted(() => {
  unit.value = [20, 20];
  physical_Unit.value = [10,10];
  context.value = myCanvas.value.getContext("2d");
//   period();
  setInterval(period, 5);
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
