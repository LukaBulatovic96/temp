export function generatePerlin(
  dimension,
  noiseParam,
  startDimension,
  interpolation
) {
  let localMatrix = [];
  let currentDimension = Math.pow(2, startDimension);

  for (let index = 0; index < dimension; index++) {
    localMatrix.push([]);
    for (let jotex = 0; jotex < dimension; jotex++) {
      localMatrix[index].push(0);
    }
  }



  for (let i = 0; i < currentDimension; i++) {
    
    for (let j = 0; j < currentDimension; j++) {
      let temp = Math.floor(Math.random() * 255);
      const smallDimension = dimension / currentDimension;

      for (let i_c = 0; i_c < smallDimension; i_c++) {
        for (let j_c = 0; j_c < smallDimension; j_c++) {
          localMatrix[i * smallDimension + i_c][j * smallDimension + j_c] +=
          temp;
          if (
            localMatrix[i * smallDimension + i_c][j * smallDimension + j_c] < 0
          )
            localMatrix[i * smallDimension + i_c][j * smallDimension + j_c] = 0;
          if (
            localMatrix[i * smallDimension + i_c][j * smallDimension + j_c] >
            255
          )
            localMatrix[i * smallDimension + i_c][
              j * smallDimension + j_c
            ] = 255;
        }
      }
      // localMatrix[index].push(Math.floor(Math.random() * 255));
    }
  }

  const noise = noiseParam;
  let steps = getBaseLog(2, dimension);
  for (let powerIndex = startDimension; powerIndex < steps; powerIndex++) {
    console.log("powerIndex: ", powerIndex);
    //BIG FOR
    currentDimension = Math.pow(2, powerIndex);
    for (let i = 0; i < currentDimension; i++) {
      for (let j = 0; j < currentDimension; j++) {
        const smallDimension = dimension / currentDimension;
        const rand = Math.floor(Math.random() * noise * 2 - noise);
        for (let i_c = 0; i_c < smallDimension; i_c++) {
          for (let j_c = 0; j_c < smallDimension; j_c++) {
            localMatrix[i * smallDimension + i_c][j * smallDimension + j_c] +=
              rand;
            if (
              localMatrix[i * smallDimension + i_c][j * smallDimension + j_c] <
              0
            )
              localMatrix[i * smallDimension + i_c][
                j * smallDimension + j_c
              ] = 0;
            if (
              localMatrix[i * smallDimension + i_c][j * smallDimension + j_c] >
              255
            )
              localMatrix[i * smallDimension + i_c][
                j * smallDimension + j_c
              ] = 255;
          }
        }
      }
    }

    if (interpolation) {
      let a, b, c, v1, v2, v3, v4;
      let x1, x2, y1, y2;
      let x, y;
      let dx, dy;
      let dvaNaP = Math.pow(2.0, powerIndex);
      let krozDvaNaP = dimension / dvaNaP;

      for (let i = 0; i < dvaNaP + 1; i++) {
        for (let j = 0; j < dvaNaP + 1; j++) {
          y1 = i * krozDvaNaP - krozDvaNaP / 2;
          x1 = j * krozDvaNaP - krozDvaNaP / 2;
          y2 = i * krozDvaNaP + krozDvaNaP / 2;
          x2 = j * krozDvaNaP + krozDvaNaP / 2;

          if (i == 0) y1 = 0;
          if (i == dvaNaP) y2 = i * krozDvaNaP - 1;
          if (j == 0) x1 = 0;
          if (j == dvaNaP) x2 = j * krozDvaNaP - 1;
          if (i == dimension) y1 = dimension - 1;
          if (j == dimension) x1 = dimension - 1;

          v1 = localMatrix[y1][x1];
          v2 = localMatrix[y2][x1];
          v3 = localMatrix[y1][x2];
          v4 = localMatrix[y2][x2];

          for (let i2 = 0; i2 < krozDvaNaP; i2++) {
            for (let j2 = 0; j2 < krozDvaNaP; j2++) {
              y = i * krozDvaNaP - krozDvaNaP / 2 + i2;
              x = j * krozDvaNaP - krozDvaNaP / 2 + j2;
              if (x < 0) x = 0;
              if (x > dimension - 1) x = dimension - 1;
              if (y < 0) y = 0;
              if (y > dimension - 1) y = dimension - 1;

              dy = i2 / krozDvaNaP;
              dx = j2 / krozDvaNaP;

              a = lerpI(v1, v2, dx);
              b = lerpI(v3, v4, dx);
              c = lerpI(a, b, dy);
              localMatrix[y][x] = c;
            }
          }
        }
      }
    }

    //BIG FOR
  }

  return localMatrix;
}

export function getBaseLog(x, y) {
  return Math.log(y) / Math.log(x);
}

export function lerpI(a, b, z) {
  return a + (b - a) * z;
}
