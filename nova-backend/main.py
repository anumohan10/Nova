from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from google.cloud import speech, bigquery
from google.oauth2 import service_account
from dotenv import load_dotenv
import os
import tempfile
import textwrap

# Optional: for AI summary generation
from vertexai.preview.generative_models import GenerativeModel
import vertexai

# --- Load environment variables ---
load_dotenv()

# --- Verify Google credentials ---
GOOGLE_KEY = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
print("GOOGLE_APPLICATION_CREDENTIALS:", GOOGLE_KEY)

# --- Initialize FastAPI app ---
app = FastAPI(title="Nova Backend", version="2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Initialize Google clients ---
try:
    # Explicitly use service account credentials
    CREDENTIALS_PATH = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
    credentials = service_account.Credentials.from_service_account_file(CREDENTIALS_PATH)

    # Speech + BigQuery
    client = speech.SpeechClient(credentials=credentials)
    bq_client = bigquery.Client(credentials=credentials, project="nova-crm-project")

    print("✅ Google Cloud clients initialized successfully!")
    print("🔐 Using service account:", credentials.service_account_email)
except Exception as e:
    print("❌ Error initializing Google Cloud clients:", e)

# --- Initialize Vertex AI for Summarization ---
try:
    vertexai.init(project="nova-crm-project", location="us-central1")
    gemini = GenerativeModel("gemini-2.5-flash")
    print("✅ Gemini model initialized successfully!")
except Exception as e:
    print("⚠️ Gemini initialization failed:", e)
    gemini = None


# --- Root Route ---
@app.get("/")
def home():
    return {"message": "Nova Backend is running 🚀"}


# --- Audio Transcription + Summary Route ---
@app.post("/transcribe-audio/")
async def transcribe_audio(file: UploadFile = File(...)):
    """
    Upload an MP3/WAV/M4A file, transcribe it, summarize it,
    and extract structured CRM data using Gemini.
    """
    try:
        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=file.filename) as temp_audio:
            temp_audio.write(await file.read())
            temp_audio_path = temp_audio.name

        # Detect encoding based on extension
        ext = os.path.splitext(file.filename)[1].lower()
        if ext in [".wav", ".wave"]:
            encoding = speech.RecognitionConfig.AudioEncoding.LINEAR16
        elif ext == ".mp3":
            encoding = speech.RecognitionConfig.AudioEncoding.MP3
        elif ext == ".flac":
            encoding = speech.RecognitionConfig.AudioEncoding.FLAC
        else:
            encoding = speech.RecognitionConfig.AudioEncoding.ENCODING_UNSPECIFIED

        config = speech.RecognitionConfig(
            encoding=encoding,
            language_code="en-US",
            enable_automatic_punctuation=True,
            sample_rate_hertz=16000,
        )

        with open(temp_audio_path, "rb") as audio_file:
            audio = speech.RecognitionAudio(content=audio_file.read())

        # Use long-running recognition for larger audio
        operation = client.long_running_recognize(config=config, audio=audio)
        response = operation.result(timeout=300)

        transcript = " ".join([r.alternatives[0].transcript for r in response.results]) or "No speech detected."
        os.remove(temp_audio_path)

        # --- Generate AI summary and structured data ---
        summary = "Summary unavailable."
        crm_data = {}

        if gemini and transcript.strip() and transcript != "No speech detected.":
            try:
                prompt = f"""
You are an AI CRM assistant. Analyze the following conversation transcript and extract:
- Contact name
- Company name
- Job title
- Deal value (if mentioned)
- Key decisions or client intent
- Next steps or follow-up actions
- Overall sentiment (positive, neutral, negative)

Then summarize the discussion briefly for CRM notes.
Return your answer in **JSON format only** like this:

{{
  "contact": {{
    "name": "Sarah",
    "company": "Acme Corp",
    "role": "VP of Sales"
  }},
  "deal": {{
    "stage": "qualified",
    "value": 50000
  }},
  "interaction": {{
    "summary": "Client interested in enterprise plan",
    "action_items": ["Send proposal by Friday", "Schedule demo next week"],
    "next_steps": ["Follow up after demo"],
    "sentiment": "positive"
  }}
}}

Transcript:
{transcript}
"""
                result = gemini.generate_content(prompt)

                # --- Parse the structured JSON safely ---
                import json, re
                json_str = re.search(r"\{.*\}", result.text, re.DOTALL)
                if json_str:
                    crm_data = json.loads(json_str.group())
                else:
                    crm_data = {"error": "Unable to extract structured data."}

                # Store summary separately
                summary = crm_data.get("interaction", {}).get("summary", "Summary unavailable.")

            except Exception as e:
                print("⚠️ Gemini extraction failed:", e)
                summary = "Error generating structured data."
                crm_data = {"error": str(e)}

        return {
            "success": True,
            "transcript": transcript,
            "summary": summary,
            "data": crm_data,
        }

    except Exception as e:
        return JSONResponse(status_code=500, content={"success": False, "error": str(e)})


# --- CRM Data Fetch Route ---
@app.get("/get-crm-records")
def get_crm_records():
    """Fetch CRM records from BigQuery."""
    try:
        query = "SELECT * FROM `nova-crm-project.nova_dataset.crm_records` LIMIT 10"
        results = bq_client.query(query)
        rows = [dict(row) for row in results]
        return {"success": True, "records": rows}
    except Exception as e:
        return JSONResponse(status_code=500, content={"success": False, "error": str(e)})
