import React, { useState } from "react";
import { auth } from "../firebaseConfig"; // Ensure this path is correct
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom"; // ✅ Correct import
import "../styles/LoginPage.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const LoginPage = () => {
    const navigate = useNavigate(); // ✅ useNavigate should be inside the component

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(""); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); 
        setSuccess(""); 

        try {
            await signInWithEmailAndPassword(auth, email, password);
            setSuccess("Login successful!"); 
            navigate("/sidebar"); // ✅ Ensure this route exists in your Router
        } catch (error) {
            setError("Invalid email or password"); 
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>Login</h2>

                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}

                <input 
                    type="email" 
                    placeholder="Email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                />

                <div className="password-container">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button
                        type="button"
                        className="eye-button"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </div>

                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default LoginPage; // ✅ Ensure the component is properly exported
