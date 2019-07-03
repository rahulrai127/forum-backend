var models  = require('../models');
var express = require('express');
const  bcrypt  =  require('bcryptjs'); 
var router = express.Router();
var cors = require('cors');


router.use(cors())

router.post('/session', function(req, res) {
  models.User.create({
    username: req.param('user')["username"],
    password : bcrypt.hashSync(req.param('user')["password"]),
    email:req.param('user')["email"],
    profileImage:null
  })

  var Email = req.param('user')["email"];
  
  models.User.findOne({
      where : {
          email : Email
      }
  }).then(function(users) {
    res.send({ "user" : {
        "userID": users["id"],
        "username":users["username"],
        "createdAt":users["createdAt"],
        "email" : users["email"],
        "profileImage" : null
    }})
    });  
});



module.exports = router;
