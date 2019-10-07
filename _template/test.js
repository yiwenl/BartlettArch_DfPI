const regl = require('regl')()
const vertStr = require('./vert')

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

const r = 0.5
const attributes = {
  aPosition: regl.buffer([
    [0, r, 0.0],
    [r, -r, 0.0],
    [-r, -r, 0.0]
  ]),
  color: regl.buffer([
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1]
  ])
}

const drawTriangle = regl({
  uniforms: {
    uTime: regl.prop('time')
  },
  frag: fragStr,
  vert: vertStr,
  attributes: attributes,
  count: 3
})

function render () {
  currTime += 0.01

  var obj = {
    time: currTime
  }

  // console.log('Time :', obj)
  clear()
  drawTriangle(obj)
  window.requestAnimationFrame(render)
}

render()
