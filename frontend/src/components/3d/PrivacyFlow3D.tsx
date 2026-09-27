import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface PrivacyFlow3DProps {
  className?: string;
}

export const PrivacyFlow3D: React.FC<PrivacyFlow3DProps> = ({ className = '' }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setHasWebGL(false);
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      40,
      container.clientWidth / container.clientHeight,
      0.1,
      100,
    );
    camera.position.set(0, 0, 7.5);

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

    const ambient = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambient);

    const pointLight = new THREE.PointLight(0x00d284, 3, 15);
    pointLight.position.set(0, 2, 3);
    scene.add(pointLight);

    const flowGroup = new THREE.Group();
    scene.add(flowGroup);

    // Left Node: Obscured Private Data
    const leftGroup = new THREE.Group();
    leftGroup.position.set(-2.5, 0, 0);
    flowGroup.add(leftGroup);

    const privateBoxGeo = new THREE.BoxGeometry(0.8, 0.8, 0.8);
    const privateBoxMat = new THREE.MeshStandardMaterial({
      color: 0x1f2128,
      metalness: 0.8,
      roughness: 0.3,
      wireframe: false,
    });
    const privateMesh = new THREE.Mesh(privateBoxGeo, privateBoxMat);
    leftGroup.add(privateMesh);

    const cageGeo = new THREE.BoxGeometry(1.05, 1.05, 1.05);
    const cageMat = new THREE.MeshBasicMaterial({ color: 0x5e606e, wireframe: true });
    const cageMesh = new THREE.Mesh(cageGeo, cageMat);
    leftGroup.add(cageMesh);

    // Center Node: ZK Circuit Prism
    const centerGroup = new THREE.Group();
    flowGroup.add(centerGroup);

    const prismGeo = new THREE.ConeGeometry(0.9, 1.5, 4);
    const prismMat = new THREE.MeshPhysicalMaterial({
      color: 0x00d284,
      emissive: 0x00d284,
      emissiveIntensity: 0.5,
      roughness: 0.1,
      metalness: 0.2,
      transmission: 0.6,
      thickness: 0.5,
      transparent: true,
      opacity: 0.85,
    });
    const prismMesh = new THREE.Mesh(prismGeo, prismMat);
    prismMesh.rotation.x = Math.PI / 4;
    centerGroup.add(prismMesh);

    // Right Node: Verifiable Public Claim
    const rightGroup = new THREE.Group();
    rightGroup.position.set(2.5, 0, 0);
    flowGroup.add(rightGroup);

    const claimGeo = new THREE.DodecahedronGeometry(0.7);
    const claimMat = new THREE.MeshStandardMaterial({
      color: 0x00d284,
      emissive: 0x00d284,
      emissiveIntensity: 0.7,
      roughness: 0.2,
      metalness: 0.5,
    });
    const claimMesh = new THREE.Mesh(claimGeo, claimMat);
    rightGroup.add(claimMesh);

    // Connecting Beams (ZK Flow)
    const beamGeo = new THREE.CylinderGeometry(0.02, 0.02, 4.8, 16);
    const beamMat = new THREE.MeshBasicMaterial({ color: 0x00d284, transparent: true, opacity: 0.3 });
    const beam = new THREE.Mesh(beamGeo, beamMat);
    beam.rotation.z = Math.PI / 2;
    flowGroup.add(beam);

    // Flowing Data Packets
    const packetGeo = new THREE.SphereGeometry(0.06, 8, 8);
    const packetMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const packet1 = new THREE.Mesh(packetGeo, packetMat);
    const packet2 = new THREE.Mesh(packetGeo, packetMat);
    flowGroup.add(packet1);
    flowGroup.add(packet2);

    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      privateMesh.rotation.y = t * 0.4;
      cageMesh.rotation.x = t * 0.3;
      cageMesh.rotation.y = t * 0.2;

      prismMesh.rotation.y = t * 0.6;
      claimMesh.rotation.y = t * 0.5;

      // Packets flow from left (-2.5) to right (+2.5)
      const p1Pos = ((t * 1.5) % 5.0) - 2.5;
      const p2Pos = (((t * 1.5) + 2.5) % 5.0) - 2.5;
      packet1.position.set(p1Pos, 0, 0);
      packet2.position.set(p2Pos, 0, 0);

      // Packet turns green after passing center (x > 0)
      (packet1.material as THREE.MeshBasicMaterial).color.setHex(p1Pos > 0 ? 0x00d284 : 0x8e8e98);
      (packet2.material as THREE.MeshBasicMaterial).color.setHex(p2Pos > 0 ? 0x00d284 : 0x8e8e98);

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container || !renderer) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  if (!hasWebGL) {
    return (
      <div className={`p-6 bg-[#111215] border border-[#1f2128] rounded-xl text-center ${className}`}>
        <p className="text-sm font-mono-tech text-[#00d284]">PRIVATE DATA → ZK PROOF → VERIFIED QUALIFICATION</p>
      </div>
    );
  }

  return (
    <div
      ref={mountRef}
      className={`w-full h-full min-h-[220px] overflow-hidden ${className}`}
      role="img"
      aria-label="3D visualization of zero-knowledge privacy flow"
    />
  );
};
