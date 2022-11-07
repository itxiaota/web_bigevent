const db = require('../db/index')

// 导入解析 formdata 格式表单数据的包
const multer = require('multer')
// 导入处理路径的核心模块
const path = require('path')

// 创建 multer 的实例对象，通过 dest 属性指定文件的存放路径
const upload = multer({ dest: path.join(__dirname, '../uploads') })

// 发布文章
exports.addArticle = (req, res) => {
  // console.log(req.body) // 文本类型的数据
  // console.log('--------分割线----------')
  // console.log(req.file) // 文件类型的数据
  // 发布新文章的处理函数

  // 手动判断是否上传了文章封面
  if (!req.file || req.file.fieldname !== 'cover_img') return res.cus_err('文章封面是必选参数！')

  // TODO：表单数据合法，继续后面的处理流程...
  const articleInfo = {
    // 标题、内容、状态、所属的分类Id
    ...req.body,
    // 文章封面在服务器端的存放路径
    cover_img: path.join('/uploads', req.file.filename),
    // 文章发布时间
    pub_date: new Date(),
    // 文章作者的Id
    author_id: req.auth.id,
  }

  const sql = `insert into ev_articles set ?`


  // 执行 SQL 语句
  db.query(sql, articleInfo, (err, results) => {
    // 执行 SQL 语句失败
    if (err) return res.cus_err(err)

    // 执行 SQL 语句成功，但是影响行数不等于 1
    if (results.affectedRows !== 1) return res.cus_err('发布文章失败！')

    // 发布文章成功
    res.cus_err('发布文章成功', 0)
  })
}

// 获取文章列表
exports.getArticle = (req, res) => {
  // res.send('ok')
  /*
SELECT COUNT(id) FROM 表名 [WHERE 条件] LIMIT beginIndex, pageSize;
beginIndex 索引是从0开始的，从哪一条数据开始截取 beginIndex = (currentPage - 1) * pageSize;
pageSize 每次截取多少条数据
*/

  // 文章列表中，使用到 分类 名称，但文章列表仅有 分类 id ，因为使用多表查询 INNER JOIN  ，此处简写，直接使用 逗号 ,
  // 将分类表中id与文章表中id匹配，将对应分类名称取出作为 cate.name 显示在文章列表中
  if (req.query.pagenum == 1) {
    req.query.pagenum = 1
  }

  const cate_id = req.query.cate_id;
  const state = req.query.state;
  const pagenum = (req.query.pagenum - 1) * req.query.pagesize
  const pagesize = req.query.pagesize

  const sql = `select art.id, art.title, art.pub_date, art.state, cate.name as cate_name from ev_articles as art,ev_article_cate as cate where art.cate_id=cate.id and (art.cate_id='${cate_id}' or '${cate_id}'='') and (art.state='${state}' or '${state}'='') and art.is_delete=0 order by art.id desc limit ${pagenum},${pagesize}`

  db.query(sql, (err, result) => {
    //  sql 执行错误
    if (err) return res.cus_err(err)
    let total = 0

    // 文章列表页总数
    const countSql = `select count(id) as total from ev_articles where is_delete=0 and (cate_id='${cate_id}' or '${cate_id}'='') and (state='${state}' or '${state}'='')`
    db.query(countSql, (err, results) => {
      //  sql 执行错误
      if (err) return res.cus_err(err)

      total = results[0].total

      res.send({
        status: 0,
        message: '获取文章列表成功',
        data: result,
        total: total
      })
    })

  })
}

// 根据 id 删除 文章，通过 修改 is_delete 标识 ，达到模拟删除
exports.deleteArticle = (req, res) => {
  // res.send('ok')
  // 动态参数值  req.params 中
  const sql = 'update ev_articles set is_delete=1 where id=? and is_delete=0'
  db.query(sql, req.params.id, (err, result) => {
    // sql 语句出错
    if (err) return res.cus_err(err)

    // sql 正确，但 执行语句影响行数不为 1
    if (result.affectedRows !== 1) return res.cus_err('文章删除失败')

    // 删除成功
    res.send({
      status: 0,
      message: '文章删除成功'
    })
  })
}

// 根据 id 获取文章
exports.getArticleById = (req, res) => {
  const sql = `select * from ev_articles where id=${req.params.id}`
  db.query(sql, (err, result) => {
    if (err) return res.cus_err(err)

    res.send({
      status: 0,
      message: '文章获取成功',
      data: result[0]
    })
  })
}

// 根据 id 获取文章
exports.editArticleById = (req, res) => {

  // 手动判断是否上传了文章封面
  if (!req.file || req.file.fieldname !== 'cover_img') return res.cus_err('文章封面是必选参数！')

  const articleInfo = {
    // 标题、内容、状态、所属的分类Id
    ...req.body,
    // 文章封面在服务器端的存放路径
    cover_img: path.join('/uploads', req.file.filename),
  }
  // console.log(articleInfo, req.body.id);

  const sql = `update ev_articles set ? where id=?`

  db.query(sql, [articleInfo, req.body.id], (err, result) => {
    if (err) return res.cus_err(err)

    // sql 正确，但 执行语句影响行数不为 1
    if (result.affectedRows !== 1) return res.cus_err('文章更新失败')

    res.send({
      status: 0,
      message: '文章更新成功'
    })
  })

}

