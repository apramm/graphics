/////////////////////////////////////////////////////////////////////////////////////////
//  UBC CPSC 314 ------------ Sept 2023, Assignment 1 Creative Component
/////////////////////////////////////////////////////////////////////////////////////////

console.log('September 2023 A1~CREATIVE COMPONENT by Apram');


// SETUP RENDERER & SCENE
var canvas = document.getElementById('canvas');
var scene = new THREE.Scene();
// var renderer = new THREE.WebGLRenderer( { antialias: true } );
var renderer = new THREE.WebGLRenderer( {antialias: false});
// renderer.setPixelRatio(1.0);

  // set background colour to 0xRRGGBB  where RR,GG,BB are values in [00,ff] in hexadecimal, i.e., [0,255] 
renderer.setClearColor(0xffffff);     
canvas.appendChild(renderer.domElement);

// SETUP CAMERA
var camera = new THREE.PerspectiveCamera(30,1,0.01,1e99); // view angle, aspect ratio, near, far
camera.position.set(0,30,-20);
camera.lookAt(0,0,0);
scene.add(camera);

// SETUP ORBIT CONTROLS OF THE CAMERA
var controls = new THREE.OrbitControls(camera);
controls.damping = 0.2;
controls.autoRotate = false;

// ADAPT TO WINDOW RESIZE
function resize() {
//  renderer.setSize(window.innerWidth/4,window.innerHeight/4, false);
  renderer.setSize(window.innerWidth,window.innerHeight);
  console.log('window size: ',window.innerWidth,window.innerHeight);
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
}

// EVENT LISTENER RESIZE
window.addEventListener('resize',resize);
resize();

//SCROLLBAR FUNCTION DISABLE
window.onscroll = function () {
     window.scrollTo(0,0);
   }

/////////////////////////////////////	
// ADD LIGHTS  and define a simple material that uses lighting
/////////////////////////////////////	

light = new THREE.PointLight(0xffffff, 1.5);
light.position.set(0,4,3);
scene.add(light);
ambientLight = new THREE.AmbientLight(0x606060);
scene.add(ambientLight);

var diffuseMaterial = new THREE.MeshLambertMaterial( {color: 0xffffff} );
var diffuseMaterial2 = new THREE.MeshLambertMaterial( {color: 0xffffff, side: THREE.DoubleSide } );

//
//  DEFINE OBJECTS
//

/////////////////////////////////////	
// WORLD COORDINATE FRAME
/////////////////////////////////////	

var worldFrame = new THREE.AxesHelper(5) ;
scene.add(worldFrame);

///////////////////////////////////////////////////////////////////////
//   box
///////////////////////////////////////////////////////////////////////

// boxGeometry = new THREE.BoxGeometry( 2, 2, 2 );    // width, height, depth
// boxMaterial = new THREE.MeshLambertMaterial( {color: 0x7070ff} );
// box = new THREE.Mesh( boxGeometry, boxMaterial );
// box.position.set(-4, 1, 2);
// scene.add( box );

///////////////////////////////////////////////////////////////////////
//   box2
///////////////////////////////////////////////////////////////////////

// boxGeometry = new THREE.BoxGeometry( 2, 2, 2 );    // width, height, depth
// boxMaterial = new THREE.MeshLambertMaterial( {color: 0xffff00} );
// box2 = new THREE.Mesh( boxGeometry, boxMaterial );
// box2.position.set(-4, 3, 2);
// box2.rotation.set(0,Math.PI/4,0);
// scene.add( box2 );

///////////////////////////////////////////////////////////////////////
//   box3
///////////////////////////////////////////////////////////////////////

// boxGeometry = new THREE.BoxGeometry( 2, 2, 2 );    // width, height, depth
// boxMaterial = new THREE.MeshLambertMaterial( {color: 0xff0000} );
// box3 = new THREE.Mesh( boxGeometry, boxMaterial );
// box3.position.set(-4, 5, 2);
// box3.rotation.set(0,Math.PI/3,Math.PI/2);
// scene.add( box3 );


/////////////////////////////////////////////////////////////////////////
// cylinder
/////////////////////////////////////////////////////////////////////////

// parameters:    
  //radiusAtTop, radiusAtBottom, height, segmentsAroundRadius, segmentsAlongHeight
