import { useEffect, useRef, useState } from "react";
import { KeyContext } from "../context";
import { secret, wordList } from "../const";
import Keyboard from "./Keyboard";
import Grid from "./Grid";
import { calculateBestColors } from "../helpers/colors";
import { usePersistedHistory } from "../hooks/usePersistedHistory";

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
