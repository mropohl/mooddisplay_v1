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
