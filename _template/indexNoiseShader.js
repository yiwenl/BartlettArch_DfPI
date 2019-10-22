const regl = require('regl')()

var strVertex = require('./shaders/shaderVertex.js')
var strFrag = require('./shaders/shaderFrag.js')

const glm = require('gl-matrix')
var mat4 = glm.mat4

var projectionMatrix = mat4.create()
var fov = 75 * Math.PI / 180
var aspect = window.innerWidth / window.innerHeight
mat4.perspective(projectionMatrix, fov, aspect, 0.01, 1000.0)

var viewMatrix = mat4.create()
mat4.lookAt(viewMatrix, [0, 0, 2], [0, 0, 0], [0, 1, 0])

var currTime = 0

var mouseX = 0
var mouseY = 0

window.addEventListener('mousedown', function (e) {
  console.log('mouse down')
})
window.addEventListener('mousemove', function (e) {
  // console.log('Mouse move', e.clientX, e.clientY)

  var percentX = e.clientX / window.innerWidth // 0 ~ 1
  var percentY = e.clientY / window.innerHeight // 0 ~ 1

  percentX = percentX * 2 - 1 // -1 ~ 1
  percentY = percentY * 2 - 1 // -1 ~ 1

  var moveRange = 2
  mouseX = -percentX * moveRange
  mouseY = percentY * moveRange

  // console.log(percentX, percentY)
})

const clear = () => {
  regl.clear({
    color: [0, 0, 0, 0]
  })
}

var r = 0.5
var positions = [
  [-r, r, 0.0],
  [r, r, 0.0],
  [r, -r, 0.0],

  [-r, r, 0.0],
  [r, -r, 0.0],
  [-r, -r, 0.0]
]

var colors = [
  [1, 0, 0],
  [0, 1, 0],
  [0, 0, 1],

  [1, 0, 0],
  [0, 0, 1],
  [1, 1, 0]
]

var uvs = [
  [0, 0],
  [1, 0],
  [1, 1],

  [0, 0],
  [1, 1],
  [0, 1]
]

const attributes = {
  aPosition: regl.buffer(positions),
  color: regl.buffer(colors),
  aUV: regl.buffer(uvs)
}

const drawTriangle = regl({
  uniforms: {
    uTime: regl.prop('time'),
    uProjectionMatrix: projectionMatrix,
    uViewMatrix: regl.prop('view'),
    uTranslate: regl.prop('translate')
  },
  frag: strFrag,
  vert: strVertex,
  attributes: attributes,

  depth: {
    enable: false
  },

  blend: {
    enable: true,
    func: {
      srcRGB: 'src alpha',
      srcAlpha: 'src alpha',
      dstRGB: 'one minus src alpha',
      dstAlpha: 'one minus src alpha'
    }
  },
  count: 6
})

let trace = true

function render () {
  currTime += 0.01
  mat4.lookAt(viewMatrix, [0, 0, 2], [0, 0, 0], [0, 1, 0])

  // console.log('Time :', obj)
  clear()

  // var num = 20
  // var start = -num / 2

  // for (var i = 0; i < num; i++) {
  //   for (var j = 0; j < num; j++) {
  var obj = {
    time: currTime,
    view: viewMatrix,
    translate: [0, 0, 0]
  }

  drawTriangle(obj)
  trace = false
  window.requestAnimationFrame(render)
}

render()
