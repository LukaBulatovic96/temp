<script setup>
import { onMounted, ref } from "vue";
import  {Entity } from "./entity";

const emit = defineEmits(["exitGame"]);
const exitgame = () => {
  emit("exitGame");
};
const gameSettings = ref({
  width: 1000,
  height: 600,
});

const src = ref('../assets/bigbad/big_demon_idle_anim_f0.png');

const entity = ref();
const context = ref(null);
const myCanvas = ref(null);
const round = ref(0);
const isShopOpen = ref(true);
const backGround_imageData = ref();
const player_imageData = ref();
const enemy_imageData = ref();
const path = ref(null);
const mainDiv =ref(null);
const cash = ref(0);

const player = ref({
  position: {
    x: 200,
    y: 300,
  },
  radius: 10,
  speed: 3,
});

const enemy = ref({
  position: {
    x: 600,
    y: 100,
  },
  radius: 10,
});

const drawBackground = () => {
  context.value.putImageData(backGround_imageData.value, 0, 0);
};

const drawPlayer = () => {
  player_imageData.value = context.value.createImageData(
    player.value.radius * 2,
    player.value.radius * 2
  );
  for (let i = 0; i < player.value.radius * 2; i++) {
    for (let j = 0; j < player.value.radius * 2 * 4; j += 4) {
      let distance = Math.sqrt(
        Math.pow(i - player.value.radius, 2) +
          Math.pow(j / 4 - player.value.radius, 2)
      );
      if (distance <= player.value.radius) {
        player_imageData.value.data[
          i * player.value.radius * 2 * 4 + j + 0
        ] = 30;
        player_imageData.value.data[
          i * player.value.radius * 2 * 4 + j + 1
        ] = 150;
        player_imageData.value.data[
          i * player.value.radius * 2 * 4 + j + 2
        ] = 30;
        player_imageData.value.data[
          i * player.value.radius * 2 * 4 + j + 3
        ] = 255;
      } else {
        player_imageData.value.data[
          i * player.value.radius * 2 * 4 + j + 0
        ] = 0;
        player_imageData.value.data[
          i * player.value.radius * 2 * 4 + j + 1
        ] = 0;
        player_imageData.value.data[
          i * player.value.radius * 2 * 4 + j + 2
        ] = 0;
        player_imageData.value.data[
          i * player.value.radius * 2 * 4 + j + 3
        ] = 255;
      }
    }
  }
  context.value.putImageData(
    player_imageData.value,
    player.value.position.x - player.value.radius,
    player.value.position.y - player.value.radius
  );
  /////////////////////////


};
///////////////////

const drawEnemy = () => {
  enemy_imageData.value = context.value.createImageData(
    enemy.value.radius * 2,
    enemy.value.radius * 2
  );
  for (let i = 0; i < enemy.value.radius * 2; i++) {
    for (let j = 0; j < enemy.value.radius * 2 * 4; j += 4) {
      let distance = Math.sqrt(
        Math.pow(i - enemy.value.radius, 2) +
          Math.pow(j / 4 - enemy.value.radius, 2)
      );
      if (distance <= enemy.value.radius) {
        enemy_imageData.value.data[
          i * enemy.value.radius * 2 * 4 + j + 0
        ] = 150;
        enemy_imageData.value.data[i * enemy.value.radius * 2 * 4 + j + 1] = 30;
        enemy_imageData.value.data[i * enemy.value.radius * 2 * 4 + j + 2] = 30;
        enemy_imageData.value.data[
          i * enemy.value.radius * 2 * 4 + j + 3
        ] = 255;
      } else {
        enemy_imageData.value.data[i * enemy.value.radius * 2 * 4 + j + 0] = 0;
        enemy_imageData.value.data[i * enemy.value.radius * 2 * 4 + j + 1] = 0;
        enemy_imageData.value.data[i * enemy.value.radius * 2 * 4 + j + 2] = 0;
        enemy_imageData.value.data[
          i * enemy.value.radius * 2 * 4 + j + 3
        ] = 255;
      }
    }
  }
  context.value.putImageData(
    enemy_imageData.value,
    enemy.value.position.x - enemy.value.radius,
    enemy.value.position.y - enemy.value.radius
  );
};
const initBackground = () => {
  backGround_imageData.value = context.value.createImageData(
    gameSettings.value.width,
    gameSettings.value.height
  );
  for (let i = 0; i < gameSettings.value.height; i++) {
    for (let j = 0; j < gameSettings.value.width * 4; j += 4) {
      backGround_imageData.value.data[
        i * gameSettings.value.width * 4 + j + 0
      ] = 0;
      backGround_imageData.value.data[
        i * gameSettings.value.width * 4 + j + 1
      ] = 0;
      backGround_imageData.value.data[
        i * gameSettings.value.width * 4 + j + 2
      ] = 0;
      backGround_imageData.value.data[
        i * gameSettings.value.width * 4 + j + 3
      ] = 255;
    }
  }
};

