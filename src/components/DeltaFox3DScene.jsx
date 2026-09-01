import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
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

    // Target rotation derived from mouse position
    const targetRotX = mousePos.current.y * 0.4 + (scrollYProgress ? scrollYProgress * 0.5 : 0);
    const targetRotY = mousePos.current.x * 0.5 + (scrollYProgress ? scrollYProgress * 1.2 : 0);

    // Smooth lerp interaction
    meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetRotX, 0.05);
    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetRotY, 0.05);

    // Scroll-driven position translation
    if (scrollYProgress) {
      meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, -scrollYProgress * 3, 0.05);
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, -scrollYProgress * 1.5, 0.05);
    }

    // Continuous subtle floating animation
    meshRef.current.position.y += Math.sin(state.clock.elapsedTime * 1.5) * 0.002;
  });

  return (
    <group ref={meshRef}>
      {/* Outer Metallic Sharp Mesh */}
      <mesh geometry={geometry}>
        <meshStandardMaterial
          color="#151518"
          metalness={0.92}
          roughness={0.18}
          envMapIntensity={2.5}
          wireframe={false}
        />
      </mesh>

      {/* Gold/Orange Accented Wireframe Overlay for High-Tech feel */}
      <mesh geometry={geometry} scale={1.01} ref={wireframeRef}>
        <meshBasicMaterial
          color="#d97706"
          wireframe={true}
          transparent={true}
          opacity={0.35}
        />
      </mesh>

      {/* Internal Core Amber Glow */}
      <pointLight color="#f59e0b" intensity={3.5} distance={5} position={[0, 0, 0.2]} />
    </group>
  );
}

// Interactive 3D Perspective Grid
function FinancialGrid() {
  const gridRef = useRef();

  useFrame((state) => {
    if (gridRef.current) {
      gridRef.current.position.z = (state.clock.elapsedTime * 0.5) % 2;
    }
  });

  return (
    <group position={[0, -2.5, 0]} rotation={[-Math.PI / 2.3, 0, 0]}>
      <gridHelper args={[40, 40, '#d97706', '#222222']} ref={gridRef} />
    </group>
  );
}

// Background Floating Data Particles
function FloatingParticles({ count = 60 }) {
  const points = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 15;
      p[i * 3 + 1] = (Math.random() - 0.5) * 10;
      p[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return p;
  }, [count]);

  const ref = useRef();
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={points}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#22c55e"
        transparent={true}
        opacity={0.6}
        sizeAttenuation={true}
      />
    </points>
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

        {/* Financial 3D Grid */}
        <FinancialGrid />

        {/* Floating Particles */}
        <FloatingParticles count={50} />
      </Canvas>
    </div>
  );
}
