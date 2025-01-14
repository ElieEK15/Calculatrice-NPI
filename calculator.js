let buttons = [];
let displayValue = '0';
let currentExpression = '';
let isOn = true;

function setup() {
    createCanvas(400, 600);
    textAlign(CENTER, CENTER);

    const labels = [
        'AC', 'ON', '←', 'S',
        '7', '8', '9', '/',
        '4', '5', '6', '*',
        '1', '2', '3', '-',
        '0', '.', '=', '+'
    ];

    const rows = 6;
    const cols = 4;
    const btnWidth = width / cols - 10;
    const btnHeight = (height - 150) / rows - 10;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const index = r * cols + c;
            if (index < labels.length && labels[index] !== '') {
                const label = labels[index];
                buttons.push(new Button(c * (btnWidth + 10), 150 + r * (btnHeight + 10), btnWidth, btnHeight, label));
            }
        }
    }
}

function draw() {
    background("#f0f0f0");
    fill("#333");
    rect(10, 10, width - 20, 100, 10);
    fill("#fff");
    textAlign(RIGHT, CENTER);
    textSize(32);
    text(displayValue, width - 30, 60);
    buttons.forEach(btn => btn.display());
}

function mousePressed() {
    buttons.forEach(btn => {
        if (btn.isHovered()) {
            handleInput(btn.label);
        }
    });
}

function handleInput(input) {
    if (input === 'AC') {
        currentExpression = '';
        displayValue = '0';
    } else if (input === 'ON') {
        isOn = !isOn;
        displayValue = isOn ? '0' : 'OFF';
        currentExpression = '';
    } else if (!isOn) {
        return;
    } else if (input === '=') {
        try {
            const result = calculer(currentExpression.trim());
            displayValue = result.toString();
            currentExpression = '';
        } catch {
            displayValue = 'Erreur';
        }
    } else if (input === '←') {
        currentExpression = currentExpression.trim().slice(0, -1);
        displayValue = currentExpression.trim() || '0';
    } else if (input === 'S') {
        if (currentExpression && currentExpression[currentExpression.length - 1] !== ' ') {
            currentExpression += ' ';
            displayValue = currentExpression.trim();
        }
    } else {
        currentExpression += input;
        displayValue = currentExpression.trim();
    }
}

class Button {
    constructor(x, y, w, h, label) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.label = label;
    }

    display() {
        fill(this.isHovered() ? "#87CEEB" : "#4682B4");
        stroke("#333");
        strokeWeight(2);
        rect(this.x, this.y, this.w, this.h, 10);
        fill("#fff");
        noStroke();
        const fontSize = Math.min(this.w, this.h) * 0.4; // Adjust font size dynamically
        textSize(fontSize);
        text(this.label, this.x + this.w / 2, this.y + this.h / 2);
    }

    isHovered() {
        return mouseX > this.x && mouseX < this.x + this.w && mouseY > this.y && mouseY < this.y + this.h;
    }
}

function pile_vide() {
    return [];
}

function empiler(p, elt) {
    p.push(elt);
}

function depiler(p) {
    if (p.length === 0) throw new Error("Stack underflow");
    return p.pop();
}

function appliquer_operation(op, a, b) {
    if (op === '+') return a + b;
    if (op === '-') return a - b;
    if (op === '*') return a * b;
    if (op === '/') return a / b;
    if (op === '^') return Math.pow(a, b);
    throw new Error("Invalid operator");
}

function calculer(expression) {
    const p = pile_vide();
    const tokens = expression.split(' ');

    for (const token of tokens) {
        if (['+', '-', '*', '/', '^'].includes(token)) {
            const b = depiler(p);
            const a = depiler(p);
            const result = appliquer_operation(token, a, b);
            empiler(p, result);
        } else if (!isNaN(token)) {
            empiler(p, parseFloat(token));
        } else {
            throw new Error("Invalid token in expression");
        }
    }

    if (p.length !== 1) throw new Error("Invalid expression");
    return p.pop();
}