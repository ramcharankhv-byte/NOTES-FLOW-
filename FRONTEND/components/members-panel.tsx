'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Plus, Trash2, Mail, X } from 'lucide-react'
import { User } from '@/lib/store'

interface MembersPanelProps {
  members: User[]
  currentUserId: string
  workspaceOwnerId: string
  isOwner: boolean
  isLoading?: boolean
  onAddMember: (email: string) => Promise<void>
  onRemoveMember: (memberId: string) => Promise<void>
}

export function MembersPanel({
  members,
  currentUserId,
  workspaceOwnerId,
  isOwner,
  isLoading = false,
  onAddMember,
  onRemoveMember,
}: MembersPanelProps) {
  const [showAddMemberModal, setShowAddMemberModal] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [isInviting, setIsInviting] = useState(false)
  const [inviteError, setInviteError] = useState('')
  const [removingMemberId, setRemovingMemberId] = useState<string | null>(null)

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault()
    setInviteError('')

    if (!inviteEmail.trim()) {
      setInviteError('Email is required')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inviteEmail)) {
      setInviteError('Please enter a valid email address')
      return
    }

    if (members.some((m) => m.email === inviteEmail)) {
      setInviteError('This member is already in the workspace')
      return
    }

    setIsInviting(true)
    try {
      await onAddMember(inviteEmail)
      setInviteEmail('')
      setShowAddMemberModal(false)
    } catch (error) {
      setInviteError('Failed to add member. Please try again.')
    } finally {
      setIsInviting(false)
    }
  }

  const handleRemoveMember = async (memberId: string) => {
    if (memberId === currentUserId) {
      return
    }

    setRemovingMemberId(memberId)
    try {
      await onRemoveMember(memberId)
    } finally {
      setRemovingMemberId(null)
    }
  }

  return (
    <div className="space-y-4">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users size={20} className="text-blue-400" />
          <h3 className="text-lg font-bold text-white">Members</h3>
          <span className="ml-2 px-2 py-1 bg-blue-600/20 text-blue-300 rounded-full text-xs font-medium">
            {members.length}
          </span>
        </div>
        {isOwner && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddMemberModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-lg font-medium transition-colors"
          >
            <Plus size={16} />
            Add Member
          </motion.button>
        )}
      </div>

      {/* Members List */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        <AnimatePresence>
          {members.length > 0 ? (
            members.map((member) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center justify-between p-3 bg-black/50 rounded-lg border border-blue-400/10 hover:border-blue-400/30 transition-all"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-300 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {member.username?.charAt(0).toUpperCase() || member.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-white truncate">{member.username || member.name}</p>
                    <p className="text-xs text-gray-500 truncate">{member.email}</p>
                  </div>
                </div>

                {/* Role/Status */}
                <div className="flex items-center gap-3">
                  {member.id === workspaceOwnerId ? (
                    <span className="px-3 py-1 bg-yellow-600/20 text-yellow-300 rounded-full text-xs font-medium">
                      Owner
                    </span>
                  ) : member.id === currentUserId ? (
                    <span className="px-3 py-1 bg-green-600/20 text-green-300 rounded-full text-xs font-medium">
                      You
                    </span>
                  ) : null}

                  {/* Remove Button */}
                  {isOwner && member.id !== workspaceOwnerId && member.id !== currentUserId && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleRemoveMember(member.id)}
                      disabled={removingMemberId === member.id}
                      className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-600/10 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {removingMemberId === member.id ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          <Trash2 size={16} />
                        </motion.div>
                      ) : (
                        <Trash2 size={16} />
                      )}
                    </motion.button>
                  )}
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400">No members in this workspace yet</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Add Member Modal */}
      <AnimatePresence>
        {showAddMemberModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowAddMemberModal(false)
                setInviteError('')
              }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none"
            >
              <div className="glass rounded-2xl p-8 max-w-md w-full border border-blue-400/20 pointer-events-auto">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Invite Member</h2>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      setShowAddMemberModal(false)
                      setInviteError('')
                    }}
                    className="p-2 text-gray-400 hover:text-white hover:bg-blue-600/20 rounded-lg transition-colors"
                  >
                    <X size={20} />
                  </motion.button>
                </div>

                <form onSubmit={handleAddMember} className="space-y-4">
                  {inviteError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm flex items-center gap-2"
                    >
                      <div className="w-2 h-2 bg-red-400 rounded-full" />
                      {inviteError}
                    </motion.div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="email"
                        value={inviteEmail}
                        onChange={(e) => {
                          setInviteEmail(e.target.value)
                          setInviteError('')
                        }}
                        placeholder="colleague@example.com"
                        autoFocus
                        disabled={isInviting}
                        className="w-full pl-10 pr-4 py-3 bg-black/50 border border-blue-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/50 transition-all disabled:opacity-50"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">They&apos;ll receive an invitation to join this workspace</p>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setShowAddMemberModal(false)
                        setInviteError('')
                      }}
                      disabled={isInviting}
                      className="flex-1 px-4 py-2 border border-blue-400/30 text-white rounded-lg font-medium hover:bg-blue-400/10 transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      type="submit"
                      disabled={isInviting || !inviteEmail.trim()}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg font-bold transition-colors"
                    >
                      {isInviting ? 'Inviting...' : 'Send Invite'}
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
