//放常量的配置
//加密的密钥
module.exports = {
    PWD_SALT: 'myblog', //密码注册时MD5加密时的密钥
    PRIVATE_KEY: 'mylogged' ,//token的密钥
    TOKENTIME: 60*60*24//token密钥的过期时间(定为24小时)
}