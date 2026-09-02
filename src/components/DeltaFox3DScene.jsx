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

  // Frame animation reacting to mouse cursor & scroll position
  useFrame((state) => {
    if (!meshRef.current) return;

    // Mouse orientation mapping:
    // mousePos.x: -1 (left) to +1 (right) -> look left (Y rot positive) / look right (Y rot negative)
    // mousePos.y: -1 (bottom/down) to +1 (top/up) -> look down (X rot positive) / look up (X rot negative)
    const targetRotY = mousePos.current.x * 0.7 + scrollYProgress * 1.8;
    const targetRotX = -mousePos.current.y * 0.5 + scrollYProgress * 0.6;
    const targetRotZ = mousePos.current.x * 0.15 + scrollYProgress * 0.3;

    // Smooth lerp rotation towards target direction
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

// 3D Vertically Moving Metallic Boxes / Pillars Component
function VerticalMovingBoxes({ scrollYProgress }) {
  const groupRef = useRef();
  const boxesRef = useRef([]);

  // Generate 24 sleek financial 3D box pillars with amber & neon green glowing borders
  const boxesData = useMemo(() => {
    const boxes = [];
    const count = 24;
    for (let i = 0; i < count; i++) {
      const x = (i - count / 2) * 0.58;
      const z = -2.5 - Math.random() * 1.5;
      const initialY = (Math.random() - 0.5) * 3.5;
      const speed = 0.6 + Math.random() * 1.1;
      const width = 0.18 + Math.random() * 0.12;
      const height = 0.6 + Math.random() * 1.2;
      const depth = 0.18 + Math.random() * 0.12;
      const isGreen = i % 2 === 0;
      const color = isGreen ? '#22c55e' : '#f59e0b'; // Neon green or amber gold

      boxes.push({
        id: i,
        x,
        z,
        initialY,
        speed,
        width,
        height,
        depth,
        color
      });
    }
    return boxes;
  }, []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    boxesRef.current.forEach((mesh, idx) => {
      if (mesh) {
        const data = boxesData[idx];
        // Smooth continuous vertical movement (up/down oscillation)
        mesh.position.y = data.initialY + Math.sin(time * data.speed + idx) * 1.5 - scrollYProgress * 2.2;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {boxesData.map((box, idx) => (
        <group
          key={box.id}
          ref={(el) => (boxesRef.current[idx] = el)}
          position={[box.x, box.initialY, box.z]}
        >
          {/* Solid Dark Metallic Box Body */}
          <mesh>
            <boxGeometry args={[box.width, box.height, box.depth]} />
            <meshStandardMaterial
              color="#0d0d12"
              metalness={0.9}
              roughness={0.2}
              transparent={true}
              opacity={0.85}
            />
          </mesh>

          {/* Wireframe Glowing Border Lines for Tech Aesthetic */}
          <mesh scale={1.02}>
            <boxGeometry args={[box.width, box.height, box.depth]} />
            <meshBasicMaterial
              color={box.color}
              wireframe={true}
              transparent={true}
              opacity={0.45}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// Main 3D Canvas Scene Container
export default function DeltaFox3DScene({ scrollYProgress = 0 }) {
  const mousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Normalize cursor position: x from -1 (left) to 1 (right), y from -1 (bottom) to 1 (top)
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      mousePos.current = { x, y };
    };

    window.addEventListener('pointermove', handleMouseMove);
    return () => window.removeEventListener('pointermove', handleMouseMove);
  }, []);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
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

        {/* Vertically Moving 3D Metallic Boxes / Pillars */}
        <VerticalMovingBoxes scrollYProgress={scrollYProgress} />
      </Canvas>
    </div>
  );
}
