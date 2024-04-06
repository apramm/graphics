/////////////////////////////////////////////////////////////////////////////////////////
//  UBC CPSC 314 -- Sept 2023  -- Underwater Scene
/////////////////////////////////////////////////////////////////////////////////////////

console.log('Underwater Scence');
var animation = true;
var animation2 = true;
var animation3 = true;
var move = 0;
var meshesLoaded = false;
var RESOURCES_LOADED = false;
var deg2rad = Math.PI/180;


// give the following global scope (within in this file), which is useful for motions and objects
// that are related to animation

  // setup animation data structure, including a call-back function to use to update the model matrix
var myboxMotion = new Motion(myboxSetMatrices); 
var handMotion = new Motion(handSetMatrices);
var faceMotion = new Motion(faceSetMatrices);
var legStatic = new Motion(legSetMatrices);
var legMotion = new Motion(legSetMatrices);

var faceMove = new Motion(faceSetMatrices);
var legMove = new Motion(legSetMatrices);

var faceMoveUp = new Motion(faceSetMatrices);
var legMoveUp = new Motion(legSetMatrices);

var link1, link2, link3, link4, link5;
var linkFrame1, linkFrame2, linkFrame3, linkFrame4, linkFrame5;
var facelink1, facelink2, facelink3, facelink4, facelink5, facelink5b;
var facelinkFrame1, facelinkFrame2, facelinkFrame3, facelinkFrame4, facelinkFrame5;
var leglink1, leglink2, leglink3, leglink4, leglink5, leglink6, leglink7, leglink8, leglink9, leglink10, leglink11, leglink12, leglink13, leglink14, leglink15, leglink16;
var leglinkFrame1, leglinkFrame2, leglinkFrame3, leglinkFrame4, leglinkFrame5, leglinkFrame6, leglinkFrame7, leglinkFrame8, leglinkFrame9, leglinkFrame10, leglinkFrame11, leglinkFrame12, leglinkFrame13, leglinkFrame14, leglinkFrame15, leglinkFrame16;
var sphere;    
var mybox;     
var meshes = {};  


// SETUP RENDERER & SCENE

var canvas = document.getElementById('canvas');
var camera;
var light;
var ambientLight;
var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer({ antialias: false });
renderer.setClearColor(0x000000, 0);   // set background colour
canvas.appendChild(renderer.domElement);
const loader = new THREE.TextureLoader();
loader.load('images/seaback.jpg' , function(texture)
            {
             scene.background = texture;  
            }); 

//////////////////////////////////////////////////////////
//  initCamera():   SETUP CAMERA
//////////////////////////////////////////////////////////

function initCamera() {
    // set up M_proj    (internally:  camera.projectionMatrix )
    var cameraFov = 30;     // initial camera vertical field of view, in degrees
      // view angle, aspect ratio, near, far
    camera = new THREE.PerspectiveCamera(cameraFov,1,0.1,1000); 

    var width = 10;  var height = 5;

//    An example of setting up an orthographic projection using threejs:
//    camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 0.1, 1000 );

    // set up M_view:   (internally:  camera.matrixWorldInverse )
    camera.position.set(0,12,20);
    camera.up = new THREE.Vector3(0,1,0);
    camera.lookAt(0,0,0);
    scene.add(camera);

      // SETUP ORBIT CONTROLS OF THE CAMERA (user control of rotation, pan, zoom)
//    const controls = new OrbitControls( camera, renderer.domElement );
    var controls = new THREE.OrbitControls(camera);
    controls.damping = 0.2;
    controls.autoRotate = false;
};

// ADAPT TO WINDOW RESIZE
function resize() {
  renderer.setSize(window.innerWidth,window.innerHeight);
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
}

//SCROLLBAR FUNCTION DISABLE
window.onscroll = function () {
     window.scrollTo(0,0);
}

////////////////////////////////////////////////////////////////////////	
// init():  setup up scene
////////////////////////////////////////////////////////////////////////	

function init() {
    console.log('init called');

    initCamera();
    initMotions();
    initLights();
    initObjects();
    initHand();
    initFace();
    initLeg();
    initFileObjects();

    window.addEventListener('resize',resize);
    resize();
};

////////////////////////////////////////////////////////////////////////
// initMotions():  setup Motion instances for each object that we wish to animate
////////////////////////////////////////////////////////////////////////

