import google.generativeai as genai
import os

genai.configure(api_key="AIzaSyAq9duOY8_UAeZAJcKdptEI5PDZstlgqP8")

model = genai.GenerativeModel('gemini-pro')
chat = model.start_chat()

response = chat.send_message("Hello.")
print("User: hello")
print("Gemini: " + response.text)

cond = True

while(cond):
    user_input = input("User: ")
    response = chat.send_message(user_input)
    print("Gemini: " + response.text)
    if(user_input == "exit"):
        history = chat.history
        cond = False

print(history[0])
        
