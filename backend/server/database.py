from typing import List

from fastapi import HTTPException, status

from backend.server.models import Message
from backend.server.requests import MessageCreate

message_collection = Message


async def retrieve_messages() -> List[Message]:
    messages = await message_collection.find_all().sort("-created_at").to_list()
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


async def get_message(message_id: str) -> Message:
    message = await message_collection.get(message_id)
    if not message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found"
        )
    return message


async def update_message(message_id: str, content: str | None = None, status: str | None = None) -> Message:
    msg = await Message.get(message_id)
    if not msg:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found",
        )

    try:
        if content is not None:
            msg.content = content
        if status is not None:
            msg.status = status

        await msg.save()  # Only saves if something changed
        return msg
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}",
        )
