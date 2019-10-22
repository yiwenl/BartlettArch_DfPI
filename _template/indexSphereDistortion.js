const regl = require('regl')()
const strVert = require('./shaders/vertexSphere.js')
const strFrag = require('./shaders/fragmentSphere.js')
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

var t = 2

var a = t > 5 ? 999 : 111
/*
if(t > 5) {
  a = 1;
} else {
  a = 0;
}
*/
console.log(a)

var mouseX = 0; var mouseY = 0
// camera control
window.addEventListener('mousemove', function (e) {
  var x = e.clientX / window.innerWidth
  var y = e.clientY / window.innerHeight

  var movingRange = 30.0
  mouseX = -(x - 0.5) * movingRange
  mouseY = (y - 0.5) * movingRange
})

loadObj('./assets/sphere.obj', function (obj) {
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
      uColor: regl.prop('color')
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

  mat4.lookAt(viewMatrix, [mouseX, mouseY, 5], [0, 0, 0], [0, 1, 0])

  clear()
  if (drawCube != undefined) {
    var obj = {
      time: currTime,
      projection: projectionMatrix,
      view: viewMatrix,
      translate: [0, 0, 0],
      color: [1, 0, 0]
    }

    drawCube(obj)
  }

  window.requestAnimationFrame(render)
}

render()
