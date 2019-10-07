const regl = require('regl')()
const { mat4 } = require('gl-matrix')

const fov = 45 * Math.PI / 180
const ratio = window.innerWidth / window.innerHeight
const projectionMatrix = mat4.create()
mat4.perspective(projectionMatrix, fov, ratio, 0.1, 1000)

const viewMatrix = mat4.create()
mat4.lookAt(viewMatrix, [0, 0, 5], [0, 0, 0], [0, 1, 0])

let time = 0
const numTriangles = 1
const points = []
const colors = []
const extras = []
let count = 0
const range = 3

function randomFrom (a, b) {
  return a + Math.random() * (b - a)
}

for (let i = 0; i < numTriangles; i++) {
  const offsetX = randomFrom(-range, range)
  const offsetY = randomFrom(-range, range)
  const offsetZ = randomFrom(-range, range)

  const color = [randomFrom(0.25, 1), randomFrom(0.25, 1), randomFrom(0.25, 1)]
  const extra = [randomFrom(0.1, 2), Math.random() * Math.PI * 2, Math.random() * Math.PI * 2]

  points.push([0 + offsetX, 0.5 + offsetY, 0 + offsetZ])
  points.push([0.5 + offsetX, -0.5 + offsetY, 0 + offsetZ])
  points.push([-0.5 + offsetX, -0.5 + offsetY, 0 + offsetZ])

  colors.push(color)
  colors.push(color)
  colors.push(color)

  extras.push(extra)
  extras.push(extra)
  extras.push(extra)

  count += 3
};

console.log(points)

var attributes = {
  position: regl.buffer(points),
  aColor: regl.buffer(colors),
  aExtra: regl.buffer(extras)
}

var vertexShader = `
precision mediump float;
attribute vec3 position;
attribute vec3 aColor;

varying vec3 vColor;

void main() {
  vec3 pos = position;

  gl_Position = vec4(position, 1.0);

  vColor = aColor;
}
`

var fragShader = `
precision mediump float;

varying vec3 vColor;

void main() {
  gl_FragColor = vec4(vColor, 1.0);

}
`

const drawTriangle = regl(
  {
    attributes: attributes,
    frag: fragShader,
    vert: vertexShader,
    count: count,
    uniforms: {
      uTime: regl.prop('uTime'),
      uViewMatrix: regl.prop('uViewMatrix'),
      uProjectionMatrix: regl.prop('uProjectionMatrix')
    }
  }
)

function clear () {
  regl.clear({
    color: [1, 1, 1, 1]
  })
}

function render () {
  time += 0.01

  var r = 20
  var x = Math.cos(time) * r
  var z = Math.sin(time) * r
  mat4.lookAt(viewMatrix, [x, 0, z], [0, 0, 0], [0, 1, 0])

  const fov = 60 * Math.PI / 180
  const ratio = window.innerWidth / window.innerHeight
  const projectionMatrix = mat4.create()
  mat4.perspective(projectionMatrix, fov, ratio, 0.1, 1000)

  clear()
  drawTriangle({
    uTime: time,
    uViewMatrix: viewMatrix,
    uProjectionMatrix: projectionMatrix
  })

  window.requestAnimationFrame(render)
}

render()
