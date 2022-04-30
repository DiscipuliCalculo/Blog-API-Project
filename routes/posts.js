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
  if(mongoose.Types.ObjectId.isValid(req.params.userId)){
    await Post.find({author: req.params.userId})
    .then(function(result) {
      if (!result.length){
        res.send('No posts by this author\n')
      }
      else{
        res.send(result + '\n')
      }
    })
    .catch((error) => {
      error.statusCode = 400;
      next(error);
    })
  }
  else{res.send('invalid user id\n')}
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
    Post.findOneAndDelete({author: req.params.userId, _id: req.params.postId}, function(err, result){
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
  if(mongoose.Types.ObjectId.isValid(req.params.postId)){
    await Comment.find({post: req.params.postId})
    .then(function(result) {
      if (!result.length){
        res.send('No comments on this post\n')
      }
      else{
        res.send(result + '\n')
      }
    })
    .catch((error) => {
      error.statusCode = 400;
      next(error);
    })
  }
  else{res.send('invalid post id\n')}
});

postRouter.get('/posts/:postId/comments/:commentId', async function(req, res, next) {
  if(mongoose.Types.ObjectId.isValid(req.params.commentId)) {
    await Comment.findById(req.params.commentId)
    .then(
      function(result) {
        if (result === null) {
          return res.send('No comment found\n')
        }
        else {
          return res.send(result + '\n')
        }
      }
    ).catch((error) => {
      error.statusCode = 400;
      next(error);
    })
  }
  else {
    res.send('Not a vaild comment id\n')
  }
});

postRouter.post('/posts/:postId/comments', async function(req, res, next) {
  if (validators.commentValidator(req.body.name, req.body.text) === false){
    return res.send('Invalid update object\n')
  }
  else {
    Post.findById(req.params.postId, function(err, foundPost) {
      if (err) {return next(err)}
      if (foundPost === null) {
        res.send('Post does not exist\n')
      }
      else {
        const comment = new Comment (
          {
            name: req.body.name,
            text: req.body.text,
            post: foundPost,
          }
        )
        comment.save(function (err) {
          if (err) {return next(err)}
          res.send('New comment added\n')
        })
      }
    })
  }
});

postRouter.put('/posts/:postId/comments/:commentId', function(req, res, next) {
  if (validators.commentValidator(req.body.name, req.body.text) === false){
    return res.send('Invalid update object\n')
  }
  else {
    if(mongoose.Types.ObjectId.isValid(req.params.postId)){
      Comment.findOneAndUpdate({post: req.params.postId, _id: req.params.commentId},
        {name: req.body.name, text: req.body.text}, function(err, result){
          if (err) {return next(err)}
          if (result === null) {
            res.send('Comment does not exist\n')
          }
          else {
            res.send('Comment edited\n')
          }
        })
    }
    else {
      res.send('Not valid id\n')
    }
  }
});

postRouter.delete('/posts/:postId/comments/:commentId', function(req, res, next) {
  if(mongoose.Types.ObjectId.isValid(req.params.us)){
    Post.findOneAndDelete({author: req.params.userId, _id: req.params.postId}, function(err, result){
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
});

module.exports = postRouter;
