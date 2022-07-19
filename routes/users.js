const express = require('express');

const router = express.Router();
const { authValidation, validateUser } = require('../middlewares/validations');
const { getCurrentUserData } = require('../controllers/users');

// returns information about the logged-in user (email and name)
router.get('/users/me', authValidation, validateUser, getCurrentUserData);

module.exports = router;
