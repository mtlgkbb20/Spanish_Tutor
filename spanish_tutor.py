# import google.generativeai as genai
# import os

# genai.configure(api_key="AIzaSyAq9duOY8_UAeZAJcKdptEI5PDZstlgqP8")

# model = genai.GenerativeModel('gemini-pro')
# file = open("chat_history.txt", "r")
# from_file = file.read()
# file.close()
# print(from_file)
# chat = model.start_chat(history=[])

# response = chat.send_message("Hello.")
# print("User: hello")
# print("Gemini: " + response.text)

# chat_history=[f"User: Hello. Response: {response.text}"]
# cond = True

# while(cond):
#     user_input = input("User: ")
#     response = chat.send_message(user_input, generation_config={'temperature': 0.0}, stream=True)
#     print("Gemini: " + response.text)
#     chat_history.append("User: " + user_input + " Response: " + response.text)
#     if(user_input == "exit"):
#         cond = False

# print(chat.history)
# print(chat)

# file = open("chat_history.txt", "a")
# file.write(f"\n{chat.history}")
# file.close
        
from mistralai.client import MistralClient
from mistralai.models.chat_completion import ChatMessage
import os

api_key = os.environ["MISTRAL_API_KEY"]
model = "mistral-tiny"

client = MistralClient(api_key=api_key)

messages = [
    ChatMessage(role="user", content="What is the best French cheese?")
]

# No streaming
chat_response = client.chat(
    model=model,
    messages=messages,
)

# With streaming
for chunk in client.chat_stream(model=model, messages=messages):
    print(chunk)