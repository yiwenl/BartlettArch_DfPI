const regl = require('regl')()
const { mat4 } = require('gl-matrix')
const io = require('socket.io-client')

/*
const socket = io('localhost:9876')

socket.on('clicked', o => {
  console.log('Clicked', o)
})
*/

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

const positions = [
  [-r, r, 0],
  [r, r, 0],
  [r, -r, 0],

  [-r, r, 0],
  [r, -r, 0],
  [-r, -r, 0]
]

const uvs = [
  [0, 0],
  [1, 0],
  [1, 1],

  [0, 0],
  [1, 1],
  [0, 1]
]

let texture
let imageLoaded = false
const img = new Image()
img.onload = function () {
  console.log('Image loaded', this)
  texture = regl.texture(this)
  console.log('texture', texture)
  imageLoaded = true
}
img.src = 'image.jpg'

mat4.perspective(mtxProject, fov, window.innerWidth / window.innerHeight, 0.1, 100)
mat4.lookAt(mtxView, [0, 0, 10], [0, 0, 0], [0, 1, 0])

const drawTriangle = regl({
  frag: `
		precision mediump float;
    varying vec2 vUV;
    uniform sampler2D texture;
    
    void main() {
      gl_FragColor = vec4(vUV, 0.0, 1.0);
      gl_FragColor = texture2D(texture, vUV);
    }`,

  vert: `
    precision mediump float;
    attribute vec3 position;
    attribute vec2 uv;
    
    uniform float time;
    uniform mat4 uProjectionMatrix;
    uniform mat4 uViewMatrix;
		
		varying vec2 vUV;

    void main() {
      vec3 pos = position;
			gl_Position = vec4(pos, 1.0);
			vUV = uv;
    }`,

  attributes: {
    position: regl.buffer(positions),
    uv: regl.buffer(uvs)
  },
  uniforms: {
    time: regl.prop('time'),
    uProjectionMatrix: mtxProject,
    uViewMatrix: regl.prop('viewMatrix'),
    texture: regl.prop('texture')
  },
  count: 6
})

function render () {
  if (!imageLoaded) {
    window.requestAnimationFrame(render)
    return
  }
  time += 0.01
  const r = 

  const x = Math.sin(time) * r
  // const y = Math.sin(Math.cos(time * 0.5) * 2.0) * 2.0
  const z = Math.cos(time) * r

  // mat4.lookAt(mtxView, [x, 0, z], [0, 0, 0], [0, 1, 0])
  clear()
  drawTriangle({
    time: time,
    viewMatrix: mtxView,
    texture: texture
  })

  window.requestAnimationFrame(render)
}

render()
