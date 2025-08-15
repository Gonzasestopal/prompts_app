from typing import Any, List

from fastapi import APIRouter

from backend.server.database import retrieve_messages

router = APIRouter()


@router.get("/", response_description="Messages retrieved", response_model=List[Any])
async def get_messages():
    return await retrieve_messages()
