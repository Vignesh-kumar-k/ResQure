import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import "../styles/Sidebar.css";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [audioBlob, setAudioBlob] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState(""); // Added state for live transcript
  const fileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const navigate = useNavigate();
  const [recognition, setRecognition] = useState(null);

  // Handle Logout
  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign out the user from Firebase
      navigate("/"); // Redirect to login page
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Initialize Speech Recognition for live transcription
  useEffect(() => {
    if (window.SpeechRecognition || window.webkitSpeechRecognition) {
      const SpeechRecognitionAPI =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognitionAPI();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = "en-US"; // Set language to English

      recognitionInstance.onresult = (event) => {
        let currentTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptPart = event.results[i][0].transcript;
          currentTranscript += transcriptPart;
        }
        setTranscript(currentTranscript); // Update live transcript
      };

      setRecognition(recognitionInstance);
    }
  }, []);

  // Start or stop recording
  const toggleRecording = async () => {
    if (!isRecording) {
      // Start recording
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/mp3" });
        setAudioBlob(audioBlob);

        // Send the audioBlob to the Flask backend
        const formData = new FormData();
        formData.append("audio", audioBlob, "audio.mp3");

        try {
          const response = await fetch("http://localhost:5000/analyze-call", {
            method: "POST",
            body: formData,
          });

          const result = await response.json();
          console.log("Analysis Result:", result);
          setAnalysisResult(result); // Store the analysis result in state
        } catch (error) {
          console.error("Error analyzing audio:", error);
        }
      };

      mediaRecorder.start();
      recognition.start(); // Start live transcription
      setIsRecording(true); // Update state to indicate recording is in progress
    } else {
      // Stop recording
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
      if (recognition) {
        recognition.stop(); // Stop live transcription
      }
      setIsRecording(false); // Update state to indicate recording has stopped
    }
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
        <button className="toggle-btn" onClick={() => setIsOpen(!isOpen)}>
          ☰
        </button>

        <div className="logo">
          <h2>Resqure</h2>
        </div>

        <ul className="menu">
          <li>
            <a href="#">Dashboard</a>
          </li>
          <li>
            <a href="#">Profile</a>
          </li>
          <li>
            <a href="#">Settings</a>
          </li>
          <li>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </li>
        </ul>
      </div>

      {/* Bento Grid placed outside Sidebar */}
      <div className="bento-grid">
        <div className="bento-box">
          <h3>Audio & Phone Input</h3>
          {/* Voice Recording */}
          <button onClick={toggleRecording}>
            {isRecording ? "🎤 End Recording" : "🎤 Start Recording"}
          </button>
          {audioBlob && <audio controls src={URL.createObjectURL(audioBlob)} />}

          <input
            type="file"
            accept="audio/mp3"
            ref={fileInputRef}
            onChange={handleFileUpload}
          />

          {/* Phone Number Input */}
          <input type="tel" placeholder="Enter phone number" />
        </div>

        {/* Feature 2 with live transcript */}
        <div className="bento-box">
          <h3>Live Transcript</h3>
          <p>{transcript || "Start recording to see the transcript..."}</p>

          {/* Display the analysis result below the live transcript */}
          {analysisResult && (
            <div>
              <h4>Analysis Results:</h4>
              <p><strong>Call Intent:</strong> {analysisResult["Call Intent"]}</p>
              <p><strong>Sentiment:</strong> {analysisResult["Sentiment"]}</p>
              <p><strong>Emotion:</strong> {analysisResult["Emotion"]}</p>
              <p><strong>Urgency:</strong> {analysisResult["Urgency"]}</p>
              <p><strong>Repeat Caller:</strong> {analysisResult["Repeat Caller"]}</p>
              <p><strong>Background Noise:</strong> {analysisResult["Background Noise"]}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
