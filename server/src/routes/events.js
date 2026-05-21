const router = require('express').Router()
const ctrl   = require('../controllers/eventController')
const { protect } = require('../middleware/auth')

router.get('/',       protect, ctrl.list)
router.get('/:id',    protect, ctrl.getOne)
router.post('/',      protect, ctrl.create)
router.patch('/:id',  protect, ctrl.update)
router.delete('/:id', protect, ctrl.remove)

module.exports = router
