let renderer;
let scene;
let camera;
let controls;
let environment;
let plot;
let matLib;

const configs = {
    plotRadius: 200,
    timeSpeed: 0.1,
};

class Environment {
    constructor() {
        let geometry, material;

        this.segmentCount = 300;
        this.startTime = 400;

        // SUN
        geometry = new THREE.SphereGeometry(5, 32, 32);
        material = new THREE.MeshBasicMaterial({color: 0xffDD77});
        this.sun = new THREE.Mesh(geometry, material);

        // SUNLIGHT
        this.sunlight = new THREE.DirectionalLight(0xffDDCC, 1);
        this.sunlight.castShadow = true;
        this.sunlight.shadow.mapSize.width = 512 * 8;
        this.sunlight.shadow.mapSize.height = 512 * 8;
        this.sunlight.shadow.camera.left = -300;
        this.sunlight.shadow.camera.right = 300;
        this.sunlight.shadow.camera.top = 300;
        this.sunlight.shadow.camera.bottom = -300;

        // INDICATE OVAL LINE
        geometry = new THREE.Geometry();
        material = new THREE.LineBasicMaterial({color: 0xFFAA77});
        for (let i = 0; i <= this.segmentCount; i++) {
            const theta = (i / this.segmentCount) * Math.PI * 2;
            geometry.vertices.push(new THREE.Vector3(Math.sin(theta) * configs.plotRadius, Math.cos(theta) * -configs.plotRadius, 0));
        }
        this.oval = new THREE.LineSegments(geometry, material);

        scene.add(this.sun);
        scene.add(this.oval);
        scene.add(this.sunlight);
    }

    update() {
        this.startTime += configs.timeSpeed;

        const theta = (this.startTime / this.segmentCount) * Math.PI * 2;
        const sunPos = new THREE.Vector3(Math.sin(theta) * configs.plotRadius, Math.cos(theta) * -configs.plotRadius, 0);

        // const axis = new THREE.Vector3(0, 1, 0);
        // const angle = Math.PI / 2;
        // sunPos.applyAxisAngle(axis, angle);

        this.sun.position.set(sunPos.x, sunPos.y, sunPos.z);
        this.sunlight.position.set(sunPos.x, sunPos.y, sunPos.z);
    }
}

class Plot {
    constructor() {
        const geometry = new THREE.CylinderGeometry(200, 200, 1, 64);
        const material = new THREE.MeshPhongMaterial();
        material.color = new THREE.Color(0x003300);

        this.plotMesh = new THREE.Mesh(geometry, material);
        this.plotMesh.receiveShadow = true;
        this.plotMesh.castShadow = true;

        scene.add(this.plotMesh);
    }
}

class Floor {
    constructor(origin, dimensions, rotation) {
        this.origin = new THREE.Matrix4;
        this.origin = origin;
        //this.position = position;
        this.dimensions = dimensions;
        this.rotation = rotation;
        this.floorGeom = new THREE.BoxGeometry(this.dimensions.x + .5, 1, this.dimensions.z + .5);
        this.floorColor = new THREE.Color(0.9, 0.7, 0.5);
        this.floorMat = new THREE.MeshPhongMaterial();
        this.floorMat.color = this.floorColor;

        this.floorMesh = new THREE.Mesh(this.floorGeom, this.floorMat);
        this.floorMesh.receiveShadow = true;
        this.floorMesh.castShadow = true;
        this.floorMesh.applyMatrix(this.origin);
        scene.add(this.floorMesh);

        this.floorBaseMat = new THREE.MeshPhongMaterial();
        this.floorBaseMat.color = new THREE.Color(1, 0.5, 0.5);
        this.floorBaseGeom = new THREE.BoxGeometry(this.dimensions.x, 5, this.dimensions.z);

        this.floorBase = new THREE.Mesh(this.floorBaseGeom, this.floorBaseMat);
        this.floorBase.receiveShadow = true;
        const floorBaseTranslate = new THREE.Matrix4();
        floorBaseTranslate.makeTranslation(0, -2.5, 0);
        floorBaseTranslate.multiply(this.origin);
        this.floorBase.applyMatrix(floorBaseTranslate);
        scene.add(this.floorBase);
    }
}

