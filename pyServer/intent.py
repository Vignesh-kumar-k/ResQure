import logging
from flask import Flask, request, jsonify
from flask_cors import CORS  # Import the CORS class
from groq import Groq
from config import GROQ_API_KEY, LLM_MODEL
import speech_recognition as sr
import pyaudio
import wave
import io

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Initialize Groq API client
client = Groq(api_key=GROQ_API_KEY)

# Function to analyze call intent
def analyze_call_intent(transcription):
    try:
        intent_request = client.chat.completions.create(
            messages=[{
                    "role": "system",
                    "content": "Classify the following call transcription into one of these categories: 'Genuine Emergency', 'Possible Prank', 'Accidental Call'. Be precise and return only the category."
                },
                {
                    "role": "user",
                    "content": transcription,
                },
            ],
            model=LLM_MODEL
        )
        return intent_request.choices[0].message.content.strip()
    except Exception as e:
        logging.error(f"Error analyzing call intent: {e}")
        return "Unknown"

# Function to analyze sentiment
def analyze_sentiment(transcription):
    try:
        sentiment_request = client.chat.completions.create(
            messages=[{
                    "role": "system",
                    "content": "Analyze the emotional tone of the caller. Classify it as: 'Calm', 'Distressed', 'Panic', 'Suspicious'."
                },
                {
                    "role": "user",
                    "content": transcription,
                },
            ],
            model=LLM_MODEL
        )
        return sentiment_request.choices[0].message.content.strip()
    except Exception as e:
        logging.error(f"Error analyzing sentiment: {e}")
        return "Unknown"

# Function to analyze emotion
def analyze_emotion(transcription):
    try:
        emotion_request = client.chat.completions.create(
            messages=[{
                    "role": "system",
                    "content": "Analyze the emotional state based on the following text. Provide one of the following emotions: 'Excitement', 'Frustration', 'Confusion', 'Hesitation', 'Satisfaction', 'Dissatisfaction', 'Curiosity', or 'Skepticism'."
                },
                {
                    "role": "user",
                    "content": transcription,
                },
            ],
            model=LLM_MODEL
        )
        return emotion_request.choices[0].message.content.strip()
    except Exception as e:
        logging.error(f"Error analyzing emotion: {e}")
        return "Neutral"

# Function to analyze urgency
def analyze_urgency(transcription):
    try:
        urgency_request = client.chat.completions.create(
            messages=[{
                    "role": "system",
                    "content": "Based on the call transcription, assess the urgency of the situation. Classify as: 'High', 'Medium', 'Low'."
                },
                {
                    "role": "user",
                    "content": transcription,
                },
            ],
            model=LLM_MODEL
        )
        return urgency_request.choices[0].message.content.strip()
    except Exception as e:
        logging.error(f"Error analyzing urgency: {e}")
        return "Unknown"

# Function to detect repeat caller
def detect_repeat_caller(caller_id, call_logs):
    try:
        call_count = call_logs.get(caller_id, 0)
        if call_count > 5:
            return "High"
        elif call_count > 2:
            return "Moderate"
        else:
            return "None"
    except Exception as e:
        logging.error(f"Error detecting repeat caller: {e}")
        return "Unknown"

def record_audio(duration=5):
    recognizer = sr.Recognizer()
    try:
        pyaudio_instance = pyaudio.PyAudio()
        stream = pyaudio_instance.open(format=pyaudio.paInt16, channels=1, rate=16000, input=True, frames_per_buffer=1024)
        frames = []

        print("Recording...")
        for _ in range(0, int(16000 / 1024 * duration)):
            data = stream.read(1024)
            frames.append(data)

        print("Recording finished.")
        stream.stop_stream()
        stream.close()
        pyaudio_instance.terminate()

        # Save to a wave file
        with wave.open("recorded_audio.wav", 'wb') as wf:
            wf.setnchannels(1)
            wf.setsampwidth(pyaudio_instance.get_sample_size(pyaudio.paInt16))
            wf.setframerate(16000)
            wf.writeframes(b''.join(frames))

        # Save audio to a BytesIO object for further processing
        audio_data = io.BytesIO()
        with wave.open(audio_data, 'wb') as wf:
            wf.setnchannels(1)
            wf.setsampwidth(pyaudio_instance.get_sample_size(pyaudio.paInt16))
            wf.setframerate(16000)
            wf.writeframes(b''.join(frames))

        audio_data.seek(0)
        return audio_data
    except Exception as e:
        logging.error(f"Error recording audio: {e}")
        return None


# Function to process speech recognition
def process_speech_recognition(audio_data):
    recognizer = sr.Recognizer()
    try:
        # Convert the audio to AudioData format and process
        audio = sr.AudioFile(audio_data)
        with audio as source:
            audio_data = recognizer.record(source)

        transcription = recognizer.recognize_google(audio_data)
        return transcription
    except sr.UnknownValueError:
        logging.error("Could not understand audio")
        return ""
    except sr.RequestError:
        logging.error("Error with the speech recognition service")
        return ""
    except Exception as e:
        logging.error(f"Error processing audio: {e}")
        return ""


# Route to handle audio file analysis
@app.route("/analyze-call", methods=["POST"])
def analyze_call():
    try:
        # Record audio from the microphone (for demonstration purposes, 5 seconds of recording)
        audio_data = record_audio(duration=5)  # Record 5 seconds of audio

        if audio_data is None:
            return jsonify({"error": "Unable to record audio"}), 500

        # Process the audio to get transcription
        transcription = process_speech_recognition(audio_data)

        if not transcription:
            return jsonify({"error": "Unable to transcribe audio"}), 500

        # Analyze the transcription using Groq
        intent = analyze_call_intent(transcription)
        sentiment = analyze_sentiment(transcription)
        emotion = analyze_emotion(transcription)
        urgency = analyze_urgency(transcription)
        
        # Simulate repeat caller detection
        repeat_caller = detect_repeat_caller("caller123", {"caller123": 6})  # Mock data

        return jsonify({
            "Call Intent": intent,
            "Sentiment": sentiment,
            "Emotion": emotion,
            "Urgency": urgency,
            "Repeat Caller": repeat_caller,
        })

    except Exception as e:
        logging.error(f"Error processing request: {e}")
        return jsonify({"error": "Internal server error"}), 500

if __name__ == "__main__":
    app.run(debug=True)
