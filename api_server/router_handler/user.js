// 导入数据库模块
const db = require('../db/index')
// 导入密码加密模块 
const bcrypt = require('bcryptjs')
// 导入生成 Token 字符串的模块
const jwt = require('jsonwebtoken')
// 导入配置文件
const config = require('../config')




// 注册用户的路由处理函数
exports.regUser = (req, res) => {
  // 接收表单数据
  const userinfo = req.body
  // 判断数据合法性
  if (!userinfo.username || !userinfo.password) {
    return res.cus_err('用户名或密码不能为空~~')
    // return res.send({ status: 1, message: '用户名或密码不能为空~~' })
  }

  const sql = 'select * from ev_users where username=?'
  db.query(sql, userinfo.username, (err, result) => {
    // sql 语句执行失败
    if (err) return res.cus_err1(err)

    // 当前用户名已存在
    if (result.length > 0) {
      return res.cus_err('用户名被占用，请更换其他用户名~~')
    }

    // 使用 bcryptjs 模块对密码加密
    userinfo.password = bcrypt.hashSync(userinfo.password, 10)
    console.log('用户信息');
    console.log(userinfo);


    // 将注册用户的账号、密码添加至数据库
    const insertSql = 'insert into ev_users (username,password) values (?,?)'
    // const insertSql = 'insert into ev_users ?'
    // const insertRows = { username: userinfo.username, password: userinfo.password }
    db.query(insertSql, [userinfo.username, userinfo.password], (err, results) => {

      if (err) return res.send({ status: 1, message: err.message })

      // sql 执行成功，但影响行数不为1
      if (results.affectedRows !== 1) {
        return res.cus_err('注册用户失败，请稍后再试~~')
      }

      // 注册成功
      res.send({ status: 0, message: '注册成功' })

    })
  })




}

// 登录 路由处理函数
exports.login = (req, res) => {
  // res.send('login ok')

  const userinfo = req.body
  const sql = 'select * from ev_users where username=?'
  db.query(sql, userinfo.username, (err, result) => {
    // sql 语句执行错误
    if (err) return res.cus_err(err)
    // console.log(result, result.length, userinfo.password);

    // 没找到对应用户名
    if (result.length !== 1) return res.cus_err('用户名不存在，登录失败~~')

    // 用户参数中的密码 与 数据库保存的密码 对比
    const compareResult = bcrypt.compareSync(userinfo.password, result[0].password)
    // console.log(compareResult, '- ' + userinfo.password + ' -', '- ' + result[0].password + ' -');
    // console.log(userinfo.password === result[0].password);

    // 密码不对时
    if (!compareResult) return res.cus_err('密码不正确，登录失败~~')

    // 用户名，密码正确
    const user = { ...result[0], password: '', user_pic: '' }
    // id, username, nickname, email 有值，将 password 与 user_pic 的值重新赋值为空，避免生成 token 值时，将其添加在内

    // 生成 token 
    const tokenStr = jwt.sign(user, config.jwtSecretKey, { expiresIn: '1000h' }) // token 有效期为 1h

    // 将结果 ，响应给客户端
    res.send({
      status: 0,
      message: '登录成功~~',
      token: 'Bearer ' + tokenStr
    })
  })
}