function setup() { "use strict";
  var canvas = document.getElementById('myCanvas');
  var context = canvas.getContext('2d');
  var m4 = twgl.m4;
  var m3 = twgl.v3;
  
 
  
  var angle = 0;
  
  var cameraY = document.getElementById('CameraYSlider');
  cameraY.value = 28;
  
  var cameraZ = document.getElementById('CameraZSlider');
  cameraZ.value = 0;
  
  var proView = document.getElementById('ProView');
  proView.value = 0;

  var painters = document.getElementById('Painters');
  painters.value = 1;
  
  var array_list = new Array();
            
  function moveToTx(loc,Tx) {
    var locTx = m4.transformPoint(Tx,loc);
    context.moveTo(locTx[0],locTx[1]);
  }

  function lineToTx(loc,Tx) {
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
             
             
  function Vertex(x1,y1,z1)
  {
	  var x = x1;
	  var y = y1; 
	  var z = z1;
  }           
             
  function Triangle(x, y, z, c)
  {
	  var v1 = x;
	  var v2 = y;
	  var v3 = z;   
	  
	  var color = c;
	  
	  this.printTriangle = function()
	  {
		  console.log(v1[0], v1[1], v1[2]);
	  }
	  
	  this.returnVertex1 = function()
	  {
		  return v1;
	  }
	  
	  this.returnVertex2 = function()
	  {
		  return v2;
	  }
	  
	  this.returnVertex3 = function()
	  {
		  return v3;
	  }
	  
	  this.returnColor = function()
	  {
		  return color;
	  }
  }
  
  function hexToRgb(hex) 
  {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
  }
  
   function rgb2hex(red, green, blue) {
        var rgb = blue | (green << 8) | (red << 16);
        return '#' + (0x1000000 + rgb).toString(16).slice(1)
  }
  
  function Render(Tx)
  {
	  var counter = 0;
	  console.log(array_list.length);
	  for(counter = 0; counter < array_list.length; counter++)
	  {
		  
		  var t = array_list[counter];		 
		  var v1 = t.returnVertex1();
		  var v2 = t.returnVertex2();
		  var v3 = t.returnVertex3();
		  
		  var color = "#FF0FFF";	
		  
		  var c1 = (v1[0] + v2[0] + v3[0])/3;
		  var c2 = (v1[1] + v2[1] + v3[1])/3;
		  var c3 = (v1[2] + v2[2] + v3[2])/3;
		  
		  var centroid = [c1, c2, c3]; 
		  var cross1 = m3.subtract(v2, v1);
		  var cross2 = m3.subtract(v3,v2);
		  
		  var normal = m3.cross(cross1, cross2);
		  normal = m3.normalize(normal);
		  var light = [0,1,1];
		  
		  
		  var r = (m3.dot(m3.normalize(normal), m3.normalize(light)) * (hexToRgb(color).r));
		  var g = (m3.dot(m3.normalize(normal), m3.normalize(light)) * (hexToRgb(color).g));
		  var b = (m3.dot(m3.normalize(normal), m3.normalize(light)) * (hexToRgb(color).b));
		  
		  
		  context.fillStyle = rgb2hex(r,g,b);
		  
		  context.beginPath();
		  moveToTx(v1, Tx);
		  lineToTx(v2, Tx);
		  lineToTx(v3, Tx);
		  lineToTx(v1, Tx);
		  
		  context.stroke();
		  context.fill();
		  moveToTx(centroid, Tx);
		  //console.log(centroid);
		  //console.log(normal);
		  normal = m3.mulScalar(normal, 10);
		  lineToTx(m3.add(centroid, normal), Tx);
		  context.stroke();
		  context.closePath();
		  
		  	    
	  }
  }	
  
  
  
  function drawObject1(Tx) {
	  var l1 = [100, 200, 250];
	  var l2 = [100, 300, 200];
	  var l3 = [100, 300, 300];
	  
	  var v4 = m4.transformPoint(Tx,l1);
	  var v5 = m4.transformPoint(Tx,l2);
	  var v6 = m4.transformPoint(Tx,l3);

	  var t1 = new Triangle(v4, v5, v6, "#0000FF");
	  array_list.push(t1);  
  }

  function drawObject2(Tx) {
	  var l1 = [300, 100, 250];
	  var l2 = [300, 400, 100];
	  var l3 = [300, 400, 400];
	  
	  var v4 = m4.transformPoint(Tx,l1);
	  var v5 = m4.transformPoint(Tx,l2);
	  var v6 = m4.transformPoint(Tx,l3);

	  var t1 = new Triangle(v4, v5, v6, "#00FFFF");
	  array_list.push(t1);  
  }
  
  function compare(t1, t2)
  {
	  var v1 = t1.returnVertex1();
      var v2 = t1.returnVertex2();
	  var v3 = t1.returnVertex3();
	  
	  var z1 = (v1[2] + v2[2] + v3[2])/3;
	  
	  v1 = t2.returnVertex1();
      v2 = t2.returnVertex2();
	  v3 = t2.returnVertex3();
	  
	  var z2 = (v1[2] + v2[2] + v3[2])/3;
	  
	  if(z1 < z2)
		return -1;
	  if(z1 > z2)
		return 1;
	  return 0;
  }
  
  function drawCube(Tx)
  {
	  //draw front face
	  var f1_1 = [100, 100, 100];
	  var f2_1 = [200, 200, 100];
	  var f3_1 = [100, 300, 100];
	  
	  addTriangleToList(f2_1, f1_1, f3_1, "#FF00FF", Tx);
	  
	  var f1_2 = [100, 100, 100];
	  var f2_2 = [300, 100, 100];
	  var f3_2 = [200, 200, 100];
	  
	  addTriangleToList(f2_2, f1_2, f3_2, "#FF00FF", Tx);
	  
	  var f1_3 = [300, 100, 100];
	  var f2_3 = [300, 300, 100];
	  var f3_3 = [200, 200, 100];
	  
	  addTriangleToList(f2_3, f1_3, f3_3, "#FF00FF", Tx); 
	  
	  var f1_4 = [200, 200, 100];
	  var f2_4 = [300, 300, 100];
	  var f3_4 = [100, 300, 100];
	  
	  addTriangleToList(f2_4, f1_4, f3_4, "#FF00FF", Tx);
	  
	  
	  //face2
	  var f1_5 = [100, 100, 300];
	  var f2_5 = [200, 200, 300];
	  var f3_5 = [100, 300, 300];
	  
	  addTriangleToList(f1_5, f2_5, f3_5, "#00FFFF", Tx);
	  
	  var f1_6 = [100, 100, 300];
	  var f2_6 = [300, 100, 300];
	  var f3_6 = [200, 200, 300];
	  
	  addTriangleToList(f1_6, f2_6, f3_6, "#00FFFF", Tx);
	  
	  var f1, f2, f3;
	  f1 = [300, 100, 300];
	  f2 = [300,300,300];
	  f3 = [200,200,300];
	  
	  addTriangleToList(f1, f2, f3, "#00FFFF", Tx);
	 
	  f1 = [200,200,300];
	  f2 = [300,300,300];
	  f3 = [100,300,300];
	  
	  addTriangleToList(f1, f2, f3, "#00FFFF", Tx);
	  
	  //face3
	  
	  f1 = [100,100,300];
	  f2 = [300,100,300];
	  f3 = [200,100,200];
	  
	  addTriangleToList(f2, f1, f3, "#00FFFF", Tx);
	  f1 = [300,100,300];
	  f2 = [300,100,100];
	  f3 = [200,100,200];
	  
	  addTriangleToList(f2, f1, f3, "#00FFFF", Tx);
	  f1 = [200,100,200];
	  f2 = [300,100,100];
	  f3 = [100,100,100];
	  
	  addTriangleToList(f2, f1, f3, "#00FFFF", Tx);
	  
	  f1 = [100,100,100];
	  f2 = [100,100,300];
	  f3 = [200,100,200];
	  
	  addTriangleToList(f2, f1, f3, "#00FFFF", Tx);
	  
	  //face4
	  f1 = [100,300,300];
	  f2 = [200,300,200];
	  f3 = [100,300,100];
	  
	  addTriangleToList(f1, f2, f3, "#00FFFF", Tx);
	  
	  f1 = [100,300,300];
	  f2 = [300,300,300];
	  f3 = [200,300,200];
	  
	  addTriangleToList(f1, f2, f3, "#00FFFF", Tx);
	  
	  f1 = [300,300,300];
	  f2 = [300,300,100];
	  f3 = [200,300,200];
	  
	  addTriangleToList(f1, f2, f3, "#00FFFF", Tx);
	  
	  f1 = [200,300,200];
	  f2 = [300,300,100];
	  f3 = [100,300,100];
	  
	  addTriangleToList(f1, f2, f3, "#00FFFF", Tx);
	  
	  
	  
	  
	  
	  
  }
  
  
  function drawCube2(Tx)
  {
	  //draw front face
	  var f1_1 = [180, 180, 180];
	  var f2_1 = [200, 200, 180];
	  var f3_1 = [180, 220, 180];
	  
	  addTriangleToList(f2_1, f1_1, f3_1, "#FF0000", Tx);
	  
	  var f1_2 = [180, 180, 180];
	  var f2_2 = [220, 180, 180];
	  var f3_2 = [200, 200, 180];
	  
	  addTriangleToList(f2_2, f1_2, f3_2, "#FF0000", Tx);
	  
	  var f1_3 = [220, 180, 180];
	  var f2_3 = [220, 220, 180];
	  var f3_3 = [200, 200, 180];
	  
	  addTriangleToList(f2_3, f1_3, f3_3, "#FF0000", Tx); 
	  
	  var f1_4 = [200, 200, 180];
	  var f2_4 = [220, 220, 180];
	  var f3_4 = [180, 220, 180];
	  
	  addTriangleToList(f2_4, f1_4, f3_4, "#FF0000", Tx);
	  
	  
	  //face2
	  var f1_5 = [180, 180, 220];
	  var f2_5 = [200, 200, 220];
	  var f3_5 = [180, 220, 220];
	  
	  addTriangleToList(f1_5, f2_5, f3_5, "#FF0000", Tx);
	  
	  var f1_6 = [180, 180, 220];
	  var f2_6 = [220, 180, 220];
	  var f3_6 = [200, 200, 220];
	  
	  addTriangleToList(f1_6, f2_6, f3_6, "#FF0000", Tx);
	  
	  var f1, f2, f3;
	  f1 = [220, 180, 220];
	  f2 = [220,220,220];
	  f3 = [200,200,220];
	  
	  addTriangleToList(f1, f2, f3, "#FF0000", Tx);
	 
	  f1 = [200,200,220];
	  f2 = [220,220,220];
	  f3 = [180,220,220];
	  
	  addTriangleToList(f1, f2, f3, "#FF0000", Tx);
	  
	  //face3
	  
	  f1 = [180,180,220];
	  f2 = [220,180,220];
	  f3 = [200,180,200];
	  
	  addTriangleToList(f2, f1, f3, "#FF0000", Tx);
	  f1 = [220,180,220];
	  f2 = [220,180,180];
	  f3 = [200,180,200];
	  
	  addTriangleToList(f2, f1, f3, "#FF0000", Tx);
	  f1 = [200,180,200];
	  f2 = [220,180,180];
	  f3 = [180,180,180];
	  
	  addTriangleToList(f2, f1, f3, "#FF0000", Tx);
	  
	  f1 = [180,180,180];
	  f2 = [180,180,220];
	  f3 = [200,180,200];
	  
	  addTriangleToList(f2, f1, f3, "#FF0000", Tx);
	  
	  //face4
	  f1 = [180,220,220];
	  f2 = [200,220,200];
	  f3 = [180,220,180];
	  
	  addTriangleToList(f1, f2, f3, "#FF0000", Tx);
	  
	  f1 = [180,220,220];
	  f2 = [220,220,220];
	  f3 = [200,220,200];
	  
	  addTriangleToList(f1, f2, f3, "#FF0000", Tx);
	  
	  f1 = [220,220,220];
	  f2 = [220,220,180];
	  f3 = [200,220,200];
	  
	  addTriangleToList(f1, f2, f3, "#FF0000", Tx);
	  
	  f1 = [200,220,200];
	  f2 = [220,220,180];
	  f3 = [180,220,180];
	  
	  addTriangleToList(f1, f2, f3, "#FF0000", Tx);
	  
  }
  
  
  function addTriangleToList(f1, f2, f3, c, Tx)
  {
	var v1 = m4.transformPoint(Tx,f1);
	var v2 = m4.transformPoint(Tx,f2);
	var v3 = m4.transformPoint(Tx,f3);
	  
	var t = new Triangle(v1, v2, v3, c);
	array_list.push(t);  
	  
  }

  function draw() {
    // hack to clear the canvas fast
    canvas.width = canvas.width;
    array_list.length = 0;
    
	context.clearRect(0, 0, canvas.width, canvas.height);
	angle += 0.005*Math.PI;
	
	var RotateAngle = angle;
    var axis = [1,1,1];
    var Rotation=m4.axisRotation(axis,RotateAngle);
    
    var cameraYVal = cameraY.value - 100;
	var cameraZVal = cameraZ.value - 100;
    
    var eye = [-500, cameraYVal ,cameraZVal ];
    var position = [250,cameraYVal,cameraZVal ];
    var vectorUp = [0,1,0];
    var Camera = m4.lookAt(eye, position, vectorUp);
    var CameraInverse = m4.inverse(Camera);
    
    var view = m4.multiply(Rotation, CameraInverse);
    //drawObject1(view);
    //drawObject2(view);
    drawCube(view);
    drawCube2(view);
    
    if(painters.value == 1)
		array_list.sort(compare);
    
    var projection = view;;
    if(proView.value == 0) {
		projection =  m4.perspective(Math.PI/2, 1, -600, 1000);
	}else {
		projection = m4.ortho(-100,400,-100,400,-100,400);
	}
    var y =  (700 - 1)/2;
    var viewPort = [y,0,0,0,0,y,0,0,0,0,1,0,0,0,0,1];
    var final = m4.multiply( projection, viewPort);
    
    Render(final);
    window.requestAnimationFrame(draw);
  }
  
  
  draw();

}
  

window.onload = setup();
