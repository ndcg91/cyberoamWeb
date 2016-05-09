var config		= require('./config.js');
var mysql               = require('mysql');
var exports             = module.exports = {}
var Promise 		= require('bluebird')
var connection = mysql.createConnection({
  host     : config.host,
  user     : config.user,
  password : config.password,
  database : config.db
});



function createUser(user,pass){
  return new Promise(function (resolve,reject){
    var values = {username:user,attribute:'User-Password',op:':=',value:pass};
    console.log(values);
    connection.query('INSERT INTO radcheck SET ?',values,function(err,result){
      if (err){
        reject()
      }
      else{
        resolve(result)
      }
    });
  })
}

function checkUser(user,pass){
  return new Promise(function (resolve,reject) {
    console.log("checking user" + user + " " + pass);
    connection.query('Select * from radcheck where username = "'+user+'" and value = "'+pass+'"',function(err,rows,fields){
      if (err){
	console.log(err);
        reject()
      }
      else{
	//console.log(rows,fields);
        return resolve(rows)
      }
    });
  })
}




exports.login = function(user,pass){
    return new Promise(function (resolve,reject){
        checkUser(user,pass).then(function(res){
            if (res.length > 0){
                //user has been already created
                resolve(true)
            }
            else{
                //user has not been created
                createUser(user,pass).then(function(res){
                    resolve(true)
                }, function(err){
                    reject()
                })
            }
        },function(err){
            reject();
        })
    })
}

