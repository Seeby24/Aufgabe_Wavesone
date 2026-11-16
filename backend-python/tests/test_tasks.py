# Example test - use it as a template for your own tests.


def test_create_task(client):
    res = client.post("/api/tasks", json={"title": "Write tests"})

    assert res.status_code == 201
    body = res.json()
    assert body["title"] == "Write tests"
    assert body["status"] == "open"
    assert "id" in body
