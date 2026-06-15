import { useEffect, useRef, useState } from "react";
import { useStore } from "@nanostores/react";
import * as THREE from "three";
import { AsciiEffect } from "three/examples/jsm/effects/AsciiEffect.js";
import { cn } from "../lib/utils";
import { getStoredTheme, setSiteTheme, siteTheme } from "../lib/stores";

type AsciiGearsProps = {
  className?: string;
};

const LARGE_TEETH = 8;
const SMALL_TEETH = 8;
const LARGE_MODULE = 0.28;
const SMALL_MODULE = 0.16;
const GEAR_THICKNESS = 0.35;
const LARGE_GEAR_SPEED = 0.9;
const DEFAULT_CHARSET = " .:-+*=%@#";

const ASCII_PRESETS = [
  { id: "classic", label: "Classic", chars: " .:-+*=%@#" },
  { id: "blocks", label: "Blocks", chars: " ░▒▓█" },
  { id: "minimal", label: "Minimal", chars: " .·:" },
  { id: "dense", label: "Dense", chars: "@%#*+=-:. " },
  { id: "dots", label: "Dots", chars: " ·∘○●" },
  { id: "binary", label: "Binary", chars: " 01" },
] as const;

type SceneBundle = {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  gearGroup: THREE.Group;
  largeGear: THREE.Mesh;
  smallGear: THREE.Mesh;
  meshPhase: number;
  container: HTMLDivElement;
};

const DEFAULT_GEAR_SCALE = 1;
const MIN_GEAR_SCALE = 0.4;
const MAX_GEAR_SCALE = 2.5;
const CAMERA_FOV = 45;
const CAMERA_PADDING = 1.08;

function fitCameraToGroup(
  camera: THREE.PerspectiveCamera,
  group: THREE.Object3D,
  width: number,
  height: number
) {
  const bounds = new THREE.Box3().setFromObject(group);
  const center = bounds.getCenter(new THREE.Vector3());
  const size = bounds.getSize(new THREE.Vector3());

  camera.aspect = width / height;

  const halfFovTan = Math.tan((camera.fov * Math.PI) / 180 / 2);
  const distanceForHeight = (size.y / 2 / halfFovTan) * CAMERA_PADDING;
  const distanceForWidth =
    (size.x / 2 / halfFovTan / camera.aspect) * CAMERA_PADDING;
  const distance = Math.max(distanceForHeight, distanceForWidth, 0.5);

  camera.position.set(
    center.x + size.x * 0.06,
    center.y - size.y * 0.08,
    center.z + distance
  );
  camera.lookAt(center);
  camera.updateProjectionMatrix();
}

function scaleAsciiEffect(container: HTMLElement, effectRoot: HTMLElement) {
  const table = effectRoot.querySelector("table");
  if (!table) return;

  const tableEl = table as HTMLElement;
  tableEl.style.transformOrigin = "center center";

  const { width, height } = container.getBoundingClientRect();
  const tableWidth = tableEl.offsetWidth;
  const tableHeight = tableEl.offsetHeight;
  if (!width || !height || !tableWidth || !tableHeight) return;

  const scale = Math.min(width / tableWidth, height / tableHeight);
  tableEl.style.transform = `scale(${scale})`;
}

