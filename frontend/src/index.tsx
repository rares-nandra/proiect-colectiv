import ReactDOM from "react-dom/client";

import "./Assets/Fonts/Fonts.css";
import "./index.css";

import Button from "./Components/ui/Button/Button";

const test = (buttonName: string) => {
    console.log("butonul " + buttonName + " a fost apasat");
}

function App() {
    return (
        <>
            <Button onClick = {() => {test("salutari 1")}} text = {"Salutari 1"} customizations = {{backgroundColor: "#121212", foregroundColor: "rgb(255, 255, 255)", fontSize: "12px", padding: "10px 20px"}}/>
            <Button onClick = {() => {test("salutari 2")}} text = {"Salutari 2"} customizations = {{backgroundColor: "#121212", foregroundColor: "rgb(255, 255, 255)", fontSize: "12px", padding: "10px 20px"}}/>
        </>
    );
}

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
    <App />
);