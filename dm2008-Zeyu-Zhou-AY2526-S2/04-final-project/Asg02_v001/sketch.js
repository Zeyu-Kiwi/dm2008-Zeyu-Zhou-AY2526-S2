const flock = [];
let boidCount = 100;
let alignSlider, cohesionSlider, seperationSlider;

function setup() {
  // If you want a canvas that fills the window
  // use createCanvas(windowWidth, windowHeight)
  createCanvas(500, 500);

  alignSlider = createSlider(0, 1, 0.5, 0.1);
  cohesionSlider = createSlider(0, 1, 0.5, 0.1);
  seperationSlider = createSlider(0, 1, 0.5, 0.1);

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
    boid.show();
  }
}
