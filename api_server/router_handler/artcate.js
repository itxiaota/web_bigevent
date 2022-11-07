const db = require('../db/index')

exports.getArticleCates = (req, res) => {
  // res.send('ok')
  const sql = 'select * from ev_article_cate where is_delete=0 order by id asc'
  db.query(sql, (err, result) => {
    if (err) return res.cus_err(err)

    res.send({
      status: 0,
      message: '获取文章分类列表成功~~',
      data: result
    })
  })
}

exports.addArticleCates = (req, res) => {
  // res.send('ok')
  const sql = 'select * from ev_article_cate where name=? or alias=?'
  db.query(sql, [req.body.name, req.body.alias], (err, result) => {
    if (err) return res.cus_err(err)

    // 存在多行数据
    if (result.length > 0) return res.cus_err('分类名称与别名被占用，请更换后重试~~')

    // 对名称与别名分别判断 ，或许二者并不在一行数据中
    if (result.length === 1 && result[0].name === req.body.name) return res.cus_err('分类名称被占用，请更换后重试~~')
    if (result.length === 1 && result[0].alias === req.body.alias) return res.cus_err('分类别名被占用，请更换后重试~~')

    // 添加分类
    const insertSql = 'insert into ev_article_cate set ?'
    db.query(insertSql, req.body, (err, results) => {

      // sql 执行错误
      if (err) return res.cus_err(err)

      // 数据库添加行为，受影响行数不为1
      if (results.affectedRows !== 1) return res.cus_err('新增文章分类失败~~')

      // 添加成功
      res.send({
        status: 0,
        message: '新增文章分类成功'
      })
    })
  })
}

// 删除文章分类的处理函数
exports.deleteCateById = (req, res) => {

  const sql = `update ev_article_cate set is_delete=1 where id=?`
  db.query(sql, req.params.id, (err, result) => {
    console.log(result);
    if (err) return res.cus_err(err)

    if (result.affectedRows !== 1) return res.cus_err('删除文章分类失败~~')

    res.send({
      status: 0,
      message: '删除文章分类成功'
    })
  })

}

// 根据 Id 获取文章分类的处理函数
exports.getArticleById = (req, res) => {
  // res.send('ok')
  const sql = 'select * from ev_article_cate where id=?'
  db.query(sql, req.params.id, (err, result) => {
    // sql 错误
    if (err) return res.cus_err(err)

    if (result.length !== 1) return res.cus_err('获取文章分类失败~~')

    res.send({
      status: 0,
      message: '获取文章分类数据成功！',
      data: result[0]
    })
  })
}


// 更新文章分类的处理函数
exports.updateCateById = (req, res) => {
  // res.send('ok')
  const sql = 'select * from ev_article_cate where id<>? and (name=? or alias=?);'
  db.query(sql, [req.body.id, req.body.name, req.body.alias], (err, result) => {
    // sql 错误
    if (err) return res.cus_err(err)

    // 当前所写分类名称或别名存在重复
    if (result.length === 2) return res.cus_err('分类名称与别名被占用，请更换后重试！')
    if (result.length === 1 && result[0].name === req.body.name) return res.cus_err('分类名称被占用，请更换后重试！')
    if (result.length === 1 && result[0].alias === req.body.alias) return res.cus_err('分类别名被占用，请更换后重试！')

    // 更新文章分类
    const updateSql = 'update ev_article_cate set ? where id=?'
    db.query(updateSql, [req.body, req.body.id], (err, results) => {
      // sql 语句执行失败
      if (err) return res.cus_err(err)

      // sql 语句成功，但受影响行数不为1
      if (results.affectedRows !== 1) return res.cus_err('更新文章分类失败！')

      res.send({ status: 0, message: '更新文章分类成功！' })
    })

  })
}