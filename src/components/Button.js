import { KeyContext } from "../context";
import { useContext } from "react";
import { LIGHTGREY } from "../const";

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

export default Button;
