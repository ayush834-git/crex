"use client";

import { useRef, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function CricketBallSeam() {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Smooth rotation speed interpolation
  const currentSpeed = useRef(0.4);
  const targetSpeed = hovered ? 1.8 : 0.4;

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Lerp rotation speed for smooth acceleration/deceleration
      currentSpeed.current = THREE.MathUtils.lerp(
        currentSpeed.current,
        targetSpeed,
        delta * 3 // Adjust this multiplier to change acceleration curve
      );
      
      meshRef.current.rotation.z += currentSpeed.current * delta;
      // Slight wobble to make it feel organic
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      meshRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColorCyan: { value: new THREE.Color("#00C2E0") }, // --crex-cyan
      uColorGold: { value: new THREE.Color("#F5B800") }, // --crex-gold
      uColorDark: { value: new THREE.Color("#06080E") }, // --crex-void
    }),
    []
  );

  useFrame((state) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      if (material.uniforms) {
        material.uniforms.uTime.value = state.clock.elapsedTime;
      }
    }
  });

  // A custom shader that renders only the seam (a band around the middle)
  // and applies gold/cyan rim lights, otherwise remaining fully transparent.
  const vertexShader = `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewPosition;

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vViewPosition = -mvPosition.xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `;

  const fragmentShader = `
    uniform vec3 uColorCyan;
    uniform vec3 uColorGold;
    uniform vec3 uColorDark;
    
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewPosition;

    void main() {
      // Create a seam band around the middle of the sphere
      // vUv.y ranges from 0 to 1. The middle is 0.5.
      float distToEquator = abs(vUv.y - 0.5);
      
      // We want the seam to be a thin band
      float seamWidth = 0.05;
      float seamMask = smoothstep(seamWidth, seamWidth - 0.01, distToEquator);
      
      // Add some noise/stitching effect to the seam
      float stitchFrequency = 150.0;
      float stitches = sin(vUv.x * stitchFrequency) * 0.5 + 0.5;
      // Combine broad band with stitches
      float seamDetail = mix(0.5, 1.0, stitches);
      float finalSeamAlpha = seamMask * seamDetail;

      // Drop alpha to 0 completely outside the seam
      if (finalSeamAlpha < 0.1) discard;

      // Lighting: Rim light (Fresnel)
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(vViewPosition);

      // Simple rim light formula
      float rim = 1.0 - max(dot(viewDir, normal), 0.0);
      rim = smoothstep(0.6, 1.0, rim);

      // Left rim (gold), Right rim (cyan) relative to view
      // We approximate left/right based on normal x component in view space
      // Since vNormal is in view space, x < 0 is roughly left, x > 0 is roughly right.
      float leftMask = smoothstep(0.1, -0.5, normal.x);
      float rightMask = smoothstep(-0.1, 0.5, normal.x);

      vec3 rimColor = mix(vec3(0.0), uColorGold, leftMask * rim);
      rimColor += mix(vec3(0.0), uColorCyan, rightMask * rim);

      // Base color of the seam (dark red/brownish)
      vec3 baseColor = vec3(0.4, 0.05, 0.05);

      vec3 finalColor = baseColor * (0.3 + finalSeamAlpha * 0.7) + rimColor;

      gl_FragColor = vec4(finalColor, finalSeamAlpha);
    }
  `;

  return (
    <mesh
      ref={meshRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={2.1} // Scale exactly to overlay the photographic ball image
    >
      <sphereGeometry args={[1, 64, 64]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={true}
        depthWrite={false}
      />
    </mesh>
  );
}
