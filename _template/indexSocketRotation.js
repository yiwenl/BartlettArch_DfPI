const regl = require('regl')()
const io = require('socket.io-client')
const socket = io('http://10.97.134.65:9876')

const glm = require('gl-matrix')
var mat4 = glm.mat4

var projectionMatrix = mat4.create()
var fov = 75 * Math.PI / 180
var aspect = window.innerWidth / window.innerHeight
mat4.perspective(projectionMatrix, fov, aspect, 0.01, 1000.0)

var viewMatrix = mat4.create()
mat4.lookAt(viewMatrix, [0, 0, 2], [0, 0, 0], [0, 1, 0])

var rotationValues = [0, 0, 0]

var currTime = 0

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
uniform vec3 uRotations;
uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;

varying vec3 vColor;


vec2 rotate(vec2 v, float a) {
	float s = sin(a);
	float c = cos(a);
	mat2 m = mat2(c, -s, s, c);
	return m * v;
}

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

  // pos.xy = rotate(pos.xy, uRotations.z);
  pos.xz = rotate(pos.xz, uRotations.y);
  pos.yz = rotate(pos.yz, uRotations.x);

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
    uViewMatrix: regl.prop('view'),
    uRotations: regl.prop('rotation')
  },
  frag: fragStr,
  vert: vertStr,
  attributes: attributes,
  count: 6
})

function render () {
  currTime += 0.01
  var cameraRadius = 1.0
  var cameraX = Math.sin(currTime) * cameraRadius
  var cameraZ = Math.cos(currTime) * cameraRadius

  // mat4.lookAt(viewMatrix, [cameraX, 0, cameraZ], [0, 0, 0], [0, 1, 0])

  var obj = {
    time: currTime,
    view: viewMatrix,
    rotation: rotationValues
  }

  // console.log('Time :', obj)
  clear()
  drawTriangle(obj)
  window.requestAnimationFrame(render)
}

render()

socket.on('cameramove', function (o) {
  mat4.copy(viewMatrix, o.view)
})

// socket.on('tilt', function (o) {
//   if (Math.random() > 0.99) {
//     console.log('on tilt', o)
//   }
//   const radians = Math.PI / 180
//   rotationValues = [
//     -o.beta * radians + Math.PI / 2,
//     o.gamma * radians,
//     o.alpha * radians
//   ]
// })
