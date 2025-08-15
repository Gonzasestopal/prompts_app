from typing import Optional

from pydantic import BaseModel


class MessageCreate(BaseModel):
    content: str


class MessageUpdate(BaseModel):
    content: Optional[str] = None
    status: Optional[str] = None
