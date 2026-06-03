const canvas = document.getElementById("plateCanvas");
const ctx = canvas.getContext("2d");

// Canvas size
canvas.width = 450;
canvas.height = 180;

// --- Manual Plate Controls ---
const ERASE_X = 25;      // left edge of white box
const ERASE_Y = 35;       // top edge of white box
const ERASE_W = 135;      // width of white box
const ERASE_H = 110;       // height of white box

const LETTER_X = 160;     // starting X for first letter
const LETTER_Y = 105;     // baseline Y for letters
const LETTER_SPACING = 55;
const LETTER_FONT_SIZE = 70;

// --- Updated draw function ---
function drawPlate(letters) {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background (prevents ghosting)
    ctx.fillStyle = "#f4f6fb";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Plate base
    const padding = 8;
    const plateW = canvas.width - padding * 2;
    const plateH = canvas.height - padding * 2;

    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;

    ctx.fillRect(padding, padding, plateW, plateH);
    ctx.strokeRect(padding, padding, plateW, plateH);

    // --- White erase box (manual control) ---
    ctx.fillStyle = "white";
    ctx.fillRect(ERASE_X, ERASE_Y, ERASE_W, ERASE_H);

    if (!letters) return;

    // --- Letters (manual control) ---
    ctx.fillStyle = "#000";
    ctx.font = `bold ${LETTER_FONT_SIZE}px Arial`;
    ctx.textAlign = "left";      // IMPORTANT: manual placement
    ctx.textBaseline = "middle"; // IMPORTANT: vertical alignment

    const chars = letters.toUpperCase().slice(0, 3).split("");

    let x = LETTER_X;
    for (let ch of chars) {
        ctx.fillText(ch, x, LETTER_Y);
        x += LETTER_SPACING;
    }
}
