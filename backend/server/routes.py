from typing import Any, List

from fastapi import APIRouter, status

from backend.server.database import (get_message, insert_message,
                                     retrieve_messages)
from backend.server.requests import MessageCreate

router = APIRouter()


@router.get("/", response_description="Messages retrieved", response_model=List[Any])
async def get_messages():
    return await retrieve_messages()


@router.post(
    "/",
    response_description="Create a new message",
    response_model=Any,
    status_code=status.HTTP_201_CREATED
)
async def create_message(message: MessageCreate):
    return await insert_message(message)

@router.get("/{message_id}", response_description="Message retrieved", response_model=Any)
async def show_message(message_id: str):
    return await get_message(message_id)
