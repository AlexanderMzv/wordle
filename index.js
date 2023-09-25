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

const grid = document.getElementById("grid");

buildGrid();
updateGrid();

window.addEventListener("keydown", handleKeyDown);

function handleKeyDown(e) {
  const letter = e.key.toLowerCase();

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
  } else if (/[a-z]/.test(letter) && letter.length === 1) {
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

function drawAttempt(row, attempt, isCurrent) {
  for (let i = 0; i < 5; i++) {
    const cell = row.children[i];
    cell.textContent = attempt[i];
    cell.style.backgroundColor = isCurrent ? "#191a24" : getBgColor(attempt, i);
  }
}

function getBgColor(attempt, i) {
  const correctLetter = secret[i];
  const attemptLetter = attempt[i];

  if (secret.indexOf(attemptLetter) === -1) {
    return "#3d4054";
  }
  if (correctLetter === attemptLetter) {
    return "#79b851";
  }

  return "#f3c237";
}
