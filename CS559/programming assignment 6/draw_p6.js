// draw a triangle using WebGL
// write everything out, step at a time
//
// written by gleicher on October 3, 2015

var gl;

var shaderProgram1;
var trianglePosBuffer1;
var colorBuffer1;
var normalBuffer1;
var shaderProgram2;
var trianglePosBuffer2;

var normalBuffer2;
var theta;
var m4;
var m3;

  var angle = 0;


function draw1(Tx, TxNormal) {

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // now we draw the triangle(s)
    // we tell GL what program to use, and what memory block
    // to use for the data, and that the data goes to the pos
    // attribute
    gl.useProgram(shaderProgram1);      
  
    // var mytrans = [Math.cos(theta),Math.sin(theta),0,0,
    //                -Math.sin(theta),Math.cos(theta),0,0,
    //                0,0,1,0, 0,0,0,1]; 

    var mytrans = Tx;
    gl.uniformMatrix4fv(shaderProgram1.transf,false,mytrans);
    gl.uniformMatrix4fv(shaderProgram1.cameraMat,false,TxNormal);

    
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer1);
    gl.vertexAttribPointer(shaderProgram1.inNormal, normalBuffer1.itemSize, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer1);
    gl.vertexAttribPointer(shaderProgram1.inColor, colorBuffer1.itemSize, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, trianglePosBuffer1);
    gl.vertexAttribPointer(shaderProgram1.vertexPositionAttribute, trianglePosBuffer1.itemSize, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES , 0, trianglePosBuffer1.numItems);
  
}

