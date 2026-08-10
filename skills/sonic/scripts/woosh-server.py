"""Local Sony Woosh API server wrapper for the sonic skill.

Serves the official Woosh FastAPI app (``api.api_server`` from the cloned
SonyResearch/Woosh repo) and adds an idle auto-exit, mirroring
``mmaudio-server.py``: after ``WOOSH_IDLE_TIMEOUT`` minutes without a
``/generate`` request the process shuts itself down to free GPU memory.

The setup scripts copy this file into the Woosh repo root, so it can run
from the repo directory:

    uv run --extra cuda uvicorn woosh-server:app --host 0.0.0.0 --port 8000

Env:
    WOOSH_IDLE_TIMEOUT   auto-exit after N minutes without a /generate request
                         (default: 15, 0 = keep running forever)

Endpoints (passthrough from api.api_server):
    GET  /ping
    POST /generate            -> audio bytes (flac)
    POST /generate/queue      -> request id (async queue)
    GET  /queue/status/{id}   -> queue status
    GET  /result/{id}         -> audio bytes once completed
"""

import os
import threading
import time
from contextlib import asynccontextmanager
from typing import Any

from api.api_server import app  # must run from the Woosh repo root

_idle_timeout_min = float(os.environ.get("WOOSH_IDLE_TIMEOUT", "15"))
_idle_timeout_sec = _idle_timeout_min * 60 if _idle_timeout_min > 0 else 0
_last_activity = time.monotonic()
_inflight = threading.Lock()


@app.middleware("http")
async def _touch_generate(request, call_next):
    """Refresh the idle timer and guard against exiting mid-request."""
    global _last_activity
    if request.url.path.startswith("/generate"):
        _last_activity = time.monotonic()
        if not _inflight.acquire(blocking=False):
            # already guarded by the watchdog's in-flight check
            return await call_next(request)
        try:
            return await call_next(request)
        finally:
            _inflight.release()
    return await call_next(request)


def _idle_watchdog() -> None:
    """Exit the process after WOOSH_IDLE_TIMEOUT without a /generate call."""
    while True:
        time.sleep(min(30, _idle_timeout_sec / 2))
        if not _inflight.acquire(blocking=False):
            continue  # a request is in flight
        try:
            idle_sec = time.monotonic() - _last_activity
            if idle_sec >= _idle_timeout_sec:
                print(
                    f"[woosh-server] idle for {idle_sec:.0f}s "
                    f"(limit {_idle_timeout_sec:.0f}s) — shutting down",
                    flush=True,
                )
                os._exit(0)
        finally:
            _inflight.release()


if _idle_timeout_sec > 0:
    # api.api_server passes a custom `lifespan=` to FastAPI, which replaces the
    # default router lifespan — so `@app.on_event("startup")` never fires.
    # Wrap the router lifespan instead and start the watchdog after startup
    # (i.e. after the models are loaded).
    _orig_lifespan = app.router.lifespan_context

    @asynccontextmanager
    async def _lifespan_with_watchdog(app_: Any):
        async with _orig_lifespan(app_) as state:
            threading.Thread(target=_idle_watchdog, daemon=True).start()
            yield state

    app.router.lifespan_context = _lifespan_with_watchdog
