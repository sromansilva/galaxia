import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

// --- Configuration ---
const SCENE_CONFIG = {
    bgColor: 0x050510,
    sunColor: 0xffaa00,
    sunGlowColor: 0xff4400,
    starCount: 2000,
    orbitSpeedBase: 0.2,
};

// --- Global Variables ---
let scene, camera, renderer, controls;
let sunMesh, sunGlow;
let phrasesObjects = [];
let raycaster, mouse;
let font;

// --- Initialization ---
init();
animate();

function init() {
    // 1. Scene Setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(SCENE_CONFIG.bgColor);
    scene.fog = new THREE.FogExp2(SCENE_CONFIG.bgColor, 0.002);

    // 2. Camera
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 30, 60);

    // 3. Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(renderer.domElement);

    // 4. Controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 20;
    controls.maxDistance = 200;

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 2, 300);
    scene.add(pointLight);

    // 6. Objects
    createStars();
    createSun();

    // 7. Interaction
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
    window.addEventListener('resize', onWindowResize);
    window.addEventListener('pointerdown', onPointerDown);

    // 8. Load Font & Data
    const loader = new FontLoader();
    loader.load('https://unpkg.com/three@0.160.0/examples/fonts/helvetiker_regular.typeface.json', function (loadedFont) {
        font = loadedFont;
        createSunLabel();
        loadPhrases();
    });
}

function createStars() {
    const geometry = new THREE.BufferGeometry();
    const vertices = [];

    for (let i = 0; i < SCENE_CONFIG.starCount; i++) {
        const x = (Math.random() - 0.5) * 600;
        const y = (Math.random() - 0.5) * 600;
        const z = (Math.random() - 0.5) * 600;
        vertices.push(x, y, z);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    const material = new THREE.PointsMaterial({ color: 0xffffff, size: 0.7, transparent: true, opacity: 0.8 });
    const stars = new THREE.Points(geometry, material);
    scene.add(stars);
}

function createSun() {
    // Core
    const geometry = new THREE.SphereGeometry(5, 32, 32);
    const material = new THREE.MeshStandardMaterial({
        color: SCENE_CONFIG.sunColor,
        emissive: SCENE_CONFIG.sunGlowColor,
        emissiveIntensity: 2
    });
    sunMesh = new THREE.Mesh(geometry, material);
    scene.add(sunMesh);

    // Glow (simplified as a larger transparent sphere)
    const glowGeo = new THREE.SphereGeometry(7, 32, 32);
    const glowMat = new THREE.MeshBasicMaterial({
        color: SCENE_CONFIG.sunGlowColor,
        transparent: true,
        opacity: 0.3,
        side: THREE.BackSide
    });
    sunGlow = new THREE.Mesh(glowGeo, glowMat);
    scene.add(sunGlow);
}

function createSunLabel() {
    if (!font) return;
    const textGeo = new TextGeometry('Monserrat', {
        font: font,
        size: 1.5,
        height: 0.2,
    });
    textGeo.center();
    const textMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const textMesh = new THREE.Mesh(textGeo, textMat);
    textMesh.position.y = 8;
    scene.add(textMesh);
}

async function loadPhrases() {
    try {
        const response = await fetch('/api/frases');
        const phrases = await response.json();
        phrases.forEach((phrase, index) => {
            createOrbitingPhrase(phrase, index, phrases.length);
        });
    } catch (error) {
        console.error("Error loading phrases:", error);
    }
}

function createOrbitingPhrase(phraseData, index, total) {
    if (!font) return;

    // Create Text
    const textGeo = new TextGeometry(phraseData.text.length > 15 ? phraseData.text.substring(0, 15) + '...' : phraseData.text, {
        font: font,
        size: 0.8,
        height: 0.1,
    });
    textGeo.center();
    const textMat = new THREE.MeshBasicMaterial({ color: 0x7b61ff });
    const mesh = new THREE.Mesh(textGeo, textMat);

    // Store metadata
    mesh.userData = {
        isPhrase: true,
        fullText: phraseData.text,
        date: phraseData.date,
        id: phraseData.id
    };

    // Orbital Parameters
    // Distribute orbits to avoid clutter
    const minRadius = 15;
    const maxRadius = 60;
    const radiusStep = (maxRadius - minRadius) / (total > 0 ? total : 1);

    // Add some randomness to radius but keep them somewhat separated
    const radius = minRadius + (index * radiusStep) + (Math.random() * 5);

    const orbitData = {
        mesh: mesh,
        radius: radius,
        speed: (Math.random() * 0.2 + 0.1) * (Math.random() < 0.5 ? 1 : -1), // Random direction
        angle: Math.random() * Math.PI * 2,
        inclination: (Math.random() - 0.5) * 1, // Tilt
        yOffset: (Math.random() - 0.5) * 10
    };

    phrasesObjects.push(orbitData);
    scene.add(mesh);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onPointerDown(event) {
    // Calculate mouse position in normalized device coordinates
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children);

    for (let i = 0; i < intersects.length; i++) {
        const obj = intersects[i].object;
        if (obj.userData && obj.userData.isPhrase) {
            showModal(obj.userData);
            break; // Only click the first one
        }
    }
}

function showModal(data) {
    const modal = document.getElementById('modal');
    document.getElementById('modalText').innerText = data.fullText;
    document.getElementById('modalDate').innerText = data.date;
    modal.style.display = 'block';

    document.getElementById('closeModal').onclick = () => {
        modal.style.display = 'none';
    };
}

function animate() {
    requestAnimationFrame(animate);

    const time = Date.now() * 0.001;

    // Pulse Sun
    if (sunMesh) {
        const scale = 1 + Math.sin(time * 2) * 0.05;
        sunMesh.scale.set(scale, scale, scale);
        sunGlow.scale.set(scale, scale, scale);
    }

    // Orbit Phrases
    phrasesObjects.forEach(obj => {
        obj.angle += obj.speed * 0.01;

        // Calculate position based on orbit
        // x = r * cos(angle)
        // z = r * sin(angle)
        // Apply inclination (rotation around Z or X axis effectively)

        const x = obj.radius * Math.cos(obj.angle);
        const z = obj.radius * Math.sin(obj.angle);

        // Simple inclination logic: y varies with z or x
        const y = obj.yOffset + (z * Math.sin(obj.inclination));

        obj.mesh.position.set(x, y, z);

        // Make text always face camera
        obj.mesh.lookAt(camera.position);
    });

    controls.update();
    renderer.render(scene, camera);
}
