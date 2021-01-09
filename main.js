// Global variables
const WIDTH = 800;
const HEIGHT = 400;
const STATE = {
    participants: [],
    eliminated: [],
};

// Called from <body> onLoad
function setup() {
    window.addEventListener('keydown', handleInput);
    document.getElementById('participants').focus();
    init_draw();
}

// Initialize participants to given input, add an event listener for
// spacebar presses, remove focus from start button and start the animation
function init_draw() {
    const participants_str =
          document.getElementById('participants').value.trim();
    if (participants_str === "") {
        STATE.participants = [];
    } else {
        STATE.participants = participants_str.split('\n');
    }
    STATE.eliminated = [];

    document.getElementById('start').blur();
    window.requestAnimationFrame(draw);
}

// Draw the whole thing
function draw() {
    const ctx = document.getElementById('canvas').getContext('2d');
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    ctx.save();
    drawBorders(ctx);
    if (STATE.participants.length === 0) {
        drawPlaceholder(ctx);
        return;
    }
    drawCurrent(ctx);
    drawEliminated(ctx);
    ctx.restore();

    window.requestAnimationFrame(draw);
}

// Draw a placeholder when no names have been entered
function drawPlaceholder(ctx) {
    writeToTop(ctx, 'Syötä nimet alle ja käynnistä arvonta');
}

// Draw the current name on top
// Use green if it's the only one left
function drawCurrent(ctx) {
    const name = getCurrent();
    if (STATE.participants.length === 1) {
        writeToTop(ctx, name, 'green');
    } else {
        writeToTop(ctx, name);
    }
}

// Draw the border between the current name and the eliminated names
function drawBorders(ctx) {
    const thickness = 3;

    ctx.save();
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 44, WIDTH, thickness);

    ctx.fillRect(0, 0, WIDTH, thickness);
    ctx.fillRect(0, HEIGHT-thickness, WIDTH, HEIGHT);
    ctx.fillRect(0, 0, thickness, HEIGHT);
    ctx.fillRect(WIDTH-thickness, 0, WIDTH, HEIGHT);
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

function writeToTop(ctx, text, style='black') {
    ctx.save();
    ctx.textAlign = 'center';
    ctx.font = '24px sans-serif';
    ctx.translate(WIDTH / 2, 34);
    ctx.fillStyle = style;
    ctx.fillText(text, 0, 0);
    ctx.restore();
}

function handleInput({ key, target }) {
    switch (target.tagName.toLowerCase()) {
        case 'textarea':
        return;
    }
    if (key === "Enter") {
        eliminate();
    }
    // (re)start the raffling
    if (key === "r") {
        init_draw();
    }
    if (key === "x") {
        clear_participants();
    }
}

// Move the participant determined by getCurrentIndex from participants
function eliminate() {
    if (STATE.participants.length > 1) {
        STATE.eliminated.push(STATE.participants.splice(getCurrentIndex(), 1));
    }
}

function clear_participants() {
    const el = document.getElementById('participants');
    el.value = "";
    el.focus();
    init_draw();
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
