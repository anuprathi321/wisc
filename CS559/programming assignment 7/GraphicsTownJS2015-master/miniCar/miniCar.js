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
var minicarSteps = 0;

// this is a function that runs at loading time (note the parenthesis at the end)
(function() {
    "use strict";

    // i will use this function's scope for things that will be shared
    // across all cubes - they can all have the same buffers and shaders
    // note - twgl keeps track of the locations for uniforms and attributes for us!
    var shaderProgram = undefined;
    var buffers = undefined;

    // constructor for Cubes
    Cube = function Cube(name, position, size, color, direction) {
        this.name = name;
        this.position = position || [0,0,0];
        this.size = size || 0.3;
        this.color = color || [1,0,.0];
        this.direction = direction;
    }
    Cube.prototype.init = function(drawingState) {
        var gl=drawingState.gl;
        // create the shaders once - for all cubes
        if (!shaderProgram) {
            shaderProgram = twgl.createProgramInfo(gl, ["car-vs", "car-fs"]);
        }
        var m = 1.5;
        var n = 0.5;
        var o = 2;


        function calNormal(arrData, indices, length)
        {
            var normalPos = [];
            
            var i = 0;
            for(i = 0; i < length; i++)
            {
                var i1 = indices[i*3];
                var i2 = indices[i*3 + 1];
                var i3 = indices[i*3 + 2];
                var f1 = [indices[i1], indices[i1 + 1], indices[i1 + 2]];
                var f2 = [indices[i2], indices[i2 + 1], indices[i2 + 2]];
                var f3 = [indices[i3], indices[i3 + 1], indices[i3 + 2]];

                var cross1 = twgl.v3.subtract(f2, f1);
                var cross2 = twgl.v3.subtract(f3, f2);
                var normal = twgl.v3.cross(cross1, cross2);
                normal = twgl.v3.normalize(normal);

                normalPos = normalPos.concat(normal[0]);
                normalPos = normalPos.concat(normal[1]);
                normalPos = normalPos.concat(normal[2]);
            }

            return normalPos;
        }

        var indicesTemp = [ 
                            0,1,3,
                            0,3,2,
                            6,5,4,
                            6,4,3,
                            12,11,10,
                            12,10,13,
                            9,8,7,
                            9,7,10,
                            5,8,7,
                            5,7,4,
                            6,9,8,
                            6,8,5,
                            1,11,9,
                            1,9,6,
                            12,0,13,
                            12,13,2,
                            0,12,11,
                            0,11,1,
                            2,13,7,2,7,4

                            ];
        var posTemp = [
                        -1,0.5,0.5,
                        0,0.5,0,
                        -1,-0.5,0.5,
                        0,-0.5,0.5,
                        0.5,-0.5,0.5,
                        0.5,0,0.5,
                        0,0,0.5,
                        0.5,-0.5,-0.5,
                        0.5,0,-0.5,
                        0,0,-0.5,
                        0,-0.5,-0.5,
                        0,0.5,-0.5,
                        -1,0.5,-0.5,
                        -1,-0.5,-0.5
                ];
        var normalTemp =  calNormal(posTemp, indicesTemp, 14);

        if (!buffers) {
            var arrays = {
                vpos : { numComponents: 3, data: posTemp},
                vnormal : {numComponents:3, data: normalTemp},
                indices : indicesTemp
            };
            buffers = twgl.createBufferInfoFromArrays(drawingState.gl,arrays);
        }

    };
    Cube.prototype.draw = function(drawingState) {
        // we make a model matrix to place the cube in the world
        minicarSteps += 0.05;
        var miniRotate = 0;
        if(minicarSteps > 20.0)
        {
            minicarSteps = -5.0;
            miniRotate = 1;

        }

        
        var dir = [0,0,0];

        if(this.direction == 0)
            dir = [minicarSteps, 0.0, 0.0];
        if(this.direction == 1)
            dir = [0.0, minicarSteps, 0.0];
        if(this.direction == 2)
            dir = [0.0, 0.0, minicarSteps];

        var modelM = twgl.m4.scaling([0.5,0.4,0.4]);
        twgl.m4.setTranslation(modelM,this.position,modelM);

        twgl.m4.translate(modelM, [dir[0], dir[1], dir[2]], modelM);
        // the drawing coce is straightforward - since twgl deals with the GL stuff for us
        var gl = drawingState.gl;
        gl.useProgram(shaderProgram.program);
        twgl.setBuffersAndAttributes(gl,shaderProgram,buffers);
        twgl.setUniforms(shaderProgram,{
            view:drawingState.view, proj:drawingState.proj, lightdir:drawingState.sunDirection,
            cubecolor:[1,0,0], model: modelM });
        twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers);
    };
    Cube.prototype.center = function(drawingState) {
        return this.position;
    }


    ////////
    // constructor for Cubes
    SpinningCube = function SpinningCube(name, position, size, color, axis) {
        Cube.apply(this,arguments);
        this.axis = axis || 'X';
    }
    SpinningCube.prototype = Object.create(Cube.prototype);
    SpinningCube.prototype.draw = function(drawingState) {
        // we make a model matrix to place the cube in the world
        var modelM = twgl.m4.scaling([this.size,this.size,this.size]);
        var theta = Number(drawingState.realtime)/200.0;
        if (this.axis == 'X') {
            twgl.m4.rotateX(modelM, theta, modelM);
        } else if (this.axis == 'Z') {
            twgl.m4.rotateZ(modelM, theta, modelM);
        } else {
            twgl.m4.rotateY(modelM, theta, modelM);
        }
        twgl.m4.setTranslation(modelM,this.position,modelM);
        // the drawing coce is straightforward - since twgl deals with the GL stuff for us
        var gl = drawingState.gl;
        gl.useProgram(shaderProgram.program);
        twgl.setBuffersAndAttributes(gl,shaderProgram,buffers);
        twgl.setUniforms(shaderProgram,{
            view:drawingState.view, proj:drawingState.proj, lightdir:drawingState.sunDirection,
            cubecolor:[1.0,1.0,0.0], model: modelM });
        twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers);
    };
    SpinningCube.prototype.center = function(drawingState) {
        return this.position;
    }


})();

// put some objects into the scene
// normally, this would happen in a "scene description" file
// but I am putting it here, so that if you want to get
// rid of cubes, just don't load this file.
grobjects.push(new Cube("cube1",[0,0.2,-4],1, 0, 0) );
grobjects.push(new Cube("cube1",[1,0.2, 4],1, 0, 0) );
grobjects.push(new Cube("cube1",[2,0.2,1],1, 0, 0) );
grobjects.push(new Cube("cube1",[3,0.2,2],1, 0, 0) );
grobjects.push(new Cube("cube1",[4,0.2,-4],1, 0, 0) );
grobjects.push(new Cube("cube1",[-1,0.2, 4],1, 0, 0) );
grobjects.push(new Cube("cube1",[-2,0.2,1],1, 0, 0) );
grobjects.push(new Cube("cube1",[-3,0.2,2],1, 0, 0) );
grobjects.push(new Cube("cube1",[-4,0.2,-4],1, 0, 0) );
grobjects.push(new Cube("cube1",[-2,0.2, 4],1, 0, 0) );
grobjects.push(new Cube("cube1",[-1,0.2,1],1, 0, 0) );
grobjects.push(new Cube("cube1",[-9,0.2,2],1, 0, 0) );


