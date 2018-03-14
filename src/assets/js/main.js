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
    particles = createParticles(1);
    frameRate(30);
    console.log("width: " + width, "height: " + height);
}

function draw() {
    background(0, 0, 0);
    drawBackground(backgroundImg, 8);

    particles.map(particle => {
        const isAnimating = particle.animate(mX, mY, maxDist);

        if (!isAnimating) {
            const rand = Math.floor(random(11));
            particle.mood = Math.random(1);

            const maxMoveDist = 200;

            const distX = particle.mood * width / 2;
            const distY = particle.mood * height / 2;

            let { x, y, bounds } = calculateTargetCords(
                particle.x,
                particle.y,
                particle.mood,
                width,
                height
            );

            x = Math.round(x);
            y = Math.round(y);

            particle.updateTargets(x, y, bounds);
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

const calculateTargetCords = (currentX, currentY, mood, width, height) => {
    const { x, y } = calculateBounds(mood, width, height);
    const target = {};

    do {
        target.x = random(width);
    } while (
        !(
            (target.x > x.negBoundMin && target.x < x.negBoundMax) ||
            (target.x > x.posBoundMin && target.x < x.posBoundMax)
        )
    );

    do {
        target.y = random(width);
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
