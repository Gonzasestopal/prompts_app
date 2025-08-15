from typing import Any, List, Optional

from beanie import PydanticObjectId
from fastapi import APIRouter, Query, status

from backend.server.database import (get_message, insert_message,
                                     retrieve_messages, update_message)
from backend.server.requests import MessageCreate, MessageUpdate

router = APIRouter()


@router.get("/", response_description="Messages retrieved", response_model=List[Any])
async def get_messages(status: Optional[str] = Query(None, description="Filter by status")):
    return await retrieve_messages(status=status)


@router.post(
    "/",
    response_description="Create a new message",
    response_model=Any,
    status_code=status.HTTP_201_CREATED
)
async def create_message(message: MessageCreate):
    return await insert_message(message)


@router.get("/{message_id}", response_description="Message retrieved", response_model=Any)
async def show_message(message_id: PydanticObjectId):
    return await get_message(message_id)


@router.put("/{message_id}", response_model=Any, status_code=status.HTTP_200_OK)
async def edit_message(message_id: PydanticObjectId, message: MessageUpdate):
    return await update_message(message_id, message.content, message.status)
