from typing import List

from fastapi import HTTPException, status

from backend.server.models import Message
from backend.server.requests import MessageCreate

message_collection = Message


async def retrieve_messages() -> List[Message]:
    messages = await message_collection.all().to_list()
    return messages


async def insert_message(message: MessageCreate) -> Message:
    new_message = Message(
        content=message.content,
    )
    try:
        inserted = await new_message.insert()
        if not inserted:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Message could not be created"
            )
        return inserted
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}"
        )

