const router = require('express').Router()
const ctrl   = require('../controllers/statsController')
const { protect } = require('../middleware/auth')

router.get('/', protect, ctrl.get)

module.exports = router
