import requests

try:
    print("Sending request 1...")
    res = requests.post("http://127.0.0.1:8000/api/chat", json={"message": "hi"})
    print("Response 1:", res.text)
    
    print("\nSending request 2...")
    res = requests.post("http://127.0.0.1:8000/api/chat", json={"message": "i have fever"})
    print("Response 2:", res.text)
except Exception as e:
    print("Error:", e)
