var scene, camera, renderer;

var WIDTH  = window.innerWidth;
var HEIGHT = window.innerHeight;

var SPEED = 0.01;

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



function init() {
    scene = new THREE.Scene();

    initCube();
    initCamera();
    initRenderer();

    document.body.appendChild(renderer.domElement);
    //controls = new THREE.OrbitControls(camera, renderer.domElement);
    //grid = new Grid();
    //
}

function initCamera() {
    camera = new THREE.PerspectiveCamera(70, WIDTH / HEIGHT, 1, 10);
    camera.position.set(0, 3.5, 5);
    camera.lookAt(scene.position);
    //controls = new THREE.OrbitControls(camera, renderer.domElement);
}

function initRenderer() {
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    //renderer.setSize(WIDTH, HEIGHT);
}

function initCube() {
    cube = new THREE.Mesh(new THREE.CubeGeometry(2, 2, 2), new THREE.MeshNormalMaterial());
    scene.add(cube);
}

function rotateCube() {
    //cube.rotation.x -= SPEED * 2;
    //cube.rotation.y -= SPEED;
    //camera.rotation.y -= SPEED;
    cube.rotation.z -= SPEED * 3;
}

function render() {
    requestAnimationFrame(render);
    rotateCube();
    var width = window.innerWidth;
      var height = window.innerHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    renderer.render(scene, camera);
}


init();
render();
 window.addEventListener('resize', render);
