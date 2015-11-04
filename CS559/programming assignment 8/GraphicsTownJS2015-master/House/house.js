/**
 * Created by gleicher on 10/9/15.
 */
/*
 a second example object for graphics town
 check out "simplest" first

 the cube is more complicated since it is designed to allow making many cubes

 we make a constructor function that will make instances of cubes - each one gets
 added to the grobjects list

 we need to be a little bit careful to distinguish between different kinds of initialization
 1) there are the things that can be initialized when the function is first defined
    (load time)
 2) there are things that are defined to be shared by all cubes - these need to be defined
    by the first init (assuming that we require opengl to be ready)
 3) there are things that are to be defined for each cube instance
 */
var grobjects = grobjects || [];

// allow the two constructors to be "leaked" out
var Cube = undefined;
var SpinningCube = undefined;
var tankSteps = 0;
var pImage = undefined;
var pTexture = undefined;

// this is a function that runs at loading time (note the parenthesis at the end)
(function() {
    "use strict";

    // i will use this function's scope for things that will be shared
    // across all cubes - they can all have the same buffers and shaders
    // note - twgl keeps track of the locations for uniforms and attributes for us!
    var shaderProgram_house = undefined;
    var buffers = undefined;

    // constructor for Cubes
    Cube = function Cube(name, position, size, color, direction) {
        this.name = name;
        this.position = position || [0,0,0];
        this.size = size || 0.3;
        this.color = color || [1,0,.0];
        this.direction = direction;
    }



    function wait(ms){
       var start = new Date().getTime();
       var end = start;
       while(end < start + ms) {
         end = new Date().getTime();
      }
    }
    // var createGLTexture = function (gl, image, flipY) {
    //     var texture = gl.createTexture();
    //     gl.activeTexture(gl.TEXTURE0);
    //     gl.bindTexture(gl.TEXTURE_2D, texture);
    //     if(flipY){
    //         gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    //     }
    //     gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    //     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    //     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,  gl.LINEAR);
    //     gl.generateMipmap(gl.TEXTURE_2D);
    //     gl.bindTexture(gl.TEXTURE_2D, null);
    //     return texture;
    // }

    var setUpTexture = function(gl)
    {

        var texture1 = gl.createTexture();
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture1);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        pImage = new Image();
        gl.bindTexture(gl.TEXTURE_2D, null);
        return texture1;
    }


    function initTexture(texture, gl)
    {

      pImage.onload = function() { loadTexture(pImage,texture, gl); };
      pImage.crossOrigin = "anonymous";
      //pImage.src = "https://lh3.googleusercontent.com/-xX-m9F-ax7c/ViSDMRbutoI/AAAAAAAABWs/A3L33oEWBCw/s512-Ic42/spirit.jpg";
      pImage.src ="data:image/jpeg;base64,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";
      //wait(1000);
      //window.setTimeout(draw,200);

    }

    function loadTexture(image,texture, gl)
    {
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

      // Option 1 : Use mipmap, select interpolation mode
      gl.generateMipmap(gl.TEXTURE_2D);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
      gl.bindTexture(gl.TEXTURE_2D, null);
      }
    

    Cube.prototype.init = function(drawingState) {
        var gl=drawingState.gl;
        // create the shaders once - for all cubes
        if (!shaderProgram_house) {
            shaderProgram_house = twgl.createProgramInfo(gl, ["house-vs", "house-fs"]);
           // pImage = new Image();

            //pImage.crossOrigin = "anonymous";

            //pImage.src = "https://lh3.googleusercontent.com/-xX-m9F-ax7c/ViSDMRbutoI/AAAAAAAABWs/A3L33oEWBCw/s512-Ic42/spirit.jpg";
    
            //wait(10000);
            // this.texture = createGLTexture(gl, pImage, true);
            this.texture = setUpTexture(gl);
            initTexture(this.texture, gl);

        }

        
        var str =
'# www.blender.org\n'+
'mtllib house.mtl\n'+
'o Cube_Cube.001\n'+
'v 6.802443 0.005164 4.190323\n'+
'v 6.802443 12.102362 4.190323\n'+
'v -6.526244 0.005164 4.203339\n'+
'v -6.526244 12.102362 4.203339\n'+
'v 6.798942 0.005164 0.604558\n'+
'v 6.204929 12.102362 0.605138\n'+
'v -6.529747 0.005164 0.617573\n'+
'v -7.123760 12.102362 0.618153\n'+
'v -0.457665 15.755170 2.404528\n'+
'vt 0.993204 -0.012014\n'+
'vt 0.987560 0.940596\n'+
'vt 0.048000 0.963172\n'+
'vt 0.987305 0.021330\n'+
'vt 0.992949 1.000034\n'+
'vt 0.024980 0.971524\n'+
'vt 0.028087 0.963485\n'+
'vt 0.039375 0.010562\n'+
'vt 1.001325 -0.003642\n'+
'vt 0.046727 0.964940\n'+
'vt 0.058052 0.023618\n'+
'vt 0.996250 0.012460\n'+
'vt 0.039818 0.011959\n'+
'vt 0.989305 0.023248\n'+
'vt 0.989305 0.975857\n'+
'vt 0.963647 0.029121\n'+
'vt 0.963647 0.343948\n'+
'vt 0.751990 0.186534\n'+
'vt 0.074115 0.327760\n'+
'vt 0.074115 0.012932\n'+
'vt 0.285772 0.184377\n'+
'vt 0.133432 0.038783\n'+
'vt 0.541173 0.038783\n'+
'vt 0.339340 0.228684\n'+
'vt 0.755648 0.226496\n'+
'vt 0.347908 0.226496\n'+
'vt 0.549915 0.048600\n'+
'vt 0.053644 0.010562\n'+
'vt 0.019524 -0.007035\n'+
'vt 0.990037 0.949281\n'+
'vt 0.985012 0.954094\n'+
'vt 0.039818 0.964569\n'+
'vn 0.001000 0.000000 1.000000\n'+
'vn -0.985200 -0.048400 0.164200\n'+
'vn -0.001000 0.000000 -1.000000\n'+
'vn 1.000000 0.000000 -0.001000\n'+
'vn 0.000000 -1.000000 0.000000\n'+
'vn -0.000900 0.440600 -0.897700\n'+
'vn 0.000900 0.440600 0.897700\n'+
'vn 0.463200 0.882900 -0.077200\n'+
'vn -0.495800 0.864500 0.082600\n'+
'vn -1.000000 0.000000 0.001000\n'+
'vn 0.985200 0.048400 -0.164200\n'+
'usemtl Material.001\n'+
's off\n'+
'f 4/1/1 3/2/1 1/3/1\n'+
'f 4/4/2 8/5/2 7/6/2\n'+
'f 6/7/3 5/8/3 7/9/3\n'+
'f 2/10/4 1/11/4 5/12/4\n'+
'f 3/13/5 7/14/5 5/15/5\n'+
'f 6/16/6 8/17/6 9/18/6\n'+
'f 4/19/7 2/20/7 9/21/7\n'+
'f 2/22/8 6/23/8 9/24/8\n'+
'f 8/25/9 4/26/9 9/27/9\n'+
'f 2/28/1 4/1/1 1/3/1\n'+
'f 3/29/10 4/4/10 7/6/10\n'+
'f 8/30/3 6/7/3 7/9/3\n'+
'f 6/31/11 2/10/11 5/12/11\n'+
'f 1/32/5 3/13/5 5/15/5\n';



        var parsedobj = parseFaceShadedOBJ(str);


        if (!buffers) {
            var arrays = {
                vpos : { numComponents: 3, data: parsedobj.verts},
                vnormal : {numComponents:3, data: parsedobj.norms},
                vTexCoord : {numComponents : 2, data: parsedobj.txtcos}
            };
            buffers = twgl.createBufferInfoFromArrays(drawingState.gl,arrays);

        }

    };
    Cube.prototype.draw = function(drawingState) {
        // we make a model matrix to place the cube in the world
        

        
        var dir = [0,0,0];

        if(this.direction == 0)
            dir = [-15.0, 0.0, 0.0];
        if(this.direction == 1)
            dir = [0.0, tankSteps, 0.0];
        if(this.direction == 2)
            dir = [0.0, 0.0, tankSteps];

        var modelM = twgl.m4.scaling([0.5,0.4,0.4]);
        twgl.m4.setTranslation(modelM,this.position,modelM);

        twgl.m4.translate(modelM, [dir[0], dir[1], dir[2]], modelM);
        // the drawing coce is straightforward - since twgl deals with the GL stuff for us
        var gl = drawingState.gl;

        gl.useProgram(shaderProgram_house.program);
        twgl.setBuffersAndAttributes(gl,shaderProgram_house,buffers);
         shaderProgram_house.program.texSampler1 = gl.getUniformLocation(shaderProgram_house.program, "texSampler1");
        gl.uniform1i(shaderProgram_house.program.texSampler1, 0);
        twgl.setUniforms(shaderProgram_house,{
            view:drawingState.view, proj:drawingState.proj, lightdir:drawingState.sunDirection,
            cubecolor:[1,0,0], model: modelM });
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        //shaderProgram_house.program.texSampler1 = gl.getUniformLocation(shaderProgram_house.program, "texSampler1");
        //gl.uniform1i(shaderProgram_house.program.texSampler1, 0);
        twgl.drawBufferInfo(gl, gl.TRIANGLE_STRIP, buffers);
    };
    Cube.prototype.center = function(drawingState) {
        return this.position;
    }


})();

// put some objects into the scene
// normally, this would happen in a "scene description" file
// but I am putting it here, so that if you want to get
// rid of cubes, just don't load this file.
grobjects.push(new Cube("cube1",[10,0.2,-8],1, 0, 0) );


