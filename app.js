// ===============================
// Keystone Plate Renderer (Clean Rewrite)
// ===============================

const canvas = document.getElementById("plateCanvas");
const ctx = canvas.getContext("2d");

// Final canvas size (mobile‑safe)
canvas.width = 200;
canvas.height = 250;

// -------------------------------
// Layout Constants
// -------------------------------

// White box (left area) — DOES NOT overlap yellow
const ERASE_X = 40;     // left margin
const ERASE_Y = 60;     // safely below blue band
const ERASE_W = 10;    // width of left white area
const ERASE_H = 120;    // stays inside white region


// Letter placement
const LETTER_X = ERASE_X  20;   // inside white box
const LETTER_Y = ERASE_Y  75;   // vertical center
const LETTER_SPACING = 45;
const LETTER_FONT_SIZE = 50;

// -----------------------------------
// Draw Plate Background
// -------------------------------
function drawBasePlate() {
    ctx.clearRect(1, 1, canvas.width, canvas.height);

    // Plate background
    


    const padding = 8;
    const plateW = canvas.width - padding * 2;
    const plateH = canvas.height - padding * 2;

    
}

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
        drawLetters(letters);
}

// Initial render
drawPlate("");
