import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, BufferGeometry, Float32BufferAttribute, PointsMaterial } from 'three';

const Particles: React.FC = () => {
  const particlesRef = useRef<Points>(null);
  const particleCount = 150;
  const geometry = new BufferGeometry();
  const vertices = [];

  for (let i = 0; i < particleCount; i++) {
    const x = Math.random() * 2000 - 1000;
    const y = Math.random() * 2000 - 1000;
    const z = Math.random() * 2000 - 1000;
    vertices.push(x, y, z);
  }

  geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));

  const material = new PointsMaterial({ color: 0xffffff, size: 3 });

  useFrame(() => {
    if (particlesRef.current) {
      particlesRef.current.rotation.x += 0.001;
      particlesRef.current.rotation.y += 0.001;
      particlesRef.current.rotation.z += 0.001;
    }
  });

  return (
    <points ref={particlesRef} args={[geometry, material]} />
  );
};

const ParticleBackground: React.FC = () => {
  return (
    <Canvas style={{ position: 'absolute', zIndex: -1 }}>
      <color attach="background" args={['black']} />
      <Particles />
    </Canvas>
  );
};

export default ParticleBackground;