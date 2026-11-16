from fastapi import APIRouter, Response

from app.models import TaskCreate, TaskUpdate
from app.services import task_service

router = APIRouter(prefix="/api/tasks")


@router.get("")
async def list_tasks():
    return await task_service.list_tasks()


@router.post("", status_code=201)
async def create_task(payload: TaskCreate):
    return await task_service.create_task(payload)


@router.get("/{task_id}")
async def get_task(task_id: str):
    return await task_service.get_task(task_id)


@router.patch("/{task_id}")
async def update_task(task_id: str, payload: TaskUpdate):
    return await task_service.update_task(task_id, payload)


@router.delete("/{task_id}", status_code=204)
async def delete_task(task_id: str):
    await task_service.delete_task(task_id)
    return Response(status_code=204)
