<script setup>
import {ref} from "vue";

const emit = defineEmits("enterGame");

const entergame = () => {
    emit("enterGame");
}
</script>

<template >
      <div class="container w-50 bg-info rounded-2 p-3">
        <div class="row text-center mb-3 cursor-pointer hover fw-bold">
            
            <p class="">MAIN MENU</p>
        </div>
        <div class="row text-center cursor-pointer hover fw-bold"  @click="entergame()">
            <p>PLAY</p>
            </div>

    </div>
 
</template>

<style lang="css">
.cursor-pointer{
    cursor: pointer;
}
/* .hover{
    text
} */
.hover:hover{
    background-color: rgb(6, 42, 109);
    color: aliceblue;
}
</style>