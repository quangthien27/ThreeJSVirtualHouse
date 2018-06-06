//create the scene
var scene = new THREE.Scene();

var objects = [];
var ceilings = [];
var axis;
var ambientLight;
var gui = new dat.GUI();

var effectController = {
    sunSpeed: .5,
    enableCeiling: true,
    enableAxis: false,
    sunCircling: false,
    ambientLightIntensity: 0.4,
};

//create the perspective camera
//for parameters see https://threejs.org/docs/#api/cameras/PerspectiveCamera
var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 10, 2000000);
camera.position.set(-200, 100, 50);
camera.lookAt(0, 0, 1);

//create the WEBGL renderer
var renderer = new THREE.WebGLRenderer();

//set the size of the rendering window
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

//add the renderer to the current document
document.body.appendChild(renderer.domElement);

//this function is called when the window is resized
function MyResize() {
    var raycaster = new THREE.Raycaster();
    var mouse = new THREE.Vector2();

    raycaster.setFromCamera(mouse, camera);
    var intersects = raycaster.intersectObjects(scene.children);
    var width = window.innerWidth;
    var height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.render(scene, camera);
}

//link the resize of the window to the update of the camera
window.addEventListener('resize', MyResize);

//create the material of the cube (basic material)
var material_cube = new THREE.MeshLambertMaterial();

//set the color of the cube
var material_floorPart = new THREE.MeshLambertMaterial();
material_cube.color = new THREE.Color(1, 1, 1);
material_floorPart.color = new THREE.Color(0.8, 0.8, 0.8);

//number of loops the moebius strip do
var loop = 1;
//the displacement along Z if zero is a pure moebius strip

scene.background = new THREE.Color(0x292325);

function initSky() {
    // AXIS HELPER

    axis = new THREE.AxesHelper(10000);
    axis.visible = effectController.enableAxis;
    scene.add(axis);

    // GROUND

    var loader = new THREE.TextureLoader();
    var groundTexture = loader.load('img/grasslight-big.jpg');
    groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.repeat.set(120, 120);
    groundTexture.anisotropy = 16;
    // var groundMaterial = new THREE.MeshLambertMaterial( { map: groundTexture } );
    var groundMaterial = new THREE.MeshPhongMaterial({map: groundTexture});
    var ground = new THREE.Mesh(new THREE.PlaneBufferGeometry(10000, 10000), groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);


    // SKYDOME

    scene.fog = new THREE.Fog(scene.background, 1, 5000);
    var vertexShader = document.getElementById('vertexShader').textContent;
    var fragmentShader = document.getElementById('fragmentShader').textContent;
    var uniforms = {
        topColor: {value: new THREE.Color(0x0077ff)},
        bottomColor: {value: new THREE.Color(0xffffff)},
        offset: {value: 33},
        exponent: {value: 0.6}
    };

    scene.fog.color.copy(uniforms.bottomColor.value);
    var skyGeo = new THREE.SphereBufferGeometry(4000, 32, 15);
    var skyMat = new THREE.ShaderMaterial({vertexShader: vertexShader, fragmentShader: fragmentShader, uniforms: uniforms, side: THREE.BackSide});

    var sky = new THREE.Mesh(skyGeo, skyMat);
    scene.add(sky);
}

function guiChanged() {
    if (ceilings.length > 0) {
        ceilings.forEach(function (ceiling) {
            ceiling.visible = effectController.enableCeiling;
        });
    }
    if ('undefined' !== typeof axis) {
        axis.visible = effectController.enableAxis;
    }
    if ('undefined' !== typeof ambientLight) {
        ambientLight.intensity = effectController.ambientLightIntensity;
    }
}

gui.add(effectController, "sunSpeed", 0.05, 10.0, 0.05).onChange(guiChanged);
gui.add(effectController, "ambientLightIntensity", 0.1, 1, 0.05).onChange(guiChanged);
gui.add(effectController, "enableCeiling").onChange(guiChanged);
gui.add(effectController, "enableAxis").onChange(guiChanged);
gui.add(effectController, "sunCircling");
guiChanged();

function adaptDragAndDrop(objects) {
    var dragControls = new THREE.DragControls(objects, camera, renderer.domElement);
    dragControls.addEventListener('dragstart', function (event) {
        controls.enabled = false;
    });
    dragControls.addEventListener('dragend', function (event) {
        controls.enabled = true;
    });
}

matLib = new MaterialLibrary();
mdlLib = new ModelLibrary();
apertureLib = new ApertureLibrary();
houseLighting = new HouseLightManager();

function assignUVs(geometry, worldoffset) {

    geometry.faceVertexUvs[0] = [];

    //If noo world offset is set, set it to a blank vector3
    if (!worldoffset) {
        worldoffset = new THREE.Vector3();
    }

    geometry.faces.forEach(function (face) {

        var components = ['x', 'z', 'y'].sort(function (a, b) {
            return Math.abs(face.normal[a]) > Math.abs(face.normal[b]);
        });

        var v1 = geometry.vertices[face.a];
        var v2 = geometry.vertices[face.b];
        var v3 = geometry.vertices[face.c];

        geometry.faceVertexUvs[0].push([

            new THREE.Vector2(v1[components[0]] + worldoffset.x, v1[components[1]] + worldoffset.y + 16),
            new THREE.Vector2(v2[components[0]] + worldoffset.x, v2[components[1]] + worldoffset.y + 16),
            new THREE.Vector2(v3[components[0]] + worldoffset.x, v3[components[1]] + worldoffset.y + 16)
        ]);

    });

    geometry.uvsNeedUpdate = true;
}

//the same orbit control
controls = new THREE.OrbitControls(camera, renderer.domElement);
// controls.minPolarAngle = 0;
controls.maxPolarAngle = Math.PI / 2 - Math.PI / 180 * 5;
controls.maxDistance = 500;
controls.minDistance = 50;

//add keyboard listener
house = new House();
environment = new Environment();

var cameralight = new THREE.PointLight(new THREE.Color(.2, .2, .2), 0.9);
camera.add(cameralight);
scene.add(camera);
ambientLight = new THREE.AmbientLight(new THREE.Color(.6, .7, .9), effectController.ambientLightIntensity);
scene.add(ambientLight);

function MyUpdateLoop() {
    requestAnimationFrame(MyUpdateLoop);
    if (effectController.sunCircling) {
        environment.time += effectController.sunSpeed;
        environment.update();
    }

    // if(switch_mesh.rotation.x >= animateTo){
    //     switch_mesh.rotation.x += -0.02;
    // }
    //
    // if(switch_mesh.rotation.x <= animateTo){
    //     switch_mesh.rotation.x += 0.02;
    // }

    //console.log(environment.time);
    renderer.render(scene, camera);
}

requestAnimationFrame(MyUpdateLoop);
