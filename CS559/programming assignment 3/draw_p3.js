function setup() { "use strict";
  var canvas = document.getElementById('myCanvas');
  var context = canvas.getContext('2d');
  var m4 = twgl.m4;
  
  var rotate = document.getElementById('RotateSlider');
  rotate.value = 38.019;
  
  
  var cameraY = document.getElementById('CameraYSlider');
  cameraY.value = 28;
  
  var cameraZ = document.getElementById('CameraZSlider');
  cameraZ.value = 0;
  
  var proView = document.getElementById('ProView');
  proView.value = 0;
 
  context.fillStyle='#FDB813';

            
  function moveToTx(x,y,z,Tx) {
    var loc = [x,y,z];
    var locTx = m4.transformPoint(Tx,loc);
    context.moveTo(locTx[0],locTx[1]);
  }

  function lineToTx(x,y,z,Tx) {
    var loc = [x,y,z];
    var locTx = m4.transformPoint(Tx,loc);
    context.lineTo(locTx[0],locTx[1]);
  }
            
  function printMatrix(mat)
  {
	  console.log(mat[0], mat[1], mat[2], mat[3]);
	  console.log(mat[4], mat[5], mat[6], mat[7]);
	  console.log(mat[8], mat[9], mat[10], mat[11]);
	  console.log(mat[12], mat[13], mat[14], mat[15]);
  }              
             
  function drawCube(Tx) {
	  
	  context.fillStyle='#FDB813';
    // A little cross on the front face, for identification
    moveToTx(180,200,100,Tx);lineToTx(220,200,100,Tx);context.stroke();
    moveToTx(200,180,100,Tx);lineToTx(200,220,100,Tx);context.stroke();
    
    // Twelve edges of a cube
    moveToTx(100,100,100,Tx);lineToTx(300,100,100,Tx);
    lineToTx(300,300,100,Tx);lineToTx(100,300,100,Tx);context.stroke();
    moveToTx(300,100,100,Tx);lineToTx(300,100,300,Tx);
    lineToTx(300,300,300,Tx);lineToTx(300,300,100,Tx);context.stroke();
    moveToTx(300,100,300,Tx);lineToTx(100,100,300,Tx);
    lineToTx(100,300,300,Tx);lineToTx(300,300,300,Tx);context.stroke();
    moveToTx(100,100,300,Tx);lineToTx(100,100,100,Tx);
    lineToTx(100,300,100,Tx);lineToTx(100,300,300,Tx);context.stroke();
    context.fill();
    
    moveToTx(100,150,100,Tx);lineToTx(300,150,100,Tx);
    lineToTx(300,250,100,Tx);lineToTx(100,250,100,Tx);context.stroke();
    
    
    
  }

  function draw() {
    // hack to clear the canvas fast
    canvas.width = canvas.width;
    
    var RotateAngle = rotate.value*0.01*Math.PI;
    var axis = [1,1,1];

	var cameraYVal = cameraY.value - 100;
	var cameraZVal = cameraZ.value - 100;
	
	console.log("rotation", RotateAngle);
	console.log(cameraYVal);
	console.log(cameraZVal);
	
    var Rotation=m4.axisRotation(axis,RotateAngle);
    
    var eye = [-500, cameraYVal ,cameraZVal ];
    var position = [200,cameraYVal ,cameraZVal ];
    var vectorUp = [0,1,0];
    var Camera = m4.lookAt(eye, position, vectorUp);
    var CameraInverse = m4.inverse(Camera);
    //var projection = m4.ortho(-4000, 4000, 4000, -4000, -100, -1000);
    //var projection = m4.perspective(Math.PI/6, 0.5, 100, 300);
    //var viewProjection = m4.multiply(view, projection);
    
    var view = m4.multiply(Rotation, CameraInverse);
    var projection = view;;
    
  
    if(proView.value == 0) {
		projection =  m4.perspective(Math.PI/2, 1, -600, 1000);
	}else {
		projection = m4.ortho(-100,400,-100,400,-100,400);
	}
	
	//printMatrix(projection);

    var view1 = m4.multiply(view, projection);
 
    var y =  (700 - 1)/2;
    var viewPort = [y,0,0,0,0,y,0,0,0,0,1,0,0,0,0,1];
    
    var final = m4.multiply( view1, viewPort);
	
    drawCube(final);
  }

  rotate.addEventListener("input",draw);
  cameraY.addEventListener("input",draw);
  cameraZ.addEventListener("input",draw);
  proView.addEventListener("input",draw);
  draw();

}
window.onload = setup;
