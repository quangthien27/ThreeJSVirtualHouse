class Room {
    constructor(name, dimensions, position, floorMat, wallMat, exteriorWalls, roomOpenings) {

        this.walls = [];
        this.wallThickness = 1;
        this.exteriorWallsIDs = exteriorWalls;
        this.exteriorWalls = [];

        this.wallMat = wallMat;
        this.exteriorMat = "material_brickwall_01";

        this.dimensions = dimensions;
        this.position = position;

        this.origin = new THREE.Matrix4();
        this.origin.makeTranslation(position.x, position.y, position.z);

        this.roomOpenings = roomOpenings;
        this.floor = new Floor(this.origin, this.dimensions, floorMat);

        houseLighting.addRoomLight(position, name);
        this.generateWalls();
    }


    generateWalls() {

        for (var i = 0; i < (4); i++) {

            let exterior = false;
            if (this.exteriorWallsIDs) {
                if (this.exteriorWallsIDs[i] == true) {

                    exterior = true;
                }
                else {
                    exterior = false;
                }
            }

            //An array to store only this walls openings.
            this.wallOpenings = [];
            this.wallTransform = new THREE.Matrix4();
            var tra = new THREE.Matrix4();
            var rot = new THREE.Matrix4();
            var sca = new THREE.Matrix4();
            var traGlobalPos = new THREE.Matrix4();
            var wallLength;

            if (i == 0 || i == 2) {
                wallLength = this.dimensions.x;
                tra.makeTranslation(0, this.dimensions.y / 2, (-this.dimensions.z / 2));
            } else {
                wallLength = this.dimensions.z;
                tra.makeTranslation(0, this.dimensions.y / 2, (-this.dimensions.x / 2));
            }

            traGlobalPos.makeTranslation(this.position.x, this.position.z, this.position.y);
            rot.makeRotationY(i * (Math.PI / 2));

            this.wallTransform.multiply(this.origin);
            this.wallTransform.multiply(rot);
            this.wallTransform.multiply(tra);

            this.wallDims = new THREE.Vector3(wallLength, this.dimensions.y, this.wallThickness);


            for (var z = 0; z < this.roomOpenings.length; z++) {
                if (this.roomOpenings[z].ID == i) {
                    this.roomOpenings[z].setTrans(this.wallTransform);
                    this.roomOpenings[z].setDims(this.wallDims);
                    if (exterior) {
                        this.roomOpenings[z].exterior = true;
                    }
                    this.roomOpenings[z].setDims(this.wallDims);
                    this.roomOpenings[z].generate();
                    this.wallOpenings.push(this.roomOpenings[z]);
                }
            }

            if (exterior) {

                this.exteriorWalls.push(new Wall(this.wallTransform, this.wallDims, true, this.wallOpenings, this.wallMat));
            }
            else {
                this.walls.push(new Wall(this.wallTransform, this.wallDims, false, this.wallOpenings, this.wallMat));
            }
        }
    }
}
