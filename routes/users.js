var express = require('express');
var router = express.Router();
const querySql = require('../db/index')
const { PWD_SALT ,PRIVATE_KEY,TOKENTIME } = require('../utils/constant')
const { md5 } = require('../utils/index')
const jwt = require('jsonwebtoken')
/* 注册接口 */

router.post('/register', async (req, res, next)=> {
  
  let { username, password, nickname } = req.body
  try {
    let user = await querySql('select * from users where username=?', [username])
    console.log(user);
    if (!user || user.length === 0) {
      //md5加密
      password = md5(`${password}${PWD_SALT}`)
      await querySql('insert into users(username,password,nickname) value(?,?,?)', [username, password, nickname])
      res.send({ code: 0, msg: '注册成功' })
    }
    else {      
      res.send({code:-1,msg:'该账号已注册'})
    }
  }
  catch (e) {
    console.log(e);
    next();
  }
  
});
/* 登录接口 */
router.post('/login', async (req, res, next) => {
  let { username, password } = req.body
  try {
    //md5加密
    password = md5(`${password}${PWD_SALT}`)
    let result = await querySql('select * from users where username=? and password=?', [username, password])
    
    if (!result || result.length === 0) {   
      res.send({code:-1,msg:'账号或密码不正确'})
    }
    else {     
      //生成token,将用户名存入，也可以是其他用户信息，除开敏感信息
      let token=jwt.sign({username},PRIVATE_KEY,{expiresIn:TOKENTIME})
       res.send({code:0,msg:'登录成功',token:token})
    }
  }
  catch (e) {
    console.log(e);
    next(e);
  }
})

/*用户信息接口接口 */

router.get('/info', async (req, res, next) => {
  console.log(req.user);
  try {
    let userinfo = await querySql('select * from users where username=?', [req.user.username])
    res.send({code:0,msg:'成功',data:userinfo[0]})
  }
  catch (e) {
    console.log(e);
    next(e);
  }
} )
module.exports = router;
