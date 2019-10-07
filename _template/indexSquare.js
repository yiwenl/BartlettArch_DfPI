const regl = require('regl')()

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

  gl_Position = vec4(pos, 1.0);
  vColor = color;
}`
const r = 0.15
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
    uTime: regl.prop('time')
  },
  frag: fragStr,
  vert: vertStr,
  attributes: attributes,
  count: 6
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
