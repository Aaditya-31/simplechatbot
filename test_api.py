import os
from dotenv import load_dotenv
from google import genai

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

try:
    print(f"Using API Key: {api_key}")
    client = genai.Client(api_key=api_key)
    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents='hello'
    )
    print("Success:", response.text)
except Exception as e:
    import traceback
    traceback.print_exc()
