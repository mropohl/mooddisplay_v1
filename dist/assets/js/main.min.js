const drawBackground = (img, scalingFactor) => {
    img.resize(width / scalingFactor, height / scalingFactor);
    img.loadPixels();

    let distances = [];
    let distancesSum = 0;
    let r = 0;
    let g = 0;
    let b = 0;

    for (var x = 0; x < img.width; x++) {
        for (var y = 0; y < img.height; y++) {
            r = 0;
            g = 0;
            b = 0;

            const { distances, distancesSum } = getDistanceToParticles(
                x,
                y,
                particles,
                scalingFactor
            );

            let kehrwertSum = 0;

            for (var l = 0; l < distances.length; l++) {
                if (distances[l].distance === 0)
                    kehrwertSum += distancesSum / 1;
                else kehrwertSum += distancesSum / distances[l].distance;
            }

            for (var j = 0; j < distances.length; j++) {
                let percent = 0;

                if (distances[j].distance === 0) {
                    const kehrwert = distancesSum / 1;
                    percent = kehrwert / kehrwertSum;
                } else {
                    const kehrwert = distancesSum / distances[j].distance;
                    percent = kehrwert / kehrwertSum;
                }

                r += distances[j].r * percent;
                g += distances[j].g * percent;
                b += distances[j].b * percent;
            }

            if (r > 255) r = 255;
            if (g > 255) g = 255;
            if (b > 255) b = 255;

            if (r < 0) r = 0;
            if (g < 0) g = 0;
            if (b < 0) b = 0;

            img.set(x, y, color(r, g, b));
        }
    }

    img.updatePixels();
    img.resize(width, height);
    image(img, 0, 0);
};

const getDistanceToParticles = (x, y, particles, scalingFactor) => {
    const result = {
        distances: [],
        distancesSum: 0
    };

    for (var i = 0; i < particles.length; i++) {
        const dx = x - particles[i].x / scalingFactor;
        const dy = y - particles[i].y / scalingFactor;

        const distance = Math.sqrt(dx * dx + dy * dy);

        result.distancesSum += distance;

        result.distances.push({
            distance,
            r: particles[i].r,
            g: particles[i].g,
            b: particles[i].b
        });
    }

    return result;
};

const colors = [
    {
        r: 232,
        g: 242,
        b: 37
    },
    {
        r: 32,
        g: 243,
        b: 143
    },

    {
        r: 236,
        g: 28,
        b: 85
    }
];

p5.disableFriendlyErrors = true;

const width = window.innerWidth;
const height = window.innerHeight;
const rad = width / 2;
const maxDist = width / 2;
const mX = width / 2;
const mY = height / 2;

let canvas;
let backgroundImg;
let particles;

function setup() {
    canvas = createCanvas(window.innerWidth, window.innerHeight);
    backgroundImg = createImage(width, height);
    particles = createParticles(15);
    frameRate(30);
}

function draw() {
    background(0, 0, 0);
    drawBackground(backgroundImg, 8);

    particles.map(particle => {
        const isAnimating = particle.animate(mX, mY, maxDist);

        if (!isAnimating) {
            const distX = particle.mood * width / 2;
            const distY = particle.mood * height / 2;

            const boundMax = rad * particle.mood;
            const boundMin = rad * (particle.mood - 0.1);

            const newX = Math.floor(
                random(width / 2 - distX, width / 2 + distX)
            );
            const newY = Math.floor(
                random(height / 2 - distY, height / 2 + distY)
            );

            particle.updateTargets(newX, newY);
        }
    });

    const vertices = calculateVertices(particles, 600);

    drawEdges(vertices, 600);

    particles.map(particle => {
        particle.draw();
    });

    var fps = frameRate();
    fill(255);
    stroke(0);
    text("FPS: " + fps.toFixed(2), 10, height - 10);
}

class Particle {
    constructor(x, y, mood, r, g, b) {
        this.x = x;
        this.y = y;
        this.targetX = x;
        this.targetY = y;
        this.r = r;
        this.g = g;
        this.b = b;
        this.mood = mood;
    }

    draw() {
        noStroke();
        fill("white");
        ellipse(this.x, this.y, 10);
    }

    updateTargets(x, y) {
        this.targetX = x;
        this.targetY = y;
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

const calculateVertices = (particles, maxDist) => {
    const result = new Set();

    for (let i = 0; i < particles.length; i++) {
        const currentParticle = particles[i];

        for (let j = 0; j < particles.length; j++) {
            const dx = particles[j].x - particles[i].x;
            const dy = particles[j].y - particles[i].y;

            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < maxDist) {
                result.add({
                    x1: particles[i].x,
                    y1: particles[i].y,
                    x2: particles[j].x,
                    y2: particles[j].y,
                    dist
                });
            }
        }
    }

    return result;
};

const drawEdges = (vertices, maxDist) => {
    vertices.forEach(vertex => {
        const alpha = (1 - vertex.dist / maxDist) * 100;
        const strokeW = 1 - vertex.dist / maxDist + 0.25;
        strokeWeight(strokeW);
        stroke(255, 255, 255, alpha);
        line(vertex.x1, vertex.y1, vertex.x2, vertex.y2);
    });
};
