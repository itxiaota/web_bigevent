$(function () {
  // 切换 登录 注册
  $('#goReg').on('click', function () {
    $('.login-box').hide()
    $('.reg-box').show()
  })
  $('#goLogin').on('click', function () {
    $('.login-box').show()
    $('.reg-box').hide()
  })

  var form = layui.form
  var layer = layui.layer

  form.verify({
    pwd: [
      /^[\S]{6,12}$/,
      '密码必须6到12位，且不能出现空格'
    ],
    repwd: function (value, dom) {
      // 规则使用在谁身上，拿到谁的值
      var pwd = $('#regForm [name=password]').val()
      if (pwd !== value) {
        return '两次密码不一致'
      }
    }
  })

  $('#regForm').on('submit', function (e) {

    e.preventDefault();
    var data = { username: $('#regForm [name=username]').val(), password: $('#regForm [name=password]').val() }
    $.post('/api/reguser', data, function (res) {
      if (res.status != 0) return layer.msg('注册失败')

      // 注册成功
      layer.msg('注册成功，请登录！')
      $('#goLogin').click()
    })
  })


  $('#loginForm').on('submit', function (e) {
    e.preventDefault();

    var data = { username: $('#loginForm [name=username]').val(), password: $('#loginForm [name=password]').val() }
    console.log($(this).serialize());
    $.ajax({
      method: 'post',
      url: '/api/login',
      data: $(this).serialize(),
      success: function (res) {
        console.log(res);
        if (res.status !== 0) return layer.msg('登录失败')

        // 保存 token
        localStorage.setItem('token', res.token)
        // 登录成功
        layer.msg('登录成功')
        //跳转页面
        location.href = '/index.html'
      }
    })
  })


})