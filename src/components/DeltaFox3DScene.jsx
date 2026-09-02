import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PerspectiveCamera, Html } from '@react-three/drei';
import * as THREE from 'three';

// Procedural Metallic DeltaFox Emblem Mesh Component
function MetallicFoxHead({ mousePos, scrollYProgress }) {
  const meshRef = useRef();
  const wireframeRef = useRef();

  // Construct custom geometric sharp 3D Fox emblem geometry
  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();

    // Sharp low-poly vertices for aggressive futuristic DeltaFox emblem
    const vertices = new Float32Array([
      // Fox Snout Tip (0)
      0.0, -1.2, 0.8,

      // Snout Bridge (1)
      0.0, -0.2, 1.2,

      // Forehead Peak / Delta Top (2)
      0.0, 1.4, 0.5,

      // Left Cheek Outer (3)
      -1.4, -0.3, 0.2,

      // Right Cheek Outer (4)
      1.4, -0.3, 0.2,

      // Left Eye Brow (5)
      -0.6, 0.6, 0.8,

      // Right Eye Brow (6)
      0.6, 0.6, 0.8,

      // Left Ear Tip (7)
      -1.8, 2.2, -0.2,

      // Left Ear Inner Base (8)
      -0.5, 1.1, 0.3,

      // Right Ear Tip (9)
      1.8, 2.2, -0.2,

      // Right Ear Inner Base (10)
      0.5, 1.1, 0.3,

      // Rear Center Depth (11)
      0.0, 0.2, -0.8,

      // Delta Bottom Base (12)
      0.0, -1.6, -0.2
    ]);

    // Facet triangles forming metallic sharp Fox geometry
    const indices = [
      // Snout facets
      0, 1, 3,
      0, 4, 1,
      1, 5, 3,
      1, 4, 6,
      1, 6, 5,

      // Forehead / Crest
      5, 2, 8,
      6, 10, 2,
      5, 8, 2,
      6, 2, 10,

      // Left Ear
      5, 7, 8,
      3, 7, 5,

      // Right Ear
      6, 10, 9,
      4, 6, 9,

      // Cheeks & Jaw
      0, 3, 12,
      0, 12, 4,

      // Rear Depth Backing
      7, 11, 8,
      9, 10, 11,
      3, 11, 7,
      4, 9, 11,
      12, 11, 3,
      12, 4, 11
    ];

    geom.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geom.setIndex(indices);
    geom.computeVertexNormals();

    return geom;
  }, []);

  // Frame animation reacting to mouse cursor & scroll position
  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Target rotation derived from mouse movement (Left/Right -> Y-rot, Up/Down -> X-rot)
    const targetRotX = mousePos.current.y * 0.45 + scrollYProgress * 0.8;
    const targetRotY = mousePos.current.x * 0.6 + scrollYProgress * 2.2;
    const targetRotZ = scrollYProgress * 0.4;

    // Smooth lerp rotation towards cursor/scroll
    meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetRotX, 0.08);
    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetRotY, 0.08);
    meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, targetRotZ, 0.08);

    // Scroll-driven transition: Rotate, shift to side (+X), move backward (-Z), scale down
    const targetPosX = scrollYProgress * 2.2 + mousePos.current.x * 0.3;
    const targetPosY = -scrollYProgress * 1.8 + mousePos.current.y * 0.3;
    const targetPosZ = -scrollYProgress * 4.5;
    const targetScale = Math.max(0.45, 1 - scrollYProgress * 0.55);

    meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetPosX, 0.08);
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetPosY, 0.08);
    meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, targetPosZ, 0.08);

    meshRef.current.scale.setScalar(
      THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, 0.08)
    );

    // Continuous subtle breathing motion
    meshRef.current.position.y += Math.sin(state.clock.elapsedTime * 1.8) * 0.003;
  });

  return (
    <group ref={meshRef}>
      {/* Outer Metallic Premium Facet Mesh with Soft Reflections */}
      <mesh geometry={geometry}>
        <meshStandardMaterial
          color="#18181b"
          metalness={0.96}
          roughness={0.12}
          envMapIntensity={3.2}
          wireframe={false}
        />
      </mesh>

      {/* Amber/Gold Accented High-Tech Facet Wireframe */}
      <mesh geometry={geometry} scale={1.012} ref={wireframeRef}>
        <meshBasicMaterial
          color="#d97706"
          wireframe={true}
          transparent={true}
          opacity={0.4}
        />
      </mesh>

      {/* Internal Core Amber/Gold Subtle Glow */}
      <pointLight color="#f59e0b" intensity={4.5} distance={6} position={[0, 0, 0.3]} />
    </group>
  );
}

// Interactive 3D Perspective Grid reacting to scroll
function FinancialGrid({ scrollYProgress }) {
  const gridRef = useRef();

  useFrame((state) => {
    if (gridRef.current) {
      const speed = 0.5 + scrollYProgress * 1.5;
      gridRef.current.position.z = (state.clock.elapsedTime * speed) % 2;
      gridRef.current.rotation.x = -Math.PI / (2.3 - scrollYProgress * 0.4);
    }
  });

  return (
    <group position={[0, -2.5 - scrollYProgress * 1.2, -scrollYProgress * 2]} rotation={[-Math.PI / 2.3, 0, 0]}>
      <gridHelper args={[50, 50, '#d97706', '#222222']} ref={gridRef} />
    </group>
  );
}

