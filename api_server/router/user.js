const express = require('express')
const expRouter = express.Router()



// 导入用户路由处理函数模块
const userHanlder = require('../router_handler/user')
// 导入用户路由处理函数模块
const exppressJoi = require('@escook/express-joi')
// 导入需要的验证规则对象
const { reg_login_schema } = require('../schema/user')

// 注册新用户
expRouter.post('/reguser', exppressJoi(reg_login_schema), userHanlder.regUser)

// 登录 
expRouter.post('/login', exppressJoi(reg_login_schema), userHanlder.login)

// 导出用户路由模块
module.exports = expRouter

