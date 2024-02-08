import google.generativeai as genai
import os
import PIL.Image

genai.configure(api_key="AIzaSyAq9duOY8_UAeZAJcKdptEI5PDZstlgqP8")

image = img = PIL.Image.open('img.png')

model = genai.GenerativeModel('gemini-pro-vision')
response = model.generate_content(img)

response = model.generate_content(["Write the solution of this error of my code, not a general answer but a full of code that fix the error.", img], stream=True)
response.resolve()

print(response.text)