function initMotions() {

      // keyframes for the mybox animated motion:   name, time, [x, y, z, theta]
    myboxMotion.addKeyFrame(new Keyframe('pose A',0.0, [0, 5, 0, 0]));
    myboxMotion.addKeyFrame(new Keyframe('pose B',1.0, [-3, 5, 0, -90]));
    myboxMotion.addKeyFrame(new Keyframe('pose C',2.0, [-3, 10, 0, 0]));
    myboxMotion.addKeyFrame(new Keyframe('pose D',3.0, [0, 10, 0, 0]));
    myboxMotion.addKeyFrame(new Keyframe('pose A',4.0, [0, 5, 0, 0]));

      // basic interpolation test, just printing interpolation result to the console
    myboxMotion.currTime = 0.1;
    console.log('kf',myboxMotion.currTime,'=',myboxMotion.getAvars());    // interpolate for t=0.1
    myboxMotion.currTime = 2.9;
    console.log('kf',myboxMotion.currTime,'=',myboxMotion.getAvars());    // interpolate for t=2.9

      // keyframes for hand:    name, time, [x, y, theta1, theta2, theta3, theta4, theta5]
    handMotion.addKeyFrame(new Keyframe('straight',         0.0, [0, 3,    0, 0, 0, 0, 0])); // Start Location for the animation of all boxes
    handMotion.addKeyFrame(new Keyframe('right finger curl',1.0, [0, 3,    +90, +169, -169, 0,0])); // at time 1.0 animation
    handMotion.addKeyFrame(new Keyframe('straight',         2.0, [0, 3,    0, 0, 0, 0, 0]));
    handMotion.addKeyFrame(new Keyframe('left finger curl', 3.0, [0, 3,    -90, 0, 0, -90,-90]));
    handMotion.addKeyFrame(new Keyframe('straight',         4.0, [0, 3,    0, 0, 0, 0, 0]));
    handMotion.addKeyFrame(new Keyframe('both fingers curl',4.5, [0, 3,    -90, -90, -90, -90,-90]));
    handMotion.addKeyFrame(new Keyframe('straight',         6.0, [0, 3,    0, 0, 0, 0, 0]));

    // keyframes for face:    name, time, [x, y, theta1, theta2, theta3, theta4, theta5]
    faceMotion.addKeyFrame(new Keyframe('straight',         0.0, [10, 4,    0, 0,0,0,0 ])); // Start Location for the animation of all boxes
    faceMotion.addKeyFrame(new Keyframe('straight',         1.0, [10, 4,    0, 0,0,0,0 ]));


    // keyframes for leg:    name, time, [x, y, theta1, theta2, theta3, theta4, theta5, theta6.... theta 16]

    legStatic.addKeyFrame(new Keyframe('straight',         0.0, [10, 2,    0, 0 , 0 , 0, 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0])); // Start Location for the animation of all boxes
    legStatic.addKeyFrame(new Keyframe('straight',         1.0, [10, 2,    +90, -90 , +90 , -90, +90 , -90 , +90 , -90 , +90 , -90 , +90 , -90 , +90, -90, +90 , -90])); // Start Location for the animation of all boxes


    legMotion.addKeyFrame(new Keyframe('straight',         0.0, [10, 2,    0, 0 , 0 , 0, 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0])); // Start Location for the animation of all boxes
    legMotion.addKeyFrame(new Keyframe('position2 up',     1.0, [10, 2,    0, +90 , 0 , +90, 0 , +90 , 0 , +90 , 0 , +90 , 0 , +90 , 0 , +90 , 0, +90]));
    legMotion.addKeyFrame(new Keyframe('straight',         2.0, [10, 2,    0, 0 , 0 , 0, 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0, 0]));
    legMotion.addKeyFrame(new Keyframe('position1 up',     3.0, [10, 2,    -90, 0 , -90 , 0, -90 , 0 , -90 , 0 , -90 , 0 , -90 , 0 , -90 , 0 , -90, 0]));
    legMotion.addKeyFrame(new Keyframe('straight',         4.0, [10, 2,    0, 0 , 0 , 0, 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0, 0]));

    // keyframes for back motion

    faceMove.addKeyFrame(new Keyframe('straight',         0.0, [10, 4,    0, 0,0,0,0 ])); 
    faceMove.addKeyFrame(new Keyframe('back1',         1.0, [9, 4,    0, 0,0,0,0 ]));
    faceMove.addKeyFrame(new Keyframe('back2',         2.0, [8, 4,    +45, 0,0,0,0 ]));
    faceMove.addKeyFrame(new Keyframe('back3',         3.0, [7, 4,    +90, 0,0,0,0 ]));
    faceMove.addKeyFrame(new Keyframe('back4',         4.0, [6, 4,    0, 0,0,0,+90 ]));
    faceMove.addKeyFrame(new Keyframe('back3',         5.0, [7, 4,    0, 0,0,+90,0 ]));
    faceMove.addKeyFrame(new Keyframe('back2',         6.0, [8, 4,    +45, 0,0,0,0 ]));
    faceMove.addKeyFrame(new Keyframe('back1',         7.0, [9, 4,    +90, 0,0,0,0 ]));
    faceMove.addKeyFrame(new Keyframe('straight',       8.0, [10, 4,    0, 0,0,0,0 ])); 


    legMove.addKeyFrame(new Keyframe('straight',         0.0, [10, 2,    0, 0 , 0 , 0, 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0])); // Start Location for the animation of all boxes
    legMove.addKeyFrame(new Keyframe('straight',         1.0, [9, 2,    0, 0 , 0 , 0, 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0])); // Start Location for the animation of all boxes
    legMove.addKeyFrame(new Keyframe('straight',         2.0, [8, 2,    0, 0 , 0 , 0, 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0])); // Start Location for the animation of all boxes
    legMove.addKeyFrame(new Keyframe('straight',         3.0, [7, 2,    0, 0 , 0 , 0, 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0])); // Start Location for the animation of all boxes
    legMove.addKeyFrame(new Keyframe('straight',         4.0, [6, 2,    0, 0 , 0 , 0, 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0])); // Start Location for the animation of all boxes
    legMove.addKeyFrame(new Keyframe('straight',         5.0, [7, 2,    0, 0 , 0 , 0, 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0])); // Start Location for the animation of all boxes
    legMove.addKeyFrame(new Keyframe('straight',         6.0, [8, 2,    0, 0 , 0 , 0, 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0])); // Start Location for the animation of all boxes
    legMove.addKeyFrame(new Keyframe('straight',         7.0, [9, 2,    0, 0 , 0 , 0, 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0])); // Start Location for the animation of all boxes
    legMove.addKeyFrame(new Keyframe('straight',         8.0, [10, 2,    0, 0 , 0 , 0, 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0])); // Start Location for the animation of all boxes   

      // keyframes for left motion

      faceMoveUp.addKeyFrame(new Keyframe('straight',         0.0, [10, 4,    0, 0,0,0,0 ])); 
      faceMoveUp.addKeyFrame(new Keyframe('up1',         1.0, [10, 6,    0, 0,0,0,0 ]));
      faceMoveUp.addKeyFrame(new Keyframe('up2',         2.0, [10,8,    +45, 0,0,0,0 ]));
      faceMoveUp.addKeyFrame(new Keyframe('up3',         3.0, [10, 10,    +90, 0,0,0,0 ]));
      faceMoveUp.addKeyFrame(new Keyframe('up4',         4.0, [10, 12,    0, 0,0,0,0 ]));
      faceMoveUp.addKeyFrame(new Keyframe('up3',         5.0, [10, 10,    0, 0,0,0,0 ]));
      faceMoveUp.addKeyFrame(new Keyframe('up2',         6.0, [10, 8,    +45, 0,0,0,0 ]));
      faceMoveUp.addKeyFrame(new Keyframe('up1',         7.0, [10, 6,    +90, 0,0,0,0 ]));
      faceMoveUp.addKeyFrame(new Keyframe('straight',       8.0, [10, 4,    0, 0,0,0,0 ])); 
  
  
      legMoveUp.addKeyFrame(new Keyframe('straight',         0.0, [10, 2,    0, 0 , 0 , 0, 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0])); // Start Location for the animation of all boxes
      legMoveUp.addKeyFrame(new Keyframe('straight',         1.0, [10, 4,    0, +90 , 0 , +90, 0 , +90 , 0 , +90, 0 , +90, 0 , +90 , 0 , +90, 0 , +90])); // Start Location for the animation of all boxes
      legMoveUp.addKeyFrame(new Keyframe('straight',         2.0, [10, 6,    -90, 0 , -90 , 0, -90 , 0 , -90 , 0 , -90 , 0 , -90 , 0 , -90 , 0 , -90 , 0])); // Start Location for the animation of all boxes
      legMoveUp.addKeyFrame(new Keyframe('straight',         3.0, [10, 8,    0, +90 , 0 , +90, 0 , +90 , 0 , +90 , 0 , +90 , 0 , +90 , 0 , +90 , 0 , +90])); // Start Location for the animation of all boxes
      legMoveUp.addKeyFrame(new Keyframe('straight',         4.0, [10, 10,    -90, 0 , -90 , 0, -90 , 0 , -90 , 0 , -90 , 0 , -90, 0 , -90 , 0 , -90, 0])); // Start Location for the animation of all boxes
      legMoveUp.addKeyFrame(new Keyframe('straight',         5.0, [10, 8,    0, +90 , 0 , +90, 0 , +90 , 0 , +90 , 0 , +90 , 0 , +90 , 0 , +90 , 0 , +90])); // Start Location for the animation of all boxes
      legMoveUp.addKeyFrame(new Keyframe('straight',         6.0, [10, 6,    -90, 0 , -90 , 0, -90 , 0 , -90 , 0 , -90 , 0 , -90 , 0 , -90 , 0 , -90 , 0])); // Start Location for the animation of all boxes
      legMoveUp.addKeyFrame(new Keyframe('straight',         7.0, [10, 4,    0, +90 , 0 , +90, 0 , +90 , 0 , +90 , 0 , +90 , 0 , +90 , 0 , +90 , 0 , +90])); // Start Location for the animation of all boxes
      legMoveUp.addKeyFrame(new Keyframe('straight',         8.0, [10, 2,    0, 0 , 0 , 0, 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0])); // Start Location for the animation of all boxes   

  }

///////////////////////////////////////////////////////////////////////////////////////
// myboxSetMatrices(avars)
///////////////////////////////////////////////////////////////////////////////////////

function myboxSetMatrices(avars) {
    // note:  in the code below, we use the same keyframe information to animate both
    //        the box and the dragon, i.e., avars[], although only the dragon uses avars[3], as a rotation

     // update position of a box
    mybox.matrixAutoUpdate = false;     // tell three.js not to over-write our updates
    mybox.matrix.identity();              
    mybox.matrix.multiply(new THREE.Matrix4().makeTranslation(avars[0], avars[1], avars[2]));  
    mybox.matrix.multiply(new THREE.Matrix4().makeRotationY(-Math.PI/2));
    mybox.matrix.multiply(new THREE.Matrix4().makeScale(1.0,1.0,1.0));
    mybox.updateMatrixWorld();  

     // update position of a dragon
    var theta = avars[3]*deg2rad;
    meshes["dragon1"].matrixAutoUpdate = false;
    meshes["dragon1"].matrix.identity();
    meshes["dragon1"].matrix.multiply(new THREE.Matrix4().makeTranslation(avars[0],avars[1],0));  
    meshes["dragon1"].matrix.multiply(new THREE.Matrix4().makeRotationX(theta));  
    meshes["dragon1"].matrix.multiply(new THREE.Matrix4().makeScale(0.3,0.3,0.3));
    meshes["dragon1"].updateMatrixWorld();  
}

