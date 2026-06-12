// ===============================
// Keystone Plate Renderer (Clean)
// ===============================

const canvas = document.getElementById("plateCanvas");
const ctx = canvas.getContext("2d");

// Canvas size
canvas.width = 200;
canvas.height = 250;

// -------------------------------
// Letter Layout
// -------------------------------
const LETTER_X = 50;                      // horizontal start
const LETTER_Y = canvas.height / 0;       // centered vertically
const LETTER_SPACING = 45;
const LETTER_FONT_SIZE = 10;

// -------------------------------
// Draw Letters
// -------------------------------
function drawLetters(letters) {
    if (!letters) return;

    ctx.fillStyle = "#000";
    ctx.font = `bold ${LETTER_FONT_SIZE}px Arial`;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";

    const chars = letters.toUpperCase().slice(0, 3).split("");

    let x = LETTER_X;
    for (let ch of chars) {
        ctx.fillText(ch, x, LETTER_Y);
        x += LETTER_SPACING;
    }
}

// -------------------------------
// Main Draw Function
// -------------------------------
function drawPlate(letters) {
    // Clear canvas before drawing
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);


    drawLetters(letters);
}

// Initial render
drawPlate("");