cylinderGeometry = new THREE.CylinderGeometry( 0.05, 0.05, 5.5, 20.0, 4.0 );
cylinderMaterial = new THREE.MeshLambertMaterial( {color: 0x808080} );   
cylinder = new THREE.Mesh( cylinderGeometry, cylinderMaterial);
cylinder.position.set(-5.5, 3, 3.8);
cylinder.geometry.rotateY( Math.PI / 2 );
cylinder.geometry.translate( 0, 0, - 7.5 / 2 ); 
scene.add( cylinder );

/////////////////////////////////////////////////////////////////////////
// cone signifying three mountains
/////////////////////////////////////////////////////////////////////////

// parameters:    
//    radiusAtTop, radiusAtBottom, height, segmentsAroundRadius, segmentsAlongHeight
// coneGeometry = new THREE.CylinderGeometry( 0.0, 2, 4.0, 40, 4 );
// coneMaterial = new THREE.MeshLambertMaterial( {color: 0x964b00} );   
// cone = new THREE.Mesh( coneGeometry, coneMaterial);
// cone.position.set(0, 1.5, 2);
// scene.add( cone);

// coneGeometry = new THREE.CylinderGeometry( 0.0, 2, 4.0, 40, 4 );
// coneMaterial = new THREE.MeshLambertMaterial( {color: 0x964b00} );   
// cone = new THREE.Mesh( coneGeometry, coneMaterial);
// cone.position.set(3, 1.5, 2);
// scene.add( cone);

// coneGeometry = new THREE.CylinderGeometry( 0.0, 2, 4.0, 40, 4 );
// coneMaterial = new THREE.MeshLambertMaterial( {color: 0x964b00} );   
// cone = new THREE.Mesh( coneGeometry, coneMaterial);
// cone.position.set(-3, 1.5, 2);
// scene.add( cone);

// coneGeometry = new THREE.CylinderGeometry( 0.0, 2, 4.0, 40, 4 );
// coneMaterial = new THREE.MeshLambertMaterial( {color: 0x964b00} );   
// cone = new THREE.Mesh( coneGeometry, coneMaterial);
// cone.position.set(-3, 1.5, 3);
// scene.add( cone);

// coneGeometry = new THREE.CylinderGeometry( 0.0, 2, 4.0, 40, 4 );
// coneMaterial = new THREE.MeshLambertMaterial( {color: 0x964b00} );   
// cone = new THREE.Mesh( coneGeometry, coneMaterial);
// cone.position.set(0, 1.5, 3);
// scene.add( cone);

// coneGeometry = new THREE.CylinderGeometry( 0.0, 2, 4.0, 40, 4 );
// coneMaterial = new THREE.MeshLambertMaterial( {color: 0x964b00} );   
// cone = new THREE.Mesh( coneGeometry, coneMaterial);
// cone.position.set(3, 1.5, 3);
// scene.add( cone);

// coneGeometry = new THREE.CylinderGeometry( 0.0, 2, 4.0, 40, 4 );
// coneMaterial = new THREE.MeshLambertMaterial( {color: 0x964b00} );   
// cone = new THREE.Mesh( coneGeometry, coneMaterial);
// cone.position.set(1.5, 1.5, 3);
// scene.add( cone);

// coneGeometry = new THREE.CylinderGeometry( 0.0, 2, 4.0, 40, 4 );
// coneMaterial = new THREE.MeshLambertMaterial( {color: 0x964b00} );   
// cone = new THREE.Mesh( coneGeometry, coneMaterial);
// cone.position.set(-1.5, 1.5, 3);
// scene.add( cone);

/////////////////////////////////////
//  CUSTOM SQUARE: mySquare U-letter
////////////////////////////////////
mySquareGeom = new THREE.Geometry(); 
mySquareMaterial = new THREE.MeshBasicMaterial( {color: 0x808080} );

var v0 = new THREE.Vector3(0,0,0);
var v1 = new THREE.Vector3(2.5,0,0);
var v2 = new THREE.Vector3(0,2.5,0);
var v3 = new THREE.Vector3(2.5,2.5,0);
var v4 = new THREE.Vector3(0,0,2.5);
var v5 = new THREE.Vector3(0,2.5,2.5);
var v6 = new THREE.Vector3(2.5,0,2.5);
var v7 = new THREE.Vector3(2.5,2.5,2.5);


mySquareGeom.vertices.push(v0);
mySquareGeom.vertices.push(v1);
mySquareGeom.vertices.push(v2);
mySquareGeom.vertices.push(v3);

