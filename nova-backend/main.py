from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
import os
from google.cloud import speech
from google.cloud import bigquery
from fastapi.middleware.cors import CORSMiddleware

# --- Load environment variables ---
load_dotenv()  # loads .env file in the current folder

# --- Verify Google credentials ---
GOOGLE_KEY = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
print("GOOGLE_APPLICATION_CREDENTIALS:", GOOGLE_KEY)

# --- Initialize FastAPI app ---
app = FastAPI(title="Nova Backend", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Initialize Google Speech Client ---
try:
    client = speech.SpeechClient()
    print("✅ Google Cloud Speech Client initialized successfully!")
except Exception as e:
    print("❌ Error initializing Google Cloud client:", e)

from google.oauth2 import service_account

# Explicitly use service account credentials
CREDENTIALS_PATH = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")

try:
    credentials = service_account.Credentials.from_service_account_file(CREDENTIALS_PATH)
    bq_client = bigquery.Client(credentials=credentials, project="nova-crm-project")
    print("✅ BigQuery client initialized successfully!")
except Exception as e:
    print("❌ Error initializing BigQuery client:", e)

print("🔐 Using service account:", credentials.service_account_email)

# --- Root Route ---
@app.get("/")
def home():
    return {"message": "Nova Backend is running 🚀"}


# --- Audio Transcription Route ---
@app.post("/transcribe-audio/")
async def transcribe_audio(file: UploadFile = File(...)):
    """
    Upload an MP3 or M4A file and get text transcription.
    """
    try:
        # Save uploaded file temporarily
        temp_path = f"temp_{file.filename}"
        with open(temp_path, "wb") as f:
            f.write(await file.read())

        # Read the file content
        with open(temp_path, "rb") as audio_file:
            content = audio_file.read()

        # Detect file type and set encoding automatically
        ext = os.path.splitext(file.filename)[1].lower()
        if ext == ".mp3":
            encoding = speech.RecognitionConfig.AudioEncoding.MP3
        elif ext == ".m4a":
            encoding = speech.RecognitionConfig.AudioEncoding.MP4
        else:
            encoding = speech.RecognitionConfig.AudioEncoding.ENCODING_UNSPECIFIED

        # Configure recognition settings
        audio = speech.RecognitionAudio(content=content)
        config = speech.RecognitionConfig(
            encoding=encoding,
            sample_rate_hertz=44100,
            language_code="en-US",
            enable_automatic_punctuation=True
        )

        # Transcribe audio
        response = client.recognize(config=config, audio=audio)

        # Clean up temp file
        os.remove(temp_path)

        # Extract transcript
        transcript = " ".join(
            [result.alternatives[0].transcript for result in response.results]
        )

        return {"transcript": transcript or "No speech detected."}

    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": str(e)}
        )


@app.get("/get-crm-records")
def get_crm_records():
    query = "SELECT * FROM `nova-crm-project.nova_dataset.crm_records` LIMIT 10"
    results = bq_client.query(query)
    rows = [dict(row) for row in results]
    return {"records": rows}