'use client'

import { useAuthStore } from '@/lib/store'
import { Navbar } from '@/components/navbar'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, LogOut, Mail, User } from 'lucide-react'

export default function ProfilePage() {
  const { user, logout, isAuthenticated } = useAuthStore()
  const router = useRouter()

  if (!isAuthenticated) {
    router.push('/auth/login')
    return null
  }

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      
      <div className="flex-1 p-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-2xl mx-auto"
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 px-4 py-2 hover:bg-blue-600/10 rounded-lg transition-colors text-gray-400 hover:text-white mb-6"
            >
              <ArrowLeft size={20} />
              Back
            </button>
            <h1 className="text-4xl font-bold text-white">Profile Settings</h1>
          </motion.div>

          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-lg p-8 mb-8"
          >
            <div className="flex items-center gap-6 mb-8">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-center text-white text-4xl font-bold">
                {user?.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{user?.name}</h2>
                <p className="text-gray-400">{user?.email}</p>
              </div>
            </div>

            {/* Profile Info */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 p-4 bg-black/50 rounded-lg border border-blue-500/10">
                <User size={20} className="text-blue-400" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Name</p>
                  <p className="text-white font-medium">{user?.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-black/50 rounded-lg border border-blue-500/10">
                <Mail size={20} className="text-blue-400" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-white font-medium">{user?.email}</p>
                </div>
              </div>
            </div>

            {/* Account Settings */}
            <div className="border-t border-blue-500/10 pt-8">
              <h3 className="text-lg font-semibold text-white mb-4">Account</h3>
              <div className="space-y-3">
                <button className="w-full px-4 py-3 bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/20 rounded-lg text-blue-400 font-medium transition-colors text-left">
                  Change Password
                </button>
                <button className="w-full px-4 py-3 bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/20 rounded-lg text-blue-400 font-medium transition-colors text-left">
                  Two-Factor Authentication
                </button>
                <button className="w-full px-4 py-3 bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/20 rounded-lg text-blue-400 font-medium transition-colors text-left">
                  Connected Devices
                </button>
              </div>
            </div>
          </motion.div>

          {/* Preferences */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-lg p-8 mb-8"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Preferences</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-black/50 rounded-lg">
                <div>
                  <p className="text-white font-medium">Theme</p>
                  <p className="text-sm text-gray-400">Dark mode is enabled</p>
                </div>
                <div className="w-12 h-6 bg-blue-600 rounded-full" />
              </div>
              <div className="flex items-center justify-between p-4 bg-black/50 rounded-lg">
                <div>
                  <p className="text-white font-medium">Notifications</p>
                  <p className="text-sm text-gray-400">Email notifications enabled</p>
                </div>
                <div className="w-12 h-6 bg-blue-600 rounded-full" />
              </div>
            </div>
          </motion.div>

          {/* Danger Zone */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-lg p-8 border-l-4 border-red-500"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Danger Zone</h3>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
            >
              <LogOut size={20} />
              Logout
            </button>
            <p className="text-xs text-gray-500 mt-3">
              You will be logged out of all devices
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
