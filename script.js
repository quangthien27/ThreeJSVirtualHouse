/**
 * Global vars
 */
let globalScene;
let globalCamera;
let globalGridSize;
let globalRenderer;
let globalControls;
let globalAmbientLight;

class Floor {
    constructor(dimension, position) {
        this.dimension = dimension;
        this.position = position;

        this.floorGeometry = new THREE.BoxGeometry(globalGridSize - .05, .1, globalGridSize - .05);
        this.floorColor = new THREE.Color(0.5, 0.5, 0.5);
        this.floorMaterial = new THREE.MeshPhongMaterial();
        this.floorMaterial.color = this.floorColor;

        this.partNumber = 0;
        this.floorParts = [];
    }

    generate() {
        for (let z = 0; z < this.dimension.z; z++) {
            for (let y = 0; y < this.dimension.x; y++) {
                const tra = new THREE.Matrix4();
                const traCenter = new THREE.Matrix4();
                const traGlobalPos = new THREE.Matrix4();
                const combined = new THREE.Matrix4();
                tra.makeTranslation((globalGridSize / 2) + y * globalGridSize, 0, (globalGridSize / 2) + z * globalGridSize);
                traCenter.makeTranslation(-(this.dimension.x / 2) * globalGridSize, 0, -(this.dimension.z / 2) * globalGridSize);

                traGlobalPos.makeTranslation(this.position.x * globalGridSize, 0, this.position.y * globalGridSize);
                combined.multiply(tra);
                combined.multiply(traCenter);
                combined.multiply(traGlobalPos);
                this.floorParts[this.partNumber] = new THREE.Mesh(this.floorGeometry, this.floorMaterial);
                this.floorParts[this.partNumber].applyMatrix(combined);
                this.floorParts[this.partNumber].geometry.computeBoundingBox();
                this.floorParts[this.partNumber].castShadow = true;
                this.floorParts[this.partNumber].receiveShadow = true;
                globalScene.add(this.floorParts[this.partNumber]);

                this.partNumber += 1;
            }
        }
    }
}

class Room {
    constructor(dimensions, position, rotation) {
        this.walls = [];
        this.floor = [];
        this.gridSize = 3;

        this.wallGeom = new THREE.BoxGeometry(.2, 2 * globalGridSize, globalGridSize);
        this.wallColor = new THREE.Color(0.8, 0.8, 0.8);
        this.wallMat = new THREE.MeshPhongMaterial();
        this.wallMat.color = this.wallColor;
        this.dimensions = dimensions;
        this.position = position;
        this.rotation = rotation;
    }

    generate() {
        this.floor = new Floor(this.dimensions, this.position);
        this.floor.generate();

        for (let i = 0; i < 4; i++) {
            const combined = new THREE.Matrix4();
            const tra = new THREE.Matrix4();
            const rot = new THREE.Matrix4();
            const sca = new THREE.Matrix4();
            const traGlobalPos = new THREE.Matrix4();
            if (i === 0 || i === 2) {
                sca.makeScale(1, 1, this.dimensions.z);
                tra.makeTranslation(globalGridSize * (this.dimensions.x / 2), globalGridSize, 0);
            } else {
                sca.makeScale(1, 1, this.dimensions.x);
                tra.makeTranslation(globalGridSize * (this.dimensions.z / 2), globalGridSize, 0);
            }
            traGlobalPos.makeTranslation(this.position.x * globalGridSize, this.position.z * globalGridSize, this.position.y * globalGridSize);
            rot.makeRotationY(i * (2 * Math.PI / 4));

            combined.multiply(traGlobalPos);
            combined.multiply(rot);
            combined.multiply(tra);
            combined.multiply(sca);

            this.walls[i] = new THREE.Mesh(this.wallGeom, this.wallMat);
            this.walls[i].applyMatrix(combined);
            this.walls[i].geometry.computeBoundingBox();
            this.walls[i].castShadow = true;
            this.walls[i].receiveShadow = true;

            globalScene.add(this.walls[i]);
        }
    }
}

