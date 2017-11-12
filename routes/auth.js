'use strict';

const express = require('express');
const router = express.Router();
const knex = require('../knex');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;

router.post('/login', (req,res) => {
  knex('users')
  .select('*')
  .where('email', req.body.email)
  .then(user => {
    switch(user.length) {
      case 1:
        return bcrypt.compare(req.body.password, user[0].password, (bcryptErr, valid) => {
          switch(valid) {
            case true:
              user = {
                id: user[0].id,
                first: user[0].first,
                last: user[0].last,
                email: user[0].email,
                exp: Math.floor(Date.now() / 1000) + (60 * 60),
              };
              req.body.token = jwt.sign(JSON.stringify(user), process.env.JWTSECRET);
              delete user.exp;
              return res.send({
                type: 'success',
                payload: {
                  info: user,
                  token: req.body.token
                }
              });
            case false:
              return res.send({
                type: 'invalid-user',
                payload: req.body
              });
            default:
              return res.send({
                type: 'error',
                payload: bcryptErr
              });
          }
        });
      default:
        return res.send({
          type: 'invalid-user',
          payload: req.body
        });
    }
  })
  .catch(err => {
    res.send({
      type: 'error',
      payload: err
    });
  });
});

router.post('/signup', (req,res) => {
  bcrypt.hash(req.body.password, saltRounds, (bcryptErr, hash) => {
    switch(bcryptErr){
      case undefined:
        req.body.password = hash;
        return knex('users')
        .returning('*')
        .insert(req.body)
        .then(user=>{
          user = {
            id: user[0].id,
            first: user[0].first,
            last: user[0].last,
            email: user[0].email,
            exp: Math.floor(Date.now() / 1000) + (60 * 60),
          };
          let jwtToken = jwt.sign(JSON.stringify(user), process.env.JWTSECRET);
          delete user.exp;
          res.send({
            type: 'success',
            payload: {
              info: user,
              token: jwtToken
            }
          });
        })
        .catch(err => {
          return res.send({
            type: 'error',
            payload: err
          });
        });
      default:
        return res.send({
          type: 'error',
          payload: bcryptErr
        });
    }
  });
});

router.post('/update', (req, res) => {
  jwt.verify(req.body.token, process.env.JWTSECRET, (jwtErr, decoded) => {
    switch(jwtErr){
      case null:
        return knex('users')
        .returning('*')
        .where('id', decoded.id)
        .then( user => {
          return bcrypt.compare(req.body.password, user[0].password, (bcryptErr, valid) => {
            switch(valid) {
              case true:
                return knex('users')
                .returning('*')
                .where('id', decoded.id)
                .update(req.body.payload)
                .then( updatedUser => {
                  updatedUser = {
                    id: updatedUser[0].id,
                    first: updatedUser[0].first,
                    last: updatedUser[0].last,
                    email: updatedUser[0].email,
                    exp: Math.floor(Date.now() / 1000) + (60 * 60),
                  };
                  let jwtToken = jwt.sign(JSON.stringify(updatedUser), process.env.JWTSECRET);
                  delete updatedUser.exp;
                  return res.send({
                    type: 'success',
                    payload: {
                      info: updatedUser,
                      token: jwtToken
                    }
                  });
                })
                .catch(err => {
                  return res.send({
                    type: 'error',
                    payload: err
                  });
                });
              case false:
                return res.send({
                  type: 'invalid-password',
                  payload: req.body
                });
              default:
                return res.send({
                  type: 'error',
                  payload: bcryptErr
                });
            }
          });
        })
        .catch(err => {
          return res.send({
            type: 'error',
            payload: err
          });
        });
      default:
        return res.send({
          type: 'invalid-user',
          payload: req.body
        });
    }
  });
});

router.post('/update/password', (req, res) => {
  jwt.verify(req.body.token, process.env.JWTSECRET, (jwtErr, decoded) => {
    switch(jwtErr){
      case null:
        return knex('users')
        .returning('*')
        .where('id', decoded.id)
        .then( user => {
          return bcrypt.compare(req.body.password, user[0].password, (bcryptErr, valid) => {
            switch(valid) {
              case true:
                return bcrypt.hash(req.body.payload.password, saltRounds, (err, hash) => {
                  req.body.payload.password = hash;
                  knex('users')
                  .returning('*')
                  .where('id', decoded.id)
                  .update(req.body.payload)
                  .then( user => {
                    user = {
                      id: user[0].id,
                      first: user[0].first,
                      last: user[0].last,
                      email: user[0].email,
                      exp: Math.floor(Date.now() / 1000) + (60 * 60),
                    };
                    let jwtToken = jwt.sign(JSON.stringify(user), process.env.JWTSECRET);
                    delete user.exp;
                    return res.send({
                      type: 'success',
                      payload: {
                        info: user,
                        token: jwtToken
                      }
                    });
                  })
                  .catch(err => {
                    return res.send({
                      type: 'error',
                      payload: err
                    });
                  });
                });
              case false:
                return res.send({
                  type: 'invalid-password',
                  payload: req.body
                });
              default:
                return res.send({
                  type: 'error',
                  payload: bcryptErr
                });
            }
          });
        })
        .catch(err => {
          return res.send({
            type: 'error',
            payload: err
          });
        });
      default:
        return res.send({
          type: 'invalid-user',
          payload: req.body
        });
    }
  });
});

router.post('/deactivate', (req, res) => {
  jwt.verify(req.body.token, process.env.JWTSECRET, (jwtErr, decoded) => {
    switch(jwtErr){
      case null:
        return knex('users')
        .returning('*')
        .where('id', decoded.id)
        .then( user => {
          return bcrypt.compare(req.body.password, user[0].password, (bcryptErr, valid) => {
            switch(valid) {
              case true:
                return knex('users')
                .where('id', decoded.id)
                .del()
                .then( () => {
                  return res.send({
                    type: 'success',
                  });
                })
                .catch(err => {
                  return res.send({
                    type: 'error',
                    payload: err
                  });
                });
              case false:
                return res.send({
                  type: 'invalid-password',
                  payload: req.body
                });
              default:
                return res.send({
                  type: 'error',
                  payload: bcryptErr
                });
            }
          });
        })
        .catch(err => {
          return res.send({
            type: 'error',
            payload: err
          });
        });
      default:
        return res.send({
          type: 'invalid-user',
          payload: req.body
        });
    }
  });
});

module.exports = router;
