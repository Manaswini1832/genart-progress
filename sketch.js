//npm i canvas-sketch -g

// >mkdir genart
// >cd genart
// >canvas-sketch sketch.js --new --open

//npm i canvas-sketch-util ----> For linear interpolation

const canvasSketch = require("canvas-sketch");

const { lerp } = require("canvas-sketch-util/math");
const random = require("canvas-sketch-util/random");
const palettes = require("nice-color-palettes");

const settings = {
  dimensions: [2048, 2048],
};

const sketch = () => {
  const colorCount = random.rangeFloor(2, 6);
  const palette = random.shuffle(random.pick(palettes)).slice(0, colorCount);

  const createGrid = () => {
    const points = [];
    const count = 80;
    for (let x = 0; x < count; x++) {
      for (let y = 0; y < count; y++) {
        let u = count <= 1 ? 0.5 : x / (count - 1);
        let v = count <= 1 ? 0.5 : y / (count - 1);

        const radius = Math.abs(random.noise2D(u, v) * 0.025);

        points.push({
          color: random.pick(palette),
          position: [u, v],
          radius,
        });
      }
    }
    return points;
  };

  // random.setSeed(512); //Adds deterministic randomness
  const points = createGrid().filter(() => random.value() > 0.5);
  const margin = 300;

  return ({ context, width, height }) => {
    context.fillStyle = "#fff";
    context.fillRect(0, 0, width, height);

    points.forEach((data) => {
      const { color, position, radius } = data;

      const [u, v] = position;

      const x = lerp(margin, width - margin, u);
      const y = lerp(margin, height - margin, v);

      context.beginPath();
      context.arc(x, y, radius * width, 0, Math.PI * 2, false);
      context.fillStyle = color;
      context.fill();
    });
  };
};

canvasSketch(sketch, settings);
