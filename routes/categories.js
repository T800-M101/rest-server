const {  Router } = require('express');
const { check } = require('express-validator');
const { validateFields, validateJWT, isAdmin } = require('../middleware');
const { getCategories, getCategoryById, createCategory, setCategory, deleteCategory } = require('../controllers');
const { validateCategoryById, validateCategoryName } = require('../helpers');


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
], getCategories);

router.get('/:id', [
    check('id', 'It is not a valid ID').isMongoId(),
    check('id').custom( validateCategoryById ),
    validateFields
], getCategoryById);

router.post('/', [ 
    validateJWT,
    check('name', 'The name is mandatory').not().isEmpty(),
    check('name').custom(validateCategoryName),
    validateFields 
], createCategory);

router.put('/:id', [
    validateJWT,
    isAdmin,
    check('id', 'It is not a valid ID').isMongoId(),
    check('id').custom( validateCategoryById ),
    validateFields 
],setCategory);

router.delete('/:id', [
    validateJWT,
    isAdmin,
    check('id', 'It is not a valid ID').isMongoId(),
    check('id').custom( validateCategoryById ),
    validateFields,
], deleteCategory)




module.exports = router;