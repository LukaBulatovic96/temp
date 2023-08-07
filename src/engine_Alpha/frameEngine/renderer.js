export function renderFrame({background: background,  context: context, objects: objects, window: window}){ //objects: objects,windowSettings: windowSettings
    

    

    //DRAW BACKGROUND
    for (let i = 0; i < background.tileCountY; i++) {
        for (let j = 0; j < background.tileCountX; j++) {
          context.drawImage(
            background.tile,
            background.tileSizeX * j,
            background.tileSizeY * i
          );
        }
      }
    
      //DRAW OBJECTS

      objects.forEach(object => {
        object.draw();
      });

}

