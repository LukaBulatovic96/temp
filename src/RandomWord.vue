
<script setup>
import {ref} from "vue";

const len = ref(0);
const word = ref("no word");


const generate = () => {
    if(len.value){
        word.value ="";

        for (let index = 0; index < len.value; index++) {
            let charCode = Math.random()*26 +65;
            console.log(charCode,String.fromCharCode(charCode) );
            word.value += String.fromCharCode(charCode); 
        }

       
    }
}
</script>
<template lang="">
    <div>
        <h3>Word length:</h3>
        <input type="text" v-model="len">
        <button class="btn btn-success" @click="generate">Generate</button>
        <h3 >Word: <span class="text-success" ref="spanRef"> {{word}}</span></h3>

    </div>
</template>


<style lang="">
    
</style>