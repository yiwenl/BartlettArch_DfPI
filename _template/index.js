const regl = require('regl')()
const { mat4 } = require('gl-matrix')

const clear = () => {
  regl.clear({
    color: [0, 0, 0, 0]
  })
}

let time = 0
const r = 0.5
const mtxProject = mat4.create()
const mtxView = mat4.create()
const fov = 45 * Math.PI / 180

mat4.perspective(mtxProject, fov, window.innerWidth / window.innerHeight, 0.1, 100)
mat4.lookAt(mtxView, [0, 0, 10], [0, 0, 0], [0, 1, 0])

const drawTriangle = regl({
  frag: `
		precision mediump float;
    varying vec3 vColor;
    
    void main() {
      gl_FragColor = vec4(vColor, 1.0);
    }`,

  vert: `
    precision mediump float;
    attribute vec3 position;
    attribute vec3 color;
    
    uniform float time;
    uniform mat4 uProjectionMatrix;
    uniform mat4 uViewMatrix;
		
		varying vec3 vColor;

    void main() {
      vec3 pos = position;
			gl_Position = uProjectionMatrix * uViewMatrix * vec4(pos, 1.0);
			vColor = color;
    }`,

  attributes: {
    position: regl.buffer([
      [0, r, 0.0],
      [r, -r, 0.0],
      [-r, -r, 0.0]
    ]),
    color: regl.buffer([
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1]
    ])
  },
  uniforms: {
    time: regl.prop('time'),
    uProjectionMatrix: mtxProject,
    uViewMatrix: regl.prop('viewMatrix')
  },
  count: 3
})

function render () {
  time += 0.02

  mat4.lookAt(mtxView, [Math.sin(time) * 5, 0, 5 + Math.sin(time) * 2], [0, 0, 0], [0, 1, 0])
  clear()
  drawTriangle({
    time: time,
    viewMatrix: mtxView
  })

  window.requestAnimationFrame(render)
}

render()
