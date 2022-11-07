$(function () {
  var layer = layui.layer
  var form = layui.form
  // 分页
  var laypage = layui.laypage;

  var q = {
    pagenum: 1, // 页码
    pagesize: 3, // 每次请求多少行数据
    cate_id: '', // 文章分类的id
    state: '' // 文章的状态，可选：'已发布'，'草稿'
  }

  // 模板过滤函数
  template.defaults.imports.dateform = function (value) {
    const dt = new Date(value)

    var y = dt.getFullYear()
    var m = padZero(dt.getMonth() + 1)
    var d = padZero(dt.getDate())

    var hh = padZero(dt.getHours())
    var mm = padZero(dt.getMinutes())
    var ss = padZero(dt.getSeconds())

    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`

  }

  // 位数补零
  function padZero(d) {
    return d < 10 ? '0' + d : d
  }

  // 获取文章列表
  function initTable() {
    $.ajax({
      method: 'get',
      url: '/my/article/list',
      data: q,
      success: function (res) {
        if (res.status !== 0) return layer.msg('文章列表获取失败')

        // 文章列表获取成功
        var htmlStr = template('temp_table', res)
        $('tbody').html(htmlStr)

        // 渲染分页
        pagingRender(res.total)
      }
    })
  }

  // 获取文章类别 
  function initArtCate() {
    $.ajax({
      method: 'get',
      url: '/my/article/cates',
      success: function (res) {
        if (res.status !== 0) return layer.msg('文章分类列表获取失败')
        var htmlStr = template('temp_cates', res)

        $('[name=cate_id]').html(htmlStr)
        // 因 layui 渲染机制，需要告诉 layui 重新渲染
        form.render()
      }
    })
  }

  initTable()
  initArtCate()

  // 筛选条件 
  $('#artFilter').on('click', function () {
    // 获取筛选项的值 
    var cate_id = $('[name=cate_id]').val()
    var state = $('[name=state]').val()
    // 重新修改 查询参数
    q.cate_id = cate_id
    q.state = state

    // 重新请求列表数据 
    initTable()
  })

  // 渲染分页
  function pagingRender(total) {
    //执行一个laypage实例
    laypage.render({
      elem: 'paging', //注意，这里的 test1 是 ID，不用加 # 号    
      count: total, //数据总数，从服务端得到
      curr: q.pagenum,
      limit: q.pagesize,
      layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
      limits: [2, 3, 5, 10],
      jump: function (obj, first) {
        //obj包含了当前分页的所有参数，比如：
        // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
        // console.log(obj.limit); //得到每页显示的条数
        q.pagenum = obj.curr
        q.pagesize = obj.limit

        //首次不执行
        if (!first) {
          //do something
          initTable()
        }
      }
    });
  }

  // 删除文章
  $('tbody').on('click', '.del_art', function (e) {
    e.preventDefault();
    var id = $(this).data('id');

    layer.confirm('确定删除?', { icon: 3, title: '提示' }, function (index) {

      $.get('/my/article/delete/' + id, function (res) {
        if (res.status !== 0) return layer.msg('删除文章失败')

        var delLen = $('.del_art').length // 删除按钮个数
        if (delLen === 1) {
          // 删除按钮为1时，表示此时表格当前页已无数据，
          // 不判断0，是因为页面需要删除最后一行表格数据，才会执行到这里
          // 注意：如果只有最后一页，且将全部表格数据删完时，应将页码保持在 1 
          q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
        }

        initTable()
        layer.msg('删除文章成功')
      })

      layer.close(index);
    });


  })

  // 编辑文章
  $('tbody').on('click', '.edit_art', function (e) {
    e.preventDefault()

    localStorage.setItem('art_id', $(this).data('id'))
    location.href = '/article/artedit.html'
  })


})