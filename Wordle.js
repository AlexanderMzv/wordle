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

const history = ["piano", "horse"];
let currentAttempt = "wat";

export default function Wordle() {
  return (
    <div id="screen">
      <h1>Wordle</h1>
      <Grid />
      <Keyboard />
    </div>
  );
}

function Grid() {
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
  return (
    <button
      tabIndex={-1}
      className="button"
      style={{ backgroundColor: LIGHTGRAY }}
      onClick={() => {
        // todo
        // handleKey(buttonKey);
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
