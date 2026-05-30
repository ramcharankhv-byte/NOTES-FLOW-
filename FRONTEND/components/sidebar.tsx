"use client";

import { useWorkspaceStore } from "@/lib/store";
import { useState } from "react";
import { Plus, Trash2, Edit2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  isMobile?: boolean;
}

export function Sidebar({
  isOpen = true,
  onClose,
  isMobile = false,
}: SidebarProps) {
  const {
    workspaces,
    currentWorkspace,
    selectWorkspace,
    createWorkspace,
    deleteWorkspace,
  } = useWorkspaceStore();
  const [showNewWorkspace, setShowNewWorkspace] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const handleCreate = async () => {
    if (newName.trim()) {
      await createWorkspace(newName, newDescription);
      setNewName("");
      setNewDescription("");
      setShowNewWorkspace(false);
    }
  };

  const handleSelectWorkspace = (workspace: any) => {
    selectWorkspace(workspace);
    if (isMobile && onClose) {
      onClose();
    }
  };

  const sidebarContent = (
    <div
      className={`glass flex flex-col h-full ${!isMobile ? "border-r border-blue-500/10" : ""}`}
    >
      {/* Header */}
      <div
        className={`${isMobile ? "p-4 sm:p-6" : "p-4"} border-b border-blue-500/10 flex items-center justify-between`}
      >
        <h2 className="text-white font-semibold text-lg sm:text-base">
          {isMobile ? "Workspaces" : "Workspaces"}
        </h2>
        {isMobile && onClose && (
          <button
            onClick={onClose}
            className="p-1 hover:bg-blue-600/10 rounded-lg transition-colors md:hidden"
          >
            <X size={20} className="text-gray-400" />
          </button>
        )}
      </div>

      {/* New Workspace Button */}
      <div
        className={`${isMobile ? "p-4 sm:p-6" : "p-4"} border-b border-blue-500/10`}
      >
        <button
          onClick={() => setShowNewWorkspace(!showNewWorkspace)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-600/20 hover:bg-blue-600/30 rounded-lg text-blue-400 transition-colors text-sm font-medium"
        >
          <Plus size={16} />
          New Workspace
        </button>
      </div>

      {/* New Workspace Form */}
      <AnimatePresence>
        {showNewWorkspace && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`${isMobile ? "p-4 sm:p-6" : "p-4"} border-b border-blue-500/10 space-y-3`}
          >
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Workspace name"
              className="w-full px-3 py-2 bg-black/50 border border-blue-500/20 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500"
            />
            <input
              type="text"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Description"
              className="w-full px-3 py-2 bg-black/50 border border-blue-500/20 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500"
            />
            <div className="flex gap-2">
              <button
                onClick={handleCreate}
                className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm font-medium transition-colors"
              >
                Create
              </button>
              <button
                onClick={() => {
                  setShowNewWorkspace(false);
                  setNewName("");
                  setNewDescription("");
                }}
                className="flex-1 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white text-sm font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Workspaces List */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-2">
        {workspaces.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400 text-sm">No workspaces yet</p>
          </div>
        ) : (
          workspaces.map((workspace) => (
            <motion.div
              key={workspace.id}
              whileHover={{ x: isMobile ? 0 : 4 }}
              className={`p-3 rounded-lg cursor-pointer transition-all group ${
                currentWorkspace?.id === workspace.id
                  ? "bg-blue-600/20 border border-blue-500/30"
                  : "hover:bg-blue-600/10"
              }`}
              onClick={() => handleSelectWorkspace(workspace)}
            >
              <div className="flex items-start justify-between gap-2 min-w-0">
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-medium text-sm truncate break-words">
                    {workspace.name}
                  </h3>
                  <p className="text-gray-500 text-xs truncate">
                    {workspace.description}
                  </p>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  <button className="p-1 hover:bg-blue-600/20 rounded transition-colors">
                    <Edit2 size={14} className="text-gray-400" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteWorkspace(workspace.id);
                    }}
                    className="p-1 hover:bg-red-600/20 rounded transition-colors"
                  >
                    <Trash2 size={14} className="text-gray-400" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );

  // Mobile drawer version
  if (isMobile) {
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-64 sm:w-80 z-50 md:hidden overflow-y-auto"
            >
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

  // Desktop sidebar version
  return <div className="hidden md:flex w-64 flex-col">{sidebarContent}</div>;
}
