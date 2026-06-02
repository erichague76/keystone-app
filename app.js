// ===== CANVAS SETUP =====
const canvas = document.getElementById("plateCanvas");
const ctx = canvas.getContext("2d");

// Resize canvas (narrower + taller)
const PLATE_WIDTH = 420;   // reduced width
const PLATE_HEIGHT = 200;  // taller

canvas.width = PLATE_WIDTH;
canvas.height = PLATE_HEIGHT;

// ===== DRAW PLATE FUNCTION =====
function drawPlate(letters = "ABC") {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background (prevents white overlap)
    ctx.fillStyle = "#f4f6fb"; // same as your manifest background
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Plate body
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;

    const padding = 10;
    const plateX = padding;
    const plateY = padding;
    const plateW = canvas.width - padding * 2;
    const plateH = canvas.height - padding * 2;

    // Rounded rectangle plate
    roundRect(ctx, plateX, plateY, plateW, plateH, 12, true, true);

    // Letter styling
    ctx.fillStyle = "#000";
    ctx.font = "bold 64px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Prevent overflow issues by spacing letters
    const chars = letters.split("").slice(0, 3);
    const spacing = plateW / (chars.length + 1);

    chars.forEach((ch, i) => {
        const x = plateX + spacing * (i + 1);
        const y = plateY + plateH / 2;
        ctx.fillText(ch.toUpperCase(), x, y);
    });
}

// ===== ROUNDED RECT FUNCTION =====
function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
    if (typeof radius === "number") {
        radius = { tl: radius, tr: radius, br: radius, bl: radius };
    }

    ctx.beginPath();
    ctx.moveTo(x + radius.tl, y);
    ctx.lineTo(x + width - radius.tr, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    ctx.lineTo(x + width, y + height - radius.br);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
    ctx.lineTo(x + radius.bl, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    ctx.lineTo(x, y + radius.tl);
    ctx.quadraticCurveTo(x, y, x + radius.tl, y);
    ctx.closePath();

    if (fill) ctx.fill();
    if (stroke) ctx.stroke();
}

// ===== INITIAL DRAW =====
drawPlate("ABC");
``
