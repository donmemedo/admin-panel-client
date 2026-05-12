from __future__ import annotations

from typing import Annotated

import httpx
from fastapi import Depends, FastAPI, HTTPException, Request, Response, status
from fastapi.middleware.cors import CORSMiddleware

from .config import Settings, get_settings

HOP_BY_HOP_HEADERS = {
    "connection",
    "keep-alive",
    "proxy-authenticate",
    "proxy-authorization",
    "te",
    "trailers",
    "transfer-encoding",
    "upgrade",
    "host",
    "content-length",
}

settings = get_settings()
app = FastAPI(title=settings.app_name, version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def filtered_headers(headers: dict[str, str] | httpx.Headers) -> dict[str, str]:
    return {
        key: value
        for key, value in dict(headers).items()
        if key.lower() not in HOP_BY_HOP_HEADERS
    }


@app.get("/health", tags=["system"])
async def health(settings: Annotated[Settings, Depends(get_settings)]) -> dict[str, object]:
    return {
        "status": "ok",
        "app": settings.app_name,
        "configured_services": sorted(settings.service_urls.keys()),
    }


@app.get("/api/config", tags=["system"])
async def public_config(settings: Annotated[Settings, Depends(get_settings)]) -> dict[str, str]:
    base = settings.public_base_url.rstrip("/")
    return {
        "API_BASE_URL": base,
        "ADMIN_GATEWAY_URL": f"{base}/proxy/admin",
        "ONLINE_TRADING_URL": f"{base}/proxy/online-trading",
        "NETFLOW_URL": f"{base}/proxy/netflow",
        "FILE_SERVER_URL": f"{base}/proxy/files",
        "MARKETER_ADMIN_URL": f"{base}/proxy/marketer",
        "SEJAM_GATEWAY_URL": f"{base}/proxy/sejam",
    }


@app.api_route("/proxy/{service}/{path:path}", methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"], tags=["proxy"])
async def proxy_request(
    service: str,
    path: str,
    request: Request,
    settings: Annotated[Settings, Depends(get_settings)],
) -> Response:
    base_url = settings.service_urls.get(service)
    if not base_url:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Service '{service}' is not configured. Set its *_SERVICE_URL environment variable.",
        )

    target_url = f"{base_url}/{path}"
    body = await request.body()

    async with httpx.AsyncClient(timeout=60.0, follow_redirects=False) as client:
        upstream = await client.request(
            request.method,
            target_url,
            params=request.query_params,
            content=body,
            headers=filtered_headers(request.headers),
        )

    return Response(
        content=upstream.content,
        status_code=upstream.status_code,
        headers=filtered_headers(upstream.headers),
        media_type=upstream.headers.get("content-type"),
    )
