$(function () {
  var form = layui.form
  var layer = layui.layer

  form.verify({
    nickname: [
      /^[\S]{1,6}$/,
      '昵称长度必须在 1 ~ 6 个字符之间！'
    ]
  })


  // 获取用户信息
  function getUserInfo() {
    $.ajax({
      method: 'get',
      url: '/my/userinfo',
      success: function (res) {
        if (res.status != 0) return layer.msg('获取用户信息失败')
        // 使用layui 提供方法，快捷为全部表单项赋值  lay-filter="formUserInfo"
        form.val('formUserInfo', res.data)

      },
    })
  }

  getUserInfo()

  // 重置表单内容
  $('#btnReset').on('click', function (e) {
    e.preventDefault();
    getUserInfo()
  })

  // 表单提交
  $('#form').on('submit', function (e) {
    e.preventDefault();

    $.ajax({
      method: 'POST',
      url: '/my/userinfo',
      data: $(this).serialize(),
      success: function (res) {
        console.log(res);
        if (res.status !== 0) return layer.msg('更新用户信息失败')

        layer.msg('更新用户信息成功')

        // 调用主页的更新用户信息的方法
        // iframe 子页调用父页的方法
        window.parent.getUserInfo()
      }
    })
  })


})