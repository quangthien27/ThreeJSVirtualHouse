class House {
    constructor(posX, posY, dimX, dimY) {
        var rotation = new THREE.Vector3(0, 0, 0);

        //Room List (Vector3 Room dimensions, Vector 3 Room position, String Floor material name, String Wall material Name )

        //hall
        let hallApertures = [];
        hallApertures.push(new Opening(0, 0, -3.5, "door 01 open wide", false)); //Aperture arguments int side,string name,vector3 location,boolean enableModel
        hallApertures.push(new Opening(0, 25, -3.5, "door 01 open wide", false)); //Aperture arguments int side,string name,vector3 location,boolean enableModel
        hallApertures.push(new Opening(1, 0, -3.5, "door 01 open", true)); //Aperture arguments int side,string name,vector3 location,boolean enableModel
        hallApertures.push(new Opening(2, 0, -3.5, "door 01 open wide", false)); //Aperture arguments int side,string name,vector3 location,boolean enableModel
        hallApertures.push(new Opening(3, 0, -3.5, "door 01 open wide", false)); //Aperture arguments int side,string name,vector3 location,boolean enableModel

        let hallExteriorWalls = [false, true, false, false];
        this.hall = new Room("hall", new THREE.Vector3(70, 28, 20), new THREE.Vector3(-15, 5, 0), "material_woodfloor_01", "material_wall_01", hallExteriorWalls, hallApertures);


        //bedroom 1
        let bedroomApertures = [];
        bedroomApertures.push(new Opening(0, 0, 0, "window 01", true)); //Aperture arguments int side,string name,vector3 location,boolean enableModel
        bedroomApertures.push(new Opening(1, 0, 0, "window 01", true)); //Aperture arguments int side,string name,vector3 location,boolean enableModel
        bedroomApertures.push(new Opening(2, -10, -3.5, "door 01 open", true)); //Aperture arguments int side,string name,vector3 location,boolean enableModel
        let bedroom1ExteriorWalls = [true, true, false, false];
        this.bedroom1 = new Room("bedroom 1", new THREE.Vector3(50, 28, 70), new THREE.Vector3(-25, 5, -45), "material_carpet_01", "material_wall_01", bedroom1ExteriorWalls, bedroomApertures);


        //let bedroomApertures = [new wallAperture("door 01",1,new THREE.Vector3(-25, 5, 0))]
        let bedroom2Apertures = [];
        bedroom2Apertures.push(new Opening(0, -15, 0, "window 01", true)); //Aperture arguments int side,string name,vector3 location,boolean enableModel
        bedroom2Apertures.push(new Opening(0, 15, 0, "window 01", true)); //Aperture arguments int side,string name,vector3 location,boolean enableModel
        bedroom2Apertures.push(new Opening(3, -15, 0, "window 01", true)); //Aperture arguments int side,string name,vector3 location,boolean enableModel
        bedroom2Apertures.push(new Opening(3, 15, 0, "window 01", true)); //Aperture arguments int side,string name,vector3 location,boolean enableModel
        bedroom2Apertures.push(new Opening(2, 25, -3.5, "door 02 open", true)); //Aperture arguments int side,string name,vector3 location,boolean enableModel

        let bedroom2ExteriorWalls = [true, false, false, true];
        this.bedroom2 = new Room("bedroom 2", new THREE.Vector3(70, 28, 70), new THREE.Vector3(35, 5, -45), "material_carpet_01", "material_wall_01", bedroom2ExteriorWalls, bedroom2Apertures);


        //bathrooms
        let bathroomApertures = [];
        bathroomApertures.push(new Opening(1, 10, -3.5, "door 02 open", true)); //Aperture arguments int side,string name,vector3 location,boolean enableModel
        bathroomApertures.push(new Opening(3, 0, 2, "window 02", true)); //Aperture arguments int side,string name,vector3 location,boolean enableModel
        let bathroomExteriorWalls = [false, false, false, true];
        this.bathroom = new Room("Bathroom", new THREE.Vector3(50, 28, 40), new THREE.Vector3(45, 5, 10), "material_tiles_02", "material_walltiles_02", bathroomExteriorWalls, bathroomApertures);


        //Loungeroom
        let loungeApertures = [];
        loungeApertures.push(new Opening(2, 0, 0, "window 01", true)); //Aperture arguments int side,string name,vector3 location,boolean enableModel
        loungeApertures.push(new Opening(1, -15, 0, "window 01", true)); //Aperture arguments int side,string name,vector3 location,boolean enableModel
        loungeApertures.push(new Opening(1, 15, 0, "window 01", true)); //Aperture arguments int side,string name,vector3 location,boolean enableModel
        loungeApertures.push(new Opening(0, 0, -3.5, "door 01 open wide", true)); //Aperture arguments int side,string name,vector3 location,boolean enableModel
        loungeApertures.push(new Opening(3, 10, -3.5, "door 01 open wide", false)); //Aperture arguments int side,string name,vector3 location,boolean enableModel
        let loungeroomExteriorWalls = [false, true, true, false];
        this.loungeroom = new Room("Lounge Room", new THREE.Vector3(70, 28, 80), new THREE.Vector3(-15, 5, 50), "material_woodfloor_01", "material_wall_01", loungeroomExteriorWalls, loungeApertures);


        //Kitchen

        let kitchenApertures = [];
        kitchenApertures.push(new Opening(1, 0, -3.5, "door 01 open wide", true)); //Aperture arguments int side,string name,vector3 location,boolean enableModel
        kitchenApertures.push(new Opening(2, 0, 0, "window 01", true)); //Aperture arguments int side,string name,vector3 location,boolean enableModel
        kitchenApertures.push(new Opening(3, 0, -3.5, "door 01 open wide", true)); //Aperture arguments int side,string name,vector3 location,boolean enableModel
        let kitchenExteriorWalls = [false, false, true, true];
        this.kitchen = new Room("Kitchen", new THREE.Vector3(50, 28, 60), new THREE.Vector3(45, 5, 60), "material_tiles_01", "material_wall_01", kitchenExteriorWalls, kitchenApertures);


        houseLighting.update();
    }

    lightToggle() {
        this.loungeroom.lightToggle();
    }

}
