from functools import lru_cache
from typing import Any

from pydantic import AnyHttpUrl, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "admin-panel-api"
    cors_origins: list[str] = ["http://localhost:3000"]
    public_base_url: str = "http://localhost:8000"

    admin_service_url: AnyHttpUrl | None = None
    online_trading_service_url: AnyHttpUrl | None = None
    netflow_service_url: AnyHttpUrl | None = None
    file_service_url: AnyHttpUrl | None = None
    marketer_service_url: AnyHttpUrl | None = None
    sejam_service_url: AnyHttpUrl | None = None

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    @field_validator("cors_origins", mode="before")
    @classmethod
    def parse_cors_origins(cls, value: Any) -> list[str]:
        if isinstance(value, str):
            return [origin.strip() for origin in value.split(",") if origin.strip()]
        return value

    @property
    def service_urls(self) -> dict[str, str]:
        raw = {
            "admin": self.admin_service_url,
            "online-trading": self.online_trading_service_url,
            "netflow": self.netflow_service_url,
            "files": self.file_service_url,
            "marketer": self.marketer_service_url,
            "sejam": self.sejam_service_url,
        }
        return {name: str(url).rstrip("/") for name, url in raw.items() if url}


@lru_cache
def get_settings() -> Settings:
    return Settings()
