import { useEffect, useRef } from "react";
import * as THREE from "three";
import { AsciiEffect } from "three/examples/jsm/effects/AsciiEffect.js";

const ASCII_CHARS = " .:-+*=%@#";
const LARGE_TEETH = 22;
const SMALL_TEETH = 13;
const MODULE = 0.18;
const GEAR_THICKNESS = 0.35;
const LARGE_GEAR_SPEED = 1.1; // radians per second
const LIGHT_ORBIT_SPEED = 35; // degrees per second

function createGearShape(
  teeth: number,
  pitchRadius: number,
  toothHeight: number,
  holeRadius: number
) {
  const shape = new THREE.Shape();
  const outerRadius = pitchRadius + toothHeight;
  const rootRadius = pitchRadius - toothHeight * 0.75;
  const toothAngle = (Math.PI * 2) / teeth;
  const tipSpan = toothAngle * 0.34;

  for (let i = 0; i < teeth; i++) {
    const base = i * toothAngle;
    const tipStart = base + tipSpan;
    const tipEnd = base + toothAngle - tipSpan;
    const valley = base + toothAngle * 0.5;

    const valleyX = Math.cos(valley) * rootRadius;
    const valleyY = Math.sin(valley) * rootRadius;

    if (i === 0) {
      shape.moveTo(valleyX, valleyY);
    } else {
      shape.lineTo(valleyX, valleyY);
    }

    shape.lineTo(Math.cos(tipStart) * outerRadius, Math.sin(tipStart) * outerRadius);
    shape.lineTo(Math.cos(tipEnd) * outerRadius, Math.sin(tipEnd) * outerRadius);
  }

  shape.closePath();

  const hole = new THREE.Path();
  hole.absarc(0, 0, holeRadius, 0, Math.PI * 2, true);
  shape.holes.push(hole);

  return shape;
}

function createGearMesh(
  teeth: number,
  module: number,
  thickness: number,
  material: THREE.Material
) {
  const pitchRadius = (teeth * module) / 2;
  const toothHeight = module * 0.9;
  const holeRadius = pitchRadius * 0.22;
  const shape = createGearShape(teeth, pitchRadius, toothHeight, holeRadius);

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: thickness,
    bevelEnabled: false,
    curveSegments: 12,
  });

  geometry.translate(0, 0, -thickness / 2);

  const mesh = new THREE.Mesh(geometry, material);
  return { mesh, pitchRadius };
}

function lockAsciiFont(root: HTMLElement) {
  const monospace = "'Courier New', Courier, monospace";
  root.style.fontFamily = monospace;

  for (const node of root.querySelectorAll("table, td, span")) {
    const el = node as HTMLElement;
    el.style.fontFamily = monospace;
  }
}

export default function AsciiGears() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      flatShading: true,
      side: THREE.DoubleSide,
    });

    const largeGear = createGearMesh(LARGE_TEETH, MODULE, GEAR_THICKNESS, material);
    const smallGear = createGearMesh(SMALL_TEETH, MODULE, GEAR_THICKNESS, material);

    const centerDistance = largeGear.pitchRadius + smallGear.pitchRadius;
    smallGear.mesh.position.x = centerDistance;

    const group = new THREE.Group();
    group.add(largeGear.mesh);
    group.add(smallGear.mesh);
    group.position.x = -centerDistance / 2;
    group.rotation.x = 0.35;
    scene.add(group);

    const bounds = new THREE.Box3().setFromObject(group);
    const boundsCenter = bounds.getCenter(new THREE.Vector3());
    const boundsSize = bounds.getSize(new THREE.Vector3());
    const maxDim = Math.max(boundsSize.x, boundsSize.y);

    const pointLight = new THREE.PointLight(0xffffff, 1.8, 0, 0);
    scene.add(pointLight);

    const fillLight = new THREE.PointLight(0xffffff, 0.35, 0, 0);
    fillLight.position.set(boundsCenter.x - maxDim * 1.5, -maxDim, maxDim * 2);
    scene.add(fillLight);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor(0x000000, 1);

    const effect = new AsciiEffect(renderer, ASCII_CHARS, {
      invert: true,
      resolution: 0.18,
      scale: 1,
    });

    const effectRoot = effect.domElement;
    effectRoot.style.position = "absolute";
    effectRoot.style.inset = "0";
    effectRoot.style.width = "100%";
    effectRoot.style.height = "100%";
    effectRoot.style.display = "grid";
    effectRoot.style.placeItems = "center";
    effectRoot.style.overflow = "hidden";
    effectRoot.style.pointerEvents = "none";
    effectRoot.style.userSelect = "none";
    effectRoot.style.backgroundColor = "transparent";
    effectRoot.style.color = "rgba(255, 255, 255, 0.95)";
    effectRoot.style.mixBlendMode = "screen";

    container.appendChild(effectRoot);
    lockAsciiFont(effectRoot);

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(boundsCenter.x, boundsCenter.y - maxDim * 0.15, maxDim * 3.2);
    camera.lookAt(boundsCenter);

    const clock = new THREE.Clock();
    let frameId = 0;
    let lightAngle = 45;

    const meshPhase =
      Math.PI / SMALL_TEETH - (Math.PI * 2) / (LARGE_TEETH * SMALL_TEETH);

    const updateLight = () => {
      const radius = maxDim * 2.8;
      const height = maxDim * 1.4;
      const angleRad = (lightAngle * Math.PI) / 180;
      pointLight.position.set(
        boundsCenter.x + Math.cos(angleRad) * radius,
        boundsCenter.y + height,
        Math.sin(angleRad) * radius + maxDim * 2
      );
    };

    updateLight();

    const resize = () => {
      const { width, height } = container.getBoundingClientRect();
      if (width === 0 || height === 0) return;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      effect.setSize(width, height);
      lockAsciiFont(effectRoot);
    };

    const tick = () => {
      const delta = Math.min(clock.getDelta(), 0.05);
      const elapsed = clock.elapsedTime;

      const largeAngle = elapsed * LARGE_GEAR_SPEED;
      largeGear.mesh.rotation.z = largeAngle;
      smallGear.mesh.rotation.z =
        -largeAngle * (LARGE_TEETH / SMALL_TEETH) + meshPhase;

      lightAngle = (lightAngle + LIGHT_ORBIT_SPEED * delta) % 360;
      updateLight();

      effect.render(scene, camera);
      frameId = window.requestAnimationFrame(tick);
    };

    resize();
    tick();

    const observer = new ResizeObserver(resize);
    observer.observe(container);

    return () => {
      window.cancelAnimationFrame(frameId);
      observer.disconnect();
      container.removeChild(effectRoot);

      largeGear.mesh.geometry.dispose();
      smallGear.mesh.geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="ascii-gears absolute inset-0 overflow-hidden pointer-events-none select-none"
      aria-hidden="true"
    />
  );
}
