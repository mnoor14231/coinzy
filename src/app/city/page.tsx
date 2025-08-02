'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, Stars } from '@react-three/drei';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// City Model Component
function CyberpunkCity() {
  const { scene } = useGLTF('/models/cyberpunk_city.glb');
  
  useEffect(() => {
    if (scene) {
      // Optimize the model with enhanced details
      scene.traverse((child) => {
        if ('isMesh' in child && child.isMesh) {
          (child as any).castShadow = true;
          (child as any).receiveShadow = true;
          if ((child as any).material) {
            (child as any).material.needsUpdate = true;
            // Enhance material properties for better visual quality
            if ((child as any).material.metalness !== undefined) {
              (child as any).material.metalness = 0.8;
            }
            if ((child as any).material.roughness !== undefined) {
              (child as any).material.roughness = 0.2;
            }
            if ((child as any).material.envMapIntensity !== undefined) {
              (child as any).material.envMapIntensity = 1.5;
            }
          }
        }
      });
    }
  }, [scene]);

  return <primitive object={scene} scale={[1.2, 1.2, 1.2]} position={[0, -2.5, 0]} />;
}

// Loading Component
function LoadingSpinner() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
        <div className="text-white text-lg font-bold">جاري تحميل المدينة...</div>
        <div className="text-white/70 text-sm mt-2">Cyberpunk City Loading...</div>
      </div>
    </div>
  );
}

// Floating UI Elements
function FloatingUI() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      {/* Enhanced Top Status Bar with Back Button */}
      <motion.div 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="absolute top-0 left-0 right-0 bg-black/40 backdrop-blur-md border-b border-white/20 pointer-events-auto"
      >
        <div className="flex justify-between items-center px-6 py-3">
          {/* Back Button */}
          <Link href="/lessons">
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-white px-4 py-2 rounded-full border border-white/30 hover:bg-white/10 transition-all duration-200 neon-text"
            >
              ← العودة
            </motion.button>
          </Link>
          
          {/* Time Display */}
          <div className="text-sm font-mono text-cyan-400 neon-text">
            {currentTime.toLocaleTimeString('ar-SA', { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: false 
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Matrix Rain Effect Component
function MatrixRain() {
  return (
    <div className="fixed inset-0 pointer-events-none z-5 opacity-10">
      {[...Array(10)].map((_, i) => (
        <div
          key={i}
          className="absolute text-green-400 text-xs font-mono matrix-rain"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 10}s`,
            animationDuration: `${8 + Math.random() * 4}s`
          }}
        >
          {String.fromCharCode(0x30A0 + Math.random() * 96)}
        </div>
      ))}
    </div>
  );
}

// Data Stream Effect Component
function DataStream() {
  return (
    <div className="fixed inset-0 pointer-events-none z-5 opacity-15">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="absolute w-px h-32 bg-gradient-to-b from-cyan-400 to-transparent data-stream"
          style={{
            left: `${20 + i * 20}%`,
            animationDelay: `${i * 3}s`
          }}
        />
      ))}
    </div>
  );
}

// City Scan Effect Component
function CityScan() {
  return (
    <div className="fixed inset-0 pointer-events-none z-5 opacity-20">
      {[...Array(2)].map((_, i) => (
        <div
          key={i}
          className="absolute h-px w-full bg-gradient-to-r from-transparent via-blue-400 to-transparent city-scan"
          style={{
            top: `${30 + i * 30}%`,
            animationDelay: `${i * 4}s`
          }}
        />
      ))}
    </div>
  );
}

// Main City Page
export default function CityPage() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Simulate loading time for better UX
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="w-full h-screen relative overflow-hidden">
      {/* Background Effects */}
      <MatrixRain />
      <DataStream />
      <CityScan />
             {/* 3D Canvas */}
       <Canvas
         camera={{ 
           position: [0, 2, 5], 
           fov: 75,
           near: 0.1,
           far: 2000
         }}
         shadows
         className="w-full h-full"
       >
        {/* Enhanced Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[15, 15, 10]}
          intensity={1.2}
          castShadow
          shadow-mapSize-width={4096}
          shadow-mapSize-height={4096}
          shadow-camera-far={100}
          shadow-camera-left={-20}
          shadow-camera-right={20}
          shadow-camera-top={20}
          shadow-camera-bottom={-20}
        />
        <pointLight position={[-15, 15, -15]} intensity={0.8} color="#4f46e5" />
        <pointLight position={[15, -15, -15]} intensity={0.6} color="#ec4899" />
        <pointLight position={[0, 20, 0]} intensity={0.4} color="#06b6d4" />

        {/* Enhanced Environment */}
        <Environment preset="night" />
        <Stars radius={150} depth={100} count={8000} factor={6} saturation={0.1} fade speed={1} />

        {/* City Model */}
        <Suspense fallback={null}>
          <CyberpunkCity />
        </Suspense>

                 {/* Free Movement Camera Controls */}
         <OrbitControls
           enablePan={true}
           enableZoom={true}
           enableRotate={true}
           minDistance={0.5}
           maxDistance={100}
           maxPolarAngle={Math.PI / 1.5}
           minPolarAngle={-Math.PI / 4}
           dampingFactor={0.06}
           enableDamping={true}
           rotateSpeed={0.6}
           zoomSpeed={1.5}
           panSpeed={3.0}
           screenSpacePanning={true}
           target={[0, 1.5, 0]}
         />
      </Canvas>

      {/* UI Overlay */}
      <FloatingUI />

            {/* Enhanced Title */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="absolute top-20 left-1/2 transform -translate-x-1/2 z-20 bg-black/60 backdrop-blur-lg px-8 py-4 rounded-2xl border border-cyan-400/30 text-center shadow-2xl"
      >
         <div className="text-xl font-bold text-cyan-400 neon-text">عالم كوينزي</div>
      </motion.div>
    </div>
  );
} 