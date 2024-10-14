const dbValidators = require('./dbValidators');
const googleVerify = require('./google-verify');
const jwt = require('./jwt');
const search = require('./search');
const uploadFile = require('./upload');



module.exports ={
    ...dbValidators,
    ...googleVerify,
    ...jwt,
    ...search,
    ...uploadFile
}