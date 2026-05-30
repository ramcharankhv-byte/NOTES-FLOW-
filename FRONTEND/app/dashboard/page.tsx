"use client";

import { useEffect, useState } from "react";
import { useAuthStore, useWorkspaceStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, LogOut, Grid3x3, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { workspaces, fetchWorkspaces, createWorkspace, searchWorkspaces } =
    useWorkspaceStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }
    fetchWorkspaces();
  }, [isAuthenticated, router, fetchWorkspaces]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      await searchWorkspaces(query);
    }
  };

  const handleCreateWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorkspaceName.trim() || newWorkspaceName.length < 3) {
      return;
    }

    setIsCreating(true);
    try {
      await createWorkspace(newWorkspaceName);
      setNewWorkspaceName("");
      setIsCreateModalOpen(false);
    } finally {
      setIsCreating(false);
    }
  };

  const handleSelectWorkspace = (id: string) => {
    router.push(`/workspace/${id}`);
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  const filteredWorkspaces = workspaces.filter((ws) =>
    ws.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0a0a0a] to-black">
      {/* Animated background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -right-1/3 w-96 h-96 bg-blue-600 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute bottom-1/4 -left-1/3 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 border-b border-blue-400/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <h1 className="text-lg sm:text-2xl font-black text-white truncate">
              Notes
              <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                Flow
              </span>
            </h1>
          </Link>

          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            <span className="text-xs sm:text-sm text-gray-400 truncate max-w-[120px] sm:max-w-none">
              @{user.username}
            </span>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-white hover:bg-blue-600/20 rounded-lg transition-colors cursor-pointer"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header Section */}
        <motion.div variants={itemVariants} className="mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-1 sm:mb-2 break-words">
            Welcome back,{" "}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              {user.username}
            </span>
          </h2>
          <p className="text-sm sm:text-base text-gray-400">
            Manage your workspaces and collaborate with your team
          </p>
        </motion.div>

        {/* Search and Create Section */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col gap-3 sm:gap-4 mb-8 sm:mb-12"
        >
          {/* Search */}
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search workspaces..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 sm:py-3 bg-black/50 border border-blue-400/20 rounded-lg text-white placeholder-gray-500 text-sm sm:text-base focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/50 transition-all"
            />
          </div>

          {/* Create Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsCreateModalOpen(true)}
            className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:shadow-blue-600/50 text-sm sm:text-base cursor-pointer"
          >
            <Plus size={18} />
            <span>Create Workspace</span>
          </motion.button>
        </motion.div>

        {/* Workspaces Grid */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
        >
          <AnimatePresence>
            {filteredWorkspaces.length > 0 ? (
              filteredWorkspaces.map((workspace) => (
                <motion.div
                  key={workspace.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  onClick={() => handleSelectWorkspace(workspace.id)}
                  className="glass rounded-xl p-4 sm:p-6 cursor-pointer group border border-blue-400/20 hover:border-blue-400/60 transition-all active:scale-95"
                >
                  {/* Icon */}
                  <div className="p-3 sm:p-4 bg-gradient-to-br from-blue-600/30 to-cyan-600/20 rounded-lg w-fit mb-3 sm:mb-4 group-hover:from-blue-600/50 group-hover:to-cyan-600/40 transition-all">
                    <Grid3x3
                      size={20}
                      className="sm:w-6 sm:h-6 text-blue-400 group-hover:text-cyan-300 transition-colors"
                    />
                  </div>

                  {/* Title */}
                  <h3 className="text-white font-bold text-base sm:text-lg mb-1 sm:mb-2 truncate group-hover:text-blue-300 transition-colors">
                    {workspace.name}
                  </h3>

                  {/* Members */}
                  <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4">
                    {workspace.members.length} member
                    {workspace.members.length !== 1 ? "s" : ""}
                  </p>

                  {/* Footer with date and arrow */}
                  <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-blue-400/10">
                    <span className="text-xs text-gray-500">
                      {new Date(workspace.createdAt).toLocaleDateString()}
                    </span>
                    <ArrowRight
                      size={16}
                      className="text-gray-400 group-hover:text-blue-400 transform group-hover:translate-x-1 transition-all"
                    />
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="col-span-1 sm:col-span-2 lg:col-span-3 glass rounded-xl p-8 sm:p-12 text-center border border-blue-400/10"
              >
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-blue-600/20 rounded-full">
                    <Grid3x3 size={32} className="text-blue-400" />
                  </div>
                </div>
                <h2 className="text-white font-bold text-lg sm:text-xl mb-2">
                  {searchQuery ? "No workspaces found" : "No workspaces yet"}
                </h2>
                <p className="text-gray-400 mb-6 text-sm sm:text-base">
                  {searchQuery
                    ? "Try a different search term"
                    : "Create your first workspace to get started collaborating"}
                </p>
                {!searchQuery && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsCreateModalOpen(true)}
                    className="px-4 sm:px-6 py-2 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold flex items-center gap-2 mx-auto transition-all text-sm sm:text-base cursor-pointer"
                  >
                    <Plus size={18} />
                    Create Workspace
                  </motion.button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Create Workspace Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCreateModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
            >
              <div className="glass rounded-2xl p-6 sm:p-8 max-w-md w-full border border-blue-400/20 max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-1 sm:mb-2">
                  Create Workspace
                </h2>
                <p className="text-gray-400 mb-6 text-sm sm:text-base">
                  Give your workspace a name to get started
                </p>

                <form onSubmit={handleCreateWorkspace} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Workspace Name
                    </label>
                    <input
                      type="text"
                      value={newWorkspaceName}
                      onChange={(e) => setNewWorkspaceName(e.target.value)}
                      placeholder="e.g. Marketing Team"
                      minLength={3}
                      maxLength={50}
                      autoFocus
                      className="w-full px-4 py-3 bg-black/50 border border-blue-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/50 transition-all"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      3-50 characters
                    </p>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setIsCreateModalOpen(false)}
                      className="flex-1 px-4 py-2 border border-blue-400/30 text-white rounded-lg font-medium hover:bg-blue-400/10 transition-colors"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      type="submit"
                      disabled={isCreating || newWorkspaceName.length < 3}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg font-bold transition-colors"
                    >
                      {isCreating ? "Creating..." : "Create"}
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
