from flask import Flask, render_template, request, jsonify
import pickle
import json
import random

app = Flask(__name__)

# Load the trained model and vectorizer
try:
    with open('model/chatbot_model.pkl', 'rb') as f:
        best_model = pickle.load(f)
    with open('model/vectorizer.pkl', 'rb') as f:
        vectorizer = pickle.load(f)
    print("Model and vectorizer loaded successfully.")
except Exception as e:
    print(f"Error loading model or vectorizer: {e}")

# Load the intents data
try:
    with open('dataset/intents1.json', 'r') as f:
        intents = json.load(f)
    print("Intents data loaded successfully.")
except Exception as e:
    print(f"Error loading intents file: {e}")

def chatbot_response(user_input):
    try:
        input_text = vectorizer.transform([user_input])
        predicted_intent = best_model.predict(input_text)[0]
        print(f"Predicted intent: {predicted_intent}")

        for intent in intents['intents']:
            if intent['tag'] == predicted_intent:
                response = random.choice(intent['responses'])
                print(f"Response: {response}")
                return response

        return "Sorry, I don't understand that."
    except Exception as e:
        print(f"Error generating response: {e}")
        return "There was an error processing your request."

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat():
    user_input = request.form.get('user_input', '')
    if not user_input:
        return "Please provide input."
    response = chatbot_response(user_input)
    return jsonify({'response': response})

if __name__ == '__main__':
    app.run(debug=True)
