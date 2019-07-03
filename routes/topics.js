
var models  = require('../models');
var express = require('express');
var router = express.Router();
var cors = require('cors')
const  jwt  =  require('jsonwebtoken');


const SECRET_KEY = "secretkey12345";

router.use(cors())
router.post('/', function(req, res) {

    models.Topic.create({
      UserId: 1,
      title:req.param('topic')["title"],
      category:req.param('topic')["category"],
      content : req.param('topic')["content"],
      lastReply:null,
      replyCount:0,
      viewCount:0,
      userCount : 0,
      likeCount: 0
    }).then(function(user){
      return res.send({
        "topic" : {
          "title" : req.param('topic')["title"],
          "category":req.param('topic')["category"],
          "content" : req.param('topic')["content"],
        }
      });
  });
});


router.patch('/:topic_id', function(req, res) {
    if(req.param('topic')["title"]!=undefined)
    {
        models.Topic.update({
        title:req.param('topic')["title"],
      },
      {
        where : 
        {
          id: req.params.topic_id,
          UserId : 1
        }
      })
    }
    if(req.param('topic')["category"]!=undefined)
    {
      models.Topic.update({
        category:req.param('topic')["category"],
      },
      {
        where : 
        {
          id: req.params.topic_id,
          UserId : 1
        }
      })
    }
    if(req.param('topic')["content"]!=undefined)
    {
      models.Topic.update({
        content:req.param('topic')["content"],
      },
      {
        where : 
        {
          id: req.params.topic_id,
          UserId : 1
        }
      })
    }
    models.Topic.findOne({where : {id: req.params.topic_id,UserId : 1}}).then(function(user){
      if(user != undefined)
        return res.send({
          "topic" : {
            "topicID" : user.id,
            "title" : user.title,
            "category" : user.category,
            "content" : user.content,
            "createdAt" : user.createdAt,
            "updatedAt":user.updatedAt,
            "postedBy" : "Enigma_rx27"
          }
        });
  });
});




router.delete('/:topic_id', function(req, res) {

    models.Topic.findOne({where : {id: req.params.topic_id}}).then(function(topic){

      var result = 
        {
          "topic": {
            "topicID" : topic.id,
            "title": topic.title,
            "category": topic.category,
            "content": topic.content,
            "createdAt": topic.createdAt,
            "updatedAt":topic.updatedAt,
            "postedBy": "Enigma_rx27"
        }
        
      }



      models.Topic.destroy({where : {id: req.params.topic_id}}).then(function(topic){
      models.Topic.findOne({where : {id: req.params.topic_id}}).then(function(topic){
      
      if(topic == undefined)
        return res.send(result);
      });
      });

});
});


router.post('/:topic_id/likes', function(req, res) {
    models.Like.create({
      UserId: 1,
      TopicId: req.params.topic_id
    })
    models.Topic.findOne({
      where : {
        id: req.params.topic_id
      }
    }).then(function(user){
      models.Topic.update({
        likeCount : user.likeCount+1
      },{
        where : {
          id: req.params.topic_id
        }
      })
  }).then(function(user){
  models.Topic.findOne({
    where : {
      id: req.params.topic_id
    }
  }).then(function(user){
    res.send(user)                //have to change this
  })});    
});

router.delete('/:topic_id/likes', function(req, res) {
  models.Like.destroy({
      where : {
        UserId: 1,
        TopicId: req.params.topic_id
      }
    }).then(function(user){
    models.Topic.findOne({
      where : {
        id: req.params.topic_id
      }
    }).then(function(user){
      models.Topic.update({
        likeCount : user.likeCount-1
      },{
        where : {
          id: req.params.topic_id
        }
      })
  }).then(function(users){
  models.Topic.findOne({
    where : {
      id: req.params.topic_id
    }
  }).then(function(user){
    res.send(user)        //have to change this
  })});    
})  
});






router.post('/:topic_id/comments', function(req, res) {
  
    models.Topic.findOne({
      where : {
        id: req.params.topic_id
      }
    }).then(function(user){
      models.Topic.update({

        replyCount : user.replyCount+1
      },{
        where : {
          id: req.params.topic_id
        }
      })
  }).then(function(user){
    models.Comment.create({
      UserId: 1,
      TopicId : req.params.topic_id,
      content : req.param('comment')["content"]
    }).then(function(user){
      res.send({
        "comment" : {
          "commentID"  :  user.id,
          "content": user.content,
          "createdAt": user.createdAt,
          "updatedAt": user.updatedAt
        }
      })
    })
  });
});

