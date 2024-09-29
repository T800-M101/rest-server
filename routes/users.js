const {  Router } = require('express');
const { check } = require('express-validator');
const { 
    getUser,
    getUsers, 
    createUser,
    setUser,
    deleteUser,
    updateUser
} = require('../controllers/users');
const { validateFields } = require('../middleware/validate-fields');
const { isValidRole, isEmailUnique, validateUserById } = require('../helpers/dbValidators');

const router = Router();


/*=========================== ROUTES ===============================*/
router.get('/', [
    check('from')
        .optional() // Makes 'from' optional
        .notEmpty().withMessage("query param 'from' cannot be empty")
        .isNumeric().withMessage("query param 'from' must be numeric")
        .isInt().withMessage("query param 'from' must be an integer")
        .toInt(),
    check('limit')
        .optional() // Makes 'limit' optional
        .notEmpty().withMessage("query param 'limit' cannot be empty")
        .isNumeric().withMessage("query param 'limit' must be numeric")
        .isInt().withMessage("query param 'limit' must be an integer")
        .toInt(),
    validateFields
], getUsers);

router.get('/:id', [
    check('id', 'It is not a valid ID').isMongoId(),
    check('id').custom( validateUserById ),
    validateFields
], getUser);


router.post('/', [
    check('name', 'The name is mandatory').not().isEmpty(),   
    check('password', 'The password should have at least 6 characters').isLength({ min: 6 }),
    check('email', 'Invalid email').isEmail(),
    check('email').custom( isEmailUnique ),   
    check('role').custom( isValidRole ), 
    validateFields 
], createUser);

router.put('/:id', [
    check('id', 'It is not a valid ID').isMongoId(),
    check('id').custom( validateUserById ),
    check('role').custom( isValidRole ), 
    validateFields 
], setUser);

router.delete('/:id', [
    check('id', 'It is not a valid ID').isMongoId(),
    check('id').custom( validateUserById ),
    validateFields
], deleteUser);

router.patch('/:id', updateUser);





module.exports = router;

//check('role', 'This role is not allowed').isIn(['ADMIN_ROLE', 'USER_ROLE']),
// The function custom pass only a role as argument to isValidRole, for this reason is not called like this isValidRole(role)
// Validating errors ( they are caught with "check" middleware in the routes) 