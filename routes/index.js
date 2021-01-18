const express = require('express');
const router = express.Router();
const chartController = require('../controllers/chartController');
const { ensureAuth, ensureGuest } = require('../middleware/auth');

// @desc Login/Landing page
// @route GET /
router.get('/', ensureGuest, (req, res) => {
  res.render('login', { title: 'Login' });
})

// @desc Dashboard
// @route GET /dashboard
router.get('/dashboard', ensureAuth, chartController.chart_individual_simple);

// @desc  Logout user
// @route /auth/logout
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
})

module.exports = router;