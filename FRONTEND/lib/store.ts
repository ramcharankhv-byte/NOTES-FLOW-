import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authAPI, workspaceAPI, notesAPI, tasksAPI } from "./api-client";

// ====== TYPES ======
export interface User {
  _id?: string;
  id?: string;
  email: string;
  username: string;
  name?: string;
  avatar?: string;
}

export interface Workspace {
  id: string;
  name: string;
  owner: User;
  members: User[];
  createdAt: string;
  updatedAt: string;
}

export interface Note {
  id: string;
  workspaceId: string;
  title: string;
  content: string;
  createdBy: User;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
}

export type TaskStatus = "pending" | "in-progress" | "completed";

export interface Task {
  id: string;
  workspaceId: string;
  title: string;
  description?: string;
  status: TaskStatus;
  assignedTo: User;
  createdBy: User;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

// ====== AUTH STORE ======
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
  accessToken: string | null;
  refreshToken: string | null;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, username: string, password: string) => Promise<void>;
  googleSignup: (token: string, username: string) => Promise<void>;
  googleLogin: () => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  setTokens: (accessToken: string, refreshToken?: string) => void;
  clearError: () => void;
  fetchCurrentUser: () => Promise<void>;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isInitialized: false,
      isLoading: false,
      error: null,
      accessToken: null,
      refreshToken: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.login({ email, password });
          const { user, accessToken } = response.data.data || response.data;

          if (user) {
            const userId = user._id || user.id;
            set({
              user: { ...user, id: userId },
              isAuthenticated: true,
              accessToken,
            });
            if (typeof window !== "undefined" && accessToken) {
              localStorage.setItem("accessToken", accessToken);
            }
          }
        } catch (error: any) {
          const errorMsg = error.response?.data?.message || "Login failed";
          set({ error: errorMsg });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      signup: async (email: string, username: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.register({
            email,
            username,
            password,
          });
          const { user, accessToken } = response.data.data || response.data;

          if (user) {
            const userId = user._id || user.id;
            set({
              user: { ...user, id: userId },
              isAuthenticated: true,
              accessToken,
            });
            if (typeof window !== "undefined" && accessToken) {
              localStorage.setItem("accessToken", accessToken);
            }
          }
        } catch (error: any) {
          const errorMsg = error.response?.data?.message || "Signup failed";
          set({ error: errorMsg });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      googleSignup: async (token: string, username: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.completeGoogleSignup({
            username,
            token,
          });
          const { user, accessToken } = response.data.data || response.data;

          if (user) {
            const userId = user._id || user.id;
            set({
              user: { ...user, id: userId },
              isAuthenticated: true,
              accessToken,
            });
            if (typeof window !== "undefined" && accessToken) {
              localStorage.setItem("accessToken", accessToken);
            }
          }
        } catch (error: any) {
          const errorMsg =
            error.response?.data?.message || "Google signup failed";
          set({ error: errorMsg });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      googleLogin: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.googleInitiate();
          const url = response.data?.data?.url || response.data?.url;
          if (url && typeof window !== "undefined") {
            window.location.href = url;
          } else {
            set({ error: "Failed to get Google sign in URL" });
          }
        } catch (error: any) {
          set({ error: error.response?.data?.message || "Google auth failed" });
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        set({ isLoading: true, error: null });
        try {
          await authAPI.logout();
          set({
            user: null,
            isAuthenticated: false,
            accessToken: null,
            refreshToken: null,
            error: null,
          });
          if (typeof window !== "undefined") {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("user");
          }
        } catch (error: any) {
          const errorMsg = error.response?.data?.message || "Logout failed";
          set({ error: errorMsg });
        } finally {
          set({ isLoading: false });
        }
      },

      fetchCurrentUser: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.getCurrentUser();
          const user = response.data.data?.user || response.data.data;
          const accessToken = response.data.data?.accessToken;

          if (user) {
            const userId = user._id || user.id;
            set({
              user: { ...user, id: userId },
              isAuthenticated: true,
              ...(accessToken && { accessToken })
            });
          }
        } catch (error: any) {
          const errorMsg =
            error.response?.data?.message || "Failed to fetch user";
          set({ error: errorMsg });
        } finally {
          set({ isLoading: false });
        }
      },

      initializeAuth: async () => {
        set({ isLoading: true });
        try {
          const response = await authAPI.getCurrentUser();
          const user = response.data.data?.user || response.data.data;
          const accessToken = response.data.data?.accessToken;

          if (user) {
            const userId = user._id || user.id;
            set({
              user: { ...user, id: userId },
              isAuthenticated: true,
              ...(accessToken && { accessToken })
            });
          } else {
            set({ user: null, isAuthenticated: false, accessToken: null, refreshToken: null });
          }
        } catch (error) {
          // Token may be invalid or no session, just clear it
          set({ user: null, isAuthenticated: false, accessToken: null, refreshToken: null });
        } finally {
          set({ isInitialized: true, isLoading: false });
        }
      },

      setUser: (user: User | null) => set({ user }),

      setTokens: (accessToken: string, refreshToken?: string) => {
        set({ accessToken, refreshToken: refreshToken || null });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "auth-store",
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    },
  ),
);

