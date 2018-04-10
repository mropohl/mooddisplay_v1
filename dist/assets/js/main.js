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
let movementFactor = 200;
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
            const currentPleasentness = particle.pleasentness;
            let newPleasentness = particle.pleasentness;

            const rand = Math.floor(random(11));
            // if (rand < 0.05) newPleasentness = Math.random(1);

            let { x, y, bounds } = calculateTargetCords(
                particle.x,
                particle.y,
                currentPleasentness,
                newPleasentness,
                width,
                height,
                particle.firstDraw
            );

            x = Math.round(x);
            y = Math.round(y);

            particle.firstDraw = false;
            particle.pleasentness = newPleasentness;
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
    currentPleasentness,
    newPleasentness,
    width,
    height,
    firstDraw
) => {
    const { xBounds, yBounds } = calculateBounds(
        newPleasentness,
        width,
        height
    );
    console.log("calculating cords");
    const target = {};

    let distX = 0;
    let distY = 0;

    do {
        if (currentPleasentness === newPleasentness) {
            target.x =
                currentX + random(0, movementFactor) - movementFactor / 2;
        } else {
            target.x = random(width);
        }
    } while (
        !(
            (target.x > xBounds.negBoundMin &&
                target.x < xBounds.negBoundMax) ||
            (target.x > xBounds.posBoundMin && target.x < xBounds.posBoundMax)
        )
    );

    do {
        if (currentPleasentness === newPleasentness) {
            target.y =
                currentY + random(0, movementFactor) - movementFactor / 2;
        } else {
            target.y = random(height);
        }
    } while (
        !(
            (target.y > yBounds.negBoundMin &&
                target.y < yBounds.negBoundMax) ||
            (target.y > yBounds.posBoundMin && target.y < yBounds.posBoundMax)
        )
    );
    console.log("cur: " + currentX + ", new: " + target.x);
    return { x: target.x, y: target.y, bounds: { xBounds, yBounds } };
};

const calculateBounds = (mood, width, height) => {
    const bounds = { mood: mood, xBounds: {}, yBounds: {} };

    bounds.xBounds.negBoundMax = mood * width / 2;
    bounds.xBounds.negBoundMin = bounds.xBounds.negBoundMax - width * 0.1;

    bounds.xBounds.posBoundMin = width - width / 2 * mood;
    bounds.xBounds.posBoundMax = bounds.xBounds.posBoundMin + width * 0.1;

    bounds.yBounds.negBoundMin = mood * height / 2;
    bounds.yBounds.negBoundMax = bounds.yBounds.negBoundMin + height * 0.1;

    bounds.yBounds.posBoundMin = height - height / 2 * mood;
    bounds.yBounds.posBoundMax = bounds.yBounds.posBoundMin + height * 0.1;

    Object.keys(bounds.xBounds).forEach(key => {
        if (bounds.xBounds[key] < 0) {
            bounds.xBounds[key] = 0;
        }
        if (bounds.xBounds[key] > width) {
            bounds.xBounds[key] = width;
        }
    });

    Object.keys(bounds.yBounds).forEach(key => {
        if (bounds.yBounds[key] < 0) {
            bounds.yBounds[key] = 0;
        }
        if (bounds.yBounds[key] > height) {
            bounds.yBounds[key] = height;
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

const sliderControlSetup = () => {
    const btnSliderMenu = document.getElementById("btn-slider-menu");

    let slideMenuHidden = true;
    btnSliderMenu.addEventListener("click", () => {
        if (slideMenuHidden) {
            document.getElementById("slider-menu").style.display = "block";
            slideMenuHidden = false;
        } else {
            document.getElementById("slider-menu").style.display = "none";
            slideMenuHidden = true;
        }
    });

    const slider1 = document.getElementById("slider_1");
    slider1.setAttribute("min", 0);
    slider1.setAttribute("max", maxDist);
    slider1.setAttribute("value", maxDist);
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
        const strokeW = 1 - vertex.dist / maxDist + 0.2;
        strokeWeight(strokeW);
        stroke(255, 255, 255, alpha);
        line(vertex.x1, vertex.y1, vertex.x2, vertex.y2);
    });
};
