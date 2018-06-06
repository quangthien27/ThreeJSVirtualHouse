class Environment {
    constructor() {
        this.defaultRadius = 2500;
        this.time = 0;

        // SUNLIGHT

        this.sunlight = new THREE.DirectionalLight(0xffDDCC, 1);
        this.sunlight.position.set(30, 50, 20);
        this.sunlight.castShadow = true;
        this.sunlight.shadow.mapSize.width = 4096 / 2;
        this.sunlight.shadow.mapSize.height = 4096 / 2;
        this.sunlight.shadow.camera.left = -300;
        this.sunlight.shadow.camera.right = 300;
        this.sunlight.shadow.camera.top = 300;
        this.sunlight.shadow.camera.bottom = -300;

        var segmentCount = 500,
            radius = this.defaultRadius,
            geometry = new THREE.Geometry(),
            material = new THREE.LineBasicMaterial({color: 0x000000});

        for (var i = 0; i <= segmentCount; i++) {
            var theta = (i / segmentCount) * Math.PI * 2;
            geometry.vertices.push(new THREE.Vector3(Math.sin(theta) * radius, Math.cos(theta) * -radius, 0));
        }

        // INDICATED OVAL

        scene.add(new THREE.LineSegments(geometry, material));
        geometry = new THREE.SphereBufferGeometry(this.defaultRadius / 40, 32, 32);
        material = new THREE.MeshBasicMaterial({color: 0xffDD77});
        this.sphere = new THREE.Mesh(geometry, material);

        // SUN SPHERE
        var transform = new THREE.Matrix4();
        var theta = (this.time / segmentCount) * Math.PI * 2;
        this.sunPos = new THREE.Vector3(Math.sin(theta) * radius, Math.cos(theta) * -radius, 0);
        transform.makeTranslation(this.sunPos.x, this.sunPos.y, this.sunPos.z);
        this.sphere.applyMatrix(transform);
        this.sunlight.position.set(this.sunPos.x, this.sunPos.y, this.sunPos.z);

        // SUNLIGHT
        scene.add(this.sunlight);
        scene.add(this.sphere);

        // AXIS HELPER

        axis = new THREE.AxesHelper(10000);
        axis.visible = effectController.enableAxis;
        scene.add(axis);

        // GROUND

        var loader = new THREE.TextureLoader();
        var groundTexture = loader.load('img/grasslight-big.jpg');
        groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
        groundTexture.repeat.set(120, 120);
        groundTexture.anisotropy = 16;
        // var groundMaterial = new THREE.MeshLambertMaterial( { map: groundTexture } );
        var groundMaterial = new THREE.MeshPhongMaterial({map: groundTexture});
        var ground = new THREE.Mesh(new THREE.PlaneBufferGeometry(10000, 10000), groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        scene.add(ground);


        // SKYDOME

        scene.fog = new THREE.Fog(scene.background, 1, 5000);
        var vertexShader = document.getElementById('vertexShader').textContent;
        var fragmentShader = document.getElementById('fragmentShader').textContent;
        var uniforms = {
            topColor: {value: new THREE.Color(0x0077ff)},
            bottomColor: {value: new THREE.Color(0xffffff)},
            offset: {value: 33},
            exponent: {value: 0.6}
        };

        scene.fog.color.copy(uniforms.bottomColor.value);
        var skyGeo = new THREE.SphereBufferGeometry(4000, 32, 15);
        var skyMat = new THREE.ShaderMaterial({vertexShader: vertexShader, fragmentShader: fragmentShader, uniforms: uniforms, side: THREE.BackSide});

        var sky = new THREE.Mesh(skyGeo, skyMat);
        scene.add(sky);
    }

    update() {
        var segmentCount = 500, radius = this.defaultRadius;
        var theta = (this.time / segmentCount) * Math.PI * 2;
        var lightPos = new THREE.Vector3(Math.sin(theta) * 200, Math.cos(theta) * -200, 0);
        this.sunPos = new THREE.Vector3(Math.sin(theta) * radius, Math.cos(theta) * -radius, 0);
        this.sunlight.position.set(lightPos.x, lightPos.y, lightPos.z);
        this.sphere.position.set(this.sunPos.x, this.sunPos.y, this.sunPos.z);
    }
}
