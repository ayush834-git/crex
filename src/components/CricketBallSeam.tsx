"use client";

import { useRef, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function CricketBallSeam() {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const currentSpeed = useRef(0.5);
  const targetSpeed = hovered ? 2.0 : 0.5;

  // Dummy 1x1 map to force USE_UV in MeshStandardMaterial
  // This allows us to use vMapUv properly in the fragment shader hook
  const dummyMap = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    return new THREE.CanvasTexture(canvas);
  }, []);

  useFrame((state, delta) => {
    if (meshRef.current) {
      currentSpeed.current = THREE.MathUtils.lerp(currentSpeed.current, targetSpeed, delta * 5);
      meshRef.current.rotation.z += currentSpeed.current * delta; // Continuous Z-axis spin
    }
  });

  return (
    <mesh
      ref={meshRef}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
      onPointerOut={(e) => { e.stopPropagation(); setHovered(false); }}
      scale={2.2}
      rotation={[-0.2, 0.4, 0]} // Tilt so Z-spin shows the seam rotating in a dynamic way
    >
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial 
        color="#CC1A1A"
        roughness={0.4}
        map={dummyMap}
        onBeforeCompile={(shader) => {
          shader.fragmentShader = shader.fragmentShader.replace(
            '#include <color_fragment>',
            `
            #include <color_fragment>
            float distToEquator = abs(vMapUv.y - 0.5);
            float seamWidth = 0.012;
            float seamMask = 1.0 - smoothstep(seamWidth, seamWidth + 0.005, distToEquator);
            float stitchFrequency = 150.0;
            float stitches = sin(vMapUv.x * stitchFrequency) * 0.5 + 0.5;
            float stitchDash = step(0.3, stitches);
            float finalSeamAlpha = seamMask * stitchDash;
            diffuseColor.rgb = mix(diffuseColor.rgb, vec3(1.0), finalSeamAlpha);
            `
          );
        }}
      />
    </mesh>
  );
}
