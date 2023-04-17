<script setup>
import { onMounted, ref } from "vue";
import { Entity } from "./entity";
import { Map } from "./map";

const emit = defineEmits(["exitGame"]);
const exitgame = () => {
  emit("exitGame");
};
const gameSettings = ref({
  width: 600,
  height: 300,
});

const context = ref(null);
const myCanvas = ref(null);
const audio = ref();

const floorSrc = ref("https://i.ibb.co/dfWQTQF/floor-1.png");

const round = ref(0);
const isShopOpen = ref(true);
const backGround_imageData = ref();
const player_imageData = ref();
const enemy_imageData = ref();
const path = ref(null);
const mainDiv = ref(null);
const cash = ref(1000);
const entity = ref();
const map = ref();
const enemy = ref();

const mouseOver_selection = ref(null);

const buttonPressed = ref(-1);

const audioHandle = () => {
  audio.value.play();
  // if(audio.value.paused)audio.value.play();
  // else audio.value.pause();
};

const spellImage = ref();
const spellSrc = ref("https://i.ibb.co/ZcXYRst/16-sunburn-spritesheet.png");
const spell = ref({
  exists: false,
  position: {
    x: 0,
    y: 0,
  },
});
const xFrame = ref(0);
const yFrame = ref(0);

const updateSpell = () =>{
  if(spell.value.exists){
    spell.value.position.x+=5;
  }
}
const drawSpell = () => {
  //drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
  if (spell.value.exists) {
    if (xFrame.value == 8) {
      xFrame.value = 0;
      yFrame.value++;
    }
    if (yFrame.value == 7 && xFrame.value == 4) {
      yFrame.value = 0;
      xFrame.value = 0;
    }
    context.value.drawImage(
      spellImage.value,
      xFrame.value * 100,
      yFrame.value * 100,
      100,
      100,
      spell.value.position.x,
      spell.value.position.y,
      50,
      50
    );
    xFrame.value++;
  }
};

onMounted(() => {
  spellImage.value = new Image();
  spellImage.value.src = spellSrc.value;

  context.value = myCanvas.value.getContext("2d");
  entity.value = new Entity({
    position: { x: 50, y: 50 },
    imageSrc: {
      run: {
        left: [
          "https://i.ibb.co/k4mGXjX/output-onlinepngtools-10.png",
          "https://i.ibb.co/mzSS7f1/output-onlinepngtools-7.png",
          "https://i.ibb.co/30P1wN2/output-onlinepngtools-8.png",
          "https://i.ibb.co/PY6vqFF/output-onlinepngtools-9.png",
        ],
        right: [
          "https://i.ibb.co/0sySvyn/big-demon-run-anim-f0.png",
          "https://i.ibb.co/Sw94cLB/big-demon-run-anim-f1.png",
          "https://i.ibb.co/NTfStbv/big-demon-run-anim-f2.png",
          "https://i.ibb.co/vDxPm0v/big-demon-run-anim-f3.png",
        ],
      },
      idle: {
        left: [
          "https://i.ibb.co/5Tv3tkf/output-onlinepngtools-2.png",
          "https://i.ibb.co/gF0Vqyx/output-onlinepngtools-3.png",
          "https://i.ibb.co/kHQTtgL/output-onlinepngtools-4.png",
          "https://i.ibb.co/Wnmvf2P/output-onlinepngtools-5.png",
        ],
        right: [
          "https://i.ibb.co/BnJmR70/big-demon-idle-anim-f3.png",
          "https://i.ibb.co/zFcLPjH/big-demon-idle-anim-f0.png",
          "https://i.ibb.co/pbzn6k9/big-demon-idle-anim-f1.png",
          "https://i.ibb.co/wyPtCgk/big-demon-idle-anim-f2.png",
        ],
      },
    },
    context: context.value,
    attack: {
      target: null,
      range: 30,
      attackSpeed: 1,
      lastPerformed: 0,
      damage: 5,
      type: "melee",
    },
  });

  enemy.value = new Entity({
    position: { x: 150, y: 150 },
    imageSrc: {
      run: {
        left: ["https://i.ibb.co/4pPSNxk/chest-full-open-anim-f1.png"],
        right: ["https://i.ibb.co/4pPSNxk/chest-full-open-anim-f1.png"],
      },
      idle: {
        left: ["https://i.ibb.co/4pPSNxk/chest-full-open-anim-f1.png"],
        right: ["https://i.ibb.co/4pPSNxk/chest-full-open-anim-f1.png"],
      },
    },
    context: context.value,
    radius: 12,
    width: 16,
    height: 16,
  });

  map.value = new Map({
    imageSrc: floorSrc.value,
    imageSize: 16,
    width: gameSettings.value.width,
    height: gameSettings.value.height,
    context: context.value,
  });

  myCanvas.value.addEventListener("mousedown", function (e) {
    let position = getMousePosition(myCanvas.value, e);
    buttonPressed.value = position.button;
    if (position.button == 2) {
      cast();
      initializePath(position.x, position.y);
      entity.value.attack.target = mouseOver_selection.value;
    }
  });
  myCanvas.value.addEventListener("mousemove", function (e) {
    let position = getMousePosition(myCanvas.value, e);
    checkCollisionAllEntities(position.x, position.y);
  });

  const checkCollisionAllEntities = (x, y) => {
    if (
      Math.sqrt(
        Math.pow(x - enemy.value.position.x - enemy.value.width / 2, 2) +
          Math.pow(y - enemy.value.position.y - enemy.value.height / 2, 2)
      ) <= enemy.value.radius
    ) {
      enemy.value.highlight = true;
      mouseOver_selection.value = enemy.value;
    } else {
      enemy.value.highlight = false;
      mouseOver_selection.value = null;
    }
  };

  mainDiv.value.addEventListener("contextmenu", (event) => {
    event.preventDefault();
  });
  //   initBackground();
  render();
});