const init = () => {
    globalScene = new THREE.Scene();
    globalCamera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    globalRenderer = new THREE.WebGLRenderer();
    globalGridSize = 6;

    // Update scene
    globalScene.background = new THREE.Color(255, 255, 255);

    // Set the position of the camera
    globalCamera.position.set(40, 40, 40);
    globalCamera.lookAt(0, 0, 0);

    // Set the size of the rendering window
    globalRenderer.setSize(window.innerWidth - 5, window.innerHeight - 5);
    globalRenderer.shadowMap.enabled = true;
    globalRenderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Add the renderer to the current document
    document.body.appendChild(globalRenderer.domElement);

    // Link the resize of the window to the update of the camera
    window.addEventListener('resize', windowResized);

    // Create rooms
    regenerateScene();

    // The same orbit control
    globalControls = new THREE.OrbitControls(globalCamera, globalRenderer.domElement);
    globalControls.keyPanSpeed = 50;
    globalControls.update();

    // Lighting, basic light from camera towards the scene
    const cameraLight = new THREE.PointLight(new THREE.Color(.2, .2, .2), 0.9);
    globalCamera.add(cameraLight);
    globalScene.add(globalCamera);

    // Add ambient lighting
    globalAmbientLight = new THREE.AmbientLight(new THREE.Color(.6, .7, .9), 0.4);
    globalScene.add(globalAmbientLight);

    // Add a sphere in the middle of the moebius strip, then create a spotlight position and color
    const spherePos = new THREE.Vector3(0, 0, 0);
    const sphereColor = new THREE.Color(0.8, 1, 1);
    const sphereGeometry = new THREE.SphereGeometry(2, 32, 32);
    const sphereMaterial = new THREE.MeshPhongMaterial();

    // Shininess and color
    sphereMaterial.color = sphereColor;
    sphereMaterial.shininess = 100;
    sphereMaterial.wireframe = false;

    // Emissive component
    const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphereMesh.castShadow = true;
    sphereMesh.receiveShadow = false;
    sphereMesh.position.copy(spherePos);

    // Then Create a spotlight position and color
    const cubeLightPos = new THREE.Vector3(0, 16, 10);
    const cubeLightColor = new THREE.Color(1, 1, 1);

    // Visualize the light
    const cubeLightGeometry = new THREE.SphereGeometry(0.25, 8, 8);
    const cubeLightMaterial = new THREE.MeshBasicMaterial();
    cubeLightMaterial.wireframe = true;

    // Create the spotlight geometry
    const cubeLightMesh = new THREE.Mesh(cubeLightGeometry, cubeLightMaterial);
    cubeLightMesh.position.copy(cubeLightPos);
    globalScene.add(cubeLightMesh);

    // And create the light, see https://threejs.org/docs/#api/lights/SpotLight
    const spotLight = new THREE.SpotLight(cubeLightColor, 2);
    spotLight.position.copy(cubeLightPos);
    spotLight.angle = Math.PI / 4;
    spotLight.penumbra = 0.5;
    spotLight.decay = 4;
    spotLight.distance = 50;
    spotLight.castShadow = true;
    spotLight.target = sphereMesh;
    globalScene.add(spotLight);

    // Update scene
    requestAnimationFrame(updateGlobalScene);
};

const windowResized = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    globalCamera.aspect = width / height;
    globalCamera.updateProjectionMatrix();

    globalRenderer.setSize(width, height);
    globalRenderer.render(globalScene, globalCamera);
};

const initRooms = (posX, posY, dimX, dimY) => {
    const dimensions = new THREE.Vector3(6, 0, 4);
    const position = new THREE.Vector3(-1, 1, 0);

    const dimensions2 = new THREE.Vector3(4, 0, 6);
    const position2 = new THREE.Vector3(4, 0, 0);

    const dimensions3 = new THREE.Vector3(4, 0, 6);
    const position3 = new THREE.Vector3(0, -4, 0);

    const position4 = new THREE.Vector3(4, -6, 0);

    const rotation = new THREE.Vector3(0, 0, 0);

    const room1 = new Room(dimensions3, position3, rotation);
    const room2 = new Room(dimensions, position, rotation);
    const room3 = new Room(dimensions2, position2, rotation);
    const room4 = new Room(dimensions2, position4, rotation);

    room1.generate();
    room2.generate();
    room3.generate();
    room4.generate();
};

const clearScene = () => {
    while (globalScene.children.length > 0) {
        // globalScene.remove(globalScene.children[0]);
    }
};

const regenerateScene = () => {
    clearScene();
    initRooms();
};

const updateGlobalScene = function () {
    requestAnimationFrame(updateGlobalScene);
    globalControls.update();
    globalRenderer.render(globalScene, globalCamera);
};

const turnLightOff = () => {
    if (globalAmbientLight.intensity === 0) {
        globalAmbientLight.intensity = 0.4;
    }
    else {
        globalAmbientLight.intensity = 0;
    }
};

init();
