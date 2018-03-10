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