const render = () => {
  window.requestAnimationFrame(render);
  drawBackground();
  drawEnemy();
  updatePlayer();
  updateSpell();
  drawSpell();
};

const getMousePosition = (canvas, event) => {
  let rect = canvas.getBoundingClientRect();
  let x = event.clientX - rect.left;
  let y = event.clientY - rect.top;
  //   player.value.position.y = y;
  //   player.value.position.x =x;
  return { x: x, y: y, button: event.button };
};

const initializePath = (x, y) => {
  entity.value.path = {
    position: {
      x: x,
      y: y,
    },
  };
};

const cast = () => {
  spell.value.exists = true;
  spell.value.position.x = entity.value.position.x;
  spell.value.position.y = entity.value.position.y;
}

const updatePlayer = () => {
  if (entity.value.path != null) {
    const entityCenter_offset_X = entity.value.width / 2;
    const entityCenter_offset_Y = entity.value.height / 2;

    const delta_X =
      entity.value.path.position.x -
      (entity.value.position.x + entityCenter_offset_X);
    const delta_Y =
      entity.value.path.position.y -
      (entity.value.position.y + entityCenter_offset_Y);
    const z = Math.sqrt(Math.pow(delta_X, 2) + Math.pow(delta_Y, 2));

    if (delta_X > 0) {
      entity.value.orientation = 0;
    } else {
      entity.value.orientation = 1;
    }

    const ratio = entity.value.speed / z;
    if (ratio >= 1) {
      entity.value.position.x =
        entity.value.path.position.x - entityCenter_offset_X;
      entity.value.position.y =
        entity.value.path.position.y - entityCenter_offset_Y;
      entity.value.path = null;
    } else {
      entity.value.position.x += ratio * delta_X;
      entity.value.position.y += ratio * delta_Y;
    }

    entity.value.currentAction = "run";
  } else {
    entity.value.currentAction = "idle";
  }
  // if (doObjectsCollide(entity.value, enemy.value)) {
  //   resetEnemy();
  //   cash.value += 10;
  // }
  drawPlayer();
};

