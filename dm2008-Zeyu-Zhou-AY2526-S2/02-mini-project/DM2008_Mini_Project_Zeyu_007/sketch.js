/* ----------------- Globals ----------------- */
let gameStart = false;
let gamePause = false;
let gameOver = false;

let bird;
let pipes = [];
let score = 0;

let spawnCounter = 0; // simple timer
const SPAWN_RATE = 90; // ~ every 90 frames at 60fps ≈ 1.5s
const PIPE_SPEED = 2.5;
const PIPE_GAP = 160; // gap height (try 100–160)
const PIPE_W = 60;

let plane, tower, bg;
let crash, bgm01, jump01;

/* ----------------- Setup & Draw ----------------- */
function preload(){
  //load img
  plane = loadImage('img/plane_002.png');
  tower = loadImage('img/tower_02.png');
  bg = loadImage('img/city.jpg');
  
  //load audio
  crash = loadSound('audio/crash01.wav');
  bgm01 = loadSound('audio/bgm01.mp3');
  jump = loadSound('audio/jump01.wav');
  scoreSFX = loadSoung('audio/coin01.wav');
}

function setup() {
  createCanvas(480, 640);
  image(bg, 0, 0, 612*2, 343*2);
  bgm01.setVolume(0.5);
  bgm01.loop();
  
  noStroke();
  bird = new Bird(120, height / 2);
  // Start with one pipe so there's something to see
  pipes.push(new Pipe(width + 40));
}

function draw() {
  if(gameStart && !gameOver){
    image(bg, 0, 0, 612*2, 343*2);
    // 1a update world
    bird.update();
    
      // 1b spawn new pipes on a simple timer
    spawnCounter++;
    if (spawnCounter >= SPAWN_RATE) {
      pipes.push(new Pipe(width + 40));
      spawnCounter = 0;
    }
    
    // update + draw pipes
    for (let i = pipes.length - 1; i >= 0; i--) {
      pipes[i].update();
      pipes[i].show();

      // collision check with bird
      if (pipes[i].hits(bird)) {
        gameOver = true;
          crash.play();
        gameOverScreen();
      }

      // remove pipes that moved off screen
      if (pipes[i].offscreen()) {
        pipes.splice(i, 1);
      }
    }
    
    fill(255);
    textSize(45);
    text(score, width/2, height/4);
  }
  else if(!gameStart){
    fill(255);
    textSize(20);
    textAlign(CENTER);
    text('Tap Spacebar to start game!', width/2, height/4);
    text('Press E to pause and resume game.', width/2, height/4 + 30);
  }
  
  // 2) draw bird last so it's on top
  bird.show();
}

/* ----------------- Functions ----------------- */
function gameOverScreen(){
  push();
  rectMode(CENTER);
  noStroke();
  fill(255);
  rect(width/2, height/3, 200, 70);
  pop();
  
  fill(0);
  textSize(20);
  textAlign(CENTER);
    
  let txtLine = ['GAME OVER', 'Press X to restart']
  for (let i = 0; i < txtLine.length; i++) {
    text(txtLine[i], width/2, height/3 + i * 20);
  }
}

function restart(){
  gameStart = false;
  gamePause = false;
  gameOver = false;
  
  score = 0;
  pipes = [];
  createCanvas(480, 640);
  image(bg, 0, 0, 612*2, 343*2);
  bird.pos.x = 120;
  bird.pos.y = height/2;
  bird.angle = 0;
}

function pauseGame(){
  gamePause = !gamePause;
  if(gamePause && !gameOver){    
    noLoop();
  }
  else if(!gamePause && !gameOver){
    loop();
  }
}


/* ----------------- Input ----------------- */
function keyPressed() {
  // make the bird flap on space or UP arrow
  if ((key === ' ' || keyCode === UP_ARROW) && !gameOver && !gamePause) {
    gameStart = true;
    bird.flap();
  }
  
  if(key === 'e' || keyCode === 'E'){
    pauseGame()
    
  }
  
  if((key === 'x' || keyCode === 'X') && gameOver){
    restart();
  }
}

/* ----------------- Classes ----------------- */