function createGearShape(
  teeth: number,
  pitchRadius: number,
  toothHeight: number,
  holeRadius: number
) {
  const shape = new THREE.Shape();
  const outerRadius = pitchRadius + toothHeight * 0.55;
  const rootRadius = pitchRadius - toothHeight * 0.4;
  const toothAngle = (Math.PI * 2) / teeth;
  const tipHalf = toothAngle * 0.2;
  const valleyHalf = toothAngle * 0.12;

  const point = (angle: number, radius: number) =>
    [Math.cos(angle) * radius, Math.sin(angle) * radius] as const;

  for (let i = 0; i < teeth; i++) {
    const base = i * toothAngle;
    const center = base + toothAngle * 0.5;

    const tipStart = center - tipHalf;
    const tipEnd = center + tipHalf;
    const valleyStart = base + valleyHalf;
    const valleyEnd = base + toothAngle - valleyHalf;

    const [startX, startY] = point(valleyStart, rootRadius);
    if (i === 0) {
      shape.moveTo(startX, startY);
    } else {
      shape.lineTo(startX, startY);
    }

    shape.lineTo(...point(tipStart, rootRadius));
    shape.lineTo(...point(tipStart, outerRadius));
    shape.lineTo(...point(tipEnd, outerRadius));
    shape.lineTo(...point(tipEnd, rootRadius));
    shape.lineTo(...point(valleyEnd, rootRadius));
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
  const toothHeight = module * 0.7;
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

function buildCustomCharset(input: string) {
  const trimmed = input.trim();
  if (!trimmed) return DEFAULT_CHARSET;
  return ` .${trimmed}`;
}

function styleEffectRoot(effectRoot: HTMLElement, isDarkMode: boolean) {
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

  if (isDarkMode) {
    effectRoot.style.color = "rgba(255, 255, 255, 0.95)";
    effectRoot.style.mixBlendMode = "screen";
  } else {
    effectRoot.style.color = "rgba(0, 0, 0, 0.9)";
    effectRoot.style.mixBlendMode = "multiply";
  }
}

function applySceneAppearance(bundle: SceneBundle, isDarkMode: boolean) {
  if (isDarkMode) {
    bundle.scene.background = new THREE.Color(0x000000);
    bundle.renderer.setClearColor(0x000000, 1);
  } else {
    bundle.scene.background = new THREE.Color(0xffffff);
    bundle.renderer.setClearColor(0xffffff, 1);
  }
}

function createAsciiEffect(
  bundle: SceneBundle,
  charset: string,
  isDarkMode: boolean,
  previous?: AsciiEffect | null
) {
  const { container, renderer, camera } = bundle;
  const { width, height } = container.getBoundingClientRect();

  if (previous) {
    container.removeChild(previous.domElement);
  }

  applySceneAppearance(bundle, isDarkMode);

  const effect = new AsciiEffect(renderer, charset, {
    invert: isDarkMode,
    resolution: 0.18,
    scale: 1,
  });

  const effectRoot = effect.domElement;
  styleEffectRoot(effectRoot, isDarkMode);
  container.appendChild(effectRoot);
  lockAsciiFont(effectRoot);

  if (width > 0 && height > 0) {
    effect.setSize(width, height);
    effect.render(bundle.scene, camera);
    scaleAsciiEffect(container, effectRoot);
  }

  return effect;
}

export default function AsciiGears({
  className = "relative w-full max-w-xl aspect-[3/2]",
}: AsciiGearsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bundleRef = useRef<SceneBundle | null>(null);
  const effectRef = useRef<AsciiEffect | null>(null);
  const clockRef = useRef<THREE.Timer | null>(null);
  const frameRef = useRef(0);

  const [presetId, setPresetId] = useState<string>("classic");
  const [customChars, setCustomChars] = useState("");
  const [charset, setCharset] = useState(DEFAULT_CHARSET);
  const [gearScale, setGearScale] = useState(DEFAULT_GEAR_SCALE);
  const [showSettings] = useState(false);
  const theme = useStore(siteTheme);
  const isDarkMode = theme === "dark";

  useEffect(() => {
    setSiteTheme(getStoredTheme());
  }, []);

  const applyPreset = (id: string) => {
    const preset = ASCII_PRESETS.find((p) => p.id === id);
    if (!preset) return;
    setPresetId(id);
    setCustomChars("");
    setCharset(preset.chars);
  };

  const applyCustom = () => {
    setPresetId("custom");
    setCharset(buildCustomCharset(customChars));
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();

    const material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      flatShading: true,
      side: THREE.DoubleSide,
    });

    const largeGear = createGearMesh(LARGE_TEETH, LARGE_MODULE, GEAR_THICKNESS, material);
    const smallGear = createGearMesh(SMALL_TEETH, SMALL_MODULE, GEAR_THICKNESS, material);

    const centerDistance = largeGear.pitchRadius + smallGear.pitchRadius;
    smallGear.mesh.position.x = centerDistance;

    const group = new THREE.Group();
    group.add(largeGear.mesh);
    group.add(smallGear.mesh);
    group.position.x = -centerDistance / 2;
    group.rotation.x = 0.45;
    group.scale.setScalar(gearScale);
    scene.add(group);

    const bounds = new THREE.Box3().setFromObject(group);
    const boundsCenter = bounds.getCenter(new THREE.Vector3());
    const boundsSize = bounds.getSize(new THREE.Vector3());
    const maxDim = Math.max(boundsSize.x, boundsSize.y, boundsSize.z);

    const pointLight = new THREE.PointLight(0xffffff, 1.8, 0, 0);
    pointLight.position.set(
      boundsCenter.x + maxDim * 1.2,
      boundsCenter.y + maxDim * 1.6,
      maxDim * 3
    );
    scene.add(pointLight);

    const fillLight = new THREE.PointLight(0xffffff, 0.35, 0, 0);
    fillLight.position.set(boundsCenter.x - maxDim * 1.5, -maxDim, maxDim * 2);
    scene.add(fillLight);

    const renderer = new THREE.WebGLRenderer({ antialias: true });

    const camera = new THREE.PerspectiveCamera(CAMERA_FOV, 1, 0.1, 100);

    const meshPhase =
      Math.PI / SMALL_TEETH - (Math.PI * 2) / (LARGE_TEETH * SMALL_TEETH);

    const bundle: SceneBundle = {
      scene,
      camera,
      renderer,
      gearGroup: group,
      largeGear: largeGear.mesh,
      smallGear: smallGear.mesh,
      meshPhase,
      container,
    };

    bundleRef.current = bundle;

    const clock = new THREE.Timer();
    clock.connect(document);
    clockRef.current = clock;

    const resize = () => {
      const { width, height } = container.getBoundingClientRect();
      if (width === 0 || height === 0) return;

      fitCameraToGroup(camera, group, width, height);
      renderer.setSize(width, height);
      effectRef.current?.setSize(width, height);
      if (effectRef.current) {
        lockAsciiFont(effectRef.current.domElement);
        scaleAsciiEffect(container, effectRef.current.domElement);
      }
    };

    const tick = () => {
      clock.update();
      const elapsed = clock.getElapsed();

      bundle.largeGear.rotation.z = elapsed * LARGE_GEAR_SPEED;
      bundle.smallGear.rotation.z =
        -elapsed * LARGE_GEAR_SPEED * (LARGE_TEETH / SMALL_TEETH) + meshPhase;

      effectRef.current?.render(scene, camera);
      frameRef.current = window.requestAnimationFrame(tick);
    };

    resize();
    tick();

    const observer = new ResizeObserver(resize);
    observer.observe(container);

    return () => {
      window.cancelAnimationFrame(frameRef.current);
      observer.disconnect();
      clock.disconnect();
      clockRef.current = null;

      if (effectRef.current) {
        container.removeChild(effectRef.current.domElement);
        effectRef.current = null;
      }

      largeGear.mesh.geometry.dispose();
      smallGear.mesh.geometry.dispose();
      material.dispose();
      renderer.dispose();
      bundleRef.current = null;
    };
  }, []);

  useEffect(() => {
    const bundle = bundleRef.current;
    if (!bundle) return;

    effectRef.current = createAsciiEffect(
      bundle,
      charset,
      isDarkMode,
      effectRef.current
    );
  }, [charset, isDarkMode]);

  useEffect(() => {
    const bundle = bundleRef.current;
    if (!bundle) return;

    bundle.gearGroup.scale.setScalar(gearScale);

    const { width, height } = bundle.container.getBoundingClientRect();
    if (width > 0 && height > 0) {
      fitCameraToGroup(bundle.camera, bundle.gearGroup, width, height);
    }
  }, [gearScale]);

  return (
    <div className={cn("relative shrink-0", className)}>
      <div
        ref={containerRef}
        className="ascii-gears absolute inset-0 overflow-hidden pointer-events-none select-none"
        aria-hidden="true"
      />

      <div className="absolute bottom-3 right-3 z-20 flex flex-col-reverse items-end gap-2 pointer-events-auto text-left">
        {/* <button
          type="button"
          onClick={() => setShowSettings((open) => !open)}
          className="rounded bg-black/50 border border-white/25 px-3 py-1 text-xs font-bold tracking-wide text-white backdrop-blur-sm hover:bg-white/15"
          aria-expanded={showSettings}
          aria-controls="gear-settings-panel"
        >
          {showSettings ? "Hide gear settings" : "Gear settings"}
        </button> */}

        {showSettings && (
          <div
            id="gear-settings-panel"
            className="flex flex-col gap-2 rounded-lg bg-black/40 border border-white/20 p-3 backdrop-blur-sm"
          >
            <label className="flex flex-col gap-1 text-xs text-white/90">
              <span className="font-bold tracking-wide">Gear size</span>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={MIN_GEAR_SCALE}
                  max={MAX_GEAR_SCALE}
                  step="0.05"
                  value={gearScale}
                  onChange={(e) => setGearScale(Number(e.target.value))}
                  className="w-36 accent-white"
                />
                <span className="w-10 text-right tabular-nums">{gearScale.toFixed(2)}×</span>
              </div>
            </label>

            <label className="flex flex-col gap-1 text-xs text-white/90">
              <span className="font-bold tracking-wide">ASCII style</span>
              <select
                value={presetId}
                onChange={(e) => applyPreset(e.target.value)}
                className="rounded bg-black/50 border border-white/25 px-2 py-1 text-white backdrop-blur-sm"
              >
                {ASCII_PRESETS.map((preset) => (
                  <option key={preset.id} value={preset.id}>
                    {preset.label}
                  </option>
                ))}
                <option value="custom">Custom</option>
              </select>
            </label>

            <label className="flex flex-col gap-1 text-xs text-white/90">
              <span>Custom characters</span>
              <div className="flex gap-1">
                <input
                  type="text"
                  value={customChars}
                  onChange={(e) => setCustomChars(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && applyCustom()}
                  placeholder="e.g. @#*+"
                  className="w-28 rounded bg-black/50 border border-white/25 px-2 py-1 text-white backdrop-blur-sm"
                />
                <button
                  type="button"
                  onClick={applyCustom}
                  className="rounded bg-white/15 border border-white/25 px-2 py-1 text-white hover:bg-white/25"
                >
                  Apply
                </button>
              </div>
            </label>
          </div>
        )}
      </div>
    </div>
  );
}
