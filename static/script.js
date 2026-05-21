document.addEventListener('DOMContentLoaded', () => {
    const chatForm = document.getElementById('chat-form');
    const userInput = document.getElementById('user-input');
    const chatBody = document.getElementById('chat-body');
    const sendBtn = document.getElementById('send-btn');

    // Automatically scroll to bottom
    const scrollToBottom = () => {
        chatBody.scrollTop = chatBody.scrollHeight;
    };

    // Add a new message to the chat
    const addMessage = (text, isUser = false) => {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'} slide-in`;
        
        let avatarHtml = '';
        if (!isUser) {
            avatarHtml = `
                <div class="avatar">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z" fill="#008080" opacity="0.2"/>
                        <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="#008080"/>
                    </svg>
                </div>
            `;
        }

        // We use innerHTML to allow basic formatting if needed, but textContent is safer for user input.
        // For simplicity and safety against XSS from user, we create text nodes.
        const bubbleDiv = document.createElement('div');
        bubbleDiv.className = 'bubble';
        if (isUser) {
            bubbleDiv.textContent = text; // Escapes HTML for user input
        } else {
            bubbleDiv.innerHTML = marked.parse(text); // Render Markdown for bot
        }

        messageDiv.innerHTML = avatarHtml;
        messageDiv.appendChild(bubbleDiv);

        chatBody.appendChild(messageDiv);
        scrollToBottom();
    };

    // Show typing indicator
    const showTypingIndicator = () => {
        const indicatorDiv = document.createElement('div');
        indicatorDiv.className = 'message bot-message slide-in';
        indicatorDiv.id = 'typing-indicator-wrapper';
        
        indicatorDiv.innerHTML = `
            <div class="avatar">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z" fill="#008080" opacity="0.2"/>
                    <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="#008080"/>
                </svg>
            </div>
            <div class="bubble typing-indicator">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        `;
        
        chatBody.appendChild(indicatorDiv);
        scrollToBottom();
    };

    // Remove typing indicator
    const removeTypingIndicator = () => {
        const indicatorDiv = document.getElementById('typing-indicator-wrapper');
        if (indicatorDiv) {
            indicatorDiv.remove();
        }
    };

    // Handle form submission
    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const message = userInput.value.trim();
        if (!message) return;

        // 1. Add user message
        addMessage(message, true);
        userInput.value = '';
        sendBtn.disabled = true;

        // 2. Show typing indicator
        showTypingIndicator();

        try {
            // 3. Send request to backend
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: message })
            });

            const data = await response.json();
            
            removeTypingIndicator();

            if (response.ok) {
                addMessage(data.response, false);
            } else {
                addMessage(`Error: ${data.detail || 'Something went wrong.'}`, false);
            }
            
        } catch (error) {
            removeTypingIndicator();
            addMessage("Sorry, I'm having trouble connecting to the server.", false);
            console.error('Chat error:', error);
        } finally {
            sendBtn.disabled = false;
            userInput.focus();
        }
    });

    // Initial focus
    userInput.focus();
});
