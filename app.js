var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors')
const expressJWT =require('express-jwt')
const { PRIVATE_KEY } = require('./utils/constant')

var blogRouter = require('./routes/blogs');
var usersRouter = require('./routes/users');
 
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//登录拦截jwt解密token
app.use(expressJWT({
  algorithms:['HS256'],
  secret: PRIVATE_KEY
}).unless({
    path: ['/','/api/users/register', '/api/users/login','/api/blogs/blogs']//白名单，不需要登录验证
  }));


app.use('/api/blogs', blogRouter);
app.use('/api/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  if (err.name === 'UnauthorizedError') {
    //token验证失败就返回抱错
    res.status(401).send('token验证失败')
  }
  else {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  }
  
});

module.exports = app;
