# Resqure Project

*Resqure* is a web-based application that provides functionalities such as speech recognition, live transcription, audio analysis, and user authentication through Firebase. The app offers an intuitive user interface for easy interaction, featuring a sidebar navigation menu, real-time transcription from voice recordings, and the ability to upload audio files for further analysis.

## Features

- *Sidebar Navigation*: Provides easy access to the Dashboard, Profile, Settings, and Logout.
- *Audio & Phone Input*: Record and upload audio files, with live transcription during recording.
- *Live Transcript*: Real-time transcription of speech using the browser's Speech Recognition API.
- *Audio Analysis*: Sends recorded audio to the backend for analysis and displays the results, such as call intent, sentiment, emotion, and more.
- *Phone Number Input*: Allows users to input their phone number for additional use cases.

## Technologies Used

- *Frontend*: React
  - React Hooks (useState, useEffect, useRef)
  - React Router (useNavigate for navigation)
  - Firebase Authentication
- *Backend*: Flask (for handling audio analysis)
- *Speech Recognition*: Web Speech API (SpeechRecognition)
- *Firebase*: Used for user authentication
- *CSS*: Flexbox layout for responsive design

## Setup

### Prerequisites

1. *Node.js*: Ensure you have Node.js installed on your machine. You can download it from [here](https://nodejs.org/).
2. *Firebase Account*: Create a Firebase project and configure Firebase Authentication.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Vignesh-kumar-k/ResQure.git
   cd ResQure
