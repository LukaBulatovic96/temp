export function renderFrame({ map: map, context: context, objects: objects, UIs: UIs }) {
  //objects: objects,windowSettings: windowSettings

  context.clearRect(0, 0, map.window.width, map.window.height);

 
  drawBackGround(context,map)
  drawObjects(context,objects,map)
  drawMinimap(context,map)
  drawUI(context, UIs);
}

function drawBackGround(context,map){

  const overFlowNegative_x = map.window.position.x % map.tile.tileSizeX;
  const overFlowNegative_y = map.window.position.y % map.tile.tileSizeY;
  const tiles_pre_x = Math.floor(map.window.position.x / map.tile.tileSizeX);
  const tiles_pre_y = Math.floor(map.window.position.y / map.tile.tileSizeY);
  const tiles_total_x = Math.ceil(
    (map.window.position.x + map.window.width) / map.tile.tileSizeX
  );
  const tiles_total_y = Math.ceil(
    (map.window.position.y + map.window.height) / map.tile.tileSizeY
  );
  const tileCountX = tiles_total_x - tiles_pre_x;
  const tileCountY = tiles_total_y - tiles_pre_y;
  for (let i = 0; i < tileCountY; i++) {
    for (let j = 0; j < tileCountX; j++) {
      context.beginPath();
      context.rect(
        map.tile.tileSizeX * j - overFlowNegative_x,
        map.tile.tileSizeY * i - overFlowNegative_y,
        map.tile.tileSizeX,
        map.tile.tileSizeY
      );
      context.lineWidth = 1;
      context.strokeStyle = "black";
      context.stroke();
      // context.drawImage(
      //   map.tile.image,
      //   map.tile.tileSizeX * j - overFlowNegative_x,
      //   map.tile.tileSizeY * i - overFlowNegative_y
      // );
    }
  }
}

function drawObjects(context,objects,map){
  objects.forEach((object) => {
    object.draw(-map.window.position.x, -map.window.position.y);
  });
}



function drawUI(context, UIs){
  UIs.forEach(UI_Element => {
    context.beginPath();
    context.rect(UI_Element.position.x, UI_Element.position.y, UI_Element.width, UI_Element.height);
    context.fillStyle = "yellow";
    context.fill();
    context.strokeStyle = "black";
    context.lineWidth = 5;
    context.stroke();

    // context.beginPath();
    // context.rect(minimapStartX, minimapStartY, minimapWidth, minimapHeight);
    // context.strokeStyle = "black";
    // context.lineWidth = 5;
    // context.stroke();
  });
}

function drawMinimap(context,map){

  const minimapWidth = 100;
  const minimapHeight = (map.window.height / map.window.width) * minimapWidth;

  const windowWidth = (map.window.width / map.width) * minimapWidth;
  const windowHeight = (map.window.height / map.height) * minimapHeight;

  const windowX = (map.window.position.x / map.width) * minimapWidth;
  const windowY = (map.window.position.y / map.height) * minimapHeight;

  const minimapStartX = map.window.width - minimapWidth - 10;
  const minimapStartY = map.window.height - minimapHeight - 10;

  context.beginPath();
  context.rect(minimapStartX, minimapStartY, minimapWidth, minimapHeight);
  context.strokeStyle = "black";
  context.lineWidth = 5;
  context.stroke();

  context.beginPath();
  context.rect(minimapStartX, minimapStartY, minimapWidth, minimapHeight);
  context.fillStyle = "white";
  context.fill();

  context.beginPath();
  context.rect(
    minimapStartX + windowX,
    minimapStartY + windowY,
    windowWidth,
    windowHeight
  );
  context.strokeStyle = "red";
  context.lineWidth = 2;
  context.stroke();
}
