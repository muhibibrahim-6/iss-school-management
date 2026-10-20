
const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:4000"
).replace(/\/+$/, "");

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    username?: string | null;
    displayName: string;
    status?: string;
    platformRole?: string;
    memberships?: Array<{
      schoolId: string;
      role: string;
      school?: {
        id?: string;
        name: string;
        slug: string;
      };
    }>;
    schools?: Array<{
      id: string;
      role: string;
      name: string;
      slug: string;
      primaryColor?: string;
      accentColor?: string;
    }>;
  };
}

interface RegisterSchoolInput {
  displayName: string;
  email: string;
  username?: string;
  password: string;
  schoolName: string;
  schoolSlug: string;
}

interface ApiMessage {
  message: string;
}

interface BackendLoginResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  user: {
    id: string;
    email: string;
    displayName: string;
    schools: Array<{
      id: string;
      role: string;
      name: string;
      slug: string;
      primaryColor: string;
      accentColor: string;
    }>;
  };
}

let authToken: string | null = null;

export function setAuthToken(token: string | null): void {
  authToken = token;
}

async function apiRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = new Headers(options.headers);

  headers.set("Accept", "application/json");

  if (options.body) {
    headers.set("Content-Type", "application/json");
  }

  if (authToken) {
    headers.set("Authorization", `Bearer ${authToken}`);
  }

  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
    });
  } catch {
    throw new Error(
      "Cannot connect to the server. Check the API URL and server status."
    );
  }

  const data: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      typeof data === "object" &&
      data !== null &&
      "error" in data &&
      typeof data.error === "string"
        ? data.error
        : `Request failed (${response.status}).`;

    throw new Error(message);
  }

  return data as T;
}

export async function login(
  identifier: string,
  password: string
): Promise<LoginResponse> {
  const result = await apiRequest<BackendLoginResponse>(
    "/api/auth/login",
    {
      method: "POST",
      body: JSON.stringify({
        identifier,
        password,
      }),
    }
  );

  if (
    !result ||
    typeof result.accessToken !== "string" ||
    !result.user ||
    typeof result.user.id !== "string"
  ) {
    throw new Error("The server returned an invalid login response.");
  }

  setAuthToken(result.accessToken);

  return {
    token: result.accessToken,
    user: {
      id: result.user.id,
      email: result.user.email,
      displayName: result.user.displayName,
      status: "ACTIVE",
      schools: result.user.schools,
      memberships: result.user.schools.map((school) => ({
        schoolId: school.id,
        role: school.role,
        school: {
          id: school.id,
          name: school.name,
          slug: school.slug,
        },
      })),
    },
  };
}

export async function registerSchool(
  input: RegisterSchoolInput
): Promise<ApiMessage> {
  return apiRequest<ApiMessage>(
    "/api/auth/register-school",
    {
      method: "POST",
      body: JSON.stringify(input),
    }
  );
}

export async function getCurrentUser(): Promise<unknown> {
  return apiRequest<unknown>("/api/me");
}

export async function getReportSummary(): Promise<unknown> {
  return apiRequest<unknown>("/api/reports/summary");
}

export { API_BASE_URL };
