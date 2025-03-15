import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebaseConfig"; // Import Firebase auth
import { signOut } from "firebase/auth"; // Import signOut function
import "../styles/Sidebar.css";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();
  const [audioBlob, setAudioBlob] = useState(null);
  const fileInputRef = useRef(null);

  // Handle Logout
  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign out the user from Firebase
      navigate("/"); // Redirect to login page
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Handle Voice Recording
  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    const audioChunks = [];

    mediaRecorder.ondataavailable = (event) => {
      audioChunks.push(event.data);
    };

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: "audio/mp3" });
      setAudioBlob(audioBlob);
    };

    mediaRecorder.start();
    setTimeout(() => mediaRecorder.stop(), 5000); // Stops after 5 sec
  };

  // Handle MP3 Upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    console.log("Uploaded File:", file);
  };

  return (
    <div className="main-container">
      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
        <button className="toggle-btn" onClick={() => setIsOpen(!isOpen)}>☰</button>
        
        <div className="logo">
          <h2>Resqure</h2>
        </div>

        <ul className="menu">
          <li><a href="#">Dashboard</a></li>
          <li><a href="#">Analytics</a></li>
          <li><a href="#">Profile</a></li>
          <li><a href="#">Settings</a></li>
          <li><button className="logout-btn" onClick={handleLogout}>Logout</button></li>
        </ul>
      </div>

      {/* Bento Grid placed outside Sidebar */}
      <div className="bento-grid">
        <div className="bento-box">
          <h3>Audio & Phone Input</h3>

          <button onClick={startRecording}>🎤 Start Recording</button>
          {audioBlob && <audio controls src={URL.createObjectURL(audioBlob)} />}

          <input className="fileinput" 
            type="file" 
            accept="audio/mp3" 
            ref={fileInputRef} 
            onChange={handleFileUpload}
          />

         
          <input type="tel" placeholder="+91" />
        </div>

        {/* Future Features Can Be Added Here  */}
        <div className="bento-box">
          <h3>Feature 2</h3>
          <p>More features can be added here.</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
