const express = require('express');
const router = express.Router();
const User = require('../models/User');
const passport = require('passport');


router.get('/signin', (req, res) => {
  res.render("users/signin");
});

router.post('/users/signin', passport.authenticate('local',  {
  successRedirect: '/profile',
   failureRedirect: '/signin',
   failureFlash: true


}));

router.get('/signup', (req, res) => {
  res.render("users/signup");
});

router.post('/users/signup', async (req, res) => {
  const {name, email, password, confirm_password} = req.body;

  const errors = [];

  if(name.length < 4){
    errors.push({text: 'Please Insert your name at least 4 characters'})
  }

  if(password != confirm_password){
    errors.push({text: 'Password do not match'});
  }
  if(password.length < 4){
    errors.push({text: 'Password must be at least 4 characters'});
  }
  if(errors.length > 0){
    res.render('users/signup', {errors, name, email, password, confirm_password})
  }else{
    const emailUser = await User.findOne({email: email});
    if(emailUser){
        req.flash('error_msg', 'The Email has already taken');
        res.redirect('/signup');
    }else {

    const newUser = new User({name, email, password});
    newUser.password = await newUser.encryptPassword(password);
    await newUser.save();
    req.flash('success_msg', 'Welcome Lindinho', req.body.name);
    res.redirect('/profile');
  }

}

});

router.get('/profile', (req, res) => {
  res.render('users/profile');
});


router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});



module.exports = router;
