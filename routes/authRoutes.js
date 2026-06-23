const router = require('express').Router();
const { register, login, getUsers, getUserById } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.get('/users', getUsers);
router.get('/users/:id', getUserById);

module.exports = router;
