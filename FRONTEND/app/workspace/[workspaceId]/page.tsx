"use client";

import { useEffect, useState } from "react";
import {
  useAuthStore,
  useWorkspaceStore,
  useNotesStore,
  useTasksStore,
} from "@/lib/store";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Trello,
  Settings,
  ChevronLeft,
  Menu,
  LogOut,
  Users,
} from "lucide-react";
import Link from "next/link";
import { NotesGrid } from "@/components/notes-grid";
import { TasksBoard } from "@/components/tasks-board";
import { MembersPanel } from "@/components/members-panel";

type Tab = "notes" | "tasks" | "settings";

export default function WorkspacePage() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const {
    workspaces,
    currentWorkspace,
    selectWorkspace,
    deleteWorkspace,
    leaveWorkspace,
    fetchWorkspaces,
  } = useWorkspaceStore();
  const { fetchNotes } = useNotesStore();
  const { fetchTasks } = useTasksStore();
  const [activeTab, setActiveTab] = useState<Tab>("notes");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const router = useRouter();
  const params = useParams();
  const workspaceId = params?.workspaceId as string;

  // Detect desktop screen size
  useEffect(() => {
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    checkIsDesktop();
    window.addEventListener("resize", checkIsDesktop);
    return () => window.removeEventListener("resize", checkIsDesktop);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    if (workspaceId) {
      if (workspaces.length === 0) {
        fetchWorkspaces().then(() => {
          selectWorkspace(workspaceId);
          fetchNotes(workspaceId);
          fetchTasks(workspaceId);
        });
      } else {
        selectWorkspace(workspaceId);
        fetchNotes(workspaceId);
        fetchTasks(workspaceId);
      }
    }
  }, [
    isAuthenticated,
    workspaceId,
    router,
    workspaces.length,
    fetchWorkspaces,
    selectWorkspace,
    fetchNotes,
    fetchTasks,
  ]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handleDeleteWorkspace = async () => {
    if (confirm("Are you sure you want to delete this workspace?")) {
      await deleteWorkspace(workspaceId);
      router.push("/dashboard");
    }
  };

  const handleLeaveWorkspace = async () => {
    if (confirm("Are you sure you want to leave this workspace?")) {
      await leaveWorkspace(workspaceId);
      router.push("/dashboard");
    }
  };

  if (!isAuthenticated || !currentWorkspace) {
    return null;
  }

  const sidebarVariants = {
    open: { x: 0, opacity: 1, pointerEvents: "auto" as const },
    closed: { x: -256, opacity: 0, pointerEvents: "none" as const },
  };

  const navigationItems = [
    { id: "notes", label: "Notes", icon: BookOpen },
    { id: "tasks", label: "Tasks", icon: Trello },
    { id: "settings", label: "Settings", icon: Settings },
  ] as const;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0a0a0a] to-black">
      {/* Animated background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -right-1/3 w-96 h-96 bg-blue-600 rounded-full mix-blend-screen filter blur-3xl opacity-15 animate-blob" />
        <div className="absolute bottom-1/4 -left-1/3 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-15 animate-blob animation-delay-2000" />
      </div>

      <div className="relative z-10 flex h-screen">
        {/* Mobile Overlay */}
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          />
        )}

        {/* Sidebar */}
        <motion.aside
          initial="closed"
          animate={isDesktop ? "open" : isSidebarOpen ? "open" : "closed"}
          variants={sidebarVariants}
          className="fixed lg:relative w-64 h-screen border-r border-blue-400/10 bg-black/80 backdrop-blur-sm flex flex-col z-50 lg:z-10"
        >
          {/* Logo */}
          <div className="p-6 border-b border-blue-400/10">
            <Link href="/dashboard" className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white">
                Notes
                <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                  Flow
                </span>
              </h2>
            </Link>
          </div>

          {/* Workspace Info */}
          <div className="p-6 border-b border-blue-400/10">
            <p className="text-xs text-gray-500 mb-2">CURRENT WORKSPACE</p>
            <h3 className="text-white font-bold text-lg truncate">
              {currentWorkspace.name}
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              {currentWorkspace.members.length} members
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-6 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <motion.button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as Tab);
                    // Close sidebar on mobile after selecting tab
                    if (!isDesktop) {
                      setIsSidebarOpen(false);
                    }
                  }}
                  whileHover={{ x: 4 }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all cursor-pointer ${
                    activeTab === item.id
                      ? "bg-blue-600/20 text-blue-400 border border-blue-400/30"
                      : "text-gray-400 hover:text-white hover:bg-blue-600/10"
                  }`}
                >
                  <Icon size={18} />
                  <span className="font-medium">{item.label}</span>
                </motion.button>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="p-6 border-t border-blue-400/10 space-y-4">
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-600/10 border border-blue-400/20">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-cyan-300 flex items-center justify-center text-white text-xs font-bold">
                {user?.username?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user?.username}
                </p>
                <p className="text-xs text-gray-400 truncate">{user?.email}</p>
              </div>
            </div>

            <motion.button
              onClick={handleLogout}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white hover:bg-red-600/10 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut size={16} />
              <span className="text-sm font-medium">Logout</span>
            </motion.button>
          </div>
        </motion.aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Bar */}
          <div className="border-b border-blue-400/10 bg-black/40 backdrop-blur-sm p-3 sm:p-4 flex items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0">
              <motion.button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 text-gray-400 hover:text-white hover:bg-blue-600/20 rounded-lg transition-colors lg:hidden flex-shrink-0"
              >
                <Menu size={20} />
              </motion.button>

              <Link
                href="/dashboard"
                className="flex items-center gap-1 sm:gap-2 text-gray-400 hover:text-white transition-colors min-w-0"
              >
                <ChevronLeft size={18} className="flex-shrink-0" />
                <span className="text-xs sm:text-sm truncate">Back</span>
              </Link>
            </div>

            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
              <span className="text-xs sm:text-sm text-gray-400">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </span>
            </div>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-auto p-3 sm:p-6 lg:p-8">
            <AnimatePresence mode="wait">
              {activeTab === "notes" && (
                <motion.div
                  key="notes"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4 sm:space-y-6"
                >
                  <h2 className="text-2xl sm:text-3xl font-bold text-white">
                    Notes
                  </h2>
                  <NotesGrid workspaceId={workspaceId} />
                </motion.div>
              )}

              {activeTab === "tasks" && (
                <motion.div
                  key="tasks"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4 sm:space-y-6"
                >
                  <h2 className="text-2xl sm:text-3xl font-bold text-white">
                    Kanban Board
                  </h2>
                  <TasksBoard workspaceId={workspaceId} />
                </motion.div>
              )}

              {activeTab === "settings" && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6 sm:space-y-8 max-w-3xl"
                >
                  <h2 className="text-2xl sm:text-3xl font-bold text-white">
                    Workspace Settings
                  </h2>

                  {/* Members Section */}
                  <div className="glass rounded-xl p-4 sm:p-6 border border-blue-400/20 space-y-4">
                    <MembersPanel
                      members={currentWorkspace.members}
                      currentUserId={user.id}
                      workspaceOwnerId={currentWorkspace.owner.id}
                      isOwner={currentWorkspace.owner.id === user.id}
                      onAddMember={async (email) => {
                        await useWorkspaceStore
                          .getState()
                          .addMember(workspaceId, email);
                      }}
                      onRemoveMember={async (memberId) => {
                        await useWorkspaceStore
                          .getState()
                          .removeMember(workspaceId, memberId);
                      }}
                    />
                  </div>

                  {/* Workspace Info */}
                  <div className="glass rounded-xl p-6 border border-blue-400/20 space-y-4">
                    <h3 className="text-lg font-bold text-white">
                      Workspace Information
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Name</p>
                        <p className="text-white font-medium">
                          {currentWorkspace.name}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Owner</p>
                        <p className="text-white font-medium">
                          {currentWorkspace.owner.username}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Created</p>
                        <p className="text-white font-medium">
                          {new Date(
                            currentWorkspace.createdAt,
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Danger Zone */}
                  <div className="glass rounded-xl p-6 border border-red-400/20 space-y-4">
                    <h3 className="text-lg font-bold text-red-400">
                      Danger Zone
                    </h3>
                    {currentWorkspace.owner.id === user.id ? (
                      <>
                        <p className="text-sm text-gray-400">
                          Once you delete this workspace, there is no going
                          back. Please be certain.
                        </p>
                        <motion.button
                          onClick={handleDeleteWorkspace}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="px-6 py-3 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-400/30 rounded-lg font-medium transition-colors"
                        >
                          Delete Workspace
                        </motion.button>
                      </>
                    ) : (
                      <>
                        <p className="text-sm text-gray-400">
                          You will no longer have access to this workspace once
                          you leave.
                        </p>
                        <motion.button
                          onClick={handleLeaveWorkspace}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="px-6 py-3 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-400/30 rounded-lg font-medium transition-colors"
                        >
                          Leave Workspace
                        </motion.button>
                      </>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
