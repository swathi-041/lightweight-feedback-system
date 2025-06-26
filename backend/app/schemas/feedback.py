from pydantic import BaseModel
from typing import List, Optional

class FeedbackCreate(BaseModel):
    employee_id: str
    strengths: str
    improvements: str
    sentiment: str
    tags: List[str]

class FeedbackResponse(FeedbackCreate):
    id: Optional[str]
    manager_id: str
    acknowledged: Optional[bool] = False
    employee_comments: Optional[str] = None

class FeedbackUpdate(BaseModel):
    strengths: Optional[str] = None
    improvements: Optional[str] = None
    sentiment: Optional[str] = None
    tags: Optional[List[str]] = None