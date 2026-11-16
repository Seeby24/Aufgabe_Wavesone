import json
from datetime import datetime, timezone
from pathlib import Path

from pymongo.asynchronous.database import AsyncDatabase

SEED_FILE = Path(__file__).resolve().parents[2] / "seed" / "tasks.json"


async def seed_if_empty(db: AsyncDatabase) -> None:
    if await db.tasks.estimated_document_count() > 0:
        return

    now = datetime.now(timezone.utc)
    docs = []
    for t in json.loads(SEED_FILE.read_text(encoding="utf-8")):
        docs.append(
            {
                **t,
                "dueDate": datetime.fromisoformat(t["dueDate"]).replace(tzinfo=timezone.utc)
                if t["dueDate"]
                else None,
                "createdAt": now,
                "updatedAt": now,
            }
        )

    await db.tasks.insert_many(docs)
    print(f"[seed] Inserted {len(docs)} tasks")
