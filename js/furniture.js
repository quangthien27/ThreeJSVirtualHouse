function loadFurnitures() {
    // ADD MODELS
    getModel("treasure_chest.obj", 0, 0, 0, "treasure_chest.mtl", 15, 12, 5, -15);
    getModel("SofaCollection.obj", 0, 3.1, 0, "SofaCollection.mtl", 10, -10, 5, 60);
    getModel("Bed02.obj", 0, 0, 0, "Bed02.mtl", 17, 22, 5, -55);
    getModel("wardrobe_OBJ.obj", 0, 4.70, 0, "Bed02.mtl", 10, 45, 15, -40);
    getModel("Bar_table.obj", 0, 4.70, 0, "Bar_table.mtl", 15, 7, 5, -55);
    getModel("modern_table_and_chairs_obj.obj", 0, 0, 0, "modern_table_and_chairs_obj.mtl", 12, 48, 5, 50);
    getModel("objBED.obj", 0, 9.4, 0, "objBED.mtl", 26, -22, 5, -39);
    getModel("shelf.obj", 0, 0, 0, "SofaCollection.mtl", 2, -38, 13, 68);
    getModel("shelf.obj", 0, 0, 0, "SofaCollection.mtl", 1.3, 10, 15, -11);
    getModel("chest.obj", 0, 4.7, 0, "objBED.mtl", 20, -40, 12, -55);
    getModel("MilesDeskWithFile.obj", 0, 4.7, 0, "SofaCollection.mtl", 23, -45, 5, -22);
    getModel("Coat-Tree.obj", 4.7, 0, 0, "Coat-Tree.mtl", 26, -40, 7, -5);
}

function getModel(objFileName, xRotate, yRotate, zRotate, mtlFileName, objectSize, xCor, yCor, zCor) {

    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setTexturePath("models/");
    mtlLoader.setPath("models/");
    var objLoader = new THREE.OBJLoader();
    objLoader.setPath("models/");


    mtlLoader.load(mtlFileName, function (materials) {
        materials.preload();

        objLoader.setMaterials(materials);

        objLoader.load(objFileName, function (mesh) {

            var CenterBB;
            var SizeBB;
            mesh.traverse(function (child) {
                if (child instanceof THREE.Mesh) {
                    var mygeometry = new THREE.Geometry().fromBufferGeometry(child.geometry);
                    mygeometry.computeBoundingBox();
                    child.material.color = new THREE.Color(1, 1, 1);
                    CenterBB = mygeometry.boundingBox.getCenter();
                    SizeBB = mygeometry.boundingBox.getSize();
                }
            });

            scene.add(mesh);

            var sca = new THREE.Matrix4();
            var tra = new THREE.Matrix4();
            var combined = new THREE.Matrix4();

            sca.makeScale(objectSize / SizeBB.length(), objectSize / SizeBB.length(), objectSize / SizeBB.length());
            tra.makeTranslation(-CenterBB.x, -CenterBB.y, -CenterBB.z);
            combined.multiply(sca);
            combined.multiply(tra);

            mesh.applyMatrix(combined);

            mesh.position.set(xCor, yCor, zCor);
            mesh.rotation.x += xRotate;
            mesh.rotation.y += yRotate;
            mesh.rotation.z += zRotate;
        });
    });
}

loadFurnitures();
