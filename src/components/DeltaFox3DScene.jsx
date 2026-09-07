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

    const targetRotY = (mousePos.current?.x || 0) * 0.8 + scrollVal * Math.PI * 3;
    const targetRotX = -(mousePos.current?.y || 0) * 0.6 + Math.sin(scrollVal * Math.PI * 2) * 0.4;
    const targetRotZ = (mousePos.current?.x || 0) * 0.2 + Math.cos(scrollVal * Math.PI * 2) * 0.2;

    meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetRotX, 0.06);
    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetRotY, 0.06);
    meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, targetRotZ, 0.06);

    const targetPosX = Math.sin(scrollVal * Math.PI * 2.5) * 1.8 + (mousePos.current?.x || 0) * 0.3;
    const targetPosY = Math.cos(scrollVal * Math.PI * 1.8) * 0.6 + (mousePos.current?.y || 0) * 0.3;
    const targetPosZ = -2.5 + Math.sin(scrollVal * Math.PI * 3) * 0.5;
    const targetScale = 0.8 + Math.sin(scrollVal * Math.PI * 2) * 0.15;

    meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetPosX, 0.06);
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetPosY, 0.06);
    meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, targetPosZ, 0.06);

    meshRef.current.scale.setScalar(
      THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, 0.06)
    );

    meshRef.current.position.y += Math.sin(state.clock.elapsedTime * 1.8) * 0.003;
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

  // Initialize with synchronous WebGL check so Canvas is never mounted if WebGL is unavailable
  const [hasWebGL, setHasWebGL] = React.useState(() => checkWebGLSupport());

  useEffect(() => {
    if (!checkWebGLSupport()) {
      setHasWebGL(false);
      return;
    }

    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      mousePos.current = { x, y };
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

    window.addEventListener('pointermove', handleMouseMove);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('pointermove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  if (!hasWebGL) return null;

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 z-0 pointer-events-none overflow-hidden transition-opacity duration-700 ${
        isVisible ? 'opacity-80' : 'opacity-0'
      }`}
    >
      <ThreeErrorBoundary>
        <Canvas
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          style={{ width: '100%', height: '100%' }}
        >
          <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={50} />

          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 8, 5]} intensity={2.5} color="#ffffff" />
          <directionalLight position={[-5, -4, -2]} intensity={1.2} color="#d97706" />
          <pointLight position={[0, 4, 2]} intensity={2} color="#22c55e" />

          <Float speed={1.5} rotationIntensity={0.15} floatIntensity={0.25}>
            <MetallicFoxHead mousePos={mousePos} scrollYProgress={scrollYProgress} />
          </Float>
        </Canvas>
      </ThreeErrorBoundary>
    </div>
  );
}