function draw2(Tx, TxNormal) {

  
    gl.enable(gl.DEPTH_TEST);
    
    gl.useProgram(shaderProgram2);      
  
    var mytrans = Tx;
    gl.uniformMatrix4fv(shaderProgram2.transf,false,mytrans);
    gl.uniformMatrix4fv(shaderProgram2.cameraMat,false,TxNormal);

    
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer2);
    gl.vertexAttribPointer(shaderProgram2.inNormal, normalBuffer2.itemSize, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer1);
    gl.vertexAttribPointer(shaderProgram2.inColor, colorBuffer1.itemSize, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, trianglePosBuffer2);
    gl.vertexAttribPointer(shaderProgram2.vertexPositionAttribute, trianglePosBuffer2.itemSize, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES , 0, trianglePosBuffer2.numItems);
  
}
function init() {
  "use strict";

  // first we need to get the canvas and make an OpenGL context
  // in practice, you need to do error checking
  var canvas = document.getElementById("myCanvas");
  gl = canvas.getContext("webgl");
  m4 = twgl.m4;
  var m3 = twgl.v3;


  angle = 0;
  
  var cameraY = document.getElementById('CameraYSlider');
  cameraY.value = 28;
  
  var cameraZ = document.getElementById('CameraZSlider');
  cameraZ.value = 0;
  
  var proView = document.getElementById('ProView');
  proView.value = 0;
  

  // shader1
  var vertexSource = ""+
    "attribute vec3 pos;" +
    "attribute vec3 inColor;" +
    "attribute vec3 inNormal;" + 
    "varying vec3 outColor;" +
    "varying vec3 fNormal;" +
    "uniform mat4 transf;" +
    "uniform mat4 cameraMat;" +
    "void main(void) {" + 
    "  gl_Position = transf * vec4(pos, 1.0);" +
    "  vec4 temp = normalize(cameraMat * vec4(inNormal, 1.0));" +
    "  fNormal = temp.xyz;" +
    "  outColor = inColor;" +
    "}";

  var fragmentSource = "" +
    "precision highp float;" + 
    "varying vec3 outColor;" +
    "varying vec3 fNormal;" + 
    "void main(void) {" +
    "vec3 dir = vec3(00.0,000.0,100.0);" +
    "float diffuse = .5 + dot(fNormal,dir);" +
    "gl_FragColor = vec4(diffuse * outColor, 1.0);" +
    "}";
  
  // shader 2

  var vertexSource2 = ""+
    "attribute vec3 pos;" +
    "attribute vec3 inColor;" +
    "attribute vec3 inNormal;" + 
    "varying vec3 outColor;" +
    "varying vec3 fNormal;" +
    "uniform mat4 transf;" +
    "uniform mat4 cameraMat;" +
    "void main(void) {" + 
    "  gl_Position = transf * vec4(pos, 1.0);" +
    "  vec4 temp = normalize(cameraMat * vec4(inNormal, 1.0));" +
    "  fNormal = temp.xyz;" +
    "  outColor = inNormal;" +
    "}";

  var fragmentSource2 = "" +
    "precision highp float;" + 
    "varying vec3 outColor;" +
    "varying vec3 fNormal;" + 
    "void main(void) {" +
    "vec3 dir = vec3(00.0,000.0,100.0);" +
    "float diffuse = .5 + dot(fNormal,dir);" +
    "gl_FragColor = vec4(diffuse * outColor, 1.0);" +
    "}";
  //init shader 1
  var vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader,vertexSource);
  gl.compileShader(vertexShader);
  
  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
          alert(gl.getShaderInfoLog(vertexShader1));
          return null;
      }
  
  // now compile the fragment shader
  var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader,fragmentSource);
  gl.compileShader(fragmentShader);
  
  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
          alert(gl.getShaderInfoLog(fragmentShader));
          return null;
      }

  // OK, we have a pair of shaders, we need to put them together
  // into a "shader program" object
  shaderProgram1 = gl.createProgram();
  gl.attachShader(shaderProgram1, vertexShader);
  gl.attachShader(shaderProgram1, fragmentShader);
  gl.linkProgram(shaderProgram1);

  if (!gl.getProgramParameter(shaderProgram1, gl.LINK_STATUS)) {
    alert("Could not initialise shaders");
  }

  // with the vertex shader, we need to pass it positions
  // as an attribute - so set up that communication
    shaderProgram1.vertexPositionAttribute = gl.getAttribLocation(shaderProgram1, "pos");
    gl.enableVertexAttribArray(shaderProgram1.vertexPositionAttribute);

    shaderProgram1.inColor = gl.getAttribLocation(shaderProgram1, "inColor");
    gl.enableVertexAttribArray(shaderProgram1.inColor);

    shaderProgram1.inNormal = gl.getAttribLocation(shaderProgram1, "inNormal");
    gl.enableVertexAttribArray(shaderProgram1.inNormal);

  // this gives us access to the matrix uniform
  shaderProgram1.transf = gl.getUniformLocation(shaderProgram1,"transf");
  shaderProgram1.cameraMat = gl.getUniformLocation(shaderProgram1,"cameraMat");


  // init shader2

  var vertexShader2 = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader2,vertexSource2);
  gl.compileShader(vertexShader2);
  
  if (!gl.getShaderParameter(vertexShader2, gl.COMPILE_STATUS)) {
          alert(gl.getShaderInfoLog(vertexShader2));
          return null;
      }
  
  // now compile the fragment shader
  var fragmentShader2 = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader2,fragmentSource2);
  gl.compileShader(fragmentShader2);
  
  if (!gl.getShaderParameter(fragmentShader2, gl.COMPILE_STATUS)) {
          alert(gl.getShaderInfoLog(fragmentShader2));
          return null;
      }

  // OK, we have a pair of shaders, we need to put them together
  // into a "shader program" object
  shaderProgram2 = gl.createProgram();
  gl.attachShader(shaderProgram2, vertexShader2);
  gl.attachShader(shaderProgram2, fragmentShader2);
  gl.linkProgram(shaderProgram2);

  if (!gl.getProgramParameter(shaderProgram2, gl.LINK_STATUS)) {
    alert("Could not initialise shaders");
  }

  // with the vertex shader, we need to pass it positions
  // as an attribute - so set up that communication
    shaderProgram2.vertexPositionAttribute = gl.getAttribLocation(shaderProgram2, "pos");
    gl.enableVertexAttribArray(shaderProgram2.vertexPositionAttribute);

    shaderProgram2.inColor = gl.getAttribLocation(shaderProgram2, "inColor");
    gl.enableVertexAttribArray(shaderProgram2.inColor);

    shaderProgram2.inNormal = gl.getAttribLocation(shaderProgram2, "inNormal");
    gl.enableVertexAttribArray(shaderProgram2.inNormal);

  // this gives us access to the matrix uniform
  shaderProgram2.transf = gl.getUniformLocation(shaderProgram2,"transf");
  shaderProgram2.cameraMat = gl.getUniformLocation(shaderProgram2,"cameraMat");



  var f1, f2, f3;
  var vertexPos = [];
  var normalPos = [];
  var vertexPos1 = [];
  var normalPos1 = [];
  var cross1, cross2, normal;

    f1 = [100, 100, 100];
    f2 = [200, 200, 100];
    f3 = [100, 300, 100];
    
    cross1 = m3.subtract(f2, f1);
    cross2 = m3.subtract(f3,f2);
    normal = m3.cross(cross1, cross2);
    normal = m3.normalize(normal);

    normalPos = normalPos.concat(normal[0]);
    normalPos = normalPos.concat(normal[1]);
    normalPos = normalPos.concat(normal[2]);

    normalPos = normalPos.concat(normal[0]);
    normalPos = normalPos.concat(normal[1]);
    normalPos = normalPos.concat(normal[2]);


    normalPos = normalPos.concat(normal[0]);
    normalPos = normalPos.concat(normal[1]);
    normalPos = normalPos.concat(normal[2]);

    vertexPos = vertexPos.concat(f1);
    vertexPos = vertexPos.concat(f2);
    vertexPos = vertexPos.concat(f3);
    
    
    
    f1 = [100, 100, 100];
    f2 = [300, 100, 100];
    f3= [200, 200, 100];

    cross1 = m3.subtract(f2, f1);
    cross2 = m3.subtract(f3,f2);
    normal = m3.cross(cross1, cross2);
    normal = m3.normalize(normal);

    normalPos = normalPos.concat(normal[0]);
    normalPos = normalPos.concat(normal[1]);
    normalPos = normalPos.concat(normal[2]);

    normalPos = normalPos.concat(normal[0]);
    normalPos = normalPos.concat(normal[1]);
    normalPos = normalPos.concat(normal[2]);

    normalPos = normalPos.concat(normal[0]);
    normalPos = normalPos.concat(normal[1]);
    normalPos = normalPos.concat(normal[2]);



    vertexPos = vertexPos.concat(f1);
    vertexPos = vertexPos.concat(f2);
    vertexPos = vertexPos.concat(f3);
    
    f1 = [300, 100, 100];
    f2 = [300, 300, 100];
    f3 = [200, 200, 100];

    cross1 = m3.subtract(f2, f1);
    cross2 = m3.subtract(f3,f2);
    normal = m3.cross(cross1, cross2);
    normal = m3.normalize(normal);

    normalPos = normalPos.concat(normal[0]);
    normalPos = normalPos.concat(normal[1]);
    normalPos = normalPos.concat(normal[2]);

    normalPos = normalPos.concat(normal[0]);
    normalPos = normalPos.concat(normal[1]);
    normalPos = normalPos.concat(normal[2]);

    normalPos = normalPos.concat(normal[0]);
    normalPos = normalPos.concat(normal[1]);
    normalPos = normalPos.concat(normal[2]);

    vertexPos = vertexPos.concat(f1);
    vertexPos = vertexPos.concat(f2);
    vertexPos = vertexPos.concat(f3);
    
    f1 = [200, 200, 100];
    f2 = [300, 300, 100];
    f3 = [100, 300, 100];

    cross1 = m3.subtract(f2, f1);
    cross2 = m3.subtract(f3,f2);
    normal = m3.cross(cross1, cross2);
    normal = m3.normalize(normal);

    normalPos = normalPos.concat(normal[0]);
    normalPos = normalPos.concat(normal[1]);
    normalPos = normalPos.concat(normal[2]);

    normalPos = normalPos.concat(normal[0]);
    normalPos = normalPos.concat(normal[1]);
    normalPos = normalPos.concat(normal[2]);

    normalPos = normalPos.concat(normal[0]);
    normalPos = normalPos.concat(normal[1]);
    normalPos = normalPos.concat(normal[2]);

    vertexPos = vertexPos.concat(f1);
    vertexPos = vertexPos.concat(f2);
    vertexPos = vertexPos.concat(f3);
    
    //face2
    f1 = [100, 100, 300];
    f2 = [200, 200, 300];
    f3 = [100, 300, 300];

    cross1 = m3.subtract(f2, f1);
    cross2 = m3.subtract(f3,f2);
    normal = m3.cross(cross1, cross2);
    normal = m3.normalize(normal);

    normalPos = normalPos.concat(normal[0]);
    normalPos = normalPos.concat(normal[1]);
    normalPos = normalPos.concat(normal[2]);
    normalPos = normalPos.concat(normal[0]);
    normalPos = normalPos.concat(normal[1]);
    normalPos = normalPos.concat(normal[2]);
    normalPos = normalPos.concat(normal[0]);
    normalPos = normalPos.concat(normal[1]);
    normalPos = normalPos.concat(normal[2]);

    vertexPos = vertexPos.concat(f1);
    vertexPos = vertexPos.concat(f2);
    vertexPos = vertexPos.concat(f3);
    
    f1 = [100, 100, 300];
    f2 = [300, 100, 300];
    f3 = [200, 200, 300];

    cross1 = m3.subtract(f2, f1);
    cross2 = m3.subtract(f3,f2);
    normal = m3.cross(cross1, cross2);
    normal = m3.normalize(normal);

    normalPos = normalPos.concat(normal[0]);
    normalPos = normalPos.concat(normal[1]);
    normalPos = normalPos.concat(normal[2]);
    normalPos = normalPos.concat(normal[0]);
    normalPos = normalPos.concat(normal[1]);
    normalPos = normalPos.concat(normal[2]);
    normalPos = normalPos.concat(normal[0]);
    normalPos = normalPos.concat(normal[1]);
    normalPos = normalPos.concat(normal[2]);


    vertexPos = vertexPos.concat(f1);
    vertexPos = vertexPos.concat(f2);
    vertexPos = vertexPos.concat(f3);
    
    f1 = [300, 100, 300];
    f2 = [300,300,300];
    f3 = [200,200,300];

    cross1 = m3.subtract(f2, f1);
    cross2 = m3.subtract(f3,f2);
    normal = m3.cross(cross1, cross2);
    normal = m3.normalize(normal);

    normalPos = normalPos.concat(normal[0]);
    normalPos = normalPos.concat(normal[1]);
    normalPos = normalPos.concat(normal[2]);
    normalPos = normalPos.concat(normal[0]);
    normalPos = normalPos.concat(normal[1]);
    normalPos = normalPos.concat(normal[2]);
    normalPos = normalPos.concat(normal[0]);
    normalPos = normalPos.concat(normal[1]);
    normalPos = normalPos.concat(normal[2]);

    vertexPos = vertexPos.concat(f1);
    vertexPos = vertexPos.concat(f2);
    vertexPos = vertexPos.concat(f3);

    f1 = [200,200,300];
    f2 = [300,300,300];
    f3 = [100,300,300];

    cross1 = m3.subtract(f2, f1);
    cross2 = m3.subtract(f3,f2);
    normal = m3.cross(cross1, cross2);
    normal = m3.normalize(normal);

    normalPos = normalPos.concat(normal[0]);
    normalPos = normalPos.concat(normal[1]);
    normalPos = normalPos.concat(normal[2]);
    normalPos = normalPos.concat(normal[0]);
    normalPos = normalPos.concat(normal[1]);
    normalPos = normalPos.concat(normal[2]);
    normalPos = normalPos.concat(normal[0]);
    normalPos = normalPos.concat(normal[1]);
    normalPos = normalPos.concat(normal[2]);


    vertexPos = vertexPos.concat(f1);
    vertexPos = vertexPos.concat(f2);
    vertexPos = vertexPos.concat(f3);
    
    //face3
    
    f1 = [100,100,300];
    f2 = [300,100,300];
    f3 = [200,100,200];

    cross1 = m3.subtract(f2, f1);
    cross2 = m3.subtract(f3,f2);
    normal = m3.cross(cross1, cross2);
    normal = m3.normalize(normal);

    normalPos = normalPos.concat(normal[0]);
    normalPos = normalPos.concat(normal[1]);
    normalPos = normalPos.concat(normal[2]);
    normalPos = normalPos.concat(normal[0]);
    normalPos = normalPos.concat(normal[1]);
    normalPos = normalPos.concat(normal[2]);
    normalPos = normalPos.concat(normal[0]);
    normalPos = normalPos.concat(normal[1]);
    normalPos = normalPos.concat(normal[2]);


    vertexPos = vertexPos.concat(f1);
    vertexPos = vertexPos.concat(f2);
    vertexPos = vertexPos.concat(f3);
    
    f1 = [300,100,300];
    f2 = [300,100,100];
    f3 = [200,100,200];

    cross1 = m3.subtract(f2, f1);
    cross2 = m3.subtract(f3,f2);
    normal = m3.cross(cross1, cross2);
    normal = m3.normalize(normal);

    normalPos = normalPos.concat(normal[0]);
    normalPos = normalPos.concat(normal[1]);
    normalPos = normalPos.concat(normal[2]);
    normalPos = normalPos.concat(normal[0]);
    normalPos = normalPos.concat(normal[1]);
    normalPos = normalPos.concat(normal[2]);
    normalPos = normalPos.concat(normal[0]);
    normalPos = normalPos.concat(normal[1]);
    normalPos = normalPos.concat(normal[2]);

    vertexPos = vertexPos.concat(f1);
    vertexPos = vertexPos.concat(f2);
    vertexPos = vertexPos.concat(f3);
    
    f1 = [200,100,200];
    f2 = [300,100,100];
    f3 = [100,100,100];

    cross1 = m3.subtract(f2, f1);
    cross2 = m3.subtract(f3,f2);
    normal = m3.cross(cross1, cross2);
    normal = m3.normalize(normal);

    normalPos = normalPos.concat(normal[0]);
    normalPos = normalPos.concat(normal[1]);
    normalPos = normalPos.concat(normal[2]);
    normalPos = normalPos.concat(normal[0]);
    normalPos = normalPos.concat(normal[1]);
    normalPos = normalPos.concat(normal[2]);
    normalPos = normalPos.concat(normal[0]);
    normalPos = normalPos.concat(normal[1]);
    normalPos = normalPos.concat(normal[2]);

    vertexPos = vertexPos.concat(f1);
    vertexPos = vertexPos.concat(f2);
    vertexPos = vertexPos.concat(f3);
    
    f1 = [100,100,100];
    f2 = [100,100,300];
    f3 = [200,100,200];

    cross1 = m3.subtract(f2, f1);
    cross2 = m3.subtract(f3,f2);
    normal = m3.cross(cross1, cross2);
    normal = m3.normalize(normal);

    normalPos = normalPos.concat(normal[0]);
    normalPos = normalPos.concat(normal[1]);
    normalPos = normalPos.concat(normal[2]);
    normalPos = normalPos.concat(normal[0]);
    normalPos = normalPos.concat(normal[1]);
    normalPos = normalPos.concat(normal[2]);
    normalPos = normalPos.concat(normal[0]);
    normalPos = normalPos.concat(normal[1]);
    normalPos = normalPos.concat(normal[2]);

    vertexPos = vertexPos.concat(f1);
    vertexPos = vertexPos.concat(f2);
    vertexPos = vertexPos.concat(f3);
    
    
    //face4
    f1 = [100,300,300];
    f2 = [200,300,200];
    f3 = [100,300,100];

    cross1 = m3.subtract(f2, f1);
    cross2 = m3.subtract(f3,f2);
    normal = m3.cross(cross1, cross2);
    normal = m3.normalize(normal);

    normalPos = normalPos.concat(normal[0]);
    normalPos = normalPos.concat(normal[1]);
    normalPos = normalPos.concat(normal[2]);
    normalPos = normalPos.concat(normal[0]);
    normalPos = normalPos.concat(normal[1]);
    normalPos = normalPos.concat(normal[2]);
    normalPos = normalPos.concat(normal[0]);
    normalPos = normalPos.concat(normal[1]);
    normalPos = normalPos.concat(normal[2]);


    vertexPos = vertexPos.concat(f1);
    vertexPos = vertexPos.concat(f2);
    vertexPos = vertexPos.concat(f3);
    
    f1 = [100,300,300];
    f2 = [300,300,300];
    f3 = [200,300,200];

    cross1 = m3.subtract(f2, f1);
    cross2 = m3.subtract(f3,f2);
    normal = m3.cross(cross1, cross2);
    normal = m3.normalize(normal);

    normalPos = normalPos.concat(normal[0]);
    normalPos = normalPos.concat(normal[1]);
    normalPos = normalPos.concat(normal[2]);
    normalPos = normalPos.concat(normal[0]);
    normalPos = normalPos.concat(normal[1]);
    normalPos = normalPos.concat(normal[2]);
    normalPos = normalPos.concat(normal[0]);
    normalPos = normalPos.concat(normal[1]);
    normalPos = normalPos.concat(normal[2]);


    vertexPos = vertexPos.concat(f1);
    vertexPos = vertexPos.concat(f2);
    vertexPos = vertexPos.concat(f3);
    
    
    f1 = [300,300,300];
    f2 = [300,300,100];
    f3 = [200,300,200];

    cross1 = m3.subtract(f2, f1);
    cross2 = m3.subtract(f3,f2);
    normal = m3.cross(cross1, cross2);
    normal = m3.normalize(normal);

    normalPos = normalPos.concat(normal[0]);
    normalPos = normalPos.concat(normal[1]);
    normalPos = normalPos.concat(normal[2]);
    normalPos = normalPos.concat(normal[0]);
    normalPos = normalPos.concat(normal[1]);
    normalPos = normalPos.concat(normal[2]);
    normalPos = normalPos.concat(normal[0]);
    normalPos = normalPos.concat(normal[1]);
    normalPos = normalPos.concat(normal[2]);

    vertexPos = vertexPos.concat(f1);
    vertexPos = vertexPos.concat(f2);
    vertexPos = vertexPos.concat(f3);
    
    
    f1 = [200,300,200];
    f2 = [300,300,100];
    f3 = [100,300,100];

    cross1 = m3.subtract(f2, f1);
    cross2 = m3.subtract(f3,f2);
    normal = m3.cross(cross1, cross2);
    normal = m3.normalize(normal);

    normalPos = normalPos.concat(normal[0]);
    normalPos = normalPos.concat(normal[1]);
    normalPos = normalPos.concat(normal[2]);
    normalPos = normalPos.concat(normal[0]);
    normalPos = normalPos.concat(normal[1]);
    normalPos = normalPos.concat(normal[2]);
    normalPos = normalPos.concat(normal[0]);
    normalPos = normalPos.concat(normal[1]);
    normalPos = normalPos.concat(normal[2]);
    vertexPos = vertexPos.concat(f1);
    vertexPos = vertexPos.concat(f2);
    vertexPos = vertexPos.concat(f3);


    // end of object1


    f1 = [180, 180, 180];
    f2 = [200, 200, 180];
    f3 = [180, 220, 180];
    
    cross1 = m3.subtract(f2, f1);
    cross2 = m3.subtract(f3,f2);
    normal = m3.cross(cross1, cross2);
    normal = m3.normalize(normal);

    normalPos1 = normalPos1.concat(normal[0]);
    normalPos1 = normalPos1.concat(normal[1]);
    normalPos1 = normalPos1.concat(normal[2]);

    normalPos1 = normalPos1.concat(normal[0]);
    normalPos1 = normalPos1.concat(normal[1]);
    normalPos1 = normalPos1.concat(normal[2]);


    normalPos1 = normalPos1.concat(normal[0]);
    normalPos1 = normalPos1.concat(normal[1]);
    normalPos1 = normalPos1.concat(normal[2]);

    vertexPos1 = vertexPos1.concat(f1);
    vertexPos1 = vertexPos1.concat(f2);
    vertexPos1 = vertexPos1.concat(f3);
    
    
    
    f1 = [180, 180, 180];
    f2 = [220, 180, 180];
    f3= [200, 200, 180];

    cross1 = m3.subtract(f2, f1);
    cross2 = m3.subtract(f3,f2);
    normal = m3.cross(cross1, cross2);
    normal = m3.normalize(normal);

    normalPos1 = normalPos1.concat(normal[0]);
    normalPos1 = normalPos1.concat(normal[1]);
    normalPos1 = normalPos1.concat(normal[2]);

    normalPos1 = normalPos1.concat(normal[0]);
    normalPos1 = normalPos1.concat(normal[1]);
    normalPos1 = normalPos1.concat(normal[2]);

    normalPos1 = normalPos1.concat(normal[0]);
    normalPos1 = normalPos1.concat(normal[1]);
    normalPos1 = normalPos1.concat(normal[2]);



    vertexPos1 = vertexPos1.concat(f1);
    vertexPos1 = vertexPos1.concat(f2);
    vertexPos1 = vertexPos1.concat(f3);
    
    f1 = [220, 180, 180];
    f2 = [220, 220, 180];
    f3 = [200, 200, 180];

    cross1 = m3.subtract(f2, f1);
    cross2 = m3.subtract(f3,f2);
    normal = m3.cross(cross1, cross2);
    normal = m3.normalize(normal);

    normalPos1 = normalPos1.concat(normal[0]);
    normalPos1 = normalPos1.concat(normal[1]);
    normalPos1 = normalPos1.concat(normal[2]);

    normalPos1 = normalPos1.concat(normal[0]);
    normalPos1 = normalPos1.concat(normal[1]);
    normalPos1 = normalPos1.concat(normal[2]);

    normalPos1 = normalPos1.concat(normal[0]);
    normalPos1 = normalPos1.concat(normal[1]);
    normalPos1 = normalPos1.concat(normal[2]);

    vertexPos1 = vertexPos1.concat(f1);
    vertexPos1 = vertexPos1.concat(f2);
    vertexPos1 = vertexPos1.concat(f3);
    
    f1 = [200, 200, 180];
    f2 = [220, 220, 180];
    f3 = [180, 220, 180];

    cross1 = m3.subtract(f2, f1);
    cross2 = m3.subtract(f3,f2);
    normal = m3.cross(cross1, cross2);
    normal = m3.normalize(normal);

    normalPos1 = normalPos1.concat(normal[0]);
    normalPos1 = normalPos1.concat(normal[1]);
    normalPos1 = normalPos1.concat(normal[2]);

    normalPos1 = normalPos1.concat(normal[0]);
    normalPos1 = normalPos1.concat(normal[1]);
    normalPos1 = normalPos1.concat(normal[2]);

    normalPos1 = normalPos1.concat(normal[0]);
    normalPos1 = normalPos1.concat(normal[1]);
    normalPos1 = normalPos1.concat(normal[2]);

    vertexPos1 = vertexPos1.concat(f1);
    vertexPos1 = vertexPos1.concat(f2);
    vertexPos1 = vertexPos1.concat(f3);
    
    //face2
    f1 = [180, 180, 220];
    f2 = [200, 200, 220];
    f3 = [180, 220, 220];

    cross1 = m3.subtract(f2, f1);
    cross2 = m3.subtract(f3,f2);
    normal = m3.cross(cross1, cross2);
    normal = m3.normalize(normal);

    normalPos1 = normalPos1.concat(normal[0]);
    normalPos1 = normalPos1.concat(normal[1]);
    normalPos1 = normalPos1.concat(normal[2]);
    normalPos1 = normalPos1.concat(normal[0]);
    normalPos1 = normalPos1.concat(normal[1]);
    normalPos1 = normalPos1.concat(normal[2]);
    normalPos1 = normalPos1.concat(normal[0]);
    normalPos1 = normalPos1.concat(normal[1]);
    normalPos1 = normalPos1.concat(normal[2]);

    vertexPos1 = vertexPos1.concat(f1);
    vertexPos1 = vertexPos1.concat(f2);
    vertexPos1 = vertexPos1.concat(f3);
    
    f1 = [180, 180, 220];
    f2 = [220, 180, 220];
    f3 = [200, 200, 220];

    cross1 = m3.subtract(f2, f1);
    cross2 = m3.subtract(f3,f2);
    normal = m3.cross(cross1, cross2);
    normal = m3.normalize(normal);

    normalPos1 = normalPos1.concat(normal[0]);
    normalPos1 = normalPos1.concat(normal[1]);
    normalPos1 = normalPos1.concat(normal[2]);
    normalPos1 = normalPos1.concat(normal[0]);
    normalPos1 = normalPos1.concat(normal[1]);
    normalPos1 = normalPos1.concat(normal[2]);
    normalPos1 = normalPos1.concat(normal[0]);
    normalPos1 = normalPos1.concat(normal[1]);
    normalPos1 = normalPos1.concat(normal[2]);


    vertexPos1 = vertexPos1.concat(f1);
    vertexPos1 = vertexPos1.concat(f2);
    vertexPos1 = vertexPos1.concat(f3);
    
    f1 = [220, 180, 220];
    f2 = [220,220,220];
    f3 = [200,200,220];

    cross1 = m3.subtract(f2, f1);
    cross2 = m3.subtract(f3,f2);
    normal = m3.cross(cross1, cross2);
    normal = m3.normalize(normal);

    normalPos1 = normalPos1.concat(normal[0]);
    normalPos1 = normalPos1.concat(normal[1]);
    normalPos1 = normalPos1.concat(normal[2]);
    normalPos1 = normalPos1.concat(normal[0]);
    normalPos1 = normalPos1.concat(normal[1]);
    normalPos1 = normalPos1.concat(normal[2]);
    normalPos1 = normalPos1.concat(normal[0]);
    normalPos1 = normalPos1.concat(normal[1]);
    normalPos1 = normalPos1.concat(normal[2]);

    vertexPos1 = vertexPos1.concat(f1);
    vertexPos1 = vertexPos1.concat(f2);
    vertexPos1 = vertexPos1.concat(f3);

    f1 = [200,200,220];
    f2 = [220,220,220];
    f3 = [180,220,220];

    cross1 = m3.subtract(f2, f1);
    cross2 = m3.subtract(f3,f2);
    normal = m3.cross(cross1, cross2);
    normal = m3.normalize(normal);

    normalPos1 = normalPos1.concat(normal[0]);
    normalPos1 = normalPos1.concat(normal[1]);
    normalPos1 = normalPos1.concat(normal[2]);
    normalPos1 = normalPos1.concat(normal[0]);
    normalPos1 = normalPos1.concat(normal[1]);
    normalPos1 = normalPos1.concat(normal[2]);
    normalPos1 = normalPos1.concat(normal[0]);
    normalPos1 = normalPos1.concat(normal[1]);
    normalPos1 = normalPos1.concat(normal[2]);


    vertexPos1 = vertexPos1.concat(f1);
    vertexPos1 = vertexPos1.concat(f2);
    vertexPos1 = vertexPos1.concat(f3);
    
    //face3
    
    f1 = [180,180,220];
    f2 = [220,180,220];
    f3 = [200,180,200];

    cross1 = m3.subtract(f2, f1);
    cross2 = m3.subtract(f3,f2);
    normal = m3.cross(cross1, cross2);
    normal = m3.normalize(normal);

    normalPos1 = normalPos1.concat(normal[0]);
    normalPos1 = normalPos1.concat(normal[1]);
    normalPos1 = normalPos1.concat(normal[2]);
    normalPos1 = normalPos1.concat(normal[0]);
    normalPos1 = normalPos1.concat(normal[1]);
    normalPos1 = normalPos1.concat(normal[2]);
    normalPos1 = normalPos1.concat(normal[0]);
    normalPos1 = normalPos1.concat(normal[1]);
    normalPos1 = normalPos1.concat(normal[2]);


    vertexPos1 = vertexPos1.concat(f1);
    vertexPos1 = vertexPos1.concat(f2);
    vertexPos1 = vertexPos1.concat(f3);
    
    f1 = [220,180,220];
    f2 = [220,180,180];
    f3 = [200,180,200];

    cross1 = m3.subtract(f2, f1);
    cross2 = m3.subtract(f3,f2);
    normal = m3.cross(cross1, cross2);
    normal = m3.normalize(normal);

    normalPos1 = normalPos1.concat(normal[0]);
    normalPos1 = normalPos1.concat(normal[1]);
    normalPos1 = normalPos1.concat(normal[2]);
    normalPos1 = normalPos1.concat(normal[0]);
    normalPos1 = normalPos1.concat(normal[1]);
    normalPos1 = normalPos1.concat(normal[2]);
    normalPos1 = normalPos1.concat(normal[0]);
    normalPos1 = normalPos1.concat(normal[1]);
    normalPos1 = normalPos1.concat(normal[2]);

    vertexPos1 = vertexPos1.concat(f1);
    vertexPos1 = vertexPos1.concat(f2);
    vertexPos1 = vertexPos1.concat(f3);
    
    f1 = [200,180,200];
    f2 = [220,180,180];
    f3 = [180,180,180];

    cross1 = m3.subtract(f2, f1);
    cross2 = m3.subtract(f3,f2);
    normal = m3.cross(cross1, cross2);
    normal = m3.normalize(normal);

    normalPos1 = normalPos1.concat(normal[0]);
    normalPos1 = normalPos1.concat(normal[1]);
    normalPos1 = normalPos1.concat(normal[2]);
    normalPos1 = normalPos1.concat(normal[0]);
    normalPos1 = normalPos1.concat(normal[1]);
    normalPos1 = normalPos1.concat(normal[2]);
    normalPos1 = normalPos1.concat(normal[0]);
    normalPos1 = normalPos1.concat(normal[1]);
    normalPos1 = normalPos1.concat(normal[2]);

    vertexPos1 = vertexPos1.concat(f1);
    vertexPos1 = vertexPos1.concat(f2);
    vertexPos1 = vertexPos1.concat(f3);
    
    f1 = [180,180,180];
    f2 = [180,180,220];
    f3 = [200,180,200];

    cross1 = m3.subtract(f2, f1);
    cross2 = m3.subtract(f3,f2);
    normal = m3.cross(cross1, cross2);
    normal = m3.normalize(normal);

    normalPos1 = normalPos1.concat(normal[0]);
    normalPos1 = normalPos1.concat(normal[1]);
    normalPos1 = normalPos1.concat(normal[2]);
    normalPos1 = normalPos1.concat(normal[0]);
    normalPos1 = normalPos1.concat(normal[1]);
    normalPos1 = normalPos1.concat(normal[2]);
    normalPos1 = normalPos1.concat(normal[0]);
    normalPos1 = normalPos1.concat(normal[1]);
    normalPos1 = normalPos1.concat(normal[2]);

    vertexPos1 = vertexPos1.concat(f1);
    vertexPos1 = vertexPos1.concat(f2);
    vertexPos1 = vertexPos1.concat(f3);
    
    
    //face4
    f1 = [180,220,220];
    f2 = [200,220,200];
    f3 = [180,220,180];

    cross1 = m3.subtract(f2, f1);
    cross2 = m3.subtract(f3,f2);
    normal = m3.cross(cross1, cross2);
    normal = m3.normalize(normal);

    normalPos1 = normalPos1.concat(normal[0]);
    normalPos1 = normalPos1.concat(normal[1]);
    normalPos1 = normalPos1.concat(normal[2]);
    normalPos1 = normalPos1.concat(normal[0]);
    normalPos1 = normalPos1.concat(normal[1]);
    normalPos1 = normalPos1.concat(normal[2]);
    normalPos1 = normalPos1.concat(normal[0]);
    normalPos1 = normalPos1.concat(normal[1]);
    normalPos1 = normalPos1.concat(normal[2]);


    vertexPos1 = vertexPos1.concat(f1);
    vertexPos1 = vertexPos1.concat(f2);
    vertexPos1 = vertexPos1.concat(f3);
    
    f1 = [180,220,220];
    f2 = [220,220,220];
    f3 = [200,220,200];

    cross1 = m3.subtract(f2, f1);
    cross2 = m3.subtract(f3,f2);
    normal = m3.cross(cross1, cross2);
    normal = m3.normalize(normal);

    normalPos1 = normalPos1.concat(normal[0]);
    normalPos1 = normalPos1.concat(normal[1]);
    normalPos1 = normalPos1.concat(normal[2]);
    normalPos1 = normalPos1.concat(normal[0]);
    normalPos1 = normalPos1.concat(normal[1]);
    normalPos1 = normalPos1.concat(normal[2]);
    normalPos1 = normalPos1.concat(normal[0]);
    normalPos1 = normalPos1.concat(normal[1]);
    normalPos1 = normalPos1.concat(normal[2]);


    vertexPos1 = vertexPos1.concat(f1);
    vertexPos1 = vertexPos1.concat(f2);
    vertexPos1 = vertexPos1.concat(f3);
    
    
    f1 = [220,220,220];
    f2 = [220,220,180];
    f3 = [200,220,200];

    cross1 = m3.subtract(f2, f1);
    cross2 = m3.subtract(f3,f2);
    normal = m3.cross(cross1, cross2);
    normal = m3.normalize(normal);

    normalPos1 = normalPos1.concat(normal[0]);
    normalPos1 = normalPos1.concat(normal[1]);
    normalPos1 = normalPos1.concat(normal[2]);
    normalPos1 = normalPos1.concat(normal[0]);
    normalPos1 = normalPos1.concat(normal[1]);
    normalPos1 = normalPos1.concat(normal[2]);
    normalPos1 = normalPos1.concat(normal[0]);
    normalPos1 = normalPos1.concat(normal[1]);
    normalPos1 = normalPos1.concat(normal[2]);

    vertexPos1 = vertexPos1.concat(f1);
    vertexPos1 = vertexPos1.concat(f2);
    vertexPos1 = vertexPos1.concat(f3);
    
    
    f1 = [200,220,200];
    f2 = [220,220,180];
    f3 = [180,220,180];

    cross1 = m3.subtract(f2, f1);
    cross2 = m3.subtract(f3,f2);
    normal = m3.cross(cross1, cross2);
    normal = m3.normalize(normal);

    normalPos1 = normalPos1.concat(normal[0]);
    normalPos1 = normalPos1.concat(normal[1]);
    normalPos1 = normalPos1.concat(normal[2]);
    normalPos1 = normalPos1.concat(normal[0]);
    normalPos1 = normalPos1.concat(normal[1]);
    normalPos1 = normalPos1.concat(normal[2]);
    normalPos1 = normalPos1.concat(normal[0]);
    normalPos1 = normalPos1.concat(normal[1]);
    normalPos1 = normalPos1.concat(normal[2]);
    vertexPos1 = vertexPos1.concat(f1);
    vertexPos1 = vertexPos1.concat(f2);
    vertexPos1 = vertexPos1.concat(f3);


    // end of object 2


  var vertexColors = [
    1.0, 0.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 0.0, 1.0,    
    0.0, 1.0, 0.0,    
    0.0, 1.0, 0.0,
     1.0, 0.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 0.0, 1.0,    
    0.0, 1.0, 0.0,    
    0.0, 1.0, 0.0,
        1.0, 0.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 0.0, 1.0,    
    0.0, 1.0, 0.0,    
    0.0, 1.0, 0.0,
        1.0, 0.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 0.0, 1.0,    
    0.0, 1.0, 0.0,    
    0.0, 1.0, 0.0,
        1.0, 0.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 0.0, 1.0,    
    0.0, 1.0, 0.0,    
    0.0, 1.0, 0.0,
        1.0, 0.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 0.0, 1.0,    
    0.0, 1.0, 0.0,    
    0.0, 1.0, 0.0,
        1.0, 0.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 0.0, 1.0,    
    0.0, 1.0, 0.0,    
    0.0, 1.0, 0.0,
        1.0, 0.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 0.0, 1.0,    
    0.0, 1.0, 0.0,    
    0.0, 1.0, 0.0 
    ];
  // we need to put the vertices into a buffer so we can
  // block transfer them to the graphics hardware
  trianglePosBuffer1 = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, trianglePosBuffer1);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPos), gl.STATIC_DRAW);
    trianglePosBuffer1.itemSize = 3;
    trianglePosBuffer1.numItems = 48;

  // create buffer for normal
  normalBuffer1 = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer1);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalPos), gl.STATIC_DRAW);
  normalBuffer1.itemSize = 3;
  normalBuffer1.numItems = 48;


  // a buffer for colors
  colorBuffer1 = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer1);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexColors), gl.STATIC_DRAW);
    colorBuffer1.itemSize = 3;
    colorBuffer1.numItems = 48;
    gl.viewport(0, 0, 500, 500);


    //second object

      trianglePosBuffer2 = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, trianglePosBuffer2);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPos1), gl.STATIC_DRAW);
    trianglePosBuffer2.itemSize = 3;
    trianglePosBuffer2.numItems = 48;

  // create buffer for normal
  normalBuffer2 = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer2);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalPos1), gl.STATIC_DRAW);
  normalBuffer2.itemSize = 3;
  normalBuffer2.numItems = 48;



    
  // this is the "draw scene" function, but since this 
  // is execute once...
  
  theta = 0.25;
  
  function draw() {


    //gl.clearRect(0, 0, canvas.width, canvas.height);
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
   

    var projection = view;;
    if(proView.value == 0) {
    projection =  m4.perspective(Math.PI/2, 1, -200, 200);
    }else {
    projection =  m4.ortho(-200,500,-200,500,-200,500);
    }
    var v = m4.multiply(view, projection);


    var f1 = m4.inverse(view);
    var matForNomal = m4.transpose(f1);

    draw1(v, matForNomal);
    draw2(v, matForNomal);
    // first, let's clear the screen
    
    theta += 0.01;
    window.requestAnimationFrame(draw);
  }
  draw();
}


window.onload = init();

  