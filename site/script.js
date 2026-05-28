// Configuração da Cena
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xfcfcfc); // Fundo super branco/gelo
scene.fog = new THREE.Fog(0xfcfcfc, 10, 40);

// Configuração da Câmera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 15;

// Configuração do Renderizador
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Otimização para telas retina
document.getElementById('canvas-container').appendChild(renderer.domElement);

// Iluminação
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(10, 20, 10);
scene.add(directionalLight);

const pointLight = new THREE.PointLight(0xf0f0f0, 1, 50);
pointLight.position.set(-10, -10, -10);
scene.add(pointLight);

// Criação dos objetos (formas geométricas minimalistas)
const objects = [];
const geometry1 = new THREE.IcosahedronGeometry(1, 0);
const geometry2 = new THREE.TorusGeometry(1, 0.3, 16, 50);
const geometry3 = new THREE.OctahedronGeometry(1, 0);

// Material branco, levemente refletivo e suave
const material = new THREE.MeshStandardMaterial({ 
    color: 0xffffff,
    roughness: 0.1,
    metalness: 0.1,
    flatShading: true,
    transparent: true,
    opacity: 0.8
});

// Adicionar objetos aleatórios à cena
for (let i = 0; i < 45; i++) {
    let mesh;
    const type = Math.random();
    if (type < 0.33) mesh = new THREE.Mesh(geometry1, material);
    else if (type < 0.66) mesh = new THREE.Mesh(geometry2, material);
    else mesh = new THREE.Mesh(geometry3, material);
    
    // Posições espalhadas
    mesh.position.x = (Math.random() - 0.5) * 40;
    mesh.position.y = (Math.random() - 0.5) * 40;
    mesh.position.z = (Math.random() - 0.5) * 30 - 5;
    
    // Rotações iniciais
    mesh.rotation.x = Math.random() * Math.PI;
    mesh.rotation.y = Math.random() * Math.PI;
    
    // Tamanhos variados
    const scale = Math.random() * 1.2 + 0.3;
    mesh.scale.set(scale, scale, scale);
    
    scene.add(mesh);
    objects.push({
        mesh: mesh,
        rx: (Math.random() - 0.5) * 0.01,
        ry: (Math.random() - 0.5) * 0.01,
        oy: mesh.position.y,
        speed: Math.random() * 0.02 + 0.01
    });
}

// Interação com o Mouse
let mouseX = 0;
let mouseY = 0;

const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - windowHalfX);
    mouseY = (event.clientY - windowHalfY);
});

// Suporte a toque para dispositivos móveis
document.addEventListener('touchmove', (event) => {
    if (event.touches.length > 0) {
        mouseX = (event.touches[0].clientX - windowHalfX);
        mouseY = (event.touches[0].clientY - windowHalfY);
    }
});

// Lidar com o redimensionamento da janela
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Loop de Animação
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    
    const elapsedTime = clock.getElapsedTime();
    
    // Movimentação suave da câmera baseada no mouse
    camera.position.x += (mouseX * 0.005 - camera.position.x) * 0.05;
    camera.position.y += (-mouseY * 0.005 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);
    
    // Rotacionar objetos e adicionar efeito de flutuação
    objects.forEach((obj, i) => {
        obj.mesh.rotation.x += obj.rx;
        obj.mesh.rotation.y += obj.ry;
        
        // Flutuação suave
        obj.mesh.position.y = obj.oy + Math.sin(elapsedTime * obj.speed * 100 + i) * 0.5;
    });
    
    renderer.render(scene, camera);
}

animate();
