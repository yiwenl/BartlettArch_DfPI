const regl = require('regl')()
const { mat4 } = require('gl-matrix')
const io = require('socket.io-client')

/*
const socket = io('localhost:9876')

socket.on('clicked', o => {
  console.log('Clicked', o)
})
*/
const r = 0.5
const clear = () => {
  regl.clear({
    color: [0, 0, 0, 0]
  })
}

let currTime = 0

const drawTriangle = regl({
  frag: `
		precision mediump float;
    varying vec3 vColor;
    
    void main() {
      gl_FragColor = vec4(vColor, 1.0);
    }`,

  vert: `
    precision mediump float;
    attribute vec3 aPosition;
    attribute vec3 color;

    uniform float time;
    
		varying vec3 vColor;

    void main() {
      vec3 pos = aPosition;
      pos.x += sin(time) * 0.5;
			gl_Position = vec4(pos, 1.0);
			vColor = color;
    }`,

  attributes: {
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
  },
  uniforms: {
    time: regl.prop('time')
  },
  count: 3
})

function render () {
  currTime += 0.01
  // time increase every frame

  const obj = {
    time: currTime
  }
  clear()
  drawTriangle(obj)
  // assign the current to time for setting up the uniform

  window.requestAnimationFrame(render)
}

render()
