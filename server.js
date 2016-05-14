//
// # SimpleServer
//
// A simple chat server using Socket.IO, Express, and Async.
//
var express             = require('express');
var app                 = express();
var server              = require('http').createServer(app);
var io                  = require("socket.io").listen(server);
var bodyParser          = require('body-parser');
var port                = process.env.PORT || 8080;
var client              = require('./modules/mysql.js');
var macfromip           = require('macfromip');
var bodyParser 	 	= require('body-parser');
var morgan              = require('morgan');
var router 		= express.Router();
var exec 		= require('child_process').exec;
var config 		= require('./config.js');
var fbConfig		= require('./social/fb.js');
var passport 		= require('passport');
var FacebookStrategy 	= require('passport-facebook').Strategy;

//
// ## SimpleServer `SimpleServer(obj)`
//
// Creates a new instance of SimpleServer with the following options:
//  * `port` - The HTTP port to listen on. If `process.env.PORT` is set, _it overrides this value_.
//

passport.use('facebook', new FacebookStrategy({
  clientID        : fbConfig.appID,
  clientSecret    : fbConfig.appSecret,
  callbackURL     : fbConfig.callbackUrl
}, 
function(access_token, refresh_token, profile, done) {
    // asynchronous
    process.nextTick(function() {
	console.log(profile);
    });
}));



io.on('connection', function (socket) {
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials','true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization, Access-Control-Allow-Origin, Access-Control-Allow-Headers,X-Requested-With, Content-Type, Accept');
  res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  next();
});

app.use('/api',router);

router.use(function(req, res, next) {
  console.log("algo ha pasado");
  next();
});

router.get('/', function(req, res) {
  res.json({message: 'ok api set'});
});

router.get('/login/facebook', 
  passport.authenticate('facebook', { scope : 'email' }
));

router.get('/login/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect : '/home',
    failureRedirect : '/'
  })
);

router.route('/user/')
  .post(function(req,res){
    var user = req.body.username;
    var password = req.body.password;
    console.log(req.ip.split(":"));
    var ip = (req.ip).split(":")[3].trim();
    console.log(ip);
    macfromip.getMac(ip, function(err, data){
      if(err){
        console.log(err);
        res.send(403)
      }
      console.log(data);
      var mac = data;
      client.login(user,password).then(function(result){
	console.log(result);
        res.send(200)
      },function(err){
	console.log(err);
        res.send(403)
      })
    });
  })

server.listen(port);
console.log("ok api set");
