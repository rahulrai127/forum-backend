var models  = require('../models');
var express = require('express');
var md5 = require('md5');
const  bcrypt  =  require('bcryptjs'); 
var router = express.Router();
var cors = require('cors')


router.use(cors())

router.post('/', function(req, res) {

  var Email = req.param('user')["email"];
  var Password = md5(req.param('user')["password"]);
  models.User.findOne({
      where : {
          email : Email,
          password : Password
      }
  }).then(function(users) {
      if(users != undefined)
      {
        res.send({ "user" : {
            "userID": users["id"],
            "username":users["username"],
            "createdAt":users["createdAt"],
            "email" : users["email"],
            "profileImage":users["profileImage"]
        }})
      }
      else{
          res.send("either of email or password is incorrect");
      }
    
    });
});


module.exports = router;
