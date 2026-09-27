import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function OrganicBasket3D() {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 450;
    const height = container.clientHeight || 450;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 1.8, 5.2);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Group for all rotating objects
    const basketGroup = new THREE.Group();
    scene.add(basketGroup);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfffaed, 1.6);
    dirLight.position.set(5, 8, 5);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const greenFill = new THREE.PointLight(0x22c55e, 1.2, 10);
    greenFill.position.set(-3, 2, 2);
    scene.add(greenFill);

    const amberFill = new THREE.PointLight(0xf59e0b, 1.2, 10);
    amberFill.position.set(3, -1, 2);
    scene.add(amberFill);

    // Woven Basket Base (Geometry)
    const basketGeo = new THREE.CylinderGeometry(1.5, 1.1, 1.1, 24, 4, true);
    const basketMat = new THREE.MeshStandardMaterial({
      color: 0x8b5a2b,
      roughness: 0.8,
      metalness: 0.1,
      wireframe: false,
      side: THREE.DoubleSide
    });
    const basketMesh = new THREE.Mesh(basketGeo, basketMat);
    basketMesh.position.y = -0.3;
    basketGroup.add(basketMesh);

    // Basket Rim
    const rimGeo = new THREE.TorusGeometry(1.5, 0.08, 12, 32);
    const rimMat = new THREE.MeshStandardMaterial({ color: 0x6e431f, roughness: 0.7 });
    const rimMesh = new THREE.Mesh(rimGeo, rimMat);
    rimMesh.rotation.x = Math.PI / 2;
    rimMesh.position.y = 0.25;
    basketGroup.add(rimMesh);

    // Basket Handle
    const handleGeo = new THREE.TorusGeometry(1.48, 0.06, 12, 32, Math.PI);
    const handleMesh = new THREE.Mesh(handleGeo, rimMat);
    handleMesh.rotation.y = Math.PI / 2;
    handleMesh.position.y = 0.25;
    basketGroup.add(handleMesh);

    // Fruits & Veggies inside/around basket
    // 1. Red Heirloom Apple
    const appleGeo = new THREE.SphereGeometry(0.42, 20, 20);
    const appleMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.35 });
    const apple = new THREE.Mesh(appleGeo, appleMat);
    apple.position.set(0.35, 0.15, 0.2);
    basketGroup.add(apple);

    // 2. Sunny Orange
    const orangeGeo = new THREE.SphereGeometry(0.38, 20, 20);
    const orangeMat = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.45 });
    const orange = new THREE.Mesh(orangeGeo, orangeMat);
    orange.position.set(-0.45, 0.1, 0.3);
    basketGroup.add(orange);

    // 3. Crisp Green Pear / Avocado
    const pearGeo = new THREE.ConeGeometry(0.35, 0.65, 16);
    const pearMat = new THREE.MeshStandardMaterial({ color: 0x84cc16, roughness: 0.4 });
    const pear = new THREE.Mesh(pearGeo, pearMat);
    pear.rotation.z = -0.3;
    pear.position.set(-0.1, 0.25, -0.4);
    basketGroup.add(pear);

    // 4. Golden Pumpkin / Squash
    const squashGeo = new THREE.SphereGeometry(0.46, 18, 18);
    squashGeo.scale(1, 0.75, 1);
    const squashMat = new THREE.MeshStandardMaterial({ color: 0xeab308, roughness: 0.5 });
    const squash = new THREE.Mesh(squashGeo, squashMat);
    squash.position.set(0.4, 0.1, -0.3);
    basketGroup.add(squash);

    // Floating Fresh Leaves
    const leafGeo = new THREE.ConeGeometry(0.18, 0.4, 6);
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.4, side: THREE.DoubleSide });

    const leaves = [];
    for (let i = 0; i < 7; i++) {
      const leaf = new THREE.Mesh(leafGeo, leafMat);
      const angle = (i / 7) * Math.PI * 2;
      const radius = 1.3 + Math.random() * 0.4;
      leaf.position.set(Math.cos(angle) * radius, 0.4 + Math.sin(i) * 0.3, Math.sin(angle) * radius);
      leaf.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      basketGroup.add(leaf);
      leaves.push({ mesh: leaf, speed: 0.01 + Math.random() * 0.015, initialY: leaf.position.y });
    }

    // Ambient floating golden pollen particles
    const particleCount = 65;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 6;
      positions[i + 1] = (Math.random() - 0.5) * 4;
      positions[i + 2] = (Math.random() - 0.5) * 4;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xfde047,
      size: 0.05,
      transparent: true,
      opacity: 0.7
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0.2;
    let targetRotationY = 0;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetRotationY = x * 0.75;
      targetRotationX = 0.25 - y * 0.4;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth rotation toward mouse
      basketGroup.rotation.y += (targetRotationY + elapsedTime * 0.25 - basketGroup.rotation.y) * 0.05;
      basketGroup.rotation.x += (targetRotationX - basketGroup.rotation.x) * 0.05;

      // Floating wave for basket
      basketGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.08;

      // Floating leaves oscillation
      leaves.forEach((l, idx) => {
        l.mesh.rotation.y += l.speed;
        l.mesh.position.y = l.initialY + Math.sin(elapsedTime * 2 + idx) * 0.06;
      });

      // Gently rotate ambient particles
      particles.rotation.y = elapsedTime * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    // Handle Resize
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      className="position-relative w-100 h-100" 
      style={{ minHeight: '380px', cursor: 'grab' }}
      title="Interactive 3D Harvest Basket - Click and move cursor to explore"
    />
  );
}
