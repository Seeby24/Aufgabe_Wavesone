import os

from pymongo import AsyncMongoClient
from pymongo.asynchronous.database import AsyncDatabase

_client: AsyncMongoClient | None = None
_db: AsyncDatabase | None = None
_mongod = None


async def connect() -> AsyncDatabase:
    """Connects to MongoDB.

    - If MONGODB_URI is set, that database is used.
    - Otherwise an in-memory MongoDB is started (data resets on restart).
    """
    global _client, _db, _mongod

    uri = os.getenv("MONGODB_URI")
    if not uri:
        from pymongo_inmemory import Mongod

        _mongod = Mongod()
        _mongod.start()
        uri = _mongod.connection_string
        print("[db] Using in-memory MongoDB (data resets on restart)")

    _client = AsyncMongoClient(uri)
    _db = _client[os.getenv("MONGODB_DB", "tasktracker")]
    return _db


async def close() -> None:
    global _client, _db, _mongod
    if _client is not None:
        await _client.close()
        _client = None
        _db = None
    if _mongod is not None:
        _mongod.stop()
        _mongod = None


def get_db() -> AsyncDatabase:
    if _db is None:
        raise RuntimeError("Database not connected")
    return _db
