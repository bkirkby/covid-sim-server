const express = require('express')
const morgan = require('morgan')
const logger = require('./logger')
require('dotenv').config()

const app = express()

const port = 8081

app.use(morgan('tiny'))

function simpleAuth(req, res, next) {
  logger.debug('simpleAuth called')
  if (req.get("Authorization") === process.env.COVIDSIM_AUTHKEY) {
    next();
  } else {
    res.status(403).json({message: "admin key not valid"});
  }
}

app.get('/login',  simpleAuth,
  function(req, res) {
    res.json({status:'ok'})
  }
)

app.get('/hello', (req, res) => {
  res.send('hello, world!')
})

app.listen(port, () => console.log(`app running on port ${port}`))
