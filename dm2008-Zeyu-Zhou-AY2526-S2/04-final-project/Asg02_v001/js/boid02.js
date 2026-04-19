class Boid {
  constructor() {
    this.position = createVector(random(width), random(height));
    this.velocity = p5.Vector.random2D();
    this.velocity.setMag(random(2, 4));
    this.acceleration = createVector();

    this.maxForce = 0.15;
    this.maxSpeed = 3;
    this.perceptionRadius = 50;
  }

  edges() {
    if (edgeMode === "teleport") {
      if (this.position.x > width) this.position.x = 0;
      else if (this.position.x < 0) this.position.x = width;

      if (this.position.y > height) this.position.y = 0;
      else if (this.position.y < 0) this.position.y = height;
    } 
    else if (edgeMode === "avoid") {
      this.avoidEdges();
    }
  }

  avoidEdges() {
    let margin = 60;   // how close to edge before steering away
    let turnForce = 0.3;

    let steer = createVector(0, 0);

    if (this.position.x < margin) {
      steer.x = turnForce;
    } else if (this.position.x > width - margin) {
      steer.x = -turnForce;
    }

    if (this.position.y < margin) {
      steer.y = turnForce;
    } else if (this.position.y > height - margin) {
      steer.y = -turnForce;
    }

    this.acceleration.add(steer);
  }

  // Returns the shortest vector from this boid to another boid.
  // In wrap mode, this allows boids on opposite edges to still "see" each other.
  getOffsetTo(other) {
    let dx = other.position.x - this.position.x;
    let dy = other.position.y - this.position.y;

    if (edgeMode === "avoid") {
      if (dx > width / 2) dx -= width;
      else if (dx < -width / 2) dx += width;

      if (dy > height / 2) dy -= height;
      else if (dy < -height / 2) dy += height;
    }

    return createVector(dx, dy);
  }

  align(qtree) {
    let steeringVel = createVector();
    let totalBoidInRadius = 0;

    const nearbyPoints = qtree.query(
      new Circle(this.position.x, this.position.y, this.perceptionRadius)
    );

    for (let point of nearbyPoints) {
      let other = point.userData;
      if (other === this) continue;

      let offset = this.getOffsetTo(other);
      let d = offset.mag();

      if (d < this.perceptionRadius) {
        steeringVel.add(other.velocity);
        totalBoidInRadius++;
      }
    }

    if (totalBoidInRadius > 0) {
      steeringVel.div(totalBoidInRadius);
      steeringVel.setMag(this.maxSpeed);
      steeringVel.sub(this.velocity);
      steeringVel.limit(this.maxForce);
    }

    return steeringVel;
  }

  cohesion(qtree) {
    let desiredLoc = createVector();
    let totalBoidInRadius = 0;

    const nearbyPoints = qtree.query(
      new Circle(this.position.x, this.position.y, this.perceptionRadius)
    );

    for (let point of nearbyPoints) {
      let other = point.userData;
      if (other === this) continue;

      let offset = this.getOffsetTo(other);
      let d = offset.mag();

      if (d < this.perceptionRadius) {
        let wrappedNeighborPos = p5.Vector.add(this.position, offset);
        desiredLoc.add(wrappedNeighborPos);
        totalBoidInRadius++;
      }
    }

    if (totalBoidInRadius > 0) {
      desiredLoc.div(totalBoidInRadius);
      desiredLoc.sub(this.position);
      desiredLoc.setMag(this.maxSpeed);
      desiredLoc.sub(this.velocity);
      desiredLoc.limit(this.maxForce);
    }

    return desiredLoc;
  }

  separation(qtree) {
    let desiredLoc = createVector();
    let totalBoidInRadius = 0;

    const nearbyPoints = qtree.query(
      new Circle(this.position.x, this.position.y, this.perceptionRadius)
    );

    for (let point of nearbyPoints) {
      let other = point.userData;
      if (other === this) continue;

      let offset = this.getOffsetTo(other);
      let d = offset.mag();

      if (d < this.perceptionRadius && d > 0) {
        let diff = createVector(-offset.x, -offset.y);
        diff.div(d * d);
        desiredLoc.add(diff);
        totalBoidInRadius++;
      }
    }

    if (totalBoidInRadius > 0) {
      desiredLoc.div(totalBoidInRadius);
      desiredLoc.setMag(this.maxSpeed);
      desiredLoc.sub(this.velocity);
      desiredLoc.limit(this.maxForce);
    }

    return desiredLoc;
  }

  flock(qtree) {
    this.acceleration.mult(0);

    let alignment = this.align(qtree);
    let cohesion = this.cohesion(qtree);
    let separation = this.separation(qtree);

    separation.mult(separationSlider.value());
    cohesion.mult(cohesionSlider.value());
    alignment.mult(alignSlider.value());

    this.acceleration.add(alignment);
    this.acceleration.add(cohesion);
    this.acceleration.add(separation);
  }

  update() {
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this.position.add(this.velocity);

    this.acceleration.mult(0);
  }

  getFillColor() {
    if (colorModeState === "solid") {
      return color(0, 0, 100, 85); // white in HSB
    }

    // Convert heading to a hue from 0 to 360
    let angle = degrees(this.velocity.heading());
    let hueValue = (angle + 360) % 360;

    return color(hueValue, 80, 100, 90);
  }

  show(h, w, size) {
    let theta = this.velocity.heading() + PI / 2;

    noStroke();
    fill(this.getFillColor());

    push();
    translate(this.position.x, this.position.y);
    rotate(theta);

    triangle(
      0, -h * size,
      -w * size, h * size,
      w * size, h * size
    );
    pop();
  }

  /*drawWrappedGhosts(theta, h, w, size) {
    const margin = max(h, w) * size * 2;
    const positions = [];

    if (this.position.x < margin) positions.push(createVector(this.position.x + width, this.position.y));
    if (this.position.x > width - margin) positions.push(createVector(this.position.x - width, this.position.y));
    if (this.position.y < margin) positions.push(createVector(this.position.x, this.position.y + height));
    if (this.position.y > height - margin) positions.push(createVector(this.position.x, this.position.y - height));

    if (this.position.x < margin && this.position.y < margin) positions.push(createVector(this.position.x + width, this.position.y + height));
    if (this.position.x < margin && this.position.y > height - margin) positions.push(createVector(this.position.x + width, this.position.y - height));
    if (this.position.x > width - margin && this.position.y < margin) positions.push(createVector(this.position.x - width, this.position.y + height));
    if (this.position.x > width - margin && this.position.y > height - margin) positions.push(createVector(this.position.x - width, this.position.y - height));

    fill(this.getFillColor());

    for (let pos of positions) {
      push();
      translate(pos.x, pos.y);
      rotate(theta);
      triangle(
        0, -h * size,
        -w * size, h * size,
        w * size, h * size
      );
      pop();
    }
  }*/
}