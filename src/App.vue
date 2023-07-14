<script setup>
import { ref, onMounted } from "vue";
import { generatePerlin } from "./perlin";
import Perlin from "./Perlin.vue";
import Game2 from "./Game2.vue";
import Bulatato from "./bulatato/BulatatoMain.vue";
import RandomWord from "./RandomWord.vue";
import DrawASCII from "./DrawASCII.vue";
// const net= new brain.NeuralNetwork();

const routerState = ref(4);


</script>

<template>
<div class="container " >

<div class="row w-100 my-5">
    <div class="col-sm d-flex justify-content-center">
      <button  type="button" class="btn  w-50" @click="routerState=0" 
      :class="routerState==0 ? 'btn-success':'btn-secondary'"
      >PERLIN</button>
    </div>
    <div class="col-sm d-flex justify-content-center">
      <button  type="button" class="btn  w-50" @click="routerState=1"  :class="routerState==1 ? 'btn-success':'btn-secondary'">Maze</button>
    </div>
    <div class="col-sm d-flex justify-content-center">
      <button type="button" class="btn  w-50"  @click="routerState=2"  :class="routerState==2 ? 'btn-success':'btn-secondary'">Game</button>
    </div>
    <div class="col-sm d-flex justify-content-center">
      <button type="button" class="btn  w-50"  @click="routerState=3"  :class="routerState==3 ? 'btn-success':'btn-secondary'">Random Word</button>
    </div>
     <div class="col-sm d-flex justify-content-center">
      <button type="button" class="btn  w-50"  @click="routerState=4"  :class="routerState==4 ? 'btn-success':'btn-secondary'">Draw Ascii</button>
    </div>
  </div>
 


</div>
<div class=" ">
<Perlin v-if="routerState==0"/>
<Game2 v-if="routerState==1"/>
<Bulatato v-if="routerState==2"/>
<RandomWord v-if="routerState==3" />
<DrawASCII v-if="routerState==4" />
</div>
</template>

<style>

</style>

