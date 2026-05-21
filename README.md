# Virtual Doctor Chatbot

A simple, empathetic AI chatbot that acts as a Virtual Doctor. It listens to user symptoms and provides structured, empathetic advice and mock treatment plans.

> **Note**: This application is powered by Google's Gemini AI. It provides advice for demonstration purposes only and should **not** replace actual medical diagnoses or treatments.

## Features
- **Modern User Interface**: A clean, responsive frontend built with HTML, CSS, and JavaScript.
- **Markdown Support**: The chatbot replies with fully formatted text including bolding and bullet points.
- **AI-Powered Backend**: Utilizes the new `google-genai` SDK and the `gemini-2.5-flash` model.
- **FastAPI Integration**: Provides high-performance async API endpoints.

## Technologies Used
- **Backend**: Python 3.13, FastAPI, Uvicorn, python-dotenv
- **AI Integration**: Google GenAI SDK (Gemini API)
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla), Marked.js

## Setup Instructions

### Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Aaditya-31/simplechatbot.git
   cd simplechatbot
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure the Environment:**
   Create a `.env` file in the root directory and add your Google Gemini API key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

4. **Run the server locally:**
   ```bash
   python main.py
   ```
   Open your browser and navigate to `http://127.0.0.1:8000`.

### Docker

1. **Build the Docker Image:**
   ```bash
   docker build -t virtual-doctor-chatbot .
   ```

2. **Run the Container:**
   ```bash
   docker run -p 8000:8000 --env-file .env virtual-doctor-chatbot
   ```
