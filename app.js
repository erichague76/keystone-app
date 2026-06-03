const canvas = document.getElementById("plateCanvas");
const ctx = canvas.getContext("2d");

// Canvas size
canvas.width = 260;
canvas.height = 160;   // increased so erase box fits

// --- Manual Plate Controls ---
const ERASE_X = 25;
const ERASE_Y = 35;
const ERASE_W = 135;
const ERASE_H = 110;   // now fits inside 160px height

const LETTER_X = 120;  // moved left so all 3 letters fit
const LETTER_Y = 105;
const LETTER_SPACING = 45;
const LETTER_FONT_SIZE = 70;

function drawPlate(letters) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#f4f6fb";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const padding = 8;
    const plateW = canvas.width - padding * 2;
    const plateH = canvas.height - padding * 2;

    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;

    ctx.fillRect(padding, padding, plateW, plateH);
    ctx.strokeRect(padding, padding, plateW, plateH);

    ctx.fillStyle = "white";
    ctx.fillRect(ERASE_X, ERASE_Y, ERASE_W, ERASE_H);

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
