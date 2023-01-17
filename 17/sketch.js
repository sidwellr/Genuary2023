/* 
An interactive multi-scale truchet tiling program (see
https://christophercarlson.com/portfolio/multi-scale-truchet-patterns/)
using a quadtree. This has the advantage that it's easy to make an
arbitrary number of levels, not just the three in his description.

But there is an issue: not all valid multi-scale tile combinations are 
possible. For example, consider an 8x8 grid of tiles where the tiles on 
the outside edge are small and the 6x6 grid on the inside is made into 
nine 2x2 squares.

By Rick Sidwell
*/

let qt;

// UI variables
let tilesetSelect;
let color1Picker;
let color2Picker;
let qtOpacitySlider;
let mouseAction;

function setup() {
  let wsize = min(windowWidth - 100, windowHeight);
  createCanvas(wsize, wsize);
  angleMode(RADIANS);
  tileset = floor(random(0, 2));
  randomQuadtree();
  createControls(wsize + 5);
}

function draw() {
  qt.traverse(tileDraw);
  qt.traverse(qtDraw);
  noLoop();
}

function subdivide(x, y) {
  node = qt.find(x, y);
  if (node != null) {
    tile1 = new Tile(!node.userdata.inverted);
    tile2 = new Tile(!node.userdata.inverted);
    tile3 = new Tile(!node.userdata.inverted);
    tile4 = new Tile(!node.userdata.inverted);
    node.subdivide(tile1, tile2, tile3, tile4);
  }
}

function randomQuadtree() {
  let tile = new Tile(true);
  qt = new QuadTree(width / 2.0, height / 2.0, max(width, height), tile);
  for (let i = 0; i < width / 5 + random(5); i++) {
    subdivide(random(width), random(height));
  }
}

function newQuadtree() {
  let tile = new Tile(false);
  qt = new QuadTree(width / 2.0, height / 2.0, max(width, height), tile);
}

function mouseClicked() {
  node = qt.find(mouseX, mouseY);
  if (node === null) {
    return;
  }
  switch (mouseAction.value()) {
    case "0":
      // Rotate
      node.userdata.rotation += PI / 2.0;
      break;

    case "1":
      // Change tile type
      node.userdata.type += 1;
      if (node.userdata.type > tileChances.length) {
        node.userdata.type = 1;
      }
      break;

    case "2":
      // Split tile
      subdivide(mouseX, mouseY);
      break;

    case "3":
      // Combine tiles
      node.combine();
      break;
  }
  loop();
}

function keyPressed() {
  if (key === "r") {
    randomQuadtree();
  } else if (key === "c") {
    newQuadtree();
  } else if (key === "s") {
    saveCanvas();
  } else if (key === "a") {
    tileset = 0;
    tilesetSelect.selected("Curvy");
  } else if (key === "b") {
    tileset = 1;
    tilesetSelect.selected("Blocky");
  }
  loop();
}

function qtDraw(node) {
  if (qtOpacitySlider.value() === 0) {
    return;
  }
  push();
  rectMode(CENTER);
  stroke(0, qtOpacitySlider.value());
  noFill();
  square(node.x, node.y, node.size);
  pop();
}

function tileDraw(node) {
  node.userdata.show(node.x, node.y, node.size);
}

function createControls(left) {
  cpTitle = createP("Multi-scale Truchet");
  cpTitle.position(left, 0);
  cpTitle.style("font-size", "14pt");
  cpTitle.style("font-weight", "bold");

  tilesetTitle = createP("Tile Set");
  tilesetTitle.position(left, 55);
  tilesetTitle.style("font-size", "12pt");

  tilesetSelect = createSelect();
  tilesetSelect.position(left, 95);
  tilesetSelect.option("Curvy");
  tilesetSelect.option("Blocky");
  if (tileset === 1) {
    tilesetSelect.selected("Blocky");
  } else {
    tilesetSelect.selected("Curvy");
  }
  tilesetSelect.changed(tilesetChanged);

  color1Title = createP("Color 1");
  color1Title.position(left, 120);
  color1Title.style("font-size", "12pt");

  color1Picker = createColorPicker(color1);
  color1Picker.position(left, 160);
  color1Picker.input(color1Changed);

  color2Title = createP("Color 2");
  color2Title.position(left, 185);
  color2Title.style("font-size", "12pt");

  color2Picker = createColorPicker(color2);
  color2Picker.position(left, 225);
  color2Picker.input(color2Changed);
  
  qtOpacityTitle = createP("Quadtree");
  qtOpacityTitle.position(left, 255);
  qtOpacityTitle.style("font-size", "12pt");
  
  qtOpacitySlider = createSlider(0, 255, 20);
  qtOpacitySlider.position(left, 290);
  qtOpacitySlider.style("width", "80px");
  qtOpacitySlider.changed(sliderChanged);

  mouseTitle = createP("Mouse Action");
  mouseTitle.position(left, 310);
  mouseTitle.style("font-size", "12pt");

  mouseAction = createRadio();
  mouseAction.position(left, 345);
  mouseAction.option("0", "Rotate<br>");
  mouseAction.option("1", "Tile Type<br>");
  mouseAction.option("2", "Split<br>");
  mouseAction.option("3", "Combine<br>");
  mouseAction.selected("2");

  randButton = createButton("Randomize");
  randButton.position(left, 440);
  randButton.mousePressed(randButtonClicked);
  
  saveButton = createButton("Save");
  saveButton.position(left, 470);
  saveButton.mousePressed(saveButtonClicked);
}

function tilesetChanged() {
  if (tilesetSelect.value() === "Blocky") {
    tileset = 1;
  } else {
    tileset = 0;
  }
}

function color1Changed() {
  color1 = color1Picker.value();
  loop();
}

function color2Changed() {
  color2 = color2Picker.value();
  loop();
}

function sliderChanged() {
  loop();
}

function randButtonClicked() {
  randomQuadtree();
  loop();
}

function saveButtonClicked() {
  saveCanvas();
}