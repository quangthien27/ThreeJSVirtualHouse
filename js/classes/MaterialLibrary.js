class MaterialLibrary {
    constructor() {
        //An Array of Material Names
        this.materialList = [];

        //An Array storing the materials
        this.materials = [];

        //Add the material names to the material list array
        this.materialList.push("material_tiles_01");
        this.materialList.push("material_carpet_01");
        this.materialList.push("material_wall_01");
        this.materialList.push("material_woodfloor_01");
        this.materialList.push("material_brickwall_01");
        this.materialList.push("material_tiles_02");
        this.materialList.push("material_walltiles_02");

        //The Path to the Folder that the materials are stored in
        let matFolder = "img"

        //File Extension for the texture images
        let extension = ".png"

        //Cycle through the material list and load the materials
        for (var i = 0; i < this.materialList.length; i++) {

            //Set the current Material name to the String in the array of material names.
            let matName = this.materialList[i];

            //Create correct paths for the material
            let matNamePath = matFolder + "/" + matName + "_basecolor" + extension;
            let matNormalPath = matFolder + "/" + matName + "_normal" + extension;
            let matRoughnessPath = matFolder + "/" + matName + "_roughness" + extension;
            let matMetalnessPath = matFolder + "/" + matName + "_metalness" + extension;
            let roomCube = new THREE.CubeTextureLoader().setPath('img/cubeMaps/').load(['material_roomCube_px.jpg', 'material_roomCube_nx.jpg', 'material_roomCube_py.jpg', 'material_roomCube_ny.jpg', 'material_roomCube_pz.jpg', 'material_roomCube_nz.jpg']);

            //Load the various texture files
            let texture = new THREE.TextureLoader().load(matNamePath);
            let normal = new THREE.TextureLoader().load(matNormalPath);
            let roughness = new THREE.TextureLoader().load(matRoughnessPath);
            let metalness = new THREE.TextureLoader().load(matMetalnessPath);

            //Set all the texture files to wrap
            texture.wrapS = texture.wrapT = normal.wrapS = normal.wrapT = roughness.wrapS = roughness.wrapT = metalness.wrapS = metalness.wrapT = true;

            //Set the texture repeat scale
            texture.repeat.set(0.025, 0.025);

            //Create new PBR Material
            let material = new THREE.MeshStandardMaterial({map: texture});

            //Assign the textures to the material
            material.normalMap = normal;
            material.roughness = 1;
            material.roughnessMap = roughness;
            material.metalnessMap = metalness;
            material.envMap = roomCube;

            //Set the materials color
            material.color = new THREE.Color(1, 1, 1);

            //Finally push the material to the array of materials
            this.materials.push(material)
        }

    }

    //function to load a material from a string
    load(matName) {

        //Cycle through material list
        for (var i = 0; i < this.materialList.length; i++) {
            //Check name passed matches
            if (matName == this.materialList[i]) {
                //return the material from the corresponding array of materials
                return this.materials[i];
            }
        }
    }
}
