import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/HeroSection.css";
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBQyzO6tVm4CMol5Bt-Rr9brXjYpA7w-DY",
  authDomain: "roadsafe-bb4be.firebaseapp.com",
  projectId: "roadsafe-bb4be",
  storageBucket: "roadsafe-bb4be.appspot.com",
  messagingSenderId: "904816955258",
  appId: "1:904816955258:web:05f31f02b7cfcbe37e90c3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const HeroSection = () => {
  const navigate = useNavigate(); // Initialize the useNavigate hook
  const [formVisible, setFormVisible] = useState(false); // State to track form visibility
  const [formData, setFormData] = useState({
    agencyName: '',
    area: '',
    city: '',
    contact: ''
  });
  const [successMessage, setSuccessMessage] = useState('');

  // Function to handle the admin button click
  const handleAdminClick = () => {
    navigate("/login"); // Redirects to the LoginPage when the Admin button is clicked
  };

  // Function to toggle form visibility
  const handleRegisterClick = () => {
    setFormVisible(true); // Shows the registration form when the button is clicked
  };

  // Function to handle closing the form
  const handleCloseForm = () => {
    setFormVisible(false); // Hides the registration form
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Add the form data to Firestore under the 'emergency_provider_details' collection
      const docRef = await addDoc(collection(db, 'emergency_provider_details'), {
        agencyName: formData.agencyName,
        area: formData.area,
        city: formData.city,
        contact: formData.contact,
      });

      setSuccessMessage('Registration successful!');
      setFormData({ agencyName: '', area: '', city: '', contact: '' }); // Clear the form after submission
    } catch (e) {
      console.error("Error adding document: ", e);
      alert("Error: " + e.message); // Show a message in case of error
    }
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
          <button className="cta-btn-primary" onClick={handleRegisterClick}>
            Register Your Team Now
          </button>
          <button className="cta-btn-secondary">Learn More</button>
        </div>
      </div>

      {/* Background blur when form is visible */}
      {formVisible && <div className="overlay"></div>}

      {/* Registration Form */}
      {formVisible && (
        <div className="registration-form-container">
          <form className="registration-form" onSubmit={handleSubmit}>
            <h2>Register Your Team</h2>
            <div className="form-group">
              <label>Agency Name</label>
              <input
                type="text"
                name="agencyName"
                value={formData.agencyName}
                onChange={handleInputChange}
                placeholder="Enter agency name"
                required
              />
            </div>
            <div className="form-group">
              <label>Area</label>
              <input
                type="text"
                name="area"
                value={formData.area}
                onChange={handleInputChange}
                placeholder="Enter area"
                required
              />
            </div>
            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="Enter city"
                required
              />
            </div>
            <div className="form-group">
              <label>Contact</label>
              <input
                type="text"
                name="contact"
                value={formData.contact}
                onChange={handleInputChange}
                placeholder="Enter contact number"
                required
              />
            </div>
            <button type="submit" className="register-btn">Register</button>
            <button type="button" className="cancel-btn" onClick={handleCloseForm}>
              Cancel
            </button>
            {successMessage && <div className="success-message">{successMessage}</div>}
          </form>
        </div>
      )}
    </section>
  );
};

export default HeroSection;
