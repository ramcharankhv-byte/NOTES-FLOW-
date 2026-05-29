'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/lib/store'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const ParticleField = dynamic(() => import('@/components/3d/particle-field').then(mod => ({ default: mod.ParticleField })), {
  ssr: false,
  loading: () => <div className="absolute inset-0" />
})

export default function CompleteSignupPage() {
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const { googleSignup, isLoading } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!token) {
      router.push('/auth/signup')
    }
  }, [token, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!username || username.length < 3) {
      setError('Username must be at least 3 characters')
      return
    }

    if (!/^[a-z0-9_]*$/.test(username.toLowerCase())) {
      setError('Username can only contain lowercase letters, numbers, and underscores')
      return
    }

    try {
      await googleSignup(token!, username)
      router.push('/dashboard')
    } catch (err) {
      setError('Failed to complete signup')
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  return (
    <div className="min-h-screen flex overflow-hidden bg-black">
      {/* LEFT SIDE - 3D Animated Background */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center">
        {/* 3D Particle Background */}
        <Suspense fallback={<div className="absolute inset-0" />}>
          <ParticleField />
        </Suspense>

        {/* Radial gradient glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-blue-900/30 to-black pointer-events-none" />

        {/* Animated blobs */}
        <div className="absolute top-1/4 -right-1/4 w-96 h-96 bg-blue-600 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob" />
        <div className="absolute bottom-1/4 -left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-2000" />

        {/* Content overlay */}
        <motion.div
          className="relative z-10 text-center max-w-md px-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2 className="text-4xl font-black mb-4 bg-gradient-to-r from-white to-blue-300 bg-clip-text text-transparent">
            Choose Your Identity
          </h2>
          <p className="text-gray-300 mb-8">
            Create a unique username to complete your Notes-Flow account
          </p>
          <div className="space-y-3">
            {['Fast signup', 'Secure account', 'Ready to collaborate'].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-3 text-gray-300"
              >
                <div className="w-2 h-2 bg-blue-400 rounded-full" />
                {feature}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* RIGHT SIDE - Complete Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-12">
        <motion.div
          className="w-full max-w-md"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-10">
            <Link href="/" className="inline-block text-2xl font-black text-white mb-8">
              Notes<span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">Flow</span>
            </Link>
            <h1 className="text-3xl font-bold text-white mb-2">Choose Your Username</h1>
            <p className="text-gray-400">Complete your profile setup</p>
          </motion.div>

          {/* Form */}
          <motion.form
            variants={itemVariants}
            onSubmit={handleSubmit}
            className="glass rounded-2xl p-8 space-y-6 border border-blue-400/20"
          >
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm flex items-center gap-2"
              >
                <div className="w-2 h-2 bg-red-400 rounded-full" />
                {error}
              </motion.div>
            )}

            {/* Username Input */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase())}
                placeholder="your_username"
                autoFocus
                className="w-full px-4 py-3 bg-black/50 border border-blue-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/50 transition-all"
                required
              />
              <p className="text-xs text-gray-500 mt-2">
                3-20 characters. Lowercase letters, numbers, and underscores only.
              </p>
            </motion.div>

            {/* Info Box */}
            <motion.div
              variants={itemVariants}
              className="p-4 bg-blue-500/10 border border-blue-400/20 rounded-lg"
            >
              <p className="text-sm text-gray-300">
                <span className="font-semibold text-blue-300">💡 Tip:</span> Your username will be used to identify you in shared workspaces and can be changed anytime in settings.
              </p>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              variants={itemVariants}
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg font-bold transition-all flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-blue-600/50"
            >
              {isLoading ? 'Setting up...' : 'Complete Setup'}
              {!isLoading && <ArrowRight size={18} />}
            </motion.button>
          </motion.form>

          {/* Footer */}
          <motion.div variants={itemVariants} className="text-center mt-6">
            <p className="text-gray-400 text-sm">
              Changed your mind?{' '}
              <Link href="/auth/signup" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
                Go back
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
