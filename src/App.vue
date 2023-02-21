<script setup>
import { ref, onMounted } from "vue";
import { generatePerlin } from "./perlin";
import Perlin from "./Perlin.vue";
import Game2 from "./Game2.vue";
// const net= new brain.NeuralNetwork();

const routerState = ref(0);


</script>

<template>


<div class="d-flex">
  <button @click="routerState=0">PERLIN</button>
<button  @click="routerState=1">GAME 2</button>
</div>

<Perlin v-if="routerState==0"/>
<Game2 v-if="routerState==1"/>
</template>

<style>

</style>

