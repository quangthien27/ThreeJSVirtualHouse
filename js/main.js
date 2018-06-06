
  //create the scene
  /*jshint esversion: 6 */
  var scene = new THREE.Scene();

  var sky, sunSphere, objects = [];
  var sunCircling = true;
  var gui = new dat.GUI();

  var effectController = {
      sunSpeed: .5,
  };

  //create the perspective camera
  //for parameters see https://threejs.org/docs/#api/cameras/PerspectiveCamera
  var camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 10, 2000000 );
  camera.position.set( 100, 100, 200 );

  //set the position of the camera
  // camera.position.set(100, 100, 100);
  //and the looking direction
  camera.lookAt(0, 0, 1);
  //create the webgl renderer
  var renderer = new THREE.WebGLRenderer();
  //set the size of the rendering window
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  //add the renderer to the current document
  document.body.appendChild(renderer.domElement);
  //this fucntion is called when the window is resized
  var MyResize = function() {
      raycaster = new THREE.Raycaster();
      var mouse = new THREE.Vector2();
    raycaster.setFromCamera( mouse, camera );
    var intersects = raycaster.intersectObjects( scene.children );

// for ( var i = 0; i < intersects.length; i++ ) {

  // intersects[ i ].object.material.color.set( 0xff0000 );
  // alert("ffs");
// }
    var width = window.innerWidth;
    var height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.render(scene, camera);
  };
  //link the resize of the window to the update of the camera
  window.addEventListener('resize', MyResize);
  //create the material of the cube (basic material)
  var material_cube = new THREE.MeshLambertMaterial();
  //set the color of the cube
  var material_floorPart = new THREE.MeshLambertMaterial();
  material_cube.color = new THREE.Color(1, 1, 1);
  material_floorPart.color = new THREE.Color(0.8, 0.8, 0.8);
  //create the first mesh of a cube
  var geometry_cube = new THREE.BoxGeometry(1, 1, 1);
  var cubes = [];
  //the number of cubes composing the strip
  var n = 4;
  //number of loops the moebius strip do
  var loop = 1;
  //the displacement along Z if zero is a pure moebius strip
  var deltaZ = 0;
  var gridSize = 4;
  scene.background = new THREE.Color(0x292325);

  var initSky = function(){
      // Add Sky
      // sky = new THREE.Sky();
      // sky.scale.setScalar(450000);
      // scene.add(sky);
      //
      // // Add Sun Helper
      // sunSphere = new THREE.Mesh(
      //     new THREE.SphereBufferGeometry(20000, 16, 8),
      //     new THREE.MeshBasicMaterial({color: 0xffffff})
      // );
      // sunSphere.position.y = -700000;
      // sunSphere.visible = false;
      // scene.add(sunSphere);

      // LIGHTS

      // hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
      // hemiLight.color.setHSL( 0.6, 1, 0.6 );
      // hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
      // hemiLight.position.set( 0, 50, 0 );
      // scene.add( hemiLight );
      //
      // hemiLightHelper = new THREE.HemisphereLightHelper( hemiLight, 10 );
      // scene.add( hemiLightHelper );

      //

      // dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
      // dirLight.color.setHSL( 0.1, 1, 0.95 );
      // dirLight.position.set( -1, 1.75, 1 );
      // dirLight.position.multiplyScalar( 30 );
      // scene.add( dirLight );
      //
      // dirLight.castShadow = true;
      //
      // dirLight.shadow.mapSize.width = 2048;
      // dirLight.shadow.mapSize.height = 2048;
      //
      // var d = 50;
      //
      // dirLight.shadow.camera.left = -d;
      // dirLight.shadow.camera.right = d;
      // dirLight.shadow.camera.top = d;
      // dirLight.shadow.camera.bottom = -d;
      //
      // dirLight.shadow.camera.far = 3500;
      // dirLight.shadow.bias = -0.0001;
      //
      // dirLightHeper = new THREE.DirectionalLightHelper( dirLight, 10 );
      // scene.add( dirLightHeper );

      // GROUND

      var groundGeo = new THREE.PlaneBufferGeometry( 10000, 10000 );
      var groundMat = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0x050505 } );
      groundMat.color.setHSL( 0.095, 1, 0.75 );

      var ground = new THREE.Mesh( groundGeo, groundMat );
      ground.rotation.x = -Math.PI/2;
      // ground.position.y = -33;
      scene.add( ground );

      ground.receiveShadow = true;

      // SKYDOME

      scene.fog = new THREE.Fog( scene.background, 1, 5000 );
      var vertexShader = document.getElementById( 'vertexShader' ).textContent;
      var fragmentShader = document.getElementById( 'fragmentShader' ).textContent;
      var uniforms = {
          topColor:    { value: new THREE.Color( 0x0077ff ) },
          bottomColor: { value: new THREE.Color( 0xffffff ) },
          offset:      { value: 33 },
          exponent:    { value: 0.6 }
      };
      // uniforms.topColor.value.copy( hemiLight.color );

      scene.fog.color.copy( uniforms.bottomColor.value );

      var skyGeo = new THREE.SphereBufferGeometry( 4000, 32, 15 );
      var skyMat = new THREE.ShaderMaterial( { vertexShader: vertexShader, fragmentShader: fragmentShader, uniforms: uniforms, side: THREE.BackSide } );

      var sky = new THREE.Mesh( skyGeo, skyMat );
      scene.add( sky );

      /// GUI

  };

  function guiChanged() {


  }

  gui.add(effectController, "sunSpeed", 0.05, 7.0, 0.05).onChange(guiChanged);

  guiChanged();


  var adaptDragAndDrop = function () {
      var geometry = new THREE.BoxBufferGeometry( 40, 40, 40 );

      for (var i = 0; i < 10; i++) {
          var object = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({color: Math.random() * 0xffffff}));
          object.position.x = Math.random() * 1000 - 500;
          object.position.y = Math.random() * 600 - 300;
          object.position.z = Math.random() * 800 - 400;
          object.rotation.x = Math.random() * 2 * Math.PI;
          object.rotation.y = Math.random() * 2 * Math.PI;
          object.rotation.z = Math.random() * 2 * Math.PI;
          object.scale.x = Math.random() * 2 + 1;
          object.scale.y = Math.random() * 2 + 1;
          object.scale.z = Math.random() * 2 + 1;
          object.castShadow = true;
          object.receiveShadow = true;
          scene.add(object);
          objects.push(object);
      }

      var dragControls = new THREE.DragControls(objects, camera, renderer.domElement);
      dragControls.addEventListener('dragstart', function (event) {
          controls.enabled = false;
      });
      dragControls.addEventListener('dragend', function (event) {
          controls.enabled = true;
      });

  };

  adaptDragAndDrop();


  class Environment
  {
    constructor()
    {

        this.defaultRadius = 2500;

      this.time = 0;
      this.sunlight = new THREE.DirectionalLight( 0xffDDCC, 1 );
      this.sunlight.position.set( 30, 50, 20 );
      this.sunlight.castShadow = true;


      this.sunlight.shadow.mapSize.width = 4096;
      this.sunlight.shadow.mapSize.height = 4096;
      this.sunlight.shadow.camera.left = -300;
      this.sunlight.shadow.camera.right = 300;
      this.sunlight.shadow.camera.top = 300;
      this.sunlight.shadow.camera.bottom = -300;

      //scene.add( this.sunlight );


      var segmentCount = 500,
  radius = this.defaultRadius,
  geometry = new THREE.Geometry(),
  material = new THREE.LineBasicMaterial({ color: 0x000000 });

for (var i = 0; i <= segmentCount; i++) {
  var theta = (i / segmentCount) * Math.PI * 2;
  geometry.vertices.push(new THREE.Vector3(Math.sin(theta) * radius,Math.cos(theta) * -radius,0));
}

scene.add(new THREE.LineSegments(geometry, material));

      geometry = new THREE.SphereBufferGeometry( this.defaultRadius / 40, 32, 32 );
      material = new THREE.MeshBasicMaterial( {color: 0xffDD77} );
      this.sphere = new THREE.Mesh( geometry, material );

      var transform = new THREE.Matrix4();

      var theta = (this.time / segmentCount) * Math.PI * 2;
      this.sunPos = new THREE.Vector3(Math.sin(theta) * radius,Math.cos(theta) * -radius,0);
      transform.makeTranslation(this.sunPos.x,this.sunPos.y,this.sunPos.z);
      this.sphere.applyMatrix(transform);


      this.sunlight.position.set(this.sunPos.x,this.sunPos.y,this.sunPos.z);
      scene.add( this.sunlight );
      scene.add( this.sphere );

        initSky();

    }
    update()
    {
      var transform = new THREE.Matrix4();

      var segmentCount = 500,radius = this.defaultRadius;
      var theta = (this.time / segmentCount) * Math.PI * 2;
      var lightPos = new THREE.Vector3(Math.sin(theta) * 200,Math.cos(theta) * -200,0);
      this.sunPos = new THREE.Vector3(Math.sin(theta) * radius,Math.cos(theta) * -radius,0);
      this.sunlight.position.set(lightPos.x,lightPos.y,lightPos.z);
      this.sphere.position.set(this.sunPos.x,this.sunPos.y,this.sunPos.z);
      //this.time = time;
      // transform.makeTranslation(this.sunPos.x,this.sunPos.y,this.sunPos.z);
      //this.sphere.applyMatrix(transform);
      // scene.remove( this.sunlight );
      //scene.remove( sphere );
      // scene.add( this.sunlight );
     // scene.add( sphere );
    }
  }


