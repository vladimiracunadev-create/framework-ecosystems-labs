from datetime import datetime, timezone
from typing import Annotated

from fastapi import FastAPI, Header, HTTPException, Response
from pydantic import BaseModel, ConfigDict, Field


app = FastAPI(title="TaskFlow FastAPI Lab")
tasks: dict[str, dict] = {}
idempotency: dict[str, dict] = {}
sequence = 1


class CreateTask(BaseModel):
    model_config = ConfigDict(extra="forbid")
    title: str = Field(min_length=1, max_length=120)


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}


@app.get("/tasks")
def list_tasks() -> dict:
    return {"items": list(tasks.values())}


@app.get("/tasks/{task_id}")
def get_task(task_id: str) -> dict:
    if task_id not in tasks:
        raise HTTPException(404, {"code": "TASK_NOT_FOUND", "message": "Task was not found"})
    return tasks[task_id]


@app.post("/tasks", status_code=201)
def create_task(
    input_data: CreateTask,
    response: Response,
    idempotency_key: Annotated[str | None, Header()] = None,
) -> dict:
    global sequence
    key = (idempotency_key or "").strip()
    if not key:
        raise HTTPException(400, {"code": "IDEMPOTENCY_KEY_REQUIRED", "message": "Idempotency-Key is required"})
    if key in idempotency:
        response.status_code = 200
        return idempotency[key]
    title = input_data.title.strip()
    if not title:
        raise HTTPException(422, {"code": "VALIDATION_ERROR", "message": "Title must contain 1 to 120 characters"})
    task = {
        "id": f"task-{sequence}",
        "title": title,
        "completed": False,
        "createdAt": datetime.now(timezone.utc).isoformat(),
    }
    sequence += 1
    tasks[task["id"]] = task
    idempotency[key] = task
    return task