mySquareGeom.vertices.push(v4);
mySquareGeom.vertices.push(v5);
mySquareGeom.vertices.push(v6);
mySquareGeom.vertices.push(v7);

mySquareGeom.faces.push( new THREE.Face3( 0, 1, 2 ) );
mySquareGeom.faces.push( new THREE.Face3( 1, 3, 2 ) );

mySquareGeom.faces.push( new THREE.Face3( 4, 7, 5 ));
mySquareGeom.faces.push(new THREE.Face3( 6, 7, 4));

mySquareGeom.faces.push( new THREE.Face3( 0, 4, 6 ));
mySquareGeom.faces.push( new THREE.Face3( 6, 1, 0 ));


mySquareGeom.computeFaceNormals();

cs = new THREE.Mesh( mySquareGeom, mySquareMaterial );
cs.position.set(7, 0, 3);
cs.rotation.set(0,-Math.PI/2,0);
scene.add(cs);

/////////////////////////////////////
//  CUSTOM SQUARE: mySquare B-letter
////////////////////////////////////

mySquareGeom = new THREE.Geometry(); 
mySquareMaterial = new THREE.MeshBasicMaterial( {color: 0x808080} );

var v0 = new THREE.Vector3(0,0,0);
var v1 = new THREE.Vector3(2.5,0,0);
var v2 = new THREE.Vector3(0,2.5,0);
var v3 = new THREE.Vector3(2.5,2.5,0);
var v4 = new THREE.Vector3(0,0,2.5);
var v5 = new THREE.Vector3(0,2.5,2.5);
var v6 = new THREE.Vector3(2.5,0,2.5);
var v7 = new THREE.Vector3(2.5,2.5,2.5);

var v8 = new THREE.Vector3(0,1.25,0);
var v9 = new THREE.Vector3(0,1.25,2.5);
var v10 = new THREE.Vector3(2.5,1.25,0);
var v11 = new THREE.Vector3(2.5,1.25,2.5);


mySquareGeom.vertices.push(v0);
mySquareGeom.vertices.push(v1);
mySquareGeom.vertices.push(v2);
mySquareGeom.vertices.push(v3);
mySquareGeom.vertices.push(v4);
mySquareGeom.vertices.push(v5);
mySquareGeom.vertices.push(v6);
mySquareGeom.vertices.push(v7);
mySquareGeom.vertices.push(v8);
mySquareGeom.vertices.push(v9);
mySquareGeom.vertices.push(v10);
mySquareGeom.vertices.push(v11);

mySquareGeom.faces.push( new THREE.Face3( 0, 1, 2 ) );
mySquareGeom.faces.push( new THREE.Face3( 1, 3, 2 ) );

mySquareGeom.faces.push( new THREE.Face3( 2, 7, 3 ));
mySquareGeom.faces.push(new THREE.Face3( 7, 2, 5));

mySquareGeom.faces.push( new THREE.Face3( 0, 4, 6 ) );
mySquareGeom.faces.push( new THREE.Face3( 6, 1, 0 ) );

mySquareGeom.faces.push( new THREE.Face3( 4, 7, 5 ));
mySquareGeom.faces.push(new THREE.Face3( 6, 7, 4));

mySquareGeom.faces.push( new THREE.Face3( 8, 9, 10 ));
mySquareGeom.faces.push(new THREE.Face3( 11, 10, 9));

cs = new THREE.Mesh( mySquareGeom, mySquareMaterial );
cs.position.set(4, 0, 3);
cs.rotation.set(0,-Math.PI/2,0);
scene.add(cs);

/////////////////////////////////////
//  CUSTOM SQUARE: mySquare C-letter
////////////////////////////////////

mySquareGeom = new THREE.Geometry(); 
mySquareMaterial = new THREE.MeshBasicMaterial( {color: 0x808080} );

var v0 = new THREE.Vector3(0,0,0);
var v1 = new THREE.Vector3(2.5,0,0);
var v2 = new THREE.Vector3(0,2.5,0);
var v3 = new THREE.Vector3(2.5,2.5,0);
var v4 = new THREE.Vector3(0,0,2.5);
var v5 = new THREE.Vector3(0,2.5,2.5);
var v6 = new THREE.Vector3(2.5,0,2.5);
var v7 = new THREE.Vector3(2.5,2.5,2.5);



mySquareGeom.vertices.push(v0);
mySquareGeom.vertices.push(v1);
mySquareGeom.vertices.push(v2);
mySquareGeom.vertices.push(v3);