///////////////////////////////////////////////////////////////////////////////////////
// faceSetMatrices(avars)
///////////////////////////////////////////////////////////////////////////////////////

function faceSetMatrices(avars) {
  var xPosition = avars[0];
  var yPosition = avars[1];
  var theta1 = avars[2]*deg2rad;
  var theta2 = avars[3]*deg2rad;
  var theta3 = avars[4]*deg2rad;
  var theta4 = avars[5]*deg2rad;
  var theta5 = avars[6]*deg2rad;
  var M =  new THREE.Matrix4();
  
    ////////////// link1 - FACE
  facelinkFrame1.matrix.identity(); 
  facelinkFrame1.matrix.multiply(M.makeTranslation(xPosition+10,yPosition,10)); 
  facelinkFrame1.matrix.multiply(M.makeRotationZ(theta1));    
    // Frame 1 has been established, now setup the extra transformations for the scaled box geometry
  facelink1.matrix.copy(facelinkFrame1.matrix);
  // facelink1.matrix.multiply(M.makeTranslation(10,4,10));   
  facelink1.matrix.multiply(M.makeScale(1,1,1));    

    ////////////// link2 - LEFT EYE
  facelinkFrame2.matrix.copy(facelinkFrame1.matrix);      // start with parent frame
  facelinkFrame2.matrix.multiply(M.makeTranslation(2,2,2));
  facelinkFrame2.matrix.multiply(M.makeScale(1,1,1));    
  facelinkFrame2.matrix.multiply(M.makeRotationZ(theta2));    
    // Frame 2 has been established, now setup the extra transformations for the scaled box geometry
  facelink2.matrix.copy(facelinkFrame2.matrix); 
  // facelink2.matrix.multiply(M.makeTranslation(2,2,2)); 
  facelink2.matrix.multiply(M.makeScale(1,1,1));   
  
      ////////////// link3 - RIGHT EYE
  facelinkFrame3.matrix.copy(facelinkFrame1.matrix);      // start with parent frame
  facelinkFrame3.matrix.multiply(M.makeTranslation(2,2,-2)); 
  facelinkFrame3.matrix.multiply(M.makeScale(1,1,1)); 
  facelinkFrame3.matrix.multiply(M.makeRotationZ(theta3));    
        // Frame 2 has been established, now setup the extra transformations for the scaled box geometry
  facelink3.matrix.copy(facelinkFrame3.matrix);
  facelink3.matrix.multiply(M.makeScale(1,1,1));  

    
      ////////////// link4 - SMILE
  facelinkFrame4.matrix.copy(facelinkFrame1.matrix);      // start with parent frame
  facelinkFrame4.matrix.multiply(M.makeTranslation(3.2,-2,0));
  facelinkFrame4.matrix.multiply(M.makeRotationZ(theta4));    
            // Frame 2 has been established, now setup the extra transformations for the scaled box geometry
  facelink4.matrix.copy(facelinkFrame4.matrix); 
  facelink4.matrix.multiply(M.makeScale(2,1,1));  

        ////////////// link5 - HAT
  facelinkFrame5.matrix.copy(facelinkFrame1.matrix);      // start with parent frame
  facelinkFrame5.matrix.multiply(M.makeTranslation(0,4,0));
  facelinkFrame5.matrix.multiply(M.makeRotationZ(theta5));    
    // Frame 2 has been established, now setup the extra transformations for the scaled box geometry
  facelink5.matrix.copy(facelinkFrame5.matrix); 
  facelink5.matrix.multiply(M.makeTranslation(-0.5,-1.2,0));
  facelink5.matrix.multiply(M.makeScale(1.5,1,1.5)); 
  facelink5b.matrix.copy(facelinkFrame5.matrix);
  facelink5b.matrix.multiply(M.makeScale(1,1,1)); 

  facelink1.updateMatrixWorld();
  facelink2.updateMatrixWorld();
  facelink3.updateMatrixWorld();
  facelink4.updateMatrixWorld();
  facelink5.updateMatrixWorld();
  facelink5b.updateMatrixWorld();

  facelinkFrame1.updateMatrixWorld();
  facelinkFrame2.updateMatrixWorld();
  facelinkFrame3.updateMatrixWorld();
  facelinkFrame4.updateMatrixWorld();
  facelinkFrame5.updateMatrixWorld();
}


///////////////////////////////////////////////////////////////////////////////////////
// legsSetMatrices(avars)
///////////////////////////////////////////////////////////////////////////////////////

