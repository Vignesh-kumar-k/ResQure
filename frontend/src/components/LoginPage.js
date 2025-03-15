import React, { useState } from "react";
import { auth } from "../firebaseConfig"; // Ensure this path is correct
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom"; // ✅ Correct import
import "../styles/LoginPage.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const LoginPage = () => {
    const navigate = useNavigate(); // ✅ useNavigate should be inside the component

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLogin, setIsLogin] = useState(true); // Toggle between login and registration
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(""); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); 
        setSuccess(""); 

        try {
            if (isLogin) {
                // Login logic
                await signInWithEmailAndPassword(auth, email, password);
                setSuccess("Login successful!"); 
                navigate("/sidebar"); // ✅ Ensure this route exists in your Router
            } else {
                // Registration logic
                await createUserWithEmailAndPassword(auth, email, password);
                setSuccess("Registration successful!"); 
                setIsLogin(true); // After registration, switch to login form
            }
        } catch (error) {
            setError(isLogin ? "Invalid email or password" : "Error during registration");
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2 className="login-form-text">{isLogin ? "Login" : "Register"}</h2>

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

                <button type="submit">{isLogin ? "Login" : "Register"}</button>

                <p className="login-text">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <span 
                        onClick={() => setIsLogin(!isLogin)} 
                        className="toggle-link"
                    >
                        {isLogin ? "Register" : "Login"}
                    </span>
                </p>
            </form>
        </div>
    );
};

export default LoginPage; // ✅ Ensure the component is properly exported
