const canvas = document.getElementById("plateCanvas");
const ctx = canvas.getContext("2d");

// ✅ Adjust size slightly (no big layout change)
canvas.width = 450;   // slightly narrower (was ~500)
canvas.height = 180;  // slightly taller (was ~160)

// ✅ Updated draw function
function drawPlate(letters) {
    // Clear properly
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // ✅ Fix white overlap by explicitly repainting background
    ctx.fillStyle = "#f4f6fb"; // or match your page background
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

    // ✅ Letters (no overlap / clipping)
    ctx.fillStyle = "#000";
    ctx.font = "bold 60px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    if (!letters) return;

    const chars = letters.toUpperCase().slice(0, 3).split("");
    const spacing = plateW / (chars.length + 1);

    chars.forEach((ch, i) => {
        const x = padding + spacing * (i + 1);
        const y = padding + plateH / 2;
        ctx.fillText(ch, x, y);
    });
}
