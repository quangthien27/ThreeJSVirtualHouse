function loadFurniture() {
    //BEDROOM 1
    getModel("Bed02.obj", 0, 0, 0, "Bed02.mtl", 17, 45, 5, -75);
    getModel("wardrobe_OBJ.obj", 0, 4.70, 0, "Bed02.mtl", 10, 65, 15, -60);
    getModel("Bar_table.obj", 0, 4.70, 0, "Bar_table.mtl", 15, 30, 5, -71);
    getModel("treasure_chest.obj", 0, 0, 0, "treasure_chest.mtl", 15, 12, 5, -15);
    getModel("shelf.obj", 0, 0, 0, "SofaCollection.mtl", 1.3, 10, 15, -11);
    getModel("Bigmax_White_OBJ.obj", 0, 0, 0, "Bigmax_White_OBJ.mtl", 7, 15, 5, -28);
    getModel("D_Plant.obj", 4.7, 0, 0, "D_Plant.mtl", 10, 60, 10, -28);

    //KITCHEN
    getModel("modern_table_and_chairs_obj.obj", 0, 0, 0, "modern_table_and_chairs_obj.mtl", 12, 45, 5, 54);
    getModel("Kitchen_3_Wardrobe.obj", 0, 0, 0, "Kitchen_3_Wardrobe.mtl", 2, 52, 5, 33);

    //BEDROOM 2
    getModel("objBED.obj", 0, 9.4, 0, "objBED.mtl", 26, -22, 5, -59);
    getModel("chest.obj", 0, 4.7, 0, "objBED.mtl", 20, -40, 12, -75);
    getModel("MilesDeskWithFile.obj", 0, 4.7, 0, "SofaCollection.mtl", 23, -45, 5, -22);

    //LIVING ROOM
    getModel("shelf.obj", 0, 0, 0, "SofaCollection.mtl", 2, -38, 13, 91);
    getModel("SofaCollection.obj", 0, 7.8, 0, "SofaCollection.mtl", 10, -40, 5.5, 25);
    getModel("tv.obj", 14.1, 3.15, 4.7, "treasure_chest.mtl", 13, 13, 5.5, 25);
    getModel("Coffeet2.obj", 4.7, 0, 4.7, "Coffeet2.mtl", 24, -10, 5, 82);
    getModel("sofa.obj", 0, 0, 0, "sofa.mtl", 24, -5, 8.5, 60);
    getModel("mus001.obj", 4.7, 0, 0, "mus001.mtl", 6, -30, 5, 68);
    getModel("painting.obj", 0, 0, 0, "painting.mtl", 25, -2, 9, 11.4);

    //CORRIDOR
    getModel("Coat-Tree.obj", 4.7, 0, 0, "Coat-Tree.mtl", 26, -40, 7, -5);

    //BATHROOM
    getModel("toilet.obj", 0, 9.4, 0, "toilet.mtl", 1.5, 63, 5, 0);

    //ADAPT DRAG AND DROP
    adaptDragAndDrop(objects);
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

            var CenterBB = 0;
            var SizeBB = 0;
            mesh.traverse(function (child) {
                if (child instanceof THREE.Mesh) {
                    var mygeometry = new THREE.Geometry().fromBufferGeometry(child.geometry);
                    mygeometry.computeBoundingBox();
                    child.material.color = new THREE.Color(1, 1, 1);
                    CenterBB = mygeometry.boundingBox.getCenter();
                    SizeBB = mygeometry.boundingBox.getSize();
                    child.castShadow = true;
                    child.receiveShadow = true;
                    objects.push(child);
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
