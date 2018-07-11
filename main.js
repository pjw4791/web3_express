var express = require('express')
var app = express()

var fs = require('fs');

var topicRouter = require('./routes/topic');
var indexRouter = require('./routes/index');

var bodyParser = require('body-parser'); //body-parser 간편하게
var compression = require('compression'); //압축
var helmet = require('helmet'); //보안용

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(compression());
app.use(helmet());
app.use(function(request, response, next){
  fs.readdir('./data', function(error, filelist){
    request.list = filelist;
    next();//그 다음에 호출되어야할 미들웨어가 담겨있다. 실행이 그 다음에 되는 것!
  });
});

app.use('/', indexRouter);
app.use('/topic', topicRouter); // /topic으로 시작하는 것들은 topicRouter미들웨어를 사용하겠다. 

app.use(function(req, res, next){
  res.status(404).send('sorry cant find that!');
})

//http://expressjs.com/en/guide/error-handling.html
app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))