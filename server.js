const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const auth = require('./routes/auth.js');
const port = 8000;

// const jwtMiddleware = (req,res,next) => {
//   jwt.verify(req.body.payload, process.env.JWTSECRET, (err, decoded) => {
//     switch(err){
//       case null:
//         return next();
//       default:
//         return res.send({
//           type: 'error',
//           payload: err.message
//         });
//     }
//   });
// };

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/auth', auth);

app.use('/', (req,res)=>{
  res.sendStatus(404);
});

app.listen(port, () => {
  console.log('Listening on port', port);
});

module.exports = app;
