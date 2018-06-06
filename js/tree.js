class Base {
      constructor() {
        this.baseGeom = new THREE.CylinderGeometry(5,5.5,.5,64);
        this.planeGeom = new THREE.CylinderGeometry(200,200,.1,64);
        this.baseColor = new THREE.Color(0.2, 0.21, 0.22);
        this.baseMat = new THREE.MeshPhongMaterial();
        this.baseMat.color = this.baseColor;
        var sphere_mesh = new THREE.Mesh(this.baseGeom, this.baseMat);
        var plane_mesh = new THREE.Mesh(this.planeGeom, this.baseMat);
        sphere_mesh.castShadow = true;
        sphere_mesh.receiveShadow = true;

        plane_mesh.receiveShadow = true;
        this.translate = new THREE.Matrix4();
        this.translate.makeTranslation(0, -0.5, 0);

        this.translate2 = new THREE.Matrix4();
        this.translate2.makeTranslation(0, -1, 0);
        plane_mesh.applyMatrix(this.translate);
        scene.add(sphere_mesh);
        scene.add(plane_mesh);
      }
    }




class Tree
{
  constructor()
  {
    //position
    this.origin = new THREE.Matrix4();
    this.initDir = new THREE.Matrix4();
    this.origin.makeTranslation(100,0,100);
    this.segLength = 5.8;

    //Array containing tree meshes
    this.segMeshes = [];
    this.segments = [];
    this.activeSegments = [];
    this.nextSegments = [];

    //Array containing
    this.leafMeshes = [];
    this.leaves = [];

    this.root = new Segment(this.origin, this.initDir);
    this.root.trunk = true;
    this.segments.push(this.root);
    this.writeStats();
    this.segmentColor = new THREE.Color(1, 1, 1);
    //Tree material
    this.texture_bark = new THREE.TextureLoader().load('img/bark.jpg');
    this.texture_bark_normal = new THREE.TextureLoader().load('img/bark_normal.jpg');
    //this.segmentGeom = new THREE.CylinderGeometry(this.trunkSize,this.trunkSize+.02,this.segLength+.2,6);
    this.segmentMat = new THREE.MeshPhongMaterial( {map: this.texture_bark} );
    this.segmentMat.normalMap = this.texture_bark_normal;
    this.segmentMat.color = this.segmentColor;
    //this.segmentMat.wireframe = true;
    this.texture_leaves = new THREE.TextureLoader().load('img/leaves.jpg');
    this.texture_leaves_alpha = new THREE.TextureLoader().load('img/leaves_alpha.jpg');
    //this.leafColor = new THREE.Color(0,1,0);
    this.leafMat = new THREE.MeshPhongMaterial( {map: this.texture_leaves,alphaMap : this.texture_leaves_alpha,
            transparent : true,
            depthWrite  : false} );

    this.leafMat.color = this.leafColor;
    this.leafMat.side = THREE.DoubleSide;

  }
  reset()
  {
    this.clearFromeScene();
    this.origin = new THREE.Matrix4();
    this.initDir = new THREE.Matrix4();
    //this.initDir.makeTranslation(0,2,0);
    this.segLength = 1;
    this.segMeshes = [];
    this.segments = [];
    this.activeSegments = [];
    this.nextSegments = [];
    this.root = new Segment(this.origin, this.initDir);
    this.root.trunk = true;
    this.segments.push(this.root);
    this.writeStats();
  }
  grow()
  {
    this.clearFromeScene();
    this.segMeshes = [];
    this.leafMeshes = [];
    this.leaves = [];
    //alert(this.leafMeshes.length);
    //alert("grow!");
    this.activeSegments.length = 0;
    this.count = 0;
    this.writeStats();
    for(var i = 0;i < this.segments.length;i++)
    {
      this.segments[i].trunkSize+=.17;
      //this.segments[i].segLength+=.05;
      //this.segments[i].render();
      this.segMeshes.push(this.segments[i].getMesh())
      if(this.segments[i].active)
      {

        this.segments[i].active = false;
        this.activeSegments.push(this.segments[i]);
      }
    }

    for(var z = 0;z < this.activeSegments.length;z++)
    {

        //alert(this.activeSegments[z].origin.elements);
        //this.LeafMeshes.push(this.segments[i].getMesh())
        this.nextSegments = [];
        this.nextSegments = this.activeSegments[z].getNext();
        for(var t = 0;t<this.nextSegments.length;t++)
      {
        //alert("so....")
        this.segments.push(this.nextSegments[t]);
        if(this.nextSegments[t].active)
        {
          //alert("Active?");
          this.leaves.push( new Leaf(this.nextSegments[t].origin));
      }
      }
        //this.segments.push(new Segment(this.origin, this.initDir, 2));

    }
    for(var y = 0;y < this.leaves.length;y++)
   {
        this.leafMeshes.push(this.leaves[y].getMesh());
    }
    this.addToScene();
  }
  //Clears Tree Meshes from Scene
  clearFromeScene()
  {
    for (var i=0;i<this.segMeshes.length;i++)
    {
      scene.remove(this.segMeshes[i]);
    }
    //alert(this.leafMeshes.length + " " +this.segMeshes.length);
    for (var i=0;i<this.leafMeshes.length;i++)
    {
      //alert("hm");
      scene.remove(this.leafMeshes[i]);
    }
  }
  //Adds all Tree Meshes to scene
  addToScene()
  {
    for (var i=0;i<this.segMeshes.length;i++)
    {
    scene.add(this.segMeshes[i]);
    }
    //alert(this.leafMeshes.length);
    for (var i=0;i<this.leafMeshes.length;i++)
    {
     scene.add(this.leafMeshes[i]);
    }
  }
  writeStats()
  {
    this.count = 0;
    for(var i = 0;i < this.segments.length;i++)
    {
      if(this.segments[i].active)
      {
        this.count++;
      }
    }
    // document.getElementById('segNo').innerHTML = this.segments.length;
    // document.getElementById('activeSegNo').innerHTML = this.count;
    // document.getElementById('inactiveSegNo').innerHTML = this.segments.length-this.count;
  }
}

