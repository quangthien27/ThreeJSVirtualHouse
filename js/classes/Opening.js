class Opening {
    constructor(wallID, widthPos, heightPos, modelName, enableModel) {
        //load the aperture model and assign the openings width and height to the Aperture model's width/height.
        this.apertureModel = apertureLib.load(modelName);
        this.width = this.apertureModel.dims.x;
        this.height = this.apertureModel.dims.y;

        //Id of the wall this opening belongs to
        this.ID = wallID;

        //boolean value for whether to display a model or not.
        this.enableModel = enableModel;

        this.exterior = false;

        //Matrix to transform the room to it position
        this.wallOrigin = new THREE.Matrix4();

        //A Matrix defining the dimensions of the room
        this.wallDims = new THREE.Vector3(0, 0, 0)


        this.widthPos = widthPos;
        this.heightPos = heightPos;
    }

    setDims(dims) {
        this.wallDims = dims;
    }

    setTrans(trans) {
        this.wallOrigin = trans;
    }

    generate() {
        let openingDims = new THREE.Vector3(this.apertureModel.dims.x, this.apertureModel.dims.y, this.wallDims.z)

        let topSectionHeight = (this.wallDims.y - this.height) / 2 - this.heightPos;
        let topTranslation = this.height / 2 + ((this.wallDims.y - this.height) / 2 + this.heightPos) / 2;
        let bottomSectionHeight = (this.wallDims.y - this.height) / 2 + this.heightPos;
        let bottomTranslation = this.height / 2 - this.height - ((this.wallDims.y - this.height) / 2 - this.heightPos) / 2;

        let transPos = new THREE.Matrix4();
        let transPos2 = new THREE.Matrix4();
        transPos.multiply(this.wallOrigin);
        transPos2.makeTranslation(this.widthPos, this.heightPos, this.wallDims.z / 2);
        transPos.multiply(transPos2);

        let transTopPos = new THREE.Matrix4();
        let transTopPos2 = new THREE.Matrix4();
        transTopPos.multiply(this.wallOrigin);
        transTopPos2.makeTranslation(this.widthPos, topTranslation, this.wallDims.z);
        transTopPos.multiply(transTopPos2);

        let transBotPos = new THREE.Matrix4();
        let transBotPos2 = new THREE.Matrix4();
        transBotPos.multiply(this.wallOrigin);
        transBotPos2.makeTranslation(this.widthPos, bottomTranslation, this.wallDims.z);
        transBotPos.multiply(transBotPos2);


        //interior opening wall geometry
        this.openingGeomTop = new THREE.PlaneGeometry(this.width, topSectionHeight);
        let vecTop = new THREE.Vector3();
        vecTop.setFromMatrixPosition(transTopPos2);
        assignUVs(this.openingGeomTop, vecTop);

        this.openingGeomBot = new THREE.PlaneGeometry(this.width, bottomSectionHeight);
        let vecBot = new THREE.Vector3();
        vecBot.setFromMatrixPosition(transBotPos2);
        assignUVs(this.openingGeomBot, vecBot);

        //Exterior opening wall geometry


        let exteriorTranslateTop = new THREE.Matrix4();
        let extTopTra = new THREE.Matrix4();
        let extTopRot = new THREE.Matrix4();
        extTopTra.makeTranslation(0, 0, 1);
        extTopRot.makeRotationY(Math.PI);

        exteriorTranslateTop.multiply(transTopPos);
        exteriorTranslateTop.multiply(extTopRot);
        exteriorTranslateTop.multiply(extTopTra);

        this.exteriorOpeningGeomTop = new THREE.PlaneGeometry(this.width, topSectionHeight);
        let extVecTop = new THREE.Vector3();
        extVecTop.setFromMatrixPosition(transTopPos2);
        assignUVs(this.exteriorOpeningGeomTop, extVecTop);


        let exteriorTranslateBot = new THREE.Matrix4();
        let extBotTra = new THREE.Matrix4();
        let extBotRot = new THREE.Matrix4();
        extBotTra.makeTranslation(0, 0, 1);
        extBotRot.makeRotationY(Math.PI);

        exteriorTranslateBot.multiply(transBotPos);
        exteriorTranslateBot.multiply(extBotRot);
        exteriorTranslateBot.multiply(extBotTra);

        this.exteriorOpeningGeomBot = new THREE.PlaneGeometry(this.width, bottomSectionHeight);
        let extVecBot = new THREE.Vector3();
        extVecBot.setFromMatrixPosition(transBotPos2);
        assignUVs(this.exteriorOpeningGeomBot, extVecBot);


        if (this.enableModel) {
            mdlLib.load(this.apertureModel.modelName, this.apertureModel.materialName, transPos);
        }

        this.mergedWallOpening = new THREE.Geometry();
        this.mergedWallOpening.applyMatrix(this.wallOrigin)

        this.mergedExteriorWallOpening = new THREE.Geometry();
        this.mergedExteriorWallOpening.applyMatrix(this.wallOrigin)


        this.generateOpeningMesh(transPos, openingDims);
        if (this.exterior) {
            this.generateOpeningMesh(transPos, openingDims, this.exterior);
        }


        //This loads the correct model for the aperture


        if (topSectionHeight > 0) {
            this.mergedWallOpening.merge(this.openingGeomTop, transTopPos);
            this.mergedExteriorWallOpening.merge(this.exteriorOpeningGeomTop, exteriorTranslateTop);
        }
        if (bottomSectionHeight > 0) {
            this.mergedWallOpening.merge(this.openingGeomBot, transBotPos);
            this.mergedExteriorWallOpening.merge(this.exteriorOpeningGeomBot, exteriorTranslateBot);
        }

        this.geometry = this.mergedWallOpening;
        this.exteriorGeometry = this.mergedExteriorWallOpening;

    }

    generateOpeningMesh(transPos, openingDims, exteriorMesh) {
        for (var z = 0; z < 4; z++) {
            let transToSides = new THREE.Matrix4();

            //Set the translate and model dimensions for each side of the opening
            switch (z) {
                case 0:
                    transToSides.makeTranslation(0, openingDims.y / 2, 0);
                    this.side = new THREE.PlaneGeometry(openingDims.x, this.wallDims.z);
                    break;
                case 1:
                    transToSides.makeTranslation(-openingDims.x / 2, 0, 0);
                    this.side = new THREE.PlaneGeometry(openingDims.y, this.wallDims.z);
                    break;
                case 2:
                    transToSides.makeTranslation(0, -openingDims.y / 2, 0);
                    this.side = new THREE.PlaneGeometry(openingDims.x, this.wallDims.z);
                    break;
                case 3:
                    transToSides.makeTranslation(openingDims.x / 2, 0, 0);
                    this.side = new THREE.PlaneGeometry(openingDims.y, this.wallDims.z);
                    break;
            }

            let trans = new THREE.Matrix4();
            let rotate1 = new THREE.Matrix4();
            let rotate2 = new THREE.Matrix4();
            let exteriorTranslate = new THREE.Matrix4();
            if (exteriorMesh) {
                exteriorTranslate.makeTranslation(0, 0, -1);
            }
            rotate1.makeRotationX((Math.PI / 2));
            rotate2.makeRotationY(z * (Math.PI / 2));

            trans.multiply(transPos);
            trans.multiply(exteriorTranslate);
            trans.multiply(transToSides);

            trans.multiply(rotate1);
            trans.multiply(rotate2);

            let vec = new THREE.Vector3();
            vec.setFromMatrixPosition(trans);
            assignUVs(this.side, vec);

            if (exteriorMesh) {
                this.mergedExteriorWallOpening.merge(this.side, trans);
            }
            else {
                this.mergedWallOpening.merge(this.side, trans);
            }

        }
    }
}
