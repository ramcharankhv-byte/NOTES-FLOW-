'use client'

import { useWorkspaceStore } from '@/lib/store'
import { useState } from 'react'
import { Plus, Trash2, Edit2 } from 'lucide-react'
import { motion } from 'framer-motion'

export function Sidebar() {
  const { workspaces, currentWorkspace, selectWorkspace, createWorkspace, deleteWorkspace } = useWorkspaceStore()
  const [showNewWorkspace, setShowNewWorkspace] = useState(false)
  const [newName, setNewName] = useState('')
  const [newDescription, setNewDescription] = useState('')

  const handleCreate = async () => {
    if (newName.trim()) {
      await createWorkspace(newName, newDescription)
      setNewName('')
      setNewDescription('')
      setShowNewWorkspace(false)
    }
  }

  return (
    <div className="w-64 glass border-r border-blue-500/10 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-blue-500/10">
        <h2 className="text-white font-semibold mb-4">Workspaces</h2>
        <button
          onClick={() => setShowNewWorkspace(!showNewWorkspace)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-600/20 hover:bg-blue-600/30 rounded-lg text-blue-400 transition-colors text-sm font-medium"
        >
          <Plus size={16} />
          New Workspace
        </button>
      </div>

      {/* New Workspace Form */}
      {showNewWorkspace && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 border-b border-blue-500/10 space-y-3"
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
                setShowNewWorkspace(false)
                setNewName('')
                setNewDescription('')
              }}
              className="flex-1 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white text-sm font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      )}

      {/* Workspaces List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {workspaces.map((workspace) => (
          <motion.div
            key={workspace.id}
            whileHover={{ x: 4 }}
            className={`p-3 rounded-lg cursor-pointer transition-all group ${
              currentWorkspace?.id === workspace.id
                ? 'bg-blue-600/20 border border-blue-500/30'
                : 'hover:bg-blue-600/10'
            }`}
            onClick={() => selectWorkspace(workspace)}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-medium text-sm truncate">{workspace.name}</h3>
                <p className="text-gray-500 text-xs truncate">{workspace.description}</p>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-1 hover:bg-blue-600/20 rounded transition-colors">
                  <Edit2 size={14} className="text-gray-400" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteWorkspace(workspace.id)
                  }}
                  className="p-1 hover:bg-red-600/20 rounded transition-colors"
                >
                  <Trash2 size={14} className="text-gray-400" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
