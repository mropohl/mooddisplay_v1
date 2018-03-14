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
            const maxMoveDist = 200;

            const distX = particle.mood * width / 2;
            const distY = particle.mood * height / 2;

            let { x, y } = calculateTargetCords(particle.mood, width, height);
            x = Math.round(x);
            y = Math.round(y);
            particle.updateTargets(x, y);
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

const calculateTargetCords = (mood, width, height) => {
    const { x, y } = calculateBounds(mood, width, height);
    const target = {};

    target.x = random(width);
    target.y = random(height);

    while (
        !(target.x > x.negBoundMin && target.x < x.negBoundMax) &&
        !(target.x < x.posBoundMax && target.x > x.posBoundMin)
    ) {
        target.x = random(width);
    }

    while (
        !(target.y > y.negBoundMin && target.y < y.negBoundMax) &&
        !(target.y < y.posBoundMax && target.y > y.posBoundMin)
    ) {
        target.y = random(width);
    }

    return target;
};

const calculateBounds = (mood, width, height) => {
    const bounds = { x: {}, y: {} };

    bounds.x.negBoundMax = mood * width / 2;
    bounds.x.negBoundMin = bounds.x.negBoundMax - bounds.x.negBoundMax * 0.5;

    bounds.y.negBoundMin = mood * height / 2;
    bounds.y.negBoundMax = bounds.y.negBoundMin + bounds.y.negBoundMin * 0.5;

    bounds.x.posBoundMin = width / 2 + bounds.x.negBoundMax;
    bounds.x.posBoundMax = bounds.x.posBoundMin + bounds.x.posBoundMin * 0.5;

    bounds.y.posBoundMin = height / 2 + bounds.y.negBoundMax;
    bounds.y.posBoundMax = bounds.y.posBoundMin + bounds.y.posBoundMin * 0.5;

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
