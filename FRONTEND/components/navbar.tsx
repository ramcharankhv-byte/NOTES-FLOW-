"use client";

import { useAuthStore } from "@/lib/store";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Plus, Settings, Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handleNewNote = () => {
    // Navigate to create new note
    router.push("/dashboard/note/new");
    setShowMobileMenu(false);
  };

  return (
    <nav className="glass border-b border-blue-500/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            href="/dashboard"
            className="text-lg sm:text-xl font-bold text-white truncate mr-4"
          >
            Notes-Flow
          </Link>

          {/* Center - Search/Add (Desktop) */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={handleNewNote}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 rounded-lg text-blue-400 transition-colors whitespace-nowrap"
            >
              <Plus size={18} />
              New Note
            </button>
          </div>

          {/* Right - User Menu and Mobile Toggle */}
          <div className="flex items-center gap-2 sm:gap-4 relative">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 hover:bg-blue-600/10 rounded-lg transition-colors"
            >
              {showMobileMenu ? (
                <X size={20} className="text-gray-400" />
              ) : (
                <Menu size={20} className="text-gray-400" />
              )}
            </button>

            {/* Desktop Menu Items */}
            <Link
              href="/dashboard/profile"
              className="hidden sm:block p-2 hover:bg-blue-600/10 rounded-lg transition-colors"
            >
              <Settings size={20} className="text-gray-400" />
            </Link>

            {/* User Avatar with Dropdown */}
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-2 px-2 sm:px-3 py-2 rounded-lg hover:bg-blue-600/10 transition-colors"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-center text-white text-xs sm:text-sm font-semibold">
                {user?.name.charAt(0).toUpperCase()}
              </div>
              <span className="hidden sm:inline text-sm text-gray-300 truncate max-w-[100px]">
                {user?.name}
              </span>
            </button>

            {/* Desktop Dropdown Menu */}
            <AnimatePresence>
              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 top-full mt-2 w-48 sm:w-56 glass rounded-lg overflow-hidden shadow-xl"
                >
                  <div className="px-4 py-3 border-b border-blue-500/10">
                    <p className="text-white font-semibold text-sm truncate">
                      {user?.name}
                    </p>
                    <p className="text-gray-400 text-xs truncate">
                      {user?.email}
                    </p>
                  </div>
                  <Link
                    href="/dashboard/profile"
                    className="w-full px-4 py-3 text-gray-300 hover:bg-blue-600/10 flex items-center gap-2 transition-colors block"
                    onClick={() => setShowMenu(false)}
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
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {showMobileMenu && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-blue-500/10 bg-black/40"
            >
              <div className="px-4 py-3 space-y-2 flex flex-col">
                <button
                  onClick={handleNewNote}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 rounded-lg text-blue-400 transition-colors text-sm font-medium"
                >
                  <Plus size={16} />
                  New Note
                </button>
                <Link
                  href="/dashboard/profile"
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 hover:bg-blue-600/10 rounded-lg text-gray-300 transition-colors text-sm font-medium"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <Settings size={16} />
                  Profile Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 hover:bg-red-500/10 rounded-lg text-red-400 transition-colors text-sm font-medium"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
