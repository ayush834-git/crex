"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Stars, Environment } from "@react-three/drei";
import * as THREE from "three";

interface CricketBallSeamProps {
  mouseX?: number;
  mouseY?: number;
}

/**
 * Realistic White T20 Cricket Ball
 *
 * Uses THREE.MeshPhysicalMaterial for:
 *  - clearcoat  → polished lacquer finish like a real new ball
 *  - roughnessMap (procedural canvas texture) → leather grain texture
 *  - Red seams via TubeGeometry CatmullRom curves
 * Mouse parallax → group rotates toward cursor
 */
export function CricketBallSeam({ mouseX = 0, mouseY = 0 }: CricketBallSeamProps) {
  const groupRef = useRef<THREE.Group>(null);
  const targetRotX = useRef(0);
  const targetRotY = useRef(0);

  // ── Procedural leather-grain roughness texture ──────────────────────────
  const roughnessTexture = useMemo(() => {
    const size = 512;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;

    // Base — near white
    ctx.fillStyle = "#e4e4e4";
    ctx.fillRect(0, 0, size, size);

    // Leather grain: many tiny dark specs
    for (let i = 0; i < 14000; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const r = Math.random() * 1.6;
      const alpha = Math.random() * 0.35 + 0.05;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(60,60,60,${alpha})`;
      ctx.fill();
    }

    // Subtle larger pore patches
    for (let i = 0; i < 300; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const w = Math.random() * 12 + 4;
      const h = Math.random() * 3 + 1;
      const angle = Math.random() * Math.PI;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.fillStyle = `rgba(80,80,80,${Math.random() * 0.15})`;
      ctx.fillRect(-w / 2, -h / 2, w, h);
      ctx.restore();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(3, 3);
    return texture;
  }, []);

  // Same canvas to use as normal map for micro-surface detail
  const normalTexture = useMemo(() => {
    const size = 512;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;

    // Neutral normal map base (128, 128, 255 = flat normal)
    ctx.fillStyle = "#8080ff";
    ctx.fillRect(0, 0, size, size);

    for (let i = 0; i < 8000; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const r = Math.random() * 2;
      const bumpX = Math.round(Math.random() * 40 + 100);
      const bumpY = Math.round(Math.random() * 40 + 100);
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgb(${bumpX},${bumpY},255)`;
      ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(3, 3);
    return texture;
  }, []);

  // ── Seam curves (figure-8 wrapping) ────────────────────────────────────
  const curve1 = useMemo(() => {
    return new THREE.CatmullRomCurve3(
      [
        new THREE.Vector3(-1.82, 0, 0),
        new THREE.Vector3(-1.2, 0.8, 1.2),
        new THREE.Vector3(0, 1.82, 0),
        new THREE.Vector3(1.2, 0.8, -1.2),
        new THREE.Vector3(1.82, 0, 0),
        new THREE.Vector3(1.2, -0.8, 1.2),
        new THREE.Vector3(0, -1.82, 0),
        new THREE.Vector3(-1.2, -0.8, -1.2),
        new THREE.Vector3(-1.82, 0, 0),
      ],
      true
    );
  }, []);

  const curve2 = useMemo(() => {
    return new THREE.CatmullRomCurve3(
      [
        new THREE.Vector3(-1.82, 0, 0),
        new THREE.Vector3(-1.2, -0.8, 1.2),
        new THREE.Vector3(0, -1.82, 0),
        new THREE.Vector3(1.2, -0.8, -1.2),
        new THREE.Vector3(1.82, 0, 0),
        new THREE.Vector3(1.2, 0.8, 1.2),
        new THREE.Vector3(0, 1.82, 0),
        new THREE.Vector3(-1.2, 0.8, -1.2),
        new THREE.Vector3(-1.82, 0, 0),
      ],
      true
    );
  }, []);

  // ── Animation: mouse parallax + slow spin ──────────────────────────────
  useFrame((_, delta) => {
    if (!groupRef.current) return;
    targetRotX.current = THREE.MathUtils.lerp(targetRotX.current, -mouseY * 0.65, 0.065);
    targetRotY.current = THREE.MathUtils.lerp(targetRotY.current, mouseX * 0.65, 0.065);
    groupRef.current.rotation.x = targetRotX.current;
    groupRef.current.rotation.y = targetRotY.current;
    // Constant slow bowl-delivery spin on Z
    groupRef.current.rotation.z += delta * 0.35;
  });

  return (
    <>
      {/* Starfield — night stadium */}
      <Stars radius={90} depth={55} count={4000} factor={4} saturation={0} fade speed={1} />

      {/* HDRI-style environment for reflections */}
      <Environment preset="night" />

      {/* Ambient */}
      <ambientLight intensity={0.5} color="#d0e8ff" />

      {/* Main key light — warm white stadium flood */}
      <directionalLight
        position={[3, 5, 4]}
        intensity={4}
        color="#fffdf0"
        castShadow
      />

      {/* Blue accent from left for IPL brand feel */}
      <directionalLight position={[-6, 2, 2]} intensity={2.2} color="#4466EE" />

      {/* Yellow fill from below-right (floodlight bounce) */}
      <pointLight position={[4, -3, 3]} intensity={80} color="#F5C518" distance={18} decay={2} />

      {/* Subtle rim back light for silhouette definition */}
      <pointLight position={[-1, -4, -5]} intensity={30} color="#aaccff" distance={14} decay={2} />

      {/* ─── Cricket Ball Group ──────────────────────────────────────── */}
      <group ref={groupRef}>

        {/* White leather sphere — MeshPhysicalMaterial for realism */}
        <mesh receiveShadow castShadow>
          <sphereGeometry args={[1.8, 256, 256]} />
          <meshPhysicalMaterial
            color="#F0F0F0"
            roughness={0.42}
            metalness={0.0}
            roughnessMap={roughnessTexture}
            normalMap={normalTexture}
            normalScale={new THREE.Vector2(0.35, 0.35)}
            clearcoat={0.85}
            clearcoatRoughness={0.12}
            reflectivity={0.7}
            envMapIntensity={1.4}
          />
        </mesh>

        {/* ── Red seam stitching ─────────────────────────────────────── */}
        {/* Seam 1 */}
        <mesh castShadow>
          <tubeGeometry args={[curve1, 300, 0.032, 8, true]} />
          <meshStandardMaterial
            color="#CC1133"
            roughness={0.6}
            metalness={0.0}
            emissive="#881122"
            emissiveIntensity={0.3}
          />
        </mesh>

        {/* Seam 2 */}
        <mesh castShadow>
          <tubeGeometry args={[curve2, 300, 0.032, 8, true]} />
          <meshStandardMaterial
            color="#CC1133"
            roughness={0.6}
            metalness={0.0}
            emissive="#881122"
            emissiveIntensity={0.3}
          />
        </mesh>

        {/* Fine stitch rows alongside Seam 1 (inner & outer) */}
        <mesh>
          <tubeGeometry args={[
            new THREE.CatmullRomCurve3(
              curve1.getPoints(80).map(p => p.clone().multiplyScalar(1 + 0.022)),
              true
            ),
            200, 0.012, 6, true
          ]} />
          <meshStandardMaterial color="#CC1133" roughness={0.7} />
        </mesh>

        <mesh>
          <tubeGeometry args={[
            new THREE.CatmullRomCurve3(
              curve1.getPoints(80).map(p => p.clone().multiplyScalar(1 - 0.022)),
              true
            ),
            200, 0.012, 6, true
          ]} />
          <meshStandardMaterial color="#CC1133" roughness={0.7} />
        </mesh>

        {/* Fine stitch rows alongside Seam 2 */}
        <mesh>
          <tubeGeometry args={[
            new THREE.CatmullRomCurve3(
              curve2.getPoints(80).map(p => p.clone().multiplyScalar(1 + 0.022)),
              true
            ),
            200, 0.012, 6, true
          ]} />
          <meshStandardMaterial color="#CC1133" roughness={0.7} />
        </mesh>

        <mesh>
          <tubeGeometry args={[
            new THREE.CatmullRomCurve3(
              curve2.getPoints(80).map(p => p.clone().multiplyScalar(1 - 0.022)),
              true
            ),
            200, 0.012, 6, true
          ]} />
          <meshStandardMaterial color="#CC1133" roughness={0.7} />
        </mesh>
      </group>
    </>
  );
}
