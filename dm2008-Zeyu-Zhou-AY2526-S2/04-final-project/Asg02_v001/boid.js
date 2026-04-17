class Boid{
    constructor(){
        this.position = createVector(random(width), random(height));
        this.velocity = p5.Vector.random2D();
        this.velocity.setMag(random(2, 4));
        this.acceleration = createVector();
        this.maxForce = 0.5; // how fast boids turn to aligin. Controllable
        this.maxSpeed = 4; //Controllable
        this.perceptionRaiuds = 50; //Controllable
    }

    // boids teleports back from the other side of the screen
    edges(){
        if(this.position.x > width){
            this.position.x = 0;
        } else if(this.position.x < 0){
            this.position.x = width;
        }

        if(this.position.y > height){
            this.position.y = 0;
        } else if(this.position.y < 0){
            this.position.y = height;
        }
    }

    //check all the boids within the raiuds, calculate and return the average direction and steer towards it
    align(boids){
        //let perceptionRaiuds = 50; //make this a button
        let steeringVel = createVector();
        let totalBoidInRadius = 0;

        for(let other of boids){
            let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
            if(other != this && d < this.perceptionRaiuds){
                steeringVel.add(other.velocity); // add all boids velocity
                totalBoidInRadius++;
            }
        }

        if(totalBoidInRadius > 0){
            steeringVel.div(totalBoidInRadius); // divide the total vel with no. of boids (desired velocity)
            steeringVel.setMag(this.maxSpeed); // fix max speed
            steeringVel.sub(this.velocity); // this is the velocity for steering
            steeringVel.limit(this.maxForce); // limit steering force
        }
        return steeringVel;
    }

    // check all the boids within the radious, calculate and return the average position and steer towards it
    cohesion(boids){
        //let perceptionRaiuds = 50; //make this a button
        let desireLoc = createVector();
        let totalBoidInRadius = 0;

        for(let other of boids){
            let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
            if(other != this && d < this.perceptionRaiuds){
                desireLoc.add(other.position); // add all boids position
                totalBoidInRadius++;
            }
        }

        if(totalBoidInRadius > 0){
            desireLoc.div(totalBoidInRadius); //divide total pos with no. of boids (desired pos)
            desireLoc.sub(this.position);  // this is the vector to go (not the velocity)
            desireLoc.setMag(this.maxSpeed); // fix max speed
            desireLoc.sub(this.velocity);    // why sub velocity again???? Go ask AI
            desireLoc.limit(this.maxForce);       
        }
        return desireLoc;
    }

     // check all the boids within the radious, calculate and return the average position and steer towards it
    seperation(boids){
        //let perceptionRaiuds = 50; //make this a button
        let desireLoc = createVector();
        let totalBoidInRadius = 0;

        for(let other of boids){
            let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
            if(other != this && d < this.perceptionRaiuds){
                let diff = p5.Vector.sub(this.position, other.position)
                diff.mult(1 / d); // difference to be inverstly proportion to distance. How does this line achieve this? 
                //I feel like I can control the proportion part to affect how violently boids react to distance. Maybe create a responseForce and multiply by diff?
                desireLoc.add(diff); // add all diff value
                totalBoidInRadius++;
            }
        }

        if(totalBoidInRadius > 0){
            desireLoc.div(totalBoidInRadius); //divide total diff with no. of boids (desired direction)
            desireLoc.setMag(this.maxSpeed); // fix max speed
            desireLoc.sub(this.velocity);    // find the desired velocity
            desireLoc.limit(this.maxForce);       
        }
        return desireLoc;
    }

    flock(boids){
        this.acceleration.mult(0); // to prevent acceleration keep stacking in create chaos behaviour

        let alignment = this.align(boids);
        let cohesion = this.cohesion(boids);
        let seperation = this.seperation(boids);

        seperation.mult(seperationSlider.value());
        cohesion.mult(cohesionSlider.value());
        alignment.mult(alignSlider.value());

        this.acceleration.add(alignment); //add the alignment force in
        this.acceleration.add(cohesion); // add the cohesion force in
        this.acceleration.add(seperation);
    }

    update(){
        this.position.add(this.velocity);
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed);

        this.acceleration.mult(0); // to prevent acceleration keep stacking in create chaos behaviour
    }

    show(){      
        // Calculate angle of heading
        let theta = this.velocity.heading() + PI / 2;
  
        stroke(200, 100);
        fill(255, 100);
  
        push();
        translate(this.position.x, this.position.y); // Move to boid location
        rotate(theta); // Rotate based on velocity
  
        // Draw triangle 
        let r = 5; // Size of boid // I think it is reasonable that as triangle gets bigger, check radius should get bigger
        triangle(0, -r * 2, -r, r * 2, r, r * 2); 
        // triangle (x1, y1, x2, y2, x3, y3) // change *2 to change triangle height // change x2 & x3 r to make triangle wider
        // x1, y1 is the top point. 
        // x2, y2 is the btm left point. 
        // x3, y3 is the btm right point
  
        pop();    
    }
}