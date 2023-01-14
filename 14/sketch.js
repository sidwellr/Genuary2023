// size of the character grid
const chargridx = 3;
const chargridy = 4;

// number of strokes per character
const charstrokes = 5;

// character stroke width
const charstroke = 3;

// character size
const charsize = 10;

// probability of space
const spaceprob = 0.2;

function setup() {
  createCanvas(800, 1000);
}

function draw() {
  background(255, 245, 240);
  let nospace = true;
  for (let y = 2 * charsize; y < height - chargridy * charsize; y += 1.25 * chargridy * charsize) {
    let nospace = true;
    for (let x = 1.5 * charsize; x < width - chargridx * charsize; x += chargridx * charsize) {
      if (random() > spaceprob || nospace) {
        drawChar(x, y, charsize);
        nospace = false;
      } else {
        nospace = true;
      }
    }
  }
  noLoop();
}

function drawChar(x, y, s) {
  push();
  translate(x - s / 2, y - s / 2);
  scale(s);
  for (let i = 0; i < charstrokes; i++) {
    let x1 = floor(random(chargridx));
    let y1 = floor(random(chargridy));
    let x2 = floor(random(chargridx));
    let y2 = floor(random(chargridy));
    strokeWeight(charstroke / s);
    stroke(0);
    line(x1, y1, x2, y2);
  }
  pop();
}

function keyPressed() {
  if (key === " ") {
    loop();
  } else if (key === "s") {
    saveCanvas();
  }
}
