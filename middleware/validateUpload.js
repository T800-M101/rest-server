const { request } = require("express");


const validateUpload = (req = request, res = response, next) => {
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.file) {
        return res.status(400).json({
            message: 'No files were uploaded.',
            status: 400
        });
    }
    next();
}


module.exports = {
    validateUpload
}
