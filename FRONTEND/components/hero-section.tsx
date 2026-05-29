"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Suspense } from "react";
// import { AnimatedGlobe } from "@/components/animated-globe";

const ParticleField = dynamic(
  () =>
    import("@/components/3d/particle-field").then((mod) => ({
      default: mod.ParticleField,
    })),
  {
    ssr: false,
    loading: () => <div className="absolute inset-0" />,
  },
);

export function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  };

  return (
    <div className="relative min-h-screen flex items-center justify-start overflow-hidden bg-black px-4 sm:px-8 lg:px-4">
      {/* 3D Particle Background */}
      <Suspense fallback={<div className="absolute inset-0" />}>
        <ParticleField />
      </Suspense>

      {/* Gradient Overlay Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0a0a0a] to-black opacity-70 z-5" />

      {/* Glow effects */}
      <div className="absolute top-1/4 -right-1/3 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob z-0" />
      <div className="absolute bottom-1/4 -left-1/3 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000 z-0" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-15 z-0" />

      {/* Content Container - Hard Aligned to Left via 12-Column Grid */}
      <div className="relative z-10 w-full py-20 lg:py-0 min-h-screen flex items-center justify-start">
        <motion.div
          className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* LEFT SIDE: GLOBE REMOVED */}

          {/* RIGHT SIDE: Content Column (12 Cols) */}
          <motion.div
            className="flex flex-col justify-center items-center lg:items-start text-center lg:text-left w-full lg:col-span-12 pl-0 lg:pl-4"
            variants={containerVariants}
          >
            {/* Badge */}
            <motion.div
              variants={itemVariants}
              className="inline-block mb-6 w-fit"
            >
              <div className="glass px-4 py-2 rounded-full text-sm text-blue-400 border border-blue-500/20 backdrop-blur-md">
                🚀 The Future of Note-Taking
              </div>
            </motion.div>

            {/* Main Title */}
            <motion.h1
              variants={itemVariants}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-400 to-white bg-clip-text text-transparent leading-tight"
            >
              Notes-Flow
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-xl text-gray-300 mb-8 leading-relaxed max-w-xl"
            >
              Experience note-taking redefined. Real-time synchronization,
              AI-powered insights, and stunning 3D visualization all in one
              seamless experience.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 items-center lg:items-start w-full justify-center lg:justify-start"
            >
              <Link href="/auth/signup">
                <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold flex items-center gap-2 transition-all duration-300 hover:gap-3 hover:shadow-lg hover:shadow-blue-600/50">
                  Get Started
                  <ArrowRight size={20} />
                </button>
              </Link>
              <Link href="/auth/login">
                <button className="px-8 py-3 glass text-white rounded-lg font-semibold hover:bg-opacity-80 transition-all duration-300 backdrop-blur-md border border-white/10">
                  Sign In
                </button>
              </Link>
            </motion.div>

            {/* Features Grid */}
            <motion.div
              variants={itemVariants}
              className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-xl"
            >
              {[
                { icon: "⚡", label: "Lightning Fast" },
                { icon: "🔒", label: "End-to-End Encrypted" },
                { icon: "✨", label: "3D Experience" },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="glass px-4 py-3 rounded-lg backdrop-blur-md border border-white/5 text-center lg:text-left"
                >
                  <div className="text-2xl mb-2">{feature.icon}</div>
                  <p className="text-sm text-gray-300">{feature.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
