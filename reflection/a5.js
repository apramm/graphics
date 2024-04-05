/////////////////////////////////////////////////////////////////////////////////////////
//  UBC CPSC 314,  Vsep2023
//  Assignment 5 Template;   compatible with three.js  r96
/////////////////////////////////////////////////////////////////////////////////////////

//  example logging to console
console.log('A5 Nov 2023');
myvector = new THREE.Vector3(3,4,5);
console.log('myvector =',myvector);



//////////////////////////////////////////////////
////////////////////////////////////////////////////////////
// Keyframe   and   Motion  classes  (Sept 2023)
////////////////////////////////////////////////////////////

class Keyframe {
 constructor(name,time,avars) {
 this.name = name;
 this.time = time;
 this.avars = avars;
 }
}

class Motion {
    constructor(setMatricesFunc) {
	this.keyFrameArray = [];          // list of keyframes
	this.maxTime = 0.0;               // time of last keyframe
	this.currTime = 0.0;              // current playback time
	this.updateMatrices = setMatricesFunc;    // function to call to update transformation matrices
    };
    reset() {                     // go back to first keyframe
	this.currTime = 0.0;
    };
    addKeyFrame(keyframe) {               // add a new keyframe at end of list
	this.keyFrameArray.push(keyframe);
	if (keyframe.time > this.maxTime)
	    this.maxTime = keyframe.time;
    };
    timestep(dt) {                //  take a time-step;  loop to beginning if at end
	this.currTime += dt;
	if (this.currTime > this.maxTime) 
	    this.currTime = 0;
	var avars = this.getAvars();
	this.updateMatrices(avars);
    }
    getAvars() {                  //  compute linearly interpolated values for the current time
	var i = 1;
	while (this.currTime > this.keyFrameArray[i].time)       // find the right pair of keyframes
	    i++;
	var avars = [];
	for (var n=0; n<this.keyFrameArray[i-1].avars.length; n++) {   // linear interpolation of the values
	    var y0 = this.keyFrameArray[i-1].avars[n];
	    var y1 = this.keyFrameArray[i].avars[n];
	    var x0 = this.keyFrameArray[i-1].time;
	    var x1 = this.keyFrameArray[i].time;
	    var x = this.currTime;
	    var y = y0 + (y1-y0)*(x-x0)/(x1-x0);    // linearly interpolate
	    avars.push(y);
	}
	return avars;         // return list of interpolated avars
    };
}

// export { Keyframe, Motion };
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var deg2rad = Math.PI/180;
var meshes = {};
var meshesLoaded = false;
var myboxMotion = new Motion(myboxSetMatrices);


// SETUP RENDERER & SCENE
var canvas = document.getElementById('canvas');
var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0xd0f0d0); // set background colour
canvas.appendChild(renderer.domElement);

// SETUP CAMERA
var camera = new THREE.PerspectiveCamera(30,1,0.1,10000); // view angle, aspect ratio, near, far
camera.position.set(0,12,20);
camera.lookAt(0,0,0);
scene.add(camera);

// SETUP ORBIT CONTROLS OF THE CAMERA
var controls = new THREE.OrbitControls(camera);
controls.damping = 0.2;
controls.autoRotate = false;

