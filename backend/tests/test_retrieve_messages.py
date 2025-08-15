from unittest.mock import AsyncMock, MagicMock, patch

import pytest


@pytest.mark.anyio
async def test_retrieve_messages_without_db():
    from backend.server import database

    fake_messages = [
        database.Message(content="Hello", status="active"),
        database.Message(content="World", status="inactive"),
    ]

    # Create a mock chain: find_all() -> sort() -> to_list()
    mock_sort = MagicMock()
    mock_sort.to_list = AsyncMock(return_value=fake_messages)

    mock_find_all = MagicMock()
    mock_find_all.sort.return_value = mock_sort

    with patch.object(database.message_collection, "find_all", return_value=mock_find_all):
        result = await database.retrieve_messages()

    assert result == fake_messages
    assert isinstance(result[0], database.Message)
    mock_sort.to_list.assert_awaited_once()
