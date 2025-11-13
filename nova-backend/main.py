from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from google.cloud import speech, bigquery
from google.oauth2 import service_account
from dotenv import load_dotenv
import os
import tempfile
import json

# Vertex AI
from vertexai.preview.generative_models import GenerativeModel
import vertexai

# --- Load env ---
load_dotenv()

# --- Initialize FastAPI ---
app = FastAPI(title="Nova Backend", version="3.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Google Credentials ---
try:
    CREDENTIALS_PATH = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
    credentials = service_account.Credentials.from_service_account_file(CREDENTIALS_PATH)

    # Speech + BQ
    speech_client = speech.SpeechClient(credentials=credentials)
    bq_client = bigquery.Client(credentials=credentials, project="nova-crm-project")

    print("✅ Google Cloud clients initialized")
except Exception as e:
    print("❌ Google Cloud init error:", e)

# --- Vertex AI Init ---
try:
    vertexai.init(project="nova-crm-project", location="us-central1")
    gemini = GenerativeModel(
        "gemini-2.5-pro",
        generation_config={"response_mime_type": "application/json"}  # Force JSON output
    )
    print("✅ Gemini 2.5 Pro initialized")
except Exception as e:
    print("⚠️ Gemini init failed:", e)
    gemini = None


@app.get("/")
def home():
    return {"message": "Nova Backend Running 🚀"}


# ===================================================================
# 🔥  TRANSCRIBE + CRM EXTRACTION (New Improved Version)
# ===================================================================
@app.post("/transcribe-audio/")
async def transcribe_audio(file: UploadFile = File(...)):
    try:
        # --- Save file temporarily ---
        with tempfile.NamedTemporaryFile(delete=False, suffix=file.filename) as temp_audio:
            temp_audio.write(await file.read())
            temp_audio_path = temp_audio.name

        # --- Detect encoding ---
        ext = os.path.splitext(file.filename)[1].lower()
        encoding_map = {
            ".wav": speech.RecognitionConfig.AudioEncoding.LINEAR16,
            ".wave": speech.RecognitionConfig.AudioEncoding.LINEAR16,
            ".mp3": speech.RecognitionConfig.AudioEncoding.MP3,
            ".flac": speech.RecognitionConfig.AudioEncoding.FLAC,
        }
        encoding = encoding_map.get(ext, speech.RecognitionConfig.AudioEncoding.ENCODING_UNSPECIFIED)

        config = speech.RecognitionConfig(
            encoding=encoding,
            language_code="en-US",
            enable_automatic_punctuation=True,
            sample_rate_hertz=16000,
        )

        with open(temp_audio_path, "rb") as audio_file:
            audio = speech.RecognitionAudio(content=audio_file.read())

        # --- Transcribe ---
        operation = speech_client.long_running_recognize(config=config, audio=audio)
        response = operation.result(timeout=300)

        transcript = " ".join(
            r.alternatives[0].transcript for r in response.results
        ) or "No speech detected."

        os.remove(temp_audio_path)

        # ===================================================================
        # 🔥 CRM Extraction using Gemini 2.5 Pro
        # ===================================================================
        if gemini and transcript.strip() and transcript != "No speech detected.":

            crm_prompt = f"""
You are Nova, an AI CRM extraction engine.

Extract structured CRM information from the transcript below.
You MUST infer sentiment as one of:
- "positive"
- "neutral"
- "negative"

Sentiment must NEVER be empty.

Return ONLY valid JSON.


Required JSON structure:
{{
  "contact": {{
    "name": "",
    "company": "",
    "role": "",
    "email": "",
    "phone": ""
  }},
  "deal": {{
    "stage": "",
    "value": null,
    "products": []
  }},
  "interaction": {{
    "summary": "",
    "action_items": [],
    "next_steps": [],
    "follow_up_date": "",
    "sentiment": ""  // MUST be positive, neutral, or negative
  }}
}}

Transcript:
{transcript}
"""

            try:
                result = gemini.generate_content(crm_prompt)
                crm_data = json.loads(result.text)

                summary = crm_data.get("interaction", {}).get("summary", "Summary unavailable.")

            except Exception as e:
                print("⚠️ Gemini JSON parsing failed:", e)
                crm_data = {"error": "Failed to parse JSON from Gemini."}
                summary = "Summary unavailable."

        else:
            crm_data = {}
            summary = "Summary unavailable."

        # --- Response ---
        return {
            "success": True,
            "transcript": transcript,
            "summary": summary,
            "data": crm_data,
        }

    except Exception as e:
        print("❌ ERROR:", e)
        return JSONResponse(status_code=500, content={"success": False, "error": str(e)})


# ===================================================================
# Fetch CRM records
# ===================================================================
@app.get("/get-crm-records")
def get_crm_records():
    try:
        query = "SELECT * FROM `nova-crm-project.nova_dataset.crm_records` LIMIT 10"
        results = bq_client.query(query)
        rows = [dict(row) for row in results]
        return {"success": True, "records": rows}
    except Exception as e:
        return JSONResponse(status_code=500, content={"success": False, "error": str(e)})
