import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage"; // ✅ Ensure the path is correct
import Sidebar from "./components/Sidebar"; // ✅ Ensure Sidebar exists
import HeroSection from "./components/HeroSection";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HeroSection />}/>
                
                <Route path="/login" element={<LoginPage />} />
                <Route path="/sidebar" element={<Sidebar />} />
            </Routes>
        </Router>
    );
}

export default App;
