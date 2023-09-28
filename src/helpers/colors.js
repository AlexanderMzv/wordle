import { GREEN, GREY, secret, YELLOW } from "../const";

export function getBgColor(attempt, i) {
  const correctLetter = secret[i];
  const attemptLetter = attempt[i];

  if (secret.indexOf(attemptLetter) === -1) {
    return GREY;
  }
  if (correctLetter === attemptLetter) {
    return GREEN;
  }

  return YELLOW;
}

export function calculateBestColors(history) {
  let map = new Map();
  for (let attempt of history) {
    for (let i = 0; i < attempt.length; i++) {
      let color = getBgColor(attempt, i);
      let key = attempt[i];
      let bestColor = map.get(key);
      map.set(key, getBetterColor(color, bestColor));
    }
  }
  return map;
}

function getBetterColor(a, b) {
  if (a === GREEN || b === GREEN) {
    return GREEN;
  }
  if (a === YELLOW || b === YELLOW) {
    return YELLOW;
  }

  return GREY;
}
