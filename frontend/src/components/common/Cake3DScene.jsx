import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const Cake3DScene = ({ className = 'h-[420px] w-full' }) => {
  const mountRef = useRef(null);
  const [isInteracting, setIsInteracting] = useState(false);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // 1. Scene, Camera, Renderer
    const width = currentMount.clientWidth;
    const height = currentMount.clientHeight;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 3.2, 5.8);
    camera.lookAt(0, 0.8, 0);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    currentMount.appendChild(renderer.domElement);

    // 2. Lighting (Warm bakery studio atmosphere)
    const ambientLight = new THREE.AmbientLight(0xfff5ea, 1.2);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffedd5, 1.8);
    mainLight.position.set(4, 7, 5);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 1024;
    mainLight.shadow.mapSize.height = 1024;
    mainLight.shadow.bias = -0.001;
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0xfce7f3, 0.9);
    fillLight.position.set(-5, 3, -3);
    scene.add(fillLight);

    const candleLight = new THREE.PointLight(0xfbbf24, 2, 4);
    candleLight.position.set(0, 2.6, 0);
    scene.add(candleLight);

    // 3. Cake Group
    const cakeGroup = new THREE.Group();
    scene.add(cakeGroup);

    // Cake Stand / Golden Board
    const boardGeo = new THREE.CylinderGeometry(2.1, 2.2, 0.12, 48);
    const boardMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37, // Gold metallic
      metalness: 0.75,
      roughness: 0.25,
    });
    const board = new THREE.Mesh(boardGeo, boardMat);
    board.position.y = -0.06;
    board.receiveShadow = true;
    cakeGroup.add(board);

    // Tier 1 (Bottom Tier - Soft Rose Strawberry / Velvety Pink Cream)
    const tier1Geo = new THREE.CylinderGeometry(1.7, 1.7, 1.0, 48);
    const tier1Mat = new THREE.MeshStandardMaterial({
      color: 0xfbcfe8, // Soft rose pink
      roughness: 0.4,
      metalness: 0.05,
    });
    const tier1 = new THREE.Mesh(tier1Geo, tier1Mat);
    tier1.position.y = 0.5;
    tier1.castShadow = true;
    tier1.receiveShadow = true;
    cakeGroup.add(tier1);

    // Bottom decorative pearl ring
    const ringGeo = new THREE.TorusGeometry(1.72, 0.06, 16, 48);
    const creamWhiteMat = new THREE.MeshStandardMaterial({
      color: 0xfffbf5, // Whipped Cream
      roughness: 0.3,
    });
    const bottomRing = new THREE.Mesh(ringGeo, creamWhiteMat);
    bottomRing.rotation.x = Math.PI / 2;
    bottomRing.position.y = 0.06;
    cakeGroup.add(bottomRing);

    // Middle ribbon trim
    const ribbonGeo = new THREE.CylinderGeometry(1.71, 1.71, 0.08, 48);
    const chocoMat = new THREE.MeshStandardMaterial({
      color: 0x4e342e, // Chocolate Brown
      roughness: 0.35,
    });
    const ribbon = new THREE.Mesh(ribbonGeo, chocoMat);
    ribbon.position.y = 0.5;
    cakeGroup.add(ribbon);

    // Tier 2 (Top Tier - Vanilla Bean White / Ivory Frosting)
    const tier2Geo = new THREE.CylinderGeometry(1.15, 1.15, 0.85, 48);
    const tier2Mat = new THREE.MeshStandardMaterial({
      color: 0xfffaf0, // Vanilla Ivory
      roughness: 0.3,
      metalness: 0.05,
    });
    const tier2 = new THREE.Mesh(tier2Geo, tier2Mat);
    tier2.position.y = 1.42;
    tier2.castShadow = true;
    tier2.receiveShadow = true;
    cakeGroup.add(tier2);

    // Tier 2 Middle chocolate drip collar
    const dripCollarGeo = new THREE.CylinderGeometry(1.17, 1.17, 0.14, 48);
    const dripCollar = new THREE.Mesh(dripCollarGeo, chocoMat);
    dripCollar.position.y = 1.8;
    cakeGroup.add(dripCollar);

    // Cream piping swirls on top of Tier 2
    const swirlCount = 10;
    const swirlRadius = 0.92;
    for (let i = 0; i < swirlCount; i++) {
      const angle = (i / swirlCount) * Math.PI * 2;
      const swirlGeo = new THREE.SphereGeometry(0.12, 16, 16);
      swirlGeo.scale(1, 1.4, 1);
      const swirl = new THREE.Mesh(swirlGeo, creamWhiteMat);
      swirl.position.set(Math.cos(angle) * swirlRadius, 1.88, Math.sin(angle) * swirlRadius);
      swirl.castShadow = true;
      cakeGroup.add(swirl);
    }

    // Handcrafted Glazed Red Cherries
    const cherryCount = 5;
    const cherryRadius = 0.65;
    const cherryMat = new THREE.MeshStandardMaterial({
      color: 0xdc2626, // Glossy Ruby Red
      roughness: 0.15,
      metalness: 0.2,
    });
    for (let i = 0; i < cherryCount; i++) {
      const angle = (i / cherryCount) * Math.PI * 2 + 0.3;
      const cherryGeo = new THREE.SphereGeometry(0.13, 16, 16);
      const cherry = new THREE.Mesh(cherryGeo, cherryMat);
      cherry.position.set(Math.cos(angle) * cherryRadius, 1.95, Math.sin(angle) * cherryRadius);
      cherry.castShadow = true;
      cakeGroup.add(cherry);

      // Cherry stem
      const stemGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.22, 8);
      const stemMat = new THREE.MeshStandardMaterial({ color: 0x3f2e1a });
      const stem = new THREE.Mesh(stemGeo, stemMat);
      stem.position.set(
        Math.cos(angle) * cherryRadius + 0.03,
        2.1,
        Math.sin(angle) * cherryRadius + 0.02
      );
      stem.rotation.z = 0.25;
      cakeGroup.add(stem);
    }

    // Celebration Birthday Candle in center
    const candleGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.65, 16);
    const candleMat = new THREE.MeshStandardMaterial({
      color: 0xf43f5e, // Rose pink spiral candle
      roughness: 0.3,
    });
    const candle = new THREE.Mesh(candleGeo, candleMat);
    candle.position.set(0, 2.18, 0);
    candle.castShadow = true;
    cakeGroup.add(candle);

    // Candle flame (Teardrop flame mesh)
    const flameGeo = new THREE.ConeGeometry(0.07, 0.22, 16);
    const flameMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b, // Warm Amber Flame
    });
    const flame = new THREE.Mesh(flameGeo, flameMat);
    flame.position.set(0, 2.58, 0);
    cakeGroup.add(flame);

    // Inner blue core flame
    const flameCoreGeo = new THREE.ConeGeometry(0.03, 0.1, 16);
    const flameCoreMat = new THREE.MeshBasicMaterial({ color: 0x60a5fa });
    const flameCore = new THREE.Mesh(flameCoreGeo, flameCoreMat);
    flameCore.position.set(0, 2.52, 0);
    cakeGroup.add(flameCore);

    // 4. Ambient Sparkle & Gold Confetti Particles
    const particleCount = 45;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePos[i] = (Math.random() - 0.5) * 5;
      particlePos[i + 1] = Math.random() * 3.5;
      particlePos[i + 2] = (Math.random() - 0.5) * 5;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xf59e0b,
      size: 0.045,
      transparent: true,
      opacity: 0.8,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 5. User Interaction / Orbit Dragging
    let isDragging = false;
    let previousMouseX = 0;
    let previousMouseY = 0;
    let rotationVelocityX = 0.005; // auto-spin default
    let rotationVelocityY = 0;

    const onMouseDown = (e) => {
      isDragging = true;
      setIsInteracting(true);
      previousMouseX = e.clientX || (e.touches && e.touches[0].clientX);
      previousMouseY = e.clientY || (e.touches && e.touches[0].clientY);
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      const currentX = e.clientX || (e.touches && e.touches[0].clientX);
      const currentY = e.clientY || (e.touches && e.touches[0].clientY);

      const deltaX = currentX - previousMouseX;
      const deltaY = currentY - previousMouseY;

      cakeGroup.rotation.y += deltaX * 0.008;
      cakeGroup.rotation.x = Math.max(-0.25, Math.min(0.35, cakeGroup.rotation.x + deltaY * 0.005));

      rotationVelocityX = deltaX * 0.002;
      previousMouseX = currentX;
      previousMouseY = currentY;
    };

    const onMouseUp = () => {
      isDragging = false;
      setTimeout(() => setIsInteracting(false), 2000);
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    dom.addEventListener('touchstart', onMouseDown, { passive: true });
    window.addEventListener('touchmove', onMouseMove, { passive: true });
    window.addEventListener('touchend', onMouseUp);

    // Resize handler
    const handleResize = () => {
      if (!currentMount) return;
      const w = currentMount.clientWidth;
      const h = currentMount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // 6. Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Gentle auto-spin when not actively dragged
      if (!isDragging) {
        cakeGroup.rotation.y += 0.007;
        cakeGroup.rotation.x = Math.sin(elapsedTime * 0.5) * 0.04;
      }

      // Flickering candle flame effect
      const flameScale = 1 + Math.sin(elapsedTime * 18) * 0.08 + Math.cos(elapsedTime * 24) * 0.05;
      flame.scale.set(flameScale, flameScale * 1.1, flameScale);
      candleLight.intensity = 1.8 + Math.sin(elapsedTime * 20) * 0.5;

      // Subtle particle float
      particles.rotation.y = elapsedTime * 0.04;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      dom.removeEventListener('touchstart', onMouseDown);
      window.removeEventListener('touchmove', onMouseMove);
      window.removeEventListener('touchend', onMouseUp);
      window.removeEventListener('resize', handleResize);

      if (currentMount && dom) {
        currentMount.removeChild(dom);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className={`relative overflow-hidden cursor-grab active:cursor-grabbing ${className}`}>
      <div ref={mountRef} className="w-full h-full" />
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white/80 backdrop-blur-md text-choco-700 shadow-sm border border-rosebakery-100">
          <span className="w-2 h-2 rounded-full bg-rosebakery-500 animate-ping"></span>
          Drag to rotate 3D cake
        </span>
      </div>
    </div>
  );
};

export default Cake3DScene;

