# What game did you choose and why?
I choose Flappy Bird. Firstly, I do not want to code two control system. Secondly, testing will require two player which I planned to work alone. Lastly, I already have an idea on how to reskin the game.

# What logic did you implement or modify?
1.	The bird will fall with gravity, and pressing spacebar will lift it up.
2.	The bird will rotate clockwise when it falls and rotates anticlockwise when it rise. I also constrain the rotation so it will not spin.
3.	The bird, ground and pillars have colliders so collision detection will trigger Game Over condition and pop up a simple Game Over screen.
4.	There is collision detection with the gap, so when bird passed through gap score increase by one.
5.	Player can restart game by pressing X and it will reset everything expect the BGM.
6.	There are SFXs implemented. It happens when bird flap, and bird crash.

# How does your scoring system work?
The script checks if the most left side of the bird has passed the most left side of the pillar. Then it will check if the bird is within the gap Y-axis. If both check is true, means the bird has passed the gap and not collide with the pillar. And that will add 1 score. 
Lastly, to prevent score keeps adding within that small timeframe when bird is within the gap, I add a condition check to allow only add one point per gap.

# What aesthetic choices did you make and how do they affect gameplay?
I picked a retro pixelated style. Because I felt like this kind of simple game fits the older days games’ pixelated style. I specifically picked plane as bird and skyscraper as pillar to insinuate 911 incident.

# What challenges did you encounter?
There were three major challenges I faced. First is the scoring detection. At first, I was thinking of drawing a thin rectangle at the end of the gap and make a collider. It was not very efficient and clean. It was till I followed Prof. Kapi’s guidance I realised I could made used of the existing value to detect gap collision.

The second challenge was to apply the skyscraper sprite properly on top and below. When applying the sprite at the bottom pillars, I realised the sprite gets squashed. So I customized a long skyscraper and only set where it will start drawing. Next, to flip the skyscraper, I used translate() to reset the position, then used scale() to flip the Y.

The last challenge was rotating the bird when it falls and rise. At first, I wanted to use setHeading(), then I realised it sets the direction but not rotation. So, I went back to using rotate(). After searching the web, I found a perfect method map(). It takes an origin value, and two sets of numbers. It will return a number that has the same proportion that is for the original value in the first set of numbers, and the return value between the second set of numbers. Using the bird’s y velocity as origin, the rough max. and min. velocity as first set of numbers, and the max upward rotation and downward rotation as the second set of numbers, I can convert the velocity to an angle. Lastly, suing constrain() to clamp the rotation to prevent it from spinning.