class Segment
{
  constructor(posMatrix, direction)
  {
    this.segLength = 5;

    this.trunkSize = 0;
    this.active = true;
    this.trunk = false;
    //Create array to store this segments next segments in.
    this.nextSegments = [];
    this.origin = new THREE.Matrix4();

    this.nextPos = new THREE.Matrix4();
    this.meshPos = new THREE.Matrix4();
    this.translation = new THREE.Matrix4();
    this.halfTranslation = new THREE.Matrix4();
    this.rotationX = new THREE.Matrix4();
    this.rotationZ = new THREE.Matrix4();
    this.origin.multiply(posMatrix);

    //this.origin = new THREE.Vector3(origin.x,origin.y,origin.z);

    //this.direction = new THREE.Vector3(direction.x,direction.y,direction.z);
    this.translation.makeTranslation(0,this.segLength,0);
    this.halfTranslation.makeTranslation(0,this.segLength/2,0);
    this.rotationX.makeRotationX(((Math.random()-.5)*60) * Math.PI / 180);
    this.rotationZ.makeRotationZ(((Math.random()-.5)*60) * Math.PI / 180);
    //this.nextPos = new THREE.Vector3(this.origin.x+this.direction.x,this.origin.y+this.direction.y,this.origin.z+this.direction.z);
    //this.origin = new THREE.Vector3(0,0,0);
    //this.nextPos = new THREE.Vector3(0,0,0);
    //this.origin.makeTranslation(origin);
    this.nextPos.multiply(this.origin);
    this.meshPos.multiply(this.origin);
    //this.nextPos.makeTranslation(0,3,0);
    this.nextPos.multiply(this.rotationX);
    this.nextPos.multiply(this.rotationZ);
    this.meshPos.multiply(this.rotationX);
    this.meshPos.multiply(this.rotationZ);
    this.nextPos.multiply(this.translation);
    this.meshPos.multiply(this.halfTranslation);
    //alert(this.nextPos.elements);
    //alert(this.origin.x)
        //this.direction.x += x;
    //this.direction.x =(Math.random()-.5)*2
    //this.direction.z =(Math.random()-.5)*2;
    //this.direction.y =(Math.random())*1;;
        //this.segment = new Segment(this.nextPos, this.direction, this.nextSize);

    //this.render();
  }
  getNext()
  {
      if(this.split)
      {

      }
      if(this.trunk)
      {
        this.nextRotationX = new THREE.Matrix4();
        this.nextRotationX2 = new THREE.Matrix4();
        this.nextRotationX.makeRotationY(1 * Math.PI / 180);
        this.nextRotationX2.makeRotationY(20 * Math.PI / 180);

        this.nextPos.multiply(this.nextRotationX)
        this.nextSegments.push(new Segment(this.nextPos, this.direction));
        this.nextPos.multiply(this.nextRotationX)
        //this.direction.x =(Math.random()-.5)*2
        //this.direction.z =(Math.random()-.5)*2;
        if((Math.floor(Math.random()+.6))<1)
        {
        var blerg = new Segment(this.nextPos, this.direction)
        blerg.trunk = true;
        this.nextSegments.push(blerg);
      }
        //this.segment = new Segment(this.nextPos, this.direction, this.nextSize);
      }
      else {
          //alert(Math.floor(Math.random()+.5));
          if((Math.floor(Math.random()+.4))<1)
          {
          this.nextSegments.push(new Segment(this.nextPos, this.direction));
          }
          this.nextRotationX3 = new THREE.Matrix4();
          this.nextRotationX3.makeRotationY(20 * Math.PI / 180);
          this.nextPos.multiply(this.nextRotationX3)
          this.nextSegments.push(new Segment(this.nextPos, this.direction));

      }
      return this.nextSegments;
  }
  getMesh()
  {
    this.segmentColor = new THREE.Color(0.6, 0.4, 0.3);
    var material = new THREE.LineBasicMaterial({color: 0x775522});
    if(this.trunk)
    {
      material = new THREE.LineBasicMaterial({color: 0xAA5522});
      this.segmentColor = new THREE.Color(1, 0.8, 0.6);
    }
    var geometry = new THREE.Geometry();
    geometry.vertices.push(this.origin,this.nextPos);

    var line = new THREE.Line( geometry, material );
    //scene.add( line );
    //this.my_texture = new THREE.TextureLoader().load('img/text.png');
    //this.my_texture.wrapS = THREE.RepeatWrapping;
    //this.my_texture.wrapT = THREE.RepeatWrapping;
    this.segmentGeom = new THREE.CylinderGeometry(this.trunkSize-.05,this.trunkSize,this.segLength+.2,60);

    //this.segmentMat = new THREE.MeshPhongMaterial();
    //this.segmentMat = new THREE.MeshBasicMaterial( {map: this.my_texture} );
    //this.segmentMat.color = this.segmentColor;
    //this.segmentMat.wireframe = true;
    this.segMesh = new THREE.Mesh(this.segmentGeom, tree.segmentMat);
    this.segMesh.castShadow = true;
    this.segMesh.receiveShadow = true;

    this.translate = new THREE.Matrix4();
    this.translate.multiply(this.meshPos);
    //this.translate.makeTranslation(this.origin.x, this.origin.y, this.origin.z);
    this.segMesh.applyMatrix(this.translate);
    return this.segMesh;
  }
}

