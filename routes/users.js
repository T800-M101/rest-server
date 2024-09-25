const {  Router } = require('express');
const { 
    getUser, 
    createUser,
    setUser,
    deleteUser,
    updateUser
} = require('../controllers/users');

const router = Router();

router.get('/:id', getUser);

router.post('/', createUser);

router.put('/:id', setUser);

router.delete('/:id', deleteUser);

router.patch('/:id', updateUser);





module.exports = router;