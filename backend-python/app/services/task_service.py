from datetime import datetime, timezone
from typing import Optional

from bson import ObjectId
from pymongo import DESCENDING

from app.db import get_db
from app.errors import ApiError
from app.models import TaskCreate, TaskUpdate


# ---------- mapping ----------


def _iso_utc(dt: datetime) -> str:
    """Same format as JavaScript's Date.toISOString(): 2026-11-10T08:15:30.123Z"""
    if dt.tzinfo is not None:
        dt = dt.astimezone(timezone.utc)
    return dt.strftime("%Y-%m-%dT%H:%M:%S.") + f"{dt.microsecond // 1000:03d}Z"


def to_dto(doc: dict) -> dict:
    due = doc.get("dueDate")
    return {
        "id": str(doc["_id"]),
        "title": doc["title"],
        "description": doc.get("description", ""),
        "priority": doc["priority"],
        "dueDate": _iso_utc(due) if due else None,
        "status": doc["status"],
        "createdAt": _iso_utc(doc["createdAt"]),
    }


def _parse_date(value: Optional[str]) -> Optional[datetime]:
    if value is None:
        return None
    try:
        dt = datetime.fromisoformat(value)
    except ValueError:
        raise ApiError(400, "dueDate is not a valid date") from None
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt


# ---------- service functions ----------


async def list_tasks() -> list[dict]:
    # most important tasks first
    docs = get_db().tasks.find({}).sort([("priority", DESCENDING), ("_id", DESCENDING)]).to_list(None)
    return [to_dto(d) for d in docs]


async def get_task(task_id: str) -> dict:
    doc = await get_db().tasks.find_one({"_id": ObjectId(task_id)})
    if doc is None:
        raise ApiError(404, "Task not found")
    return to_dto(doc)


async def create_task(payload: TaskCreate) -> dict:
    now = datetime.now(timezone.utc)
    doc = {
        "title": payload.title,
        "description": payload.description,
        "priority": payload.priority,
        "dueDate": _parse_date(payload.dueDate),
        "status": payload.status,
        "createdAt": now,
        "updatedAt": now,
    }
    result = await get_db().tasks.insert_one(doc)
    doc["_id"] = result.inserted_id
    return to_dto(doc)


async def update_task(task_id: str, payload: TaskUpdate) -> dict:
    changes = payload.model_dump(exclude_unset=True)
    # convert the dueDate string into a datetime
    changes["dueDate"] = _parse_date(changes.get("dueDate"))
    changes["updatedAt"] = datetime.now(timezone.utc)

    doc = await get_db().tasks.find_one_and_update({"_id": ObjectId(task_id)}, {"$set": changes})
    if doc is None:
        raise ApiError(404, "Task not found")
    return to_dto(doc)


async def delete_task(task_id: str) -> None:
    result = await get_db().tasks.delete_one({"_id": ObjectId(task_id)})
    if result.deleted_count == 0:
        raise ApiError(404, "Task not found")
