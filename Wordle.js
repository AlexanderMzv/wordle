import { useEffect, useState, useContext, useRef } from "react";
import { KeyContext } from "./context";

const BLACK = "#191a24";
const GREY = "#3d4054";
const LIGHTGREY = "#656780";
const GREEN = "#79b851";
const YELLOW = "#f3c237";

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

export default function Wordle() {
  let [currentAttempt, setCurrentAttempt] = useState("");
  let [bestColors, setBestColors] = useState(() => new Map());
  let [history, setHistory] = usePersistedHistory((h) => {
    waitForAnimation(h);
  });

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

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

    if (animatingRef.current) {
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
      const newHistory = [...history, currentAttempt];

      setHistory(newHistory);
      setCurrentAttempt("");
      waitForAnimation(newHistory);
    } else if (letter === "backspace") {
      setCurrentAttempt(currentAttempt.slice(0, currentAttempt.length - 1));
    } else if (/^[a-z]$/.test(letter)) {
      if (currentAttempt.length < 5) {
        setCurrentAttempt(currentAttempt + letter);
      }
    }
  }

  const animatingRef = useRef(false);

  function waitForAnimation(nextHistory) {
    if (animatingRef.current) {
      throw Error("should never happen");
    }

    animatingRef.current = true;

    setTimeout(() => {
      animatingRef.current = false;
      setBestColors(calculateBestColors(nextHistory));
    }, 2000);
  }

  return (
    <div id="screen">
      <KeyContext.Provider value={handleKey}>
        <h1>Wordle</h1>
        <Grid history={history} currentAttempt={currentAttempt} />
        <Keyboard bestColors={bestColors} />
      </KeyContext.Provider>
    </div>
  );
}

function Grid({ history, currentAttempt }) {
  const rows = [];

  for (let i = 0; i < 6; i++) {
    if (i < history.length) {
      rows.push(<Attempt key={i} attempt={history[i]} solved />);
    } else if (i === history.length) {
      rows.push(<Attempt key={i} attempt={currentAttempt} solved={false} />);
    } else {
      rows.push(<Attempt key={i} attempt="" solved={false} />);
    }
  }

  return <div id="grid">{rows}</div>;
}

function Attempt({ attempt, solved }) {
  const cells = [];

  for (let i = 0; i < 5; i++) {
    cells.push(<Cell key={i} index={i} attempt={attempt} solved={solved} />);
  }

  return <div className="row">{cells}</div>;
}

function Cell({ index, attempt, solved }) {
  let content;
  const hasLetter = attempt[index];
  const color = getBgColor(attempt, index);

  if (hasLetter) {
    content = attempt[index];
  }

  return (
    <div
      className={
        "cell " + (solved ? "solved" : "") + (hasLetter ? " filled" : "")
      }
    >
      <div className="surface" style={{ transitionDelay: index * 300 + "ms" }}>
        <div
          className="front"
          style={{
            backgroundColor: BLACK,
            // todo вынести в переменные
            borderColor: hasLetter ? "#7b7f98" : "#414458",
          }}
        >
          {content}
        </div>
        <div
          className="back"
          style={{
            backgroundColor: color,
            borderColor: color,
          }}
        >
          {content}
        </div>
      </div>
    </div>
  );
}

function Keyboard({ bestColors }) {
  return (
    <div id="keyboard">
      <KeyboardRow
        bestColors={bestColors}
        letters="qwertyuiop"
        isLast={false}
      />
      <KeyboardRow bestColors={bestColors} letters="asdfghjkl" isLast={false} />
      <KeyboardRow bestColors={bestColors} letters="zxcvbnm" isLast />
    </div>
  );
}

function KeyboardRow({ letters, isLast, bestColors }) {
  const buttons = [];

  if (isLast) {
    buttons.push(
      <Button key="enter" buttonKey="enter">
        enter
      </Button>,
    );
  }

  for (let letter of letters) {
    buttons.push(
      <Button key={letter} color={bestColors.get(letter)} buttonKey={letter}>
        {letter}
      </Button>,
    );
  }

  if (isLast) {
    buttons.push(
      <Button key="backspace" buttonKey="backspace">
        backspace
      </Button>,
    );
  }

  return <div>{buttons}</div>;
}

function Button({ buttonKey, color = LIGHTGREY, children }) {
  const onKey = useContext(KeyContext);

  return (
    <button
      tabIndex={-1}
      className="button"
      style={{ backgroundColor: color, borderColor: color }}
      onClick={() => {
        onKey(buttonKey);
      }}
    >
      {children}
    </button>
  );
}

function loadHistory() {
  let data;
  try {
    data = JSON.parse(localStorage.getItem("data"));
  } catch (error) {}

  if (data != null) {
    if (data.secret === secret) {
      return data.history;
    }
  }
}

function saveHistory(history) {
  const data = JSON.stringify({
    secret,
    history,
  });

  try {
    localStorage.setItem("data", data);
  } catch (error) {}
}

function usePersistedHistory(onLoad) {
  const [history, setHistory] = useState([]);
  const loadedRef = useRef(false);

  useEffect(() => {
    if (loadedRef.current) {
      return;
    }

    loadedRef.current = true;
    const savedHistory = loadHistory();

    if (savedHistory) {
      setHistory(savedHistory);
      onLoad(savedHistory);
    }
  });

  useEffect(() => {
    saveHistory(history);
  }, [history]);

  return [history, setHistory];
}

function getBgColor(attempt, i) {
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

function calculateBestColors(history) {
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
