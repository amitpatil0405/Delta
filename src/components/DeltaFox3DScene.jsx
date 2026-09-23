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

// Procedural Sleek Metallic/Glowing Bull Model (Emerald Green Theme)
function MetallicBull({ scrollProgress }) {
  const groupRef = useRef();

  const bodyGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    // Muscular Charging Bull Body Profile
    shape.moveTo(-1.2, -0.4);
    shape.lineTo(-1.0, 0.5);
    shape.lineTo(-0.3, 0.9);
    shape.lineTo(0.5, 0.7);
    shape.lineTo(1.1, 0.3);
    shape.lineTo(1.3, -0.3);
    shape.lineTo(0.6, -0.6);
    shape.lineTo(-0.6, -0.6);
    shape.closePath();

    const extrudeSettings = { depth: 0.8, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.15, bevelThickness: 0.15 };
    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }, []);

  const hornGeometry = useMemo(() => {
    const geom = new THREE.ConeGeometry(0.18, 1.2, 16);
    geom.rotateZ(-Math.PI / 3);
    return geom;
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const sp = scrollProgress.current || 0;
    const time = state.clock.elapsedTime;

    // Charging Bull Momentum Motion
    const targetX = -2.2 + Math.sin(sp * Math.PI * 3 + time * 0.8) * 1.5;
    const targetY = 0.8 + Math.cos(time * 1.2) * 0.3 - sp * 1.2;
    const targetZ = -1.5 + Math.cos(sp * Math.PI * 2) * 2.0;

    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, 0.06);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.06);
    groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, 0.06);

    groupRef.current.rotation.y = time * 0.4 + sp * Math.PI * 2;
    groupRef.current.rotation.x = Math.sin(time * 0.8) * 0.15 + 0.1;
  });

  return (
    <group ref={groupRef} scale={0.7}>
      {/* Bull Main Body */}
      <mesh geometry={bodyGeometry} position={[0, 0, -0.4]}>
        <meshStandardMaterial
          color="#064e3b"
          metalness={0.92}
          roughness={0.15}
          emissive="#10b981"
          emissiveIntensity={0.45}
        />
      </mesh>

      {/* Horns */}
      <mesh geometry={hornGeometry} position={[0.9, 0.7, 0.3]}>
        <meshStandardMaterial color="#34d399" metalness={0.9} roughness={0.1} emissive="#059669" emissiveIntensity={0.8} />
      </mesh>
      <mesh geometry={hornGeometry} position={[0.9, 0.7, -0.3]}>
        <meshStandardMaterial color="#34d399" metalness={0.9} roughness={0.1} emissive="#059669" emissiveIntensity={0.8} />
      </mesh>

      {/* Bull Head / Snout */}
      <mesh position={[1.2, 0.2, 0]}>
        <boxGeometry args={[0.7, 0.6, 0.7]} />
        <meshStandardMaterial color="#047857" metalness={0.85} roughness={0.2} emissive="#10b981" emissiveIntensity={0.3} />
      </mesh>

      <pointLight color="#10b981" intensity={4} distance={6} position={[1, 0.5, 0]} />
    </group>
  );
}

// Procedural Sleek Metallic/Glowing Bear Model (Rose Red Theme)
function MetallicBear({ scrollProgress }) {
  const groupRef = useRef();

  const bodyGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    // Massive Power Bear Body Profile
    shape.moveTo(-1.3, -0.6);
    shape.lineTo(-1.1, 0.7);
    shape.lineTo(-0.2, 1.1);
    shape.lineTo(0.7, 0.8);
    shape.lineTo(1.2, 0.1);
    shape.lineTo(1.1, -0.5);
    shape.lineTo(0.3, -0.8);
    shape.lineTo(-0.7, -0.8);
    shape.closePath();

    const extrudeSettings = { depth: 0.9, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.18, bevelThickness: 0.18 };
    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const sp = scrollProgress.current || 0;
    const time = state.clock.elapsedTime;

    // Bear Momentum Orbit Motion
    const targetX = 2.2 - Math.sin(sp * Math.PI * 3 + time * 0.8) * 1.5;
    const targetY = -0.6 - Math.sin(time * 1.1) * 0.3 - sp * 1.2;
    const targetZ = -2.0 - Math.sin(sp * Math.PI * 2) * 1.8;

    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, 0.06);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.06);
    groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, 0.06);

    groupRef.current.rotation.y = -time * 0.4 - sp * Math.PI * 2;
    groupRef.current.rotation.x = Math.cos(time * 0.7) * 0.15 - 0.1;
  });

  return (
    <group ref={groupRef} scale={0.7}>
      {/* Bear Main Body */}
      <mesh geometry={bodyGeometry} position={[0, 0, -0.45]}>
        <meshStandardMaterial
          color="#881337"
          metalness={0.92}
          roughness={0.15}
          emissive="#f43f5e"
          emissiveIntensity={0.45}
        />
      </mesh>

      {/* Bear Head / Snout */}
      <mesh position={[-1.2, 0.3, 0]}>
        <boxGeometry args={[0.8, 0.7, 0.8]} />
        <meshStandardMaterial color="#be123c" metalness={0.85} roughness={0.2} emissive="#f43f5e" emissiveIntensity={0.4} />
      </mesh>

      {/* Bear Claws / Ears */}
      <mesh position={[-1.1, 0.8, 0.35]}>
        <sphereGeometry args={[0.2, 12, 12]} />
        <meshStandardMaterial color="#fb7185" metalness={0.9} roughness={0.1} emissive="#e11d48" emissiveIntensity={0.7} />
      </mesh>
      <mesh position={[-1.1, 0.8, -0.35]}>
        <sphereGeometry args={[0.2, 12, 12]} />
        <meshStandardMaterial color="#fb7185" metalness={0.9} roughness={0.1} emissive="#e11d48" emissiveIntensity={0.7} />
      </mesh>

      <pointLight color="#f43f5e" intensity={4} distance={6} position={[-1, 0.5, 0]} />
    </group>
  );
}

