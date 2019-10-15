const regl = require('regl')()
const strVert = require('./shaders/vertex.js')
const strFrag = require('./shaders/fragment.js')

const glm = require('gl-matrix')
var mat4 = glm.mat4

var projectionMatrix = mat4.create()
var fov = 75 * Math.PI / 180
var aspect = window.innerWidth / window.innerHeight
mat4.perspective(projectionMatrix, fov, aspect, 0.01, 1000.0)

var viewMatrix = mat4.create()
mat4.lookAt(viewMatrix, [0, 0, 2], [0, 0, 0], [0, 1, 0])

var currTime = 0

const clear = () => {
  regl.clear({
    color: [0, 0, 0, 0]
  })
}

const r = 0.5
const attributes = {
  aPosition: regl.buffer([
    [-r, r, 0.0],
    [r, r, 0.0],
    [r, -r, 0.0],

    [-r, r, 0.0],
    [r, -r, 0.0],
    [-r, -r, 0.0]
  ]),
  color: regl.buffer([
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],

    [1, 0, 0],
    [0, 0, 1],
    [1, 1, 0]
  ])
}

const drawTriangle = regl({
  uniforms: {
    uTime: regl.prop('time'),
    uProjectionMatrix: projectionMatrix,
    uViewMatrix: regl.prop('view')
  },
  frag: strFrag,
  vert: strVert,
  attributes: attributes,
  count: 6
})

function render () {
  currTime += 0.01
  var cameraRadius = 1.0
  var cameraX = Math.sin(currTime) * cameraRadius
  var cameraZ = Math.cos(currTime) * cameraRadius

  mat4.lookAt(viewMatrix, [cameraX, 0, cameraZ], [0, 0, 0], [0, 1, 0])

  var obj = {
    time: currTime,
    view: viewMatrix
  }

  // console.log('Time :', obj)
  clear()
  drawTriangle(obj)
  window.requestAnimationFrame(render)
}

render()
