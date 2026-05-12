const DEFAULT_API_BASE_URL = 'http://localhost:8000';

const normalizeUrl = (value) => {
  if (!value) return undefined;
  return String(value).replace(/\/$/, '');
};

const runtimeEnv = () => {
  if (typeof window !== 'undefined' && window._env_) {
    return window._env_;
  }
  return {};
};

const readRuntimeValue = (...keys) => {
  const env = runtimeEnv();

  for (const key of keys) {
    const runtimeValue = normalizeUrl(env[key]);
    if (runtimeValue) return runtimeValue;

    const publicValue = normalizeUrl(process.env[`NEXT_PUBLIC_${key}`]);
    if (publicValue) return publicValue;
  }

  return undefined;
};

export const API_BASE_URL =
  readRuntimeValue('API_BASE_URL') || DEFAULT_API_BASE_URL;

export const ONLINE_TRADING =
  readRuntimeValue('ONLINE_TRADING_URL', 'OnlineTradingGatewayEndPoint') || `${API_BASE_URL}/proxy/online-trading`;

export const IDP =
  readRuntimeValue('IDP_URL', 'IdpEndPoint') || `${API_BASE_URL}/idp`;

export const NETFLOW =
  readRuntimeValue('NETFLOW_URL', 'NetflowEndPoint', 'NetFlowEndPoint') || `${API_BASE_URL}/proxy/netflow`;

export const ADMIN_GATEWAY =
  readRuntimeValue('ADMIN_GATEWAY_URL', 'AdminGatewayEndPoint') || `${API_BASE_URL}/proxy/admin`;

export const FILE_SERVER =
  readRuntimeValue('FILE_SERVER_URL', 'FileManagerEndPoint') || `${API_BASE_URL}/proxy/files`;

export const MARKETER_ADMIN =
  readRuntimeValue('MARKETER_ADMIN_URL', 'MarketerAdminEndPoint') || `${API_BASE_URL}/proxy/marketer`;

export const SEJAM_GATEWAY =
  readRuntimeValue('SEJAM_GATEWAY_URL', 'SejamGatewayEndPoint') || `${API_BASE_URL}/proxy/sejam`;
