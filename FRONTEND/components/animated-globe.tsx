"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface Point3D {
  x: number;
  y: number;
  z: number;
  isLand: boolean;
}

export function AnimatedGlobe() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;

    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let rotationY = 4.7; // Initial angle showing the Americas/Atlantic
    let rotationX = 0.25; // Professional downward camera tilt
    let targetRotationY = 4.7;

    const points: Point3D[] = [];
    const radius = 140;

    // A lightweight high-resolution matrix map approximating world continents
    // 0 = Ocean, 1 = Landmass (North/South America, Europe, Africa, Asia)
    const worldMapMatrix = [
      [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
      ], // 80°N
      [
        0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 1, 1, 1, 1, 0, 0,
      ], // 70°N
      [
        0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 0, 0,
      ], // 60°N
      [
        0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 0, 0, 0,
      ], // 50°N
      [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 0, 0, 0, 0,
      ], // 40°N
      [
        1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 0, 0, 0, 0, 1,
      ], // 30°N
      [
        0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 0, 0, 0, 0, 0, 0,
      ], // 20°N
      [
        0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 0, 0, 0, 0, 0, 0, 0,
      ], // 10°N
      [
        0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        0, 0, 0, 0, 0, 0, 0, 0,
      ], // 0° Equator
      [
        0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
      ], // 10°S
      [
        0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0,
        0, 0, 0, 0, 1, 1, 1, 0,
      ], // 20°S
      [
        0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0,
        0, 0, 0, 0, 1, 1, 1, 0,
      ], // 30°S
      [
        0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 1, 0, 0,
      ], // 40°S
      [
        0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
      ], // 50°S
      [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
      ], // 60°S
    ];

    const latRows = worldMapMatrix.length;
    const lonCols = worldMapMatrix[0].length;

    // Generate standard 3D point array mapped against our continent data
    for (let i = 0; i < latRows; i++) {
      const lat = (i / (latRows - 1)) * Math.PI - Math.PI / 2;
      for (let j = 0; j < lonCols; j++) {
        const lon = (j / lonCols) * Math.PI * 2;
        const isLand = worldMapMatrix[i][j] === 1;

        points.push({
          x: radius * Math.cos(lat) * Math.cos(lon),
          y: radius * Math.sin(lat),
          z: radius * Math.cos(lat) * Math.sin(lon),
          isLand,
        });
      }
    }

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      // Easing controls the rotation speed offset by the mouse position
      targetRotationY = 4.7 + (x - 0.5) * Math.PI * 0.6;
    };

    const draw = () => {
      const w = canvas.width / (window.devicePixelRatio || 1);
      const h = canvas.height / (window.devicePixelRatio || 1);
      const centerX = w / 2;
      const centerY = h / 2;

      ctx.clearRect(0, 0, w, h);

      // Auto rotation + interactive tracking interpolation
      rotationY += 0.002 + (targetRotationY - rotationY) * 0.05;

      ctx.save();
      ctx.translate(centerX, centerY);

      /* 1. ATMOSPHERIC BACKGLOW */
      const glow = ctx.createRadialGradient(
        0,
        0,
        radius * 0.4,
        0,
        0,
        radius * 1.3,
      );
      glow.addColorStop(0, "rgba(14, 116, 144, 0.25)");
      glow.addColorStop(0.6, "rgba(37, 99, 235, 0.08)");
      glow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(0, 0, radius * 1.3, 0, Math.PI * 2);
      ctx.fill();

      /* 2. TRANSLUCENT INNER SPHERE BODY */
      const innerSphere = ctx.createRadialGradient(-30, -30, 20, 0, 0, radius);
      innerSphere.addColorStop(0, "rgba(17, 24, 39, 0.7)");
      innerSphere.addColorStop(1, "rgba(3, 7, 18, 0.9)");
      ctx.fillStyle = innerSphere;
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.fill();

      /* 3. WIREFRAME CYBER RINGS */
      ctx.strokeStyle = "rgba(6, 182, 212, 0.2)";
      ctx.lineWidth = 1;
      ctx.save();
      ctx.rotate(rotationY * 0.1);
      ctx.beginPath();
      ctx.ellipse(0, 0, radius + 15, (radius + 15) * 0.25, 0.2, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      /* 4. RENDERING GEOGRAPHICAL POINTS */
      points.forEach((pt) => {
        // Rotate Y Axis
        let x1 = pt.x * Math.cos(rotationY) - pt.z * Math.sin(rotationY);
        let z1 = pt.z * Math.cos(rotationY) + pt.x * Math.sin(rotationY);

        // Rotate X Axis
        let y2 = pt.y * Math.cos(rotationX) - z1 * Math.sin(rotationX);
        let z2 = z1 * Math.cos(rotationX) + pt.y * Math.sin(rotationX);

        // Calculate depth opacity (Z-index mapping)
        const depthFactor = (z2 + radius) / (2 * radius); // 0 = Back, 1 = Front

        // Hide back-facing dots completely to create a realistic solid globe effect
        if (depthFactor < 0.25) return;

        if (pt.isLand) {
          // Landmass points: Vibrant, sharp neon matrix dots
          ctx.fillStyle = `rgba(34, 211, 238, ${depthFactor * 0.9})`;
          ctx.beginPath();
          ctx.arc(x1, y2, depthFactor > 0.6 ? 1.8 : 1.1, 0, Math.PI * 2);
          ctx.fill();

          // Subdued ambient network connection lines
          if (depthFactor > 0.75 && Math.random() > 0.9997) {
            ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(x1, y2);
            ctx.lineTo(
              x1 + (Math.random() - 0.5) * 20,
              y2 + (Math.random() - 0.5) * 20,
            );
            ctx.stroke();
          }
        } else {
          // Ocean points: Faint, deep blue structural dots
          ctx.fillStyle = `rgba(29, 78, 216, ${depthFactor * 0.25})`;
          ctx.beginPath();
          ctx.arc(x1, y2, 0.8, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      /* 5. CRISP OUTER ATMOSPHERE RIM */
      ctx.strokeStyle = "rgba(34, 211, 238, 0.45)";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.stroke();

      ctx.restore();
      animationId = requestAnimationFrame(draw);
    };

    draw();

    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <motion.div
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-start"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2 }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{
          display: "block",
          filter: "drop-shadow(0 0 50px rgba(6, 182, 212, 0.3))",
        }}
      />
    </motion.div>
  );
}
