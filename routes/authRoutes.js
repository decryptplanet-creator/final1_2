const router = require('express').Router();
const { register, login, getUsers } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.get('/users', getUsers);

module.exports = router;
