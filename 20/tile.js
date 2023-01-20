// Art deco tile class

// Colors
let color0 = "#E6E8FA";
let color1 = "#FFD700";
let color2 = "#20A000";

// Line width (pixels)
let lineWidth = 2.5;

// Cumulative probabilities for each tile type
const tileChances = [0.3, 0.6, 0.7, 1.0];

class Tile {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    // choose a tile type
    let r = random();
    for (let i = 0; i < tileChances.length; i++) {
      if (r <= tileChances[i]) {
        this.type = i;
        break;
      }
    }
  }

  show() {
    push();
    rectMode(CENTER);
    let sf = this.size / 2.0;
    translate(this.x, this.y);
    rotate(-45);
    scale(sf);
    noFill();
    stroke(color0);
    strokeWeight(lineWidth / sf);
    square(0.0, 0.0, 2.0);
    
    translate(-1.0, 1.0);
    scale(2.0);
    sf *= 2;

    stroke(color1);

    switch (this.type) {
      case 0:
        {
          const l = 0.95; // Length of lines
          const w = 1.5; // Width of lines compared to lineWidth
          const offset = 25.0; // Offset in degrees
          const step = 8.0; // Step between lines in degrees
          strokeWeight((w * lineWidth) / sf);
          for (let th = 0.0 - offset; th >= -90 + offset; th -= step) {
            line(0.15, -0.15, l * cos(th), l * sin(th));
          }
        }
        break;

      case 1:
        {
          const r = 0.6; // Radius of arc
          const l = 0.35; // Length of lines
          const w = 1.0; // Width of lines compared to lineWidth
          const offset = 22.0; // Offset in degrees
          const step = 7.5; // Step between lines in degrees
          strokeWeight((w * lineWidth) / sf);
          arc(0.0, 0.0, r * 2.0, r * 2.0, -90.0, 0.0);
          for (let th = 0.0 - offset; th >= -90 + offset; th -= step) {
            line(
              r * cos(th),
              r * sin(th),
              (r + l) * cos(th),
              (r + l) * sin(th)
            );
          }
        }
        break;

      case 2:
        {
          const n = 3; // Number of chevrons
          let w = 0.25 / n;  // Width of chevrons and spaces
          stroke(color2);
          strokeWeight(w);
          strokeCap(SQUARE);
          for (let p = w + 0.25; p <= 0.75 - w; p += 2.0 * w) {
            line(0.0, -p, p, -p);
            line(p, -p, p, 0.0);
            square(p, -p, w / sf);
          }
        }
        break;

      case 3:
        {
          const n = 3; // Number of squares
          const min = 0.2;
          const max = 0.7;
          const w = 1.0; // Width of lines compared to lineWidth
          stroke(color1);
          strokeWeight((w * lineWidth) / sf);
          fill(color2);
          rectMode(CENTER);
          translate(0.5, -0.5);
          for (let s = min; s <= max; s += (max - min) / (n-1)) {
            square(0.0, 0.0, s);
            noFill();
          }
        }
        break;
    }

    pop();
  }
}
