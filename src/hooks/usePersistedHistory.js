import { useEffect, useRef, useState } from "react";
import { loadHistory, saveHistory } from "../helpers/history";

export function usePersistedHistory(onLoad) {
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
