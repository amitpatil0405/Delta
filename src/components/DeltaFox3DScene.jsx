import React, { useRef, useMemo, useEffect, Component } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

// Class Error Boundary specifically for 3D Canvas WebGL rendering failures
class ThreeErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.warn('3D Canvas WebGL error caught gracefully:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return null; // Fallback gracefully without crashing app
    }
    return this.props.children;
  }
}

// Procedural Metallic DeltaFox Emblem Mesh
function MetallicFoxHead({ scrollProgress }) {
  const meshRef = useRef();
  const wireframeRef = useRef();

  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    const vertices = new Float32Array([
      0.0, -1.2, 0.8,
      0.0, -0.2, 1.2,
      0.0, 1.4, 0.5,
      -1.4, -0.3, 0.2,
      1.4, -0.3, 0.2,
      -0.6, 0.6, 0.8,
      0.6, 0.6, 0.8,
      -1.8, 2.2, -0.2,
      -0.5, 1.1, 0.3,
      1.8, 2.2, -0.2,
      0.5, 1.1, 0.3,
      0.0, 0.2, -0.8,
      0.0, -1.6, -0.2
    ]);

    const indices = [
      0, 1, 3,  0, 4, 1,  1, 5, 3,  1, 4, 6,
      1, 6, 5,  5, 2, 8,  6, 10, 2, 5, 8, 2,
      6, 2, 10, 5, 7, 8,  3, 7, 5,  6, 10, 9,
      4, 6, 9,  0, 3, 12, 0, 12, 4, 7, 11, 8,
      9, 10, 11, 3, 11, 7, 4, 9, 11, 12, 11, 3,
      12, 4, 11
    ];

    geom.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geom.setIndex(indices);
    geom.computeVertexNormals();
    return geom;
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const sp = scrollProgress.current || 0;

    // Cinematic continuous motion across story scroll
    const targetRotY = sp * Math.PI * 4 + Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    const targetRotX = Math.sin(sp * Math.PI * 2) * 0.4 + Math.cos(state.clock.elapsedTime * 0.3) * 0.15;
    const targetRotZ = Math.cos(sp * Math.PI) * 0.2;

    meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetRotX, 0.08);
    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetRotY, 0.08);
    meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, targetRotZ, 0.08);

    // Dynamic 3D positioning: pulls back in intro, shifts laterally, floats in trading floor, settles in footer
    const targetX = Math.sin(sp * Math.PI * 3) * 2.2;
    const targetY = Math.cos(sp * Math.PI * 2) * 1.5 - sp * 1.8;
    const targetZ = -0.5 - sp * 4.0;
    const targetScale = (0.95 - Math.sin(sp * Math.PI) * 0.25);

    meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetX, 0.06);
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.06);
    meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, targetZ, 0.06);

    meshRef.current.scale.setScalar(
      THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, 0.06)
    );
  });

  return (
    <group ref={meshRef}>
      <mesh geometry={geometry}>
        <meshStandardMaterial
          color="#18181b"
          metalness={0.96}
          roughness={0.12}
          envMapIntensity={3.2}
        />
      </mesh>

      <mesh geometry={geometry} scale={1.012} ref={wireframeRef}>
        <meshBasicMaterial
          color="#d97706"
          wireframe={true}
          transparent={true}
          opacity={0.45}
        />
      </mesh>

      <pointLight color="#f59e0b" intensity={5} distance={8} position={[0, 0, 0.5]} />
    </group>
  );
}