// 3D Stock Market Candlestick Wave Background
function StockMarketCandlesticks({ scrollYProgress }) {
  const groupRef = useRef();

  // Generate 22 realistic 3D candlesticks forming a stock market curve behind the Fox
  const candlesticks = useMemo(() => {
    const candles = [];
    const count = 22;
    for (let i = 0; i < count; i++) {
      const x = (i - count / 2) * 0.55;
      // Simulated stock price wave pattern
      const baseY = Math.sin(i * 0.4) * 0.8 + Math.cos(i * 0.2) * 0.5 - 0.2;
      const isGreen = (i % 3 !== 0); // 70% bullish, 30% bearish
      const bodyHeight = 0.3 + Math.random() * 0.6;
      const wickHeight = bodyHeight + 0.3 + Math.random() * 0.5;

      candles.push({
        id: i,
        x,
        y: baseY,
        z: -1.8 - Math.sin(i * 0.3) * 0.8,
        isGreen,
        bodyHeight,
        wickHeight,
        color: isGreen ? '#22c55e' : '#ef4444'
      });
    }
    return candles;
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.08;
      groupRef.current.position.y = Math.cos(state.clock.elapsedTime * 0.5) * 0.05 - scrollYProgress * 1.2;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, -0.5]}>
      {candlesticks.map((c) => (
        <group key={c.id} position={[c.x, c.y, c.z]}>
          {/* Candlestick Wick */}
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.015, 0.015, c.wickHeight, 8]} />
            <meshStandardMaterial
              color={c.color}
              emissive={c.color}
              emissiveIntensity={0.3}
              roughness={0.2}
            />
          </mesh>

          {/* Candlestick Body */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.18, c.bodyHeight, 0.18]} />
            <meshStandardMaterial
              color={c.color}
              emissive={c.color}
              emissiveIntensity={0.6}
              roughness={0.1}
              metalness={0.5}
            />
          </mesh>
        </group>
      ))}

      {/* Dynamic Stock Market Metrics Floating Labels */}
      <Html position={[-4.5, 1.8, -1]} center distanceFactor={8} transform>
        <div className="flex items-center space-x-2 bg-black/80 backdrop-blur-md border border-emerald-500/40 px-3 py-1.5 rounded-lg text-emerald-400 font-mono text-xs shadow-lg shadow-emerald-500/10 pointer-events-none select-none">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-bold">NIFTY</span>
          <span>24,850.40</span>
          <span className="bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded text-[10px]">+1.42%</span>
        </div>
      </Html>

      <Html position={[4.2, 1.2, -1.2]} center distanceFactor={8} transform>
        <div className="flex items-center space-x-2 bg-black/80 backdrop-blur-md border border-emerald-500/40 px-3 py-1.5 rounded-lg text-emerald-400 font-mono text-xs shadow-lg shadow-emerald-500/10 pointer-events-none select-none">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-bold">BANKNIFTY</span>
          <span>52,410.15</span>
          <span className="bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded text-[10px]">+0.88%</span>
        </div>
      </Html>

      <Html position={[-3.8, -1.5, -1.5]} center distanceFactor={8} transform>
        <div className="flex items-center space-x-2 bg-black/80 backdrop-blur-md border border-amber-500/40 px-2.5 py-1 rounded text-amber-400 font-mono text-[11px] pointer-events-none select-none">
          <span>ATM IV: 13.8</span>
          <span className="text-zinc-400">|</span>
          <span>PCR: 1.24</span>
        </div>
      </Html>

      <Html position={[3.6, -1.6, -1.5]} center distanceFactor={8} transform>
        <div className="flex items-center space-x-2 bg-black/80 backdrop-blur-md border border-amber-500/40 px-2.5 py-1 rounded text-amber-400 font-mono text-[11px] pointer-events-none select-none">
          <span>MAX PAIN: 24,800</span>
        </div>
      </Html>
    </group>
  );
}

// Main 3D Canvas Scene Container
export default function DeltaFox3DScene({ scrollYProgress = 0 }) {
  const mousePos = useRef({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = -(e.clientY / window.innerHeight) * 2 + 1;
    mousePos.current = { x, y };
  };

  return (
    <div
      className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      <Canvas
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ width: '100%', height: '100%' }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={50} />

        {/* Cinematic Lighting Setup */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 8, 5]} intensity={2.5} color="#ffffff" />
        <directionalLight position={[-5, -4, -2]} intensity={1.2} color="#d97706" />
        <pointLight position={[0, 4, 2]} intensity={2} color="#22c55e" />

        {/* 3D Fox Head Emblem */}
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
          <MetallicFoxHead mousePos={mousePos} scrollYProgress={scrollYProgress} />
        </Float>

        {/* Financial 3D Grid with Scroll Perspective */}
        <FinancialGrid scrollYProgress={scrollYProgress} />

        {/* 3D Stock Market Candlestick Wave & Financial Indicators */}
        <StockMarketCandlesticks scrollYProgress={scrollYProgress} />
      </Canvas>
    </div>
  );
}
