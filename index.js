window.addEventListener('load', function () {
  let $file = document.querySelector('#image-upload')

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

      console.log(pixels)
    })

    $img.id = 'test'
    $img.src = URL.createObjectURL(file)
  })
})
