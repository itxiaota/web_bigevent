$(function () {
  var layer = layui.layer
  var form = layui.form

  // 获取文章类别 列表
  function initArtCate() {
    $.ajax({
      method: 'get',
      url: '/my/article/cates',
      success: function (res) {
        if (res.status !== 0) return layer.msg('文章分类列表获取失败')

        var htmlStr = template('tmp_table', res)
        $('tbody').html(htmlStr)
      }
    })
  }

  initArtCate()

  // 添加 类别 按钮的事件
  var indexAddCates = null
  $('#addCates').on('click', function () {
    indexAddCates = layer.open({
      type: 1,
      area: ['500px', '250px'],
      title: '添加文章分类',
      content: $('#addCatesTemplate').html()
    });
  })

  // 提交 添加的类别 
  $('body').on('submit', '#addCatesForm', function (e) {
    e.preventDefault();
    e.stopPropagation();

    $.ajax({
      method: 'post',
      url: '/my/article/addcates',
      data: $('#addCatesForm').serialize(),
      success: function (res) {
        if (res.status !== 0) return layer.msg('文章分类添加失败')

        // 添加成功
        initArtCate()
        layer.msg('文章分类添加成功')
        // 关闭弹窗
        layer.close(indexAddCates)
      }
    })
  })

  // 重置 添加的类别 
  $('body').on('click', '[type=reset]', function (e) {
    e.preventDefault();
    e.stopPropagation();
    $('#addCatesForm')[0].reset()
  })

  // 表格内 编辑 按钮 事件
  var indexEditCates = null
  $('tbody').on('click', '.edit-cates', function (e) {
    var id = $(this).data('id')

    indexEditCates = layer.open({
      type: 1,
      area: ['500px', '250px'],
      title: '编辑文章分类',
      content: $('#editCatesTemplate').html()
    });

    $.ajax({
      method: 'get',
      url: '/my/article/cates/' + id,
      success: function (res) {
        if (res.status !== 0) return layer.msg('文章类别获取失败')

        // 文章类别获取成功，将内容填充到表单内

        form.val('editForm', res.data)
      }
    })

  })


  // 表单 submit 行为
  $('body').on('submit', '#editCatesForm', function (e) {
    e.preventDefault()

    $.ajax({
      method: 'post',
      url: '/my/article/updatecate',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) return layer.msg('文章类别修改失败')

        layer.msg('文章类别修改成功')

        initArtCate()
        layer.close(indexEditCates)
      }
    })
  })

  // 表单 submit 行为
  $('tbody').on('click', '.delete-cates', function (e) {
    e.preventDefault()
    console.log('ok');
    var id = $(this).data('id')
    layer.confirm('确定要删除文章类别?', { icon: 3, title: '提示' }, function (index) {
      $.ajax({
        method: 'get',
        url: '/my/article/deletecate/' + id,
        success: function (res) {
          if (res.status !== 0) return layer.msg('文章类别删除失败')

          layer.msg('文章类别删除成功')

          initArtCate()
        }
      })
      // 关闭弹出层
      layer.close(index);
    });


  })
})