// ADAPT TO WINDOW RESIZE
function resize() {
  renderer.setSize(window.innerWidth,window.innerHeight);
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

light = new THREE.PointLight(0xffffff);
light.position.set(0,4,4);
var vcsLight = new THREE.Vector3(light.position);
scene.add(light);
ambientLight = new THREE.AmbientLight(0x606060);
scene.add(ambientLight);

var diffuseMaterial = new THREE.MeshLambertMaterial( {color: 0xffffff} );
var diffuseMaterial2 = new THREE.MeshLambertMaterial( {color: 0xffffff, side: THREE.DoubleSide } );
var basicMaterial = new THREE.MeshBasicMaterial( {color: 0xffffff} );

///////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////  SHADERS /////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

var textureLoader = new THREE.TextureLoader();

////////////////////// ENVMAP SHADER (and SkyBox textures)  /////////////////////////////

//posyTexture = textureLoader.load( "images/ABCD.jpg" );   // useful for debugging
posxTexture = textureLoader.load( "images/posx.jpg" ); 
posyTexture = textureLoader.load( "images/posy.jpg" ); 
poszTexture = textureLoader.load( "images/posz.jpg" ); 
negxTexture = textureLoader.load( "images/negx.jpg" ); 
negyTexture = textureLoader.load( "images/negy.jpg" ); 
negzTexture = textureLoader.load( "images/negz.jpg" ); 

// minFilter = THREE.NearestFilter;
minFilter = THREE.NearestMipmapNearestFilter;
// minFilter = THREE.NearestMipmapLinearFilter;
// minFilter = THREE.LinearFilter;
// minFilter = THREE.LinearMipmapLinearFilter;
// minFilter = THREE.LinearMipmapNearestFilter;
magFilter = THREE.LinearFilter;

posxTexture.magFilter = magFilter;
posxTexture.minFilter = minFilter;
posyTexture.magFilter = magFilter;
posyTexture.minFilter = minFilter;
poszTexture.magFilter = magFilter;
poszTexture.minFilter = minFilter;
negxTexture.magFilter = magFilter;
negxTexture.minFilter = minFilter;
negyTexture.magFilter = magFilter;
negyTexture.minFilter = minFilter;
negzTexture.magFilter = magFilter;
negzTexture.minFilter = minFilter;

var envmapMaterial = new THREE.ShaderMaterial( {     
        uniforms: { 
           vcsLightPosition: {value: new THREE.Vector3(0.0,0.0,-1.0) },
	   matrixWorld: {value: new THREE.Matrix4()},
           uNegxTexture: {type: 't', value: negxTexture},
           uNegyTexture: {type: 't', value: negyTexture},
           uNegzTexture: {type: 't', value: negzTexture},
           uPosxTexture: {type: 't', value: posxTexture},
           uPosyTexture: {type: 't', value: posyTexture},
           uPoszTexture: {type: 't', value: poszTexture},
           myColor: { value: new THREE.Vector4(0.8,0.8,0.6,1.0) }
        },
	vertexShader: document.getElementById( 'myVertShader' ).textContent,
	fragmentShader: document.getElementById( 'envmapFragShader' ).textContent
} );

////////////////////// WATER SHADER /////////////////////////////
var watermapMaterial = new THREE.ShaderMaterial( {     
  uniforms: { 
     vcsLightPosition: {value: new THREE.Vector3(0.0,0.0,-1.0) },
     utime: { value: 0.0 },
     matrixWorld: {value: new THREE.Matrix4()},
     uNegxTexture: {type: 't', value: negxTexture},
     uNegyTexture: {type: 't', value: negyTexture},
     uNegzTexture: {type: 't', value: negzTexture},
     uPosxTexture: {type: 't', value: posxTexture},
     uPosyTexture: {type: 't', value: posyTexture},
     uPoszTexture: {type: 't', value: poszTexture},
     myColor: { value: new THREE.Vector4(0.8,0.8,0.6,1.0) }
  },
vertexShader: document.getElementById( 'myWaterShader' ).textContent,
fragmentShader: document.getElementById( 'watermapFragShader' ).textContent
} );

////////////////////// HOLEY SHADER /////////////////////////////

var holeyMaterial = new THREE.ShaderMaterial( {
        uniforms: { 
           vcsLightPosition: {value: new THREE.Vector3(0.0,0.0,-1.0) },
           myColor: { value: new THREE.Vector4(0.5,1.0,1.0,1.0) }
        },
	vertexShader: document.getElementById( 'myVertShader' ).textContent,
	fragmentShader: document.getElementById( 'holeyFragShader' ).textContent
} );

////////////////////// TOON SHADER /////////////////////////////

var toonMaterial = new THREE.ShaderMaterial( {
        uniforms: { 
           vcsLightPosition: {value: new THREE.Vector3(0.0,0.0,-1.0) },
           toonColor: { value: new THREE.Vector3(0.5,0.5,0.8) }
        },
	vertexShader: document.getElementById( 'toonVertexShader' ).textContent,
	fragmentShader: document.getElementById( 'toonFragmentShader' ).textContent
} );

////////////////////// FLOOR SHADER /////////////////////////////

floorNormalTexture = textureLoader.load( "images/stone-map.png" ); 
floorTexture = textureLoader.load( "images/floor.jpg" );
floorTexture.magFilter = THREE.NearestFilter;
// TODO:  change to use a better minFilter
floorTexture.minFilter = THREE.NearestFilter;
floorNormalTexture.minFilter = THREE.NearestFilter;
floorNormalTexture.magFilter = THREE.NearestFilter;
var floorMaterial = new THREE.ShaderMaterial( {
        uniforms: { 
           vcsLightPosition: {value: new THREE.Vector3(0.0,0.0,-1.0) },
           myColor: { value: new THREE.Vector4(0.0,1.0,0.0,1.0) },
           normalMap: { type: 't', value: floorNormalTexture},
           textureMap: { type: 't', value: floorTexture}
        },
        side: THREE.DoubleSide,
	vertexShader: document.getElementById( 'floorVertShader' ).textContent,
	fragmentShader: document.getElementById( 'floorFragShader' ).textContent
} );
floorMaterial.uniforms.vcsLightPosition.value.needsUpdate = true;

///////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////  OBJECTS /////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

   


function initMotions() {
      // keyframes for the fish animated motion:   name, time, [x, y, z, theta]
    myboxMotion.addKeyFrame(new Keyframe('pose A',0.0, [1.0,   -1.5,   -0.5,   -10]));
    myboxMotion.addKeyFrame(new Keyframe('pose B',0.5,[1.0,   0.25,   -0.2, -25]));
    myboxMotion.addKeyFrame(new Keyframe('pose B',1.0, [0.0,   0.4,   1.0,   -65]));
    myboxMotion.addKeyFrame(new Keyframe('pose B',2.5, [-1.5,   1.0,   2,   -90]));
    myboxMotion.addKeyFrame(new Keyframe('pose C',3.5, [-3,     0.5,   0,   -150]));
    myboxMotion.addKeyFrame(new Keyframe('pose D',4.5, [-1.5,   -1.1,   -2,   -245]));
    myboxMotion.addKeyFrame(new Keyframe('pose D',5.5, [0,   -1.2,   -3,   -255]));
    myboxMotion.addKeyFrame(new Keyframe('pose D',6.75, [0.5,   -1.3,   -3,   -240]));
    myboxMotion.addKeyFrame(new Keyframe('pose A',7.0, [1.0,    -1.5,   -3,   -320]));
}

///////////////////////////////////////////////////////////////////////////////////////
// myboxSetMatrices(avars)
///////////////////////////////////////////////////////////////////////////////////////

function myboxSetMatrices(avars) {

    // update position of a fish
    var theta = avars[3]*deg2rad;
    meshes["finalfish"].matrixAutoUpdate = false;
    meshes["finalfish"].matrix.identity();
    meshes["finalfish"].matrix.multiply(new THREE.Matrix4().makeTranslation(avars[0],avars[1],avars[2]));  
    meshes["finalfish"].matrix.multiply(new THREE.Matrix4().makeRotationY(theta));  
    meshes["finalfish"].matrix.multiply(new THREE.Matrix4().makeScale(0.3,0.3,0.3));
    meshes["finalfish"].updateMatrixWorld();
}

function initObjects() {



/////////////////////////////////////	
// WORLD COORDINATE FRAME
/////////////////////////////////////	

var worldFrame = new THREE.AxesHelper(5) ;
scene.add(worldFrame);

/////////////////////////////////////	
// Skybox 
/////////////////////////////////////	

// TO DO: 
//  - add the other skybox faces:  negx, negy, posy, negz, posz
//  - after debugging, change size to 1000

var size = 1000;
wallGeometry = new THREE.PlaneBufferGeometry(2*size, 2*size);

  // posxWall:  positive x-axis wall
posxMaterial = new THREE.MeshBasicMaterial( {map: posxTexture, side:THREE.DoubleSide });
posxWall = new THREE.Mesh(wallGeometry, posxMaterial);
posxWall.position.x = -size;
posxWall.rotation.y = -Math.PI / 2;
scene.add(posxWall);

  // negyWall:  negative y-axis wall
negyMaterial = new THREE.MeshBasicMaterial( {map: negyTexture, side:THREE.DoubleSide });
negyWall = new THREE.Mesh(wallGeometry, negyMaterial);
negyWall.position.y = -size;
negyWall.rotation.x = Math.PI / 2;
scene.add(negyWall);

  // negzWall:  negative z-axis wall
negzMaterial = new THREE.MeshBasicMaterial( {map: negzTexture, side:THREE.DoubleSide });
negzWall = new THREE.Mesh(wallGeometry, negzMaterial);
negzWall.position.z = -size;
negzWall.rotation.y = -Math.PI;
scene.add(negzWall);

  // negxWall:  negative x-axis wall
negxMaterial = new THREE.MeshBasicMaterial( {map: negxTexture, side:THREE.DoubleSide });
negxWall = new THREE.Mesh(wallGeometry, negxMaterial);
negxWall.position.x = size;
negxWall.rotation.y = Math.PI / 2;
scene.add(negxWall);

  // posyWall:  positive y-axis wall
posyMaterial = new THREE.MeshBasicMaterial( {map: posyTexture, side:THREE.DoubleSide });
posyWall = new THREE.Mesh(wallGeometry, posyMaterial);
posyWall.position.y = size;
posyWall.rotation.x = -Math.PI / 2;
scene.add(posyWall);

  // poszWall:  positive z-axis wall
poszMaterial = new THREE.MeshBasicMaterial( {map: poszTexture, side:THREE.DoubleSide });
poszWall = new THREE.Mesh(wallGeometry, poszMaterial);
poszWall.position.z = size;
scene.add(poszWall);


/////////////////////////////////////	
// FLOOR:  texture-map  &  normal-map
/////////////////////////////////////	

floorGeometry = new THREE.PlaneBufferGeometry(15, 15);
floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.position.y = -1.1;
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

///////////////////////////////////////////////////////////////////////
//   sphere, representing the light 
///////////////////////////////////////////////////////////////////////

sphereGeometry = new THREE.SphereGeometry(0.3, 32, 32);    // radius, segments, segments
lightSphere = new THREE.Mesh(sphereGeometry, basicMaterial);
lightSphere.position.set(0,4,-5);
lightSphere.position.set(light.position.x, light.position.y, light.position.z);
scene.add(lightSphere);

/////////////////////////////////////////////////////////////////////////
// holey-shaded torus
/////////////////////////////////////////////////////////////////////////

// parameters:   radius of torus, diameter of tube, segments around radius, segments around torus
torusGeometry = new THREE.TorusGeometry( 1.2, 0.4, 10, 20 );
torus = new THREE.Mesh( torusGeometry, holeyMaterial);
torus.position.set(-3, 0.4, 0.3);   // translation
torus.rotation.set(0,0,0);     // rotation about x,y,z axes
scene.add( torus );

/////////////////////////////////////////////////////////////////////////
// toon-shaded torus
/////////////////////////////////////////////////////////////////////////

// parameters:   radius of torus, diameter of tube, segments around radius, segments around torus
torusGeometry = new THREE.TorusGeometry( 1.2, 0.4, 10, 20 );
torus = new THREE.Mesh( torusGeometry, toonMaterial);
torus.position.set(1.0, 0.4, 0.3);   // translation
torus.rotation.set(0,0,0);     // rotation about x,y,z axes
scene.add( torus );

/////////////////////////////////////	
// MIRROR:  square patch on the ground
/////////////////////////////////////	

mirrorGeometry = new THREE.PlaneBufferGeometry(4,4);
mirror = new THREE.Mesh(mirrorGeometry, envmapMaterial);
mirror.position.x = -2.0;
mirror.position.z = 4.0;
mirror.position.y = -1.0;
mirror.rotation.x = -Math.PI / 2;
scene.add(mirror);


/////////////////////////////////////	
// WATER PATCH : rectangle patch on the ground
/////////////////////////////////////	

waterGeometry = new THREE.PlaneBufferGeometry(12,4);
water = new THREE.Mesh(waterGeometry, watermapMaterial);
water.position.x = -1.5;
water.position.z = -2.0;
water.position.y = -1.0;
water.rotation.x = -Math.PI / 2;
scene.add(water);

/////////////////////////////////////	
// MARBLE:  square patch on the ground
/////////////////////////////////////	

var marbleMaterial = new THREE.ShaderMaterial( {
	vertexShader: document.getElementById( 'myVertShader' ).textContent,
	fragmentShader: document.getElementById( 'pnoiseFragShader' ).textContent,
        side: THREE.DoubleSide
} );

marbleGeometry = new THREE.PlaneBufferGeometry(4,4);
marble = new THREE.Mesh(marbleGeometry, marbleMaterial);
marble.position.x = 2.0;
marble.position.z = 4.0;
marble.position.y = -1.0;
marble.rotation.x = -Math.PI / 2;
scene.add(marble);

/////////////////////////////////////////////////////////////////////////
// sphere
/////////////////////////////////////////////////////////////////////////

sphereA = new THREE.Mesh( new THREE.SphereGeometry( 3, 20, 10 ), envmapMaterial );
sphereA.position.set(6,0,-1);
scene.add( sphereA );

}

///////////////////////////////////////////////////////////////////////////////////

var customShaderMaterial = new THREE.ShaderMaterial( {
      uniforms: {
        utime: { value: 0.0 }
    },
	vertexShader: document.getElementById( 'fishVertexShader' ).textContent,
	fragmentShader: document.getElementById( 'fishFragmentShader' ).textContent
} );

var models;

function initFileObjects() {
        // list of OBJ files that we want to load, and their material
    models = {     	
	    finalfish:    {obj:"obj/finalfish.obj", mtl: customShaderMaterial, mesh: null }
    };

    var manager = new THREE.LoadingManager();
    manager.onLoad = function () {
	console.log("loaded all resources");
	RESOURCES_LOADED = true;
	onResourcesLoaded();
    }
    var onProgress = function ( xhr ) {
	if ( xhr.lengthComputable ) {
	    var percentComplete = xhr.loaded / xhr.total * 100;
	    console.log( Math.round(percentComplete, 2) + '% downloaded' );
	}
    };
    var onError = function ( xhr ) {
    };

    // Load models;  asynchronous in JS, so wrap code in a fn and pass it the index
    for( var _key in models ){
	console.log('Key:', _key);
	(function(key){
	    var objLoader = new THREE.OBJLoader( manager );
	    objLoader.load( models[key].obj, function ( object ) {
		object.traverse( function ( child ) {
		    if ( child instanceof THREE.Mesh ) {
			child.material = models[key].mtl;
			child.material.shading = THREE.SmoothShading;
		    }	} );
		models[key].mesh = object;
	    }, onProgress, onError );
	})(_key);
    }
}

/////////////////////////////////////////////////////////////////////////////////////
// onResourcesLoaded():  once all OBJ files are loaded, this gets called.
//                       Object instancing is done here
/////////////////////////////////////////////////////////////////////////////////////

function onResourcesLoaded(){
	
 // Clone models into meshes
    meshes["finalfish"] = models.finalfish.mesh.clone();
  
    meshes["finalfish"].position.set(1, 0, 0);
    meshes["finalfish"].rotation.set(0,0,0);
    meshes["finalfish"].scale.set(0.25,0.25,0.25);
    scene.add(meshes["finalfish"]);

    meshesLoaded = true;
}


///////////////////////////////////////////////////////////////////////////////////////
// LISTEN TO KEYBOARD
///////////////////////////////////////////////////////////////////////////////////////

var keyboard = new THREEx.KeyboardState();
function checkKeyboard() {
  if (keyboard.pressed("W")) {
    console.log('W pressed');
    light.position.y += 0.1;
  } else if (keyboard.pressed("S"))
    light.position.y -= 0.1;
  if (keyboard.pressed("A"))
    light.position.x -= 0.1;
  else if (keyboard.pressed("D"))
    light.position.x += 0.1;
  lightSphere.position.set(light.position.x, light.position.y, light.position.z);

    // compute light position in VCS coords,  supply this to the shaders
  vcsLight.set(light.position.x, light.position.y, light.position.z);
  vcsLight.applyMatrix4(camera.matrixWorldInverse);

  floorMaterial.uniforms.vcsLightPosition.value = vcsLight;
  floorMaterial.uniforms.vcsLightPosition.value.needsUpdate = true;
  toonMaterial.uniforms.vcsLightPosition.value = vcsLight;
  toonMaterial.uniforms.vcsLightPosition.value.needsUpdate = true;
  holeyMaterial.uniforms.vcsLightPosition.value = vcsLight;
  holeyMaterial.uniforms.vcsLightPosition.value.needsUpdate = true;
  envmapMaterial.uniforms.vcsLightPosition.value = vcsLight;
  envmapMaterial.uniforms.vcsLightPosition.value.needsUpdate = true;
}

///////////////////////////////////////////////////////////////////////////////////////
// UPDATE CALLBACK
///////////////////////////////////////////////////////////////////////////////////////

function update() {

  var dt=0.02;
  

  if (meshesLoaded) {
	//sphere.position.set(light.position.x, light.position.y, light.position.z);
  myboxMotion.timestep(dt);
	renderer.render(scene, camera);
    }


  checkKeyboard();
  requestAnimationFrame(update);
  envmapMaterial.uniforms.matrixWorld.value = camera.matrixWorld;
  envmapMaterial.uniforms.matrixWorld.update = true;
  customShaderMaterial.uniforms.utime.value += 0.01;
  watermapMaterial.uniforms.utime.value += 0.0000001;
  renderer.render(scene, camera);
  
}


initMotions();
initObjects();
initFileObjects();

window.addEventListener('resize',resize);
resize();
update();

