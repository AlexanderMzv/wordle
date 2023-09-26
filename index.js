"use strict";

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

const randomIndex = Math.floor(Math.random() * wordList.length);
const secret = wordList[randomIndex];

let currentAttempt = "";
const history = [];

window.addEventListener("keydown", handleKeyDown);

function handleKeyDown(e) {
  if (e.ctrlKey || e.metaKey || e.altKey) {
    return;
  }
  handleKey(e.key);
}

function handleKey(key) {
  const letter = key.toLowerCase();

  if (letter === "enter") {
    if (currentAttempt.length < 5) {
      return;
    }
    if (!wordList.includes(currentAttempt)) {
      alert("Not in my thesaurus");
      return;
    }
    history.push(currentAttempt);
    currentAttempt = "";
  } else if (letter === "backspace") {
    currentAttempt = currentAttempt.slice(0, currentAttempt.length - 1);
  } else if (/^[a-z]$/.test(letter)) {
    if (currentAttempt.length < 5) {
      currentAttempt += letter;
    }
  }
  updateGrid();
}

function buildGrid() {
  for (let i = 0; i < 6; i++) {
    const row = document.createElement("div");
    row.className = "row";
    for (let j = 0; j < 5; j++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.textContent = "";
      row.appendChild(cell);
    }
    grid.appendChild(row);
  }
}

function updateGrid() {
  let row = grid.firstChild;
  for (let attempt of history) {
    drawAttempt(row, attempt, false);
    row = row.nextSibling;
  }
  drawAttempt(row, currentAttempt, true);
}

const BLACK = "#191a24";
const GRAY = "#3d4054";
const LIGHTGRAY = "#656780";
const GREEN = "#79b851";
const YELLOW = "#f3c237";

function drawAttempt(row, attempt, isCurrent) {
  for (let i = 0; i < 5; i++) {
    const cell = row.children[i];
    cell.textContent = attempt[i];
    cell.style.backgroundColor = isCurrent ? BLACK : getBgColor(attempt, i);
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
  button.className = "button";
  button.textContent = letter;
  button.style.backgroundColor = LIGHTGRAY;
  button.onclick = () => {
    handleKey(letter);
  };
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

const grid = document.getElementById("grid");
const keyboard = document.getElementById("keyboard");

buildGrid();
buildKeyboard();
updateGrid();
