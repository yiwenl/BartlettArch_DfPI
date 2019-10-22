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

  var movingRange = 30.0
  mouseX = -(x - 0.5) * movingRange
  mouseY = (y - 0.5) * movingRange
})

loadObj('./assets/cube.obj', function (obj) {
  console.log(obj)
  // create the attributes
  var attributes = {
    aPosition: regl.buffer(obj.positions),
    aUV: regl.buffer(obj.uvs)
  }
  // create our draw call
  drawCube = regl({
    uniforms: {
      uTime: regl.prop('time'),
      uProjectionMatrix: regl.prop('projection'),
      uViewMatrix: regl.prop('view'),
      uTranslate: regl.prop('translate'),
      uColor: regl.prop('color'),
      isBW: regl.prop('bw')
    },
    vert: strVert,
    frag: strFrag,
    attributes: attributes,
    count: obj.count
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

  mat4.lookAt(viewMatrix, [mouseX, mouseY, 30], [0, 0, 0], [0, 1, 0])

  clear()
  if (drawCube != undefined) {
    var num = 10
    const start = num / 2 * 2 - 1

    var isBW = false

    if (currTime > 2) {
      gap += 0.01
      isBW = true
    }

    for (var i = 0; i < num; i++) {
      for (var j = 0; j < num; j++) {
        for (var k = 0; k < num; k++) {
          // create object for uniforms
          var obj = {
            time: currTime,
            projection: projectionMatrix,
            view: viewMatrix,
            translate: [-start + i * gap, -start + j * gap, -start + k * gap],
            color: [i / num, j / num, k / num],
            bw: isBW ? 1.0 : 0.0
          }

          drawCube(obj)
        }
      }
    }
  }

  window.requestAnimationFrame(render)
}

render()
