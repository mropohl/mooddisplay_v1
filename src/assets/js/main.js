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
