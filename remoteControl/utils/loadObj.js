const parseOBJ = require('geom-parse-obj')

const formAttributes = ({ cells, positions, normals, uvs }) => {
  console.log('cells', cells)
  let count = 0
  const _positions = []
  const _normals = []
  const _uvs = []
  cells.forEach((cell, i) => {
    cell.forEach(index => {
      _positions.push(positions[index])
      if (normals) {
        _normals.push(normals[index])
      }
      _uvs.push(uvs[index])
    })
    count += 3
  })

  return {
    positions: _positions,
    uvs: _uvs,
    normals: _normals,
    count
  }
}

const loadObj = (mFileName, mCallback) => {
  const oReq = new XMLHttpRequest()
  oReq.addEventListener('load', () => {
    const o = parseOBJ(oReq.response)

    console.log('o', o)

    const attribtues = formAttributes(o)

    mCallback(attribtues)
  })
  // oReq.open('GET', `./assets/${mFileName}`)
  oReq.open('GET', `${mFileName}`)

  oReq.send()
}

module.exports = loadObj
