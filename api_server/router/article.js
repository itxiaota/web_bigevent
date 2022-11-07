const express = require('express')
const router = express.Router()

const article_hanlder = require('../router_handler/article')



// 导入 multer 和 path
const multer = require('multer')
const path = require('path')
const expressJoi = require('@escook/express-joi')

// 创建 multer 的实例
const uploads = multer({ dest: path.join(__dirname, '../uploads') })

// 导入表单验证规则 
const { add_article_schema, delete_article_schema, edit_article_schema } = require('../schema/article')

// 发布文章
router.post('/add', uploads.single('cover_img'), expressJoi(add_article_schema), article_hanlder.addArticle)
// 获取文章列表
router.get('/list', article_hanlder.getArticle)
// 根据id删除文章数据
router.get('/delete/:id', expressJoi(delete_article_schema), article_hanlder.deleteArticle)
// 根据id获取文章数据
router.get('/:id', expressJoi(delete_article_schema), article_hanlder.getArticleById)
// 根据id更新文章数据
router.post('/edit', uploads.single('cover_img'), article_hanlder.editArticleById)

module.exports = router