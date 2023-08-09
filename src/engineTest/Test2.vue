<script setup>
import { ref, onMounted, computed } from "vue";
import { renderFrame } from "../engine_Alpha/frameEngine/renderer";
import {GameInstance} from "../engine_Alpha/game/main";

const gameSettings = ref({
  width: 800,
  height: 600,
});

const context = ref(null);
const myCanvas = ref(null);

const gameInstance = ref();

onMounted(() => {
  context.value = myCanvas.value.getContext("2d");
  gameInstance.value = new GameInstance({
    context: context.value,
    canvas: myCanvas.value
  })
  tick();
});



const tick =async () => {
  window.requestAnimationFrame(tick);
  await gameInstance.value.gameTick();
}

</script>

<template>
  <div class="w-100">
    <div class="fit-content mx-auto">
      <canvas
        class="border border-4 border-dark"
        ref="myCanvas"
        :width="gameSettings.width"
        :height="gameSettings.height"
        tabindex='1'
      ></canvas>
    </div>
  </div>
</template>
<style lang="css">
.fit-content {
  width: fit-content;
}
</style>
