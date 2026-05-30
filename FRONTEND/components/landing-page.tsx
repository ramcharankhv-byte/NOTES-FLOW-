"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Zap, Lock, Sparkles } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Suspense, useRef } from "react";
// import { AnimatedGlobe } from "./animated-globe";

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

export function LandingPage() {
  const containerRef = useRef(null);
  const { scrollY } = useScroll();

  const scale = useTransform(scrollY, [0, 300], [1, 0.95]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.8]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
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
    <main className="bg-black overflow-x-hidden text-left" ref={containerRef}>
      {/* HERO SECTION */}
      <section className="relative min-h-screen overflow-hidden flex items-center justify-start px-4 sm:px-6 lg:px-8">
        {/* PARTICLE BACKGROUND */}
        <Suspense fallback={<div className="absolute inset-0" />}>
          <ParticleField />
        </Suspense>

        {/* BACKGROUND GRADIENT */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-blue-950/30 to-black pointer-events-none" />

        {/* GLOW BLOBS - Scaled down for mobile */}
        <div className="absolute top-1/4 -right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-blue-600 rounded-full blur-3xl opacity-20 animate-blob" />
        <div className="absolute bottom-1/4 -left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-cyan-500 rounded-full blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-48 sm:w-96 h-48 sm:h-96 bg-blue-400 rounded-full blur-3xl opacity-10 animate-blob animation-delay-4000" />

        {/* MAIN CONTENT WRAPPER */}
        <div className="relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center min-h-screen py-12 sm:py-0">
            {/* LEFT SIDE: GLOBE REMOVED */}

            {/* RIGHT SIDE: Text Data and Badges Layout (12 out of 12 Columns) */}
            <motion.div
              className="text-center lg:col-span-12 flex flex-col justify-center items-center px-2 sm:px-0"
              style={{ scale, opacity }}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* BADGE */}
              <motion.div
                variants={itemVariants}
                className="inline-block mb-6 sm:mb-8"
              >
                <div className="glass px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm text-blue-300 border border-blue-400/30 backdrop-blur-md">
                  Collaborate • Organize • Flow
                </div>
              </motion.div>

              {/* TITLE */}
              <motion.div
                variants={itemVariants}
                className="mb-4 sm:mb-6 flex flex-col items-center lg:items-start select-none"
              >
                <h1 className="text-4xl xs:text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black bg-gradient-to-b from-white via-blue-200 to-blue-400 bg-clip-text text-transparent tracking-tighter leading-tight xs:leading-none">
                  NOTES
                </h1>
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="text-4xl xs:text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black bg-gradient-to-b from-blue-400 via-cyan-300 to-white bg-clip-text text-transparent tracking-tighter leading-tight xs:leading-none"
                >
                  FLOW
                </motion.div>
              </motion.div>

              {/* DESCRIPTION */}
              <motion.p
                variants={itemVariants}
                className="text-base sm:text-lg lg:text-xl text-gray-300 mb-8 sm:mb-10 max-w-2xl leading-relaxed px-2 sm:px-0"
              >
                The collaborative workspace platform built for modern teams.
                Manage tasks, notes, and teamwork in one futuristic interface.
              </motion.p>

              {/* BUTTONS */}
              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center mb-8 sm:mb-12 w-full px-2 sm:px-0"
              >
                <Link href="/auth/signup" className="w-full sm:w-auto">
                  <button className="group w-full sm:w-auto justify-center px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold flex items-center gap-2 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-600/40 hover:scale-105 text-sm sm:text-base">
                    Get Started
                    <ArrowRight
                      size={18}
                      className="group-hover:translate-x-1 transition-transform hidden sm:block"
                    />
                  </button>
                </Link>

                <Link href="/auth/login" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto justify-center px-6 sm:px-8 py-3 sm:py-4 glass text-white rounded-xl font-semibold border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-300 text-sm sm:text-base">
                    Sign In
                  </button>
                </Link>
              </motion.div>

              {/* FEATURE TAGS */}
              <motion.div
                variants={itemVariants}
                className="flex flex-wrap gap-2 sm:gap-4 justify-center w-full px-2 sm:px-0"
              >
                {[
                  { icon: Zap, label: "Real-time" },
                  { icon: Lock, label: "Secure" },
                  { icon: Sparkles, label: "Premium UI" },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ y: -4, scale: 1.05 }}
                    className="glass px-3 sm:px-4 py-2 rounded-lg border border-blue-400/20 text-xs sm:text-sm text-gray-300 flex items-center gap-2"
                  >
                    <item.icon size={16} className="text-blue-400" />
                    <span className="hidden xs:inline">{item.label}</span>
                    <span className="xs:hidden">
                      {item.label.substring(0, 3)}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}