function legSetMatrices(avars) {
  var xPosition = avars[0];
  var yPosition = avars[1];
  var theta1 = avars[2]*deg2rad;
  var theta2 = avars[3]*deg2rad;
  var theta3 = avars[4]*deg2rad;
  var theta4 = avars[5]*deg2rad;
  var theta5 = avars[6]*deg2rad;
  var theta6 = avars[7]*deg2rad;
  var theta7 = avars[8]*deg2rad;
  var theta8 = avars[9]*deg2rad;
  var theta9 = avars[10]*deg2rad;
  var theta10 = avars[11]*deg2rad;
  var theta11 = avars[12]*deg2rad;
  var theta12 = avars[13]*deg2rad;
  var theta13 = avars[14]*deg2rad;
  var theta14 = avars[15]*deg2rad;
  var theta15 = avars[16]*deg2rad;
  var theta16 = avars[17]*deg2rad;
  var M =  new THREE.Matrix4();
  
    ////////////// link1 - LEG 1 pt 1
  leglinkFrame1.matrix.identity(); 
  leglinkFrame1.matrix.multiply(M.makeTranslation(xPosition+10,yPosition,10));   
  leglinkFrame1.matrix.multiply(M.makeRotationZ(theta1));    
    // Frame 1 has been established, now setup the extra transformations for the scaled box geometry
  leglink1.matrix.copy(leglinkFrame1.matrix);
  leglink1.matrix.multiply(M.makeTranslation(2,0,3));  
  leglink1.matrix.multiply(M.makeRotationZ(-Math.PI/2));
  leglink1.matrix.multiply(M.makeRotationX(Math.PI/4));     
  leglink1.matrix.multiply(M.makeScale(1,1/2,1));    

    ////////////// link2 - LEG 1 pt 2
  leglinkFrame2.matrix.copy(leglinkFrame1.matrix);      // start with parent frame
  leglinkFrame2.matrix.multiply(M.makeTranslation(4,0,5));
  leglinkFrame2.matrix.multiply(M.makeRotationZ(theta2));    
    // Frame 2 has been established, now setup the extra transformations for the scaled box geometry
  leglink2.matrix.copy(leglinkFrame2.matrix);
  leglink2.matrix.multiply(M.makeTranslation(0.5,0,0.5));
  leglink2.matrix.multiply(M.makeRotationZ(-Math.PI/2));
  leglink2.matrix.multiply(M.makeRotationX(Math.PI/4));   
  leglink2.matrix.multiply(M.makeScale(1,1/4,1));    

    ///////////////  link3 - LEG 2 pt 1
  leglinkFrame3.matrix.identity(); 
  leglinkFrame3.matrix.multiply(M.makeTranslation(xPosition+10,yPosition,10)); 
  leglinkFrame3.matrix.multiply(M.makeRotationY(-Math.PI));  
  leglinkFrame3.matrix.multiply(M.makeRotationZ(theta3));   
    // Frame 3 has been established, now setup the extra transformations for the scaled box geometry
  leglink3.matrix.copy(leglinkFrame3.matrix);
  leglink3.matrix.multiply(M.makeTranslation(2,0,3)); 
  leglink3.matrix.multiply(M.makeRotationZ(-Math.PI/2));
  leglink3.matrix.multiply(M.makeRotationX(Math.PI/4));
  leglink3.matrix.multiply(M.makeScale(1,1/2,1));    

    /////////////// link4 - LEG 2 pt 2
  leglinkFrame4.matrix.copy(leglinkFrame3.matrix);
  leglinkFrame4.matrix.multiply(M.makeTranslation(4,0,5));
  leglinkFrame4.matrix.multiply(M.makeRotationZ(theta4));    
    // Frame 4 has been established, now setup the extra transformations for the scaled box geometry
  leglink4.matrix.copy(leglinkFrame4.matrix); 
  leglink4.matrix.multiply(M.makeTranslation(0.5,0,0.5));
  leglink4.matrix.multiply(M.makeRotationZ(-Math.PI/2));
  leglink4.matrix.multiply(M.makeRotationX(Math.PI/4));   
  leglink4.matrix.multiply(M.makeScale(1,1/4,1));    

    ///////////////  link5 - LEG 3 pt 1
  leglinkFrame5.matrix.identity(); 
  leglinkFrame5.matrix.multiply(M.makeTranslation(xPosition+10,yPosition,10)); 
  leglinkFrame5.matrix.multiply(M.makeRotationY(-Math.PI/4));    
  leglinkFrame5.matrix.multiply(M.makeRotationZ(theta5));    
    // Frame 5 has been established, now setup the extra transformations for the scaled box geometry
  leglink5.matrix.copy(leglinkFrame5.matrix);
  leglink5.matrix.multiply(M.makeTranslation(2,0,3));  
  leglink5.matrix.multiply(M.makeRotationZ(-Math.PI/2));
  leglink5.matrix.multiply(M.makeRotationX(Math.PI/4));
  leglink5.matrix.multiply(M.makeScale(1,1/2,1));    

    // link6 - LEG 3 pt 2
  leglinkFrame6.matrix.copy(leglinkFrame5.matrix); 
  leglinkFrame6.matrix.multiply(M.makeTranslation(4,0,5));       
  leglinkFrame6.matrix.multiply(M.makeRotationZ(theta6));    
    // Frame 6 has been established, now setup the extra transformations for the scaled box geometry
  leglink6.matrix.copy(leglinkFrame6.matrix);
  leglink6.matrix.multiply(M.makeRotationZ(-Math.PI/2));
  leglink6.matrix.multiply(M.makeRotationX(Math.PI/4));   
  leglink6.matrix.multiply(M.makeScale(1,1/4,1));   

  // link7 - LEG 4 pt 1
  leglinkFrame7.matrix.identity(); 
  leglinkFrame7.matrix.multiply(M.makeTranslation(xPosition+10,yPosition,10));   
  leglinkFrame7.matrix.multiply(M.makeRotationY(-Math.PI/2)); 
  leglinkFrame7.matrix.multiply(M.makeRotationZ(theta7));    
  // Frame 7 has been established, now setup the extra transformations for the scaled box geometry
  leglink7.matrix.copy(leglinkFrame7.matrix);
  leglink7.matrix.multiply(M.makeTranslation(2,0,3));
  leglink7.matrix.multiply(M.makeRotationZ(-Math.PI/2));
  leglink7.matrix.multiply(M.makeRotationX(Math.PI/4));
  leglink7.matrix.multiply(M.makeScale(1,1/2,1));  


    // link8 - LEG 4 pt 2
  leglinkFrame8.matrix.copy(leglinkFrame7.matrix); 
  leglinkFrame8.matrix.multiply(M.makeTranslation(4,0,5)); 
  leglinkFrame8.matrix.multiply(M.makeRotationZ(theta8));    
    // Frame 8 has been established, now setup the extra transformations for the scaled box geometry
  leglink8.matrix.copy(leglinkFrame8.matrix);
  leglink8.matrix.multiply(M.makeRotationZ(-Math.PI/2));
  leglink8.matrix.multiply(M.makeRotationX(Math.PI/4));   
  leglink8.matrix.multiply(M.makeScale(1,1/4,1));  

  // link9 - LEG 5 pt 1
  leglinkFrame9.matrix.identity(); 
  leglinkFrame9.matrix.multiply(M.makeTranslation(xPosition+10,yPosition,10)); 
  leglinkFrame9.matrix.multiply(M.makeRotationY(3*Math.PI/4));   
  leglinkFrame9.matrix.multiply(M.makeRotationZ(theta9));    
  // Frame 9 has been established, now setup the extra transformations for the scaled box geometry
  leglink9.matrix.copy(leglinkFrame9.matrix);
  leglink9.matrix.multiply(M.makeTranslation(2,0,3));
  leglink9.matrix.multiply(M.makeRotationZ(-Math.PI/2));
  leglink9.matrix.multiply(M.makeRotationX(Math.PI/4));
  leglink9.matrix.multiply(M.makeScale(1,1/2,1)); 

   // link10 - LEG 5 pt 2
   leglinkFrame10.matrix.copy(leglinkFrame9.matrix); 
   leglinkFrame10.matrix.multiply(M.makeTranslation(4,0,5)); 
   leglinkFrame10.matrix.multiply(M.makeRotationZ(theta10));    
     // Frame 10 has been established, now setup the extra transformations for the scaled box geometry
   leglink10.matrix.copy(leglinkFrame10.matrix);
   leglink10.matrix.multiply(M.makeRotationZ(-Math.PI/2));
   leglink10.matrix.multiply(M.makeRotationX(Math.PI/4));   
   leglink10.matrix.multiply(M.makeScale(1,1/4,1));
   

   // link11 - LEG 6 pt 1
   leglinkFrame11.matrix.identity(); 
   leglinkFrame11.matrix.multiply(M.makeTranslation(xPosition+10,yPosition,10)); 
   leglinkFrame11.matrix.multiply(M.makeRotationY(-3*Math.PI/4));    
   leglinkFrame11.matrix.multiply(M.makeRotationZ(theta11));    
   // Frame 11 has been established, now setup the extra transformations for the scaled box geometry
   leglink11.matrix.copy(leglinkFrame11.matrix);
   leglink11.matrix.multiply(M.makeTranslation(2,0,3));
   leglink11.matrix.multiply(M.makeRotationZ(-Math.PI/2));
   leglink11.matrix.multiply(M.makeRotationX(Math.PI/4));
   leglink11.matrix.multiply(M.makeScale(1,1/2,1)); 


   // link12 - LEG 6 pt 2
   leglinkFrame12.matrix.copy(leglinkFrame11.matrix); 
   leglinkFrame12.matrix.multiply(M.makeTranslation(4,0,5)); 
   leglinkFrame12.matrix.multiply(M.makeRotationZ(theta12));    
     // Frame 12 has been established, now setup the extra transformations for the scaled box geometry
   leglink12.matrix.copy(leglinkFrame12.matrix);
   leglink12.matrix.multiply(M.makeRotationZ(-Math.PI/2));
   leglink12.matrix.multiply(M.makeRotationX(Math.PI/4));   
   leglink12.matrix.multiply(M.makeScale(1,1/4,1));


  // link13 - LEG 7 pt 1
  leglinkFrame13.matrix.identity(); 
  leglinkFrame13.matrix.multiply(M.makeTranslation(xPosition+10,yPosition,10));
  leglinkFrame13.matrix.multiply(M.makeRotationY(Math.PI/2));    
  leglinkFrame13.matrix.multiply(M.makeRotationZ(theta13));    
  // Frame 13 has been established, now setup the extra transformations for the scaled box geometry
  leglink13.matrix.copy(leglinkFrame13.matrix);
  leglink13.matrix.multiply(M.makeTranslation(2,0,3));
  leglink13.matrix.multiply(M.makeRotationZ(-Math.PI/2));
  leglink13.matrix.multiply(M.makeRotationX(Math.PI/4));
  leglink13.matrix.multiply(M.makeScale(1,1/2,1));
  
  // link14 - LEG 7 pt 2
  leglinkFrame14.matrix.copy(leglinkFrame13.matrix); 
  leglinkFrame14.matrix.multiply(M.makeTranslation(4,0,5)); 
  leglinkFrame14.matrix.multiply(M.makeRotationZ(theta14));    
  // Frame 14 has been established, now setup the extra transformations for the scaled box geometry
  leglink14.matrix.copy(leglinkFrame14.matrix);
  leglink14.matrix.multiply(M.makeRotationZ(-Math.PI/2));
  leglink14.matrix.multiply(M.makeRotationX(Math.PI/4));   
  leglink14.matrix.multiply(M.makeScale(1,1/4,1));

  // link15 - LEG 8 pt 1
  leglinkFrame15.matrix.identity(); 
  leglinkFrame15.matrix.multiply(M.makeTranslation(xPosition+10,yPosition-1,10));
  leglinkFrame15.matrix.multiply(M.makeRotationY(Math.PI/4));      
  leglinkFrame15.matrix.multiply(M.makeRotationZ(theta15));    
  // Frame 15 has been established, now setup the extra transformations for the scaled box geometry
  leglink15.matrix.copy(leglinkFrame15.matrix);
  leglink15.matrix.multiply(M.makeTranslation(2,0,3));
  leglink15.matrix.multiply(M.makeRotationZ(-Math.PI/2));
  leglink15.matrix.multiply(M.makeRotationX(Math.PI/4));
  leglink15.matrix.multiply(M.makeScale(1,1/2,1));
    
  // link16 - LEG 8 pt 2
  leglinkFrame16.matrix.copy(leglinkFrame15.matrix); 
  leglinkFrame16.matrix.multiply(M.makeTranslation(4,0,5)); 
  leglinkFrame16.matrix.multiply(M.makeRotationZ(theta16));    
  // Frame 16 has been established, now setup the extra transformations for the scaled box geometry
  leglink16.matrix.copy(leglinkFrame16.matrix);
  leglink16.matrix.multiply(M.makeRotationZ(-Math.PI/2));
  leglink16.matrix.multiply(M.makeRotationX(Math.PI/4));   
  leglink16.matrix.multiply(M.makeScale(1,1/4,1));

  leglink1.updateMatrixWorld();
  leglink2.updateMatrixWorld();
  leglink3.updateMatrixWorld();
  leglink4.updateMatrixWorld();
  leglink5.updateMatrixWorld();
  leglink6.updateMatrixWorld();
  leglink7.updateMatrixWorld();
  leglink8.updateMatrixWorld();
  leglink9.updateMatrixWorld();
  leglink10.updateMatrixWorld();
  leglink11.updateMatrixWorld();
  leglink12.updateMatrixWorld();
  leglink13.updateMatrixWorld();
  leglink14.updateMatrixWorld();
  leglink15.updateMatrixWorld();
  leglink16.updateMatrixWorld();

  leglinkFrame1.updateMatrixWorld();
  leglinkFrame2.updateMatrixWorld();
  leglinkFrame3.updateMatrixWorld();
  leglinkFrame4.updateMatrixWorld();
  leglinkFrame5.updateMatrixWorld();
  leglinkFrame6.updateMatrixWorld();
  leglinkFrame7.updateMatrixWorld();
  leglinkFrame8.updateMatrixWorld();
  leglinkFrame9.updateMatrixWorld();
  leglinkFrame10.updateMatrixWorld();
  leglinkFrame11.updateMatrixWorld();
  leglinkFrame12.updateMatrixWorld();
  leglinkFrame13.updateMatrixWorld();
  leglinkFrame14.updateMatrixWorld();
  leglinkFrame15.updateMatrixWorld();
  leglinkFrame16.updateMatrixWorld();
}




