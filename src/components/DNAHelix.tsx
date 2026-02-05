import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Vector3, CatmullRomCurve3 } from 'three';
import * as THREE from 'three';

interface DNAHelixProps {
  position?: [number, number, number];
  scale?: number;
  speed?: number;
}

export function DNAHelix({ position = [0, 0, 0], scale = 1, speed = 0.5 }: DNAHelixProps) {
  const groupRef = useRef<THREE.Group>(null);
  const rotationSpeed = speed * 0.01;

  // Create DNA helix geometry - more realistic double helix
  const { strand1, strand2, basePairs } = useMemo(() => {
    const radius = 0.5;
    const height = 12;
    const turns = 5;
    const segments = 300;
    
    const strand1Points: Vector3[] = [];
    const strand2Points: Vector3[] = [];
    const pairs: Array<{
      pos1: [number, number, number];
      pos2: [number, number, number];
      center: [number, number, number];
    }> = [];

    for (let i = 0; i <= segments; i++) {
      const t = (i / segments) * turns * Math.PI * 2;
      const y = (i / segments) * height - height / 2;
      
      // First strand
      const x1 = Math.cos(t) * radius;
      const z1 = Math.sin(t) * radius;
      strand1Points.push(new Vector3(x1, y, z1));
      
      // Second strand (opposite side)
      const x2 = Math.cos(t + Math.PI) * radius;
      const z2 = Math.sin(t + Math.PI) * radius;
      strand2Points.push(new Vector3(x2, y, z2));
      
      // Base pairs every few segments
      if (i % 10 === 0) {
        pairs.push({
          pos1: [x1, y, z1],
          pos2: [x2, y, z2],
          center: [0, y, 0],
        });
      }
    }

    return { strand1: strand1Points, strand2: strand2Points, basePairs: pairs };
  }, []);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += rotationSpeed;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* First strand - Blue */}
      <mesh>
        <tubeGeometry 
          args={[
            new CatmullRomCurve3(strand1),
            200,
            0.025,
            12,
            false
          ]} 
        />
        <meshStandardMaterial
          color="#3b82f6"
          metalness={0.9}
          roughness={0.1}
          emissive="#2563eb"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Second strand - Cyan */}
      <mesh>
        <tubeGeometry 
          args={[
            new CatmullRomCurve3(strand2),
            200,
            0.025,
            12,
            false
          ]} 
        />
        <meshStandardMaterial
          color="#06b6d4"
          metalness={0.9}
          roughness={0.1}
          emissive="#0891b2"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Base pairs - connecting the strands */}
      {basePairs.map((pair, index) => {
        const distance = Math.sqrt(
          Math.pow(pair.pos1[0] - pair.pos2[0], 2) +
          Math.pow(pair.pos1[1] - pair.pos2[1], 2) +
          Math.pow(pair.pos1[2] - pair.pos2[2], 2)
        );
        
        const centerX = (pair.pos1[0] + pair.pos2[0]) / 2;
        const centerY = (pair.pos1[1] + pair.pos2[1]) / 2;
        const centerZ = (pair.pos1[2] + pair.pos2[2]) / 2;
        
        const angleY = Math.atan2(pair.pos2[0] - pair.pos1[0], pair.pos2[2] - pair.pos1[2]);
        const angleX = Math.atan2(
          Math.sqrt(Math.pow(pair.pos2[0] - pair.pos1[0], 2) + Math.pow(pair.pos2[2] - pair.pos1[2], 2)),
          pair.pos2[1] - pair.pos1[1]
        );

        return (
          <group key={index}>
            {/* Base pair connector */}
            <mesh
              position={[centerX, centerY, centerZ]}
              rotation={[angleX, angleY, 0]}
            >
              <cylinderGeometry args={[0.02, 0.02, distance, 8]} />
              <meshStandardMaterial
                color={index % 2 === 0 ? "#10b981" : "#8b5cf6"}
                metalness={0.8}
                roughness={0.2}
                emissive={index % 2 === 0 ? "#059669" : "#7c3aed"}
                emissiveIntensity={0.4}
              />
            </mesh>
            
            {/* Nucleotide spheres */}
            <mesh position={pair.pos1 as [number, number, number]}>
              <sphereGeometry args={[0.04, 16, 16]} />
              <meshStandardMaterial
                color="#3b82f6"
                metalness={0.9}
                roughness={0.1}
                emissive="#2563eb"
                emissiveIntensity={0.5}
              />
            </mesh>
            <mesh position={pair.pos2 as [number, number, number]}>
              <sphereGeometry args={[0.04, 16, 16]} />
              <meshStandardMaterial
                color="#06b6d4"
                metalness={0.9}
                roughness={0.1}
                emissive="#0891b2"
                emissiveIntensity={0.5}
              />
            </mesh>
          </group>
        );
      })}

      {/* Glow effect for first strand */}
      <mesh>
        <tubeGeometry 
          args={[
            new CatmullRomCurve3(strand1),
            200,
            0.06,
            12,
            false
          ]} 
        />
        <meshStandardMaterial
          color="#3b82f6"
          transparent
          opacity={0.15}
          emissive="#3b82f6"
          emissiveIntensity={0.8}
        />
      </mesh>

      {/* Glow effect for second strand */}
      <mesh>
        <tubeGeometry 
          args={[
            new CatmullRomCurve3(strand2),
            200,
            0.06,
            12,
            false
          ]} 
        />
        <meshStandardMaterial
          color="#06b6d4"
          transparent
          opacity={0.15}
          emissive="#06b6d4"
          emissiveIntensity={0.8}
        />
      </mesh>
    </group>
  );
}
