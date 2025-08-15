from typing import Optional

from fastapi import HTTPException, status

from backend.server.models import Message
from backend.server.requests import MessageCreate

message_collection = Message


async def retrieve_messages(status: Optional[str] = None):
    query = Message.find()
    if status:
        query = query.find(Message.status == status)
    return await query.sort("-created_at").to_list()


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


async def update_message(message_id: str, content: str | None = None, new_status: str | None = None) -> Message:
    msg = await Message.get(message_id)
    if not msg:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found",
        )

    try:
        if content is not None:
            msg.content = content
        if new_status is not None:
            msg.status = new_status

        await msg.save()  # Only saves if something changed
        return msg
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}",
        )
