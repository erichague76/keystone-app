const WORDLIST_FILE = "SpellFinder.txt";
const PLATE_IMAGE_FILE = "Plate.jpg";

let words = [];
let submittedWords = [];
let currentPossibleWords = [];
let currentLetters = "";

const plateCanvas = document.getElementById("plateCanvas");
const ctx = plateCanvas.getContext("2d");

const wordInput = document.getElementById("wordInput");
const lookupInput = document.getElementById("lookupInput");
const lookupResult = document.getElementById("lookupResult");
const summary = document.getElementById("summary");
const status = document.getElementById("status");
const submittedList = document.getElementById("submittedList");
const results = document.getElementById("results");

const plateImage = new Image();
plateImage.src = PLATE_IMAGE_FILE;

function normalizeWord(word) {
  return (word || "").toLowerCase().replace(/[^a-z]/g, "");
}

function orderedMatch(word, letters) {
  let pos = 0;
  for (const ch of letters) {
    pos = word.indexOf(ch, pos);
    if (pos === -1) return false;
    pos += 1;
  }
  return true;
}

async function loadWords() {
  try {
    const res = await fetch(WORDLIST_FILE);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();
    const cleaned = [...new Set(
      text
        .split(/\r?\n/)
        .map(w => normalizeWord(w))
        .filter(Boolean)
    )].sort();

    words = cleaned;
    updateStatus(true, true);
  } catch (err) {
    console.error(err);
    words = [];
    updateStatus(false, true);
    summary.textContent = "Could not load the word list.";
  }
}

function updateStatus(wordlistOk = true, imageKnown = true) {
  const wordStatus = wordlistOk
    ? `Loaded word list: ${WORDLIST_FILE} (${words.length} words)`
    : `Word list NOT FOUND: ${WORDLIST_FILE}`;

  const imageStatus = imageKnown
    ? ` | Plate image: ${PLATE_IMAGE_FILE}`
    : ` | Plate image NOT FOUND: ${PLATE_IMAGE_FILE}`;

  status.textContent = wordStatus + imageStatus;
}

plateImage.onload = () => {
  updateStatus(true, true);
  if (currentLetters) renderPlateWithLetters(currentLetters);
};

plateImage.onerror = () => {
  updateStatus(true, false);
  summary.textContent = `Plate image not found: ${PLATE_IMAGE_FILE}`;
};

