 // Text-to-Speech Function
 function textToAudio(message) {
    let speech = new SpeechSynthesisUtterance();

    speech.lang = "en-US";
    speech.text = message;
    speech.volume = 1.0; // Volume (0 to 1)
    speech.rate = 1.0;   // Speed (0.1 to 10)
    speech.pitch = 1.0;  // Pitch (0 to 2)

    speechSynthesis.speak(speech);
}

$(document).ready(function() {
    // Handle form submission
    $('#user-input-form').on('submit', function(event) {
        event.preventDefault();

        var user_input = $('#user-input').val().trim();
        if (user_input !== '') {
            $('#user-input').val(''); // Clear input
            appendUserMessage(user_input); // Append user message to chat

            // Send input to Flask backend via AJAX
            $.ajax({
                type: 'POST',
                url: '/chat', // Flask route for processing chat
                data: { user_input: user_input },
                success: function(response) {
                    if (response.response) {
                        appendChatbotMessage(response.response);
                    } else {
                        appendChatbotMessage("I'm sorry, I didn't understand that.");
                    }
                },
                error: function(xhr, status, error) {
                    console.error('AJAX Error:', error);
                    appendChatbotMessage("An error occurred. Please try again later.");
                }
            });
        }
    });

    // Append user message
    function appendUserMessage(message) {
        var messageElement = $('<div class="message user-message"></div>').text(message);
        $('#chat-container').append(messageElement);
        scrollChatToBottom();
    }

    // Append chatbot message and trigger Text-to-Speech
    function appendChatbotMessage(message) {
        var messageElement = $('<div class="message chatbot-message"></div>').text(message);
        $('#chat-container').append(messageElement);
        scrollChatToBottom();

        // Call text-to-speech to read chatbot message
        textToAudio(message);
    }

    // Scroll chat to bottom
    function scrollChatToBottom() {
        var chatContainer = $('#chat-container');
        chatContainer.scrollTop(chatContainer[0].scrollHeight);
    }
});