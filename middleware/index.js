const  validateFields = require('../middleware/validate-fields');
const  validateJWT = require('../middleware/validate-jwt');
const  validateRoles = require('../middleware/validate-roles');


module.exports = {
    ...validateFields,
    ...validateJWT,
    ...validateRoles
}