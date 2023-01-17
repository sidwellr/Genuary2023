// Truchet tile class

// Global variables for tileset colors
let color1 = "#000000";
let color2 = "#ffffff";

// Global variable for tileset selection
// 0: curvy tiles (Carlson's original)
// 1: pointy tiles (adaptation using diamonds instead of circles)
let tileset = 0;

// Cumulative probabilities for each type of tile
const tileChances = [0.3, 0.4, 0.5, 0.6, 0.7, 0.9, 1.0];

class Tile {
  constructor(inverted) {
    // Choose a tile type using the cumulative probabilities in tileChances
    let r = random();
    this.type = 0;
    for (let i = 0; i < tileChances.length; i++) {
      if (r <= tileChances[i]) {
        this.type = i + 1;
        break;
      }
    }
    this.rotation = (floor(random(0, 3)) * PI) / 2.0;
    this.inverted = inverted;
    if (inverted) {
      this.bgcolor = color2;
      this.fgcolor = color1;
    } else {
      this.bgcolor = color1;
      this.fgcolor = color2;
    }
  }

  show0(x, y, size) {
    push();
    rectMode(CENTER);
    ellipseMode(CENTER);
    translate(x, y);
    rotate(this.rotation);
    scale(size / 2.0);

    // draw tile background
    fill(this.bgcolor);
    noStroke();
    square(0.0, 0.0, 2.0);

    switch (this.type) {
      case 1:
        // Tile 1: two arcs
        noFill();
        stroke(this.fgcolor);
        strokeWeight(2.0 / 3.0);
        arc(1.0, -1.0, 2.0, 2.0, PI / 2.0, PI);
        arc(-1.0, 1.0, 2.0, 2.0, -PI / 2.0, 0.0);
        break;

      case 2:
        // Tile 2: line and dots
        stroke(this.fgcolor);
        strokeWeight(2.0 / 3.0);
        line(-1.0, 0.0, 1.0, 0.0);
        fill(this.fgcolor);
        noStroke();
        circle(0.0, -1.0, 2.0 / 3.0);
        circle(0.0, 1.0, 2.0 / 3.0);
        break;

      case 3:
        // Tile 3: four dots (on edges)
        fill(this.fgcolor);
        noStroke();
        circle(0.0, -1.0, 2.0 / 3.0);
        circle(0.0, 1.0, 2.0 / 3.0);
        circle(-1.0, 0.0, 2.0 / 3.0);
        circle(1.0, 0.0, 2.0 / 3.0);
        break;

      case 4:
        // Tile 4:solid (except wings)
        fill(this.fgcolor);
        noStroke();
        square(0.0, 0.0, 2.0);
        circle(0.0, -1.0, 2.0 / 3.0);
        circle(0.0, 1.0, 2.0 / 3.0);
        circle(-1.0, 0.0, 2.0 / 3.0);
        circle(1.0, 0.0, 2.0 / 3.0);
        break;

      case 5:
        // Tile 5: cross
        stroke(this.fgcolor);
        strokeWeight(2.0 / 3.0);
        line(-1.0, 0.0, 1.0, 0.0);
        line(0.0, -1.0, 0.0, 1.0);
        break;

      case 6:
        // Tile 6: arc and dots
        noFill();
        stroke(this.fgcolor);
        strokeWeight(2.0 / 3.0);
        arc(1.0, -1.0, 2.0, 2.0, PI / 2.0, PI);
        fill(this.fgcolor);
        noStroke();
        circle(0.0, 1.0, 2.0 / 3.0);
        circle(-1.0, 0.0, 2.0 / 3.0);
        break;

      case 7:
        // Tile 7: rectangle (except wings) and dot
        fill(this.fgcolor);
        noStroke();
        rect(0.0, 0.5, 2.0, 1.0);
        stroke(this.fgcolor);
        strokeWeight(2.0 / 3.0);
        line(-1.0, 0.0, 1.0, 0.0);
        noStroke();
        circle(0.0, 1.0, 2.0 / 3.0);
        circle(0.0, -1.0, 2.0 / 3.0);
        break;

      default:
        // Default is blank tile (with wings)
        break;
    }

    // draw "wings" (circles at each corner)
    fill(this.bgcolor);
    noStroke();
    circle(-1.0, -1.0, 4.0 / 3.0);
    circle(1.0, -1.0, 4.0 / 3.0);
    circle(1.0, 1.0, 4.0 / 3.0);
    circle(-1.0, 1.0, 4.0 / 3.0);

    pop();
  }

  // draw a diamond
  diamond(x, y, size) {
    beginShape();
    vertex(x, y - size / 2.0);
    vertex(x + size / 2.0, y);
    vertex(x, y + size / 2.0);
    vertex(x - size / 2.0, y);
    endShape(CLOSE);
  }

