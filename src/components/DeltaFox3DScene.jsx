import React, { useRef, useMemo, useEffect, Component } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PerspectiveCamera } from '@react-three/drei';
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
      return null; // Gracefully fallback to clean CSS background without crashing React
    }
    return this.props.children;
  }
}

// Procedural Metallic DeltaFox Emblem Mesh Component
function MetallicFoxHead({ mousePos, scrollYProgress }) {
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
      0, 1, 3,
      0, 4, 1,
      1, 5, 3,
      1, 4, 6,
      1, 6, 5,
      5, 2, 8,
      6, 10, 2,
      5, 8, 2,
      6, 2, 10,
      5, 7, 8,
      3, 7, 5,
      6, 10, 9,
      4, 6, 9,
      0, 3, 12,
      0, 12, 4,
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

  useFrame((state) => {
    if (!meshRef.current) return;

    const scrollVal = scrollYProgress.current || 0;

    // Direct cursor & touch tracking & scroll reaction:
    // Mouse left / Touch left (x < 0) -> Fox rotates left
    // Mouse right / Touch right (x > 0) -> Fox rotates right
    // Mouse up / Touch up (y > 0) -> Fox pitches up
    // Mouse down / Touch down (y < 0) -> Fox pitches down
    const targetRotY = (mousePos.current?.x || 0) * 0.85 + scrollVal * Math.PI * 1.8;
    const targetRotX = (mousePos.current?.y || 0) * 0.65 + Math.sin(scrollVal * Math.PI) * 0.2;
    const targetRotZ = (mousePos.current?.x || 0) * 0.25;

    meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetRotX, 0.1);
    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetRotY, 0.1);
    meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, targetRotZ, 0.1);

    // Centered base position at scroll = 0, shifting toward the side and backward as user scrolls
    const targetPosX = (mousePos.current?.x || 0) * 0.6 + scrollVal * 2.2;
    const targetPosY = (mousePos.current?.y || 0) * 0.45 - scrollVal * 1.2;
    const targetPosZ = -0.4 - scrollVal * 1.8;

    // Refined, balanced fox size
    const targetScale = 0.85 * (1 - scrollVal * 0.25);

    meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetPosX, 0.1);
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetPosY, 0.1);
    meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, targetPosZ, 0.1);

    meshRef.current.scale.setScalar(
      THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, 0.1)
    );

    meshRef.current.position.y += Math.sin(state.clock.elapsedTime * 1.8) * 0.05;
  });

  return (
    <group ref={meshRef}>
      <mesh geometry={geometry}>
        <meshStandardMaterial
          color="#18181b"
          metalness={0.96}
          roughness={0.12}
          envMapIntensity={3.2}
          wireframe={false}
        />
      </mesh>

      <mesh geometry={geometry} scale={1.012} ref={wireframeRef}>
        <meshBasicMaterial
          color="#d97706"
          wireframe={true}
          transparent={true}
          opacity={0.4}
        />
      </mesh>

      <pointLight color="#f59e0b" intensity={4.5} distance={6} position={[0, 0, 0.3]} />
    </group>
  );
}

// Synchronous WebGL availability check
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

// Main 3D Canvas Scene Container with ErrorBoundary Protection
export default function DeltaFox3DScene() {
  const mousePos = useRef({ x: 0, y: 0 });
  const scrollYProgress = useRef(0);
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = React.useState(true);

  // Defer canvas mounting until after DOM paint to guarantee instant (0ms) cold load
  const [shouldRenderCanvas, setShouldRenderCanvas] = React.useState(false);
  const [hasWebGL, setHasWebGL] = React.useState(() => checkWebGLSupport());

  useEffect(() => {
    if (!checkWebGLSupport()) {
      setHasWebGL(false);
      return;
    }

    // Defer 3D Canvas initialization by 300ms so HTML/React paints instantly on cold cache
    const timer = setTimeout(() => {
      setShouldRenderCanvas(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

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
        const x = (clientX / window.innerWidth) * 2 - 1;
        const y = -(clientY / window.innerHeight) * 2 + 1;
        mousePos.current = { x, y };
      }
    };

    const handleScroll = () => {
      const newsElem = document.getElementById('news');
      if (newsElem) {
        const newsRect = newsElem.getBoundingClientRect();
        if (newsRect.bottom < 0) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }
      } else {
        setIsVisible(true);
      }

      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll > 0) {
        scrollYProgress.current = window.scrollY / maxScroll;
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
    <div
      ref={containerRef}
      className={`fixed inset-0 z-0 pointer-events-none overflow-hidden transition-opacity duration-700 ${
        isVisible && shouldRenderCanvas ? 'opacity-80' : 'opacity-0'
      }`}
    >
      <ThreeErrorBoundary>
        {shouldRenderCanvas && (
          <Canvas
            dpr={[1, 1.5]}
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
            style={{ width: '100%', height: '100%' }}
          >
            <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={50} />

            <ambientLight intensity={0.4} />
            <directionalLight position={[5, 8, 5]} intensity={2.5} color="#ffffff" />
            <directionalLight position={[-5, -4, -2]} intensity={1.2} color="#d97706" />
            <pointLight position={[0, 4, 2]} intensity={2} color="#22c55e" />

            <MetallicFoxHead mousePos={mousePos} scrollYProgress={scrollYProgress} />
          </Canvas>
        )}
      </ThreeErrorBoundary>
    </div>
  );
}
