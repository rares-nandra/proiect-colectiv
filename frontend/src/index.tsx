import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./Assets/Fonts/Fonts.css";
import "./Assets/Theme/Default.css";
import "./index.css";

import BrowsePage from "./Pages/BrowsePage/BrowsePage";
import AuthentificationPage from "./Pages/AuthentificationPage/AuthentificationPage";

function App() {
    return (
        <Router>
            <Routes>
                <Route path = "/" element={<BrowsePage />} />
                <Route path = "/auth" element={<AuthentificationPage />} />
            </Routes>
        </Router>
    );
}

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
    <App />
);