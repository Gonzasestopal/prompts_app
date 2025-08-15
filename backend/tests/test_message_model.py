from datetime import datetime, timezone

import pytest


def to_epoch_ms(dt):
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return int(dt.timestamp() * 1000)


@pytest.mark.anyio
async def test_insert_sets_timestamps(beanie_init):
    from backend.server.models import Message
    msg = Message(content="hello world")
    await msg.insert()

    assert msg.id is not None
    assert msg.status == "active"
    assert isinstance(msg.created_at, datetime)
    assert isinstance(msg.updated_at, datetime)
    assert msg.created_at.tzinfo == timezone.utc
    assert msg.updated_at.tzinfo == timezone.utc
    assert msg.created_at == msg.updated_at


@pytest.mark.anyio
async def test_update_changes_only_updated_at(beanie_init):
    from backend.server.models import Message

    msg = Message(content="initial")
    await msg.insert()

    created_ms = to_epoch_ms(msg.created_at)
    updated_ms = to_epoch_ms(msg.updated_at)

    msg.status = "inactive"
    await msg.replace()

    refreshed = await Message.get(msg.id)

    assert to_epoch_ms(refreshed.created_at) == created_ms
    assert to_epoch_ms(refreshed.updated_at) > updated_ms   # now guaranteed
