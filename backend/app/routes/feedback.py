from fastapi import APIRouter, HTTPException, Query, Body
from app.db.mongodb import db
from app.schemas.feedback import FeedbackCreate, FeedbackResponse, FeedbackUpdate
from bson import ObjectId
from datetime import datetime


router = APIRouter()

# ✅ Submit feedback
@router.post("/", response_model=FeedbackResponse)
async def submit_feedback(feedback: FeedbackCreate, manager_id: str):
    feedback_data = feedback.dict()
    feedback_data.update({
        "manager_id": manager_id,
        "created_at": datetime.utcnow(),
        "acknowledged": False,
        "employee_comments": None
    })
    result = await db["feedback"].insert_one(feedback_data)
    feedback_data["id"] = str(result.inserted_id)
    return feedback_data

# ✅ Get feedback for a specific employee (path param)
@router.get("/employee/{employee_id}", response_model=list[FeedbackResponse])
async def get_employee_feedback(employee_id: str):
    feedbacks = await db["feedback"].find({"employee_id": employee_id}).to_list(100)
    for f in feedbacks:
        f["id"] = str(f["_id"])
    return feedbacks

# ✅ Get feedback for employee (query param version)
@router.get("/employee")
async def get_feedback_for_employee(employee_id: str = Query(...)):
    feedbacks = await db["feedback"].find({"employee_id": employee_id}).to_list(100)
    for fb in feedbacks:
        fb["id"] = str(fb["_id"])
        del fb["_id"]
    return feedbacks

# ✅ Get feedbacks submitted by a specific manager
@router.get("/manager")
async def get_feedback_for_manager(manager_id: str = Query(...)):
    feedbacks = await db["feedback"].find({"manager_id": manager_id}).to_list(100)
    for fb in feedbacks:
        fb["id"] = str(fb["_id"])
        del fb["_id"]
    return feedbacks

# ✅ Update feedback
@router.put("/{feedback_id}", response_model=FeedbackResponse)
async def update_feedback(feedback_id: str, updates: FeedbackUpdate):
    update_data = {k: v for k, v in updates.dict().items() if v is not None}
    result = await db["feedback"].find_one_and_update(
        {"_id": ObjectId(feedback_id)},
        {"$set": update_data},
        return_document=True
    )
    if not result:
        raise HTTPException(status_code=404, detail="Feedback not found")
    result["id"] = str(result["_id"])
    return result

# ✅ Acknowledge feedback
@router.put("/acknowledge/{feedback_id}")
async def acknowledge_feedback(feedback_id: str):
    result = await db["feedback"].update_one(
        {"_id": ObjectId(feedback_id)},
        {"$set": {"acknowledged": True}}
    )
    if result.modified_count == 1:
        return {"message": "Feedback acknowledged"}
    raise HTTPException(status_code=404, detail="Feedback not found")

@router.put("/comment/{feedback_id}")
async def add_employee_comment(feedback_id: str, comment: dict = Body(...)):
    result = await db["feedback"].update_one(
        {"_id": ObjectId(feedback_id)},
        {"$set": {"employee_comments": comment.get("comment")}}
    )
    if result.modified_count == 1:
        return {"message": "Comment added"}
    raise HTTPException(status_code=404, detail="Feedback not found")