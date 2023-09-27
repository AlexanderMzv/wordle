import { useEffect, useState, useContext } from "react";
import { KeyContext } from "./context";

const BLACK = "#191a24";
const GRAY = "#3d4054";
const LIGHTGRAY = "#656780";
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
  const [history, setHistory] = useState([]);
  const [currentAttempt, setCurrentAttempt] = useState("");

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

    // todo
    // if (isAnimating) {
    //   return;
    // }

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
      setHistory([...history, currentAttempt]);
      setCurrentAttempt("");
      // todo: persistence
      // saveGame();
      // pauseInput();
    } else if (letter === "backspace") {
      setCurrentAttempt(currentAttempt.slice(0, currentAttempt.length - 1));
    } else if (/^[a-z]$/.test(letter)) {
      console.log("currentAttempt", currentAttempt);
      if (currentAttempt.length < 5) {
        setCurrentAttempt(currentAttempt + letter);
        // todo
        // animatePress(currentAttempt.length - 1);
      }
    }
  }

  return (
    <div id="screen">
      <KeyContext.Provider value={handleKey}>
        <h1>Wordle</h1>
        <Grid history={history} currentAttempt={currentAttempt} />
        <Keyboard />
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
      rows.push(<Attempt key={i} attempt={""} solved={false} />);
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
  } else {
    // todo
    // clearAnimation(cell);
  }

  return (
    <div className={"cell " + (solved ? "solved" : "")}>
      <div className="surface" style={{ transitionDelay: index * 300 + "ms" }}>
        <div
          className="front"
          style={{
            backgroundColor: BLACK,
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

function Keyboard() {
  return (
    <div id="keyboard">
      <KeyboardRow letters="qwertyuiop" isLast={false} />
      <KeyboardRow letters="asdfghjkl" isLast={false} />
      <KeyboardRow letters="zxcvbnm" isLast />
    </div>
  );
}

function KeyboardRow({ letters, isLast }) {
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
      <Button key={letter} buttonKey={letter}>
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

function Button({ buttonKey, children }) {
  const onKey = useContext(KeyContext);

  return (
    <button
      tabIndex={-1}
      className="button"
      style={{ backgroundColor: LIGHTGRAY }}
      onClick={() => {
        onKey(buttonKey);
      }}
    >
      {children}
    </button>
  );
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