mySquareGeom.vertices.push(v4);
mySquareGeom.vertices.push(v5);
mySquareGeom.vertices.push(v6);
mySquareGeom.vertices.push(v7);

mySquareGeom.faces.push( new THREE.Face3( 0, 1, 2 ) );
mySquareGeom.faces.push( new THREE.Face3( 1, 3, 2 ) );

mySquareGeom.faces.push( new THREE.Face3( 2, 7, 3 ));
mySquareGeom.faces.push(new THREE.Face3( 7, 2, 5));

mySquareGeom.faces.push( new THREE.Face3( 0, 4, 6 ));
mySquareGeom.faces.push( new THREE.Face3( 6, 1, 0 ));

mySquareGeom.faces.push( new THREE.Face3( 0, 2, 6 ));

mySquareGeom.computeFaceNormals();

cs = new THREE.Mesh( mySquareGeom, mySquareMaterial );
cs.position.set(1, 0, 3);
cs.rotation.set(0,-Math.PI/2,0);
scene.add(cs);

/////////////////////////////////////////////////////////////////////////
// torus
/////////////////////////////////////////////////////////////////////////

// parameters:   radius of torus, diameter of tube, segments around radius, segments around torus
// torusGeometry = new THREE.TorusGeometry( 1.2, 0.4, 10, 20 );
// torusMaterial = new THREE.MeshLambertMaterial( {color: 0x40f0f0} );   
// torus = new THREE.Mesh( torusGeometry, torusMaterial);
// torus.position.set(6, 1.6, 0);   
// torus.rotation.set(0,0,0);     // rotation about x,y,z axes
// scene.add( torus );

// /////////////////////////////////////////////////////////////////////////
// // parallel torus
// /////////////////////////////////////////////////////////////////////////
// torusGeometry2 = new THREE.TorusGeometry( 1.2, 0.4, 10, 20 );
// torusMaterial2 = new THREE.MeshLambertMaterial( {color: 0x40f0f0} );   
// torus2 = new THREE.Mesh( torusGeometry, torusMaterial);
// torus2.position.set(6, 2.5, 0);   
// torus2.rotation.set(Math.PI/2,0,0);     // rotation about x,y,z axes
// scene.add( torus2 );



///////////////////////////////////
///// FLAG
/////////////////////////////////////	
canadaTexture = new THREE.TextureLoader().load('images/bc.jpg');
canadaTexture.wrapS = canadaTexture.wrapT = THREE.RepeatWrapping;
canadaTexture.repeat.set(1,1);
canadaMaterial = new THREE.MeshBasicMaterial({ map: canadaTexture, side: THREE.DoubleSide });
canadaGeometry = new THREE.PlaneBufferGeometry(3,2);  
canada = new THREE.Mesh(canadaGeometry, canadaMaterial);
canada.position.y = 5;
canada.position.x = -7;
scene.add(canada);

/////////////////////////////////////	
// FLOOR with texture
/////////////////////////////////////	

floorTexture = new THREE.TextureLoader().load('images/grass.jpg');
floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
floorTexture.repeat.set(1,1);
floorMaterial = new THREE.MeshBasicMaterial({ map: floorTexture, side: THREE.DoubleSide });
floorGeometry = new THREE.PlaneBufferGeometry(15,15);    // x,y size 
floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.position.y = -0.01;
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

///////////////////////////////////////////////////////////////////////
//   sphere, representing the light source
///////////////////////////////////////////////////////////////////////

lightObjGeometry = new THREE.SphereGeometry(0.3, 32, 32);    // radius, segments, segments
lightObjMaterial = new THREE.MeshBasicMaterial( {color: 0xffff00} );
lightObj = new THREE.Mesh(lightObjGeometry, lightObjMaterial);
lightObj.position.set(0,4,2);
lightObj.position.set(light.position.x, light.position.y, light.position.z);
scene.add(lightObj);


/////////////////////////////////////////////////////////////////////////////////////
//  create a teapot material that uses the vertex & fragment shaders, as defined in a1.html
/////////////////////////////////////////////////////////////////////////////////////

var teapotMaterial = new THREE.ShaderMaterial( {
	vertexShader: document.getElementById( 'teapotVertexShader' ).textContent,
	fragmentShader: document.getElementById( 'teapotFragmentShader' ).textContent
} );

var ctx = renderer.context;
ctx.getShaderInfoLog = function () { return '' };   // stops shader warnings, seen in some browsers

