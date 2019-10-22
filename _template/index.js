const regl = require('regl')()

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
var fragStr = `
precision mediump float;
varying vec3 vColor;
uniform vec3 uPosition;

void main() {
  // vec3 color = uPosition / 5.0 * .5 + .5;
  // gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
  gl_FragColor = vec4(vColor, 1.0);
}`

var vertStr = `
precision mediump float;
attribute vec3 aPosition;
attribute vec3 color;

uniform float uTime;
uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;

uniform vec3 uPosition;

varying vec3 vColor;


void main() {
  vec3 pos = aPosition + uPosition;

  gl_Position = uProjectionMatrix * uViewMatrix * vec4(pos, 1.0);
  vColor = color;
}`
const r = 0.45
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
    uViewMatrix: regl.prop('view'),
    uPosition: regl.prop('position')
  },
  frag: fragStr,
  vert: vertStr,
  attributes: attributes,
  count: 6
})

var traced = false

function render () {
  currTime += 0.0
  var cameraRadius = 10.0
  var cameraX = Math.sin(currTime) * cameraRadius
  var cameraZ = Math.cos(currTime) * cameraRadius

  mat4.lookAt(viewMatrix, [cameraX, 0, cameraZ], [0, 0, 0], [0, 1, 0])

  // console.log('Time :', obj)
  clear()

  var num = 10
  var start = -num / 2
  for (var i = 0; i < num; i++) {
    for (var j = 0; j < num; j++) {
      // for (var k = 0; k < num; k++) {
      var x = start + i
      var y = start + j

      var obj = {
        position: [x, y, 0],
        time: currTime,
        view: viewMatrix
      }

      if (!traced) {
        console.log(obj.position)
      }
      drawTriangle(obj)
      // }
    }
  }

  traced = true

  window.requestAnimationFrame(render)
}

render()
