from unittest.mock import AsyncMock, patch

import pytest


@pytest.mark.anyio
async def test_retrieve_messages_without_db():
    from backend.server import database

    fake_messages = [
        database.Message(content="Hello", status="active"),
        database.Message(content="World", status="inactive"),
    ]

    mock_all = AsyncMock()
    mock_all.to_list.return_value = fake_messages

    with patch.object(database.message_collection, "all", return_value=mock_all):
        result = await database.retrieve_messages()

    assert result == fake_messages
    assert isinstance(result[0], database.Message)
    mock_all.to_list.assert_called_once()
