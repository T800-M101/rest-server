const { request, response } = require("express");
const { searchUsers, searchProducts, searchCategories } = require('../helpers');


const search = async(req = request, res = response) => {
    let response;
       
    try {
        const { collection, item } = req.params;

        switch (collection) {
            case 'users':
                response = await searchUsers(item);
            break;

            case 'categories':
                response = await searchCategories(item);
            break;

            case 'products':
                response = await searchProducts(item);
            break;

            case 'roles':
                // TO DO: IMPLEMENT ROLES SEARCH
            break;
        
            default:
                return res.status(500).json({
                    message: 'Internal Server Error',
                    status: 500,
                    response: 'GET: collection not implemented',
                });
        }

        return res.status(response.status).json({
            message: response.message,
            status: response.status,
            response: response.response
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Internal Server Error',
            status: 500,
            response: 'GET: An error occurred while searching',
        });
    }

}






module.exports = {
    search
}