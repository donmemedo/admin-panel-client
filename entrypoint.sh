#!/bin/sh
set -eu

ENV_FILE="${ENV_CONFIG_FILE:-./public/static/assets/js/env-config.js}"
mkdir -p "$(dirname "$ENV_FILE")"

cat > "$ENV_FILE" <<EOF
window._env_ = {
  API_BASE_URL: "${NEXT_PUBLIC_API_BASE_URL:-http://localhost:8000}",
  IDP_URL: "${NEXT_PUBLIC_IDP_URL:-http://localhost:8000/idp}",
  ADMIN_GATEWAY_URL: "${NEXT_PUBLIC_ADMIN_GATEWAY_URL:-http://localhost:8000/proxy/admin}",
  ONLINE_TRADING_URL: "${NEXT_PUBLIC_ONLINE_TRADING_URL:-http://localhost:8000/proxy/online-trading}",
  NETFLOW_URL: "${NEXT_PUBLIC_NETFLOW_URL:-http://localhost:8000/proxy/netflow}",
  FILE_SERVER_URL: "${NEXT_PUBLIC_FILE_SERVER_URL:-http://localhost:8000/proxy/files}",
  MARKETER_ADMIN_URL: "${NEXT_PUBLIC_MARKETER_ADMIN_URL:-http://localhost:8000/proxy/marketer}",
  SEJAM_GATEWAY_URL: "${NEXT_PUBLIC_SEJAM_GATEWAY_URL:-http://localhost:8000/proxy/sejam}"
};
EOF

exec "$@"
