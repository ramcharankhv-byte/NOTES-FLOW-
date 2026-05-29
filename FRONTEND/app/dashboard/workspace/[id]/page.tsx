'use client'

import { useEffect, useState } from 'react'
import { useNoteStore, useWorkspaceStore } from '@/lib/store'
import { Navbar } from '@/components/navbar'
import { Sidebar } from '@/components/sidebar'
import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Plus, Trash2, Edit2 } from 'lucide-react'

export default function WorkspaceNotesPage() {
  const params = useParams()
  const workspaceId = params.id as string
  const { notes, fetchNotes, createNote } = useNoteStore()
  const { currentWorkspace, workspaces, selectWorkspace } = useWorkspaceStore()
  const [showNewNote, setShowNewNote] = useState(false)
  const [noteTitle, setNoteTitle] = useState('')
  const router = useRouter()

  useEffect(() => {
    if (workspaceId) {
      // Find and select the workspace
      const workspace = workspaces.find(w => w.id === workspaceId)
      if (workspace) {
        selectWorkspace(workspace)
        fetchNotes(workspaceId)
      }
    }
  }, [workspaceId, workspaces, selectWorkspace, fetchNotes])

  const handleCreateNote = async () => {
    if (noteTitle.trim() && currentWorkspace) {
      await createNote(noteTitle, '', currentWorkspace.id)
      setNoteTitle('')
      setShowNewNote(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Header */}
            <motion.div variants={itemVariants} className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white">
                  {currentWorkspace?.name}
                </h1>
                <p className="text-gray-400 mt-1">{currentWorkspace?.description}</p>
              </div>
              <button
                onClick={() => setShowNewNote(!showNewNote)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
              >
                <Plus size={20} />
                New Note
              </button>
            </motion.div>

            {/* New Note Form */}
            {showNewNote && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-lg p-6 mb-8"
              >
                <input
                  type="text"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  placeholder="Enter note title..."
                  className="w-full px-4 py-2 bg-black/50 border border-blue-500/20 rounded-lg text-white placeholder-gray-500 text-lg font-semibold focus:outline-none focus:border-blue-500 mb-4"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleCreateNote}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors"
                  >
                    Create
                  </button>
                  <button
                    onClick={() => {
                      setShowNewNote(false)
                      setNoteTitle('')
                    }}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}

            {/* Notes Grid */}
            {notes.length > 0 ? (
              <motion.div
                variants={itemVariants}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {notes.map((note) => (
                  <motion.div
                    key={note.id}
                    whileHover={{ y: -4 }}
                    className="glass rounded-lg p-6 cursor-pointer group hover:border-blue-500/50 transition-all"
                    onClick={() => router.push(`/dashboard/note/${note.id}`)}
                  >
                    <h3 className="text-white font-semibold text-lg mb-2 truncate">
                      {note.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {note.content || 'No content yet'}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {new Date(note.updatedAt).toLocaleDateString()}
                      </span>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1 hover:bg-blue-600/20 rounded transition-colors">
                          <Edit2 size={14} className="text-gray-400" />
                        </button>
                        <button className="p-1 hover:bg-red-600/20 rounded transition-colors">
                          <Trash2 size={14} className="text-gray-400" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                variants={itemVariants}
                className="glass rounded-lg p-12 text-center"
              >
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-blue-600/10 rounded-full">
                    <Plus size={32} className="text-blue-400" />
                  </div>
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">
                  No notes yet
                </h3>
                <p className="text-gray-400 mb-6">
                  Create your first note to get started
                </p>
                <button
                  onClick={() => setShowNewNote(true)}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                >
                  Create Your First Note
                </button>
              </motion.div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  )
}
