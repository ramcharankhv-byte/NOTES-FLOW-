import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

// API Base URL
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Enable sending cookies with requests
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - add token if available
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from localStorage if available
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

// Response interceptor - handle token refresh on 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // If 401 and not a retry, attempt to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Call refresh token endpoint
        const refreshResponse = await axios.post(
          `${API_BASE_URL}/auth/refresh-token`,
          {},
          { withCredentials: true },
        );

        // Store new token if provided in response
        if (refreshResponse.data?.data?.accessToken) {
          localStorage.setItem(
            "accessToken",
            refreshResponse.data.data.accessToken,
          );
        }

        // Retry original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        if (typeof window !== "undefined") {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("user");
          window.location.href = "/auth/login";
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

// API Endpoints
export const authAPI = {
  register: (data: { email: string; username: string; password: string }) =>
    apiClient.post("/auth/register", data),
  login: (data: { email: string; password: string }) =>
    apiClient.post("/auth/login", data),
  logout: () => apiClient.post("/auth/logout"),
  getCurrentUser: () => apiClient.get("/auth/getUser"),
  refreshToken: () => apiClient.post("/auth/refresh-token"),
  googleInitiate: () => apiClient.get("/auth/google"),
  googleCallback: (code: string) =>
    apiClient.get("/auth/google/callback", { params: { code } }),
  completeGoogleSignup: (data: { username: string; token: string }) =>
    apiClient.post("/auth/google/complete-signup", data),
};

export const workspaceAPI = {
  createWorkspace: (data: { name: string }) =>
    apiClient.post("/workspaces", data),
  getUserWorkspaces: (page: number = 1, limit: number = 10) =>
    apiClient.get("/workspaces", { params: { page, limit } }),
  getWorkspace: (workspaceId: string) =>
    apiClient.get(`/workspaces/${workspaceId}`),
  searchWorkspaces: (query: string) =>
    apiClient.get("/workspaces/search", { params: { query } }),
  addMember: (workspaceId: string, data: { memberId: string }) =>
    apiClient.patch(`/workspaces/${workspaceId}/add`, data),
  removeMember: (workspaceId: string, data: { member: string }) =>
    apiClient.patch(`/workspaces/${workspaceId}/remove`, data),
  leaveWorkspace: (workspaceId: string) =>
    apiClient.patch(`/workspaces/${workspaceId}/leave`),
  deleteWorkspace: (workspaceId: string) =>
    apiClient.delete(`/workspaces/${workspaceId}`),
};

export const notesAPI = {
  createNote: (workspaceId: string, data: { title: string; content: string }) =>
    apiClient.post(`/notes/${workspaceId}`, data),
  getWorkspaceNotes: (
    workspaceId: string,
    page: number = 1,
    limit: number = 10,
  ) => apiClient.get(`/notes/${workspaceId}`, { params: { page, limit } }),
  updateNote: (noteId: string, data: { title?: string; content?: string }) =>
    apiClient.patch(`/notes/${noteId}`, data),
  deleteNote: (noteId: string) => apiClient.delete(`/notes/${noteId}`),
  searchNotes: (workspaceId: string, query: string) =>
    apiClient.get(`/notes/${workspaceId}/search`, { params: { query } }),
};

export const tasksAPI = {
  createTask: (
    workspaceId: string,
    data: { title: string; assignedTo: string },
  ) => apiClient.post(`/tasks/${workspaceId}`, data),
  getWorkspaceTasks: (workspaceId: string) =>
    apiClient.get(`/tasks/${workspaceId}`),
  updateTaskStatus: (
    taskId: string,
    data: { status: "pending" | "in-progress" | "completed" },
  ) => apiClient.patch(`/tasks/${taskId}/status`, data),
  assignTask: (taskId: string, data: { assignedTo: string }) =>
    apiClient.patch(`/tasks/${taskId}/assign`, data),
  deleteTask: (taskId: string) => apiClient.delete(`/tasks/${taskId}`),
};

export default apiClient;