onMounted(() => {
  context.value = myCanvas.value.getContext("2d");
  initBackground();
  window.addEventListener("keydown", handleInput);
  myCanvas.value.addEventListener("mousedown", function (e) {
    getMousePosition(myCanvas.value, e);
  });

  mainDiv.value.addEventListener("contextmenu", (event) => {
    event.preventDefault();
  });

  entity.value = new Entity({position:{x:300,y:300},imageSrc : "https://i.ibb.co/zFcLPjH/big-demon-idle-anim-f0.png", context : context.value});
  render();
});

const handleInput = (event) => {
  switch (event.key) {
    case "w":
      player.value.position.y -= 5;
      break;

    case "a":
      player.value.position.x -= 5;
      break;
    case "s":
      player.value.position.y += 5;
      break;
    case "d":
      player.value.position.x += 5;
      break;
    default:
      break;
  }
};

const getMousePosition = (canvas, event) => {
  if (event.button == 2) {
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    //   player.value.position.y = y;
    //   player.value.position.x =x;
    initializePath(x, y);
  }
};

const initializePath = (x, y) => {
  path.value = {
    position: {
      x: x,
      y: y,
    },
  };
};

const resetEnemy = () => {
//   const delta_X = Math.random() * gameSettings.value.width -gameSettings.value.width/2;
//   const delta_Y = Math.random() * gameSettings.value.width -gameSettings.value.width/2;
//   console.log("DETLAS: ",delta_X,delta_Y);
  enemy.value.position.x =Math.random() * gameSettings.value.width;
  enemy.value.position.y =Math.random() * gameSettings.value.height;

  if (enemy.value.position.x >= gameSettings.value.width - enemy.value.radius) {
    enemy.value.position.x =  gameSettings.value.width - enemy.value.radius;
  }
  if (enemy.value.position.y >= gameSettings.value.height - enemy.value.radius) {
    enemy.value.position.y =  gameSettings.value.height - enemy.value.radius;
  }


  if (enemy.value.position.x <=  enemy.value.radius) {
    enemy.value.position.x =  enemy.value.radius;
  }
  if (enemy.value.position.y <=  enemy.value.radius) {
    enemy.value.position.y =  enemy.value.radius;
  }
};

const updatePlayer = () => {
  if (path.value != null) {
    const delta_X = path.value.position.x - player.value.position.x;
    const delta_Y = path.value.position.y - player.value.position.y;
    const z = Math.sqrt(Math.pow(delta_X, 2) + Math.pow(delta_Y, 2));

    const ratio = player.value.speed / z;
    if (ratio >= 1) {
      player.value.position.x = path.value.position.x;
      player.value.position.y = path.value.position.y;
      path.value = null;
    } else {
      player.value.position.x += ratio * delta_X;
      player.value.position.y += ratio * delta_Y;
    }
  }
  if (doObjectsCollide(player.value, enemy.value)) {
    resetEnemy();
    cash.value += 10;
  }
  drawPlayer();
};

const doObjectsCollide = (unit1, unit2) => {
  let distance = Math.sqrt(
    Math.pow(unit1.position.x - unit2.position.x, 2) +
      Math.pow(unit1.position.y - unit2.position.y, 2)
  );

  if (distance <= unit1.radius + unit2.radius) {
    return true;
  } else {
    return false;
  }
};

const render = () => {
  window.requestAnimationFrame(render);

  drawBackground();
  drawEnemy();
  drawUI();

  updatePlayer();
 
  entity.value.update();

 
};

const drawUI = () => {
  drawHPBars();
}
const drawHPBars = () => {

}

const increaseSpeed = () => {
    if(cash.value>=10){


    player.value.speed++;
    cash.value -=10;    }
}
const increaseRadius = () => {
    if(cash.value>=20){


    player.value.radius++;
    cash.value -=20;    }
}
</script>

<template>
  <div class="container"   ref="mainDiv">
    <div class="row w-100 mb-3">
      <div class="col-sm text-center">Game</div>
      <div class="col-sm text-center">Round: {{ round }}</div>
      <div
        class="col-sm text-center cursor-pointer btn btn-warning"
        @click="exitgame"
      >
        Back to Menu
      </div>
    </div>

    <div class="row w-100 text-center">
      <div>
        <canvas
          ref="myCanvas"
          :width="gameSettings.width"
          :height="gameSettings.height"
        ></canvas>
      </div>
    </div>
    <div class="row w-100 bg-info text-center p-5">
      <div class="col-sm fw-bold">SHOP</div>
      <div class="col-sm text-center">CASH: {{ cash }}$</div>
      
      <div  class="col-sm text-center">Speed: {{ player.speed }}</div>
      <div class="col-sm text-center btn btn-success cursor-pointer" @click="increaseSpeed()" :class="cash<10?' disabled ':''">++ (10$)</div>
      <div  class="col-sm text-center">Size: {{ player.radius }}</div>
      <div class="col-sm text-center btn btn-success cursor-pointer" @click="increaseRadius()" :class="cash<20?' disabled ':''">++ (20$)</div>
    </div>
  </div>
</template>

<style lang="css"></style>
