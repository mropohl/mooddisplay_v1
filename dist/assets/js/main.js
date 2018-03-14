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

let maxDist = width / 2;
let debug = false;
let movementFactor = 500;
let particleMovementSpeed = 0.5;

const mX = width / 2;
const mY = height / 2;

let canvas;
let backgroundImg;
let particles;

function setup() {
    sliderControlSetup();
    canvas = createCanvas(window.innerWidth, window.innerHeight);
    backgroundImg = createImage(width, height);
    particles = createParticles(15);
    frameRate(30);
    console.log("width: " + width, "height: " + height);
}

let firstDraw = true;

function draw() {
    background(0, 0, 0);
    drawBackground(backgroundImg, 8);

    particles.map(particle => {
        const isAnimating = particle.animate(mX, mY, maxDist);

        if (!isAnimating) {
            const currentMood = particle.mood;
            let newMood = particle.mood;

            const rand = Math.floor(random(11));
            if (rand < 0.5) newMood = Math.random(1);

            let { x, y, bounds } = calculateTargetCords(
                particle.x,
                particle.y,
                currentMood,
                newMood,
                width,
                height,
                particle.firstDraw
            );

            x = Math.round(x);
            y = Math.round(y);

            particle.firstDraw = false;
            particle.mood = newMood;
            particle.targetX = x;
            particle.targetY = y;
            particle.bounds = bounds;
        }
    });

    const vertices = calculateVertices(particles, 600);

    drawEdges(vertices, 600);

    particles.map(particle => {
        particle.speed = particleMovementSpeed;
        particle.debug = debug;
        particle.draw();
    });

    var fps = frameRate();
    fill(255);
    stroke(0);
    text("FPS: " + fps.toFixed(2), 10, height - 10);
}

const calculateTargetCords = (
    currentX,
    currentY,
    currentMood,
    newMood,
    width,
    height,
    first
) => {
    const { x, y } = calculateBounds(newMood, width, height);

    const target = {};

    let distX = 0;
    let distY = 0;

    do {
        if (currentMood === newMood && !firstDraw) {
            target.x =
                currentX + random(100, movementFactor) - movementFactor / 2;
        } else {
            target.x = random(width);
        }
    } while (
        !(
            (target.x > x.negBoundMin && target.x < x.negBoundMax) ||
            (target.x > x.posBoundMin && target.x < x.posBoundMax)
        )
    );

    do {
        if (currentMood === newMood && !firstDraw) {
            target.y =
                currentY + random(100, movementFactor) - movementFactor / 2;
        } else {
            target.y = random(height);
        }
    } while (
        !(
            (target.y > y.negBoundMin && target.y < y.negBoundMax) ||
            (target.y > y.posBoundMin && target.y < y.posBoundMax)
        )
    );

    return { x: target.x, y: target.y, bounds: { x, y } };
};

const calculateBounds = (mood, width, height) => {
    const bounds = { mood: mood, x: {}, y: {} };

    bounds.x.negBoundMax = mood * width / 2;
    bounds.x.negBoundMin = bounds.x.negBoundMax - width * 0.1;

    bounds.x.posBoundMin = width - width / 2 * mood;
    bounds.x.posBoundMax = bounds.x.posBoundMin + width * 0.1;

    bounds.y.negBoundMin = mood * height / 2;
    bounds.y.negBoundMax = bounds.y.negBoundMin + height * 0.1;

    bounds.y.posBoundMin = height - height / 2 * mood;
    bounds.y.posBoundMax = bounds.y.posBoundMin + height * 0.1;

    Object.keys(bounds.x).forEach(key => {
        if (bounds.x[key] < 0) {
            bounds.x[key] = 0;
        }
        if (bounds.x[key] > width) {
            bounds.x[key] = width;
        }
    });

    Object.keys(bounds.y).forEach(key => {
        if (bounds.y[key] < 0) {
            bounds.y[key] = 0;
        }
        if (bounds.y[key] > height) {
            bounds.y[key] = height;
        }
    });

    return bounds;
};

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
            return false;
        } else {
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

const sliderControlSetup = () => {
    const slider1 = document.getElementById("slider_1");
    slider1.setAttribute("min", 0);
    slider1.setAttribute("max", maxDist);
    slider1.oninput = function() {
        maxDist = this.value;
    };

    const slider2 = document.getElementById("slider_2");
    slider2.oninput = function() {
        movementFactor = this.value;
    };

    const slider3 = document.getElementById("slider_3");
    slider3.oninput = function() {
        particleMovementSpeed = this.value;
    };
};

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
