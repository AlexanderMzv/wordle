import { createRoot } from "react-dom/client";
import Wordle from "./components/Wordle";

const root = createRoot(document.getElementById("root"));
root.render(<Wordle />);
