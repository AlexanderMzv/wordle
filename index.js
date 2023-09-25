"use strict";

const wordList = ["horse"];
const randomIndex = Math.floor(Math.random() * wordList.length);
const secret = wordList[randomIndex];

let currentAttempt = "";
const history = [];

const grid = document.getElementById("grid");

buildGrid();
updateGrid();

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
