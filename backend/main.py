from fastapi import FastAPI
from app.routes import auth, feedback, dashboard
from app.db.mongodb import db  # this should initialize MongoDB client using the env vars
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

# Load .env variables
load_dotenv()

# Check SECRET_KEY existence
SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    raise ValueError("❌ SECRET_KEY not set in environment variables. Please define it in your .env file.")

app = FastAPI()

# CORS middleware for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can restrict to frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(auth.router, prefix="/api/auth")
app.include_router(feedback.router, prefix="/api/feedback")
app.include_router(dashboard.router, prefix="/api/dashboard")

@app.get("/")
async def root():
    return {"message": "✅ Feedback system backend is running!"}
