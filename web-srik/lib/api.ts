import { getAuthToken } from "./auth"

interface ApiOptions {
  method?: string
  body?: any
  headers?: Record<string, string>
}

export class ApiError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message)
  }
}

export async function api<T = any>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const { method = "GET", body, headers = {} } = options

  // Get auth token if available
  const token = getAuthToken()
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  // Add default headers
  headers["Content-Type"] = headers["Content-Type"] || "application/json"

  const response = await fetch(`/api${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  const data = await response.json()

  if (!response.ok) {
    throw new ApiError(response.status, data.error || "Terdapat ralat semasa memproses permintaan")
  }

  return data
}

// Activity-related API calls
export const activityApi = {
  list: () => api("/activities"),
  get: (id: string) => api(`/activities/${id}`),
  create: (data: any) => api("/activities", { method: "POST", body: data }),
  update: (id: string, data: any) => api(`/activities/${id}`, { method: "PUT", body: data }),
  delete: (id: string) => api(`/activities/${id}`, { method: "DELETE" }),
}

// Media-related API calls
export const mediaApi = {
  upload: async (file: File, type: "image" | "video") => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("type", type)

    return api("/upload", {
      method: "POST",
      headers: {
        // Let the browser set the Content-Type for FormData
        "Content-Type": undefined as any,
      },
      body: formData as any,
    })
  },
  delete: (id: string) => api(`/media/${id}`, { method: "DELETE" }),
}

// Post-related API calls
export const postApi = {
  list: () => api("/posts"),
  get: (id: string) => api(`/posts/${id}`),
  create: (data: any) => api("/posts", { method: "POST", body: data }),
  update: (id: string, data: any) => api(`/posts/${id}`, { method: "PUT", body: data }),
  delete: (id: string) => api(`/posts/${id}`, { method: "DELETE" }),
}
