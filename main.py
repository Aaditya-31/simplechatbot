import os
from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from dotenv import load_dotenv

# Use standard google-genai library
from google import genai
from google.genai import types

# Explicitly load .env from the current directory
env_path = os.path.join(os.path.dirname(__file__), ".env")
load_dotenv(env_path)

app = FastAPI(title="Virtual Doctor Chatbot")

# 2. Instantiate the Chat Lazily
chat_session = None
genai_client = None

def get_chat():
    global chat_session, genai_client
    if chat_session is None:
        # Try loading again just in case
        load_dotenv(env_path)
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key or api_key == "your_gemini_api_key_here":
            raise ValueError(f"GEMINI_API_KEY is not set. Found: {api_key}. Please update the .env file.")
        
        # Instantiate the GenAI client and keep it global
        genai_client = genai.Client(api_key=api_key)
        
        config = types.GenerateContentConfig(
            system_instruction=(
                "You are a compassionate, knowledgeable, and professional virtual doctor. "
                "The user is your patient. Ask them about their symptoms or problems, provide a helpful and empathetic diagnosis or solution, "
                "and give them a mock prescription or treatment plan. "
                "CRITICAL: Keep your responses short, crisp, and highly structured. Use markdown bullet points, bold text, and numbered lists. Do NOT write long paragraphs. "
                "Always clarify that you are an AI and this is for demonstration purposes."
            )
        )
        chat_session = genai_client.chats.create(model="gemini-2.5-flash", config=config)
        
    return chat_session

# 3. Mount Static Files for Frontend
os.makedirs("static", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
def read_root():
    return FileResponse("static/index.html")

# 4. Define API Request/Response models
class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str

# 5. Define Chat Endpoint
@app.post("/api/chat", response_model=ChatResponse)
async def chat_endpoint(req: ChatRequest):
    try:
        chat = get_chat()
        
        # Run the agent with the user's message
        response = chat.send_message(req.message)
            
        return ChatResponse(response=response.text)
        
    except ValueError as ve:
        # Catch our custom value error for missing API key
        raise HTTPException(status_code=500, detail=str(ve))
    except Exception as e:
        print(f"Error during chat: {e}")
        raise HTTPException(status_code=500, detail="An error occurred while processing your request.")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
