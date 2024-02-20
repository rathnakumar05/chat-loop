var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var http = require("http");
var socketio = require("socket.io");
var cors = require('cors');
var session = require('express-session');
const mongoStore = require('connect-mongo');
var mongoose = require('mongoose');
var router = express.Router();
var socketConnection = require('./socketio');


var authRouter = require('./routes/auth');
var indexRouter = require('./routes/index');
var contactRouter = require('./routes/contact');
var messageRouter = require('./routes/message');

var app = express();

app.use(express.static(path.join(__dirname, '../frontend/build')));
var sessionMiddleware = session({
  name: 'sid',
  secret: "secret!session",
  saveUninitialized: true,
  resave: false,
  store: mongoStore.create({
    mongoUrl: 'mongodb://admin:12345678@localhost:27017/chat_loop?authSource=admin',
    collection: 'session',
    ttl: parseInt(1000 * 60 * 60 * 2) / 1000
  }),
  cookie: {
    sameSite: true,
    secure: false,
    maxAge: parseInt(1000 * 60 * 60 * 2)
  }
});
app.use(sessionMiddleware);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use("/test", indexRouter);
app.use("/auth", authRouter);
app.use("/contact", contactRouter);
app.use("/message", messageRouter);

//uncomment after build
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
// });

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

const server = require('http').createServer(app);

const io = socketio(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);

io.use(wrap(sessionMiddleware));

socketConnection(io);

module.exports = {
  app: app,
  server: server
};
