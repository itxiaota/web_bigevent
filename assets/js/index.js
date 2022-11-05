$(function () {



  getUserInfo()


  // 退出登录
  $('#logout').on('click', function () {
    layer.confirm('退出登录?', { icon: 3, title: '提示' }, function (index) {
      //do something
      localStorage.removeItem('token')
      location.href = '/login.html'

      layer.close(index);
    });
  })

})

// 获取用户信息
function getUserInfo() {
  $.ajax({
    method: 'get',
    url: '/my/userinfo',
    headers: {
      Authorization: localStorage.getItem('token')
    },
    success: function (res) {
      if (res.status != 0) return layer.msg('获取用户信息失败')
      // console.log(res);
      res = res.data
      // 修改头像及用户昵称
      if (res.user_pic) {
        $('.user-avatar img').attr('src', res.user_pic)
      }
      if (res.nickname) {
        $('#nickname').text(res.nickname)
      } else {
        $('#nickname').text(res.username)
      }
    },
    // complete: function (res) {
    //   console.log(res);
    //   // res.responseJSON.message 存在变数，应用另一个属性表示
    //   if (res.responseJSON.status === 1 && res.responseJSON.message === '身份验证失败~~') {
    //     // 清空 token  并跳转到登录页
    //     localStorage.removeItem('token')
    //     location.href = '/login.html'
    //   }
    // }
  })
}