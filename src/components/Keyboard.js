import KeyboardRow from "./KeyboardRow";

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

export default Keyboard;
