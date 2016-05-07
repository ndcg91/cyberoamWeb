var mysql               = require('mysql');
var exports             = module.exports = {}
var connection = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'root',
  password : 'admin',
  database : 'radius'
});



function createUser(user,pass){
  return new Promise((resolve,reject) => {
    var values = {username:user,attribute:'User-Password',op:':=',value:pass};
    connection.query('INSERT INTO radcheck SET ?',values,function(err,result){
      if (err){
        return reject
      }
      else{
        return resolve(result)
      }
    });
  })
}

function checkUser(user,pass){
  return new Promise((resolve,reject) => {
    connection.query('Select * from radcheck where username ='+user+'and value ='+pass,function(err,rows,fields){
      if (err){
        return reject
      }
      else{
        return resolve(rows)
      }
    });
  })
}




exports.login = function(user,pass){
    return new Promise((resolve,reject){
        checkUser(user,pass).then(function(res){
            if (res.length > 0){
                //user has been already created
                return resolve(true)
            }
            else{
                //user has not been created
                createUser(user,pass).then(function(res){
                    return resolve(true)
                }, function(err){
                    return reject
                })
            }
        },function(err){
            return reject
        })
    })
}