///////////////////////////////////////////////////////////////////////////////////////
// handSetMatrices(avars)
///////////////////////////////////////////////////////////////////////////////////////

function handSetMatrices(avars) {
    var xPosition = avars[0];
    var yPosition = avars[1];
    var theta1 = avars[2]*deg2rad;
    var theta2 = avars[3]*deg2rad;
    var theta3 = avars[4]*deg2rad;
    var theta4 = avars[5]*deg2rad;
    var theta5 = avars[6]*deg2rad;
    var M =  new THREE.Matrix4();
    
      ////////////// link1 
    linkFrame1.matrix.identity(); 
    linkFrame1.matrix.multiply(M.makeTranslation(xPosition,yPosition,0));   
    linkFrame1.matrix.multiply(M.makeRotationZ(theta1));    
      // Frame 1 has been established, now setup the extra transformations for the scaled box geometry
    link1.matrix.copy(linkFrame1.matrix);
    link1.matrix.multiply(M.makeTranslation(2,0,0));   
    link1.matrix.multiply(M.makeScale(6,1,7));    

      ////////////// link2
    linkFrame2.matrix.copy(linkFrame1.matrix);      // start with parent frame
    linkFrame2.matrix.multiply(M.makeTranslation(5,0,1));
    linkFrame2.matrix.multiply(M.makeRotationZ(theta2));    
      // Frame 2 has been established, now setup the extra transformations for the scaled box geometry
    link2.matrix.copy(linkFrame2.matrix);
    link2.matrix.multiply(M.makeTranslation(2,0,0));   
    link2.matrix.multiply(M.makeScale(4,1,1));    

      ///////////////  link3
    linkFrame3.matrix.copy(linkFrame2.matrix);
    linkFrame3.matrix.multiply(M.makeTranslation(4,0,0));
    linkFrame3.matrix.multiply(M.makeRotationZ(theta3));    
      // Frame 3 has been established, now setup the extra transformations for the scaled box geometry
    link3.matrix.copy(linkFrame3.matrix);
    link3.matrix.multiply(M.makeTranslation(2,0,0));   
    link3.matrix.multiply(M.makeScale(4,1,1));    

      /////////////// link4
    linkFrame4.matrix.copy(linkFrame1.matrix);
    linkFrame4.matrix.multiply(M.makeTranslation(5,0,-1));
    linkFrame4.matrix.multiply(M.makeRotationZ(theta4));    
      // Frame 4 has been established, now setup the extra transformations for the scaled box geometry
    link4.matrix.copy(linkFrame4.matrix);
    link4.matrix.multiply(M.makeTranslation(2,0,0));   
    link4.matrix.multiply(M.makeScale(4,1,1));    

      // link5
    linkFrame5.matrix.copy(linkFrame4.matrix);
    linkFrame5.matrix.multiply(M.makeTranslation(4,0,0));
    linkFrame5.matrix.multiply(M.makeRotationZ(theta5));    
      // Frame 5 has been established, now setup the extra transformations for the scaled box geometry
    link5.matrix.copy(linkFrame5.matrix);
    link5.matrix.multiply(M.makeTranslation(2,0,0));   
    link5.matrix.multiply(M.makeScale(4,1,1));    

    link1.updateMatrixWorld();
    link2.updateMatrixWorld();
    link3.updateMatrixWorld();
    link4.updateMatrixWorld();
    link5.updateMatrixWorld();

    linkFrame1.updateMatrixWorld();
    linkFrame2.updateMatrixWorld();
    linkFrame3.updateMatrixWorld();
    linkFrame4.updateMatrixWorld();
    linkFrame5.updateMatrixWorld();
}

