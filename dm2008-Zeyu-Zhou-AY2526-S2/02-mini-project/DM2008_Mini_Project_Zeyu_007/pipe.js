class Pipe {
  constructor(x) {
    this.x = x;
    this.w = PIPE_W;
    this.speed = PIPE_SPEED;

    // randomize gap position
    const margin = 40;
    const gapY = random(margin, height - margin - PIPE_GAP);

    this.top = gapY; // bottom of top pipe
    this.bottom = gapY + PIPE_GAP; // top of bottom pipe

    this.passed = false; // for scoring once per pipe
  }

  update() {
    this.x -= this.speed;
    
    //check if bird has passed pipe X and make sure only add 1
    if(bird.pos.x - bird.r > this.x && !this.passed){
      //check if bird is within the gap Y
      if(bird.pos.y - bird.r > this.top && 
         bird.pos.y + bird.r < this.bottom && 
         !gameOver){
        this.passed = true;
        scoreSFX.play();
        score ++;
      }
    }
  }

  show() {
    fill(120, 200, 160, 0);
    rect(this.x, 0, this.w, this.top); // top pipe
    rect(this.x, this.bottom, this.w, height - this.bottom); // bottom pipe
    
    //btm towers
    image(tower, this.x-7, this.bottom-10, this.w+15);
    //top towers
    push();
    translate(this.x, this.top);
    scale(1, -1);
    image(tower, -7, -10, this.w+15);
    pop();
    
  }

  offscreen() {
    return this.x + this.w < 0;
  }

  // collision detection method
  // Circle-rect collision check (simple version)
  hits(bird) {
     const withinX = (bird.pos.x + bird.r > this.x) && (bird.pos.x - bird.r < this.x + this.w); //storing a boolean
     const aboveGap = bird.pos.y - bird.r < this.top;
     const belowGap = bird.pos.y + bird.r > this.bottom;
     return withinX && (aboveGap || belowGap);
  }
}