  show1(x, y, size) {
    push();
    rectMode(CENTER);
    ellipseMode(CENTER);
    strokeCap(SQUARE);
    translate(x, y);
    rotate(this.rotation);
    scale(size / 2.0);

    // draw tile background
    fill(this.bgcolor);
    noStroke();
    square(0.0, 0.0, 2.0);

    // Adjustments to make tiles 1 and 6 line up
    let a = 0.17;
    let b = 0.07;

    switch (this.type) {
      case 1:
        // Tile 1: two lines
        noFill();
        stroke(this.fgcolor);
        strokeWeight(sqrt(2.0 / 3.0) / 2.0 + b);
        line(-1.0 / 3.0 + a, -1.0 - a, 1.0 + a, 1.0 / 3.0 - a);
        line(-1.0 - a, -1.0 / 3.0 + a, 1.0 / 3.0 - a, 1.0 + a);
        fill(this.fgcolor);
        noStroke();
        this.diamond(0.0, -1.0, 2.0 / 3.0);
        this.diamond(0.0, 1.0, 2.0 / 3.0);
        this.diamond(-1.0, 0.0, 2.0 / 3.0);
        this.diamond(1.0, 0.0, 2.0 / 3.0);
        break;

      case 2:
        // Tile 2: line and dots
        stroke(this.fgcolor);
        strokeWeight(2.0 / 3.0);
        line(-1.0, 0.0, 1.0, 0.0);
        fill(this.fgcolor);
        noStroke();
        this.diamond(0.0, -1.0, 2.0 / 3.0);
        this.diamond(0.0, 1.0, 2.0 / 3.0);
        this.diamond(-1.0, 0.0, 2.0 / 3.0);
        this.diamond(1.0, 0.0, 2.0 / 3.0);
        break;

      case 3:
        // Tile 3: four dots (on edges)
        fill(this.fgcolor);
        noStroke();
        this.diamond(0.0, -1.0, 2.0 / 3.0);
        this.diamond(0.0, 1.0, 2.0 / 3.0);
        this.diamond(-1.0, 0.0, 2.0 / 3.0);
        this.diamond(1.0, 0.0, 2.0 / 3.0);
        break;

      case 4:
        // Tile 4:solid (except wings)
        fill(this.fgcolor);
        noStroke();
        square(0.0, 0.0, 2.0);
        this.diamond(0.0, -1.0, 2.0 / 3.0);
        this.diamond(0.0, 1.0, 2.0 / 3.0);
        this.diamond(-1.0, 0.0, 2.0 / 3.0);
        this.diamond(1.0, 0.0, 2.0 / 3.0);
        break;

      case 5:
        // Tile 5: cross
        stroke(this.fgcolor);
        strokeWeight(2.0 / 3.0);
        line(-1.0, 0.0, 1.0, 0.0);
        line(0.0, -1.0, 0.0, 1.0);
        fill(this.fgcolor);
        noStroke();
        this.diamond(0.0, -1.0, 2.0 / 3.0);
        this.diamond(0.0, 1.0, 2.0 / 3.0);
        this.diamond(-1.0, 0.0, 2.0 / 3.0);
        this.diamond(1.0, 0.0, 2.0 / 3.0);
        break;

      case 6:
        // Tile 6: line and dots
        noFill();
        stroke(this.fgcolor);
        strokeWeight(sqrt(2.0 / 3.0) / 2.0 + b);
        line(-1.0 / 3.0 + a, -1.0 - a, 1.0 + a, 1.0 / 3.0 - a);
        fill(this.fgcolor);
        noStroke();
        this.diamond(0.0, 1.0, 2.0 / 3.0);
        this.diamond(-1.0, 0.0, 2.0 / 3.0);
        this.diamond(0.0, -1.0, 2.0 / 3.0);
        this.diamond(1.0, 0.0, 2.0 / 3.0);
        break;

      case 7:
        // Tile 7: partial fill and dot
        fill(this.fgcolor);
        noStroke();
        rect(0.0, 0.5, 2.0, 1.0);
        stroke(this.fgcolor);
        strokeWeight(2.0 / 3.0);
        line(-1.0, 0.0, 1.0, 0.0);
        fill(this.fgcolor);
        noStroke();
        this.diamond(0.0, -1.0, 2.0 / 3.0);
        this.diamond(0.0, 1.0, 2.0 / 3.0);
        this.diamond(-1.0, 0.0, 2.0 / 3.0);
        this.diamond(1.0, 0.0, 2.0 / 3.0);
        break;

      default:
        // Default is blank tile (with wings)
        break;
    }

    // draw "wings" (diamonds at each corner)
    fill(this.bgcolor);
    noStroke();
    this.diamond(-1.0, -1.0, 4.0 / 3.0);
    this.diamond(1.0, -1.0, 4.0 / 3.0);
    this.diamond(1.0, 1.0, 4.0 / 3.0);
    this.diamond(-1.0, 1.0, 4.0 / 3.0);

    pop();
  }

  show(x, y, size) {
    if (this.inverted) {
      this.bgcolor = color2;
      this.fgcolor = color1;
    } else {
      this.bgcolor = color1;
      this.fgcolor = color2;
    }
    if (tileset === 1) {
      this.show1(x, y, size);
    } else {
      this.show0(x, y, size);
    }
  }
}
