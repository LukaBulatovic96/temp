<script setup>
import { ref, onMounted } from "vue";
import { generatePerlin } from "./perlin";
// const net= new brain.NeuralNetwork();

const grid = ref([]);
const size = ref(128);
const interpolation = ref(true);
const girdBAW = ref([]);
const myCanvas = ref(null);
const  myCanvasBlackAndWhite = ref(null);
const noise = ref(30);
const startingDimension = ref(2);
const context = ref();
const contextBAW = ref();
const imgData = ref();
const imgDataBAW = ref();
const d3Canvas = ref(null);
const reset = () => {
  reorderPerlin();
};

const reorderPerlin = () => {
  girdBAW.value = generatePerlin(size.value,noise.value,startingDimension.value,interpolation.value);
  grid.value = [];
  girdBAW.value.forEach((row, i) => {
    grid.value.push([]);
    row.forEach((element, j) => {
      const height = Math.floor(element / 19);
      let tempelem;
      switch (height) {
        case 0:
          tempelem = "2187ab";
          break;
        case 1:
          tempelem = "006600";
          break;
        case 2:
          tempelem = "009900";
          break;
        case 3:
          tempelem = "1aff1a";
          break;
        case 4:
          tempelem = "ace600";
          break;
        case 5:
          tempelem = "ffff33";
          break;
        case 6:
          tempelem = "ffd633";
          break;
        case 7:
          tempelem = "ff9933";
          break;
        case 8:
          tempelem = "ff8533";
          break;
        case 9:
          tempelem = "e63900";
          break;
        case 10:
          tempelem = "cc4400";
          break;
        case 11:
          tempelem = "802b00";
          break;
        case 12:
          tempelem = "ffaa80";
          break;
        case 13:
          tempelem = "ffffff";
          break;

        default:
          console.log("DEFAULT");

          break;
      }

      grid.value[i].push(tempelem);
    });
    
  });
draw();
drawBlackAndWhite();
};

onMounted(() => {
  context.value = myCanvas.value.getContext("2d");
  contextBAW.value = myCanvasBlackAndWhite.value.getContext("2d");
  reorderPerlin(size.value);
  
});

const drawBlackAndWhite = () => {
   contextBAW.value.clearRect(0, 0, size.value, size.value);
  imgDataBAW.value = contextBAW.value.createImageData(size.value, size.value);

  for (let i = 0; i < girdBAW.value.length; i ++) {
    for (let j = 0; j < girdBAW.value[i].length*4; j+=4) {
      imgDataBAW.value.data[i * size.value*4 + j + 0] = girdBAW.value[i][j/4];
      imgDataBAW.value.data[i * size.value*4 + j + 1] = girdBAW.value[i][j/4];
      imgDataBAW.value.data[i * size.value*4 + j + 2] = girdBAW.value[i][j/4];
      imgDataBAW.value.data[i * size.value*4 + j + 3] =255;
    }
  }

  contextBAW.value.putImageData(imgDataBAW.value, 0, 0);
}

const draw = () => {
  console.log("START DRAW");
  context.value.clearRect(0, 0, size.value, size.value);
  imgData.value = context.value.createImageData(size.value, size.value);

  for (let i = 0; i < grid.value.length; i ++) {
    for (let j = 0; j < grid.value[i].length*4; j+=4) {
      imgData.value.data[i * size.value*4 + j + 0] = parseInt(grid.value[i][j/4].substring(0,2),16);
      imgData.value.data[i * size.value*4 + j + 1] = parseInt(grid.value[i][j/4].substring(2,4),16);
      imgData.value.data[i * size.value*4 + j + 2] = parseInt(grid.value[i][j/4].substring(4,6),16);
      imgData.value.data[i * size.value*4 + j + 3] =255;
    }
  }

  context.value.putImageData(imgData.value, 0, 0);
  console.log("END DRAW");
};
</script>

<template>
<canvas ref="d3Canvas"  width="200" 
        height="100" 
        style="border:4px solid #000;"></canvas>
<div>
  <label for="">Size</label>
<input v-model="size" />
</div>
<div>
  <label for="">Noise</label>
<input v-model="noise" />
</div>
<div>
  <label for="">Starting Dimension</label>
<input v-model="startingDimension" />
</div>
<form>
  <label for="">Interpolation</label>
  <div :class="interpolation ? 'dot-clicked':'dot'" @click="interpolation=!interpolation">
    
  </div>

</form>

  <button @click="reset">RESET</button>
  <div>
     <canvas ref="myCanvas" :width="size" :height="size"></canvas>
      <canvas ref="myCanvasBlackAndWhite" :width="size" :height="size"></canvas>
  </div>
 
</template>

<style>
.square {
  width: 2px;
  height: 2px;
}
.flex {
  display: flex;
}

.dot {
  height: 25px;
  width: 25px;
  background-color: #bbb;
  border-radius: 50%;
  display: inline-block;
}
.dot-clicked {
   height: 25px;
  width: 25px;
  background-color: green;
  border-radius: 50%;
  display: inline-block;
}
</style>

