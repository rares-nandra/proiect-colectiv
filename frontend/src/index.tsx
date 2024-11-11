import ReactDOM from "react-dom/client";

import "./Assets/Fonts/Fonts.css";
import "./Assets/Theme/Default.css";
import "./index.css";

import BrowsePage from "./Pages/BrowsePage/BrowsePage";

function App() {
    return (
        <BrowsePage />
    );
}

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
    <App />
);