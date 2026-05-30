"use client";

import { useState, useEffect } from "react";
import {
  useTasksStore,
  TaskStatus,
  Task,
  useWorkspaceStore,
  useAuthStore,
} from "@/lib/store";
import { motion, AnimatePresence, Droppable, Draggable } from "framer-motion";
import { Search, Plus, Trash2, Clock } from "lucide-react";

interface TasksBoardProps {
  workspaceId: string;
}

export function TasksBoard({ workspaceId }: TasksBoardProps) {
  const { tasks, fetchTasks, createTask, updateTaskStatus, deleteTask } =
    useTasksStore();
  const { currentWorkspace } = useWorkspaceStore();
  const { user } = useAuthStore();
  const isOwner = currentWorkspace?.owner.id === user?.id;
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskAssignee, setNewTaskAssignee] = useState("");

  useEffect(() => {
    fetchTasks(workspaceId);
  }, [workspaceId, fetchTasks]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !newTaskAssignee.trim()) return;

    await createTask(workspaceId, newTaskTitle, newTaskAssignee);
    setNewTaskTitle("");
    setNewTaskAssignee("");
    setIsCreateModalOpen(false);
  };

  const handleTaskStatusChange = async (
    taskId: string,
    newStatus: TaskStatus,
  ) => {
    await updateTaskStatus(taskId, newStatus);
  };

  const handleDeleteTask = async (taskId: string) => {
    await deleteTask(taskId);
  };

  const statuses: { status: TaskStatus; label: string; color: string }[] = [
    {
      status: "pending",
      label: "Pending",
      color: "from-yellow-600 to-yellow-400",
    },
    {
      status: "in-progress",
      label: "In Progress",
      color: "from-blue-600 to-blue-400",
    },
    {
      status: "completed",
      label: "Completed",
      color: "from-green-600 to-green-400",
    },
  ];

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks
      .filter((task) => task.status === status)
      .filter((task) =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()),
      );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-black/50 border border-blue-400/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/50 transition-all"
          />
        </div>

        {isOwner && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold flex items-center gap-2 transition-all hover:shadow-lg hover:shadow-blue-600/50 whitespace-nowrap"
          >
            <Plus size={18} />
            New Task
          </motion.button>
        )}
      </div>

      {/* Kanban Board */}
      <motion.div layout className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statuses.map(({ status, label, color }) => {
          const statusTasks = getTasksByStatus(status);
          return (
            <motion.div key={status} layout className="space-y-4">
              {/* Column Header */}
              <div
                className={`flex items-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r ${color} bg-opacity-10 border border-opacity-20 border-gray-400`}
              >
                <div
                  className={`w-3 h-3 rounded-full bg-gradient-to-r ${color}`}
                />
                <h3 className="font-bold text-white">{label}</h3>
                <span className="ml-auto text-xs text-gray-400 bg-white/10 px-2 py-1 rounded">
                  {statusTasks.length}
                </span>
              </div>

              {/* Tasks Container */}
              <motion.div
                layout
                className="space-y-3 min-h-[400px] bg-black/30 rounded-lg p-4 border border-blue-400/10"
              >
                <AnimatePresence mode="popLayout">
                  {statusTasks.length > 0 ? (
                    statusTasks.map((task) => (
                      <motion.div
                        key={task.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        drag
                        dragElastic={0.2}
                        onDragEnd={(_, info) => {
                          // This is a simplified drag handler
                          // In a full implementation, you'd calculate which column was dropped on
                        }}
                        className="group glass rounded-lg p-4 cursor-grab active:cursor-grabbing border border-blue-400/30 hover:border-blue-400/60 transition-all touch-none"
                      >
                        {/* Task Header */}
                        <h4 className="font-bold text-white mb-2 group-hover:text-blue-300 transition-colors line-clamp-2">
                          {task.title}
                        </h4>

                        {/* Assignee */}
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-cyan-300 flex items-center justify-center text-white text-xs font-bold">
                            {task.assignedTo.username
                              ?.charAt(0)
                              .toUpperCase() ||
                              task.assignedTo.name?.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-xs text-gray-400 truncate">
                            {task.assignedTo.username || task.assignedTo.name}
                          </span>
                        </div>

                        {/* Due Date */}
                        {task.dueDate && (
                          <div className="flex items-center gap-2 mb-3 text-xs text-gray-400">
                            <Clock size={14} />
                            <span>
                              {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                          </div>
                        )}

                        {/* Status Buttons */}
                        {(isOwner ||
                          task.assignedTo._id === user?.id ||
                          task.assignedTo.id === user?.id) && (
                          <div className="flex gap-2 pt-3 border-t border-blue-400/10 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                            {statuses
                              .filter((s) => s.status !== status)
                              .map((s) => (
                                <motion.button
                                  key={s.status}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() =>
                                    handleTaskStatusChange(task.id, s.status)
                                  }
                                  className="flex-1 text-xs px-2 py-1 rounded bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 transition-colors font-medium cursor-pointer"
                                >
                                  {s.label}
                                </motion.button>
                              ))}
                            {isOwner && (
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleDeleteTask(task.id)}
                                className="text-xs px-2 py-1 rounded bg-red-600/20 hover:bg-red-600/40 text-red-300 transition-colors cursor-pointer"
                              >
                                <Trash2 size={12} />
                              </motion.button>
                            )}
                          </div>
                        )}
                      </motion.div>
                    ))
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center justify-center h-20 text-gray-500 text-sm"
                    >
                      No tasks
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Create Task Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCreateModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
            >
              <div className="glass rounded-2xl p-8 max-w-md w-full border border-blue-400/20">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Create Task
                </h2>

                <form onSubmit={handleCreateTask} className="space-y-4">
                  {/* Title Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Task Title
                    </label>
                    <input
                      type="text"
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      placeholder="Task name..."
                      autoFocus
                      className="w-full px-4 py-2 bg-black/50 border border-blue-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/50 transition-all"
                    />
                  </div>

                  {/* Assignee Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Assign To
                    </label>
                    <select
                      value={newTaskAssignee}
                      onChange={(e) => setNewTaskAssignee(e.target.value)}
                      className="w-full px-4 py-2 bg-black/50 border border-blue-500/30 rounded-lg text-white focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/50 transition-all appearance-none"
                    >
                      <option value="" disabled className="text-gray-500">
                        Select a member...
                      </option>
                      {currentWorkspace?.members.map((member) => (
                        <option
                          key={member.id}
                          value={member.id}
                          className="text-white bg-gray-900"
                        >
                          {member.username || member.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Action Buttons */}
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
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={!newTaskTitle.trim() || !newTaskAssignee.trim()}
                      className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg font-bold transition-colors"
                    >
                      Create Task
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
