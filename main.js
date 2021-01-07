const WIDTH = 800;
const HEIGHT = 400;

function init() {
    window.requestAnimationFrame(draw);
}

function draw() {
    const ctx = document.getElementById('canvas').getContext('2d');

    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    ctx.save();
    ctx.translate(WIDTH / 2, HEIGHT / 2);
    ctx.save();
    ctx.rotate(freq(1, 3) * Math.PI * 2);

    ctx.fillStyle = 'rgb(200, 0, 0)';
    ctx.fillRect(0, 0, 50, 50);

    ctx.restore();
    ctx.save();
    ctx.rotate(freq(1, 2) * Math.PI * 2);

    ctx.fillStyle = 'rgba(0, 0, 200, 0.5)';
    ctx.fillRect(0, 0, 50, 50);

    ctx.restore();
    ctx.restore();

    window.requestAnimationFrame(draw);
}

// return a float between 0 and 1 with a frequency of m/n
// default is once every second
function freq(m=1, n=1) {
    return Date.now() % (n * 1000) * m / (n * 1000);
}
