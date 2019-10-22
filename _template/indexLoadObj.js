const regl = require('regl')()
const loadObj = require('./utils/loadObj.js')
const glm = require('gl-matrix')

const strVert = require('./shaders/vert.js')
const strFrag = require('./shaders/frag.js')

var mat4 = glm.mat4

// camera
var projectionMatrix = mat4.create()
var fov = 75 * Math.PI / 180
var aspect = window.innerWidth / window.innerHeight
mat4.perspective(projectionMatrix, fov, aspect, 0.01, 1000.0)

var viewMatrix = mat4.create()
mat4.lookAt(viewMatrix, [0, 0, 2], [0, 0, 0], [0, 1, 0])

var currTime = 0

var hasModelLoaded = false
var drawTriangle

loadObj('cube.obj', function (o) {
  const attributes = {
    aPosition: regl.buffer(o.positions),
    aUV: regl.buffer(o.uvs)
  }

  drawTriangle = regl({
    uniforms: {
      uTime: regl.prop('time'),
      uProjectionMatrix: regl.prop('projection'),
      uViewMatrix: regl.prop('view')
    },
    vert: strVert,
    frag: strFrag,
    attributes: attributes,
    count: o.count
  })

  hasModelLoaded = true
})

const clear = () => {
  regl.clear({
    color: [0, 0, 0, 0]
  })
}

function render () {
  if (!hasModelLoaded) {
    window.requestAnimationFrame(render)
    return
  }
  currTime += 0.01
  var cameraRadius = 5.0
  var cameraX = Math.sin(currTime) * cameraRadius
  var cameraZ = Math.cos(currTime) * cameraRadius

  mat4.lookAt(viewMatrix, [cameraX, 0, cameraZ], [0, 0, 0], [0, 1, 0])

  var obj = {
    time: currTime,
    view: viewMatrix,
    projection: projectionMatrix
  }

  clear()
  drawTriangle(obj)
  window.requestAnimationFrame(render)
}

render()

window.addEventListener('resize', function () {
  regl.poll()
  var fov = 75 * Math.PI / 180
  var aspect = window.innerWidth / window.innerHeight
  mat4.perspective(projectionMatrix, fov, aspect, 0.01, 1000.0)
})
