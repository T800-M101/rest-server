


const isAdmin = ( req, res, next) => {
    if ( !req.authenticatedUser ) {
        return res.status(500).json({
            message: 'Cannot have access to role in the request',
            status: 500
        });
    }

    const { role } = req.authenticatedUser;

    if ( role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            message: 'Unauthorized',
            status: 401,
            response: 'Only administrators can access this resource'
        });
    } 
    
    next();
    
}

const isRole = (...roles) => {

    return (req, res, next) => {
        if ( !req.authenticatedUser ) {
            return res.status(500).json({
                message: 'Cannot have access to role in the request',
                status: 500
            });
        }

        const { role } = req.authenticatedUser;

        if ( !roles.includes(role) ) {
            return res.status(401).json({
                message: 'Unauthorized',
                status: 401,
                response: 'Your role is not allowed to access the resource'
            });
        } 

        next();
    }
}


module.exports = {
    isAdmin,
    isRole
}