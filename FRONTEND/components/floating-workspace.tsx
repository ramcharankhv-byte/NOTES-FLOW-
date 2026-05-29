"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, MessageSquare, ListTodo } from "lucide-react";

export function FloatingWorkspace() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [rotationX, setRotationX] = useState(0);
  const [rotationY, setRotationY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse parallax tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const x = (e.clientX - centerX) / 50;
      const y = (e.clientY - centerY) / 50;

      setRotationX(y);
      setRotationY(x);
      setMousePosition({ x: e.clientX - centerX, y: e.clientY - centerY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Main floating animation
  const floatingVariants = {
    animate: {
      y: [0, -30, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  // Individual card floating animations
  const cardFloatingVariants = {
    animate: (index: number) => ({
      y: [0, -40 - index * 10, 0],
      x: [0, index % 2 === 0 ? 15 : -15, 0],
      transition: {
        duration: 5 + index * 0.5,
        repeat: Infinity,
        ease: "easeInOut",
        delay: index * 0.3,
      },
    }),
  };

  // Particle animation
  const particleVariants = {
    animate: (index: number) => ({
      x: [0, Math.cos(index) * 100, 0],
      y: [0, Math.sin(index) * 100, 0],
      opacity: [0.3, 0.6, 0.3],
      transition: {
        duration: 8 + index * 0.5,
        repeat: Infinity,
        ease: "easeInOut",
      },
    }),
  };

  return (
    <div
      className="relative w-full h-full flex items-center justify-center perspective"
      ref={containerRef}
    >
      {/* Glow background container */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Central glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-cyan-500/15 rounded-full blur-2xl animate-pulse animation-delay-1000" />
      </div>

      {/* 3D perspective container */}
      <motion.div
        className="relative w-full h-full"
        style={{
          perspective: "1000px",
          transformStyle: "preserve-3d",
        }}
        animate={{
          rotationX,
          rotationY,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 60 }}
      >
        {/* Main floating container */}
        <motion.div
          variants={floatingVariants}
          animate="animate"
          className="relative w-full h-96 flex items-center justify-center"
        >
          {/* Animated particles in background */}
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={`particle-${i}`}
              custom={i}
              variants={particleVariants}
              animate="animate"
              className="absolute w-1 h-1 bg-cyan-400/40 rounded-full blur-sm"
              style={{
                left: "25%",
                top: "25%",
                filter: "drop-shadow(0 0 6px rgb(34, 211, 238))",
              }}
            />
          ))}

          {/* Card 1: Notes Panel - Top Left */}
          <motion.div
            custom={0}
            variants={cardFloatingVariants}
            animate="animate"
            className="absolute left-0 top-0 w-48 group"
          >
            <div className="relative">
              {/* Glow shadow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/50 to-cyan-600/50 rounded-2xl blur-xl opacity-0 group-hover:opacity-75 transition-opacity duration-300" />

              {/* Card */}
              <div className="relative px-4 py-6 rounded-2xl border border-blue-400/30 bg-gradient-to-br from-blue-950/40 to-cyan-950/20 backdrop-blur-xl shadow-2xl shadow-blue-600/10 hover:border-blue-400/60 transition-colors duration-300">
                <div className="flex items-center gap-2 mb-3">
                  <MessageSquare size={16} className="text-cyan-400" />
                  <h3 className="text-sm font-semibold text-blue-200">Notes</h3>
                </div>
                <div className="space-y-2">
                  <div className="w-full h-2 bg-gradient-to-r from-blue-500/20 to-transparent rounded-full" />
                  <div className="w-3/4 h-2 bg-gradient-to-r from-blue-500/15 to-transparent rounded-full" />
                  <div className="w-1/2 h-2 bg-gradient-to-r from-blue-500/10 to-transparent rounded-full" />
                </div>
                {/* Glowing indicator */}
                <div className="absolute top-2 right-2 w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-lg shadow-cyan-400/50" />
              </div>
            </div>
          </motion.div>

          {/* Card 2: Task Board - Top Right */}
          <motion.div
            custom={1}
            variants={cardFloatingVariants}
            animate="animate"
            className="absolute right-0 top-12 w-48 group"
          >
            <div className="relative">
              {/* Glow shadow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600/50 to-blue-600/50 rounded-2xl blur-xl opacity-0 group-hover:opacity-75 transition-opacity duration-300" />

              {/* Card */}
              <div className="relative px-4 py-6 rounded-2xl border border-cyan-400/30 bg-gradient-to-br from-cyan-950/40 to-blue-950/20 backdrop-blur-xl shadow-2xl shadow-cyan-600/10 hover:border-cyan-400/60 transition-colors duration-300">
                <div className="flex items-center gap-2 mb-3">
                  <ListTodo size={16} className="text-blue-400" />
                  <h3 className="text-sm font-semibold text-cyan-200">Tasks</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm border border-blue-400/50 bg-blue-500/20" />
                    <div className="flex-1 h-2 bg-gradient-to-r from-blue-500/15 to-transparent rounded-full" />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm bg-cyan-500/40" />
                    <div className="flex-1 h-2 bg-gradient-to-r from-cyan-500/15 to-transparent rounded-full" />
                  </div>
                </div>
                {/* Glowing indicator */}
                <div className="absolute bottom-2 right-2 w-2 h-2 bg-blue-400 rounded-full animate-pulse shadow-lg shadow-blue-400/50" />
              </div>
            </div>
          </motion.div>

          {/* Card 3: Kanban Column - Center Left */}
          <motion.div
            custom={2}
            variants={cardFloatingVariants}
            animate="animate"
            className="absolute left-12 bottom-12 w-52 group"
          >
            <div className="relative">
              {/* Glow shadow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/40 to-cyan-600/40 rounded-2xl blur-xl opacity-0 group-hover:opacity-75 transition-opacity duration-300" />

              {/* Card with columns */}
              <div className="relative px-4 py-5 rounded-2xl border border-blue-400/25 bg-gradient-to-br from-blue-950/30 to-cyan-950/15 backdrop-blur-xl shadow-2xl shadow-blue-600/5 hover:border-blue-400/50 transition-colors duration-300">
                <h3 className="text-xs font-semibold text-blue-200 mb-3 flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-cyan-400" />
                  Kanban
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {["To Do", "In Progress", "Done"].map((status, i) => (
                    <div key={status} className="space-y-1">
                      <div className="text-xs text-blue-300/60 px-1">
                        {status}
                      </div>
                      <div
                        className={`h-8 rounded-lg border border-blue-400/20 bg-blue-500/${20 + i * 10} flex items-center justify-center`}
                      >
                        <div className="w-1.5 h-1.5 bg-cyan-400/60 rounded-full" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 4: Collaboration Panel - Center Right */}
          <motion.div
            custom={3}
            variants={cardFloatingVariants}
            animate="animate"
            className="absolute right-12 bottom-8 w-56 group"
          >
            <div className="relative">
              {/* Glow shadow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600/40 to-blue-600/40 rounded-2xl blur-xl opacity-0 group-hover:opacity-75 transition-opacity duration-300" />

              {/* Card */}
              <div className="relative px-4 py-5 rounded-2xl border border-cyan-400/25 bg-gradient-to-br from-cyan-950/30 to-blue-950/15 backdrop-blur-xl shadow-2xl shadow-cyan-600/5 hover:border-cyan-400/50 transition-colors duration-300">
                <h3 className="text-xs font-semibold text-cyan-200 mb-3">
                  Collaborators
                </h3>
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div
                        className={`w-6 h-6 rounded-full border border-cyan-400/40 bg-gradient-to-br from-blue-500/30 to-cyan-500/20 flex items-center justify-center text-xs font-semibold text-cyan-300`}
                      >
                        {i}
                      </div>
                      <div className="flex-1 h-1.5 bg-gradient-to-r from-cyan-500/20 to-transparent rounded-full" />
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Connection lines between cards */}
          <svg
            className="absolute inset-0 w-full h-full"
            style={{ pointerEvents: "none" }}
          >
            <defs>
              <linearGradient
                id="lineGradient1"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="rgba(34, 211, 238, 0.3)" />
                <stop offset="100%" stopColor="rgba(59, 130, 246, 0.1)" />
              </linearGradient>
            </defs>
            {/* Line 1: Top-left to top-right */}
            <motion.line
              x1="25%"
              y1="20%"
              x2="75%"
              y2="30%"
              stroke="url(#lineGradient1)"
              strokeWidth="1.5"
              strokeDasharray="5,5"
              animate={{ strokeDashoffset: [0, 10] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            {/* Line 2: Top-right to bottom-right */}
            <motion.line
              x1="75%"
              y1="30%"
              x2="80%"
              y2="75%"
              stroke="url(#lineGradient1)"
              strokeWidth="1.5"
              strokeDasharray="5,5"
              animate={{ strokeDashoffset: [0, 10] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            />
            {/* Line 3: Bottom-right to bottom-left */}
            <motion.line
              x1="80%"
              y1="75%"
              x2="25%"
              y2="80%"
              stroke="url(#lineGradient1)"
              strokeWidth="1.5"
              strokeDasharray="5,5"
              animate={{ strokeDashoffset: [0, 10] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            />
            {/* Line 4: Bottom-left to top-left */}
            <motion.line
              x1="25%"
              y1="80%"
              x2="25%"
              y2="20%"
              stroke="url(#lineGradient1)"
              strokeWidth="1.5"
              strokeDasharray="5,5"
              animate={{ strokeDashoffset: [0, 10] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
            />
          </svg>
        </motion.div>
      </motion.div>
    </div>
  );
}
