// orginal code by frutose: https://editor.p5js.org/frutose/sketches/Vqru1IjAK
// sprites from: bulbapedia: https://bulbapedia.bulbagarden.net/wiki/Main_Page 

let pacman;
let grid = [];
let rows, cols;
const w = 15; //cell length (standard w = 10)
let speedX = 0;
let speedY = 0;
let totalScore = 0;
let p;
let r;
let thetaoff = 0;
let dir; //equals 0 if up arrow is pressed, 1 if right arrow is pressed, 2 if down arrow is pressed, 3 if left arrow is pressed
let neighbors = [];
let img;
let down;
let up;
let left;
let right;
function preload() {
  grass = loadImage('grass-dp.png');
  down = loadImage('down.png');
  up = loadImage("up.png");
  left = loadImage("left.png")
  right = loadImage("right.png")
}

function setup() {
  createCanvas(26 * w, 20 * w, WEBGL);
  rectMode(CENTER);
  noStroke();
  textSize(w * 5);
  rows = height / w + 1;
  cols = width / w + 1;
  translate(w / 2, w / 2);
  for (let i = 0; i < rows; i++) {
    grid[i] = [];
    for (let j = 0; j < cols; j++) {
      grid[i][j] = new Cell(w * (j + 0), w * (i + 0));
    }
  }
  pacman = new Pacman(13 * w, 15 * w, w);
  p = createP("Score: " + totalScore);
  level1();
}

function draw() {
  background(0);
  translate(-width/2, -height/2); 
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      grid[i][j].show();
      grid[i][j].total();
    }
  }
  pacman.show();
  pacman.move();

  p.html("Score: " + totalScore);
  if (win()) {
    push();
    fill(205, 205, 40);
    stroke(5);
    text("YOU WON!", 0, -height / 2);
    setTimeout(noLoop, 100);
    pop();
  }
}

class Pacman {
  constructor(x, y, diameter) {
    this.x = x;
    this.y = y;
    this.d = diameter;
  }

  show() { // CONTROLS MOUTH
    let theta = 0;
    if (speedY < 0) {
      // UP
      image(up, this.x - 15, this.y - 20)
    } else if (speedY > 0) { 
      // DOWN
      image(down, this.x - 15, this.y - 20)
    } else if (speedX < 0) {
      // LEFT
      image(left, this.x, this.y - 24)
    } else if (speedX > 0) {
      // RIGHT
      image(right, this.x, this.y - 24)
    } else {
      if (dir == 0) {
        image(up, this.x - 15, this.y - 26)
      } else if (dir == 1) {
        // DOWN
        image(down, this.x - 15, this.y - 26)
      } else if (dir == 2) {
        // LEFT
        image(left, this.x - 15, this.y - 26)
      } else if (dir == 3) {
        // RIGHT
        image(right, this.x - 15, this.y - 24);
      } else {
        // LEFT
        image(left, this.x - 15, this.y - 24);
      }
    }
    thetaoff += 0.1;
  }

  move() {
    checkNeighbors(this.x, this.y, neighbors);
    if (this.y % w == 0 && this.x % w == 0) {
      if (neighbors[3] || neighbors[1]) {
        speedX = 0;
      }
      if (neighbors[0] || neighbors[2]) {
        speedY = 0;
      }
      if (dir == 2 && neighbors[3] == false) {
        speedX = -w / 10;
        speedY = 0;
      }
      if (dir == 3 && neighbors[1] == false) {
        speedX = w / 10;
        speedY = 0;
      }
      if (dir == 0 && neighbors[0] == false) {
        speedY = -w / 10;
        speedX = 0;
      }
      if (dir == 1 && neighbors[2] == false) {
        speedY = w / 10;
        speedX = 0;
      }
    }
    this.x += speedX;
    this.y += speedY;
    //looping the pacman through the canvas
    if (this.x < -w / 2) {
      this.x = width + w / 2;
    }
    if (this.x > width + w / 2) {
      this.x = -w / 2;
    }
    if (this.y < -w / 2) {
      this.y = height + w / 2;
    }
    if (this.y > height + w / 2) {
      this.y = -w / 2;
    }
  }
}

class Cell {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.wall = false; //is this cell a wall?
    this.score = false; //this cell increases the total score?
    this.power = false; // is this cell a power token?
    this.time = 0;
  }

  show() {
    if (this.wall == true) {
      fill(color(39,159,16));
      // image(grass, 0, 0);
      // noFill();
      texture(grass);
      rect(this.x, this.y, w, w);
      this.score = false;
    } else if (this.score) {
      fill("white");
      ellipse(this.x, this.y, w / 5);
    }
  }

  total() {
    if (this.score) {
      let d = dist(pacman.x, pacman.y, this.x, this.y);
      if (d < w / 2) {
        totalScore++;
        this.score = false;
      }
    }
    if (this.power) {
      let d = dist(pacman.x, pacman.y, this.x, this.y);
      if (d < w / 2) {
        totalScore++;
        let time = 6000;
        this.power = false;
      }
    }
  }
}

function keyPressed() {
  if (keyCode === UP_ARROW) {
    dir = 0;
  }
  if (keyCode === DOWN_ARROW) {
    dir = 1;
  }
  if (keyCode === LEFT_ARROW) {
    dir = 2;
  }
  if (keyCode === RIGHT_ARROW) {
    dir = 3;
  }
}

