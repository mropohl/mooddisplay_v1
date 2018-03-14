class Particle {
    constructor(x, y, mood, r, g, b, debug = false) {
        this.x = x;
        this.y = y;
        this.targetX = x;
        this.targetY = y;
        this.r = r;
        this.g = g;
        this.b = b;
        this.mood = mood;
        this.debug = debug;
        this.bounds = null;
        this.firstDraw = true;
        this.speed = 0.5;
        this.m = null;
    }

    draw() {
        noStroke();
        fill("white");
        ellipse(this.x, this.y, 10);
        if (this.debug) {
            fill(255);
            stroke(0);
            text("Mood: " + this.mood, this.x, this.y + 10);
            strokeWeight(0.5);
            stroke(0, 0, 0);

            text("x: " + this.x + " | y: " + this.y, this.x, this.y + 20);
            strokeWeight(0.5);
            stroke(0, 0, 0);

            line(this.x, this.y, this.targetX, this.targetY);

            if (this.bounds) {
                strokeWeight(0.5);
                stroke(0, 0, 0);
                line(
                    this.bounds.x.negBoundMin,
                    this.bounds.y.negBoundMin,
                    this.bounds.x.posBoundMax,
                    this.bounds.y.negBoundMin
                );

                line(
                    this.bounds.x.negBoundMin,
                    this.bounds.y.negBoundMin,
                    this.bounds.x.negBoundMin,
                    this.bounds.y.posBoundMax
                );

                line(
                    this.bounds.x.negBoundMin,
                    this.bounds.y.posBoundMax,
                    this.bounds.x.posBoundMax,
                    this.bounds.y.posBoundMax
                );

                line(
                    this.bounds.x.posBoundMax,
                    this.bounds.y.negBoundMin,
                    this.bounds.x.posBoundMax,
                    this.bounds.y.posBoundMax
                );

                //inner

                line(
                    this.bounds.x.negBoundMax,
                    this.bounds.y.negBoundMax,
                    this.bounds.x.posBoundMin,
                    this.bounds.y.negBoundMax
                );

                line(
                    this.bounds.x.negBoundMax,
                    this.bounds.y.negBoundMax,
                    this.bounds.x.negBoundMax,
                    this.bounds.y.posBoundMin
                );

                line(
                    this.bounds.x.negBoundMax,
                    this.bounds.y.posBoundMin,
                    this.bounds.x.posBoundMin,
                    this.bounds.y.posBoundMin
                );

                line(
                    this.bounds.x.posBoundMin,
                    this.bounds.y.negBoundMax,
                    this.bounds.x.posBoundMin,
                    this.bounds.y.posBoundMin
                );
            }
        }
    }

    updateTargets(x, y, bounds) {
        this.targetX = x;
        this.targetY = y;
        this.bounds = bounds;
    }

    animate(mX, mY, maxDist) {
        const dx = mX - this.x;
        const dy = mY - this.y;

        const distance = Math.sqrt(dx * dx + dy * dy);
        const percent = distance / maxDist;

        this.r = colors[2].r * percent + colors[0].r * (1 - percent);
        this.g = colors[2].g * percent + colors[0].g * (1 - percent);
        this.b = colors[2].b * percent + colors[0].b * (1 - percent);

        if (this.x === this.targetX && this.y === this.targetY) {
            this.m = null;
            return false;
        } else {
            /*

            really interesting result

            const mX = (this.targetX - this.speed) / this.x;
            const mY = (this.targetY - this.speed) / this.y;

            Math.round((this.x = mX * this.x + this.speed));
            Math.round((this.y = mY * this.y + this.speed));
            */

            /*
            if (!this.m) {
                this.m =
                    Math.abs(this.y - this.targetY) /
                    Math.abs(this.x - this.targetX);
                console.log(this.m);
            }

            this.x = Math.round(this.m * this.x * 0.002);
            this.y = Math.round(this.m * this.y * 0.002);
*/

            const directionX = this.x - this.targetX;
            const directionY = this.y - this.targetY;

            if (directionX > 0) {
                this.x -= this.speed;
            } else if (directionX < 0) {
                this.x += this.speed;
            }

            if (directionY > 0) {
                this.y -= this.speed;
            } else if (directionY < 0) {
                this.y += this.speed;
            }

            return true;
        }
    }
}

function createParticles(numberOfParticles) {
    const result = [];

    for (var i = 0; i < numberOfParticles; i++) {
        const mood = random(1);

        const x = Math.round(random(width));
        const y = Math.round(random(height));

        result.push(new Particle(x, y, mood));
    }

    return result;
}