/////////////////////////////////////////////////////////////////////////////////////
//  Mountain Object loaded from OBJ file, rendered using teapotMaterial
/////////////////////////////////////////////////////////////////////////////////////

var manager = new THREE.LoadingManager();
        manager.onProgress = function ( item, loaded, total ) {
	console.log( item, loaded, total );
};

var onProgress = function ( xhr ) {
	if ( xhr.lengthComputable ) {
		var percentComplete = xhr.loaded / xhr.total * 100;
		console.log( Math.round(percentComplete, 2) + '% downloaded' );
	}
};
var onError = function ( xhr ) {
};
var loader = new THREE.OBJLoader( manager );
loader.load( 'obj/model.obj', function ( object ) {
	object.traverse( function ( child ) {
		if ( child instanceof THREE.Mesh ) {
		    child.material = teapotMaterial;
		}
	} );
  object.scale.multiplyScalar(10);
  object.position.set(-4,1.9,8);
  object.rotateY(-Math.PI/2);
	scene.add( object );
}, onProgress, onError );



//////////////////////////////////////////////////////////////////////
//   sphere, representing the light source
///////////////////////////////////////////////////////////////////////

lightObjGeometry = new THREE.SphereGeometry(0.3, 32, 32);    // radius, segments, segments
lightObjMaterial = new THREE.MeshBasicMaterial( {color: 0xffff00} );
lightObj = new THREE.Mesh(lightObjGeometry, lightObjMaterial);
lightObj.position.set(0,4,2);
lightObj.position.set(light.position.x, light.position.y, light.position.z);
scene.add(lightObj);


/////////////////////////////////////////////////////////////////////////////////////
//  create a totem material that uses the vertex & fragment shaders, as defined in a1.html
/////////////////////////////////////////////////////////////////////////////////////

var totemMaterial = new THREE.ShaderMaterial( {
	vertexShader: document.getElementById( 'totemVertexShader' ).textContent,
	fragmentShader: document.getElementById( 'totemFragmentShader' ).textContent
} );

var ctx = renderer.context;
ctx.getShaderInfoLog = function () { return '' };   // stops shader warnings, seen in some browsers

/////////////////////////////////////////////////////////////////////////////////////
//  totem pole Object loaded from OBJ file, rendered using teapotMaterial
/////////////////////////////////////////////////////////////////////////////////////

var manager = new THREE.LoadingManager();
        manager.onProgress = function ( item, loaded, total ) {
	console.log( item, loaded, total );
};

var onProgress = function ( xhr ) {
	if ( xhr.lengthComputable ) {
		var percentComplete = xhr.loaded / xhr.total * 100;
		console.log( Math.round(percentComplete, 2) + '% downloaded' );
	}
};
var onError = function ( xhr ) {
};
var loader = new THREE.OBJLoader( manager );
loader.load( 'obj/totem/source/totem geant/totem geant.obj', function ( object ) {
	object.traverse( function ( child ) {
		if ( child instanceof THREE.Mesh ) {
		    child.material = totemMaterial;
		}
	} );
  object.scale.multiplyScalar(0.15);
  object.position.set(-4,0,-3);
  object.rotateX(-Math.PI/2);
  object.rotateZ(Math.PI/2);
	scene.add( object );
}, onProgress, onError );

///////////////////////////////////////////////////////////////////////////////////////
// LISTEN TO KEYBOARD
///////////////////////////////////////////////////////////////////////////////////////

var keyboard = new THREEx.KeyboardState();
function checkKeyboard() {
  if (keyboard.pressed("W")) {
    console.log('W pressed');
    if(light.position.y <=4.9){
      light.position.y += 0.1;
    }
  } else if (keyboard.pressed("S"))
  if(light.position.y >= -4.9){
    light.position.y -= 0.1;
      }
  if (keyboard.pressed("A")){
    if(light.position.x >= -4.9){
    light.position.x -= 0.1;
    }
  }
  else if (keyboard.pressed("D")){
    if(light.position.x <=4.9){
    light.position.x += 0.1;
    }
  }
  lightObj.position.set(light.position.x, light.position.y, light.position.z);
}

///////////////////////////////////////////////////////////////////////////////////////
// UPDATE CALLBACK
///////////////////////////////////////////////////////////////////////////////////////

function update() {
  checkKeyboard();
  requestAnimationFrame(update);      // requests the next update call;  this creates a loop
  renderer.render(scene, camera);
}

update();

