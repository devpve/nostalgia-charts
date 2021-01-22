const express = require('express');
const passport = require('passport');
const router = express.Router();


// @desct Auth with Last.fm
// @route GET /auth/lastfm
router.get('/lastfm', passport.authenticate('lastfm'));

// @desc Last.fm auth callback
// @route GET /auth/lastfm/callback
router.get('/lastfm/callback', passport.authenticate('lastfm', { failureRedirect: '/' }), 
  (req, res) => {
    res.redirect('/dashboard');
  }
);

module.exports = router;