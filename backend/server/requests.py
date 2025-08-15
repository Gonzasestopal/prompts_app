from pydantic import BaseModel


class MessageCreate(BaseModel):
    content: str


class MessageUpdate(BaseModel):
    content: str
