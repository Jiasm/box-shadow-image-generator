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
      // console.log('done', img.width, img.height)
      let width = $img.width
      let height = $img.height
      $canvas.width = width
      $canvas.height = height
      context.drawImage($img, 0, 0, width, height)

      let pixels = context.getImageData(0, 0, width, height)

      let results = getRGBA(pixels)

      let boxShadow = ''
      // set box-shadow
      results.forEach(item => {
        boxShadow += `${item.x}px ${item.y}px 0px 1px rgba(${item.r}, ${item.g}, ${item.b}, ${item.a}),`
      })
      $output.style.boxShadow = boxShadow.slice(0, -1)
    })

    $img.id = 'test'
    $img.src = URL.createObjectURL(file)
  })
})

function getRGBA (pixels) {
  let results = []
  let {width, height, data} = pixels
  for (let i = 0; i < data.length / 4; i++) {
    results.push({
      x: i % width | 0,
      y: i / width | 0,
      r: data[i * 4],
      g: data[i * 4 + 1],
      b: data[i * 4 + 2],
      a: data[i * 4 + 3]
    })
  }

  return results
}
