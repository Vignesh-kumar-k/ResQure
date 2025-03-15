import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage"; // ✅ Ensure the path is correct
import Sidebar from "./components/Sidebar"; // ✅ Ensure Sidebar exists

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/sidebar" element={<Sidebar />} />
            </Routes>
        </Router>
    );
}

export default App;
