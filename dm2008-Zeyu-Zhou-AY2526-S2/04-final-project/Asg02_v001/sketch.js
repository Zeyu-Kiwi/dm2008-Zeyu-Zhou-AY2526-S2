const flock = [];
let boidCount = 100; // controllable
let alignSlider, cohesionSlider, seperationSlider;
let maxForceSlider, maxSpeedSlider, radiusSlider;

let controlPanel;

let h, w, size;

function setup() {
  createCanvas(windowWidth, windowHeight);
  controlPanel = createDiv();
  controlPanel.position(10, 10);

  alignSlider = createSlider(0, 1, 0.5, 0.1);
  cohesionSlider = createSlider(0, 1, 0.5, 0.1);
  seperationSlider = createSlider(0, 1, 0.5, 0.1);

  alignSlider.parent(controlPanel);
  cohesionSlider.parent(controlPanel);
  seperationSlider.parent(controlPanel);

  setBoidsInitialValue();

  for(let i = 0; i < boidCount; i++){
    flock.push(new Boid());
  }
}

function draw() {
  background(0, 0, 0, 50);

  for(let boid of flock){
    boid.edges();
    boid.flock(flock);
    boid.update();
    boid.show(h,w, size);
  }
}

function setBoidsInitialValue(){
  h = 5;
  w = 5;
  size = 1;
}
