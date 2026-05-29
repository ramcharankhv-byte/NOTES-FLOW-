'use client'

import { useEffect, useState } from 'react'
import { useNoteStore } from '@/lib/store'
import { Navbar } from '@/components/navbar'
import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Trash2, Save } from 'lucide-react'

export default function NoteEditorPage() {
  const params = useParams()
  const noteId = params.id as string
  const { notes, currentNote, selectNote, updateNote, deleteNote } = useNoteStore()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const note = notes.find(n => n.id === noteId)
    if (note) {
      selectNote(note)
      setTitle(note.title)
      setContent(note.content)
    } else {
      router.push('/dashboard')
    }
  }, [noteId, notes, selectNote, router])

  const handleSave = async () => {
    if (currentNote) {
      setIsSaving(true)
      await updateNote(currentNote.id, {
        title: title || 'Untitled',
        content,
      })
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (currentNote && confirm('Are you sure you want to delete this note?')) {
      await deleteNote(currentNote.id)
      router.back()
    }
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      
      <div className="flex-1 p-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 px-4 py-2 hover:bg-blue-600/10 rounded-lg transition-colors text-gray-400 hover:text-white"
            >
              <ArrowLeft size={20} />
              Back
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
              >
                <Save size={18} />
                {isSaving ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg font-semibold transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>

          {/* Editor */}
          <div className="space-y-4">
            {/* Title */}
            <motion.input
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note title..."
              className="w-full text-4xl font-bold bg-transparent border-none text-white placeholder-gray-600 focus:outline-none"
            />

            {/* Tags */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex gap-2 flex-wrap"
            >
              {currentNote?.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </motion.div>

            {/* Editor Area */}
            <motion.textarea
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start writing your note..."
              className="w-full min-h-96 bg-transparent border border-blue-500/20 rounded-lg px-6 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 resize-vertical"
            />

            {/* Meta Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex justify-between text-xs text-gray-500 pt-4"
            >
              <span>
                Created: {currentNote && new Date(currentNote.createdAt).toLocaleString()}
              </span>
              <span>
                Updated: {currentNote && new Date(currentNote.updatedAt).toLocaleString()}
              </span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
