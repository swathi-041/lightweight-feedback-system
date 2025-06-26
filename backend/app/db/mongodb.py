from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URI = os.getenv("MONGO_URL")

client = AsyncIOMotorClient(MONGO_URI)
db = client["feedback_db"]  # ✅ Specify the database name here