router.delete('/:topic_id/comments/:comment_id', function(req, res) {
  models.Comment.findOne({
    where : {
      UserId: 1,
      TopicId: req.params.topic_id,
      id: req.params.comment_id
    }
  }).then(function(comment) {

    var result = {
      "comment" : {
        "commentID" : comment.id,
        "content": comment.content,
        "createdAt": comment.createdAt,
        "updatedAt": comment.updatedAt,
        "postedBy": "Enigma_rx27"
      }
    }

  models.Comment.destroy({
      where : {
        UserId: 1,
        TopicId: req.params.topic_id,
        id: req.params.comment_id
      }
    }).then(function(comment) 
    {
      models.Comment.findOne({
        where : {
        id: req.params.comment_id
      }
    }).then(function(user){
      if(user != null)
      {
        res.send("you are unauthorized to delete this comment")
      }
      else{
        models.Topic.findOne({
          where : {
            id: req.params.topic_id
          }
        }).then(function(user){
          models.Topic.update({
            replyCount : user.replyCount-1
          },{where : {
            id: req.params.topic_id
          }})
        })
        
        res.send(result)
      }
    })
}) 
  })
});

router.patch('/:topic_id/comments/:comment_id', function(req, res) {
  
    models.Comment.update({
      content : req.param('comment')["content"]
    },{
      where : {
        UserId: 1,
        TopicId: req.params.topic_id,
        id: req.params.comment_id
      }
    }).then(function(user){
      models.Comment.findOne({where : {
        UserId: 1,
        TopicId: req.params.topic_id,
        id: req.params.comment_id
      }}).then(function(user){
      res.send({
          "comment": {
            "commentID" : 1, 
            "commentID" : user.id,
            "content": user.content,
            "createdAt": user.createdAt,
            "updatedAt": user.updatedAt,
            "postedBy": "Enigma_rx27"
        }        
      })
    })
  })
});












router.get('/', function(req, res) {
  
    var json = {
      "topic" : []
    }
    var topics;
    var likes;
    var users;
    


    var promise1 = new Promise(function(resolve, reject) { 
      models.Topic.findAll({order: [['createdAt', 'DESC']]}).then(async function(user){
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







router.get('/:topic_id', function(req, res) {
  var json = {
    "topic" : []
  }
  var topics;
  var comments;
  var users;
  var likes;

  var promise1 = new Promise(function(resolve, reject) { 
    models.Topic.findOne({where : {
      id : req.params.topic_id
    }}).then(async function(user){
      topics = user;

    resolve(topics);
    })
  }); 

  var promise2 = new Promise(function(resolve, reject) { 
    models.Comment.findAll({where : {
      TopicId : req.params.topic_id
    }},{order: [['updatedAt', 'DESC']]}).then(async function(user){
      comments = user;
      resolve(comments)
    })
  }); 
  var promise3 = new Promise(function(resolve, reject) { 
    models.User.findAll().then(async function(user){
      users = user;
      resolve(users)
    })
  }); 

  var promise4 = new Promise(function(resolve,reject)
  {
    models.Like.findOne({
      where : {
        UserId : 1,
        TopicId : req.params.topic_id
      }
    }).then(function(like){
      if(like === null)
      {
        likes = false;
      }
      else{
        likes = true;
      }
      resolve(likes);
    })
  })


  Promise.all([promise1,promise2,promise3,promise4]).then(function(results){

    
    
    console.log("Like Value right here .............!!")
    console.log(likes)

      var data ={"topic" : {
        "name" : topics.title,
        "content": topics.content,
        "username":null,
        "category": topics.category,
        "createdAt": topics.createdAt,
        "createdBy":null,
        "lastReply":topics.lastReply,
        "replyCount": topics.replyCount,
        "viewCount": topics.viewCount + 1,
        "userCount": topics.replyCount,
        "comments" : [],
        "isLiked" : likes
      }
    }

    models.Topic.update({
      viewCount : topics.viewCount+1
    },{
      where : {
        id : req.params.topic_id
      }
    })

      for(var i=0;i<users.length;i++)
      {
        if(users[i].id == topics.UserId)
        {
          data.topic.username = users[i].username
          data.topic.createdBy = users[i].profileImage
        }
      }

      for(var i =0 ;i<comments.length;i++)
      {
        var commentData = {
          "username": null,
          "id":comments[i].id,
          "content": comments[i].content,
          "url": null,
          "createdAt": comments[i].createdAt
        }

        


        for(var j = 0;j<users.length;j++)
        {
          if(users[j].id == comments[i].UserId)
          {
            commentData.username = users[j].username
            commentData.url = users[j].profileImage
            if(i ==comments.length-1)
            {
              data.topic.lastReply = users[j].profileImage
            }
          } 
        }
      data.topic.comments.push(commentData)
      }
      res.send(data)
  })
})




router.get('/:topic_id/comments/:comment_id', function(req, res) {
    models.Comment.findOne({
      where : {
        id: req.params.comment_id
      }
    }).then(function(user){
      console.log(user.content)
      res.send({
        "comment" : 
        {
          "commentId" : user.id, 
          "content": user.content,
          "createdAt": user.createdAt,
          "updatedAt": user.updatedAt
        }
      })
  }); 
});



















module.exports = router;
