const router = require('express').Router()
const ctrl   = require('../controllers/contentController')
const { protect } = require('../middleware/auth')

router.get('/:page',   protect, ctrl.getPage)
router.patch('/:page', protect, ctrl.updatePage)

module.exports = router
