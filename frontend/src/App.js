import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import Sidebar from "./components/Sidebar"; 
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
