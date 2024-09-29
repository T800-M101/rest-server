const { validationResult } = require('express-validator');


const validateFields = (req, res, next) => {
    const errors = validationResult(req);

    if ( !errors.isEmpty() ) { 
         return res.status(400).json({
             message: 'Bad Request',
             status: 400,
             response: errors.errors
         });
     }

     next();
}



module.exports = {
    validateFields
}