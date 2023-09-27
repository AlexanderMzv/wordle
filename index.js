const wordList = [
  "horse",
  "patio",
  "darts",
  "piano",
  "hello",
  "water",
  "pizza",
  "sushi",
  "crabs",
];

const secret = wordList[0];

let currentAttempt = "";
let history = [];

function handleKeyDown(e) {
  if (e.ctrlKey || e.metaKey || e.altKey) {
    return;
  }
  handleKey(e.key);
}

function handleKey(key) {
  if (history.length === 6) {
    return;
  }
  if (isAnimating) {
    return;
  }

  const letter = key.toLowerCase();

  if (letter === "enter") {
    if (currentAttempt.length < 5) {
      return;
    }
    if (!wordList.includes(currentAttempt)) {
      alert("Not in my thesaurus");
      return;
    }
    if (history.length === 5 && currentAttempt !== secret) {
      alert(secret);
    }
    history.push(currentAttempt);
    currentAttempt = "";
    updateKeyboard();
    saveGame();
    pauseInput();
  } else if (letter === "backspace") {
    currentAttempt = currentAttempt.slice(0, currentAttempt.length - 1);
  } else if (/^[a-z]$/.test(letter)) {
    if (currentAttempt.length < 5) {
      currentAttempt += letter;
      animatePress(currentAttempt.length - 1);
    }
  }
  updateGrid();
}

let isAnimating = false;
function pauseInput() {
  if (isAnimating) throw Error("should never happen");
  isAnimating = true;
  setTimeout(() => {
    isAnimating = false;
  }, 2000);
}

function buildGrid() {
  for (let i = 0; i < 6; i++) {
    const row = document.createElement("div");
    row.className = "row";
    for (let j = 0; j < 5; j++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      const front = document.createElement("div");
      front.className = "front";
      const back = document.createElement("div");
      back.className = "back";
      const surface = document.createElement("div");
      surface.className = "surface";
      surface.style.transitionDelay = j * 300 + "ms";

      surface.appendChild(front);
      surface.appendChild(back);
      cell.appendChild(surface);
      row.appendChild(cell);
    }
    grid.appendChild(row);
  }
}

function updateGrid() {
  for (let i = 0; i < 6; i++) {
    let row = grid.children[i];
    if (i < history.length) {
      drawAttempt(row, history[i], true);
    } else if (i === history.length) {
      drawAttempt(row, currentAttempt, false);
    } else {
      drawAttempt(row, "", false);
    }
  }
}

const BLACK = "#191a24";
const GRAY = "#3d4054";
const LIGHTGRAY = "#656780";
const GREEN = "#79b851";
const YELLOW = "#f3c237";

function drawAttempt(row, attempt, solved) {
  for (let i = 0; i < 5; i++) {
    const cell = row.children[i];
    const surface = cell.firstChild;
    const front = surface.children[0];
    const back = surface.children[1];

    front.textContent = attempt[i];
    back.textContent = attempt[i];

    if (!attempt[i]) {
      clearAnimation(cell);
    }
    front.style.borderColor = attempt[i] ? "#7b7f98" : "#414458";
    front.style.backgroundColor = BLACK;

    back.style.borderColor = getBgColor(attempt, i);
    back.style.backgroundColor = getBgColor(attempt, i);

    if (solved) {
      cell.classList.add("solved");
    } else {
      cell.classList.remove("solved");
    }
  }
}

function getBgColor(attempt, i) {
  const correctLetter = secret[i];
  const attemptLetter = attempt[i];

  if (secret.indexOf(attemptLetter) === -1) {
    return GRAY;
  }
  if (correctLetter === attemptLetter) {
    return GREEN;
  }

  return YELLOW;
}

function buildKeyboard() {
  buildKeyboardRow("qwertyuiop", false);
  buildKeyboardRow("asdfghjkl", false);
  buildKeyboardRow("zxcvbnm", true);
}

function buildButton(letter, row) {
  const button = document.createElement("button");
  button.tabIndex = -1;
  button.className = "button";
  button.textContent = letter;
  button.style.backgroundColor = LIGHTGRAY;
  button.onclick = () => {
    handleKey(letter);
  };
  keyboardButtons.set(letter, button);
  row.appendChild(button);
}

function buildKeyboardRow(letters, isLastRow) {
  const row = document.createElement("div");

  if (isLastRow) {
    buildButton("enter", row);
  }
  for (let letter of letters) {
    buildButton(letter, row);
  }
  if (isLastRow) {
    buildButton("backspace", row);
  }

  keyboard.appendChild(row);
}

function getBetterColor(a, b) {
  if (a === GREEN || b === GREEN) {
    return GREEN;
  }
  if (a === YELLOW || b === YELLOW) {
    return YELLOW;
  }

  return GRAY;
}

function updateKeyboard() {
  const bestColors = new Map();

  for (let attempt of history) {
    for (let i = 0; i < attempt.length; i++) {
      const color = getBgColor(attempt, i);
      const key = attempt[i];
      const bestColor = bestColors.get(key);
      bestColors.set(key, getBetterColor(color, bestColor));
    }
  }

  for (let [key, button] of keyboardButtons) {
    button.style.backgroundColor = bestColors.get(key);
    button.style.borderColor = bestColors.get(key);
  }
}

function animatePress(index) {
  const rowIndex = history.length;
  const row = grid.children[rowIndex];
  const cell = row.children[index];
  cell.style.animationName = "press";
  cell.style.animationDuration = "150ms";
  cell.style.animationTimingFunction = "ease-out";
}

function clearAnimation(cell) {
  cell.style.animationName = "";
  cell.style.animationDuration = "";
}

function loadGame() {
  let data;
  try {
    data = JSON.parse(localStorage.getItem("data"));
  } catch (error) {}

  if (data != null) {
    if (data.secret === secret) {
      history = data.history;
    }
  }
}

function saveGame() {
  const data = JSON.stringify({
    secret,
    history,
  });

  try {
    localStorage.setItem("data", data);
  } catch (error) {}
}

const grid = document.getElementById("grid");
const keyboard = document.getElementById("keyboard");
const keyboardButtons = new Map();

loadGame();
buildGrid();
buildKeyboard();
updateGrid();
updateKeyboard();

window.addEventListener("keydown", handleKeyDown);
