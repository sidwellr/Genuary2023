const nballs = 12;
const weight = 4;

let balls;

function setup() {
  createCanvas(windowWidth, windowHeight);
  balls = [];
  for (let i = 0; i < nballs; i++) {
    let radius = random(75.0, 200.0);
    let location = createVector(random(radius, width - radius), random(radius, height - radius));
    let velocity = createVector(random(2.0, 4.0), random(2.0, 4.0));
    balls.push(new Ball(location, velocity, radius));
  }
}

function draw() {
  background(255, 250, 250);
  for (let ball of balls) {
    ball.move();
    ball.show();
  }
}

function keyPressed() {
  if (key === "s") {
    saveCanvas();
  }
}


class Ball {
  constructor(location, velocity, radius) {
    this.location = location;
    this.velocity = velocity;
    this.radius = radius;
  }
  
  move() {
    this.location.add(this.velocity);
    if (this.location.x - this.radius < 0.0 || this.location.x + this.radius > width) {
      this.velocity.x *= -1.0;
    }
    if (this.location.y - this.radius < 0.0 || this.location.y + this.radius > height) {
      this.velocity.y *= -1.0;
    }
  }
  
  show() {
    push();
    noFill();
    stroke(0);
    strokeWeight(weight);
    for (let r = this.radius; r >= 0.0; r -= 2.0 * weight) {
      circle(this.location.x, this.location.y, 2.0 * r);
    }
    pop()
  }
}