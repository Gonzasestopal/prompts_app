import logging

from bson.errors import InvalidId
from fastapi import Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

logger = logging.getLogger(__name__)


async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """
    Handles Pydantic validation errors for request params, query, and body.
    Specifically formats errors for invalid PydanticObjectId.
    """
    for err in exc.errors():
        if "PydanticObjectId" in err.get("msg", ""):
            return JSONResponse(
                status_code=422,
                content={"detail": "message_id must be a valid object ID"}
            )
    # Generic fallback for any other validation error
    return JSONResponse(
        status_code=400,
        content={"detail": "Invalid request parameters"}
    )


async def invalid_objectid_handler(request: Request, exc: InvalidId):
    """
    Handles bson.InvalidId exceptions for manually validated ObjectId fields.
    """
    logger.warning(f"Invalid ObjectId in request {request.url}: {exc}")
    return JSONResponse(
        status_code=400,
        content={"detail": "Value error: ObjectId must be a valid ID"}
    )
