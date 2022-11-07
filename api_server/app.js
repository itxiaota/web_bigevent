// 导入 创建 Web 服务器 模块 express
const express = require('express')
// 创建 web服务器 实例
const app = express()

// 配置静态文件管理
app.use(express.static('./web'))
// 托管静态资源文件
app.use('/uploads', express.static('./uploads'))

// 导入 cors 中间件
const cors = require('cors')
// 将 cors 注册为全局中间件
app.use(cors())


// 响应数据的中间件
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.cus_err = (err, status = 1) => {
    res.send({
      status,
      message: err instanceof Error ? err.message : err
    })
  }
  next()
})

// 导入配置文件
const config = require('./config')
// 导入 解析token字符串的中间件
const { expressjwt: expressJWT } = require('express-jwt')
// 注册全局解析token中间件
app.use(expressJWT({ secret: config.jwtSecretKey, algorithms: ["HS256"], }).unless({ path: [/^\/api\//] }))
// 使用 .unless({ path: [/^\/api\//] }) 指定哪些接口不需要进行 Token 的身份认证


// 注册解析 普通 application/x-www-form-urlencoded 数据
app.use(express.urlencoded({ extended: false }))

// 导入并注册用户路由模块
const userRouter = require('./router/user')
app.use('/api', userRouter)
// 导入用户信息路由模块
const userinfoRouter = require('./router/userinfo')
app.use('/my', userinfoRouter)
// 导入并使用文章分类路由模块
const artCateRouter = require('./router/artcate')
// 为文章分类的路由挂载统一的访问前缀 /my/article
app.use('/my/article', artCateRouter)
// 导入并使用文章路由模块
const articleRouter = require('./router/article')
// 为文章的路由挂载统一的访问前缀  /my/article
app.use('/my/article', articleRouter)


const joi = require('joi')

// 错误中间件
app.use(function (err, req, res, next) {
  // 数据验证失败
  if (err instanceof joi.ValidationError) return res.cus_err(err)
  // token 验证失败的错误
  if (err.name === 'UnauthorizedError') {
    return res.cus_err('身份验证失败~~')
  }
  // 未知错误
  res.cus_err(err.message, 2)
})

app.listen(3007, () => {
  console.log('api server running at http://127.0.0.1:3007');
})