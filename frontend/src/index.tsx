import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./Assets/Fonts/Fonts.css";
import "./Assets/Theme/Default.css";
import "./index.css";

import BrowsePage from "./Pages/BrowsePage/BrowsePage";
import FavoritePage from "./Pages/FavoritePage/FavoritePage"; // Import Favorites Page
import CartPage from "./Pages/CartPage/CartPage"; 
import AuthentificationPage from "./Pages/AuthentificationPage/AuthentificationPage";
import CheckoutForm from "./Pages/CartPage/CheckoutPage";
import ThankYouPage from "./Pages/CartPage/ThankYouPage";
import ProfilePage from "./Pages/ProfilePage/ProfilePage";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<BrowsePage />} />
                <Route path="/favorites" element={<FavoritePage />} /> {/* Add Favorites Route */}
                <Route path="/auth" element={<AuthentificationPage />} />
                <Route path="/cart" element={<CartPage />} /> {}
                <Route path="/checkout" element={<CheckoutForm />} />
                <Route path="/thank-you" element={<ThankYouPage />} />
                <Route path="/profile" element={<ProfilePage />} />
            </Routes>
        </Router>
    );
}

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(<App />);
