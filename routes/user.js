const express = require('express');
const router = express.Router();
const passport = require('passport');
const wrapAsync = require('../utils/wrapAsync');
const { notAlreadyLoggedin } = require('../middleware');
const userController = require('../controllers/user');

router.get('/register', userController.renderRegisterForm);

router.post('/register', wrapAsync(userController.register));

router.get('/login', notAlreadyLoggedin, userController.renderLoginForm)

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), userController.login)

router.get('/logout', userController.logout)

module.exports = router;