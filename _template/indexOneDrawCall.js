const regl = require('regl')()
const strVert = require('./shaders/vertex.js')
const strFrag = require('./shaders/fragment.js')
const loadObj = require('./utils/loadObj.js')

const glm = require('gl-matrix')
var mat4 = glm.mat4

var projectionMatrix = mat4.create()
var fov = 75 * Math.PI / 180
var aspect = window.innerWidth / window.innerHeight
mat4.perspective(projectionMatrix, fov, aspect, 0.01, 1000.0)

var viewMatrix = mat4.create()
mat4.lookAt(viewMatrix, [0, 0, 2], [0, 0, 0], [0, 1, 0])

var drawCube

var value = 0

var start = -10
var end = 10

var newStart = 0
var newEnd = 1

function map (value, start, end, newStart, newEnd) {
  var percent = (value - start) / (end - start)
  if (percent < 0) {
    percent = 0
  }
  if (percent > 1) {
    percent = 1
  }
  var newValue = newStart + (newEnd - newStart) * percent
  return newValue
}

var mappedValue = map(value, start, end, newStart, newEnd)
console.log('Mapped value', mappedValue)

var mouseX = 0; var mouseY = 0
// camera control
window.addEventListener('mousemove', function (e) {
  var x = e.clientX / window.innerWidth
  var y = e.clientY / window.innerHeight

  var movingRange = 100.0
  mouseX = -(x - 0.5) * movingRange
  mouseY = (y - 0.5) * movingRange
})

loadObj('./assets/cube.obj', function (obj) {
  console.log(obj)

  var newPosition = [];
  var newUV = [];
  var newTranslate = [];


  var numBox = 50;

  var numInstance = 0;

  for(var l=0; l<numBox; l++) {
    for(var m=0; m<numBox; m++) {
      for(var n=0; n<numBox; n++) {
        for(var i=0; i<obj.positions.length; i++) {
          // copy all the position / uvs
          newPosition.push(obj.positions[i]);
          newUV.push(obj.uvs[i])

          // add new translate as attribute
          var translate = [l * 2 - 20, m * 2 - 20, n * 2 - 20]
          newTranslate.push(translate)
        }

        numInstance ++;
      }
    }
  }

  

  console.log(newTranslate.length, newPosition.length);



  // create the attributes
  var attributes = {
    aPosition: regl.buffer(newPosition),
    aUV: regl.buffer(newUV),
    aTranslate: regl.buffer(newTranslate)
  }
  // create our draw call
  drawCube = regl({
    uniforms: {
      uTime: regl.prop('time'),
      uProjectionMatrix: regl.prop('projection'),
      uViewMatrix: regl.prop('view'),
      uTranslate: regl.prop('translate'),
      uColor: regl.prop('color')
    },
    vert: strVert,
    frag: strFrag,
    attributes: attributes,
    count: obj.count * numInstance
  })
})

var currTime = 0

const clear = () => {
  regl.clear({
    color: [0.8, 0.8, 0.8, 1]
  })
}

var gap = 2

function render () {
  currTime += 0.01

  mat4.lookAt(viewMatrix, [mouseX, mouseY, 200], [0, 0, 0], [0, 1, 0])

  clear()
  if (drawCube != undefined) {
    var num = 10
    const start = num / 2 * 2 - 1


    var obj = {
      time: currTime,
      projection: projectionMatrix,
      view: viewMatrix,
      translate: [0, 0, 0],
      color: [0, 0 ,0 ]
    }

    drawCube(obj)

  }

  window.requestAnimationFrame(render)
}

render()
