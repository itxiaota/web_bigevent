

$(function () {

  var form = layui.form, layer = layui.layer

  // 添加密码表单验证
  form.verify({
    pwd: [
      /^[\S]{6,16}$/,
      '密码长度应在6~16位之间'
    ],
    // 新旧密码不可一样
    newpwd: function (value) {
      var oldPwd = $('[name=oldPwd]').val()
      if (value === oldPwd) return '新旧密码相同，请重新输入'
    },
    // 2次确认的密码需要一致
    repwd: function (value) {
      var newpwd = $('[name=newPwd]').val()
      if (value !== newpwd) return '两次密码不一致，请重新输入'
    }
  })

  // 提交表单，修改密码
  $('form').on('submit', function (e) {
    e.preventDefault();

    $.ajax({
      method: 'post',
      url: '/my/updatepwd',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) return layer.msg('修改密码失败')

        layer.msg('修改密码成功')

        // 修改成功后，重置表单
        $('form')[0].reset()
      }
    })
  })


})