// ====== WORKSPACE STORE ======
interface WorkspaceState {
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchWorkspaces: () => Promise<void>;
  selectWorkspace: (id: string) => void;
  createWorkspace: (name: string) => Promise<void>;
  addMember: (workspaceId: string, email: string) => Promise<void>;
  removeMember: (workspaceId: string, memberId: string) => Promise<void>;
  leaveWorkspace: (workspaceId: string) => Promise<void>;
  deleteWorkspace: (workspaceId: string) => Promise<void>;
  searchWorkspaces: (query: string) => Promise<void>;
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  workspaces: [],
  currentWorkspace: null,
  isLoading: false,
  error: null,

  fetchWorkspaces: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await workspaceAPI.getUserWorkspaces();
      const workspaces = response.data.data.map((w: any) => ({
        ...w,
        id: w._id || w.id,
        owner: w.owner ? { ...w.owner, id: w.owner._id || w.owner.id } : undefined,
        members: w.members?.map((m: any) => ({ ...m, id: m._id || m.id })) || []
      }));
      set({ workspaces });
    } catch (error: any) {
      set({ error: error.response?.data?.message || "Failed to fetch workspaces" });
    } finally {
      set({ isLoading: false });
    }
  },

  selectWorkspace: (id: string) => {
    set((state) => ({
      currentWorkspace: state.workspaces.find((w) => w.id === id) || null,
    }));
  },

  createWorkspace: async (name: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await workspaceAPI.createWorkspace({ name });
      let newWorkspace = response.data.data?.workspace || response.data.data;
      newWorkspace = {
        ...newWorkspace,
        id: newWorkspace._id || newWorkspace.id,
        owner: newWorkspace.owner ? { ...newWorkspace.owner, id: newWorkspace.owner._id || newWorkspace.owner.id } : undefined,
        members: newWorkspace.members?.map((m: any) => ({ ...m, id: m._id || m.id })) || []
      };
      set((state) => ({
        workspaces: [newWorkspace, ...state.workspaces],
        currentWorkspace: newWorkspace,
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.message || "Failed to create workspace" });
    } finally {
      set({ isLoading: false });
    }
  },

  addMember: async (workspaceId: string, email: string) => {
    set({ isLoading: true, error: null });
    try {
      // Assuming 'email' is actually the memberId as per API or UI gives ID
      await workspaceAPI.addMember(workspaceId, { memberId: email });
      const response = await workspaceAPI.getWorkspace(workspaceId);
      const updatedWorkspace = response.data.data.workSpace || response.data.data;
      const formatted = {
        ...updatedWorkspace,
        id: updatedWorkspace._id || updatedWorkspace.id,
        owner: updatedWorkspace.owner ? { ...updatedWorkspace.owner, id: updatedWorkspace.owner._id || updatedWorkspace.owner.id } : undefined,
        members: updatedWorkspace.members?.map((m: any) => ({ ...m, id: m._id || m.id })) || []
      };
      set((state) => ({
        workspaces: state.workspaces.map((w) => w.id === workspaceId ? formatted : w),
        currentWorkspace: state.currentWorkspace?.id === workspaceId ? formatted : state.currentWorkspace,
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.message || "Failed to add member" });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  removeMember: async (workspaceId: string, memberId: string) => {
    set({ isLoading: true, error: null });
    try {
      await workspaceAPI.removeMember(workspaceId, { member: memberId });
      set((state) => ({
        workspaces: state.workspaces.map((w) =>
          w.id === workspaceId ? { ...w, members: w.members.filter((m) => m.id !== memberId && m._id !== memberId) } : w
        ),
        currentWorkspace: state.currentWorkspace?.id === workspaceId
          ? { ...state.currentWorkspace, members: state.currentWorkspace.members.filter((m) => m.id !== memberId && m._id !== memberId) }
          : state.currentWorkspace,
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.message || "Failed to remove member" });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  leaveWorkspace: async (workspaceId: string) => {
    set({ isLoading: true, error: null });
    try {
      await workspaceAPI.leaveWorkspace(workspaceId);
      set((state) => ({
        workspaces: state.workspaces.filter((w) => w.id !== workspaceId),
        currentWorkspace: state.currentWorkspace?.id === workspaceId ? null : state.currentWorkspace
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.message || "Failed to leave workspace" });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteWorkspace: async (workspaceId: string) => {
    set({ isLoading: true, error: null });
    try {
      await workspaceAPI.deleteWorkspace(workspaceId);
      set((state) => ({
        workspaces: state.workspaces.filter((w) => w.id !== workspaceId),
        currentWorkspace: state.currentWorkspace?.id === workspaceId ? null : state.currentWorkspace
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.message || "Failed to delete workspace" });
    } finally {
      set({ isLoading: false });
    }
  },

  searchWorkspaces: async (query: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await workspaceAPI.searchWorkspaces(query);
      const workspaces = response.data.data.map((w: any) => ({
        ...w,
        id: w._id || w.id,
        owner: w.owner ? { ...w.owner, id: w.owner._id || w.owner.id } : undefined,
        members: w.members?.map((m: any) => ({ ...m, id: m._id || m.id })) || []
      }));
      set({ workspaces });
    } catch (error: any) {
      set({ error: error.response?.data?.message || "Failed to search workspaces" });
    } finally {
      set({ isLoading: false });
    }
  },
}));

// ====== NOTES STORE ======
interface NotesState {
  notes: Note[];
  currentNote: Note | null;
  isLoading: boolean;
  error: string | null;
  searchQuery: string;

  // Actions
  fetchNotes: (workspaceId: string) => Promise<void>;
  selectNote: (id: string) => void;
  createNote: (
    workspaceId: string,
    title: string,
    content: string,
  ) => Promise<void>;
  updateNote: (noteId: string, title: string, content: string) => Promise<void>;
  deleteNote: (noteId: string) => Promise<void>;
  searchNotes: (workspaceId: string, query: string) => Promise<void>;
}

export const useNotesStore = create<NotesState>((set) => ({
  notes: [],
  currentNote: null,
  isLoading: false,
  error: null,
  searchQuery: "",

  fetchNotes: async (workspaceId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await notesAPI.getWorkspaceNotes(workspaceId);
      const notes = response.data.data.map((n: any) => ({
        ...n,
        id: n._id || n.id,
        createdBy: n.createdBy ? { ...n.createdBy, id: n.createdBy._id || n.createdBy.id } : undefined
      }));
      set({ notes });
    } catch (error: any) {
      set({ error: error.response?.data?.message || "Failed to fetch notes" });
    } finally {
      set({ isLoading: false });
    }
  },

  selectNote: (id: string) => {
    set((state) => ({
      currentNote: state.notes.find((n) => n.id === id) || null,
    }));
  },

  createNote: async (workspaceId: string, title: string, content: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await notesAPI.createNote(workspaceId, { title, content });
      let newNote = response.data.data;
      newNote = {
        ...newNote,
        id: newNote._id || newNote.id,
        createdBy: newNote.createdBy ? { ...newNote.createdBy, id: newNote.createdBy._id || newNote.createdBy.id } : undefined
      };
      set((state) => ({
        notes: [newNote, ...state.notes],
        currentNote: newNote,
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.message || "Failed to create note" });
    } finally {
      set({ isLoading: false });
    }
  },

  updateNote: async (noteId: string, title: string, content: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await notesAPI.updateNote(noteId, { title, content });
      let updatedNote = response.data.data;
      updatedNote = {
        ...updatedNote,
        id: updatedNote._id || updatedNote.id,
      };
      set((state) => ({
        notes: state.notes.map((n) => n.id === noteId ? { ...n, ...updatedNote } : n),
        currentNote: state.currentNote?.id === noteId ? { ...state.currentNote, ...updatedNote } : state.currentNote,
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.message || "Failed to update note" });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteNote: async (noteId: string) => {
    set({ isLoading: true, error: null });
    try {
      await notesAPI.deleteNote(noteId);
      set((state) => ({
        notes: state.notes.filter((n) => n.id !== noteId),
        currentNote: state.currentNote?.id === noteId ? null : state.currentNote,
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.message || "Failed to delete note" });
    } finally {
      set({ isLoading: false });
    }
  },

  searchNotes: async (workspaceId: string, query: string) => {
    set({ isLoading: true, error: null, searchQuery: query });
    try {
      const response = await notesAPI.searchNotes(workspaceId, query);
      const notes = response.data.data.map((n: any) => ({
        ...n,
        id: n._id || n.id,
      }));
      set({ notes });
    } catch (error: any) {
      set({ error: error.response?.data?.message || "Failed to search notes" });
    } finally {
      set({ isLoading: false });
    }
  },
}));

// ====== TASKS STORE ======
interface TasksState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchTasks: (workspaceId: string) => Promise<void>;
  createTask: (
    workspaceId: string,
    title: string,
    assignedTo: string,
  ) => Promise<void>;
  updateTaskStatus: (taskId: string, status: TaskStatus) => Promise<void>;
  assignTask: (taskId: string, userId: string) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
}

export const useTasksStore = create<TasksState>((set) => ({
  tasks: [],
  isLoading: false,
  error: null,

  fetchTasks: async (workspaceId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await tasksAPI.getWorkspaceTasks(workspaceId);
      const tasks = response.data.data.map((t: any) => ({
        ...t,
        id: t._id || t.id,
        assignedTo: t.assignedTo ? { ...t.assignedTo, id: t.assignedTo._id || t.assignedTo.id } : undefined,
        createdBy: t.createdBy ? { ...t.createdBy, id: t.createdBy._id || t.createdBy.id } : undefined
      }));
      set({ tasks });
    } catch (error: any) {
      set({ error: error.response?.data?.message || "Failed to fetch tasks" });
    } finally {
      set({ isLoading: false });
    }
  },

  createTask: async (workspaceId: string, title: string, assignedTo: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await tasksAPI.createTask(workspaceId, { title, assignedTo });
      let newTask = response.data.data;
      newTask = {
        ...newTask,
        id: newTask._id || newTask.id,
      };
      set((state) => ({
        tasks: [newTask, ...state.tasks],
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.message || "Failed to create task" });
    } finally {
      set({ isLoading: false });
    }
  },

  updateTaskStatus: async (taskId: string, status: TaskStatus) => {
    set({ isLoading: true, error: null });
    try {
      const response = await tasksAPI.updateTaskStatus(taskId, { status });
      set((state) => ({
        tasks: state.tasks.map((t) => t.id === taskId ? { ...t, status } : t),
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.message || "Failed to update task status" });
    } finally {
      set({ isLoading: false });
    }
  },

  assignTask: async (taskId: string, userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await tasksAPI.assignTask(taskId, { assignedTo: userId });
      set((state) => ({
        tasks: state.tasks.map((t) =>
          t.id === taskId ? { ...t, assignedTo: { ...t.assignedTo, id: userId, _id: userId } } : t
        ),
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.message || "Failed to assign task" });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteTask: async (taskId: string) => {
    set({ isLoading: true, error: null });
    try {
      await tasksAPI.deleteTask(taskId);
      set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== taskId),
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.message || "Failed to delete task" });
    } finally {
      set({ isLoading: false });
    }
  },
}));

// ====== NOTE STORE (Keep for backwards compatibility) ======
export const useNoteStore = useNotesStore;
