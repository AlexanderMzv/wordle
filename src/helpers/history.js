import { secret } from "../const";

export function loadHistory() {
  let data;
  try {
    data = JSON.parse(localStorage.getItem("data"));
  } catch (error) {
    console.error(error);
  }

  if (data != null) {
    if (data.secret === secret) {
      return data.history;
    }
  }
}

export function saveHistory(history) {
  const data = JSON.stringify({
    secret,
    history,
  });

  try {
    localStorage.setItem("data", data);
  } catch (error) {
    console.error(error);
  }
}