function generateRandomLetters() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let out = "";
  for (let i = 0; i < 3; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

function getPossibleWordsForLetters(letters) {
  letters = normalizeWord(letters);
  if (letters.length !== 3) return [];
  return words.filter(w => orderedMatch(w, letters));
}

function refreshSubmittedList() {
  submittedList.innerHTML = "";
  submittedWords.forEach(word => {
    const li = document.createElement("li");
    li.textContent = word;
    submittedList.appendChild(li);
  });
}

function renderPlateWithLetters(letters) {
  ctx.clearRect(0, 0, plateCanvas.width, plateCanvas.height);

  if (plateImage.complete && plateImage.naturalWidth > 0) {
    ctx.drawImage(plateImage, 0, 0, plateCanvas.width, plateCanvas.height);
  } else {
    ctx.fillStyle = "#ddd";
    ctx.fillRect(0, 0, plateCanvas.width, plateCanvas.height);
  }

  // draw white area
  const box = { x1: 25, y1: 70, x2: 220, y2: 140 };
  ctx.fillStyle = "white";
  ctx.fillRect(box.x1, box.y1, box.x2 - box.x1, box.y2 - box.y1);

  const displayLetters = letters.toUpperCase();

  // Web-safe font for iPhone / browser compatibility
  ctx.fillStyle = "rgb(20,55,125)";
  ctx.font = "bold 78px Arial Black, Arial, sans-serif";
  ctx.textBaseline = "middle";

  const spacing = -4;
  let widths = [];
  let totalWidth = 0;

  for (const ch of displayLetters) {
    const w = ctx.measureText(ch).width;
    widths.push(w);
    totalWidth += w + spacing;
  }

  if (displayLetters.length > 0) {
    totalWidth -= spacing;
  }

  const startX = box.x1 + ((box.x2 - box.x1) - totalWidth) / 2 + 5;
  const centerY = box.y1 + (box.y2 - box.y1) / 2;

  let x = startX;
  for (let i = 0; i < displayLetters.length; i++) {
    ctx.fillText(displayLetters[i], x, centerY);
    x += widths[i] + spacing;
  }
}

function loadPlateLetters(letters, source = "custom") {
  letters = normalizeWord(letters).toUpperCase();
  currentLetters = letters;

  submittedWords = [];
  currentPossibleWords = getPossibleWordsForLetters(letters);
  refreshSubmittedList();

  wordInput.value = "";
  results.innerHTML = "";

  renderPlateWithLetters(letters);

  if (source === "random") {
    summary.textContent = `Generated random plate letters: ${letters}`;
  } else if (source === "lookup") {
    summary.textContent = `Loaded plate letters from lookup: ${letters}`;
  } else {
    summary.textContent = `Loaded plate letters: ${letters}`;
  }
}

function generateLettersAndPlate() {
  const letters = generateRandomLetters();
  lookupResult.textContent =
    "Random plate generated. Use 3-Letter Plate Lookup below to check/load a custom plate.";
  loadPlateLetters(letters, "random");
}

function lookupPlate() {
  const letters = normalizeWord(lookupInput.value).toUpperCase();

  if (letters.length !== 3) {
    lookupResult.textContent = "Please enter exactly 3 letters.";
    summary.textContent = "Lookup requires exactly 3 letters.";
    return;
  }

  const possibleWords = getPossibleWordsForLetters(letters);

  if (possibleWords.length > 0) {
    lookupResult.textContent =
      `${letters}: YES — words can be formed (${possibleWords.length} possible words). Plate loaded.`;
    loadPlateLetters(letters, "lookup");
  } else {
    lookupResult.textContent = `${letters}: NO — no words can be formed.`;
    summary.textContent =
      `Lookup checked "${letters}". No possible words were found, so the current plate was not changed.`;
  }
}

function submitWord() {
  const userWord = normalizeWord(wordInput.value);
  const letters = normalizeWord(currentLetters);

  if (letters.length !== 3) {
    summary.textContent = "No valid 3-letter plate is loaded.";
    return;
  }

  if (!userWord) {
    summary.textContent = "Please enter a valid word.";
    return;
  }

  const possibleWords = getPossibleWordsForLetters(letters);
  currentPossibleWords = possibleWords;

  if (!possibleWords.length) {
    summary.textContent =
      `No possible words were found containing "${letters}" in that order.`;
    return;
  }

  if (!possibleWords.includes(userWord)) {
    summary.textContent =
      `"${userWord}" is NOT a valid answer for plate letters "${letters.toUpperCase()}".`;
    wordInput.value = "";
    wordInput.focus();
    return;
  }

  if (!submittedWords.includes(userWord)) {
    submittedWords.push(userWord);
    submittedWords.sort();
    refreshSubmittedList();
  }

  const userLength = userWord.length;
  const shorterWords = possibleWords.filter(w => w.length < userLength);
  const percentageShorter = possibleWords.length
    ? (shorterWords.length / possibleWords.length) * 100
    : 0;

  summary.textContent =
    `"${userWord}" added to Correct Submitted Words. ` +
    `It is longer than ${percentageShorter.toFixed(2)}% of the ${possibleWords.length} possible words.`;

  wordInput.value = "";
  wordInput.focus();
}

function showAnswers() {
  results.innerHTML = "";

  const letters = normalizeWord(currentLetters);
  const possibleWords = getPossibleWordsForLetters(letters);
  currentPossibleWords = possibleWords;

  if (letters.length !== 3) {
    summary.textContent = "No valid 3-letter plate is loaded.";
    return;
  }

  if (!possibleWords.length) {
    summary.textContent =
      `No possible words were found containing "${letters}" in that order.`;
    return;
  }

  const validSubmitted = new Set(submittedWords.filter(w => possibleWords.includes(w)));

  const heading = document.createElement("div");
  heading.className = "heading";
  heading.textContent = `All possible words for plate letters: ${letters.toUpperCase()}`;
  results.appendChild(heading);

  const stats = document.createElement("div");
  stats.style.margin = "10px 0";
  stats.textContent =
    `Total possible words: ${possibleWords.length}\n` +
    `Correct submitted words highlighted in yellow: ${validSubmitted.size}`;
  results.appendChild(stats);

  const grid = document.createElement("div");
  grid.style.display = "grid";
  grid.style.gridTemplateColumns = "repeat(4, minmax(120px, 1fr))";
  grid.style.gap = "4px 10px";
  grid.style.marginTop = "10px";

  possibleWords.forEach(word => {
    const cell = document.createElement("div");
    cell.textContent = word;
    if (validSubmitted.has(word)) {
      cell.className = "highlight";
    }
    grid.appendChild(cell);
  });

  results.appendChild(grid);

  summary.textContent =
    `Showing all ${possibleWords.length} possible words in 4 columns. ` +
    `${validSubmitted.size} correct submitted words highlighted.`;
}

function clearAll() {
  wordInput.value = "";
  lookupInput.value = "";
  lookupResult.textContent = "Enter 3 letters to check whether words can be formed.";
  summary.textContent = "Ready.";
  results.innerHTML = "";
  submittedWords = [];
  currentPossibleWords = [];
  currentLetters = "";
  refreshSubmittedList();
  ctx.clearRect(0, 0, plateCanvas.width, plateCanvas.height);
}

document.getElementById("submitBtn").addEventListener("click", submitWord);
document.getElementById("answerBtn").addEventListener("click", showAnswers);
document.getElementById("randomBtn").addEventListener("click", generateLettersAndPlate);
document.getElementById("clearBtn").addEventListener("click", clearAll);
document.getElementById("lookupBtn").addEventListener("click", lookupPlate);

wordInput.addEventListener("keydown", e => {
  if (e.key === "Enter") submitWord();
});

lookupInput.addEventListener("keydown", e => {
  if (e.key === "Enter") lookupPlate();
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(console.error);
  });
}

loadWords().then(() => {
  generateLettersAndPlate();
});
