// Global variables
const WIDTH = 800;
const HEIGHT = 400;
const STATE = {
    participants: [],
    eliminated: [],
};

// Initialize participants to given input, add an event listener for
// spacebar presses, remove focus from start button and start the animation
function init() {
    STATE.participants = document.getElementById('participants').value
        .trim().split('\n');
    STATE.eliminated = [];

    window.addEventListener('keydown', eliminate);
    document.getElementById('start').blur();
    window.requestAnimationFrame(draw);
}

// Draw the whole thing
function draw() {
    const ctx = document.getElementById('canvas').getContext('2d');
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    ctx.save();
    drawCurrent(ctx);
    drawBorder(ctx);
    drawEliminated(ctx);
    ctx.restore();

    window.requestAnimationFrame(draw);
}

// Draw the current name on top
// Use green if it's the only one left
function drawCurrent(ctx) {
    const name = getCurrent();
    ctx.save();
    ctx.textAlign = 'center';
    ctx.font = '24px sans-serif';
    ctx.translate(WIDTH / 2, 34);
    if (STATE.participants.length === 1) {
        ctx.fillStyle = 'green';
    }
    ctx.fillText(name, 0, 0);
    ctx.restore();

}

// Draw the border between the current name and the eliminated names
function drawBorder(ctx) {
    ctx.save();
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 44, WIDTH, 3);
    ctx.restore();
}

// Draw the eliminated names on screen
function drawEliminated(ctx) {
    const namesPerColumn = 14;
    const nameHeight = 20;
    const numColumns = 3;
    const columnWidth = (WIDTH - 100) / numColumns;
    ctx.save();

    ctx.translate(50, 97);
    ctx.font = '18px sans-serif';
    STATE.eliminated.forEach((name, i) => {
        const dx = Math.floor(i / namesPerColumn);
        const dy = i % namesPerColumn;
        ctx.fillText(name, dx * columnWidth, dy * nameHeight);
    });

    ctx.restore();
}

// Move the participant determined by getCurrentIndex from participants
// to eliminated, if spacebar was pressed
function eliminate({ keyCode }) {
    if (keyCode === 32 && STATE.participants.length > 1) {
        STATE.eliminated.push(STATE.participants.splice(getCurrentIndex(), 1));
    }
}

// Return the index of the participant to display on top
function getCurrentIndex() {
    return Math.floor(freq(1, 1) * STATE.participants.length);
}

// Return the name of the participant to display on top
function getCurrent() {
    return STATE.participants[getCurrentIndex()];
}

// return a float between 0 and 1 with a frequency of m/n
// default is once every second
function freq(m=1, n=1) {
    return Date.now() % (n * 1000) / (n * 1000) * m % 1;
}
