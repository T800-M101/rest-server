const {  Router } = require('express');
const { check } = require('express-validator');
const { validateFields } = require('../middleware/validate-fields');
const { login } = require('../controllers/auth');




const router = Router();


router.post('/login', [
    check('email', 'Invalid email').isEmail(),
    check('password', 'The password is required').notEmpty(),
    validateFields
], login);




module.exports = router;