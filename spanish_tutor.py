import google.generativeai as genai
import os

genai.configure(api_key="AIzaSyAq9duOY8_UAeZAJcKdptEI5PDZstlgqP8")

model = genai.GenerativeModel('gemini-pro')
file = open("chat_history.txt", "r")
from_file = file.read()
file.close()
print(from_file)
chat = model.start_chat(history=[])

response = chat.send_message("Hello.")
print("User: hello")
print("Gemini: " + response.text)

chat_history=[f"User: Hello. Response: {response.text}"]
cond = True

while(cond):
    user_input = input("User: ")
    response = chat.send_message(user_input, generation_config={'temperature': 0.0})
    print("Gemini: " + response.text)
    chat_history.append("User: " + user_input + " Response: " + response.text)
    if(user_input == "exit"):
        cond = False
    
print(chat_history)
file = open("chat_history.txt", "a")
for message in chat_history:
    file.write(f"\n{message}")
file.close
        
