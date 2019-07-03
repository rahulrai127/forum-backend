
var models  = require('../models');
var express = require('express');
var router = express.Router();
var cors = require('cors')
const  jwt  =  require('jsonwebtoken');


const SECRET_KEY = "secretkey12345";

router.use(cors())

router.get('/:category_name', function(req, res) {
  
    var json = {
      "topic" : []
    }
    var topics;
    var likes;
    var users;
    


    var promise1 = new Promise(function(resolve, reject) { 
      models.Topic.findAll({
          where : {
              category : req.params.category_name
          }
      },{order: [['createdAt', 'DESC']]}).then(async function(user){
        topics = user;
        resolve(topics);
      })
      
    }); 
    var promise2 = new Promise(function(resolve, reject) { 
      models.Like.findAll().then(async function(user){
        likes = user;
        resolve(likes)
      })
      
    }); 
    var promise3 = new Promise(function(resolve, reject) { 
      models.User.findAll().then(async function(user){
        users = user;
        resolve(users)

      })
    }); 
    Promise.all([promise1,promise2,promise3]).then(function(results){
      var topicIds = [];
      for(var i =0;i<topics.length;i++)
      {
        var data = {
          "id" : topics[i].id,
          "name" : topics[i].title,
          "category": topics[i].category,
          "likes": topics[i].likeCount,
          "comments": topics[i].replyCount,
          "createdAt": topics[i].createdAt,
          "likedUserIcon": []
        }
        var likedUserIds = []
        for(var j=0;j<likes.length;j++)
        {
          if(likes[j].TopicId == topics[i].id)
          {
            likedUserIds.push(likes[j].UserId)
          }
        }
        var userUrl = []
        for(var j=0;j<likedUserIds.length;j++)
        {
          for(var z=0;z<users.length;z++)
          {
            if(likedUserIds[j] == users[z].id)
            {
              data.likedUserIcon.push({"url" :users[z].profileImage})
            }
          }
        }
        json.topic.push(data);
      }
      
        res.send(json);
    })
})

module.exports = router;
