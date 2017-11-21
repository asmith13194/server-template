const knex = require('./knex');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;

const jwtSignMiddleWare = (req, res, next) => {
  req.body.user = {
    id: req.body.user.id,
    first: req.body.user.first,
    last: req.body.user.last,
    email: req.body.user.email,
    exp: Math.floor(Date.now() / 1000) + (60 * 60*24),
  };
  req.body.jwt = jwt.sign(JSON.stringify(req.body.user), process.env.JWTSECRET);
  delete req.body.user.exp;
  return next()
}

const jwtVerifyMiddleWare = (req, res, next) => {
  jwt.verify(req.body.jwt, process.env.JWTSECRET, (jwtErr, decoded) => {
    switch(jwtErr){
      case null:
        req.body.email = decoded.email;
        return next()
      default:
        return res.send({
          success: false,
          payload: 'There was an error verifying your credentials, please try again'
        });
    }
  });
};

const bcryptHashMiddleWare = (req, res, next) => {
  bcrypt.hash(req.body.payload.password, saltRounds, (bcryptErr, hash) => {
    switch(bcryptErr){
      case undefined:
        req.body.payload.password = hash;
        return next()
      default:
        return res.send({
          success: false,
          payload: bcryptErr
        });
    }
  })
}

const bcryptCompareMiddleWare = (req, res, next) => {
  knex('users')
  .select('*')
  .where('email', req.body.email)
  .then(user => {
    switch(user.length) {
      case 1:
        return bcrypt.compare(req.body.password, user[0].password, (bcryptErr, valid) => {
          switch(valid) {
            case true:
              req.body.user = user[0];
              return next();
            case false:
              return res.send({
                success: false,
                payload: 'Invalid Credentials'
              });
            default:
              return res.send({
                success: false,
                payload: 'There was an error verifying your credentails, please try again'
              });
          }
        });
      default:
        return res.send({
          success: false,
          payload: 'Invalid Credentials'
        });
    }
  })
  .catch(err => {
    return res.send({
      success: false,
      payload: 'There was an error verifying your credentails, please try again'
    });
  });
};


module.exports = { jwtSignMiddleWare, jwtVerifyMiddleWare, bcryptHashMiddleWare, bcryptCompareMiddleWare }
