'use strict';

const express = require('express');
const router = express.Router();
const knex = require('../knex');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
  jwtSignMiddleWare,
  jwtVerifyMiddleWare,
  bcryptHashMiddleWare,
  bcryptCompareMiddleWare, } = require('../authware.js')
const saltRounds = 10;

router.post('/signup',
  bcryptHashMiddleWare,
  (req, res, next) => {
    return knex('users')
    .returning('*')
    .insert(req.body.payload)
    .then(user => {
      req.body.user = user[0]
      return next()
    })
    .catch(err => {
      return res.send({
        success: false,
        payload: err
      });
    });
  },
  jwtSignMiddleWare,
  (req, res) => {
    return res.send({
      success: true,
      payload: {
        info: req.body.user,
        jwt: req.body.jwt
      }
    });
  }
);

router.post('/login',
  bcryptCompareMiddleWare,
  jwtSignMiddleWare,
  (req,res) => {
    return res.send({
      success: true,
      payload: {
        info: req.body.user,
        jwt: req.body.jwt
      }
    });
  }
);

router.put('/update',
  jwtVerifyMiddleWare,
  bcryptCompareMiddleWare,
  (req, res, next) => {
    return knex('users')
    .returning('*')
    .where('email', req.body.email)
    .update(req.body.payload)
    .then( user => {
      req.body.user = user[0]
      return next()
    })
    .catch(err => {
      return res.send({
        success: false,
        payload: 'There was an error updating your account, please try again'
      });
    });
  },
  jwtSignMiddleWare,
  (req, res) => {
    return res.send({
      success: true,
      payload: {
        info: req.body.user,
        jwt: req.body.jwt
      }
    });
  }
);

router.put('/update/password',
  jwtVerifyMiddleWare,
  bcryptCompareMiddleWare,
  bcryptHashMiddleWare,
  (req, res, next) => {
    return knex('users')
    .returning('*')
    .where('email', req.body.email)
    .update(req.body.payload)
    .then( user => {
      req.body.user = user[0]
      return next()
    })
    .catch(err => {
      return res.send({
        success: false,
        payload: 'There was an error updating your account, please try again'
      });
    });
  },
  jwtSignMiddleWare,
  (req, res) => {
    return res.send({
      success: true,
      payload: {
        info: req.body.user,
        jwt: req.body.jwt
      }
    });
  }
);

router.delete('/deactivate',
  jwtVerifyMiddleWare,
  bcryptCompareMiddleWare,
  (req, res) => {
    return knex('users')
    .where('email', req.body.email)
    .del()
    .then( () => {
      return res.send({
        success: 'deactivated',
      });
    })
    .catch(err => {
      return res.send({
        success: false,
        payload: 'There was an error deactivating your account, please try again'
      });
    });
  }
);

module.exports = router;
