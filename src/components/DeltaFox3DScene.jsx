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

// 3D Floating Candlesticks with Randomized Refresh Spawns & Parallax
function FloatingCandlesticks({ mousePos, scrollProgress }) {
  const groupRef = useRef();

  // Randomized positions, rotations, heights, and scales generated on page refresh
  const candles = useMemo(() => {
    const items = [];
    const count = 22;
    for (let i = 0; i < count; i++) {
      const isGreen = i % 2 === 0;
      items.push({
        id: i,
        isGreen,
        x: (Math.random() - 0.5) * 16,
        y: (Math.random() - 0.5) * 14 - (i - count / 2) * 0.4,
        z: -Math.random() * 12 - 1,
        rotX: (Math.random() - 0.5) * 0.6,
        rotY: (Math.random() - 0.5) * 0.6,
        rotZ: (Math.random() - 0.5) * 0.4,
        height: 0.9 + Math.random() * 1.8,
        scale: 0.35 + Math.random() * 0.45
      });
    }
    return items;
  }, []);

  useFrame(() => {
    if (!groupRef.current) return;
    const sp = scrollProgress.current || 0;
    const mx = mousePos.current?.x || 0;
    const my = mousePos.current?.y || 0;

    // Target positions and rotations based purely on Scroll & Mouse Cursor Parallax
    const targetRotY = sp * Math.PI * 0.8 + mx * 0.25;
    const targetRotX = my * 0.2;
    const targetPosZ = -sp * 5;
    const targetPosY = sp * 3.5;
    const targetPosX = mx * 0.5;

    // Smooth lerp to targets; when idle, stays completely static
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.08);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.08);
    groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetPosZ, 0.08);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetPosY, 0.08);
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetPosX, 0.08);
  });

  return (
    <group ref={groupRef}>
      {candles.map((c) => (
        <group
          key={c.id}
          position={[c.x, c.y, c.z]}
          rotation={[c.rotX, c.rotY, c.rotZ]}
          scale={c.scale}
        >
          {/* Wick */}
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.02, 0.02, c.height * 1.8, 8]} />
            <meshBasicMaterial color={c.isGreen ? "#10b981" : "#f43f5e"} transparent opacity={0.65} />
          </mesh>
          {/* Candle Body */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.38, c.height, 0.38]} />
            <meshStandardMaterial
              color={c.isGreen ? "#10b981" : "#f43f5e"}
              roughness={0.4}
              metalness={0.6}
              emissive={c.isGreen ? "#059669" : "#e11d48"}
              emissiveIntensity={0.35}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// 3D Particles & Financial Field
function ParticleField({ mousePos, scrollProgress }) {
  const pointsRef = useRef();

  const { positions, colors } = useMemo(() => {
    const count = 350;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const color1 = new THREE.Color("#f59e0b"); // Amber
    const color2 = new THREE.Color("#10b981"); // Green
    const color3 = new THREE.Color("#38bdf8"); // Sky

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 22;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 26;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 16 - 2;

      let chosenColor = color1;
      if (i % 3 === 1) chosenColor = color2;
      if (i % 3 === 2) chosenColor = color3;

      col[i * 3] = chosenColor.r;
      col[i * 3 + 1] = chosenColor.g;
      col[i * 3 + 2] = chosenColor.b;
    }

    return { positions: pos, colors: col };
  }, []);

  useFrame(() => {
    if (!pointsRef.current) return;
    const sp = scrollProgress.current || 0;
    const mx = mousePos.current?.x || 0;
    const my = mousePos.current?.y || 0;

    const targetRotY = sp * 0.4 + mx * 0.15;
    const targetRotX = my * 0.15;
    const targetPosY = -sp * 2.5;

    pointsRef.current.rotation.y = THREE.MathUtils.lerp(pointsRef.current.rotation.y, targetRotY, 0.08);
    pointsRef.current.rotation.x = THREE.MathUtils.lerp(pointsRef.current.rotation.x, targetRotX, 0.08);
    pointsRef.current.position.y = THREE.MathUtils.lerp(pointsRef.current.position.y, targetPosY, 0.08);
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
        size={0.075}
        vertexColors
        transparent
        opacity={0.45}
        sizeAttenuation
      />
    </points>
  );
}

// Main 3D Scene Controller
function SceneContent({ mousePos, scrollProgress }) {
  const cameraRef = useRef();

  useFrame(() => {
    if (!cameraRef.current) return;
    const sp = scrollProgress.current || 0;
    const mx = mousePos.current?.x || 0;
    const my = mousePos.current?.y || 0;

    const camX = mx * 1.2 + Math.sin(sp * Math.PI * 2) * 0.8;
    const camY = my * 0.9 - sp * 2.2;
    const camZ = 7.5 - Math.sin(sp * Math.PI) * 1.2;

    cameraRef.current.position.x = THREE.MathUtils.lerp(cameraRef.current.position.x, camX, 0.08);
    cameraRef.current.position.y = THREE.MathUtils.lerp(cameraRef.current.position.y, camY, 0.08);
    cameraRef.current.position.z = THREE.MathUtils.lerp(cameraRef.current.position.z, camZ, 0.08);

    cameraRef.current.lookAt(mx * 0.3, -sp * 2.0 + my * 0.2, -2);
  });

  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 0, 7.5]} fov={50} />

      {/* Atmospheric Soft Cinematic Lights */}
      <ambientLight intensity={0.45} />
      <directionalLight position={[6, 10, 6]} intensity={2.0} color="#ffffff" />
      <directionalLight position={[-6, -5, -3]} intensity={1.2} color="#d97706" />
      <pointLight position={[0, 2, 1]} intensity={2.2} color="#10b981" />

      {/* Floating Candlesticks & Particle Field */}
      <FloatingCandlesticks mousePos={mousePos} scrollProgress={scrollProgress} />
      <ParticleField mousePos={mousePos} scrollProgress={scrollProgress} />
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
    const timer = setTimeout(() => setShouldRenderCanvas(true), 100);
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
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden transition-opacity duration-700 opacity-80">
      {/* Dark Tint & Vignette Overlay to prevent 3D background from over-highlighting */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70 z-10 pointer-events-none" />
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
