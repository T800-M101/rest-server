const { request, response } = require('express');



const getUser = (req = request, res = response) => {
    const { id } = req.params;
    const { name, lastname, page = 1, limit = 5 } = req.query;
    res.status(200).json({
        msg: 'get API',
        id,
        name,
        lastname,
        page,
        limit
    });
};

const createUser = (req, res = response) => {
    const { name, age } = req.body;

    res.status(201).json({
        msg: 'post API',
        name,
        age
    });
};

const setUser = (req, res = response) => {
    const { id } = req.params;
    console.log('ID', id)
    res.json({
        msg: 'put API'
    });
};

const deleteUser = (req, res = response) => {
    res.json({
        msg: 'delete API'
    });
};

const updateUser = (req, res = response) => {
    res.json({
        msg: 'patch API'
    });
}




module.exports = {
    getUser,
    createUser,
    setUser,
    deleteUser,
    updateUser
}


