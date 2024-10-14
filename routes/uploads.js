const {  Router } = require('express');
const { check } = require('express-validator');
const { validateFields, validateUpload } = require('../middleware');
const { loadFile, updateImg, getImage, updateImgCloudinary } = require('../controllers');
const { allowedCollections } = require('../helpers');


const router = Router();

/*=========================== ROUTES ===============================*/

router.post('/', validateUpload, loadFile);

// router.put('/:collection/:id', [
//     validateUpload,
//     check('id', 'It is not a valid ID').isMongoId(),
//     check('collection').custom( c => allowedCollections( c, ['users', 'products'] )),
//     validateFields
// ], updateImg);

router.put('/:collection/:id', [
        validateUpload,
        check('id', 'It is not a valid ID').isMongoId(),
        check('collection').custom( c => allowedCollections( c, ['users', 'products'] )),
        validateFields
    ], updateImgCloudinary);

router.get('/:collection/:id', [
    check('id', 'It is not a valid ID').isMongoId(),
    check('collection').custom( c => allowedCollections( c, ['users', 'products'] )),
    validateFields
], getImage);




module.exports = router;