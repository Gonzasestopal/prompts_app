from typing import List

from backend.server.models import Message

message_collection = Message


async def retrieve_messages() -> List[Message]:
    messages = await message_collection.all().to_list()
    return messages
