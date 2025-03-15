import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for routing
import "../styles/HeroSection.css"; // Ensure you have the proper CSS for styling

const HeroSection = () => {
  const navigate = useNavigate(); // Initialize the useNavigate hook

  // Function to handle the admin button click
  const handleAdminClick = () => {
    navigate("/login"); // Redirects to the LoginPage when the Admin button is clicked
  };

  return (
    <section className="hero-container">
      {/* Admin Button in the top-right corner */}
      <div className="admin-btn-container">
        <button className="admin-btn" onClick={handleAdminClick}>
          Admin
        </button>
      </div>

      <div className="hero-content">
        <h1 className="hero-title">Join the Rapid Response Team Today!</h1>
        <p className="hero-subtitle">
          Be a part of an essential network that delivers fast, reliable, and life-saving emergency services.
          Whether you're an ambulance team, fire engine service, or other emergency responders, register today to help save lives.
        </p>
        <div className="hero-buttons">
          <button className="cta-btn-primary">Register Your Team Now</button>
          <button className="cta-btn-secondary">Learn More</button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
