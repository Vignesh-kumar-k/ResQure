import logging
from google.cloud import speech
from pydub import AudioSegment
import speech_recognition as sr
from groq import Groq
from config import GROQ_API_KEY, LLM_MODEL

# Set up the Groq API client
client = Groq(api_key=GROQ_API_KEY)

# Convert MP3 to WAV
def convert_mp3_to_wav(mp3_file_path, wav_file_path):
    try:
        audio = AudioSegment.from_mp3(mp3_file_path)
        audio.export(wav_file_path, format="wav")
        return wav_file_path
    except Exception as e:
        logging.error(f"Error converting MP3 to WAV: {e}")
        return None

# Transcribe the WAV file using Google Speech-to-Text API
def transcribe_audio(wav_file_path):
    try:
        client = speech.SpeechClient()
        
        # Load the audio file
        with open(wav_file_path, "rb") as audio_file:
            content = audio_file.read()

        # Configure the audio file and request
        audio = speech.RecognitionAudio(content=content)
        config = speech.RecognitionConfig(
            encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
            sample_rate_hertz=16000,
            language_code="en-US",
        )

        # Perform speech-to-text
        response = client.recognize(config=config, audio=audio)
        
        # Extract and return the transcription
        if response.results:
            transcription = response.results[0].alternatives[0].transcript
            return transcription
        else:
            return ""
    except Exception as e:
        logging.error(f"Error transcribing audio: {e}")
        return ""

# Analyze the transcription for intent
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

# Perform sentiment, emotion, urgency, and background noise analysis (same as your existing methods)

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

def analyze_background_noise(audio_data):
    try:
        if "vehicle" in audio_data.lower():
            return "Vehicle sound detected"
        elif "screaming" in audio_data.lower():
            return "Screaming detected"
        else:
            return "No significant background noise detected"
    except Exception as e:
        logging.error(f"Error analyzing background noise: {e}")
        return "Noise analysis failed"

# Main function to process everything
def analyze_ambulance_call(mp3_file_path, caller_id, call_logs, audio_data):
    wav_file_path = convert_mp3_to_wav(mp3_file_path, "converted_audio.wav")
    if wav_file_path:
        transcription = transcribe_audio(wav_file_path)
        if transcription:
            intent = analyze_call_intent(transcription)
            sentiment = analyze_sentiment(transcription)
            emotion = analyze_emotion(transcription)
            urgency = analyze_urgency(transcription)
            repeat_status = detect_repeat_caller(caller_id, call_logs)
            background_noise = analyze_background_noise(audio_data)

            return {
                "Call Intent": intent,
                "Sentiment": sentiment,
                "Emotion": emotion,
                "Urgency": urgency,
                "Repeat Caller": repeat_status,
                "Background Noise": background_noise
            }
    return None

# Sample usage
if __name__ == "__main__":
    mp3_file_path = "path_to_audio_file.mp3"  # Replace with your MP3 file path
    caller_id = "+1234567890"
    call_logs = {
        "+1234567890": 1,
        "+0987654321": 6,
    }

    audio_data = "screaming vehicle"  # Sample background noise data

    analysis = analyze_ambulance_call(mp3_file_path, caller_id, call_logs, audio_data)
    if analysis:
        for key, value in analysis.items():
            print(f"{key}: {value}")
