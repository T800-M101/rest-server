const {  Router } = require('express');
const { check } = require('express-validator');
const { validateFields } = require('../middleware');
const { login, googleSignIn } = require('../controllers');


const router = Router();

/*=========================== ROUTES ===============================*/

router.post('/login', [
    check('email', 'Invalid email').isEmail(),
    check('password', 'The password is required').notEmpty(),
    validateFields
], login);

router.post('/google', [
    check('id_token', 'id_token es necesario').not().isEmpty(),
    validateFields
], googleSignIn);




module.exports = router;