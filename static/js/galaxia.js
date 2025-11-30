import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

// --- Configuration ---
const SCENE_CONFIG = {
    bgColor: 0x020205, // Deep space
    sunColor: 0xffaa00,
    sunGlowColor: 0xff4400,
    starCount: 4000,
    meteorCount: 15, // NEW: Meteors
};

// --- Global Variables ---
let scene, camera, renderer, controls;
let sunMesh, sunGlow, sunHalo;
let phrasesObjects = [];
let meteors = []; // NEW: Meteor array
let font;

// --- Initialization ---
try {
    init();
    animate();
} catch (e) {
    console.error("CRITICAL: Failed to start scene", e);
}

function init() {
    console.log("Initializing Galaxia 3D...");

    // 1. Scene Setup
    scene = new THREE.Scene();
    scene.background = null;
    scene.fog = new THREE.FogExp2(SCENE_CONFIG.bgColor, 0.001);

    // 2. Camera
    camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.set(0, 30, 90);
    camera.lookAt(0, 0, 0);

    // 3. Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Append to specific container (Defensive)
    let container = document.getElementById('canvas-container');
    if (!container) {
        console.warn("Container #canvas-container not found. Creating fallback.");
        container = document.createElement('div');
        container.id = 'canvas-container';
        container.style.position = 'absolute';
        container.style.top = '0';
        container.style.left = '0';
        container.style.width = '100%';
        container.style.height = '100%';
        document.body.appendChild(container);
    }
    container.appendChild(renderer.domElement);

    // 4. Controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.3;
    controls.minDistance = 30;
    controls.maxDistance = 300;

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffaa00, 2, 500);
    scene.add(pointLight);

    const fillLight = new THREE.DirectionalLight(0x7b61ff, 0.5);
    fillLight.position.set(-1, 1, 1);
    scene.add(fillLight);

    // 6. Objects
    createStars();
    createSun();
    createMeteors(); // NEW: Create meteors

    // 7. Load Font & Create Phrases
    const loader = new FontLoader();
    loader.load(
        'https://unpkg.com/three@0.160.0/examples/fonts/helvetiker_regular.typeface.json',
        function (loadedFont) {
            console.log("Font loaded successfully.");
            font = loadedFont;
            createSunLabel();

            // Get phrases from global variable injected by Flask
            const phrases = window.FRASES_DATA || [];
            console.log(`Loading ${phrases.length} phrases.`);
            phrases.forEach((text, index) => {
                createOrbitingPhrase(text, index, phrases.length);
            });
        },
        undefined, // onProgress
        function (err) {
            console.error("Font loading failed:", err);
        }
    );

    window.addEventListener('resize', onWindowResize);
}

function createStars() {
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    const colors = [];

    for (let i = 0; i < SCENE_CONFIG.starCount; i++) {
        const x = (Math.random() - 0.5) * 1200;
        const y = (Math.random() - 0.5) * 1200;
        const z = (Math.random() - 0.5) * 1200;
        vertices.push(x, y, z);

        // Star colors: white, blueish, pinkish
        const colorType = Math.random();
        let color = new THREE.Color();
        if (colorType > 0.9) color.setHex(0xff9de2); // Pink
        else if (colorType > 0.8) color.setHex(0x7b61ff); // Blue
        else color.setHex(0xffffff); // White

        colors.push(color.r, color.g, color.b);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 0.7,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    const stars = new THREE.Points(geometry, material);
    scene.add(stars);
}

// NEW: Create meteor shower
function createMeteors() {
    for (let i = 0; i < SCENE_CONFIG.meteorCount; i++) {
        const geometry = new THREE.CylinderGeometry(0.1, 0.3, 8, 8);
        const material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.8
        });
        const meteor = new THREE.Mesh(geometry, material);

        // Random starting position
        meteor.position.set(
            (Math.random() - 0.5) * 400,
            Math.random() * 200 + 100,
            (Math.random() - 0.5) * 400
        );

        // Random velocity
        meteor.userData = {
            velocity: new THREE.Vector3(
                (Math.random() - 0.5) * 2,
                -(Math.random() * 3 + 2), // Falling down
                (Math.random() - 0.5) * 2
            ),
            resetY: Math.random() * 200 + 100
        };

        // Rotate to point in direction of travel
        meteor.rotation.z = Math.PI / 4;

        scene.add(meteor);
        meteors.push(meteor);
    }
}

function createSun() {
    // Core
    const geometry = new THREE.SphereGeometry(6, 64, 64);
    const material = new THREE.MeshStandardMaterial({
        color: 0xffaa00,
        emissive: 0xff5500,
        emissiveIntensity: 2,
        roughness: 0.2,
        metalness: 0.5
    });
    sunMesh = new THREE.Mesh(geometry, material);
    scene.add(sunMesh);

    // Inner Glow
    const glowGeo = new THREE.SphereGeometry(9, 64, 64);
    const glowMat = new THREE.MeshBasicMaterial({
        color: 0xff4400,
        transparent: true,
        opacity: 0.15,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending
    });
    sunGlow = new THREE.Mesh(glowGeo, glowMat);
    scene.add(sunGlow);

    // Outer Halo (Sprite)
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const context = canvas.getContext('2d');
    const gradient = context.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, 'rgba(255, 150, 50, 1)');
    gradient.addColorStop(0.2, 'rgba(255, 100, 50, 0.5)');
    gradient.addColorStop(0.5, 'rgba(255, 50, 50, 0.1)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, 128, 128);

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMat = new THREE.SpriteMaterial({
        map: texture,
        color: 0xffffff,
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0.6
    });
    sunHalo = new THREE.Sprite(spriteMat);
    sunHalo.scale.set(40, 40, 1);
    scene.add(sunHalo);
}