const drawPlayer = () => {
  entity.value.update();
};
const drawBackground = () => {
  map.value.update();
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

const increaseSpeed = () => {
  if (cash.value >= 10) {
    entity.value.speed++;
    cash.value -= 10;
  }
};
const manageHP = (delta) => {
  entity.value.currentHp += delta;
  if (entity.value.currentHp >= entity.value.hp)
    entity.value.currentHp = entity.value.hp;
  if (entity.value.currentHp <= 0) entity.value.currentHp = 0;

  // console.log("CURR HP: ",entity);
};
const doObjectsCollide = (unit1, unit2) => {
  let distance = Math.sqrt(
    Math.pow(
      unit1.position.x + unit1.width / 2 - unit2.position.x - unit2.width / 2,
      2
    ) +
      Math.pow(
        unit1.position.y +
          unit1.height / 2 -
          unit2.position.y -
          unit2.height / 2,
        2
      )
  );

  if (distance <= unit1.radius + unit2.radius) {
    return true;
  } else {
    return false;
  }
};

/////////// ENEMY TO DELETE

const resetEnemy = () => {
  //   const delta_X = Math.random() * gameSettings.value.width -gameSettings.value.width/2;
  //   const delta_Y = Math.random() * gameSettings.value.width -gameSettings.value.width/2;
  //   console.log("DETLAS: ",delta_X,delta_Y);
  enemy.value.position.x = Math.random() * gameSettings.value.width;
  enemy.value.position.y = Math.random() * gameSettings.value.height;

  if (enemy.value.position.x >= gameSettings.value.width - enemy.value.radius) {
    enemy.value.position.x = gameSettings.value.width - enemy.value.radius;
  }
  if (
    enemy.value.position.y >=
    gameSettings.value.height - enemy.value.radius
  ) {
    enemy.value.position.y = gameSettings.value.height - enemy.value.radius;
  }

  if (enemy.value.position.x <= enemy.value.radius) {
    enemy.value.position.x = enemy.value.radius;
  }
  if (enemy.value.position.y <= enemy.value.radius) {
    enemy.value.position.y = enemy.value.radius;
  }
};
const drawEnemy = () => {
  if (enemy.value.currentHp <= 0) {
    resetEnemy();
    enemy.value.currentHp = enemy.value.hp;
    cash.value += 10;
  }
  enemy.value.update();
};

const incAttackSpeed = () => {
  entity.value.attack.attackSpeed -= 0.05;
  cash.value -= 10;
};

const incAttack = () => {
  entity.value.attack.damage += 2;
  cash.value -= 10;
};
</script>

<template>
  <div class="container" ref="mainDiv">
    <audio hidden="true" ref="audio">
      <source src="../assets/sound/Minimalist4.mp3" type="audio/mpeg" />
    </audio>
    <div class="row w-100 mb-3">
      <div class="col-sm text-center">Game</div>
      <div class="col-sm text-center">Round: {{ 0 }}</div>
      <div
        class="col-sm text-center cursor-pointer btn btn-warning"
        @click="exitgame"
      >
        Back to Menu
      </div>
    </div>

    <div class="row w-100 text-center cursor-custom">
      <div>
        <canvas
          ref="myCanvas"
          :width="gameSettings.width"
          :height="gameSettings.height"
        ></canvas>
      </div>
    </div>
    <div class="row w-100 bg-info text-center p-5">
      <div class="col-sm fw-bold" @click="audioHandle()">SHOP</div>
      <div class="col-sm text-center">CASH: {{ cash }}$</div>

      <div class="col-sm text-center">
        Speed: {{ entity ? entity.speed : "No entity" }}
      </div>
      <div
        class="col-sm text-center btn btn-success cursor-pointer"
        @click="increaseSpeed()"
        :class="cash < 10 ? ' disabled ' : ''"
      >
        ++ (10$)
      </div>

      <div class="col-sm text-center">
        Damage: {{ entity ? entity.attack.damage : "No entity" }}
      </div>
      <div
        class="col-sm text-center btn btn-success cursor-pointer"
        @click="incAttack()"
        :class="cash < 10 ? ' disabled ' : ''"
      >
        ++ (10$)
      </div>

      <div class="col-sm text-center">
        Attack Speed: {{ entity ? entity.attack.attackSpeed : "No entity" }}
      </div>
      <div
        class="col-sm text-center btn btn-success cursor-pointer"
        @click="incAttackSpeed()"
        :class="cash < 10 ? ' disabled ' : ''"
      >
        ++ (10$)
      </div>

      <div class="col-sm text-center">HP</div>
      <div
        class="col-sm text-center btn btn-success cursor-pointer"
        :class="false ? ' disabled ' : ''"
        @click="manageHP(5)"
      >
        ++ (2$)
      </div>
      <div
        class="col-sm text-center btn btn-success cursor-pointer"
        :class="false ? ' disabled ' : ''"
        @click="manageHP(-5)"
      >
        -- (2$)
      </div>
    </div>
  </div>
</template>

<style lang="css">
body {
  cursor: url("https://i.ibb.co/n10MnYv/output-onlinepngtools-11.png"), auto;
}
</style>
