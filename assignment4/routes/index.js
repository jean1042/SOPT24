var express = require('express');
var router = express.Router();

router.use('/homework/signin', require('./homework/signin'))
router.use('/homework/signup', require('./homework/signup'))
router.use('/homework/board', require('./homework/board'))

module.exports = router;
