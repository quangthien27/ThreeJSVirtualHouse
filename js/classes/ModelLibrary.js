class ModelLibrary {
    constructor() {
        this.manager = new THREE.LoadingManager();
        this.manager.onProgress = function (item, loaded, total) {
            console.log(item, loaded, total);
        };
    }

    load(modelName, materialName, transformMatrix) {
        //let modelName = "mdl_door_01";
        let modelPath = "mdl/"
        let modelMaterialPath = "img/mdl/"
        let objLoader = new THREE.OBJLoader(this.manager);
        objLoader.load(modelPath + modelName + ".obj", function (object) {
            var mainMesh;
            object.traverse(function (child) {
                if (child instanceof THREE.Mesh) {
                    mainMesh = child;
                }
            });

            mainMesh.castShadow = true;
            mainMesh.receiveShadow = true;

            let textureLoader = new THREE.TextureLoader();
            mainMesh.material = new THREE.MeshStandardMaterial({
                map: textureLoader.load(modelMaterialPath + materialName + '_basecolor.png'),
                normalMap: textureLoader.load(modelMaterialPath + materialName + '_normal.png'),
                roughnessMap: textureLoader.load(modelMaterialPath + materialName + '_roughness.png'),
                metalnessMap: textureLoader.load(modelMaterialPath + materialName + '_metallic.png'),
                aoMap: textureLoader.load(modelMaterialPath + materialName + '_ao.png'),
                aoMapIntensity: .5,  // The ao map appears to quash the reflectionCube.
            });

            // The fire hydrant uses UDIM, but is able to operate without UDIM via simple
            // texture coordinate wrapping.  This is because only symmetric parts are placed
            // in UDIM space, and can re-use the main texture via wrapped coordinates.
            // https://support.allegorithmic.com/documentation/display/SPDOC/UDIM
            function wrap(texture) {
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            }

            wrap(mainMesh.material.map);
            wrap(mainMesh.material.normalMap);
            wrap(mainMesh.material.roughnessMap);
            wrap(mainMesh.material.metalnessMap);
            wrap(mainMesh.material.aoMap);

            let scale = new THREE.Matrix4();
            //Scales Model down to decimeters
            scale.makeScale(.1, .1, .1);
            transformMatrix.multiply(scale);
            object.applyMatrix(transformMatrix);
            scene.add(object);
            window.mainObject = object;  // for debugging only
            window.mainMesh = mainMesh;  // for debugging only
        });
    }
}
