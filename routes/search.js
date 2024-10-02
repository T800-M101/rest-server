const {  Router } = require('express');
const { check } = require('express-validator');
const { validateFields,validateJWT, isAdmin, isRole } = require('../middleware');
const { getUser, getUsers, createUser, setUser, deleteUser, updateUser } = require('../controllers/users');
const { isValidRole, isEmailUnique, validateUserById } = require('../helpers/dbValidators');
const { search } = require('../controllers/search');



const router = Router();



router.get('/:collection/:item', search)


module.exports = router;
