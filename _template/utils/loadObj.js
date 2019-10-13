const parseOBJ = require('geom-parse-obj')

const formAttributes = ({ cells, positions, uvs }) => {
  let count = 0
  const _positions = []
  const _uvs = []
  cells.forEach((cell, i) => {
    cell.forEach(index => {
      _positions.push(positions[index])
      _uvs.push(uvs[index])
    })
    count += 3
  })

  return {
    positions: _positions,
    uvs: _uvs,
    count
  }
}

const loadObj = (mFileName, mCallback) => {
  const oReq = new XMLHttpRequest()
  oReq.addEventListener('load', () => {
    const o = parseOBJ(oReq.response)

    const attribtues = formAttributes(o)

    mCallback(attribtues)
  })
  oReq.open('GET', `./assets/${mFileName}`)

  oReq.send()
}

module.exports = loadObj
