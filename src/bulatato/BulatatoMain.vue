<script setup>
import MainMenu from "./MainMenu.vue";
import GameInstance from "./GameInstance.vue";
import {ref} from "vue";

const isMenu = ref(true);
</script>

<template>
  <div class="w-80 ">
  
    <MainMenu v-if="isMenu" @enterGame="isMenu=false"/>
    <GameInstance v-else  @exitGame="isMenu=true"/>
  </div>
</template>

<style lang="css"></style>
