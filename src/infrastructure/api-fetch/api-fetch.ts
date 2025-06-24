import { APIError } from "@/infrastructure/errors/errors";
import { getLoginUrl } from "@/domain/utils/url";

const API_URL = import.meta.env.VITE_API_URL;
const LOGIN_URL = getLoginUrl();
const DEV_MODE = import.meta.env.DEV;

export function getCookie(name: string) {
  const cookies = document.cookie.split("; ");
  const cookie = cookies.find((cookie) => cookie.startsWith(`${name}=`));
  return cookie ? cookie.split("=")[1] : null;
}

function handleAPIError(response: Response) {
  if (response.ok) return;

  switch (response.status) {
    case 401:
      if (!DEV_MODE) {
        window.location.href = LOGIN_URL;
      }
      break;
    case 404:
      throw new APIError("Resource not found", response.status);

    default:
      throw new APIError(response.statusText, response.status);
  }
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  if (!navigator.onLine) {
    throw new APIError("Network error: Unable to connect to the internet", 0);
  }

  const defaultOptions: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  };

  const mergedOptions = { ...defaultOptions, ...options };
  try {
    const response = await fetch(`${API_URL}${path}`, mergedOptions);

    handleAPIError(response);

    // DELETE requests return 200 status code instead of 204
    // Skip JSON parsing for DELETE requests
    if (!(await hasContent(response))) {
      return undefined as T;
    }
    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes("Failed to fetch")) {
      throw new APIError("Network error: Unable to connect to the server", 0);
    }
    throw error;
  }
}

async function hasContent(response: Response) {
  const contentLength = response.headers.get("content-length");
  if (contentLength !== null && Number(contentLength) > 0) {
    return true;
  }
  const clonedResponse = response.clone();
  const text = await clonedResponse.text();
  return text.length > 0;
}
