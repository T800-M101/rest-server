const jwt = require('jsonwebtoken');


const generateJWT = (user) => {

    return new Promise( (resolve, reject) => {
        // Define the payload you want to include in the token
        const payload = {
            uid: user._id, // You can include the user's ID or other important info
            email: user.email,
            role: user.role
        };
    
        // Sign the token
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '4h' }, (err, token) => {
            if (err) {
                console.log(err);
                reject('Token could not be generated');
            } else {
                resolve(token);
            }
        });
    
    });
};


module.exports = generateJWT