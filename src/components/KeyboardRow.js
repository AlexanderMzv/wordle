import Button from "./Button";

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

export default KeyboardRow;