function checkNeighbors(x, y, array) {
  if (array instanceof Array) {
    let i = floor(y / w);
    let j = floor(x / w);
    let top = grid[i - 1][j];
    let right = grid[i][j + 1];
    let bottom = grid[i + 1][j];
    let left = grid[i][j - 1];
    if (!top) {
      top = false;
    }
    if (!right) {
      right = false;
    }
    if (!bottom) {
      bottom = false;
    }
    if (!left) {
      left = false;
    }
    array[0] = top.wall;
    array[1] = right.wall;
    array[2] = bottom.wall;
    array[3] = left.wall;
  }
}

function win() {
  let count = 0;
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (grid[i][j].score || grid[i][j].token) {
        count++;
      }
    }
  }
  if (count == 0) {
    return true;
  } else {
    return false;
  }
}

function level1() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      grid[i][j].score = true;
    }
  }
  for (let i = 0; i < cols; i++) {
    grid[0][i].wall = true;
    grid[rows - 1][i].wall = true;
  }
  for (let i = 0; i < rows; i++) {
    grid[i][0].wall = true;
    grid[i][cols - 1].wall = true;
  }
  grid[10][0].wall = false;
  grid[10][0].score = false;
  grid[1][13].wall = true;
  grid[2][13].wall = true;
  grid[4][13].wall = true;
  grid[5][13].wall = true;
  grid[6][13].wall = true;
  grid[4][12].wall = true;
  grid[4][11].wall = true;
  grid[4][10].wall = true;
  grid[12][13].wall = true;
  grid[13][13].wall = true;
  grid[14][13].wall = true;
  grid[16][13].wall = true;
  grid[17][13].wall = true;
  grid[18][13].wall = true;
  grid[2][2].wall = true;
  grid[2][3].wall = true;
  grid[2][4].wall = true;
  grid[3][2].wall = true;
  grid[3][3].wall = true;
  grid[3][4].wall = true;
  grid[4][2].wall = true;
  grid[4][3].wall = true;
  grid[4][4].wall = true;
  grid[6][2].wall = true;
  grid[6][3].wall = true;
  grid[6][4].wall = true;
  grid[2][6].wall = true;
  grid[2][7].wall = true;
  grid[2][8].wall = true;
  grid[3][6].wall = true;
  grid[3][7].wall = true;
  grid[3][8].wall = true;
  grid[4][6].wall = true;
  grid[4][7].wall = true;
  grid[4][8].wall = true;
  grid[2][9].wall = true;
  grid[2][10].wall = true;
  grid[2][11].wall = true;
  grid[8][1].wall = true;
  grid[8][2].wall = true;
  grid[8][3].wall = true;
  grid[8][4].wall = true;
  grid[8][5].wall = true;
  grid[8][6].wall = true;
  grid[9][1].wall = true;
  grid[9][2].wall = true;
  grid[9][3].wall = true;
  grid[9][4].wall = true;
  grid[9][5].wall = true;
  grid[9][6].wall = true;
  grid[11][1].wall = true;
  grid[11][2].wall = true;
  grid[11][3].wall = true;
  grid[11][4].wall = true;
  grid[11][5].wall = true;
  grid[11][6].wall = true;
  grid[12][1].wall = true;
  grid[12][2].wall = true;
  grid[12][3].wall = true;
  grid[12][4].wall = true;
  grid[12][5].wall = true;
  grid[12][6].wall = true;
  grid[6][6].wall = true;
  grid[6][7].wall = true;
  grid[6][8].wall = true;
  grid[6][9].wall = true;
  grid[6][10].wall = true;
  grid[6][11].wall = true;
  grid[7][8].wall = true;
  grid[8][8].wall = true;
  grid[9][8].wall = true;
  grid[11][8].wall = true;
  grid[12][8].wall = true;
  grid[8][10].wall = true;
  grid[8][11].wall = true;
  grid[8][12].wall = true;
  grid[9][10].wall = true;
  grid[10][10].wall = true;
  grid[11][10].wall = true;
  grid[12][10].wall = true;
  grid[12][11].wall = true;
  grid[12][12].wall = true;
  grid[14][2].wall = true;
  grid[14][3].wall = true;
  grid[14][4].wall = true;
  grid[15][4].wall = true;
  grid[16][4].wall = true;
  grid[16][5].wall = true;
  grid[16][6].wall = true;
  grid[14][6].wall = true;
  grid[14][7].wall = true;
  grid[14][8].wall = true;
  grid[14][9].wall = true;
  grid[14][10].wall = true;
  grid[14][11].wall = true;
  grid[16][12].wall = true;
  grid[16][11].wall = true;
  grid[16][10].wall = true;
  grid[16][1].wall = true;
  grid[16][2].wall = true;
  grid[18][2].wall = true;
  grid[18][3].wall = true;
  grid[18][4].wall = true;
  grid[18][5].wall = true;
  grid[18][6].wall = true;
  grid[18][7].wall = true;
  grid[18][8].wall = true;
  grid[18][9].wall = true;
  grid[18][10].wall = true;
  grid[18][11].wall = true;
  grid[17][8].wall = true;
  grid[16][8].wall = true;
  for (let i = 0; i < cols / 2 + 1; i++) {
    for (let j = 0; j < rows; j++) {
      let temp = grid[j][i].wall;
      grid[j][26 - i].wall = temp;
    }
  }
  for (let i = 0; i < rows; i++) {
    grid[i][cols - 1].wall = true;
  }
  grid[10][26].wall = false;
  grid[10][26].score = false;
  for (let i = 9; i < 18; i++) {
    for (let j = 6; j < 13; j++) {
      grid[j][i].score = false;
    }
  }
  grid[15][13].score = false;
}
