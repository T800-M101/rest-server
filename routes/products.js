const {  Router } = require('express');
const { check } = require('express-validator');
const { validateFields } = require('../middleware/validate-fields');
const { validateJWT } = require('../middleware/validate-jwt');
const { isAdmin } = require('../middleware');
const { getProducts, getProductById, createProduct, deleteProduct, setProduct } = require('../controllers/products');
const { validateProductById, validateCategoryById, validateProductName } = require('../helpers/dbValidators');


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
], getProducts);

router.get('/:id', [
    check('id', 'It is not a valid ID').isMongoId(),
    check('id').custom( validateProductById ),
    validateFields
], getProductById);

router.post('/', [ 
    validateJWT,
    check('name', 'The name is mandatory').not().isEmpty(),
    check('name').custom(validateProductName),
    check('price')
        .optional()
        .isFloat({ min: 0 }).withMessage('The price cannot be negative'),
    check('active')
        .isBoolean()
        .withMessage('The value must be a boolean (true or false).'),
    check('category', 'it is not a valid ID').isMongoId(),
    check('category').custom( validateCategoryById ), 
    validateFields 
], createProduct);

router.put('/:id', [
    validateJWT,
    isAdmin,
    check('id', 'It is not a valid ID').isMongoId(),
    check('id').custom( validateProductById ),
    validateFields 
],setProduct);

router.delete('/:id', [
    validateJWT,
    isAdmin,
    check('id', 'It is not a valid ID').isMongoId(),
    check('id').custom( validateProductById ),
    validateFields,
], deleteProduct)




module.exports = router;