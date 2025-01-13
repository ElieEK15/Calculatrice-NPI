let buttons = [];
let displayValue = '0';
let currentExpression = '';

function setup() {
    createCanvas(400, 600);
    textAlign(CENTER, CENTER);
    textSize(24);

    // Créer les boutons
    const labels = [
        '7', '8', '9', '/',
        '4', '5', '6', '*',
        '1', '2', '3', '-',
        '0', '.', '=', '+',
        'AC'
    ];
    const rows = 5;
    const cols = 4;
    const btnWidth = width / cols;
    const btnHeight = (height - 100) / rows;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const index = r * cols + c;
            if (index < labels.length) {
                const label = labels[index];
                buttons.push(new Button(c * btnWidth, 100 + r * btnHeight, btnWidth, btnHeight, label));
            }
        }
    }
}

function draw() {
    background(240);

    // Dessiner l'écran
    fill(0);
    rect(0, 0, width, 100);
    fill(255);
    textAlign(RIGHT, CENTER);
    textSize(32);
    text(displayValue, width - 20, 50);

    // Dessiner les boutons
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
    } else if (input === '=') {
        try {
            const result = calculer(currentExpression.trim());
            displayValue = result.toString();
            currentExpression = '';
        } catch {
            displayValue = 'Erreur';
        }
    } else {
        currentExpression += input === '.' ? input : ` ${input}`;
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
        fill(this.isHovered() ? 200 : 220);
        rect(this.x, this.y, this.w, this.h, 10);
        fill(0);
        textSize(20);
        text(this.label, this.x + this.w / 2, this.y + this.h / 2);
    }

    isHovered() {
        return mouseX > this.x && mouseX < this.x + this.w && mouseY > this.y && mouseY < this.y + this.h;
    }
}

// Fonctions de pile
function pile_vide() {
    return [];
}

function empiler(p, elt) {
    p.push(elt);
}

function depiler(p) {
    return p.pop();
}

function appliquer_operation(op, a, b) {
    if (op === '+') return a + b;
    if (op === '-') return a - b;
    if (op === '*') return a * b;
    if (op === '/') return a / b;
    return 'error';
}

function calculer(expression) {
    const p = pile_vide();
    const tokens = expression.split(' ');

    for (const token of tokens) {
        if (['+', '-', '*', '/'].includes(token)) {
            const b = depiler(p);
            const a = depiler(p);
            const result = appliquer_operation(token, a, b);
            empiler(p, result);
        } else {
            empiler(p, parseFloat(token));
        }
    }

    return p.pop();
}