import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function InteractiveGlobe({ size = 380, className = '' }) {
  const mountRef = useRef(null);
  const [activeMarker, setActiveMarker] = useState(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || size;
    const height = container.clientHeight || size;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 240;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Globe Group
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // 1. Base Globe Sphere (Translucent dark/emerald glass)
    const globeGeo = new THREE.SphereGeometry(70, 48, 48);
    const globeMat = new THREE.MeshBasicMaterial({
      color: 0x064e3b,
      transparent: true,
      opacity: 0.28,
      wireframe: false
    });
    const globeMesh = new THREE.Mesh(globeGeo, globeMat);
    globeGroup.add(globeMesh);

    // 2. Latitude & Longitude Wireframe Grid
    const wireGeo = new THREE.SphereGeometry(70.5, 24, 24);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      wireframe: true,
      transparent: true,
      opacity: 0.18
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    globeGroup.add(wireMesh);

    // 3. Dot Matrix Points on Globe Surface
    const pointsCount = 420;
    const pointsGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(pointsCount * 3);

    for (let i = 0; i < pointsCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / pointsCount);
      const theta = Math.sqrt(pointsCount * Math.PI) * phi;
      const r = 71;

      positions[i * 3] = r * Math.cos(theta) * Math.sin(phi);
      positions[i * 3 + 1] = r * Math.sin(theta) * Math.sin(phi);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }

    pointsGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const pointsMat = new THREE.PointsMaterial({
      color: 0x34d399,
      size: 2.2,
      transparent: true,
      opacity: 0.65
    });
    const pointCloud = new THREE.Points(pointsGeo, pointsMat);
    globeGroup.add(pointCloud);

    // 4. Regional Farmers Market Marker Pins (San Francisco, Marin, Oakridge, Sunset Harbor)
    const marketPins = [
      { name: 'Downtown Green Market', lat: 37.77, lon: -122.41, color: 0x22c55e },
      { name: 'Sunset Harbor Pavilion', lat: 37.75, lon: -122.50, color: 0x10b981 },
      { name: 'Oakridge Eco Market', lat: 37.80, lon: -122.27, color: 0xf59e0b },
      { name: 'Marin County Farm Hub', lat: 38.00, lon: -122.53, color: 0x84cc16 }
    ];

    function latLonToVector3(lat, lon, radius) {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);
      return new THREE.Vector3(
        -radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta)
      );
    }

    const pinGroup = new THREE.Group();
    marketPins.forEach(pin => {
      const pos = latLonToVector3(pin.lat, pin.lon, 72);
      const pinGeo = new THREE.SphereGeometry(2.8, 16, 16);
      const pinMat = new THREE.MeshBasicMaterial({ color: pin.color });
      const pinMesh = new THREE.Mesh(pinGeo, pinMat);
      pinMesh.position.copy(pos);
      pinGroup.add(pinMesh);

      // Glowing pulse ring
      const ringGeo = new THREE.RingGeometry(2.8, 4.5, 16);
      const ringMat = new THREE.MeshBasicMaterial({
        color: pin.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.copy(pos.clone().multiplyScalar(1.01));
      ringMesh.lookAt(pos.clone().multiplyScalar(2));
      pinGroup.add(ringMesh);
    });
    globeGroup.add(pinGroup);

    // 5. Connecting Luminous Arc
    const p1 = latLonToVector3(37.77, -122.41, 72);
    const p2 = latLonToVector3(38.00, -122.53, 72);
    const mid = p1.clone().add(p2).multiplyScalar(0.5).normalize().multiplyScalar(88);
    const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
    const curveGeo = new THREE.TubeGeometry(curve, 24, 0.75, 8, false);
    const curveMat = new THREE.MeshBasicMaterial({ color: 0x34d399, transparent: true, opacity: 0.8 });
    const arcMesh = new THREE.Mesh(curveGeo, curveMat);
    globeGroup.add(arcMesh);

    // Interactive Drag Rotation
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onMouseDown = (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      globeGroup.rotation.y += deltaX * 0.006;
      globeGroup.rotation.x += deltaY * 0.006;

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Touch support for mobile devices
    const onTouchStart = (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };
    const onTouchMove = (e) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - previousMousePosition.x;
      const deltaY = e.touches[0].clientY - previousMousePosition.y;

      globeGroup.rotation.y += deltaX * 0.006;
      globeGroup.rotation.x += deltaY * 0.006;

      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    const onTouchEnd = () => { isDragging = false; };

    domElement.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    // Animation Loop
    let animId;
    const animate = () => {
      if (!isDragging) {
        globeGroup.rotation.y += 0.0035;
      }
      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      domElement.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      domElement.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('resize', handleResize);
      if (container && domElement) container.removeChild(domElement);
      renderer.dispose();
    };
  }, [size]);

  return (
    <div className={`interactive-globe-wrapper position-relative ${className}`} style={{ width: '100%', height: `${size}px` }}>
      {/* Background Radial Atmosphere Glow */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '75%',
          height: '75%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.28) 0%, rgba(52, 211, 153, 0.1) 60%, transparent 80%)',
          filter: 'blur(25px)',
          pointerEvents: 'none'
        }}
      />

      <div ref={mountRef} style={{ width: '100%', height: '100%', cursor: 'grab' }} />

      {/* Floating Info Overlay */}
      <div className="position-absolute bottom-0 start-50 translate-middle-x mb-2 text-center pointer-events-none">
        <span className="badge rounded-pill bg-dark bg-opacity-75 text-success border border-success border-opacity-25 px-3 py-1.5 shadow-sm" style={{ fontSize: '0.74rem' }}>
          🌍 Drag to Orbit • Live Regional Farm Grid
        </span>
      </div>
    </div>
  );
}