class Wall {
    constructor(origin, dimensions, openings) {
        //this is a transform matrix to move the entire wall
        this.origin = new THREE.Matrix4();
        this.origin.multiply(origin);
        //this is an array for openings
        this.openings = [];
        //this is array for the sections of wall between openings
        this.wallSegs = [];
        //this stores a set of points donting the start/end of the wall and each split
        this.wallPoints = [];
        //this is to store the walls meshes
        this.wallMeshes = [];

        this.dims = dimensions;
        this.openings.push(new Opening(this.origin, this.dims, -6, 1, 16, 14));
        this.openings.push(new Opening(this.origin, this.dims, 9, -3, 10, 22));

        this.wallPoints.push(-this.dims.x / 2);
        for (let z = 0; z < this.openings.length; z++) {
            this.wallPoints.push(this.openings[z].widthPos - this.openings[z].width / 2);
            this.wallPoints.push(this.openings[z].widthPos + this.openings[z].width / 2);
        }
        this.wallPoints.push(this.dims.x / 2);

        for (let z = 0; z < this.wallPoints.length - 1; z++) {
            if (z % 2 === 0) {
                const combined = new THREE.Matrix4();
                const translate = new THREE.Matrix4();
                translate.makeTranslation((this.wallPoints[z] + this.wallPoints[z + 1]) / 2, 0, 0);
                combined.multiply(this.origin);
                combined.multiply(translate);

                this.wallSegGeom = new THREE.BoxGeometry(Math.abs(this.wallPoints[z] - this.wallPoints[z + 1]), this.dims.y, this.dims.z);
                this.wallSeg = new THREE.Mesh(this.wallSegGeom, matLib.wallPlain);

                this.wallSeg.castShadow = true;
                this.wallSeg.receiveShadow = true;

                this.wallSeg.applyMatrix(combined);
                this.wallSegs.push(this.wallSeg);
            }
        }
        for (let z = 0; z < this.wallSegs.length; z++) {

            scene.add(this.wallSegs[z]);
        }
    }
}

class MaterialLibrary {
    constructor() {
        this.wallPlain = new THREE.MeshPhongMaterial();
        this.wallPlain.color = new THREE.Color(1, .9, .8);
        this.wallPlain.castShadow = true;
        this.wallPlain.receiveShadow = true;
    }
}

class Opening {
    constructor(wallOrigin, wallDims, widthPos, heightPos, width, height, active) {
        this.wallOrigin = new THREE.Matrix4();
        this.wallOrigin.multiply(wallOrigin);
        this.wallDims = wallDims;
        this.widthPos = widthPos;
        this.heightPos = heightPos;
        this.width = width;
        this.height = height;
        this.active = true;

        this.transPos = new THREE.Matrix4();
        this.transPos2 = new THREE.Matrix4();
        this.transPos.multiply(this.wallOrigin);
        this.transPos2.makeTranslation(this.widthPos, this.heightPos, 0);
        this.transPos.multiply(this.transPos2);

        this.transTopPos = new THREE.Matrix4();
        this.transTopPos2 = new THREE.Matrix4();
        this.transTopPos.multiply(this.wallOrigin);
        this.transTopPos2.makeTranslation(this.widthPos, this.calcTopTranslate(), 0);
        this.transTopPos.multiply(this.transTopPos2);


        this.transBotPos = new THREE.Matrix4();
        this.transBotPos2 = new THREE.Matrix4();
        this.transBotPos.multiply(this.wallOrigin);
        this.transBotPos2.makeTranslation(this.widthPos, this.calcBotTranslate(), 0);
        this.transBotPos.multiply(this.transBotPos2);

        this.render();
    }

    render() {
        this.openingWall = new THREE.MeshPhongMaterial();
        this.openingWall.color = new THREE.Color(1, 1, 0);

        this.openingMat = new THREE.MeshBasicMaterial();
        this.openingMat.color = new THREE.Color(1, 0, 1);
        this.openingMat.wireframe = true;

        this.openingGeomTop = new THREE.BoxGeometry(this.width, this.calcTopHeight(), this.wallDims.z);
        this.openingGeomBot = new THREE.BoxGeometry(this.width, this.calcBotHeight(), this.wallDims.z);

        this.openingGeom = new THREE.BoxGeometry(this.width, this.height, this.wallDims.z);
        this.openingWallTop = new THREE.Mesh(this.openingGeomTop, matLib.wallPlain);
        this.openingWallBot = new THREE.Mesh(this.openingGeomBot, matLib.wallPlain);

        this.openingWallTop.castShadow = true;
        this.openingWallTop.receiveShadow = true;
        this.openingWallBot.castShadow = true;
        this.openingWallBot.receiveShadow = true;

        this.opening = new THREE.Mesh(this.openingGeom, this.openingMat);
        this.opening.applyMatrix(this.transPos);
        // scene.add(this.opening);

        this.openingWallTop.applyMatrix(this.transTopPos);
        this.openingWallBot.applyMatrix(this.transBotPos);
        if (this.calcTopHeight() > 0) {
            scene.add(this.openingWallTop);
        }
        if (this.calcBotHeight() > 0) {
            scene.add(this.openingWallBot);
        }
    }

