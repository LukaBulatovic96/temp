<script setup>
import { ref, onMounted } from "vue";
import { generatePerlin } from "./perlin";
// const net= new brain.NeuralNetwork();

const loading = ref(true);

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
const reset = async () => {
  loading.value=true;
  await reorderPerlin();
  loading.value=false;
};

const reorderPerlin = () => {

  

  girdBAW.value = generatePerlin(size.value,noise.value,startingDimension.value,interpolation.value);
  console.log("gridBAW: ",girdBAW.value);
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
return;
};

onMounted(async () => {
  loading.value=true;
  context.value = myCanvas.value.getContext("2d");
  contextBAW.value = myCanvasBlackAndWhite.value.getContext("2d");
  await reorderPerlin(size.value);
  loading.value=false;
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
<!-- <canvas ref="d3Canvas"  width="200" 
        height="100" 
        style="border:4px solid #000;"></canvas> -->

  <div class="container w-50">
    <div class="row my-1">
      <div class="col-sm"> <label for="">Size</label></div>
      <div class="col-sm"><input v-model="size" /></div>
    </div>
    <div class="row my-1">
      <div class="col-sm"> <label for="">Noise</label></div>
      <div class="col-sm"><input v-model="noise" /></div>
    </div>
    <div class="row my-1">
      <div class="col-sm">  <label for="">Starting Dimension</label></div>
      <div class="col-sm"><input v-model="startingDimension" /></div>
    </div>
    <div class="row my-1 ">
      <div class="col-sm">  <label for="">Interpolation</label></div>
      <div class="col-sm  ps-5">  <div :class="interpolation ? 'dot-clicked':'dot'" @click="interpolation=!interpolation"></div>
    </div>
    <div class="row my-1">
      <button @click="reset" class="btn btn-warning">RESET</button></div>
     </div>

    </div>
<div v-show="loading">  <div class="lds-ripple"><div></div><div></div></div></div>
  

  <div class="w-75 container mt-5 p-5 text-center" v-show="!loading">
    <div class="row d-flex my-3">
      <div class="col-sm  ">
        <h1>Raw Map</h1>
        <canvas ref="myCanvasBlackAndWhite" :width="size" :height="size"></canvas>
       
      </div>
      
    </div>

    <div class="row d-flex ">
      <div class="col-sm ">
        <h1>Color Map</h1>
        <canvas ref="myCanvas" :width="size" :height="size"></canvas>
      </div>
      
    </div>
     
      
  </div>
 
</template>

<style lang="css">


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


.lds-ripple {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}
.lds-ripple div {
  position: absolute;
  border: 4px solid #e40202;
  opacity: 1;
  border-radius: 50%;
  animation: lds-ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
}
.lds-ripple div:nth-child(2) {
  animation-delay: -0.5s;
}
@keyframes lds-ripple {
  0% {
    top: 36px;
    left: 36px;
    width: 0;
    height: 0;
    opacity: 0;
  }
  4.9% {
    top: 36px;
    left: 36px;
    width: 0;
    height: 0;
    opacity: 0;
  }
  5% {
    top: 36px;
    left: 36px;
    width: 0;
    height: 0;
    opacity: 1;
  }
  100% {
    top: 0px;
    left: 0px;
    width: 72px;
    height: 72px;
    opacity: 0;
  }
}

</style>

