"use client";

import { useRef, useMemo, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function CricketBallSeam() {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Base rotation + lerp faster rotation on hover
      const targetSpeed = hovered ? 1.8 : 0.5;
      const speed = THREE.MathUtils.lerp(0.5, targetSpeed, 0.1);
      
      groupRef.current.rotation.z += delta * speed;
      // Also slight wobble on Y
      groupRef.current.rotation.y += delta * 0.1;
    }
  });

  // Calculate seam points - figure 8 wrapping around the sphere
  const curve1 = useMemo(() => {
    const seam1Points = [
      new THREE.Vector3(-1.82, 0, 0),
      new THREE.Vector3(-1.2, 0.8, 1.2),
      new THREE.Vector3(0, 1.82, 0),
      new THREE.Vector3(1.2, 0.8, -1.2),
      new THREE.Vector3(1.82, 0, 0),
      new THREE.Vector3(1.2, -0.8, 1.2),
      new THREE.Vector3(0, -1.82, 0),
      new THREE.Vector3(-1.2, -0.8, -1.2),
      new THREE.Vector3(-1.82, 0, 0),
    ];
    return new THREE.CatmullRomCurve3(seam1Points, true);
  }, []);

  // Perpendicular curve 2 around the opposite axis
  const curve2 = useMemo(() => {
    const seam2Points = [
      new THREE.Vector3(-1.82, 0, 0),
      new THREE.Vector3(-1.2, -0.8, 1.2),
      new THREE.Vector3(0, -1.82, 0),
      new THREE.Vector3(1.2, -0.8, -1.2),
      new THREE.Vector3(1.82, 0, 0),
      new THREE.Vector3(1.2, 0.8, 1.2),
      new THREE.Vector3(0, 1.82, 0),
      new THREE.Vector3(-1.2, 0.8, -1.2),
      new THREE.Vector3(-1.82, 0, 0),
    ];
    return new THREE.CatmullRomCurve3(seam2Points, true);
  }, []);

  return (
    <group 
      ref={groupRef}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      {/* Glossy Red Ball */}
      <mesh>
        <sphereGeometry args={[1.8, 128, 128]} />
        <meshStandardMaterial 
          color="#DD1122"
          roughness={0.25}
          metalness={0.1}
        />
      </mesh>
      
      {/* Emissive White Solid Seam 1 */}
      <mesh>
        <tubeGeometry args={[curve1, 200, 0.025, 8, true]} />
        <meshStandardMaterial 
          color="#FFFFFF" 
          roughness={0.1}
          emissive="#FFFFFF"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Emissive White Solid Seam 2 */}
      <mesh>
        <tubeGeometry args={[curve2, 200, 0.025, 8, true]} />
        <meshStandardMaterial 
          color="#FFFFFF" 
          roughness={0.1}
          emissive="#FFFFFF"
          emissiveIntensity={0.3}
        />
      </mesh>
    </group>
  );
}
