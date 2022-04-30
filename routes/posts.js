var express = require('express');
var postRouter = express.Router({mergeParams: true});
var async = require('async')
var Post = require('../models/post')
var Comment = require('../models/comment')
var User = require('../models/user')
var validators = require('../components/validators')
var mongoose = require('mongoose')

var userRouter = require('./users');


userRouter.use('/:userId', postRouter )

/* GET all posts. On path /users/:userId/posts */
postRouter.get('/posts', async function(req, res, next) {
  const posts = await Post.find({})
  return res.send(posts + '\n');
});

/* GET one post. On path /users/:userId/posts/:postId */
postRouter.get('/posts/:postId', async function(req, res, next) {
  if(mongoose.Types.ObjectId.isValid(req.params.postId)) {
    await Post.findById(req.params.postId)
    .then(
      function(result) {
        if (result === null) {
          return res.send('No post found\n')
        }
        else {
          return res.send(result + '\n')
        }
      }
    ).catch((error) => {
      console.log(req.params.postId)
      error.statusCode = 400;
      next(error);
    })
  }
  else {
    res.send('Not a vaild user id\n')
  }
});

/* POST one post. On path /users/:userId/posts/:postId */
postRouter.post('/posts', function(req, res, next) {
  if (validators.postValidator(req.body.title, req.body.text) === false){
    return res.send('Invalid update object\n')
  }
  else {
    User.findById(req.params.userId, function(err, user) {
      if (err) {return next(err)}
      if (user === null) {
        res.send('Author does not exist\n')
      }
      else {
        const post = new Post (
          {
            title: req.body.title,
            text: req.body.text,
            author: user,
          }
        )
        post.save(function (err) {
          if (err) {return next(err)}
          res.send('New post added\n')
        })
      }
    })
  }
})

/* PUT one post. On path /users/:userId/posts/:postId */
postRouter.put('/posts/:postId', function(req, res, next) {
  if (validators.postValidator(req.body.title, req.body.text) === false){
    return res.send('Invalid update object\n')
  }
  else {
    if(mongoose.Types.ObjectId.isValid(req.params.userId)){
      Post.findOneAndUpdate({author: req.params.userId, _id: req.params.postId},
        {title: req.body.title, text: req.body.text}, function(err, result){
          if (err) {return next(err)}
          if (result === null) {
            res.send('Post does not exist\n')
          }
          else {
            res.send('Post edited\n')
          }
        })
    }
    else {
      res.send('Not valid id\n')
    }
  }
})

/* DELETE one post. On path /users/:userId/posts/:postId */
postRouter.delete('/posts/:postId', function(req, res, next) {
  if(mongoose.Types.ObjectId.isValid(req.params.userId)){
    Post.findOneAndDelete({author: req.params.userId, _id: req.params.postId},function(err, result){
      if (err) {return next(err)}
      if (result === null) {
        res.send('Post does not exist\n')
      }
      else res.send('Post deleted\n')
    })
  }
  else{
    res.send('Not valid id\n')
  }
})

postRouter.get('/posts/:postId/comments', async function(req, res, next) {
  const comments = await Comment.find({})
  return res.send(comments + '\n');
});

postRouter.get('/posts/:postId/comments/:commentId', function(req, res, next) {
  res.send('Get one comment');
});

postRouter.post('/posts/:postId/comments', function(req, res, next) {
  res.send('Add a comment');
});

postRouter.put('/posts/:postId/comments/:commentId', function(req, res, next) {
  res.send('edit a comment');
});

postRouter.delete('/posts/:postId/comments/:commentId', function(req, res, next) {
  res.send('delete a comment');
});

module.exports = postRouter;
