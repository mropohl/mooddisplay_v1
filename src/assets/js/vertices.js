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
