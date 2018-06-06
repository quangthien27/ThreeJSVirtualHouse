class Floor {
    constructor(origin, dimensions, matName) {
        //transformation values for the parent room
        this.origin = new THREE.Matrix4;
        this.origin = origin;

        //Vector dimensions for the parent room
        this.dimensions = dimensions;

        //rotation materix to align the floorMat
        this.rotation = new THREE.Matrix4;
        this.rotation.makeRotationX(-Math.PI / 2)

        this.floorGeom = new THREE.PlaneGeometry(this.dimensions.x - 2, this.dimensions.z - 2);

        assignUVs(this.floorGeom);

        this.floorMesh = new THREE.Mesh(this.floorGeom, matLib.load(matName));

        this.floorMesh.receiveShadow = true;
        this.floorMesh.castShadow = true;
        this.floorMesh.applyMatrix(this.rotation);
        this.floorMesh.applyMatrix(this.origin);

        scene.add(this.floorMesh);


        this.ceilingOffset = new THREE.Matrix4;
        this.ceilingOffset.makeTranslation(0, this.dimensions.y, 0);
        this.ceilingOffset.multiply(this.origin);

        var ceiling = new THREE.Mesh(this.floorGeom, matLib.floor_wood_01);
        ceiling.receiveShadow = true;
        ceiling.castShadow = true;
        ceiling.applyMatrix(this.ceilingOffset);
        ceiling.rotation.x = Math.PI / 2;
        ceiling.visible = effectController.enableCeiling;
        scene.add(ceiling);
        ceilings.push(ceiling);

        //Create foundations for the floor
        let foundationsGeom = new THREE.BoxGeometry(this.dimensions.x + 3, 5, this.dimensions.z + 2);
        assignUVs(foundationsGeom);

        let foundationsMesh = new THREE.Mesh(foundationsGeom, matLib.load("material_brickwall_01"));
        foundationsMesh.receiveShadow = true;
        foundationsMesh.castShadow = true;

        let foundationsTranslate = new THREE.Matrix4();
        foundationsTranslate.makeTranslation(0, -2.6, 0);
        foundationsTranslate.multiply(this.origin);
        foundationsMesh.applyMatrix(foundationsTranslate);
        scene.add(foundationsMesh);
    }
}
