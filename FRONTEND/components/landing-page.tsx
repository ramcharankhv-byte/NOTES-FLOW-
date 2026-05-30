"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

export function LandingPage() {
  const containerRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const wrapper = wrapperRef.current;

    if (container && wrapper) {
      const handleMouseMove = (e: MouseEvent) => {
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        // Calculate tilt
        const tiltX = -(y / rect.height) * 15; // Max 15 deg tilt
        const tiltY = (x / rect.width) * 15;

        wrapper.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
      };

      const handleMouseLeave = () => {
        wrapper.style.transform = `rotateX(0deg) rotateY(0deg)`;
      };

      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, []);

  return (
    <main className="bg-black overflow-x-hidden text-left min-h-screen">
      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center relative">

        {/* STYLE TAG FOR CUSTOM CSS */}
        <style jsx>{`
          body {
            background-color: #000;
            color: #fff;
            margin: 0;
            overflow-x: hidden;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          }

          /* Background Blobs */
          .blob {
            position: absolute;
            border-radius: 50%;
            filter: blur(80px);
            z-index: 0;
            opacity: 0.4;
            animation: float 10s infinite ease-in-out alternate;
          }
          .blob-1 { top: 10%; left: 10%; width: 400px; height: 400px; background: rgba(37, 99, 235, 0.4); }
          .blob-2 { bottom: 10%; right: 10%; width: 500px; height: 500px; background: rgba(56, 189, 248, 0.3); animation-delay: -5s; }

          @keyframes float {
            0% { transform: translateY(0px) scale(1); }
            100% { transform: translateY(50px) scale(1.1); }
          }

          /* Glassmorphism */
          .glass {
            background: rgba(255, 255, 255, 0.03);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid rgba(255, 255, 255, 0.05);
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
          }

          /* 3D Container */
          .perspective-container {
            perspective: 1000px;
            transform-style: preserve-3d;
          }

          .parallax-layer {
            transition: transform 0.1s ease-out;
            transform-style: preserve-3d;
          }

          /* Glows */
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

          .animated-float {
            animation: gentle-float 6s ease-in-out infinite alternate;
          }
          .animated-float-delayed {
            animation: gentle-float 8s ease-in-out infinite alternate-reverse;
          }

          @keyframes gentle-float {
            0% { transform: translateY(0px); }
            100% { transform: translateY(-15px); }
          }

          /* Button hover effects for better UX */
          button {
            cursor: pointer;
          }
        `}</style>

        {/* Background Elements */}
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>

        <main className="relative z-10 w-full max-w-7xl mx-auto px-6 py-20 lg:py-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[80vh]">

            {/* LEFT SIDE: 3D Visual Component */}
            <div
              id="visual-container"
              className="perspective-container relative w-full h-[500px] lg:h-[600px] hidden lg:block"
              ref={containerRef}
            >
              <div
                id="parallax-wrapper"
                className="parallax-layer w-full h-full relative flex items-center justify-center"
                ref={wrapperRef}
              >

                {/* Central Glass Pane */}
                <div
                  className="absolute w-[80%] h-[70%] glass rounded-3xl glow-border flex flex-col p-6 animated-float"
                  style={{ transform: 'translateZ(0px)' }}
                >
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

                {/* Floating Foreground Element 1 (Kanban Card) */}
                <div
                  className="absolute bottom-10 right-0 w-64 glass rounded-2xl p-4 glow-border animated-float-delayed shadow-2xl shadow-blue-900/40"
                  style={{ transform: 'translateZ(60px)' }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_8px_#60a5fa]"></div>
                    <span className="text-xs font-semibold text-blue-300 uppercase tracking-wider">In Progress</span>
                  </div>
                  <div className="text-sm font-medium text-white mb-4">Design Hero Component</div>
                  <div className="flex justify-between items-center">
                    <div className="flex -space-x-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 border border-black"></div>
                      <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-purple-400 to-pink-500 border border-black"></div>
                    </div>
                    <div className="text-xs text-gray-400">May 29</div>
                  </div>
                </div>

                {/* Floating Foreground Element 2 (Note Widget) */}
                <div
                  className="absolute top-10 left-0 w-56 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-4 animated-float shadow-2xl"
                  style={{ transform: 'translateZ(40px)' }}
                >
                  <div className="w-full h-2 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-2 w-full bg-white/20 rounded"></div>
                    <div className="h-2 w-4/5 bg-white/10 rounded"></div>
                    <div className="h-2 w-3/4 bg-white/10 rounded"></div>
                  </div>
                </div>

              </div>
            </div>

            {/* RIGHT SIDE: Existing Content Text-Left Aligned */}
            <div className="flex flex-col justify-center text-left z-10 lg:pl-10">
              <div className="inline-block mb-6 self-start">
                <div className="glass px-5 py-2 rounded-full text-sm text-blue-300 font-medium tracking-wide border-blue-400/30">
                  Collaborate • Organize • Flow
                </div>
              </div>

              <h1
                className="text-6xl sm:text-7xl font-black bg-gradient-to-b from-white via-blue-200 to-blue-400 bg-clip-text text-transparent leading-tight tracking-tighter mb-2"
              >
                NOTES
              </h1>
              <div
                className="text-6xl sm:text-7xl font-black bg-gradient-to-b from-blue-400 via-blue-300 to-cyan-300 bg-clip-text text-transparent leading-tight tracking-tighter mb-8"
              >
                FLOW
              </div>

              <p
                className="text-lg text-gray-400 mb-10 max-w-md leading-relaxed"
              >
                The collaborative workspace platform built for teams. Combine workspace organization, task tracking, and persistent documents in one stunning interface.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 items-start">
                <Link href="/auth/signup" passHref prefetch>
                  <button
                    className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:scale-105"
                    type="button"
                  >
                    Get Started
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14"></path>
                      <path d="m12 5 7 7-7 7"></path>
                    </svg>
                  </button>
                </Link>
                <Link href="/auth/login" passHref prefetch>
                  <button
                    className="px-8 py-4 glass text-white rounded-xl font-bold transition-all hover:bg-white/5 border border-white/10"
                    type="button"
                  >
                    Sign In
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </main>
      </section>
    </main>
  );
}