class ModelLibrary
{
  constructor()
  {
    this.manager = new THREE.LoadingManager();
    this.manager.onProgress = function ( item, loaded, total ) {
        console.log( item, loaded, total );
    };

	}

  load(modelName,materialName,transformMatrix)
  {
    //let modelName = "mdl_door_01";
    let modelPath = "mdl/"
    let modelMaterialPath = "img/mdl/"
    let objLoader = new THREE.OBJLoader(this.manager);
    objLoader.load(modelPath+modelName+".obj", function(object) {
        var mainMesh;
        object.traverse(function (child) {
            if (child instanceof THREE.Mesh) {
                mainMesh = child;
            }
        });

        mainMesh.castShadow = true;
        mainMesh.receiveShadow = true;

        let textureLoader = new THREE.TextureLoader();
        mainMesh.material = new THREE.MeshStandardMaterial({
            map: textureLoader.load(modelMaterialPath+materialName+'_basecolor.png'),
            normalMap: textureLoader.load(modelMaterialPath+materialName+'_normal.png'),
            roughnessMap: textureLoader.load(modelMaterialPath+materialName+'_roughness.png'),
            metalnessMap: textureLoader.load(modelMaterialPath+materialName+'_metallic.png'),
            aoMap: textureLoader.load(modelMaterialPath+materialName+'_ao.png'),

            //roughness: 1,
            //metalness: 0,
            aoMapIntensity: .5,  // The ao map appears to quash the reflectionCube.
            //envMap: reflectionCube
        });

        // The fire hydrant uses UDIM, but is able to operate without UDIM via simple
        // texture coordinate wrapping.  This is because only symmetric parts are placed
        // in UDIM space, and can re-use the main texture via wrapped coordinates.
        // https://support.allegorithmic.com/documentation/display/SPDOC/UDIM
        function wrap(texture) {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        }
        wrap(mainMesh.material.map);
        wrap(mainMesh.material.normalMap);
        wrap(mainMesh.material.roughnessMap);
        wrap(mainMesh.material.metalnessMap);
        wrap(mainMesh.material.aoMap);

        let scale = new THREE.Matrix4();
        //Scales Model down to decimeters
        scale.makeScale(.1,.1,.1);
        transformMatrix.multiply(scale);
        object.applyMatrix(transformMatrix);
        scene.add(object);
        window.mainObject = object;  // for debugging only
        window.mainMesh = mainMesh;  // for debugging only
    });
  }
}

  class MaterialLibrary
  {
    constructor()
    {
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
      for (var i=0; i<this.materialList.length; i++)
      {

        //Set the current Material name to the String in the array of material names.
        let matName = this.materialList[i];

        //Create correct paths for the material
        let matNamePath = matFolder + "/" + matName + "_basecolor"+extension;
        let matNormalPath = matFolder + "/" + matName + "_normal"+extension;
        let matRoughnessPath = matFolder + "/" + matName + "_roughness"+extension;
        let matMetalnessPath = matFolder + "/" + matName + "_metalness"+extension;
        let roomCube = new THREE.CubeTextureLoader().setPath( 'img/cubeMaps/' ).load( ['material_roomCube_px.jpg','material_roomCube_nx.jpg','material_roomCube_py.jpg','material_roomCube_ny.jpg','material_roomCube_pz.jpg','material_roomCube_nz.jpg'] );

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
        let material = new THREE.MeshStandardMaterial({ map: texture });

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
    load(matName)
    {

      //Cycle through material list
      for (var i=0; i<this.materialList.length; i++)
      {
        //Check name passed matches
        if(matName == this.materialList[i])
        {
          //return the material from the corresponding array of materials
          return this.materials[i];
        }
      }
    }
  }

  var toggleSunCircling = function(){
      sunCircling = !sunCircling;
  };


  class houseLightManager
  {
    constructor()
    {
        this.sceneLights = []
        //let vec = new THREE.Vector3(2,2,2);
      //this.addRoomLight(vec);
    }
    addRoomLight(position, roomName)
    {
      this.position = position;
      this.light = new THREE.PointLight(new THREE.Color(1, .95, .9), 1);

      this.light.position.set(this.position.x, this.position.y + 26, this.position.z);
      this.light.decay = 1;
      this.light.distance = 80;

      //Set the shadow map to half the size of default
      this.light.shadow.mapSize.width = 256; // default is 512
      this.light.shadow.mapSize.height = 256; // default is 512
      this.light.castShadow = true;

      this.sceneLights.push(this.light,roomName);
    }
    update()
    {
        for(var x = 0; x <this.sceneLights.length;x+=2)
        {
        scene.add(this.sceneLights[x]);
        }

    }
    lightToggle(x)
    {
      for(var z = 0; z <this.sceneLights.length;z++)
      {
        if(x == z)
        {
        if(this.sceneLights[z].distance == 80)
        {
          this.sceneLights[z].distance = .1;
        }
        else {
          this.sceneLights[z].distance = 80;
        }
      }
      }
    }
    lightsOff()
    {
      for(var z = 0; z <this.sceneLights.length;z+=2)
      {
          this.sceneLights[z].distance = .1;
      }
    }
    lightsOn()
    {
      for(var z = 0; z <this.sceneLights.length;z+=2)
      {
          this.sceneLights[z].distance = 80;
      }
    }
  }






  class ApertureModel
  {
    constructor(apertureName,modelName,materialName,dimensions,position)
    {
      this.name = apertureName;
      this.modelName = modelName;
      this.materialName = materialName;
      this.dims = dimensions;
      this.positionOffset =position ;
    }
  }

  class ApertureLibrary
  {
    constructor()
    {
      this.apertures = [];
      this.apertures.push(new ApertureModel("door 01","mdl_door_01","mdl_door_01",new THREE.Vector3(9.4,21,1),new THREE.Vector3(0,0,0)));
      this.apertures.push(new ApertureModel("door 01 open","mdl_door_01_open","mdl_door_01",new THREE.Vector3(9.4,21,1),new THREE.Vector3(0,0,0)));
      this.apertures.push(new ApertureModel("door 01 open wide","mdl_door_01_openwide","mdl_door_01",new THREE.Vector3(9.4,21,1),new THREE.Vector3(0,0,0)));
      this.apertures.push(new ApertureModel("door 02","mdl_door_02","mdl_door_01",new THREE.Vector3(9.4,21,1),new THREE.Vector3(0,0,0)));
      this.apertures.push(new ApertureModel("door 02 open","mdl_door_02_open","mdl_door_01",new THREE.Vector3(9.4,21,1),new THREE.Vector3(0,0,0)));
      this.apertures.push(new ApertureModel("door 02 open wide","mdl_door_02_openwide","mdl_door_01",new THREE.Vector3(9.4,21,1),new THREE.Vector3(0,0,0)));
      this.apertures.push(new ApertureModel("window 01","mdl_window_01","mdl_window_01",new THREE.Vector3(21,13,1),new THREE.Vector3(0,0,0)));
      this.apertures.push(new ApertureModel("window 02","mdl_window_02","mdl_window_01",new THREE.Vector3(21,7,1),new THREE.Vector3(0,0,0)));
    }
    load(apertureName)
    {
        for(var x = 0;x<this.apertures.length;x++)
        {

          if(this.apertures[x].name == apertureName)
          {
            return this.apertures[x];
          }
        }
    }
  }

  matLib = new MaterialLibrary();
  mdlLib = new ModelLibrary();
  apertureLib = new ApertureLibrary();
  houseLighting = new houseLightManager();


  class Plot
  {
    constructor()
    {
      this.plotGeom = new THREE.CylinderGeometry(200, 200,1,64);
      this.floorColor = new THREE.Color(.7, 1, .5);
      this.floorMat = new THREE.MeshPhongMaterial();
      this.floorMat.color = this.floorColor;
      this.partNumber = 0;
      this.plotMesh = new THREE.Mesh(this.plotGeom, this.floorMat);
      this.plotMesh.receiveShadow = true;
      this.plotMesh.castShadow = true;
      scene.add(this.plotMesh);
    }
  }
  // plot = new Plot();


  class Grid {
    constructor() {
      this.matGridLrg = new THREE.LineBasicMaterial( { color: 0x53464a } );
      this.matGridSml  = new THREE.LineBasicMaterial( { color: 0x372f32 } );

      var dimX = 20;
      var dimZ = 20;

      for (var x= 0;x<=dimX;x++)
        {
          for (var z = 0;z<=dimZ;z++)
        {

          var geometry = new THREE.Geometry();
          for (var j = 1;j<10;j++)
        {
          geometry.vertices.push(new THREE.Vector3(-100+j+z*10,0,100) );
          geometry.vertices.push(new THREE.Vector3(-100+j+z*10,0,-100) );
        }


          var geometry2 = new THREE.Geometry();
          for (var y = 1;y<10;y++)
        {
          geometry2.vertices.push(new THREE.Vector3(-100, 0, -100+y+x*10) );
          geometry2.vertices.push(new THREE.Vector3(100, 0, -100+y+x*10) );
        }


          this.gridLineLrgGeomX = new THREE.Geometry();
          this.gridLineLrgGeomX.vertices.push(new THREE.Vector3(-100, 0, -100+x*10) );
          this.gridLineLrgGeomX.vertices.push(new THREE.Vector3(100, 0, -100+x*10) );

          this.gridLineLrgGeomZ = new THREE.Geometry();
          this.gridLineLrgGeomZ.vertices.push(new THREE.Vector3(-100+z*10,0,-100) );
          this.gridLineLrgGeomZ.vertices.push(new THREE.Vector3(-100+z*10,0,100) );

          this.gridLineLrgX = new THREE.LineSegments( this.gridLineLrgGeomX, this.matGridLrg );
          this.gridLineLrgZ = new THREE.LineSegments( this.gridLineLrgGeomZ, this.matGridLrg  );

          this.gridLineSmlX = new THREE.LineSegments( geometry, this.matGridSml );
          this.gridLineSmlZ = new THREE.LineSegments( geometry2, this.matGridSml  );

          if(z != dimZ && x !=dimX)
            {
          scene.add( this.gridLineSmlX );
          scene.add( this.gridLineSmlZ );
        }
          scene.add( this.gridLineLrgX );
          scene.add( this.gridLineLrgZ );


        }
        }
    }
  }


  class Floor {
    constructor(origin, dimensions, matName) {

      //transformation values for the parent room
      this.origin = new THREE.Matrix4;
      this.origin = origin;
      //Vector dimensions for the parent room
      this.dimensions = dimensions;
      //rotation materix to align the floorMat
      this.rotation = new THREE.Matrix4;
      this.rotation.makeRotationX(-Math.PI/2)

      this.floorGeom = new THREE.PlaneGeometry(this.dimensions.x-2, this.dimensions.z-2);

      assignUVs(this.floorGeom);

      this.floorMesh = new THREE.Mesh(this.floorGeom, matLib.load(matName));

      this.floorMesh.receiveShadow = true;
      this.floorMesh.castShadow = true;
      this.floorMesh.applyMatrix(this.rotation);
      this.floorMesh.applyMatrix(this.origin);

      scene.add(this.floorMesh);


      /*
      this.ceilingOffset = new THREE.Matrix4;
      this.ceilingOffset.makeTranslation(0,this.dimensions.y,0)
      this.ceilingOffset.multiply(this.origin);

      this.ceilingMesh = new THREE.Mesh(this.floorGeom, matLib.floor_wood_01);
      this.ceilingMesh.receiveShadow = true;
      this.ceilingMesh.castShadow = true;
      this.ceilingMesh.applyMatrix(this.ceilingOffset);
      scene.add(this.ceilingMesh);
      */

      //Create foundations for the floor
      let foundationsGeom = new THREE.BoxGeometry(this.dimensions.x+3, 5, this.dimensions.z+2);
      assignUVs(foundationsGeom);

      let foundationsMesh = new THREE.Mesh(foundationsGeom, matLib.load("material_brickwall_01"));
      foundationsMesh.receiveShadow = true;
      foundationsMesh.castShadow = true;

      let foundationsTranslate = new THREE.Matrix4();
      foundationsTranslate.makeTranslation(0,-2.6,0);
      foundationsTranslate.multiply(this.origin);
      foundationsMesh.applyMatrix(foundationsTranslate);
      scene.add(foundationsMesh);

    }
  }

  class Opening
  {
    constructor(wallOrigin,wallDims,widthPos,heightPos,width,height,matName,modelName)
    {

      this.apertureModel = apertureLib.load(modelName);

      this.matName = matName;
      //this.materialLibrary = new MaterialLibrary();
      this.wallOrigin = new THREE.Matrix4();
      this.wallOrigin.multiply(wallOrigin);
      this.wallDims = wallDims;
      this.widthPos = widthPos;
      this.heightPos = heightPos;
      this.width = this.apertureModel.dims.x;
      this.height = this.apertureModel.dims.y;
      this.active = true;

      let openingDims = new THREE.Vector3(this.apertureModel.dims.x,this.apertureModel.dims.y,wallDims.z)

      let topSectionHeight = (this.wallDims.y-this.height)/2-this.heightPos;
      let topTranslation = this.height/2+((this.wallDims.y-this.height)/2+this.heightPos)/2;
      let bottomSectionHeight = (this.wallDims.y-this.height)/2+this.heightPos;
      let bottomTranslation = this.height/2-this.height-((this.wallDims.y-this.height)/2-this.heightPos)/2;

      let transPos = new THREE.Matrix4();
      let transPos2 = new THREE.Matrix4();
      transPos.multiply(this.wallOrigin);
      transPos2.makeTranslation(this.widthPos,this.heightPos,wallDims.z/2);
      transPos.multiply(transPos2);

      let transTopPos = new THREE.Matrix4();
      let transTopPos2 = new THREE.Matrix4();
      transTopPos.multiply(this.wallOrigin);
      transTopPos2.makeTranslation(this.widthPos,topTranslation,wallDims.z);
      transTopPos.multiply(transTopPos2);

      let transBotPos = new THREE.Matrix4();
      let transBotPos2 = new THREE.Matrix4();
      transBotPos.multiply(this.wallOrigin);
      transBotPos2.makeTranslation(this.widthPos,bottomTranslation,wallDims.z);
      transBotPos.multiply(transBotPos2);

      this.openingMat = new THREE.MeshBasicMaterial();
      this.openingMat.color = new THREE.Color(1, 0, 1);
      this.openingMat.wireframe = true;

      this.openingGeomTop = new THREE.PlaneGeometry(this.width,topSectionHeight);
      let vecTop = new THREE.Vector3();
      vecTop.setFromMatrixPosition(transTopPos2);
      assignUVs(this.openingGeomTop,vecTop);

      this.openingGeomBot = new THREE.PlaneGeometry(this.width,bottomSectionHeight);
      let vecBot = new THREE.Vector3();
      vecBot.setFromMatrixPosition(transBotPos2);
      assignUVs(this.openingGeomBot,vecBot);



      this.openingGeom = new THREE.BoxGeometry(this.width,this.height,this.wallDims.z);
      this.mergedWallOpening = new THREE.Geometry();
      this.mergedWallOpening.applyMatrix(this.wallOrigin)
      this.opening = new THREE.Mesh(this.openingGeom, this.openingMat);

      for(var z = 0;z<4;z++)
      {
          let transToSides = new THREE.Matrix4();
          //let sideMesh =
          switch(z)
          {
              case 0:
              transToSides.makeTranslation(0,openingDims.y/2,0);
              this.side = new THREE.PlaneGeometry(openingDims.x,wallDims.z);
              break;
              case 1:
              transToSides.makeTranslation(-openingDims.x/2,0,0);
              this.side = new THREE.PlaneGeometry(openingDims.y,wallDims.z);
              break;
              case 2:
              transToSides.makeTranslation(0,-openingDims.y/2,0);
              this.side = new THREE.PlaneGeometry(openingDims.x,wallDims.z);
              break;
              case 3:
              transToSides.makeTranslation(openingDims.x/2,0,0);
              this.side = new THREE.PlaneGeometry(openingDims.y,wallDims.z);
              break;
          }

          //this.side = new THREE.PlaneGeometry(10,wallDims.z);

          let trans = new THREE.Matrix4();
          let rotate1 = new THREE.Matrix4();
          let rotate2 = new THREE.Matrix4();

          rotate1.makeRotationX((Math.PI/2));
          rotate2.makeRotationY(z*(Math.PI/2));

          trans.multiply(transPos);
          trans.multiply(transToSides);

          trans.multiply(rotate1);
          trans.multiply(rotate2);


          let vec = new THREE.Vector3();
          vec.setFromMatrixPosition(trans);
          assignUVs(this.side,vec);


          this.mergedWallOpening.merge(this.side,trans);
      }


      this.opening.applyMatrix(transPos);

      mdlLib.load(this.apertureModel.modelName,this.apertureModel.materialName,transPos);

      if(topSectionHeight > 0)
      {
          this.mergedWallOpening.merge(this.openingGeomTop,transTopPos);
      }
      if(bottomSectionHeight > 0)
      {
          this.mergedWallOpening.merge(this.openingGeomBot,transBotPos);
      }

      let mesh = new THREE.Mesh(this.mergedWallOpening, matLib.load(this.matName));
      mesh.castShadow = true;
      mesh.recieveShadow = true;
      //scene.add(mesh);
      this.geometry = this.mergedWallOpening;
    }

  }
  class Wall
  {
    constructor(origin, dimensions,exterior, openings, matName)
    {
      //this is a transform matrix to move the entire wall
      this.origin = new THREE.Matrix4();

      this.flip = 1;
      this.dims = dimensions;
      this.matName = matName;
      this.origin.multiply(origin);
      if(exterior)
      {
        let translate = new THREE.Matrix4();
        translate.makeTranslation(0,0,0);
        let rotate = new THREE.Matrix4();
        rotate.makeRotationY(Math.PI);
        this.origin.multiply(translate);
        this.origin.multiply(rotate);
        this.flip =-1;
        this.dims.z+=1;
        this.dims.x+=this.dims.z*2+2;
        this.matName  = "material_brickwall_01";
      }
      else {
        this.dims.x-=this.dims.z*2;
      }
      //this is an array for openings
      this.openings = openings;

      //this is array for the sections of wall between openings
      this.wallSegs = [];

      //this stores a set of points denoting the start/end of the wall and each split
      this.wallPoints = [];

      //this is to store the walls geometry
      this.geometry = new THREE.Geometry();



      //this creates a series of points to draw wall segs between


      this.wallPoints.push(this.flip*(-this.dims.x/2)); //start point of the wall
      for(var z = 0;z<this.openings.length;z++)
      {
        this.geometry.merge(this.openings[z].geometry);
        this.wallPoints.push(this.flip*(this.openings[z].widthPos-this.openings[z].width/2)); //value for start point of the opening
        this.wallPoints.push(this.flip*(this.openings[z].widthPos+this.openings[z].width/2)); //value for end point of the opening
      }
      this.wallPoints.push(this.flip*(this.dims.x/2)); //end point of the wall





      for(var z = 0;z<this.wallPoints.length-1;z++)
      {
        //Modulus to skip gaps
        if(z % 2 == 0)
        {
        let combined = new THREE.Matrix4();
        let translate = new THREE.Matrix4();
        translate.makeTranslation((this.wallPoints[z]+this.wallPoints[z+1])/2,0,this.dims.z);
        combined.multiply(this.origin);
        combined.multiply(translate);

        //this.wallSegGeom = new THREE.BoxGeometry(Math.abs(this.wallPoints[z]-this.wallPoints[z+1]),this.dims.y,this.dims.z);

        this.wallSegGeom = new THREE.PlaneGeometry(Math.abs(this.wallPoints[z+1]-this.wallPoints[z]),this.dims.y);

        //this.outerWallSegGeom = new THREE.PlaneGeometry(Math.abs(this.wallPoints[z+1]-this.wallPoints[z]),-this.dims.y);

        //alert(this.wallPoints[z]-this.wallPoints[z+1]);
        let vec = new THREE.Vector3();
        let test = new THREE.Matrix4();

        test = combined;
        //test.rotation.set(0,0,0);
        vec.setFromMatrixPosition(translate);
        assignUVs(this.wallSegGeom,vec);

        this.geometry.merge(this.wallSegGeom,combined)

        //this.wallSeg = new THREE.Mesh(this.wallSegGeom, matLib.load(matName));

        //this.wallSeg.castShadow = true;
        //this.wallSeg.receiveShadow = true;

        //this.wallSeg.applyMatrix(combined);

        //This if statement only adds the wallseg if it is larger than 0;
        //if(this.wallPoints[z+1]-this.wallPoints[z]>0)
        //{
        this.wallSegs.push(this.wallSeg);
        //}
        }
      }
      for(var z = 0;z<this.wallSegs.length;z++)
      {
        //scene.add(this.wallSegs[z]);
      }



      this.testMesh = new THREE.Mesh(this.geometry, matLib.load(this.matName ));
      this.testMesh = new THREE.Mesh(this.geometry);
      this.testMesh.castShadow = true;
      this.testMesh.receiveShadow = true;
      scene.add(this.testMesh);
      this.capWall();
    }
    capWall()
    {
      let material = new THREE.MeshBasicMaterial( {color: 0x333333} );
      this.wallTopGeom = new THREE.PlaneGeometry(this.dims.x,this.dims.z);
      this.transWallTop = new THREE.Matrix4();
      this.transWallTopRot = new THREE.Matrix4();
      this.transWallTop2 = new THREE.Matrix4();
      this.transWallTop.makeTranslation(0,this.dims.y/2,0);
      this.transWallTop2.makeTranslation(0,-this.dims.z/2,0);
      this.transWallTopRot.makeRotationX(-Math.PI/2)
      this.transWallTop.multiply(this.origin);
      this.transWallTop.multiply(this.transWallTopRot);
      this.transWallTop.multiply(this.transWallTop2);
      this.wallTop = new THREE.Mesh(this.wallTopGeom, material);
      this.wallTop.applyMatrix(this.transWallTop);
      scene.add(this.wallTop);
    }
  }

  class Room {
    constructor(name,dimensions, position, floorMat, wallMat,exteriorWalls) {

      this.walls = [];
      this.wallThickness = 1;
      this.exteriorWalls = exteriorWalls;
      this.wallMat = wallMat;

      this.dimensions = dimensions;
      this.position = position;

      this.origin = new THREE.Matrix4();
      this.origin.makeTranslation(position.x,position.y,position.z);

      this.openings = [];

      this.floor = new Floor(this.origin, this.dimensions,floorMat);

      houseLighting.addRoomLight(position,name);
      this.generateWalls();
    }


    generateWalls() {
      for (var i = 0; i < (4); i++) {
        this.openings = [];
        let wallTransform = new THREE.Matrix4();
        var tra = new THREE.Matrix4();
        var rot = new THREE.Matrix4();
        var sca = new THREE.Matrix4();
        var traGlobalPos = new THREE.Matrix4();
        var wallLength;
        if (i == 0 || i == 2) {
          wallLength = this.dimensions.x;
          //tra.multiply(this.origin);
          tra.makeTranslation(0, this.dimensions.y/2, (-this.dimensions.z / 2));
        } else {
          wallLength = this.dimensions.z;
          tra.makeTranslation(0, this.dimensions.y/2, (-this.dimensions.x / 2));
        }
        traGlobalPos.makeTranslation(this.position.x,this.position.z,this.position.y);
        rot.makeRotationY(i * (Math.PI / 2));

        wallTransform.multiply(this.origin);
        wallTransform.multiply(rot);
        wallTransform.multiply(tra);

        let wallDims = new THREE.Vector3(wallLength,this.dimensions.y,this.wallThickness);
        //var test = new THREE.Vector3(20,20,20);
        //alert("test");
        //wall = new Wall(combined,30,20);


        if(i==1)
        {
        this.openings.push(new Opening(wallTransform,wallDims,0,-3.5,9.4,21,this.wallMat,"door 01 open wide"));
        //this.openings.push(new Opening(wallTransform,wallDims,-8,-3.5,9.4,21,this.wallMat,"door 02"));
        //this.openings.push(new Opening(combined,wallDims,6,-3.5,9.4,21,this.wallMat));
        //this.openings.push(new Opening(combined,wallDims,16,-3.5,9.4,21,this.wallMat));
        }
        if(i==2)
        {
          this.openings.push(new Opening(wallTransform,wallDims,-12,-3.5,9.4,21,this.wallMat,"window 01"));
          //this.openings.push(new Opening(wallTransform,wallDims,-12,1,12,16,this.wallMat,"window 01"));
          this.openings.push(new Opening(wallTransform,wallDims,12,-3.5,9.4,21,this.wallMat,"window 02"));
          //this.openings.push(new Opening(wallTransform,wallDims,12,1,12,16,this.wallMat, "window 02"));
        }

        this.walls.push(new Wall(wallTransform,wallDims,false,this.openings,this.wallMat));

        if(this.exteriorWalls)
        {
        if(this.exteriorWalls[i] == true)
        {
          this.walls.push(new Wall(wallTransform,wallDims,true,this.openings,this.wallMat));
        }



      }


      }


    }

  }

  function assignUVs(geometry, worldoffset) {

      geometry.faceVertexUvs[0] = [];

      //If noo world offset is set, set it to a blank vector3
      if (!worldoffset)
      {
        worldoffset = new THREE.Vector3();
      }

      geometry.faces.forEach(function (face) {

          var components = ['x', 'z', 'y'].sort(function (a, b) {
              return Math.abs(face.normal[a]) > Math.abs(face.normal[b]);
          });

          var v1 = geometry.vertices[face.a];
          var v2 = geometry.vertices[face.b];
          var v3 = geometry.vertices[face.c];

          geometry.faceVertexUvs[0].push([

              new THREE.Vector2(v1[components[0]]+worldoffset.x, v1[components[1]]+worldoffset.y+16),
              new THREE.Vector2(v2[components[0]]+worldoffset.x, v2[components[1]]+worldoffset.y+16),
              new THREE.Vector2(v3[components[0]]+worldoffset.x, v3[components[1]]+worldoffset.y+16)
          ]);

      });

      geometry.uvsNeedUpdate = true;
  }




  class House
  {
  constructor(posX, posY, dimX, dimY)
    {
    var rotation = new THREE.Vector3(0, 0, 0);

    //Room List (Vector3 Room dimensions, Vector 3 Room position, String Floor material name, String Wall material Name )

    //hall
    let hallApertures = [];

    //hallApertures.push(new Aperture(0,"name",new THREE.Vector3(-15, 5, 0),true)) //Aperture arguments int side,string name,vector3 location,boolean enableModel
    let hallExteriorWalls = [false,true,false,false];
    this.hall = new Room("hall", new THREE.Vector3(70, 28, 20), new THREE.Vector3(-15, 5, 0), "material_woodfloor_01","material_wall_01",hallExteriorWalls);
    //bedroom 1
    let bedroom1ExteriorWalls = [true,true,false,false];
    this.bedroom1 = new Room("bedroom 1", new THREE.Vector3(50, 28, 70), new THREE.Vector3(-25, 5, -45), "material_carpet_01","material_wall_01",bedroom1ExteriorWalls);
    //let bedroomApertures = [new wallAperture("door 01",1,new THREE.Vector3(-25, 5, 0))]
    let bedroom2ExteriorWalls = [true,false,false,true];
    this.bedroom2 = new Room("bedroom 2", new THREE.Vector3(70, 28, 70), new THREE.Vector3(35, 5, -45), "material_carpet_01","material_wall_01",bedroom2ExteriorWalls);
    //bathrooms

    let bathroomExteriorWalls = [false,false,false,true];
    this.bathroom = new Room("Bathroom", new THREE.Vector3(50, 28, 40), new THREE.Vector3(45, 5, 10), "material_tiles_02","material_walltiles_02",bathroomExteriorWalls);
    //Loungeroom
    let loungeroomExteriorWalls = [false,true,true,false];
    this.loungeroom = new Room("Lounge Room",new THREE.Vector3(70, 28, 80), new THREE.Vector3(-15, 5, 50), "material_woodfloor_01","material_wall_01",loungeroomExteriorWalls);
    //Kitchen
    let kitchenExteriorWalls = [false,false,true,true];
    this.kitchen = new Room("Kitchen",new THREE.Vector3(50, 28, 60), new THREE.Vector3(45, 5, 60), "material_tiles_01","material_wall_01",kitchenExteriorWalls);

    houseLighting.update();
  }
  lightToggle()
  {
    this.loungeroom.lightToggle();
  }

  }





  //the same orbit control
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  // controls.minPolarAngle = 0;
  controls.maxPolarAngle = Math.PI/2 - Math.PI/180 * 10;
  controls.maxDistance = 500;
  controls.minDistance = 50;
  var currI = 0;
  //this clear the scene when parameters are updated
  function ClearScene() {
    for (i = 0; i < room1.walls.length; i++)
      scene.remove(room1.walls[i]);
    for (i = 0; i < room0.walls.length; i++)
      scene.remove(room0.walls[i]);
    for (i = 0; i < room3.walls.length; i++)
      scene.remove(room3.walls[i]);
  }
  //add keyboard listener


  house = new House();
  environment = new Environment();





  var cameralight = new THREE.PointLight(new THREE.Color(.2, .2, .2), 0.9);
  camera.add(cameralight);
  scene.add(camera);
  scene.add(new THREE.AmbientLight(new THREE.Color(.6, .7, .9), 0.4));




  var MyUpdateLoop = function() {
    requestAnimationFrame(MyUpdateLoop);
    if (sunCircling) {
        environment.time += effectController.sunSpeed;
        environment.update();
    }
    //console.log(environment.time);
    renderer.render(scene, camera);
  };


  requestAnimationFrame(MyUpdateLoop);
  //keyboard functions, change parameters values
  function myFunction() {
    ClearScene();
    gridSize += 1;
    roomGen();
  }

  function handleKeyDown(event) {    }

  function onMouseMove( event ) {

// calculate mouse position in normalized device coordinates
// (-1 to +1) for both components

mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
window.addEventListener( 'mousemove', onMouseMove, false );

window.requestAnimationFrame(myResize());
  console.log(c);
}
