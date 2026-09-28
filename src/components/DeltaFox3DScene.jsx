import React, { useRef, useMemo, useEffect, Component } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import foxImg from '../assets/fox.png';

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

// Low-Poly 3D Fox Mascot Mesh (Positioned at Z = 0 Depth Plane)
function FoxMascot3D({ mousePos, scrollProgress }) {
  const meshRef = useRef();
  const [texture, setTexture] = React.useState(null);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(foxImg, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      setTexture(tex);
    });
  }, []);

  useFrame(() => {
    if (!meshRef.current) return;
    const sp = scrollProgress.current || 0;
    const mx = mousePos.current?.x || 0;
    const my = mousePos.current?.y || 0;

    const isMobile = window.innerWidth < 768;
    // Center position: targetX = 0 for mobile, mx * 0.45 for desktop centered
    const targetX = isMobile ? 0 : mx * 0.45;
    // Track camera Y motion (-sp * 2.2) so Fox remains perfectly framed throughout the entire website
    const targetY = (isMobile ? 0.3 : 0.1 + my * 0.35) - sp * 2.2;
    const targetZ = 0; // Middle depth plane (behind foreground candles, in front of background candles)

    const targetScale = 1.0;

    // On mobile devices, Fox remains stationary at center without pointer tilt reaction
    const targetRotY = isMobile ? 0 : mx * 0.35 + Math.sin(sp * Math.PI * 2) * 0.15;
    const targetRotX = isMobile ? 0 : -my * 0.25;
    const targetRotZ = isMobile ? 0 : -mx * 0.08;

    meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetX, 0.08);
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.08);
    meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, targetZ, 0.08);

    meshRef.current.scale.x = THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, 0.08);
    meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, targetScale, 0.08);
    meshRef.current.scale.z = THREE.MathUtils.lerp(meshRef.current.scale.z, targetScale, 0.08);

    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetRotY, 0.08);
    meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetRotX, 0.08);
    meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, targetRotZ, 0.08);

    // Persist Fox mascot throughout the entire website
    if (meshRef.current.material) {
      meshRef.current.material.opacity = 1.0;
      meshRef.current.visible = true;
    }
  });

  if (!texture) return null;

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const aspect = 451 / 578;
  const height = isMobile ? 3.6 : 5.2;
  const width = height * aspect;

  return (
    <mesh ref={meshRef} position={[0, 0.15, 0]}>
      <planeGeometry args={[width, height]} />
      <meshStandardMaterial
        map={texture}
        transparent={true}
        alphaTest={0.02}
        roughness={0.2}
        metalness={0.1}
        emissive="#f59e0b"
        emissiveIntensity={0.12}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// 3D Floating Candlesticks Layered into Background (Z < -2) & Foreground (Z > 1.2)
function FloatingCandlesticks({ mousePos, scrollProgress }) {
  const bgGroupRef = useRef();
  const fgGroupRef = useRef();

  // Background Candlesticks (Z < -2)
  const bgCandles = useMemo(() => {
    const items = [];
    const count = 18;
    for (let i = 0; i < count; i++) {
      const isGreen = i % 2 === 0;
      items.push({
        id: `bg-${i}`,
        isGreen,
        x: (Math.random() - 0.5) * 18,
        y: (Math.random() - 0.5) * 12,
        z: -Math.random() * 8 - 2.5, // Strictly behind Fox plane (Z = 0)
        rotX: (Math.random() - 0.5) * 0.5,
        rotY: (Math.random() - 0.5) * 0.5,
        rotZ: (Math.random() - 0.5) * 0.3,
        height: 0.8 + Math.random() * 1.6,
        scale: 0.3 + Math.random() * 0.35
      });
    }
    return items;
  }, []);

  // Foreground Candlesticks (Z > 1.2) - physically sweep IN FRONT of the Fox plane
  const fgCandles = useMemo(() => {
    const items = [
      { id: 'fg-0', isGreen: true,  x: 2.1,  y: -0.6, z: 1.8, rotX: 0.1, rotY: -0.2, rotZ: 0.05, height: 1.8, scale: 0.55 },
      { id: 'fg-1', isGreen: false, x: 3.2,  y: 0.9,  z: 2.2, rotX: -0.15, rotY: 0.2, rotZ: -0.1, height: 2.2, scale: 0.65 },
      { id: 'fg-2', isGreen: true,  x: 1.2,  y: 0.8,  z: 1.5, rotX: 0.2, rotY: 0.1, rotZ: 0.08, height: 1.6, scale: 0.5 },
      { id: 'fg-3', isGreen: false, x: -2.5, y: -0.5, z: 1.6, rotX: -0.1, rotY: -0.15, rotZ: -0.05, height: 2.0, scale: 0.58 },
      { id: 'fg-4', isGreen: true,  x: -3.8, y: 1.2,  z: 2.5, rotX: 0.15, rotY: 0.25, rotZ: 0.1, height: 2.4, scale: 0.7 },
      { id: 'fg-5', isGreen: true,  x: 0.2,  y: -1.8, z: 2.0, rotX: 0.05, rotY: -0.1, rotZ: 0.02, height: 1.5, scale: 0.48 }
    ];
    return items;
  }, []);

  useFrame(() => {
    const sp = scrollProgress.current || 0;
    const mx = mousePos.current?.x || 0;
    const my = mousePos.current?.y || 0;

    // Background Group Parallax (Subtle)
    if (bgGroupRef.current) {
      const targetRotY = sp * Math.PI * 0.6 + mx * 0.2;
      const targetRotX = my * 0.15;
      const targetPosY = sp * 3.0;

      bgGroupRef.current.rotation.y = THREE.MathUtils.lerp(bgGroupRef.current.rotation.y, targetRotY, 0.08);
      bgGroupRef.current.rotation.x = THREE.MathUtils.lerp(bgGroupRef.current.rotation.x, targetRotX, 0.08);
      bgGroupRef.current.position.y = THREE.MathUtils.lerp(bgGroupRef.current.position.y, targetPosY, 0.08);
    }

    // Foreground Group Parallax (Pronounced depth motion across foreground plane)
    if (fgGroupRef.current) {
      const targetRotY = sp * Math.PI * 0.9 + mx * 0.45;
      const targetRotX = my * 0.35;
      const targetPosX = mx * 0.8;
      const targetPosY = sp * 4.2;

      fgGroupRef.current.rotation.y = THREE.MathUtils.lerp(fgGroupRef.current.rotation.y, targetRotY, 0.08);
      fgGroupRef.current.rotation.x = THREE.MathUtils.lerp(fgGroupRef.current.rotation.x, targetRotX, 0.08);
      fgGroupRef.current.position.x = THREE.MathUtils.lerp(fgGroupRef.current.position.x, targetPosX, 0.08);
      fgGroupRef.current.position.y = THREE.MathUtils.lerp(fgGroupRef.current.position.y, targetPosY, 0.08);
    }
  });

  const renderCandleMesh = (c) => (
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
  );

  return (
    <>
      <group ref={bgGroupRef}>
        {bgCandles.map(renderCandleMesh)}
      </group>
      <group ref={fgGroupRef}>
        {fgCandles.map(renderCandleMesh)}
      </group>
    </>
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

      {/* 3D Depth Stack: Background Candlesticks & Particles -> Fox Mascot (Z=0) -> Foreground Candlesticks (Z > 1.2) */}
      <ParticleField mousePos={mousePos} scrollProgress={scrollProgress} />
      <FoxMascot3D mousePos={mousePos} scrollProgress={scrollProgress} />
      <FloatingCandlesticks mousePos={mousePos} scrollProgress={scrollProgress} />
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
