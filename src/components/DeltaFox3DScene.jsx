import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PerspectiveCamera } from '@react-three/drei';
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

  // Frame animation reacting to mouse cursor & full website scroll position
  useFrame((state) => {
    if (!meshRef.current) return;

    const scrollVal = scrollYProgress.current;

    // Continuous 3D rotation driven by cursor and full site scroll
    const targetRotY = mousePos.current.x * 0.8 + scrollVal * Math.PI * 3;
    const targetRotX = -mousePos.current.y * 0.6 + Math.sin(scrollVal * Math.PI * 2) * 0.4;
    const targetRotZ = mousePos.current.x * 0.2 + Math.cos(scrollVal * Math.PI * 2) * 0.2;

    // Smooth lerp rotation towards target direction
    meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetRotX, 0.06);
    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetRotY, 0.06);
    meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, targetRotZ, 0.06);

    // Dynamic positioning across the entire viewport height
    // Oscillates between left and right margins, floating in the background
    const targetPosX = Math.sin(scrollVal * Math.PI * 2.5) * 2.0 + mousePos.current.x * 0.4;
    const targetPosY = Math.cos(scrollVal * Math.PI * 1.8) * 0.8 + mousePos.current.y * 0.4;
    const targetPosZ = -1.2 + Math.sin(scrollVal * Math.PI * 3) * 0.8;
    const targetScale = 0.95 + Math.sin(scrollVal * Math.PI * 2) * 0.2;

    meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetPosX, 0.06);
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetPosY, 0.06);
    meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, targetPosZ, 0.06);

    meshRef.current.scale.setScalar(
      THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, 0.06)
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

// Main 3D Canvas Scene Container - Fixed persistent background across whole site
export default function DeltaFox3DScene() {
  const mousePos = useRef({ x: 0, y: 0 });
  const scrollYProgress = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      mousePos.current = { x, y };
    };

    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll > 0) {
        scrollYProgress.current = window.scrollY / maxScroll;
      }
    };

    window.addEventListener('pointermove', handleMouseMove);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('pointermove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden opacity-90">
      <Canvas
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ width: '100%', height: '100%' }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={50} />

        {/* Minimalistic Cinematic Lighting Setup */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 8, 5]} intensity={2.5} color="#ffffff" />
        <directionalLight position={[-5, -4, -2]} intensity={1.2} color="#d97706" />
        <pointLight position={[0, 4, 2]} intensity={2} color="#22c55e" />

        {/* 3D Metallic Fox Head Emblem tracking cursor orientation */}
        <Float speed={1.5} rotationIntensity={0.15} floatIntensity={0.25}>
          <MetallicFoxHead mousePos={mousePos} scrollYProgress={scrollYProgress} />
        </Float>
      </Canvas>
    </div>
  );
}