/////////////////////////////////////	
// initLights():  SETUP LIGHTS
/////////////////////////////////////	

function initLights() {
    light = new THREE.PointLight(0xffffff);
    light.position.set(10,12,2);
    scene.add(light);
    ambientLight = new THREE.AmbientLight(0x606060);
    scene.add(ambientLight);
}

/////////////////////////////////////	
// MATERIALS
/////////////////////////////////////	

var diffuseMaterial = new THREE.MeshLambertMaterial( {color: 0xffffff} );
var diffuseMaterial2 = new THREE.MeshLambertMaterial( {color: 0xffffff, side: THREE.DoubleSide } );
var basicMaterial = new THREE.MeshBasicMaterial( {color: 0xff0000} );
var armadilloMaterial = new THREE.MeshBasicMaterial( {color: 0x7fff7f} );

/////////////////////////////////////	
// initObjects():  setup objects or geometry in the scene
/////////////////////////////////////	

function initObjects() {
    var worldFrame = new THREE.AxesHelper(5) ;
    scene.add(worldFrame);

    // mybox 
    var myboxGeometry = new THREE.BoxGeometry( 1, 1, 1 );    // width, height, depth
    mybox = new THREE.Mesh( myboxGeometry, diffuseMaterial );
    mybox.position.set(4,4,0);
    scene.add( mybox );

    // textured floor
    var floorTexture = new THREE.TextureLoader().load('images/seafloor.png');
    floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(1, 1);
    var floorMaterial = new THREE.MeshBasicMaterial({ map: floorTexture, side: THREE.DoubleSide });
    var floorGeometry = new THREE.PlaneGeometry(70,70);
    var floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.position.y = -1.5;
    floor.rotation.x = Math.PI / 2;
    scene.add(floor);

    // sphere, located at light position
    var sphereGeometry = new THREE.SphereGeometry(0.3, 32, 32);    // radius, segments, segments
    sphere = new THREE.Mesh(sphereGeometry, basicMaterial);
    sphere.position.set(0,4,2);
    sphere.position.set(light.position.x, light.position.y, light.position.z);
    scene.add(sphere);

    // box
    var boxGeometry = new THREE.BoxGeometry( 1, 1, 1 );    // width, height, depth
    var box = new THREE.Mesh( boxGeometry, diffuseMaterial );
    box.position.set(0, 1.2, 0);
    scene.add( box );

    // multi-colored cube      [https://stemkoski.github.io/Three.js/HelloWorld.html] 
    var cubeMaterialArray = [];    // order to add materials: x+,x-,y+,y-,z+,z-
    cubeMaterialArray.push( new THREE.MeshBasicMaterial( { color: 0xff3333 } ) );
    cubeMaterialArray.push( new THREE.MeshBasicMaterial( { color: 0xff8800 } ) );
    cubeMaterialArray.push( new THREE.MeshBasicMaterial( { color: 0xffff33 } ) );
    cubeMaterialArray.push( new THREE.MeshBasicMaterial( { color: 0x33ff33 } ) );
    cubeMaterialArray.push( new THREE.MeshBasicMaterial( { color: 0x3333ff } ) );
    cubeMaterialArray.push( new THREE.MeshBasicMaterial( { color: 0x8833ff } ) );
      // Cube parameters: width (x), height (y), depth (z), 
      //        (optional) segments along x, segments along y, segments along z
    var mccGeometry = new THREE.BoxGeometry( 1.5, 1.5, 1.5, 1, 1, 1 );
    var mcc = new THREE.Mesh( mccGeometry, cubeMaterialArray );
    mcc.position.set(0,0,0);
    scene.add( mcc );	

    // cylinder
    // parameters:  radiusAtTop, radiusAtBottom, height, radialSegments, heightSegments
    var cylinderGeometry = new THREE.CylinderGeometry( 0.30, 0.30, 0.80, 20, 4 );
    var cylinder = new THREE.Mesh( cylinderGeometry, diffuseMaterial);
    cylinder.position.set(2, 0, 0);
    scene.add( cylinder );

    // cone:   parameters --  radiusTop, radiusBot, height, radialSegments, heightSegments
    var coneGeometry = new THREE.CylinderGeometry( 0.0, 0.30, 0.80, 20, 4 );
    var cone = new THREE.Mesh( coneGeometry, diffuseMaterial);
    cone.position.set(4, 0, 0);
    scene.add( cone);

    // torus:   parameters -- radius, diameter, radialSegments, torusSegments
    var torusGeometry = new THREE.TorusGeometry( 1.2, 0.4, 10, 20 );
    var torus = new THREE.Mesh( torusGeometry, diffuseMaterial);

    torus.rotation.set(0,0,0);     // rotation about x,y,z axes
    torus.scale.set(1,4,3);
    torus.rotation.x = Math.PI / 2;
    torus.position.set(-6, 0, 0);   // translation

    scene.add( torus );

    /////////////////////////////////////
    //  CUSTOM OBJECT 
    ////////////////////////////////////
    
    var geom = new THREE.Geometry(); 
    var v0 = new THREE.Vector3(0,0,0);
    var v1 = new THREE.Vector3(3,0,0);
    var v2 = new THREE.Vector3(0,3,0);
    var v3 = new THREE.Vector3(3,3,0);
    
    geom.vertices.push(v0);
    geom.vertices.push(v1);
    geom.vertices.push(v2);
    geom.vertices.push(v3);
    
    geom.faces.push( new THREE.Face3( 0, 1, 2 ) );
    geom.faces.push( new THREE.Face3( 1, 3, 2 ) );
    geom.computeFaceNormals();
    
    customObject = new THREE.Mesh( geom, diffuseMaterial );
    customObject.position.set(3.5, 0, 4);
    customObject.rotation.set(-Math.PI/2,0,0);
    scene.add(customObject);
}

/////////////////////////////////////////////////////////////////////////////////////
//  initFace():  define all geometry associated with the Face
/////////////////////////////////////////////////////////////////////////////////////

function initFace() {
      /////////////////////////////////////
    //  CUSTOM Geometry for smile 
    ////////////////////////////////////
    var numPoints = 100;
    var start = new THREE.Vector3(0.25, 2, 3);
    var middle1 = new THREE.Vector3(0, -2, 0);
    var end = new THREE.Vector3(0.25, 2, -3);

    var curveQuad = new THREE.QuadraticBezierCurve3(start, middle1, end);
    var smileGeometry = new THREE.TubeGeometry(curveQuad, numPoints, 0.2, 2, false);
        /////////////////////////////////////
    //  CUSTOM Geometry for Hat and it's base 
    ////////////////////////////////////
    var hatGeometry =  new THREE.SphereGeometry(1, 32, 32, 0, 2*Math.PI, 0, Math.PI/2);
    var starthat = new THREE.Vector3(0.5, 1.5, 1);
    var middlehat= new THREE.Vector3(0, 0.5, 0);
    var endhat = new THREE.Vector3(0.5, 1.5, -1);

    var curveQuadhat = new THREE.QuadraticBezierCurve3(starthat, middlehat, endhat);
    var hatbaseGeometry = new THREE.TubeGeometry(curveQuadhat, numPoints, 0.2, 2, false);

    var faceMaterial = new THREE.MeshLambertMaterial( {color: 0x1780F5} );
    var blackMaterial = new THREE.MeshLambertMaterial( {color: 0x000000} );
    var sphereGeometry = new THREE.SphereGeometry( 4, 64, 32  ); 
    var eyeGeometry = new THREE.SphereGeometry( 1, 64, 32  );   

    facelink1 = new THREE.Mesh( sphereGeometry, faceMaterial ); scene.add(facelink1);
    facelinkFrame1   = new THREE.AxesHelper(1) ;   scene.add(facelinkFrame1);
    facelink2 = new THREE.Mesh( eyeGeometry, blackMaterial );  scene.add( facelink2 );
    facelinkFrame2   = new THREE.AxesHelper(1) ;   scene.add(facelinkFrame2);
    facelink3 = new THREE.Mesh( eyeGeometry, blackMaterial );  scene.add(facelink3);
    facelinkFrame3   = new THREE.AxesHelper(1) ;   scene.add(facelinkFrame3);
    facelink4 = new THREE.Mesh( smileGeometry, blackMaterial ); scene.add(facelink4);
    facelinkFrame4   = new THREE.AxesHelper(1) ;   scene.add(facelinkFrame4);
    facelink5 = new THREE.Mesh( hatbaseGeometry, blackMaterial );  scene.add( facelink5 );
    facelink5b = new THREE.Mesh(hatGeometry, blackMaterial); scene.add( facelink5b );
    facelinkFrame5   = new THREE.AxesHelper(1) ;   scene.add(facelinkFrame5);

    facelink1.matrixAutoUpdate = false;  
    facelink2.matrixAutoUpdate = false;  
    facelink3.matrixAutoUpdate = false;  
    facelink4.matrixAutoUpdate = false;  
    facelink5.matrixAutoUpdate = false;
    facelink5b.matrixAutoUpdate = false;
    facelinkFrame1.matrixAutoUpdate = false;  
    facelinkFrame2.matrixAutoUpdate = false;  
    facelinkFrame3.matrixAutoUpdate = false;  
    facelinkFrame4.matrixAutoUpdate = false;  
    facelinkFrame5.matrixAutoUpdate = false;
}

