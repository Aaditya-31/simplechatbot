import traceback
from main import get_chat

try:
    chat = get_chat()
    print("Chat instantiated successfully!")
    print("\nSending message: 'i have cold'...")
    response = chat.send_message("i have cold")
    print("Response:", response.text)
except Exception as e:
    print(f"Error occurred: {type(e).__name__} - {e}")
    traceback.print_exc()
