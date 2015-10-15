// draw a triangle using WebGL
// write everything out, step at a time
//
// written by gleicher on October 3, 2015

var gl;

var shaderProgram1;
var trianglePosBuffer1;
var colorBuffer1;
var theta;
var m4;
var m3;

  var angle = 0;


function draw1(Tx) {
  // now we have to program the hardware
  // we need to have our GLSL code somewhere
  // putting it in strings is bad - but it's easy so I'll
  // do it for now
  

  // now that we have programs to run on the hardware, we can 
  // make our triangle

  // let's define the vertex positions
   


  //gl.clearColor(0.0, 0.0, 0.0, 1.0);
    //gl.enable(gl.DEPTH_TEST);
    //gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

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

    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer1);
    gl.vertexAttribPointer(shaderProgram1.inColor, colorBuffer1.itemSize, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, trianglePosBuffer1);
    gl.vertexAttribPointer(shaderProgram1.vertexPositionAttribute, trianglePosBuffer1.itemSize, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, trianglePosBuffer1.numItems);
  
}
function init() {
  "use strict";

  // first we need to get the canvas and make an OpenGL context
  // in practice, you need to do error checking
  var canvas = document.getElementById("myCanvas");
  gl = canvas.getContext("webgl");
  m4 = twgl.m4;


  angle = 0;
  
  var cameraY = document.getElementById('CameraYSlider');
  cameraY.value = 28;
  
  var cameraZ = document.getElementById('CameraZSlider');
  cameraZ.value = 0;
  
  var proView = document.getElementById('ProView');
  proView.value = 0;
  


  var vertexSource = ""+
    "attribute vec3 pos;" +
    "attribute vec3 inColor;" +
    "varying vec3 outColor;" +
    "uniform mat4 transf;" +
    "void main(void) {" + 
    "  gl_Position = transf * vec4(pos, 1.0);" +
    "  outColor = inColor;" +
    "}";
  var fragmentSource = "" +
    "precision highp float;" + 
    "varying vec3 outColor;" +
    "void main(void) {" +
    "  gl_FragColor = vec4(outColor, 1.0);" +
    "}";
  
  // now we need to make those programs into
  // "Shader Objects" - by running the compiler
  // watch the steps:
  //   create an object
  //   attach the source code
  //   run the compiler
  //   check for errors
  
  // first compile the vertex shader
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

  // this gives us access to the matrix uniform
  shaderProgram1.transf = gl.getUniformLocation(shaderProgram1,"transf");

  var vertexPos = [];

    vertexPos = vertexPos.concat([100.0, 100.0, 100.0]);
    vertexPos = vertexPos.concat([200.0, 200.0, 100.0]);
    vertexPos = vertexPos.concat([100.0, 300.0, 100.0]);
  
  // //   //addTriangleToList(f2_1, f1_1, f3_1, "#FF00FF", T

   vertexPos = vertexPos.concat([100.0, 100.0, 100.0]);
   vertexPos = vertexPos.concat([300.0, 100.0, 100.0]);
   vertexPos = vertexPos.concat([200.0, 200.0, 100.0]);
    
  //   //addTriangleToList(f2_2, f1_2, f3_2, "#FF00FF", Tx);

    vertexPos = vertexPos.concat([300.0, 100.0, 100.0]);
    vertexPos = vertexPos.concat([300.0, 300.0, 100.0]);
    vertexPos = vertexPos.concat([200.0, 200.0, 100.0]);
    
  //  // addTriangleToList(f2_3, f1_3, f3_3, "#FF00FF", Tx); 

    vertexPos = vertexPos.concat([200.0, 200.0, 100.0]);
    vertexPos = vertexPos.concat([300.0, 300.0, 100.0]);
    vertexPos = vertexPos.concat([100.0, 300.0, 100.0]);
    
  //  // addTriangleToList(f2_4, f1_4, f3_4, "#FF00FF", Tx);
    
    
  //   //face2

    vertexPos = vertexPos.concat( [100.0, 100.0, 300.0]);
    vertexPos = vertexPos.concat([200.0, 200.0, 300.0]);
    vertexPos = vertexPos.concat([100.0, 300.0, 300.0]);
    
  //  // addTriangleToList(f1_5, f2_5, f3_5, "#00FFFF", Tx);

    vertexPos = vertexPos.concat([100.0, 100.0, 300.0]);
    vertexPos = vertexPos.concat([300.0, 100.0, 300.0]);
    vertexPos = vertexPos.concat([200.0, 200.0, 300.0]);
    
  //  // addTriangleToList(f1_6, f2_6, f3_6, "#00FFFF", Tx);
    
    vertexPos = vertexPos.concat([300.0, 100.0, 300.0]);
    vertexPos = vertexPos.concat([300.0, 300.0, 300.0]);
    vertexPos = vertexPos.concat([200.0, 200.0, 300.0]);
    
  //   //addTriangleToList(f1, f2, f3, "#00FFFF", Tx);

    vertexPos = vertexPos.concat([200.0, 200.0, 300.0]);
    vertexPos = vertexPos.concat([300.0, 300.0, 300.0]);
    vertexPos = vertexPos.concat([100.0, 300.0, 300.0]);
    
  // //  addTriangleToList(f1, f2, f3, "#00FFFF", Tx);
    
  //   //face3

    vertexPos = vertexPos.concat([100.0, 100.0, 300.0]);
    vertexPos = vertexPos.concat([300.0, 100.0, 300.0]);
    vertexPos = vertexPos.concat([200.0, 100.0, 200.0]);
    
  //  // addTriangleToList(f2, f1, f3, "#00FFFF", Tx);

    vertexPos = vertexPos.concat([300.0, 100.0, 300.0]);
    vertexPos = vertexPos.concat([300.0, 100.0, 100.0]);
    vertexPos = vertexPos.concat([200.0, 100.0, 200.0]);
    
  //  // addTriangleToList(f2, f1, f3, "#00FFFF", Tx);

    vertexPos = vertexPos.concat([200.0, 100.0, 200.0]);
    vertexPos = vertexPos.concat([300.0, 100.0, 100.0]);
    vertexPos = vertexPos.concat([100.0, 100.0, 100.0]);
  //  // addTriangleToList(f2, f1, f3, "#00FFFF", Tx);
    

    vertexPos = vertexPos.concat([100.0, 100.0, 100.0]);
    vertexPos = vertexPos.concat([100.0, 100.0, 300.0]);
    vertexPos = vertexPos.concat([200.0, 100.0, 200.0]);
    
  //  // addTriangleToList(f2, f1, f3, "#00FFFF", Tx);
    
  //   //face4

    vertexPos = vertexPos.concat([100.0, 300.0, 300.0]);
    vertexPos = vertexPos.concat([199.5, 300.0, 200.0]);
    vertexPos = vertexPos.concat([99.0, 300.0, 100.0]);
    
  //  // addTriangleToList(f1, f2, f3, "#00FFFF", Tx);

    vertexPos = vertexPos.concat([100.0, 300.0, 300.0]);
    vertexPos = vertexPos.concat([300.0, 300.0, 300.0]);
    vertexPos = vertexPos.concat([200.0, 300.0, 200.0]);
    
  //   //addTriangleToList(f1, f2, f3, "#00FFFF", Tx);
 
    vertexPos = vertexPos.concat([300.0, 300.0, 300.0]);
    vertexPos = vertexPos.concat([300.0, 300.0, 100.0]);
    vertexPos = vertexPos.concat([200.0, 300.0, 200.0]);
  //  // addTriangleToList(f1, f2, f3, "#00FFFF", Tx);
 
    vertexPos = vertexPos.concat([200.0, 300.0, 200.0]);
    vertexPos = vertexPos.concat([300.0, 300.0, 100.0]);
    vertexPos = vertexPos.concat([100.0, 300.0, 100.0]);
    
  //   console.log(m4.transformPoint(Tx, [100, 300, 100]));

   // addTriangleToList(f1, f2, f3, "#00FFFF", Tx);

  // var vertexPos = [
  //        100.0,  100.0,  100.0,
  //        200.0,  200.0,  100.0,
  //        100.0,  300.0,  100.0,
  //        100.0,  100.0,  100.0,
  //        300.0,  100.0,  100.0,
  //        200.0,  200.0,  100.0,
  //  ];  

  //console.log(vertexPos);

  
  var vertexColors = [
    1.0, 1.0, 0.0,
    1.0, 1.0, 0.0,
    1.0, 1.0, 0.0,
    1.0, 0.0, 1.0,    
    1.0, 0.0, 1.0,    
    1.0, 0.0, 1.0,
    1.0, 1.0, 0.0,
    1.0, 1.0, 0.0,
    1.0, 1.0, 0.0,
    1.0, 0.0, 1.0,    
    1.0, 0.0, 1.0,    
    1.0, 0.0, 1.0,
    1.0, 1.0, 0.0,
    1.0, 1.0, 0.0,
    1.0, 1.0, 0.0,
    1.0, 0.0, 1.0,    
    1.0, 0.0, 1.0,    
    1.0, 0.0, 1.0,
    1.0, 1.0, 0.0,
    1.0, 1.0, 0.0,
    1.0, 1.0, 0.0,
    1.0, 0.0, 1.0,    
    1.0, 0.0, 1.0,    
    1.0, 0.0, 1.0,
    1.0, 1.0, 0.0,
    1.0, 1.0, 0.0,
    1.0, 1.0, 0.0,
    1.0, 0.0, 1.0,    
    1.0, 0.0, 1.0,    
    1.0, 0.0, 1.0,
    1.0, 1.0, 0.0,
    1.0, 1.0, 0.0,
    1.0, 1.0, 0.0,
    1.0, 0.0, 1.0,    
    1.0, 0.0, 1.0,    
    1.0, 0.0, 1.0,
    1.0, 1.0, 0.0,
    1.0, 1.0, 0.0,
    1.0, 1.0, 0.0,
    1.0, 0.0, 1.0,    
    1.0, 0.0, 1.0,    
    1.0, 0.0, 1.0,
    1.0, 1.0, 0.0,
    1.0, 1.0, 0.0,
    1.0, 1.0, 0.0,
    1.0, 0.0, 1.0,    
    1.0, 0.0, 1.0,    
    1.0, 0.0, 1.0   
    ];
  // we need to put the vertices into a buffer so we can
  // block transfer them to the graphics hardware
  trianglePosBuffer1 = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, trianglePosBuffer1);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPos), gl.STATIC_DRAW);
    trianglePosBuffer1.itemSize = 3;
    trianglePosBuffer1.numItems = 48;

  // a buffer for colors
  colorBuffer1 = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer1);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexColors), gl.STATIC_DRAW);
    colorBuffer1.itemSize = 3;
    colorBuffer1.numItems = 48;
    gl.viewport(0, 0, 500, 500);

    
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
    var projection =  m4.ortho(-100,400,-100,400,-100,400);
    var v = m4.multiply(view, projection);

    draw1(v);
    // first, let's clear the screen
    
    theta += 0.01;
    window.requestAnimationFrame(draw);
  }
  draw();
}


window.onload = init();

  