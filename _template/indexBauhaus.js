const regl = require('regl')()
const loadObj = require('./utils/loadObj.js')
const glm = require('gl-matrix')

console.log('here')
const strVert = require('./shaders/vertBauhaus.js')
const strFrag = require('./shaders/fragBauhaus.js')

var mat4 = glm.mat4

// camera
var projectionMatrix = mat4.create()
var fov = 75 * Math.PI / 180
var aspect = window.innerWidth / window.innerHeight
mat4.perspective(projectionMatrix, fov, aspect, 0.01, 1000.0)

var viewMatrix = mat4.create()
mat4.lookAt(viewMatrix, [0, 0, 2], [0, 0, 0], [0, 1, 0])

var mouseX = 0; var mouseY = 0

window.addEventListener('mousemove', function (e) {
  // console.log('Mouse move', e.clientX, e.clientY)

  var percentX = e.clientX / window.innerWidth // 0 ~ 1
  var percentY = e.clientY / window.innerHeight // 0 ~ 1

  percentX = percentX * 2 - 1 // -1 ~ 1
  percentY = percentY * 2 - 1 // -1 ~ 1

  var moveRange = 30
  mouseX = -percentX * moveRange
  mouseY = percentY * moveRange

  // console.log(percentX, percentY)
})

var currTime = 0

var hasModelLoaded = false
var drawTriangle

loadObj('./assets/cubeNormal.obj', function (o) {
  const attributes = {
    aPosition: regl.buffer(o.positions),
    aNormal: regl.buffer(o.normals),
    aUV: regl.buffer(o.uvs)
  }

  drawTriangle = regl({
    uniforms: {
      uTime: regl.prop('time'),
      uProjectionMatrix: regl.prop('projection'),
      uViewMatrix: regl.prop('view'),
      uTranslate: regl.prop('translate')
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

  // mat4.lookAt(viewMatrix, [cameraX, 0, cameraZ], [0, 0, 0], [0, 1, 0])
  var radius = 40
  mat4.lookAt(viewMatrix, [mouseX, mouseY, 30], [0, 0, 0], [0, 1, 0])
  clear()

  var num = 10
  var s = 3
  var start = num / 2 * s

  for (var i = 0; i < num; i++) {
    for (var j = 0; j < num; j++) {
      for (var k = 0; k < num; k++) {
        var obj = {
          time: currTime,
          view: viewMatrix,
          projection: projectionMatrix,
          translate: [-start + i * s, -start + j * s, -start + k * s]
        }

        drawTriangle(obj)
      }
    }
  }

  window.requestAnimationFrame(render)
}

render()

window.addEventListener('resize', function () {
  regl.poll()
  var fov = 75 * Math.PI / 180
  var aspect = window.innerWidth / window.innerHeight
  mat4.perspective(projectionMatrix, fov, aspect, 0.01, 1000.0)
})
