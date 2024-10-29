import ReactDOM from "react-dom/client";

import "./Assets/Fonts/Fonts.css";
import "./index.css";

function App() {
    return (
        <h1>Hello world!</h1>
    );
}

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
    <App />
);