class Boid{
    constructor(){
        this.position = createVector(random(width), random(height));
        this.velocity = p5.Vector.random2D();
        this.velocity.setMag(random(2, 4));
        this.acceleration = createVector(); // make this a button
        this.maxForce = 0.05; //what is this??? to limit the steering force???
        this.maxSpeed = 4; //make this a button
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

    //check all the boids within the raiuds, calculate and return the desired steering velocity
    align(boids){
        let perceptionRaiuds = 100; //make this a button
        let steeringVel = createVector();
        let totalBoidInRadius = 0;

        for(let other of boids){
            let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
            if(other != this && d < perceptionRaiuds){
                steeringVel.add(other.velocity);
                totalBoidInRadius++;
            }
        }

        if(totalBoidInRadius > 0){
            steeringVel.div(totalBoidInRadius);
            //steeringVel.setMag(this.maxSpeed);
            steeringVel.sub(this.velocity);    
            steeringVel.limit(this.maxForce);       
        }
        return steeringVel;
    }

    flock(boids){
        let alignment = this.align(boids);
        this.acceleration = alignment;
    }

    update(){
        this.position.add(this.velocity);
        this.velocity.add(this.acceleration);
    }

    show(){
        strokeWeight(8);
        stroke(255);
        point(this.position.x, this.position.y)
    }
}