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
        this.pleasentness = mood;
        this.activation = mood;
        this.debug = debug;
        this.bounds = null;
        this.firstDraw = true;
        this.speed = 0.5;
        this.m = null;
        this.alpha = 255;
        this.scale = 5;
        this.targetScale = this.activation * 10 + 7;
        this.scalingUp = true;
    }

    draw() {
        noStroke();
        fill(255, 255, 255, this.alpha);
        ellipse(this.x, this.y, this.scale);
        this.debug && debugParticle(this);
        strokeWeight(0.5);
        stroke(0, 0, 0);
        //line(this.x, this.y, this.targetX, this.targetY);
    }

    updateTargets(x, y, bounds, alpha) {
        this.targetX = x;
        this.targetY = y;
        this.bounds = bounds;
        this.alpha = alpha;
        this.targetScale = this.activation * 12 + 10;
    }

    animate(mX, mY, maxDist) {
        const dx = mX - this.x;
        const dy = mY - this.y;

        const distance = Math.sqrt(dx * dx + dy * dy);
        const percent = distance / maxDist;

        this.r = colors[2].r * percent + colors[0].r * (1 - percent);
        this.g = colors[2].g * percent + colors[0].g * (1 - percent);
        this.b = colors[2].b * percent + colors[0].b * (1 - percent);

        if (this.scale < this.targetScale && this.scalingUp) {
            this.scale = this.scale + 1 * this.mood;
        }

        if (this.scale >= this.targetScale && this.scalingUp) {
            this.scalingUp = false;
        }

        if (this.scale > 5 && !this.scalingUp) {
            this.scale = this.scale - 1 * this.mood;
        }

        if (this.scale <= 5 && !this.scalingUp) {
            this.scalingUp = true;
        }

        if (
            this.x < this.targetX + 1 &&
            this.x > this.targetX - 1 &&
            this.y < this.targetY + 1 &&
            this.y > this.targetY - 1
        ) {
            //this.m = null;
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

        let x = 0;
        let y = 0;

        const { xBounds, yBounds } = calculateBounds(mood, width, height);

        do {
            x = random(width);
        } while (
            !(
                (x > xBounds.negBoundMin && x < xBounds.negBoundMax) ||
                (x > xBounds.posBoundMin && x < xBounds.posBoundMax)
            )
        );

        do {
            y = random(height);
        } while (
            !(
                (y > yBounds.negBoundMin && y < yBounds.negBoundMax) ||
                (y > yBounds.posBoundMin && y < yBounds.posBoundMax)
            )
        );

        result.push(new Particle(x, y, mood));
    }

    return result;
}

const debugParticle = target => {
    fill(255);
    stroke(0);
    text("Mood: " + target.mood, target.x, target.y + 10);
    strokeWeight(0.5);
    stroke(0, 0, 0);

    text("x: " + target.x + " | y: " + target.y, target.x, target.y + 20);
    strokeWeight(0.5);
    stroke(0, 0, 0);

    line(target.x, target.y, target.targetX, target.targetY);

    if (target.bounds && false) {
        strokeWeight(0.5);
        stroke(0, 0, 0);
        line(
            target.bounds.x.negBoundMin,
            target.bounds.y.negBoundMin,
            target.bounds.x.posBoundMax,
            target.bounds.y.negBoundMin
        );

        line(
            target.bounds.x.negBoundMin,
            target.bounds.y.negBoundMin,
            target.bounds.x.negBoundMin,
            target.bounds.y.posBoundMax
        );

        line(
            target.bounds.x.negBoundMin,
            target.bounds.y.posBoundMax,
            target.bounds.x.posBoundMax,
            target.bounds.y.posBoundMax
        );

        line(
            target.bounds.x.posBoundMax,
            target.bounds.y.negBoundMin,
            target.bounds.x.posBoundMax,
            target.bounds.y.posBoundMax
        );

        //inner

        line(
            target.bounds.x.negBoundMax,
            target.bounds.y.negBoundMax,
            target.bounds.x.posBoundMin,
            target.bounds.y.negBoundMax
        );

        line(
            target.bounds.x.negBoundMax,
            target.bounds.y.negBoundMax,
            target.bounds.x.negBoundMax,
            target.bounds.y.posBoundMin
        );

        line(
            target.bounds.x.negBoundMax,
            target.bounds.y.posBoundMin,
            target.bounds.x.posBoundMin,
            target.bounds.y.posBoundMin
        );

        line(
            target.bounds.x.posBoundMin,
            target.bounds.y.negBoundMax,
            target.bounds.x.posBoundMin,
            target.bounds.y.posBoundMin
        );
    }
};
