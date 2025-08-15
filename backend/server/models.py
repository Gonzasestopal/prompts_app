from datetime import datetime, timezone

from beanie import Document, Insert, Replace, before_event
from pydantic import Field


class Message(Document):
    content: str
    status: str = "active"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "messages"

    # Set created_at & updated_at before inserting
    @before_event(Insert)
    def set_created(self):
        now = datetime.now(timezone.utc)
        self.created_at = now
        self.updated_at = now

    # Set updated_at before replacing/updating
    @before_event(Replace)
    def set_updated(self):
        self.updated_at = datetime.now(timezone.utc)
