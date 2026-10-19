
const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:4000"
).replace(/\/+$/, "");

export interface SchoolInfo {
  id: string;
  role: "ISS_OWNER" | "SCHOOL_ADMIN" | "TEACHER" | "STUDENT" | "PARENT";
  name: string;
  slug: string;
  primaryColor: string;
  accentColor: string;
}

export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  schools: SchoolInfo[];
}

export interface LoginResponse {
  accessToken: string;
  tokenType: "Bearer";
  expiresIn: number;
  user: AuthUser;
}

export function saveAccessToken(token: string): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem("iss_access_token", token);
}

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.sessionStorage.getItem("iss_access_token");
}

export function clearAccessToken(): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem("iss_access_token");
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAccessToken();
  const headers = new Headers(options.headers);

  headers.set("Accept", "application/json");

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const data: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      data &&
      typeof data === "object" &&
      "error" in data &&
      typeof data.error === "string"
        ? data.error
        : "The request could not be completed.";

    throw new Error(message);
  }

  return data as T;
}

export async function login(
  identifier: string,
  password: string
): Promise<LoginResponse> {
  const result = await apiRequest<LoginResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ identifier, password }),
  });

  saveAccessToken(result.accessToken);

  return result;
}

export async function registerSchool(input: {
  displayName: string;
  email: string;
  username?: string;
  password: string;
  schoolName: string;
  schoolSlug: string;
}): Promise<{ message: string }> {
  return apiRequest("/api/auth/register-school", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function getMyProfile(): Promise<unknown> {
  return apiRequest("/api/me");
}
