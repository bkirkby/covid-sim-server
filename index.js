const express = require('express')

const app = express()

const port = 8081

function simpleAuth(req, res, next) {
  if (req.get("Authorization") === process.env.COVIDSIM_AUTHKEY) {
    next();
  } else {
    res.status(403).json({message: "admin key not valid"});
  }
}

app.post('/login',  simpleAuth,
  function(req, res) {
    res.json({username:'bk',email:'bkirkby@'})
  }
)

app.get('/hello', (req, res) => {
  res.send('hello, world!')
})

app.listen(port, () => console.log(`app running on port ${port}`))
