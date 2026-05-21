import traceback
from main import get_chat

try:
    chat = get_chat()
    print("Chat instantiated successfully!")
    response1 = chat.send_message("hi")
    print("Response 1:", response1.text)
    
    print("\nSending second message...")
    response2 = chat.send_message("i have fever")
    print("Response 2:", response2.text)
except Exception as e:
    print("Error occurred!")
    traceback.print_exc()