// 3D Floating Candlesticks & Delta Symbols (Phase 2 & 3)
function FloatingCandlesticks({ scrollProgress }) {
  const groupRef = useRef();

  const candles = useMemo(() => {
    const items = [];
    const count = 18;
    for (let i = 0; i < count; i++) {
      const isGreen = i % 2 === 0;
      items.push({
        id: i,
        isGreen,
        x: (Math.random() - 0.5) * 14,
        y: (Math.random() - 0.5) * 12 - i * 0.8,
        z: -Math.random() * 10 - 2,
        height: 0.8 + Math.random() * 1.5,
        rotSpeed: (Math.random() - 0.5) * 0.02,
        scale: 0.3 + Math.random() * 0.4
      });
    }
    return items;
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const sp = scrollProgress.current || 0;

    groupRef.current.rotation.y = state.clock.elapsedTime * 0.15 + sp * Math.PI;
    groupRef.current.position.z = -sp * 6;
    groupRef.current.position.y = sp * 4;
  });

  return (
    <group ref={groupRef}>
      {candles.map((c) => (
        <group key={c.id} position={[c.x, c.y, c.z]} scale={c.scale}>
          {/* Wick */}
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.02, 0.02, c.height * 1.8, 8]} />
            <meshBasicMaterial color={c.isGreen ? "#10b981" : "#f43f5e"} transparent opacity={0.8} />
          </mesh>
          {/* Candle Body */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.35, c.height, 0.35]} />
            <meshStandardMaterial
              color={c.isGreen ? "#10b981" : "#f43f5e"}
              roughness={0.2}
              metalness={0.8}
              emissive={c.isGreen ? "#059669" : "#e11d48"}
              emissiveIntensity={0.6}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// 3D Perspective Trading Floor Grid (Phase 3 & 4)
function Infinite3DGrid({ scrollProgress }) {
  const gridRef = useRef();

  useFrame((state) => {
    if (!gridRef.current) return;
    const sp = scrollProgress.current || 0;
    gridRef.current.position.z = (state.clock.elapsedTime * 2 + sp * 20) % 4 - 2;
    gridRef.current.rotation.x = Math.PI / 2.3 + Math.sin(sp * Math.PI) * 0.1;
  });

  return (
    <group ref={gridRef} position={[0, -4, -5]}>
      <gridHelper args={[60, 40, "#d97706", "#27272a"]} />
    </group>
  );
}

// 3D Particles & Financial Waves (Phase 3, 4, 5, 6)
function ParticleField({ scrollProgress }) {
  const pointsRef = useRef();

  const { positions, colors } = useMemo(() => {
    const count = 350;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const color1 = new THREE.Color("#f59e0b"); // Amber
    const color2 = new THREE.Color("#10b981"); // Green
    const color3 = new THREE.Color("#38bdf8"); // Sky

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 25;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 15 - 3;

      let chosenColor = color1;
      if (i % 3 === 1) chosenColor = color2;
      if (i % 3 === 2) chosenColor = color3;

      col[i * 3] = chosenColor.r;
      col[i * 3 + 1] = chosenColor.g;
      col[i * 3 + 2] = chosenColor.b;
    }

    return { positions: pos, colors: col };
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const sp = scrollProgress.current || 0;
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.05 + sp * 0.5;
    pointsRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.5 - sp * 3;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        vertexColors
        transparent
        opacity={0.65}
        sizeAttenuation
      />
    </points>
  );
}

// Main 3D Scene Controller
function SceneContent({ mousePos, scrollProgress }) {
  const cameraRef = useRef();

  useFrame((state) => {
    if (!cameraRef.current) return;
    const sp = scrollProgress.current || 0;

    // Smooth camera glide driving the 3D story scroll
    const camX = (mousePos.current?.x || 0) * 0.8 + Math.sin(sp * Math.PI * 2) * 1.2;
    const camY = (mousePos.current?.y || 0) * 0.6 - sp * 2.5;
    const camZ = 7 - Math.sin(sp * Math.PI) * 1.5;

    cameraRef.current.position.x = THREE.MathUtils.lerp(cameraRef.current.position.x, camX, 0.08);
    cameraRef.current.position.y = THREE.MathUtils.lerp(cameraRef.current.position.y, camY, 0.08);
    cameraRef.current.position.z = THREE.MathUtils.lerp(cameraRef.current.position.z, camZ, 0.08);

    cameraRef.current.lookAt(0, -sp * 2.2, -2);
  });

  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 0, 7]} fov={50} />

      {/* Atmospheric Cinematic Lights */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[6, 10, 6]} intensity={3.0} color="#ffffff" />
      <directionalLight position={[-6, -5, -3]} intensity={1.5} color="#d97706" />
      <pointLight position={[0, 2, 1]} intensity={3.5} color="#10b981" />

      {/* Story 3D Objects */}
      <MetallicFoxHead scrollProgress={scrollProgress} />
      <FloatingCandlesticks scrollProgress={scrollProgress} />
      <Infinite3DGrid scrollProgress={scrollProgress} />
      <ParticleField scrollProgress={scrollProgress} />
    </>
  );
}

// Synchronous WebGL check
function checkWebGLSupport() {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch (e) {
    return false;
  }
}

export default function DeltaFox3DScene() {
  const mousePos = useRef({ x: 0, y: 0 });
  const scrollProgress = useRef(0);
  const [shouldRenderCanvas, setShouldRenderCanvas] = React.useState(false);
  const [hasWebGL] = React.useState(() => checkWebGLSupport());

  useEffect(() => {
    if (!hasWebGL) return;

    // Fast load deferral
    const timer = setTimeout(() => setShouldRenderCanvas(true), 150);
    return () => clearTimeout(timer);
  }, [hasWebGL]);

  useEffect(() => {
    if (!hasWebGL || !shouldRenderCanvas) return;

    const handlePointer = (e) => {
      let clientX, clientY;
      if (e.touches && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }
      if (clientX !== undefined && clientY !== undefined) {
        mousePos.current = {
          x: (clientX / window.innerWidth) * 2 - 1,
          y: -(clientY / window.innerHeight) * 2 + 1
        };
      }
    };

    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll > 0) {
        scrollProgress.current = Math.min(Math.max(window.scrollY / maxScroll, 0), 1);
      }
    };

    window.addEventListener('mousemove', handlePointer, { passive: true });
    window.addEventListener('pointermove', handlePointer, { passive: true });
    window.addEventListener('touchmove', handlePointer, { passive: true });
    window.addEventListener('touchstart', handlePointer, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('mousemove', handlePointer);
      window.removeEventListener('pointermove', handlePointer);
      window.removeEventListener('touchmove', handlePointer);
      window.removeEventListener('touchstart', handlePointer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [hasWebGL, shouldRenderCanvas]);

  if (!hasWebGL) return null;

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden transition-opacity duration-700 opacity-90">
      <ThreeErrorBoundary>
        {shouldRenderCanvas && (
          <Canvas
            dpr={[1, 1.5]}
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
            style={{ width: '100%', height: '100%' }}
          >
            <SceneContent mousePos={mousePos} scrollProgress={scrollProgress} />
          </Canvas>
        )}
      </ThreeErrorBoundary>
    </div>
  );
}
