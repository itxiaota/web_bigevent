// 导入数据连接、配置
const db = require('../db/index')
const bcrypt = require('bcryptjs')

// req.auth.id token中id

// 获取用户信息
exports.userinfo = (req, res) => {
  // res.send('/userinfo ok')
  const id = req.auth.id
  const sql = 'select id,username,nickname,email,user_pic from ev_users where id=?'
  db.query(sql, id, (err, result) => {
    if (err) return res.cus_err(err)

    // sql 查找成功，但不止一行数据
    if (result.length !== 1) {
      return res.cus_err('获取用户信息失败~~')
    }

    res.send({
      status: 0,
      message: '获取用户基本信息成功~~',
      data: result[0]
    })


  })
}

// 更新用户信息
exports.updateUserInfo = (req, res) => {
  // res.send('updateUserInfo ok')
  // const id = req.query.id

  const sql = 'update ev_users set ? where id=?'
  db.query(sql, [req.body, req.body.id], (err, result) => {
    // 执行 SQL 语句失败
    if (err) return res.cus_err(err)

    if (result.affectedRows !== 1) return res.cus_err('修改用户基本信息失败~~')

    return res.cus_err('修改用户基本信息成功~~', 0)
  })
}


// 重置密码的处理函数
exports.updatePassword = (req, res) => {

  // 定义根据 id 查询用户数据的 SQL 语句
  const sql = `select * from ev_users where id=?`
  // 执行 SQL 语句查询用户是否存在
  // id 是使用 token 中的 id 
  db.query(sql, req.auth.id, (err, result) => {

    // 执行 SQL 语句失败
    if (err) return res.cus_err(err)
    // 检查指定 id 的用户是否存在
    if (result.length !== 1) return res.cus_err('用户不存在！')
    // TODO：判断提交的旧密码是否正确
    // 判断提交的旧密码是否正确
    const compareResult = bcrypt.compare(req.body.oldPwd, result[0].password)
    if (!compareResult) return res.cus_err('原密码错误！')

    // 定义更新用户密码的 SQL 语句
    const updatesql = `update ev_users set password=? where id=?`
    // 对新密码进行 bcrypt 加密处理
    const newPwd = bcrypt.hashSync(req.body.newPwd, 10)
    // 执行 SQL 语句，根据 id（token 中获取的id） 更新用户的密码
    db.query(updatesql, [newPwd, req.auth.id], (err, results) => {
      // SQL 语句执行失败
      if (err) return res.cus_err(err)
      // SQL 语句执行成功，但是影响行数不等于 1
      if (results.affectedRows !== 1) return res.cus_err('更新密码失败！')
      // 更新密码成功
      res.cus_err('更新密码成功！', 0)
    })
  })


}



// 更新用户头像的处理函数
exports.updateAvatar = (req, res) => {
  // res.send('ok')
  const sql = 'update ev_users set user_pic=? where id=?'
  db.query(sql, [req.body.avatar, req.auth.id], (err, result) => {
    if (err) return res.cus_err(err)

    // 执行 SQL 语句成功，但是影响行数不等于 1
    if (result.affectedRows !== 1) return res.cus_err('更新头像失败~~')

    // 更新用户头像成功
    res.send({
      status: 0,
      message: '更新用户头像成功'
    })
  })
}