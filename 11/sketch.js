// Draw a suprematist inspired composition consisting of:
// - a group of 2 to 5 ochre rectangles
// - a red squarish rectangle
// - a group of 1 to 4 more ochre rectangles
// - a blue circle placed to balance the other elements

let color1, color2, color3, angle1, angle2;
let base;

function setup() {
  createCanvas(800, 1000);
  base = min(width, height) / 20;
  color1 = color("#e30022"); // Cadmium red
  color2 = color("#ccaa22"); // Ochre
  color3 = color("#120a8f"); // Ultramarine
  angle1 = 0;
  angle2 = random(-PI / 6, -PI / 4);
}

function draw() {
  background("#fffafa");

  let xsum = 0;
  let ysum = 0;
  let n = 0;

  // Draw first group of rectangles
  for (let i = 0; i < random(2, 5); i++) {
    push();
    let x = random(3 * base, width - 3 * base);
    let y = random(3 * base, height - 3 * base);
    let w = random(3, 5) * base;
    let h = random(0.5, 2) * base;
    xsum += x;
    ysum += y;
    n += 1;
    translate(x, y);
    rotate(angle2);
    fill(color2);
    noStroke();
    rect(0, 0, w, h);
    pop();
  }

  // Draw squarish rectangle
  {
    push();
    let x = random(4 * base, width - 4 * base);
    let y = random(4 * base, height - 4 * base);
    let w = random(5, 6) * base;
    let h = random(5, 6) * base;
    xsum += 2 * x;
    ysum += 2 * y;
    n += 2;
    translate(x, y);
    rotate(angle1);
    fill(color1);
    noStroke();
    rect(0, 0, w, h);
    pop();
  }

  // Draw second group of rectangles
  for (let i = 0; i < random(1, 4); i++) {
    push();
    let x = random(2 * base, width - 2 * base);
    let y = random(2 * base, height - 2 * base);
    let w = random(3, 5) * base;
    let h = random(0.5, 2) * base;
    xsum += x;
    ysum += y;
    n += 1;
    translate(x, y);
    rotate(angle2);
    fill(color2);
    noStroke();
    rect(0, 0, w, h);
    pop();
  }

  let xmean = xsum / n;
  let ymean = ysum / n;

  // Draw circle
  {
    push();
    let x = width / 2 - 2 * xmean + width;
    let y = height / 2 - 2 * ymean + height;
    let d = (n / 2) * base;
    translate(x, y);
    fill(color3);
    noStroke();
    circle(0, 0, d);
    pop();
  }

  noLoop();
}

function keyPressed() {
  if (key === " ") {
    loop();
  } else if (key === "s") {
    saveCanvas();
  }
}
