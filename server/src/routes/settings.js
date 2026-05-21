const router = require('express').Router()
const ctrl   = require('../controllers/settingsController')
const { protect, authorize } = require('../middleware/auth')

router.get('/',   protect, ctrl.get)
router.patch('/', protect, authorize('admin'), ctrl.update)

module.exports = router
