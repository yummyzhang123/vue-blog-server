var express = require('express');
var router = express.Router();
const querySql =require('../db/index')
/* 新增博客接口 */

router.post('/add', async (req, res, next) => {
    let { title, content, categories } = req.body
    let {username} = req.user
  try {
    let result = await querySql('select id from users where username=?', [username])
    let user_id=result[0].id
      console.log(user_id);
      await querySql('insert into blogs(title,content,user_id,create_time,author,categories) values(?,?,?,NOW(),?,?)', [title, content, user_id, username, categories])
    
    res.send({ code: 0, msg: '新增成功',data:null })
  }
  catch (e) {
    console.log(e);
    next();
  }
  
});
/* 删除博客接口 */

router.post('/delete', async (req, res, next) => {
    let { blogid } = req.body
    console.log(blogid)
  try {
      await querySql('UPDATE blogs SET state =1 WHERE (id = ?)',[blogid])
      res.send({ code: 0, msg: '删除成功',data:null })
  }
  catch (e) {
    console.log(e);
    next();
  }
  
});
/* 查找全部博客接口 */

router.get('/blogs', async (req, res, next) => {
  try {
    let result = await querySql('select id,title,categories,author,content,DATE_FORMAT(create_time,"%Y-%m-%d %H:%i:%s") AS create_time from blogs') 
    res.send({ code: 0, msg: '查找成功',data:result})
  }
  catch (e) {
    console.log(e);
    next();
  }
  
});
/* 查找单个博客接口 */

router.get('/oneblog', async (req, res, next) => {
    let { blogid } = req.query 
    
    try {
      let result=await querySql('select id,title,content,categories,author,DATE_FORMAT(create_time,"%Y-%m-%d %H:%i:%s") AS create_time from blogs where id = ?',[blogid])
      res.send({ code: 0, msg: '查找成功', data: result[0] })      
    }
    catch (e) {
    console.log(e);
    next();
  }

  
});
module.exports = router;