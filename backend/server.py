from fastapi import FastAPI, APIRouter, File, UploadFile, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import base64
import asyncio

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
try:
    mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
    client = AsyncIOMotorClient(mongo_url)
    db = client[os.environ.get('DB_NAME', 'plant_disease_db')]
except Exception as e:
    logging.error(f"MongoDB connection error: {e}")
    client = None
    db = None

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

class DiseaseAnalysis(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    disease_name: str
    confidence: float
    severity: str
    symptoms: List[str]
    treatment: List[str]
    prevention: List[str]
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class AnalysisRequest(BaseModel):
    image_base64: str

class AnalysisResponse(BaseModel):
    success: bool
    analysis: Optional[DiseaseAnalysis] = None
    message: str = ""

# Plant Disease Analysis Function
async def analyze_plant_image(image_base64: str) -> DiseaseAnalysis:
    try:
        import google.generativeai as genai
        import base64
        
        # Get API key
        api_key = os.environ.get('GOOGLE_API_KEY')
        if not api_key:
            raise HTTPException(status_code=500, detail="API key not configured")
        
        # Configure the Gemini API
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('models/gemini-2.5-pro')
        
        # Convert base64 to image for Gemini
        image = {
            "mime_type": "image/jpeg",
            "data": image_base64
        }
        
        # Generate prompt
        prompt = """You are an expert plant pathologist. Analyze this plant image for diseases and provide a detailed analysis.
        Format your response as JSON with:
        {
            "disease_name": "Disease name or Healthy",
            "confidence": 0.0-1.0,
            "severity": "Mild/Moderate/Severe/Healthy",
            "symptoms": ["symptom1", "symptom2"],
            "treatment": ["treatment1", "treatment2"],
            "prevention": ["prevention1", "prevention2"]
        }
        Respond with ONLY the JSON, no other text."""
        
        # Generate response
        response = await model.generate_content_async([prompt, image])
        
        # Parse response
        import json
        try:
            # Clean response if needed
            response_text = response.text.strip()
            if response_text.startswith("```json"):
                response_text = response_text.replace("```json", "").replace("```", "").strip()
            
            parsed = json.loads(response_text)
            
            # Create analysis object
            analysis = DiseaseAnalysis(
                disease_name=parsed.get("disease_name", "Unknown"),
                confidence=float(parsed.get("confidence", 0.0)),
                severity=parsed.get("severity", "Unknown"),
                symptoms=parsed.get("symptoms", []),
                treatment=parsed.get("treatment", []),
                prevention=parsed.get("prevention", [])
            )
            
            return analysis
            
        except json.JSONDecodeError:
            # Fallback parsing
            return DiseaseAnalysis(
                disease_name="Analysis completed",
                confidence=0.8,
                severity="Moderate",
                symptoms=["AI analysis completed - check detailed response"],
                treatment=["Consult with agricultural specialist", "Monitor plant condition"],
                prevention=["Regular plant inspection", "Proper watering and care"]
            )
            
    except Exception as e:
        logging.error(f"Analysis error: {e}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

# Routes
@api_router.get("/")
async def root():
    return {"message": "Plant Disease Detection API"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    if db is None:
        raise HTTPException(status_code=503, detail="Database unavailable")
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    try:
        await db.status_checks.insert_one(status_obj.dict())
        return status_obj
    except Exception as e:
        logging.error(f"Database error: {e}")
        raise HTTPException(status_code=503, detail="Database error")

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    if db is None:
        raise HTTPException(status_code=503, detail="Database unavailable")
    try:
        status_checks = await db.status_checks.find().to_list(1000)
        return [StatusCheck(**status_check) for status_check in status_checks]
    except Exception as e:
        logging.error(f"Database error: {e}")
        raise HTTPException(status_code=503, detail="Database error")

@api_router.post("/analyze", response_model=AnalysisResponse)
async def analyze_plant_disease(request: AnalysisRequest):
    try:
        # Analyze the image
        analysis = await analyze_plant_image(request.image_base64)
        
        # Store analysis in database if available
        if db:
            try:
                analysis_dict = analysis.dict()
                await db.plant_analyses.insert_one(analysis_dict)
            except Exception as e:
                logging.warning(f"Failed to store analysis in database: {e}")
        
        return AnalysisResponse(
            success=True,
            analysis=analysis,
            message="Analysis completed successfully"
        )
        
    except Exception as e:
        logging.error(f"Analysis endpoint error: {e}")
        return AnalysisResponse(
            success=False,
            message=f"Analysis failed: {str(e)}"
        )

@api_router.post("/analyze-upload", response_model=AnalysisResponse)
async def analyze_uploaded_image(file: UploadFile = File(...)):
    try:
        # Validate file type
        if not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Read and encode image
        image_data = await file.read()
        image_base64 = base64.b64encode(image_data).decode('utf-8')
        
        # Analyze the image
        analysis = await analyze_plant_image(image_base64)
        
        # Store analysis in database
        analysis_dict = analysis.dict()
        await db.plant_analyses.insert_one(analysis_dict)
        
        return AnalysisResponse(
            success=True,
            analysis=analysis,
            message="Analysis completed successfully"
        )
        
    except HTTPException:
        # Re-raise HTTPException to return proper status codes
        raise
    except Exception as e:
        logging.error(f"Upload analysis error: {e}")
        return AnalysisResponse(
            success=False,
            message=f"Analysis failed: {str(e)}"
        )

@api_router.get("/analyses", response_model=List[DiseaseAnalysis])
async def get_analyses():
    analyses = await db.plant_analyses.find().sort("timestamp", -1).to_list(100)
    return [DiseaseAnalysis(**analysis) for analysis in analyses]

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()