class Leaf
{
  constructor(matrix)
  {
    this.meshPos = new THREE.Matrix4();
    this.meshOffset = new THREE.Matrix4();
    this.meshOffset.makeTranslation(0,0,0);
    if(matrix !=null)
    {
     this.meshPos.multiply(matrix);
    }
  }
  getMesh()
  {
    this.leafGeom = new THREE.PlaneGeometry(18,18,4,100);
    this.planeGeom = new THREE.CylinderGeometry(200,200,.1,64);

    this.leafMesh = new THREE.Mesh(this.leafGeom, tree.leafMat);

    this.translate = new THREE.Matrix4();
    this.translate.multiply(this.meshPos);
    this.translate.multiply(this.meshOffset);

    this.leafMesh.applyMatrix(this.translate);
    return this.leafMesh;
  }
}
leaf = new Leaf();
//scene.add(leaf.getMesh());


//window.addEventListener('keydown', handleKeyDown, false);
function CreateScene() {

  base = new Base();
  tree = new Tree();
  tree.grow();

    for(var i =0; i<12;i++)
    {
        tree.grow();
    }
  //tree.grow();
  //tree.grow();
  //tree.grow();
  //gizmo = new Gizmo();
}


CreateScene();

function myFunction(repeats) {
  //ClearScene();
  for(var i =0; i<repeats;i++)
  {
  tree.grow();
  }
  //roomGen();
}
function resetTree(repeats) {
  //ClearScene();

  tree.reset();

  //roomGen();
}
function handleKeyDown(event) {
  if (event.keyCode === 49) { //49 is "1"
    clearScene();
    myFunction();
    loop++;
  }

}
// console.log(c);