function createSunLabel() {
    if (!font) return;
    const textGeo = new TextGeometry('Monserrat', {
        font: font,
        size: 2.5, // Larger
        height: 0.2,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.05,
        bevelSize: 0.03,
        bevelOffset: 0,
        bevelSegments: 5
    });
    textGeo.center();
    const textMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xffdd00, // More vibrant
        emissiveIntensity: 1.2
    });
    const textMesh = new THREE.Mesh(textGeo, textMat);
    textMesh.position.y = 12;
    scene.add(textMesh);
}

function createOrbitingPhrase(text, index, total) {
    if (!font) return;

    // Create Text - LARGER and more vibrant
    const textGeo = new TextGeometry(text, {
        font: font,
        size: 1.4, // Increased from 1.0
        height: 0.15, // Increased depth
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
    });
    textGeo.center();

    // More vibrant colors
    const palette = [0xff6b9d, 0x00d4ff, 0xffeb3b, 0x9c27b0, 0x4caf50];
    const colorHex = palette[index % palette.length];

    const textMat = new THREE.MeshStandardMaterial({
        color: colorHex,
        emissive: colorHex,
        emissiveIntensity: 0.6, // More glow
        roughness: 0.3,
        metalness: 0.2
    });
    const mesh = new THREE.Mesh(textGeo, textMat);

    // TIGHTER orbits - reduced radius range
    const radius = 25 + (index * 3); // Tighter, more organized

    // Less inclination for tighter clustering
    const inclination = (Math.random() - 0.5) * Math.PI * 0.3;
    const azimuth = (index / total) * Math.PI * 2; // Evenly distributed

    // Start invisible for entrance animation
    mesh.scale.set(0, 0, 0);

    const orbitData = {
        mesh: mesh,
        radius: radius,
        speed: (Math.random() * 0.05 + 0.02) * (Math.random() < 0.5 ? 1 : -1),
        angle: Math.random() * Math.PI * 2,
        inclination: inclination,
        azimuth: azimuth,
        wobbleSpeed: Math.random() * 1.5,
        wobbleOffset: Math.random() * 10,
        // Entrance animation
        animationProgress: 0,
        animationDelay: index * 0.15, // Staggered entrance
        animationStartTime: Date.now() / 1000
    };

    phrasesObjects.push(orbitData);
    scene.add(mesh);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);

    const time = Date.now() * 0.001;

    // Pulse Sun
    if (sunMesh) {
        const scale = 1 + Math.sin(time * 1.5) * 0.02;
        sunMesh.scale.set(scale, scale, scale);
        sunGlow.scale.set(scale * 1.1, scale * 1.1, scale * 1.1);
        sunGlow.rotation.y -= 0.002;

        // Pulse Halo
        const haloScale = 40 + Math.sin(time * 2) * 2;
        sunHalo.scale.set(haloScale, haloScale, 1);
        sunHalo.material.opacity = 0.5 + Math.sin(time * 1.5) * 0.1;
    }

    // Animate meteors
    meteors.forEach(meteor => {
        meteor.position.add(meteor.userData.velocity);

        // Reset when out of bounds
        if (meteor.position.y < -100) {
            meteor.position.set(
                (Math.random() - 0.5) * 400,
                meteor.userData.resetY,
                (Math.random() - 0.5) * 400
            );
        }
    });

    // Orbit Phrases with entrance animation
    phrasesObjects.forEach(obj => {
        // Entrance animation
        const timeSinceStart = time - obj.animationStartTime;
        if (timeSinceStart > obj.animationDelay && obj.animationProgress < 1) {
            obj.animationProgress = Math.min(1, (timeSinceStart - obj.animationDelay) / 1.5);
            const easeOut = 1 - Math.pow(1 - obj.animationProgress, 3);
            obj.mesh.scale.set(easeOut, easeOut, easeOut);
        }

        obj.angle += obj.speed * 0.01;

        // Parametric equation for 3D orbit
        let x = obj.radius * Math.cos(obj.angle);
        let z = obj.radius * Math.sin(obj.angle);
        let y = 0;

        // Apply inclination (Rotate around X)
        const y1 = y * Math.cos(obj.inclination) - z * Math.sin(obj.inclination);
        const z1 = y * Math.sin(obj.inclination) + z * Math.cos(obj.inclination);
        y = y1;
        z = z1;

        // Apply Azimuth (Rotate around Y)
        const x2 = x * Math.cos(obj.azimuth) - z * Math.sin(obj.azimuth);
        const z2 = x * Math.sin(obj.azimuth) + z * Math.cos(obj.azimuth);
        x = x2;
        z = z2;

        // Add "floating" wobble
        y += Math.sin(time * obj.wobbleSpeed + obj.wobbleOffset) * 0.8;

        obj.mesh.position.set(x, y, z);

        // Make text always face camera
        obj.mesh.lookAt(camera.position);
    });

    controls.update();
    renderer.render(scene, camera);
}