    calcTopHeight() {
        return (this.wallDims.y - this.height) / 2 - this.heightPos;
    }

    calcBotHeight() {
        return (this.wallDims.y - this.height) / 2 + this.heightPos;
    }

    calcTopTranslate() {
        return this.height / 2 + ((this.wallDims.y - this.height) / 2 + this.heightPos) / 2;
    }

    calcBotTranslate() {
        return this.height / 2 - this.height - ((this.wallDims.y - this.height) / 2 - this.heightPos) / 2;
    }
}

class Room {
    constructor(dimensions, position, rotation) {
        const gridSize = 4;

        this.walls = [];
        this.floor = [];
        this.wallThickness = 1;
        this.wallGeom = new THREE.BoxGeometry(.2, 2 * gridSize, gridSize);
        this.wallColor = new THREE.Color(0.8, 0.8, 0.8);
        this.wallMat = new THREE.MeshPhongMaterial();
        this.wallMat.color = this.wallColor;
        this.dimensions = dimensions;
        this.position = position;
        this.rotation = rotation;

        this.origin = new THREE.Matrix4();
        this.origin.makeTranslation(position.x, position.y, position.z);

        this.floorGeom = new THREE.BoxGeometry(this.dimensions.x, this.dimensions.y, this.dimensions.z);
        this.floorColor = new THREE.Color(1, 0.3, 0.5);
        this.floorMat = new THREE.MeshBasicMaterial();
        this.floorMat.wireframe = true;
        this.floorMat.color = this.floorColor;

        this.floor = new Floor(this.origin, this.dimensions);
        this.generateWalls();
    }

    generateWalls() {
        for (let i = 0; i < (4); i++) {
            const combined = new THREE.Matrix4();
            const tra = new THREE.Matrix4();
            const rot = new THREE.Matrix4();
            const sca = new THREE.Matrix4();
            const traGlobalPos = new THREE.Matrix4();
            let wallLength;
            if (i === 0 || i === 2) {
                wallLength = this.dimensions.x;
                tra.makeTranslation(0, this.dimensions.y / 2, (this.dimensions.z / 2) - this.wallThickness / 2);
            } else {
                wallLength = this.dimensions.z;
                tra.makeTranslation(0, this.dimensions.y / 2, (this.dimensions.x / 2) - this.wallThickness / 2);
            }
            traGlobalPos.makeTranslation(this.position.x, this.position.z, this.position.y);
            rot.makeRotationY(i * (Math.PI / 2));

            combined.multiply(this.origin);
            combined.multiply(rot);
            combined.multiply(tra);

            const test = new THREE.Vector3(wallLength, this.dimensions.y, this.wallThickness);
            this.walls[i] = new Wall(combined, test, 2);
        }
    }
}

function init() {
    // SCENE
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x292325);
    scene.add(new THREE.AmbientLight(new THREE.Color(.6, .7, .9), 0.4));

    // CAMERA
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.set(150, 150, 250);
    camera.lookAt(0, 0, 0);
    camera.add(new THREE.PointLight(new THREE.Color(.2, .2, .2), 0.9));

    // RENDERER
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // CONTROLS
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.keyPanSpeed = 50;
    controls.update();

    // APPEND RENDERER
    document.body.appendChild(renderer.domElement);

    // EVENTS
    window.addEventListener('resize', windowResized);

    // ENVIRONMENT
    environment = new Environment();

    // PLOT
    plot = new Plot();

    // ROOMS
    matLib = new MaterialLibrary();
    roomGen();

    // RENDER
    requestAnimationFrame(render);
}

function windowResized() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.render(scene, camera);
}

function render() {
    requestAnimationFrame(render);
    environment.update();
    renderer.render(scene, camera);
    controls.update();
}

function roomGen(posX, posY, dimX, dimY) {
    const rotation = new THREE.Vector3(0, 0, 0);

    hall = new Room(new THREE.Vector3(70, 28, 20), new THREE.Vector3(-15, 5, 0), rotation);

    bedRoom1 = new Room(new THREE.Vector3(50, 28, 50), new THREE.Vector3(-25, 5, -35), rotation);
    bedRoom2 = new Room(new THREE.Vector3(50, 28, 50), new THREE.Vector3(25, 5, -35), rotation);

    bathRoom = new Room(new THREE.Vector3(30, 28, 40), new THREE.Vector3(35, 5, 10), rotation);

    loungeRoom = new Room(new THREE.Vector3(70, 28, 60), new THREE.Vector3(-15, 5, 40), rotation);

    kitchen = new Room(new THREE.Vector3(50, 28, 40), new THREE.Vector3(45, 5, 50), rotation);
}

init();
