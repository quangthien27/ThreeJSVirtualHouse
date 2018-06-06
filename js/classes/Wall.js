class Wall {
    constructor(origin, dimensions, exterior, openings, matName) {
        //this is a transform matrix to move the entire wall
        this.origin = new THREE.Matrix4();

        this.flip = 1;
        this.dims = dimensions;
        this.matName = matName;
        this.origin.multiply(origin);

        //this is an array for openings
        this.openings = openings;

        //this is array for the sections of wall between openings
        this.wallSegs = [];

        //this stores a set of points denoting the start/end of the wall and each split
        this.wallPoints = [];

        //this is to store the walls geometry
        this.geometry = new THREE.Geometry();
        this.exteriorGeometry = new THREE.Geometry();

        //this creates a series of points to draw wall segs between
        this.wallPoints.push(this.flip * (-this.dims.x / 2)); //start point of the wall
        for (var z = 0; z < this.openings.length; z++) {
            this.geometry.merge(this.openings[z].geometry);
            this.exteriorGeometry.merge(this.openings[z].exteriorGeometry);

            this.wallPoints.push(this.flip * (this.openings[z].widthPos - this.openings[z].width / 2)); //value for start point of the opening
            this.wallPoints.push(this.flip * (this.openings[z].widthPos + this.openings[z].width / 2)); //value for end point of the opening
        }
        this.wallPoints.push(this.flip * (this.dims.x / 2)); //end point of the wall

        for (var z = 0; z < this.wallPoints.length - 1; z++) {
            //Modulus to skip gaps
            if (z % 2 == 0) {
                let combined = new THREE.Matrix4();
                let translate = new THREE.Matrix4();
                translate.makeTranslation((this.wallPoints[z] + this.wallPoints[z + 1]) / 2, 0, this.dims.z);
                combined.multiply(this.origin);
                combined.multiply(translate);

                this.wallSegGeom = new THREE.PlaneGeometry(Math.abs(this.wallPoints[z + 1] - this.wallPoints[z]), this.dims.y);

                //make a vector from the rooms transform Matrix to offset UVW maps
                let vec = new THREE.Vector3();
                vec.setFromMatrixPosition(translate);
                assignUVs(this.wallSegGeom, vec);

                this.geometry.merge(this.wallSegGeom, combined);

                if (exterior) {
                    let extTranslate = new THREE.Matrix4();
                    let trans2 = new THREE.Matrix4();
                    let rotate = new THREE.Matrix4();

                    trans2.makeTranslation(0, 0, -1);
                    rotate.makeRotationX(Math.PI);


                    extTranslate.multiply(combined);
                    extTranslate.multiply(trans2);
                    extTranslate.multiply(rotate);

                    this.extWallSegGeom = new THREE.PlaneGeometry(Math.abs(this.wallPoints[z + 1] - this.wallPoints[z]), this.dims.y);

                    let vec = new THREE.Vector3();
                    vec.setFromMatrixPosition(extTranslate);
                    assignUVs(this.extWallSegGeom, vec);
                    this.exteriorGeometry.merge(this.extWallSegGeom, extTranslate)
                }
            }
        }


        this.testMesh2 = new THREE.Mesh(this.exteriorGeometry, matLib.load("material_brickwall_01"));
        this.testMesh2.castShadow = true;
        this.testMesh2.receiveShadow = true;
        scene.add(this.testMesh2);


        this.testMesh = new THREE.Mesh(this.geometry, matLib.load(this.matName));
        this.testMesh.castShadow = true;
        this.testMesh.receiveShadow = true;
        scene.add(this.testMesh);
        this.capWall();
    }

    capWall() {
        let material = new THREE.MeshBasicMaterial({color: 0x333333});
        this.wallTopGeom = new THREE.PlaneGeometry(this.dims.x, this.dims.z);
        this.transWallTop = new THREE.Matrix4();
        this.transWallTopRot = new THREE.Matrix4();
        this.transWallTop2 = new THREE.Matrix4();
        this.transWallTop.makeTranslation(0, this.dims.y / 2, 0);
        this.transWallTop2.makeTranslation(0, -this.dims.z / 2, 0);
        this.transWallTopRot.makeRotationX(-Math.PI / 2)
        this.transWallTop.multiply(this.origin);
        this.transWallTop.multiply(this.transWallTopRot);
        this.transWallTop.multiply(this.transWallTop2);
        this.wallTop = new THREE.Mesh(this.wallTopGeom, material);
        this.wallTop.applyMatrix(this.transWallTop);
        scene.add(this.wallTop);
    }
}
