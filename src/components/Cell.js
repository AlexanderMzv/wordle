import { BLACK } from "../const";
import { getBgColor } from "../helpers/colors";

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

export default Cell;
