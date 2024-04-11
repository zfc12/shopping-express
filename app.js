var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);


const userRouter = require('./routes/user');
const homeRouter = require('./routes/home');
const searchRouter = require('./routes/search');
const productDetailRouter = require('./routes/detail');
const cartRouter = require('./routes/cart');
const orderRouter = require('./routes/order');
const profileRouter = require('./routes/profile');
const categoryRouter = require('./routes/category');
const addressRouter = require('./routes/address');

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


const redisClient = require('./db/redis');
// let redisStore = new RedisStore({
//   client: redisClient
// })
const sessionStore = new RedisStore({
  client: redisClient
})
app.use(session({
  secret: 'WJiol#1223_',
  cookie: {
    path: '/',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  },
  store: sessionStore,
  resave: false,
  saveUninitialized: false
}))


app.use('/api/user', userRouter);
app.use('/api/home', homeRouter);
app.use('/api/search', searchRouter);
app.use('/api/detail', productDetailRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);
app.use('/api/profile', profileRouter);
app.use('/api/category', categoryRouter);
app.use('/api/address', addressRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
