import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Eye, RotateCcw, Box } from "lucide-react";

export const ModelPreview = ({ modelUrl, polycount, title = "3D Asset" }) => {
  const mountRef = useRef(null);
  const [wireframe, setWireframe] = useState(false);
  const [loading, setLoading] = useState(true);
  const sceneRef = useRef(null);
  const materialsRef = useRef([]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer Setup
    const width = container.clientWidth;
    const height = container.clientHeight || 400;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color("#181A1F");

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(2.5, 2, 3);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // 2. Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 15;
    controls.minDistance = 0.5;

    // 3. Studio Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff8ee, 1.8);
    keyLight.position.set(5, 8, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x90b0ff, 1.0);
    fillLight.position.set(-5, 3, -3);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 1.2);
    rimLight.position.set(0, -4, -5);
    scene.add(rimLight);

    // Ground Grid
    const grid = new THREE.GridHelper(10, 20, 0x333945, 0x222630);
    grid.position.y = -0.01;
    scene.add(grid);

    // 4. Model Loader or Procedural Fallback
    materialsRef.current = [];
    let loadedObject = null;

    const finalizeMesh = (root) => {
      loadedObject = root;
      scene.add(root);

      // Center and normalize size
      const box = new THREE.Box3().setFromObject(root);
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 2 / (maxDim || 1);
      root.scale.setScalar(scale);

      box.setFromObject(root);
      const center = box.getCenter(new THREE.Vector3());
      root.position.sub(center);
      root.position.y += (box.max.y - box.min.y) / 2;

      // Collect materials for wireframe toggle
      root.traverse((node) => {
        if (node.isMesh && node.material) {
          if (Array.isArray(node.material)) {
            materialsRef.current.push(...node.material);
          } else {
            materialsRef.current.push(node.material);
          }
        }
      });
      setLoading(false);
    };

    if (modelUrl) {
      const loader = new GLTFLoader();
      loader.load(
        modelUrl,
        (gltf) => finalizeMesh(gltf.scene),
        undefined,
        () => {
          // Fallback to geometric sample mesh if remote fails
          const geometry = new THREE.TorusKnotGeometry(0.7, 0.25, 100, 16);
          const material = new THREE.MeshStandardMaterial({
            color: 0x4f46e5,
            metalness: 0.6,
            roughness: 0.25,
          });
          finalizeMesh(new THREE.Mesh(geometry, material));
        }
      );
    } else {
      const geometry = new THREE.IcosahedronGeometry(0.9, 1);
      const material = new THREE.MeshStandardMaterial({
        color: 0x6366f1,
        metalness: 0.3,
        roughness: 0.3,
      });
      finalizeMesh(new THREE.Mesh(geometry, material));
    }

    // 5. Animation Loop
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight || 400;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // 6. Cleanup on Unmount (Ponytail Memory Leak Prevention)
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      scene.clear();
    };
  }, [modelUrl]);

  // Wireframe toggle effect
  useEffect(() => {
    materialsRef.current.forEach((mat) => {
      if (mat) mat.wireframe = wireframe;
    });
  }, [wireframe]);

  return (
    <div className="relative w-full h-[450px] bg-[#181A1F] rounded-lg overflow-hidden border border-vault-border shadow-craft">
      {/* 3D Canvas Mount Point */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-[#181A1F]/80 flex flex-col items-center justify-center gap-3 text-white">
          <div className="w-8 h-8 border-2 border-vault-accent border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-mono tracking-wider">INITIALIZING 3D ENGINE...</span>
        </div>
      )}

      {/* Viewport Control Bar */}
      <div className="absolute top-3 left-3 flex items-center gap-2">
        <span className="bg-black/60 backdrop-blur-md text-white text-[11px] font-mono px-2.5 py-1 rounded border border-white/10 flex items-center gap-1.5">
          <Box className="w-3.5 h-3.5 text-vault-accent" />
          {title}
        </span>
        {polycount && (
          <span className="bg-black/60 backdrop-blur-md text-neutral-300 text-[11px] font-mono px-2.5 py-1 rounded border border-white/10">
            {polycount.toLocaleString()} Polys
          </span>
        )}
      </div>

      <div className="absolute bottom-3 right-3 flex items-center gap-2">
        <button
          onClick={() => setWireframe(!wireframe)}
          className={`px-3 py-1.5 rounded text-xs font-mono border transition-all flex items-center gap-1.5 ${
            wireframe
              ? "bg-vault-accent text-white border-vault-accent"
              : "bg-black/60 backdrop-blur-md text-white border-white/15 hover:bg-black/80"
          }`}
          title="Toggle Wireframe Shading"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>{wireframe ? "Shaded" : "Wireframe"}</span>
        </button>
      </div>
    </div>
  );
};

export default ModelPreview;
