type EnvVarKey = "VITE_LOGIN_URL" | "VITE_SESSION_EXTEND_URL" | "VITE_ASSET_URL";

function getCurrentUrl(): string {
  const { protocol, hostname, port } = window.location;
  return `${protocol}//${hostname}${port ? `:${port}` : ""}`;
}

function getEnvVar(key: EnvVarKey): string {
  const value = import.meta.env[key];
  if (typeof value !== "string") {
    throw new Error(`Environment variable ${key} is not defined or not a string.`);
  }
  return value;
}

export function getLoginUrl(): string {
  return `${getCurrentUrl()}/${getEnvVar("VITE_LOGIN_URL")}`;
}

export function getSessionExtendsUrl(): string {
  return `${getCurrentUrl()}/${getEnvVar("VITE_SESSION_EXTEND_URL")}`;
}

export function getAssetUrl(): string {
  return `${getCurrentUrl()}/${getEnvVar("VITE_ASSET_URL")}`;
}
