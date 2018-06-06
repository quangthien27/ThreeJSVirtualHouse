class HouseLightManager {
    constructor() {
        this.sceneLights = []
    }

    addRoomLight(position, roomName) {
        this.position = position;
        this.light = new THREE.PointLight(new THREE.Color(1, .95, .9), 1);

        this.light.position.set(this.position.x, this.position.y + 26, this.position.z);
        this.light.decay = 1;
        this.light.distance = 80;

        //Set the shadow map to half the size of default
        this.light.shadow.mapSize.width = 256; // default is 512
        this.light.shadow.mapSize.height = 256; // default is 512
        this.light.castShadow = true;

        this.sceneLights.push(this.light, roomName);
    }

    update() {
        for (var x = 0; x < this.sceneLights.length; x += 2) {
            scene.add(this.sceneLights[x]);
        }

    }

    lightToggle(x) {
        for (var z = 0; z < this.sceneLights.length; z++) {
            if (x == z) {
                if (this.sceneLights[z].distance == 80) {
                    this.sceneLights[z].distance = .1;
                }
                else {
                    this.sceneLights[z].distance = 80;
                }
            }
        }
    }

    lightsOff() {
        for (var z = 0; z < this.sceneLights.length; z += 2) {
            this.sceneLights[z].distance = .1;
        }
    }

    lightsOn() {
        for (var z = 0; z < this.sceneLights.length; z += 2) {
            this.sceneLights[z].distance = 80;
        }
    }
}
