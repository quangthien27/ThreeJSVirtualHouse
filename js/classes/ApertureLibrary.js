class ApertureLibrary {
    constructor() {
        this.apertures = [];
        this.apertures.push(new ApertureModel("door 01", "mdl_door_01", "mdl_door_01", new THREE.Vector3(9.4, 21, 1), new THREE.Vector3(0, 0, 0)));
        this.apertures.push(new ApertureModel("door 01 open", "mdl_door_01_open", "mdl_door_01", new THREE.Vector3(9.4, 21, 1), new THREE.Vector3(0, 0, 0)));
        this.apertures.push(new ApertureModel("door 01 open wide", "mdl_door_01_openwide", "mdl_door_01", new THREE.Vector3(9.4, 21, 1), new THREE.Vector3(0, 0, 0)));
        this.apertures.push(new ApertureModel("door 02", "mdl_door_02", "mdl_door_01", new THREE.Vector3(9.4, 21, 1), new THREE.Vector3(0, 0, 0)));
        this.apertures.push(new ApertureModel("door 02 open", "mdl_door_02_open", "mdl_door_01", new THREE.Vector3(9.4, 21, 1), new THREE.Vector3(0, 0, 0)));
        this.apertures.push(new ApertureModel("door 02 open wide", "mdl_door_02_openwide", "mdl_door_01", new THREE.Vector3(9.4, 21, 1), new THREE.Vector3(0, 0, 0)));
        this.apertures.push(new ApertureModel("window 01", "mdl_window_01", "mdl_window_01", new THREE.Vector3(21, 13, 1), new THREE.Vector3(0, 0, 0)));
        this.apertures.push(new ApertureModel("window 02", "mdl_window_02", "mdl_window_01", new THREE.Vector3(21, 7, 1), new THREE.Vector3(0, 0, 0)));
    }

    load(apertureName) {
        for (var x = 0; x < this.apertures.length; x++) {

            if (this.apertures[x].name == apertureName) {
                return this.apertures[x];
            }
        }
    }
}
