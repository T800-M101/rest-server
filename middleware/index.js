const  validateFields = require('../middleware/validate-fields');
const  validateJWT = require('../middleware/validate-jwt');
const  validateRoles = require('../middleware/validate-roles');
const  validateCollections = require('../middleware/validate-collections');
const validateUpload = require('../middleware/validateUpload');


module.exports = {
    ...validateFields,
    ...validateJWT,
    ...validateRoles,
    ...validateCollections,
    ...validateUpload
}