class Particle {
    constructor(x, y, mood, r, g, b) {
        this.x = x;
        this.y = y;
        this.color = "ffffff";
        this.targetX = x;
        this.targetY = y;
        this.mood = mood;
        this.r = r;
        this.g = g;
        this.b = b;
    }

    draw() {
        noStroke();
        fill(this.r, this.g, this.b);
        ellipse(this.x, this.y, 9);
    }

    updateTargets(x, y) {
        this.targetX = x;
        this.targetY = y;
    }

    animate() {
        if (this.x === this.targetX && this.y === this.targetY) {
            return false;
        } else {
            const directionX = this.x - this.targetX;
            const directionY = this.y - this.targetY;

            if (directionX > 0) {
                this.x -= 0.5;
            } else if (directionX < 0) {
                this.x += 0.5;
            }

            if (directionY > 0) {
                this.y -= 0.5;
            } else if (directionY < 0) {
                this.y += 0.5;
            }

            return true;
        }
    }
}
