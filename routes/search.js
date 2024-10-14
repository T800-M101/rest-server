const {  Router } = require('express');
const { search } = require('../controllers');
const { validateCollections } = require('../middleware');



const router = Router();



router.get('/:collection/:item', validateCollections, search);


module.exports = router;
