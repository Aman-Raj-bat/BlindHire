import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface ZKCredentialVault3DProps {
  className?: string;
  isProving?: boolean;
  isVerified?: boolean;
}

export const ZKCredentialVault3D: React.FC<ZKCredentialVault3DProps> = ({
  className = '',
  isProving = false,
  isVerified = false,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setHasWebGL(false);
      return;
    }

    // Initialize Three.js Scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100,
    );
    camera.position.set(0, 1.2, 5.5);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);
    } catch {
      setHasWebGL(false);
      return;
    }

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x00d284, 2.5, 10);
    pointLight.position.set(2, 3, 2);
    scene.add(pointLight);

    const secondaryLight = new THREE.PointLight(0x6366f1, 1.5, 10);
    secondaryLight.position.set(-2, -2, -2);
    scene.add(secondaryLight);

    // Group holding the entire credential vault structure
    const vaultGroup = new THREE.Group();
    scene.add(vaultGroup);

    // 1. Central Obscured Private Identity Core (Octahedron inside wireframe cage)
    const coreGeo = new THREE.OctahedronGeometry(1.0, 1);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0x121316,
      emissive: isVerified ? 0x00d284 : isProving ? 0x6366f1 : 0x1f2128,
      emissiveIntensity: isVerified ? 0.6 : 0.2,
      roughness: 0.2,
      metalness: 0.9,
      wireframe: false,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    vaultGroup.add(coreMesh);

    // Wireframe Shield Barrier (represents privacy boundary)
    const shieldGeo = new THREE.IcosahedronGeometry(1.3, 1);
    const shieldMat = new THREE.MeshBasicMaterial({
      color: 0x2e323d,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const shieldMesh = new THREE.Mesh(shieldGeo, shieldMat);
    vaultGroup.add(shieldMesh);

    // 2. Orbital Requirement Nodes: 4 satellites representing the screened criteria
    // (Degree, GPA, Experience, Certification)
    const satelliteGroup = new THREE.Group();
    vaultGroup.add(satelliteGroup);

    const nodeGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const nodeMat = new THREE.MeshStandardMaterial({
      color: 0x00d284,
      emissive: 0x00d284,
      emissiveIntensity: 0.8,
      roughness: 0.3,
    });

    const nodeCount = 4;
    const nodes: THREE.Mesh[] = [];
    const orbitRadius = 2.1;

    for (let i = 0; i < nodeCount; i++) {
      const angle = (i / nodeCount) * Math.PI * 2;
      const mesh = new THREE.Mesh(nodeGeo, nodeMat);
      mesh.position.set(Math.cos(angle) * orbitRadius, (i % 2 === 0 ? 0.3 : -0.3), Math.sin(angle) * orbitRadius);
      satelliteGroup.add(mesh);
      nodes.push(mesh);
    }

    // 3. Orbital Ring Pathway
    const ringGeo = new THREE.RingGeometry(orbitRadius - 0.02, orbitRadius + 0.02, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x22252b,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.4,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    vaultGroup.add(ringMesh);

    // 4. Cryptographic Proof Verification Ring (Vertical ZK Aperture)
    const zkRingGeo = new THREE.TorusGeometry(1.7, 0.02, 16, 100);
    const zkRingMat = new THREE.MeshStandardMaterial({
      color: 0x00d284,
      emissive: 0x00d284,
      emissiveIntensity: isVerified ? 1.0 : 0.3,
      transparent: true,
      opacity: 0.7,
    });
    const zkRingMesh = new THREE.Mesh(zkRingGeo, zkRingMat);
    zkRingMesh.rotation.y = Math.PI / 4;
    vaultGroup.add(zkRingMesh);

    // Subtle Particle Cloud (witness entropy)
    const particleCount = 60;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePos[i] = (Math.random() - 0.5) * 3.5;
      particlePos[i + 1] = (Math.random() - 0.5) * 2.5;
      particlePos[i + 2] = (Math.random() - 0.5) * 3.5;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.03,
      color: 0x00d284,
      transparent: true,
      opacity: 0.4,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    vaultGroup.add(particles);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
    };

    container.addEventListener('mousemove', handleMouseMove);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth rotation with mouse influence
      targetX = mouseX * 0.3;
      targetY = mouseY * 0.2;

      vaultGroup.rotation.y += 0.005 + (isProving ? 0.02 : 0);
      shieldMesh.rotation.y -= 0.003;
      shieldMesh.rotation.x += 0.002;

      satelliteGroup.rotation.y += 0.008;
      zkRingMesh.rotation.z += 0.006;

      // Gentle floating bob
      vaultGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.08;

      // Mouse damping
      vaultGroup.rotation.x += (targetY - vaultGroup.rotation.x) * 0.05;
      vaultGroup.rotation.z += (-targetX * 0.5 - vaultGroup.rotation.z) * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container || !renderer) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handleMouseMove);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isProving, isVerified]);

  if (!hasWebGL) {
    // Elegant static fallback with cryptographic styling
    return (
      <div className={`relative flex items-center justify-center p-8 bg-[#111215] border border-[#1f2128] rounded-2xl ${className}`}>
        <div className="relative w-48 h-48 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-dashed border-[#2e323d] animate-spin" style={{ animationDuration: '30s' }} />
          <div className="absolute inset-4 rounded-full border border-[#00d284]/30" />
          <div className="w-20 h-20 rounded-xl bg-[#17181d] border border-[#00d284] flex flex-col items-center justify-center shadow-lg">
            <span className="text-[10px] font-mono-tech uppercase tracking-wider text-[#92939e]">ZK Core</span>
            <span className="text-xs font-semibold text-[#00d284] mt-0.5">SHIELDED</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={mountRef}
      className={`relative w-full h-full min-h-[340px] cursor-grab active:cursor-grabbing overflow-hidden ${className}`}
      role="img"
      aria-label="Interactive 3D representation of Zero-Knowledge Credential Vault"
    />
  );
};
