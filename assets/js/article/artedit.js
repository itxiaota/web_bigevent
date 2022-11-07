$(function () {
  var art_id = localStorage.getItem('art_id')
  var layer = layui.layer
  var form = layui.form

  // 1. 初始化图片裁剪器
  var $image = $('#image')

  // 2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview'
  }

  // 3. 初始化裁剪区域
  $image.cropper(options)


  // 获取文章信息
  function getArt() {
    $.get('/my/article/' + art_id, function (res) {
      if (res.status !== 0) return layer.msg('文章信息获取失败')

      // 给表单赋值
      console.log(res);

      form.val('editForm', res.data)

      // $image.cropper('destroy').attr('src', 'http://127.0.0.1:3007' + res.data.cover_img).cropper(options);
    })
  }

  getArt()


  // 获取文章类别 
  function inifCate() {
    $.get('/my/article/cates', function (res) {
      if (res.status !== 0) return layer.msg('文章类别获取失败')

      var htmlStr = template('temp_cates', res)
      $('[name=cate_id]').html(htmlStr)

      // 动态添加的表单区域内容，需要重新渲染
      form.render()

    })
  }

  inifCate()
  // 初始化富文本编辑器
  initEditor()




  // 为选择封面的按钮，绑定点击事件处理函数
  $('#btnChooseImage').on('click', function () {
    $('#coverFile').click()
  })

  // 监听 coverFile 的 change 事件，获取用户选择的文件列表
  $('#coverFile').on('change', function (e) {
    // 获取到文件的列表数组
    var files = e.target.files
    // 判断用户是否选择了文件
    if (files.length === 0) {
      return
    }
    // 根据文件，创建对应的 URL 地址
    var newImgURL = URL.createObjectURL(files[0])
    // 为裁剪区域重新设置图片
    $image
      .cropper('destroy') // 销毁旧的裁剪区域
      .attr('src', newImgURL) // 重新设置图片路径
      .cropper(options) // 重新初始化裁剪区域
  })

  var state = '已发布'
  $('#saveDraft').on('click', function () {
    state = '草稿'
  })

  $('#artEditForm').on('submit', function (e) {
    e.preventDefault();

    var fd = new FormData($(this)[0])
    fd.append('state', state) // 添加文章动态 参数
    fd.append('id', Number(art_id))

    // 4. 将封面裁剪过后的图片，输出为一个文件对象
    $image
      .cropper('getCroppedCanvas', {
        // 创建一个 Canvas 画布
        width: 400,
        height: 280
      })
      .toBlob(function (blob) {
        // 将 Canvas 画布上的内容，转化为文件对象
        // 得到文件对象后，进行后续的操作
        // 5. 将文件对象，存储到 fd 中
        fd.append('cover_img', blob)
        // 6. 发起 ajax 数据请求
        publishArticle(fd)
      })

  })



  // 发表文章，ajax 请求
  function publishArticle(fd) {
    $.ajax({
      method: 'post',
      url: '/my/article/edit',
      data: fd,
      processData: false,
      contentType: false,
      success: function (res) {
        if (res.status !== 0) return layer.msg('文章更新失败')

        layer.msg('文章更新成功')
        // location.href = '/article/artlist.html'

      }
    })
  }

})