// getDrawCall.js
const regl = require('regl')()

const strVertex = require('./shaders/191015_vertexShader.js')		// import vertex shader
const strFrag = require('./shaders/191015_fragShader.js')			// import fragment shader
const loadObj = require('./utils/loadObj.js')						// import loadObj tool

function getDrawCall (path, mID, mCallback) { // input : path to the 3d model
  loadObj(path, function (obj) {
    console.log('Model Loaded', obj)

    // create the attributes
    var attributes = {
      aPosition: regl.buffer(obj.positions),
      aUV: regl.buffer(obj.uvs)
    }

    // create draw call
    var drawCubeFaceBack = regl({
      uniforms: {
        uTime: regl.prop('time'),
        uProjectionMatrix: regl.prop('projection'),
        uViewMatrix: regl.prop('view'),
        uTranslate: regl.prop('translate'),
        uColor: regl.prop('color')
      },
      attributes: attributes,
      frag: strFrag,
      vert: strVertex,
      count: obj.count
    })

    drawCubeFaceBack.ID = mID

    mCallback(drawCubeFaceBack)
  })
}

module.exports = getDrawCall
