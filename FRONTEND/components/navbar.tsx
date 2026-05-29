'use client'

import { useAuthStore } from '@/lib/store'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LogOut, Plus, Settings } from 'lucide-react'
import { useState } from 'react'

export function Navbar() {
  const { user, logout } = useAuthStore()
  const router = useRouter()
  const [showMenu, setShowMenu] = useState(false)

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <nav className="glass border-b border-blue-500/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/dashboard" className="text-xl font-bold text-white">
            Notes-Flow
          </Link>

          {/* Center - Search/Add */}
          <div className="hidden md:flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 rounded-lg text-blue-400 transition-colors">
              <Plus size={18} />
              New Note
            </button>
          </div>

          {/* Right - User Menu */}
          <div className="flex items-center gap-4 relative">
            <Link
              href="/dashboard/profile"
              className="p-2 hover:bg-blue-600/10 rounded-lg transition-colors"
            >
              <Settings size={20} className="text-gray-400" />
            </Link>

            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-blue-600/10 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-center text-white text-sm font-semibold">
                {user?.name.charAt(0).toUpperCase()}
              </div>
            </button>

            {/* Dropdown Menu */}
            {showMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 glass rounded-lg overflow-hidden shadow-xl">
                <div className="px-4 py-3 border-b border-blue-500/10">
                  <p className="text-white font-semibold text-sm">{user?.name}</p>
                  <p className="text-gray-400 text-xs">{user?.email}</p>
                </div>
                <Link
                  href="/dashboard/profile"
                  className="w-full px-4 py-3 text-gray-300 hover:bg-blue-600/10 flex items-center gap-2 transition-colors block"
                >
                  <Settings size={18} />
                  Profile Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-3 text-red-400 hover:bg-red-500/10 flex items-center gap-2 transition-colors"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
