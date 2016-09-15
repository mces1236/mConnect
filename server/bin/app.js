var lib = require('./lib/lib'),
    express = require('express'),
    session = require('express-session'),
    bodyParser = require('body-parser'),
    path = require('path'),
    cookieParser = require('cookie-parser'),
    morgan = require('morgan'),
    hbs = require('hbs'),
    mongoose = require('mongoose'),
    MongoStore = require('connect-mongo')(session),
    url = require('url'),
    methodOverride = require('method-override');

var app = express();
lib.connectors.mongo.connect(lib.configs.mongoConfig.mConnectDb);

// setup the logger
app.use(morgan('combined',{ "stream": lib.utils.logger.stream }));

app.set('views', path.join(__dirname, 'views/error'));
app.set('view engine', 'hbs');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(methodOverride());
app.set('trust proxy', 1);
app.use(session({
  genid: function(req) {
    return genuuid() // use UUIDs for session IDs
  },
  secret: lib.configs.baseConfig.get("sessionKey"),
  name: "SESSION",
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  proxy: true,
  resave: true,
  saveUninitialized: false,
  cookie: { secure: true }
}));

//app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));

//CORS middleware
var allowCrossDomain = function(req, res, next) {
    var alloworigins = '';
    lib.configs.baseConfig.get("alloworigins").forEach(function(item){
      alloworigins += item +',';
    })
    res.header('Access-Control-Allow-Origin', '*'); 
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Credentials', true);

    var ref = req.headers.referer;
    if(ref) {
      // We got a referer
      var u = url.parse(ref);
      lib.configs.baseConfig.get("alloworigins").forEach(function(item){
        if(item="*" || (u && u.hostname === item)) { //sporfy.com
          // Correct host, process the request
          return next();
        }
      })
    }
    // Send some kind of error
    res.status(403).send('Oops! Invalid origin. You are not allowed to access.');
}


/* APIs and Routes */
//app.use('/'+lib.configs.baseConfig.get("version"), oauth);
//app.use('/'+lib.configs.baseConfig.get("version"), client);

app.use(allowCrossDomain);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Page Not Found :(');
  err.status = 404;
  next(err);
});


// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
     lib.utils.logger.error('%s %d %s %s', req.method, res.statusCode, err.status, err.message);
     res.render('error', {
      message: err.message,
      error: err,
      devMessage: "Error messages are displayed for development environment and will not be displayed on production"
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  lib.utils.logger.error('%s %d %s %s', req.method, res.statusCode, err.status, err.message);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
