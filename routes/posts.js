var express = require('express');
var postRouter = express.Router({mergeParams: true});

var userRouter = require('./users')

userRouter.use('/:userId', postRouter )

/* GET all posts. On path /users/:userId/posts */
postRouter.get('/posts', function(req, res, next) {
  res.send('Get all posts');
});

/* GET one post. On path /users/:userId/posts/:postId */
postRouter.get('/posts/:postId', function(req, res, next) {
  res.send('Get one post');
});

/* POST one post. On path /users/:userId/posts/:postId */
postRouter.post('/posts', function(req, res, next) {
  res.send('Add post');
})

/* PUT one post. On path /users/:userId/posts/:postId */
postRouter.put('/posts/:postId', function(req, res, next) {
  res.send('Edit post')
})

/* DELETE one post. On path /users/:userId/posts/:postId */
postRouter.delete('/posts/:postId', function(req, res, next) {
  res.send('Delete post')
})

postRouter.get('/posts/:postId/comments', function(req, res, next) {
  res.send('Get all comments');
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
