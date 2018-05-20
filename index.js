window.addEventListener('load', function () {
  let $file = document.querySelector('#image-upload')
  let $output = document.querySelector('#output')

  $file.addEventListener('change', function (e) {
    let {files} = e.target

    let [file] = files

    let $img = new Image()
    let $canvas = document.createElement('canvas')
    let context = $canvas.getContext('2d')

    $img.addEventListener('load', _ => {
      // draw image
      let width = $img.width
      let height = $img.height
      $canvas.width = width
      $canvas.height = height
      context.drawImage($img, 0, 0, width, height)

      let pixels = context.getImageData(0, 0, width, height)

      let results = getRGBA(pixels)

      results = calc(results)

      // // build box-shadow
      $output.style.boxShadow = results.map(item =>
        `${item.x}px ${item.y}px 0px ${item.radius}px rgba(${item.target.rgba})`
      ).join(',')
    })

    $img.id = 'test'
    $img.src = URL.createObjectURL(file)
  })
})

function getRGBA (pixels) {
  let results = []
  let {width, height, data} = pixels
  for (let i = 0; i < data.length / 4; i++) {
    let x = i % width | 0
    let y = i / width | 0
    let row = results[y] = results[y] || []
    row[x] = {
      rgba: `${data.slice(i * 4, i * 4 + 4)}` // 为了方便后续的对比相同颜色，直接返回一个字符串
    }
  }

  return results
}

function range (matrix, tag, startRowIndex = 0, startColIndex = 0) {
  let results = []
  rows:
  for (let rowIndex = startRowIndex; rowIndex < matrix.length; rowIndex++) {
    let row = matrix[rowIndex]
    for (let colIndex = startColIndex; colIndex < row.length; colIndex++) {
      let item = row[colIndex]

      if (item.rgba !== tag.rgba) {
        if (colIndex === startColIndex) {
          break rows
        } else {
          results.push(colIndex - startColIndex )
          break
        }
      } else if (colIndex === row.length - 1) {
        results.push(colIndex - startColIndex)
      }
    }
  }

  let count = Math.min.apply(Math, [results.length].concat(results))

  return count
}

function tag (matrix, spread, startRowIndex = 0, startColIndex = 0) {
  let tags = Symbol('tags')
  for (let rowIndex = startRowIndex; rowIndex < startRowIndex + spread; rowIndex++) {
    for (let colIndex = startColIndex; colIndex < startColIndex + spread; colIndex++) {
      matrix[rowIndex][colIndex].symbols = tags
    }
  }
}

/**
 * 矩阵数据的处理
 * @param  {Array}  matrix            原始的矩阵数据
 * @param  {Number} startRowIndex     该矩阵的起点y下标
 * @param  {Number} startColIndex     该矩阵的起点x下标
 */
function calc (matrix, startRowIndex = 0, startColIndex = 0) {
  if (startRowIndex >= matrix.length - 1 || startColIndex >= matrix[0].length - 1) return []
  let target = matrix[startRowIndex][startColIndex]

  if (target.symbols) {
    return []
  }

  let spread = range(matrix, target, startRowIndex, startColIndex)

  tag(matrix, spread, startRowIndex, startColIndex)

  let matrixRadius = spread / 2

  return [{
    radius: matrixRadius,
    x: matrixRadius + startColIndex,
    y: matrixRadius + startRowIndex,
    target
  }].concat(
    calc(matrix, startRowIndex, startColIndex + spread),
    calc(matrix, startRowIndex + spread, startColIndex)
  )
}
