const path = require('path');
const { v4: uuidv4 } = require('uuid');



const uploadFile = (files, allowedExtensions = ['png', 'jpg', 'jpeg', 'gif'], directory = '') => {

    return new Promise( ( resolve, reject ) => {
        // Get the file uploaded from the request
        const { file } = files || {};

        //  split the name to get the extesion
        const splitName = file.name.split('.');
    
        // get the extension
        const extension = splitName[splitName.length - 1];
    
        // Verify if extension is allowed  
        // Ensure allowedExtensions is an array (preventing null or undefined from breaking the includes() check)
        allowedExtensions = Array.isArray(allowedExtensions) ? allowedExtensions : ['png', 'jpg', 'jpeg', 'gif'];
        if ( !allowedExtensions.includes(extension) ) {
            return reject(`The extension '${extension}' is not allowed. Allowed: ${allowedExtensions}`);
        }
    
        // Generate unique name for file
        const tempName = uuidv4() + '.' + extension;
    
       // Upload file (recives the path and the file)
        const uploadPath = path.join(__dirname, '../uploads/', directory, tempName);
      
        // Move file to path
        file.mv(uploadPath, (err) => {
          if (err) {
            return reject(err);
          }

          resolve(tempName);
       });

    });

}



module.exports = {
    uploadFile
}