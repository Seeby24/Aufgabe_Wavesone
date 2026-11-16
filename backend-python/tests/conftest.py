import os

import pytest
from fastapi.testclient import TestClient

# Always use the in-memory database and an empty collection for tests
os.environ.pop("MONGODB_URI", None)
os.environ["SEED_ON_STARTUP"] = "false"

from app import db  # noqa: E402
from app.main import app  # noqa: E402


@pytest.fixture(scope="session")
def client():
    with TestClient(app) as c:
        yield c


@pytest.fixture(autouse=True)
def clean_db(client):
    async def _clear():
        await db.get_db().tasks.delete_many({})

    client.portal.call(_clear)
    yield
