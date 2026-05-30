"use client";

import { useState, useEffect } from "react";
import { useNotesStore, Note } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, Trash2, Edit2, X } from "lucide-react";

interface NotesGridProps {
  workspaceId: string;
}

export function NotesGrid({ workspaceId }: NotesGridProps) {
  const {
    notes,
    currentNote,
    selectNote,
    createNote,
    updateNote,
    deleteNote,
    searchNotes,
    fetchNotes,
  } = useNotesStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteContent, setNewNoteContent] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);

  useEffect(() => {
    fetchNotes(workspaceId);
  }, [workspaceId, fetchNotes]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      await searchNotes(workspaceId, query);
    }
  };

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteTitle.trim()) return;

    await createNote(workspaceId, newNoteTitle, newNoteContent);
    setNewNoteTitle("");
    setNewNoteContent("");
    setIsCreateModalOpen(false);
  };

  const handleUpdateNote = async (
    noteId: string,
    title: string,
    content: string,
  ) => {
    await updateNote(noteId, title, content);
    setEditingNoteId(null);
  };

  const handleDeleteNote = async (noteId: string) => {
    await deleteNote(noteId);
  };

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex-1 relative min-w-0">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 sm:py-3 bg-black/50 border border-blue-400/20 rounded-lg text-white placeholder-gray-500 text-sm sm:text-base focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/50 transition-all"
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsCreateModalOpen(true)}
          className="w-full sm:w-auto px-4 py-2 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:shadow-blue-600/50 text-sm sm:text-base"
        >
          <Plus size={18} />
          <span>New Note</span>
        </motion.button>
      </div>

      {/* Notes Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
      >
        <AnimatePresence>
          {filteredNotes.length > 0 ? (
            filteredNotes.map((note) => (
              <motion.div
                key={note.id}
                layoutId={note.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -4, scale: 1.02 }}
                onClick={() => selectNote(note.id)}
                className="group glass rounded-lg p-4 sm:p-5 cursor-pointer border border-blue-400/20 hover:border-blue-400/60 transition-all min-h-[180px] sm:min-h-[200px] flex flex-col"
              >
                {/* Title */}
                <h3 className="text-white font-bold text-base sm:text-lg mb-2 line-clamp-2 group-hover:text-blue-300 transition-colors">
                  {note.title}
                </h3>

                {/* Content Preview */}
                <p className="text-gray-400 text-xs sm:text-sm flex-1 line-clamp-3 mb-3 sm:mb-4">
                  {note.content.replace(/^#+\s+/gm, "").substring(0, 100)}...
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-blue-400/10">
                  <span className="text-xs text-gray-500">
                    {new Date(note.updatedAt).toLocaleDateString()}
                  </span>

                  {/* Action Buttons */}
                  <div className="flex gap-1 sm:gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingNoteId(note.id);
                      }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-1 sm:p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-600/20 rounded transition-colors"
                    >
                      <Edit2 size={14} />
                    </motion.button>
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteNote(note.id);
                      }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-1 sm:p-2 text-gray-400 hover:text-red-400 hover:bg-red-600/20 rounded transition-colors"
                    >
                      <Trash2 size={14} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full glass rounded-lg p-8 sm:p-12 text-center border border-blue-400/10"
            >
              <p className="text-gray-400 mb-6 text-sm sm:text-base">
                {searchQuery
                  ? "No notes found"
                  : "No notes yet. Create your first note to get started!"}
              </p>
              {!searchQuery && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsCreateModalOpen(true)}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold flex items-center gap-2 mx-auto transition-all"
                >
                  <Plus size={18} />
                  Create Note
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Create/Edit Modal */}
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
              <div className="glass rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-blue-400/20">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Create Note</h2>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsCreateModalOpen(false)}
                    className="p-2 text-gray-400 hover:text-white hover:bg-blue-600/20 rounded-lg transition-colors"
                  >
                    <X size={20} />
                  </motion.button>
                </div>

                <form onSubmit={handleCreateNote} className="space-y-4">
                  {/* Title Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={newNoteTitle}
                      onChange={(e) => setNewNoteTitle(e.target.value)}
                      placeholder="Note title..."
                      autoFocus
                      className="w-full px-4 py-2 bg-black/50 border border-blue-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/50 transition-all"
                    />
                  </div>

                  {/* Content Editor */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Content
                    </label>
                    <textarea
                      value={newNoteContent}
                      onChange={(e) => setNewNoteContent(e.target.value)}
                      placeholder="Write your note... (supports Markdown)"
                      rows={8}
                      className="w-full px-4 py-2 bg-black/50 border border-blue-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/50 transition-all font-mono text-sm"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Markdown supported
                    </p>
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
                      disabled={!newNoteTitle.trim()}
                      className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg font-bold transition-colors"
                    >
                      Create Note
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
