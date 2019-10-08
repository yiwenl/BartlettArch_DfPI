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
varying vec2 vUV;
uniform vec3 uTranslate;

void main() {
  vec2 center = vec2(0.5, 0.5);
  float d = distance(vUV, center);


  vec3 colorBg = vec3(1.0, 1.0, 1.0);
  vec3 colorDot = vec3(1.0, 0.0, 0.0);


  float gradient = smoothstep(0.48, 0.5, d);
  // gradient : 0 ~ 1

  
  gl_FragColor = vec4((uTranslate/5.0) * .5 + .5, 1.0);
}`

var vertStr = `
precision mediump float;
attribute vec3 aPosition;
attribute vec3 color;
attribute vec2 aUV;

uniform float uTime;
uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;

uniform vec3 uTranslate;

varying vec3 vColor;
varying vec2 vUV;

vec2 rotate(vec2 v, float a) {
	float s = sin(a);
	float c = cos(a);
	mat2 m = mat2(c, -s, s, c);
	return m * v;
}

void main() {
  // create holder for position
  vec3 pos = aPosition;
  float angle = cos(uTranslate.x + uTranslate.y + uTime);
  pos.xy = rotate(pos.xy, angle);

  pos += uTranslate;

  float scale = 0.4;
  float z = sin(uTranslate.x * scale + uTranslate.y * scale + uTime * 2.0);
  pos.z += z * 1.5;

  
  gl_Position = uProjectionMatrix * uViewMatrix * vec4(pos, 1.0);
  vColor = color;
  vUV = aUV;
}`

var r = 0.45
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
  frag: fragStr,
  vert: vertStr,
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
  mat4.lookAt(viewMatrix, [mouseX, mouseY, 30], [0, 0, 0], [0, 1, 0])

  // console.log('Time :', obj)
  clear()

  var num = 50
  var start = -num / 2

  for (var i = 0; i < num; i++) {
    for (var j = 0; j < num; j++) {
      var obj = {
        time: currTime,
        view: viewMatrix,
        translate: [start + i, start + j, 0]
      }

      if (trace) {
        console.log(obj.translate[0], obj.translate[1])
      }

      drawTriangle(obj)
    }
  }
  trace = false
  window.requestAnimationFrame(render)
}

render()