/////////////////////////////////////////////////////////////////////////////////////
//  initLeg():  define all geometry associated with the hand
/////////////////////////////////////////////////////////////////////////////////////

function initLeg() {
     /////////////////////////////////////
    //  Geometry for leg 
    ////////////////////////////////////

  const legGeometry1 = new THREE.CylinderGeometry( 0.7, 0.7, 10, 32 );
  var legMaterial = new THREE.MeshLambertMaterial( {color: 0x1780F5} );
  

  leglink1 = new THREE.Mesh( legGeometry1, legMaterial );   scene.add( leglink1 );     // LEG 1 pt 1
  leglinkFrame1   = new THREE.AxesHelper(1) ;   scene.add(leglinkFrame1);
  leglink2 = new THREE.Mesh( legGeometry1, legMaterial );   scene.add( leglink2);  // LEG 1 pt 2
  leglinkFrame2   = new THREE.AxesHelper(1) ;   scene.add(leglinkFrame2);               

  leglink3 = new THREE.Mesh( legGeometry1, legMaterial ); scene.add( leglink3 ); // LEG 2 pt 1
  leglinkFrame3   = new THREE.AxesHelper(1) ;   scene.add(leglinkFrame3);
  leglink4 = new THREE.Mesh( legGeometry1, legMaterial ); scene.add( leglink4 );// LEG 2 pt 2
  leglinkFrame4   = new THREE.AxesHelper(1) ;   scene.add(leglinkFrame4);

  leglink5 = new THREE.Mesh( legGeometry1, legMaterial ); scene.add( leglink5 ); // LEG 3 pt 1
  leglinkFrame5   = new THREE.AxesHelper(1) ;   scene.add(leglinkFrame5); 
  leglink6 = new THREE.Mesh( legGeometry1, legMaterial ); scene.add( leglink6 );// LEG 3 pt 2
  leglinkFrame6   = new THREE.AxesHelper(1) ;   scene.add(leglinkFrame6); 

  leglink7 = new THREE.Mesh( legGeometry1, legMaterial ); scene.add( leglink7 ); // LEG 4 pt 1
  leglinkFrame7   = new THREE.AxesHelper(1) ;   scene.add(leglinkFrame7); 
  leglink8 = new THREE.Mesh( legGeometry1, legMaterial ); scene.add( leglink8 );  // LEG 4 pt 2
  leglinkFrame8   = new THREE.AxesHelper(1) ;   scene.add(leglinkFrame8); 

  leglink9 = new THREE.Mesh( legGeometry1, legMaterial ); scene.add( leglink9 ); // LEG 5 pt 1
  leglinkFrame9   = new THREE.AxesHelper(1) ;   scene.add(leglinkFrame9); 
  leglink10 = new THREE.Mesh( legGeometry1, legMaterial ); scene.add( leglink10);  // LEG 5 pt 2
  leglinkFrame10   = new THREE.AxesHelper(1) ;   scene.add(leglinkFrame10); 

  leglink11 = new THREE.Mesh( legGeometry1, legMaterial );  scene.add( leglink11 );// LEG 6 pt 1
  leglinkFrame11   = new THREE.AxesHelper(1) ;   scene.add(leglinkFrame11); 
  leglink12 = new THREE.Mesh( legGeometry1, legMaterial ); scene.add( leglink12 ); // LEG 6 pt 2
  leglinkFrame12   = new THREE.AxesHelper(1) ;   scene.add(leglinkFrame12);
  
  leglink13 = new THREE.Mesh( legGeometry1, legMaterial );  scene.add( leglink13 );// LEG 7 pt 1
  leglinkFrame13   = new THREE.AxesHelper(1) ;   scene.add(leglinkFrame13); 
  leglink14 = new THREE.Mesh( legGeometry1, legMaterial ); scene.add( leglink14 );// LEG 7 pt 2
  leglinkFrame14   = new THREE.AxesHelper(1) ;   scene.add(leglinkFrame14);


  leglink15 = new THREE.Mesh( legGeometry1, legMaterial );  scene.add( leglink15); // LEG 8 pt 1
  leglinkFrame15   = new THREE.AxesHelper(1) ;   scene.add(leglinkFrame15); 
  leglink16 = new THREE.Mesh( legGeometry1, legMaterial ); scene.add( leglink16);/// LEG 8 pt 2
  leglinkFrame16   = new THREE.AxesHelper(1) ;   scene.add(leglinkFrame16);


  leglink1.matrixAutoUpdate = false;  
  leglink2.matrixAutoUpdate = false;  
  leglink3.matrixAutoUpdate = false;  
  leglink4.matrixAutoUpdate = false;  
  leglink5.matrixAutoUpdate = false;
  leglink6.matrixAutoUpdate = false;
  leglink7.matrixAutoUpdate = false;
  leglink8.matrixAutoUpdate = false;
  leglink9.matrixAutoUpdate = false;
  leglink10.matrixAutoUpdate = false;
  leglink11.matrixAutoUpdate = false;
  leglink12.matrixAutoUpdate = false;
  leglink13.matrixAutoUpdate = false;
  leglink14.matrixAutoUpdate = false;
  leglink15.matrixAutoUpdate = false;
  leglink16.matrixAutoUpdate = false;
  


  leglinkFrame1.matrixAutoUpdate = false;  
  leglinkFrame2.matrixAutoUpdate = false;  
  leglinkFrame3.matrixAutoUpdate = false;  
  leglinkFrame4.matrixAutoUpdate = false;  
  leglinkFrame5.matrixAutoUpdate = false;
  leglinkFrame6.matrixAutoUpdate = false;  
  leglinkFrame7.matrixAutoUpdate = false;  
  leglinkFrame8.matrixAutoUpdate = false;  
  leglinkFrame9.matrixAutoUpdate = false;  
  leglinkFrame10.matrixAutoUpdate = false;
  leglinkFrame11.matrixAutoUpdate = false;  
  leglinkFrame12.matrixAutoUpdate = false;  
  leglinkFrame13.matrixAutoUpdate = false;  
  leglinkFrame14.matrixAutoUpdate = false;  
  leglinkFrame15.matrixAutoUpdate = false;
  leglinkFrame16.matrixAutoUpdate = false;   
}


