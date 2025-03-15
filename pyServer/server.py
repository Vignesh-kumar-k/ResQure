import requests
from transformers import pipeline

# 🔑 Replace with your free API key from NumVerify
NUMVERIFY_API_KEY = "bc4b78f0d282fd4ad8020f8d0b44f2d0"
NUMVERIFY_API_URL = "http://apilayer.net/api/validate"

# Load Hugging Face model for spam detection
spam_classifier = pipeline("text-classification", model="mrm8488/bert-tiny-finetuned-sms-spam-detection")

def get_phone_number_details(phone_number, country_code="IN"):
    """
    Fetch phone number details from NumVerify API.
    """
    params = {
        "access_key": NUMVERIFY_API_KEY,
        "number": phone_number,
        "country_code": country_code
    }
    response = requests.get(NUMVERIFY_API_URL, params=params)
    
    if response.status_code == 200:
        return response.json()
    else:
        return {"error": "Failed to fetch phone details"}

def classify_spam_number(phone_number):
    """
    Check if a phone number is spam using a Hugging Face model.
    """
    phone_details = get_phone_number_details(phone_number)
    
    if "error" in phone_details:
        return phone_details
    
    # Construct a text-based pattern for analysis
    number_info = f"Carrier: {phone_details.get('carrier', 'Unknown')}, Location: {phone_details.get('location', 'Unknown')}"
    
    # Classify using Hugging Face model
    result = spam_classifier(number_info)[0]
    
    return {
        "phone_number": phone_number,
        "valid": phone_details.get("valid", False),
        "carrier": phone_details.get("carrier", "Unknown"),
        "line_type": phone_details.get("line_type", "Unknown"),
        "location": phone_details.get("location", "Unknown"),
        "is_spam": "Yes" if result["label"] == "spam" else "No",
        "confidence": result["score"]
    }

# 📌 Example Usage
phone_number = "+18005550000"  # Change this to test with other numbers
result = classify_spam_number(phone_number)
print(result)
