import os
import warnings

warnings.filterwarnings(
    "ignore",
    message="'asyncio.iscoroutinefunction' is deprecated and slated for removal in Python 3.16; use inspect.iscoroutinefunction() instead",
    category=DeprecationWarning,
)

import uvicorn

from app.server import app


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=os.getenv("HOST", "127.0.0.1"),
        port=int(os.getenv("PORT", "8000")),
        reload=False,
    )