// 3D Animated NSE & BSE Floating Exchange Tokens & Light Waves
function ExchangeTokens3D({ scrollProgress }) {
  const nseRef = useRef();
  const bseRef = useRef();
  const waveRef = useRef();

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const sp = scrollProgress.current || 0;

    if (nseRef.current) {
      nseRef.current.rotation.y = time * 0.8;
      nseRef.current.position.y = 1.8 + Math.sin(time * 1.5) * 0.25 - sp * 2.0;
      nseRef.current.position.x = -3.5 + Math.cos(sp * Math.PI) * 0.5;
    }

    if (bseRef.current) {
      bseRef.current.rotation.y = -time * 0.8;
      bseRef.current.position.y = 1.8 - Math.sin(time * 1.5) * 0.25 - sp * 2.0;
      bseRef.current.position.x = 3.5 - Math.cos(sp * Math.PI) * 0.5;
    }

    if (waveRef.current) {
      waveRef.current.rotation.z = time * 0.1;
      waveRef.current.position.z = -4 - sp * 3;
    }
  });

  return (
    <group>
      {/* NSE Floating 3D Gold Token Badge */}
      <group ref={nseRef} position={[-3.5, 1.8, -2]}>
        <mesh>
          <cylinderGeometry args={[0.8, 0.8, 0.2, 32]} />
          <meshStandardMaterial color="#18181b" metalness={0.95} roughness={0.1} emissive="#f59e0b" emissiveIntensity={0.3} />
        </mesh>
        <mesh position={[0, 0, 0.11]}>
          <ringGeometry args={[0.5, 0.7, 32]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.1} emissive="#f59e0b" emissiveIntensity={0.8} />
        </mesh>
      </group>

      {/* BSE Floating 3D Amber Token Badge */}
      <group ref={bseRef} position={[3.5, 1.8, -2]}>
        <mesh>
          <cylinderGeometry args={[0.8, 0.8, 0.2, 32]} />
          <meshStandardMaterial color="#18181b" metalness={0.95} roughness={0.1} emissive="#d97706" emissiveIntensity={0.3} />
        </mesh>
        <mesh position={[0, 0, 0.11]}>
          <ringGeometry args={[0.5, 0.7, 32]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.1} emissive="#d97706" emissiveIntensity={0.8} />
        </mesh>
      </group>

      {/* Animated Light Wave Ring */}
      <group ref={waveRef} position={[0, -1, -4]} rotation={[Math.PI / 2.5, 0, 0]}>
        <mesh>
          <torusGeometry args={[7, 0.04, 16, 100]} />
          <meshBasicMaterial color="#f59e0b" transparent opacity={0.35} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 4]}>
          <torusGeometry args={[8.5, 0.03, 16, 100]} />
          <meshBasicMaterial color="#10b981" transparent opacity={0.25} />
        </mesh>
      </group>
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
      <ambientLight intensity={0.5} />
      <directionalLight position={[6, 10, 6]} intensity={3.0} color="#ffffff" />
      <directionalLight position={[-6, -5, -3]} intensity={1.5} color="#d97706" />
      <pointLight position={[0, 2, 1]} intensity={3.5} color="#10b981" />

      {/* Story 3D Objects: Bull & Bear Momentum + NSE/BSE Tokens */}
      <MetallicBull scrollProgress={scrollProgress} />
      <MetallicBear scrollProgress={scrollProgress} />
      <ExchangeTokens3D scrollProgress={scrollProgress} />
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
