const flock = [];

function setup() {
  // If you want a canvas that fills the window
  // use createCanvas(windowWidth, windowHeight)
  createCanvas(500, 500);
  for(let i = 0; i < 50; i++){
    flock.push(new Boid());
  }
}

function draw() {
  background('black');

  for(let boid of flock){
    boid.edges();
    boid.flock(flock);
    boid.update();
    boid.show();
  }
}