/////////////////////////////////////////////////////////////////////////////////////
//  initHand():  define all geometry associated with the hand
/////////////////////////////////////////////////////////////////////////////////////

function initHand() {
    var handMaterial = new THREE.MeshLambertMaterial( {color: 0xffffff} );
    var boxGeometry = new THREE.BoxGeometry( 1, 1, 1 );    // width, height, depth

    link1 = new THREE.Mesh( boxGeometry, handMaterial );  scene.add( link1 );
    linkFrame1   = new THREE.AxesHelper(1) ;   scene.add(linkFrame1);
    link2 = new THREE.Mesh( boxGeometry, handMaterial );  scene.add( link2 );
    linkFrame2   = new THREE.AxesHelper(1) ;   scene.add(linkFrame2);
    link3 = new THREE.Mesh( boxGeometry, handMaterial );  scene.add( link3 );
    linkFrame3   = new THREE.AxesHelper(1) ;   scene.add(linkFrame3);
    link4 = new THREE.Mesh( boxGeometry, handMaterial );  scene.add( link4 );
    linkFrame4   = new THREE.AxesHelper(1) ;   scene.add(linkFrame4);
    link5 = new THREE.Mesh( boxGeometry, handMaterial );  scene.add( link5 );
    linkFrame5   = new THREE.AxesHelper(1) ;   scene.add(linkFrame5);

    link1.matrixAutoUpdate = false;  
    link2.matrixAutoUpdate = false;  
    link3.matrixAutoUpdate = false;  
    link4.matrixAutoUpdate = false;  
    link5.matrixAutoUpdate = false;
    linkFrame1.matrixAutoUpdate = false;  
    linkFrame2.matrixAutoUpdate = false;  
    linkFrame3.matrixAutoUpdate = false;  
    linkFrame4.matrixAutoUpdate = false;  
    linkFrame5.matrixAutoUpdate = false;
}

/////////////////////////////////////////////////////////////////////////////////////
//  create customShader material
/////////////////////////////////////////////////////////////////////////////////////

var customShaderMaterial = new THREE.ShaderMaterial( {
//        uniforms: { textureSampler: {type: 't', value: floorTexture}},
	vertexShader: document.getElementById( 'customVertexShader' ).textContent,
	fragmentShader: document.getElementById( 'customFragmentShader' ).textContent
} );

// var ctx = renderer.context;
// ctx.getShaderInfoLog = function () { return '' };   // stops shader warnings, seen in some browsers

////////////////////////////////////////////////////////////////////////	
// initFileObjects():    read object data from OBJ files;  see onResourcesLoaded() for instances
////////////////////////////////////////////////////////////////////////	

var models;

function initFileObjects() {

        // list of OBJ files that we want to load, and their material
    models = {     
	teapot:    {obj:"obj/teapot.obj", mtl: customShaderMaterial, mesh: null	},
	armadillo: {obj:"obj/armadillo.obj", mtl: customShaderMaterial, mesh: null },
	dragon:    {obj:"obj/dragon.obj", mtl: customShaderMaterial, mesh: null }
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
	
 // Clone models into meshes;   [Michiel:  AFAIK this makes a "shallow" copy of the model,
 //                             i.e., creates references to the geometry, and not full copies ]
    meshes["armadillo1"] = models.armadillo.mesh.clone();
    meshes["armadillo2"] = models.armadillo.mesh.clone();
    meshes["dragon1"] = models.dragon.mesh.clone();
    meshes["teapot1"] = models.teapot.mesh.clone();
    meshes["teapot2"] = models.teapot.mesh.clone();
    
    // position the object instances and parent them to the scene, i.e., WCS
    // For static objects in your scene, it is ok to use the default postion / rotation / scale
    // to build the object-to-world transformation matrix. This is what we do below.
    //
    // Three.js builds the transformation matrix according to:  M = T*R*S,
    // where T = translation, according to position.set()
    //       R = rotation, according to rotation.set(), and which implements the following "Euler angle" rotations:
    //            R = Rx * Ry * Rz
    //       S = scale, according to scale.set()
    
    meshes["armadillo1"].position.set(-6, 0, 2);
    meshes["armadillo1"].rotation.set(0,-Math.PI/2,0);
    meshes["armadillo1"].scale.set(1,1,1);
    scene.add(meshes["armadillo1"]);

    meshes["armadillo2"].position.set(-6, 0, -1);
    meshes["armadillo2"].rotation.set(0,-Math.PI/2,0);
    meshes["armadillo2"].scale.set(1,1,1);
    scene.add(meshes["armadillo2"]);

      // note:  the local transformations described by the following position, rotation, and scale
      // are overwritten by the animation loop for this particular object, which directly builds the
      // dragon1-to-world transformation matrix
    meshes["dragon1"].position.set(-5, 0.2, 4);
    meshes["dragon1"].rotation.set(0, Math.PI, 0);
    meshes["dragon1"].scale.set(0.3,0.3,0.3);
    scene.add(meshes["dragon1"]);

    meshes["teapot1"].position.set(3, 0, 3);
    meshes["teapot1"].scale.set(0.5, 0.5, 0.5);
    scene.add(meshes["teapot1"]);

    meshes["teapot2"].position.set(6, 0, 3);
    meshes["teapot2"].scale.set(-0.5, 0.5, 0.5);
    scene.add(meshes["teapot2"]);

    meshesLoaded = true;
}


///////////////////////////////////////////////////////////////////////////////////////
// LISTEN TO KEYBOARD
///////////////////////////////////////////////////////////////////////////////////////

// movement
document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(event) {
    var keyCode = event.which;
    // up
    if (keyCode == "W".charCodeAt()) {          // W = up
        light.position.y += 1;
        // down
    } else if (keyCode == "S".charCodeAt()) {   // S = down
        light.position.y -= 1;
        // left
    } else if (keyCode == "A".charCodeAt()) {   // A = left
	light.position.x -= 1;
        // right
    } else if (keyCode == "D".charCodeAt()) {   // D = right
        light.position.x += 1;
    } else if (keyCode == " ".charCodeAt()) {   // space
	    animation = !animation;
      move = 0;
    }else if(keyCode == "X".charCodeAt()){ // X
      animation2 = !animation2;
    }
    else if(keyCode == "H".charCodeAt()){
      animation = false;
      animation2 = true;
      move = 0;
      animation3 = !animation3;
    }
    else if(keyCode == 40){ // back arrow key
      move = 1;
    }else if(keyCode == 38){ // up arrow key
      move = 2
    }
};


///////////////////////////////////////////////////////////////////////////////////////
// UPDATE CALLBACK:    This is the main animation loop
///////////////////////////////////////////////////////////////////////////////////////

function update() {
//    console.log('update()');
    var dt=0.02;
    if (animation && meshesLoaded) {
	// advance the motion of all the animated objects
    faceMotion.timestep(dt); 
    legMotion.timestep(dt); 
     
    }
    if(!animation2 && meshesLoaded){
      faceMotion.timestep(dt); 
      legStatic.timestep(dt);  
    }
    if(!animation3 && meshesLoaded){
      myboxMotion.timestep(dt);    // note: will also call myboxSetMatrices(), provided as a callback fn during setup
      handMotion.timestep(dt); // note: will also call myhandSetMatrices(), provided as a callback fn during setup
    }
    if(move == 1 && meshesLoaded){
      faceMove.timestep(dt);
      legMove.timestep(dt);
    }
    if(move == 2 && meshesLoaded){
      faceMoveUp.timestep(dt);
      legMoveUp.timestep(dt);
    }

    if (meshesLoaded) {
	sphere.position.set(light.position.x , light.position.y , light.position.z);
	renderer.render(scene, camera);
    }
    requestAnimationFrame(update);      // requests the next update call;  this creates a loop
}

init();
update();

