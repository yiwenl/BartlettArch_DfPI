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
var fragStr = `
precision mediump float;
varying vec3 vColor;

void main() {
  gl_FragColor = vec4(vColor, 1.0);
}`

var vertStr = `
precision mediump float;
attribute vec3 aPosition;
attribute vec3 color;

uniform float uTime;
uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;

varying vec3 vColor;

void main() {
  // create holder for position
  vec3 pos = aPosition;
  
  // add the time to the 'x' only
  // pos.x += uTime;

  float movingRange = 0.0;
  pos.x += sin(uTime) * movingRange;
  pos.y += cos(uTime) * movingRange;
  // sin goes from -1 ~ 1

  float scale = sin(uTime);
  
  scale = scale * 0.5 + 0.5;
  // scale => -1 ~ 1 -> -0.5 ~ 0.5 -> 0 ~ 1

  gl_Position = uProjectionMatrix * uViewMatrix * vec4(pos, 1.0);
  vColor = color;
}`
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
  frag: fragStr,
  vert: vertStr,
  attributes: attributes,
  count: 6
})

function render () {
  currTime += 0.01
  // var cameraRadius = 2.0
  // var cameraX = Math.sin(currTime) * cameraRadius
  // var cameraZ = Math.cos(currTime) * cameraRadius

  mat4.lookAt(viewMatrix, [mouseX, mouseY, 3], [0, 0, 0], [0, 1, 0])

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
