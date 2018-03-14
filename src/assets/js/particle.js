class Particle {
    constructor(x, y, mood, r, g, b, debug = true) {
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
        console.log(this.bounds);
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
            return false;
        } else {
            const directionX = this.x - this.targetX;
            const directionY = this.y - this.targetY;

            if (directionX > 0) {
                this.x -= 1;
            } else if (directionX < 0) {
                this.x += 1;
            }

            if (directionY > 0) {
                this.y -= 1;
            } else if (directionY < 0) {
                this.y += 1;
            }

            return true;
        }
    }
}

function createParticles(numberOfParticles) {
    const result = [];

    for (var i = 0; i < numberOfParticles; i++) {
        const mood = random(1);

        const distX = mood * width / 2;
        const distY = mood * height / 2;

        const color = colors[floor(random(colors.length))];

        const newX = floor(random(width / 2 - distX, width / 2 + distX));
        const newY = floor(random(height / 2 - distY, height / 2 + distY));

        result.push(new Particle(newX, newY, mood, color.r, color.g, color.b));
    }

    return result;
}
