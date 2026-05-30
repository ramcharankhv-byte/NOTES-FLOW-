"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "@/lib/store";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Chrome, Eye, EyeOff } from "lucide-react";
import dynamic from "next/dynamic";

const ParticleField = dynamic(
  () =>
    import("@/components/3d/particle-field").then((mod) => ({
      default: mod.ParticleField,
    })),
  { ssr: false },
);

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const { login, googleLogin, isLoading } = useAuthStore();
  const router = useRouter();

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const tiltX = -(y / rect.height) * 15;
    const tiltY = (x / rect.width) * 15;

    setTilt({ x: tiltX, y: tiltY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/google`,
      );
      const data = await response.json();

      if (data.data?.url) {
        window.location.href = data.data.url;
      } else {
        setError("Failed to initialize Google login");
      }
    } catch (err) {
      setError("Failed to sign in with Google");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="min-h-screen flex overflow-hidden bg-black relative">
      {/* Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="blob blob-1 absolute top-[10%] left-[10%] w-96 h-96 bg-blue-600 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob" />
        <div className="blob blob-2 absolute bottom-[10%] right-[10%] w-96 h-96 bg-cyan-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
      </div>

      {/* LEFT SIDE: 3D Visual Component */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="hidden lg:flex lg:w-1/2 relative items-center justify-center overflow-hidden"
      >
        <style>{`
          @keyframes float {
            0% { transform: translateY(0px) scale(1); }
            100% { transform: translateY(50px) scale(1.1); }
          }
          @keyframes gentle-float {
            0% { transform: translateY(0px); }
            100% { transform: translateY(-15px); }
          }
          .animate-blob {
            animation: float 10s infinite ease-in-out alternate;
          }
          .animation-delay-2000 {
            animation-delay: -5s;
          }
          .animated-float {
            animation: gentle-float 6s ease-in-out infinite alternate;
          }
          .animated-float-delayed {
            animation: gentle-float 8s ease-in-out infinite alternate-reverse;
          }
          .glass {
            background: rgba(255, 255, 255, 0.03);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid rgba(255, 255, 255, 0.05);
          }
          .glow-border {
            position: relative;
          }
          .glow-border::before {
            content: "";
            position: absolute;
            inset: -1px;
            border-radius: inherit;
            padding: 1px;
            background: linear-gradient(45deg, rgba(59, 130, 246, 0.5), transparent, rgba(6, 182, 212, 0.5));
            -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            -webkit-mask-composite: xor;
            mask-composite: exclude;
            pointer-events: none;
          }
        `}</style>

        <div
          className="perspective relative w-full h-full flex items-center justify-center"
          style={{
            perspective: "1000px",
            transformStyle: "preserve-3d",
          }}
        >
          <div
            style={{
              transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
              transition: "transform 0.1s ease-out",
              transformStyle: "preserve-3d",
            }}
            className="w-full h-full flex items-center justify-center"
          >
            {/* Central Glass Pane */}
            <div className="absolute w-[80%] h-[70%] glass rounded-3xl glow-border flex flex-col p-6 animated-float shadow-2xl shadow-blue-900/40">
              {/* Mock Header */}
              <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                <div className="w-48 h-4 bg-white/5 rounded mx-auto"></div>
              </div>

              {/* Mock Content Area */}
              <div className="flex-1 grid grid-cols-3 gap-4">
                <div className="col-span-1 space-y-3">
                  <div className="h-20 w-full bg-white/5 rounded-xl border border-white/5"></div>
                  <div className="h-20 w-full bg-blue-500/10 rounded-xl border border-blue-400/20 shadow-[0_0_15px_rgba(59,130,246,0.2)]"></div>
                  <div className="h-20 w-full bg-white/5 rounded-xl border border-white/5"></div>
                </div>
                <div className="col-span-2 bg-gradient-to-br from-white/5 to-transparent rounded-xl border border-white/5 p-4 flex flex-col gap-3">
                  <div className="w-3/4 h-6 bg-white/10 rounded"></div>
                  <div className="w-full h-3 bg-white/5 rounded mt-4"></div>
                  <div className="w-full h-3 bg-white/5 rounded"></div>
                  <div className="w-5/6 h-3 bg-white/5 rounded"></div>
                </div>
              </div>
            </div>

            {/* Floating Kanban Card */}
            <div className="absolute bottom-10 right-0 w-64 glass rounded-2xl p-4 glow-border animated-float-delayed shadow-2xl shadow-blue-900/40">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_8px_#60a5fa]"></div>
                <span className="text-xs font-semibold text-blue-300 uppercase tracking-wider">
                  In Progress
                </span>
              </div>
              <div className="text-sm font-medium text-white mb-4">
                Design Hero Component
              </div>
              <div className="flex justify-between items-center">
                <div className="flex -space-x-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 border border-black"></div>
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-purple-400 to-pink-500 border border-black"></div>
                </div>
                <div className="text-xs text-gray-400">May 29</div>
              </div>
            </div>

            {/* Floating Note Widget */}
            <div className="absolute top-10 left-0 w-56 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-4 animated-float shadow-2xl">
              <div className="w-full h-2 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full mb-4"></div>
              <div className="space-y-2">
                <div className="h-2 w-full bg-white/20 rounded"></div>
                <div className="h-2 w-4/5 bg-white/10 rounded"></div>
                <div className="h-2 w-3/4 bg-white/10 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12 relative z-10">
        <motion.div
          className="w-full max-w-md"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div
            variants={itemVariants}
            className="text-center mb-8 sm:mb-10"
          >
            <Link
              href="/"
              className="inline-block text-xl sm:text-2xl font-black mb-6 sm:mb-8"
            >
              Notes
              <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                Flow
              </span>
            </Link>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-3">
              Welcome Back
            </h1>
            <p className="text-sm sm:text-base text-gray-400">
              Sign in to your account to continue
            </p>
          </motion.div>

          {/* Form */}
          <motion.form
            variants={itemVariants}
            onSubmit={handleSubmit}
            className="glass rounded-2xl p-6 sm:p-8 space-y-4 sm:space-y-6 border border-blue-400/20"
          >
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/30 text-red-400 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-xs sm:text-sm flex items-center gap-2"
              >
                <div className="w-2 h-2 bg-red-400 rounded-full flex-shrink-0" />
                {error}
              </motion.div>
            )}

            {/* Google Sign In */}
            <motion.button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full px-4 py-2 sm:py-3 bg-white hover:bg-gray-100 disabled:bg-gray-300 text-black rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <Chrome size={18} />
              {isGoogleLoading ? "Signing in..." : "Continue with Google"}
            </motion.button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-2 sm:px-3 bg-black/50 text-gray-400 text-xs sm:text-sm">
                  Or continue with email
                </span>
              </div>
            </div>

            {/* Email Input */}
            <motion.div variants={itemVariants}>
              <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-black/50 border border-blue-500/30 rounded-lg text-white placeholder-gray-500 text-sm sm:text-base focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/50 transition-all"
                required
              />
            </motion.div>

            {/* Password Input */}
            <motion.div variants={itemVariants}>
              <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-black/50 border border-blue-500/30 rounded-lg text-white placeholder-gray-500 text-sm sm:text-base focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/50 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              variants={itemVariants}
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full px-4 py-2 sm:py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg font-bold transition-all flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-blue-600/50 text-sm sm:text-base"
            >
              {isLoading ? "Signing in..." : "Sign In"}
              {!isLoading && (
                <ArrowRight size={18} className="hidden sm:block" />
              )}
            </motion.button>
          </motion.form>

          {/* Footer */}
          <motion.div variants={itemVariants} className="text-center mt-6">
            <p className="text-sm sm:text-base text-gray-400">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/signup"
                className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
              >
                Sign up
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
