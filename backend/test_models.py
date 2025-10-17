import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure API key
api_key = os.getenv('GOOGLE_API_KEY')
if not api_key:
    raise ValueError("GOOGLE_API_KEY environment variable is not set")

genai.configure(api_key=api_key)

# List available models
models = genai.list_models()
for model in models:
    print(f"Model name: {model.name}")
    print(f"Display name: {model.display_name}")
    print(f"Description: {model.description}")
    print(f"Generation methods: {model.supported_generation_methods}")
    print("---")