var express = require('express');
var userRouter = express.Router();

/* GET all users. On path /users/ */
userRouter.get('/', function(req, res, next) {
  res.send('Get all users');
});

/* GET one users. On path /users/:userId */
userRouter.get('/:userId', function(req, res, next) {
  res.send('Get one user')
})

/* POST one users. On path /users/:userId */
userRouter.post('/', function(req, res, next) {
  res.send('Add one user')
})

/* PUT one users. On path /users/:userId */
userRouter.put('/:userId', function(req, res, next) {
  res.send('Edit one user')
})

/* DELETE one users. On path /users/:userId */
userRouter.delete('/:userId', function(req, res, next) {
  res.send('Delete one user')
})

module.exports = userRouter;
