let tiles;

const tileSize = 100.0;

function setup() {
  createCanvas(800, 800);
  angleMode(DEGREES);
  makeTiles();
}

function makeTiles() {
   tiles = [];
  for (let y = -tileSize / 2.0; y < height + tileSize; y += tileSize) {
    for (let x = -tileSize / 2.0; x < width + tileSize; x += tileSize) {
      let tile = new Tile(x, y, tileSize);
      tiles.push(tile);
    }
  } 
}

function draw() {
  background(10, 10, 20);
  for (let tile of tiles) {
    tile.show();
  }
  noLoop();
}

function keyPressed() {
  if (key === " ") {
    makeTiles();
    loop();
  } else if (key === "s") {
    saveCanvas();
  }
}
