import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Set initial theme from localStorage or default to wine
const savedTheme = localStorage.getItem('gitaverse-theme') || 'wine';
document.documentElement.setAttribute('data-theme', savedTheme);

createRoot(document.getElementById("root")!).render(<App />);
