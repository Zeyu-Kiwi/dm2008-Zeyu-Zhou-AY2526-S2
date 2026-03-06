class Bird {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0); 
    this.r = 16; // for collision + draw
    this.gravity = 0.45; // constant downward force
    this.flapStrength = -8.0; // negative = upward movement
    
    this.angle = 0;
    this.antiCWRotate = -radians(45)
    this.CWRotate = radians(45)
  }

  applyForce(fy) {
    this.acc.y += fy; 
  }

  flap() {
    // instant upward kick (negative velocity = up)
    this.vel.y = this.flapStrength;
    if(!gamePause){
        jump.setVolume(0.3);
        jump.play();
    }
  }

  update() {
    // gravity
    this.applyForce(this.gravity);

    // integrate
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0); 
    
    // use map method to find the proportion of fall and rise to the rotaiton
    this.angle = map(this.vel.y, //set the original value to be the plane's Y
                     -10, 10, //idk why -10 & 10
                     this.antiCWRotate, this.CWRotate); 
    
    //constrain the 1st value between the 2nd and 3rd
    this.angle = constrain(this.angle, this.antiCWRotate, this.CWRotate);

    // keep inside canvas vertically (simple constraints)
    if (this.pos.y < this.r) {
      this.pos.y = this.r;
      this.vel.y = 0;
    }
    if (this.pos.y > height - this.r) {
      this.pos.y = height - this.r;
      this.vel.y = 0;
      // treat touching the ground as game over
      crash.play();
      gameOver = true;
      gameOverScreen();
    }
  }

  show() {
    fill(255, 205, 80, 0);
    circle(this.pos.x, this.pos.y, this.r * 2);
    
    push();
    imageMode(CENTER);
    translate(this.pos.x, this.pos.y);
    
    rotate(this.angle);
    
    image(plane, 0, 0, 1216/19, 1216/19);
    pop();
  }
}