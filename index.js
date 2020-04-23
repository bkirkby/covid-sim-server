const express = require('express')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
  function(username, password, done) {
    username.findOne({username: username}, function(err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: 'incorrect username.'})
      }
      if (!user.validPassword(password)) {
        return done(null, false, {message: 'incorrect password'})
      }
      return done(null, user)
    })
  }
))

const app = express()

const port = 3000

app.post('/login', passport.authenticate('local', {
  successRedirect: '/hello',
  failureRedirect: '/login',
  failureFlash: true
}))

app.get('/hello', (req, res) => {
  res.send('hello, world!')
})

app.listen(port, () => console.log(`app running on port ${port}`))
