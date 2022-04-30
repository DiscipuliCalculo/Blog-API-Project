var express = require('express');
var bcrypt = require('bcryptjs');
var userRouter = express.Router();
var User = require('../models/user')
var async = require('async')
var { v4: uuidv4 } = require('uuid');
var mongoose = require('mongoose')
var validators = require('../components/validators')


/* GET all users. On path /users/ */
userRouter.get('/', async function(req, res, next) {
  const users = await User.find({})
  return res.send(users + '\n');
});

/* GET one user. On path /users/:userId */
userRouter.get('/:userId', async function(req, res, next) {
  if(mongoose.Types.ObjectId.isValid(req.params.userId)) {
    await User.findById(req.params.userId)
    .then(
      function(result) {
        if (result === null) {
          return res.send('No user found\n')
        }
        else {
          return res.send(result + '\n')
        }
      }
    ).catch((error) => {
      console.log(req.params.userId)
      error.statusCode = 400;
      next(error);
    })
  }
  else {
    res.send('Not a vaild user id\n')
  }
});

/* POST one user. On path /users/:userId */
userRouter.post('/', async function(req, res, next) {
  if (validators.userValidator(req.body.name, req.body.username, req.body.password) === false){
    return res.send('Invalid update object\n')
  }
  await User.exists({username: req.body.username}, function(err, found){
    if (found !== null) {
      var err = new Error('user with that username already exists')
      err.status = 400;
      return next(err)
    }
    else {
      bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
        if (err) {return next(err)}
        else{
          const user = new User (
            {
              name: req.body.name, 
              username: req.body.username,
              password: hashedPassword,
              id: uuidv4(),
            }
          )
          user.save(function (err) {
            if (err) {return next(err)}
            res.send('User added\n')
            return
          })
        }
      })
    }
  })
})

/* PUT one user. On path /users/:userId */
userRouter.put('/:userId', async function(req, res, next) {
  if (validators.userValidator(req.body.name, req.body.username, req.body.password) === false){
    return res.send('Invalid update object\n')
  }
  if(mongoose.Types.ObjectId.isValid(req.params.userId)) {
    await User.findByIdAndUpdate(req.params.userId, {name: req.body.name, username: req.body.username, password: bcrypt.hashSync(req.body.password, 10)})
    .then(
      function(result) {
        if (result === null) {
          return res.send('No user found\n')
        }
        else {
          return res.send(result+'\n')
        }
      }
    ).catch((error) => {
      console.log(req.params.userId)
      error.statusCode = 400;
      next(error);
    })
  }
  else {
    res.send('Not a vaild user id\n')
  }
});

/* DELETE one user. On path /users/:userId */
userRouter.delete('/:userId', async function(req, res, next) {
  if(mongoose.Types.ObjectId.isValid(req.params.userId)) {
    await User.findByIdAndDelete(req.params.userId)
    .then(
      function(result) {
        if (result === null) {
          return res.send('No user found\n')
        }
        else {
          return res.send('User deleted')
        }
      }
    ).catch((error) => {
      console.log(req.params.userId)
      error.statusCode = 400;
      next(error);
    })
  }
  else {
    res.send('Not a vaild user id\n')
  }
})

module.exports = userRouter;
