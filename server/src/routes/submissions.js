const router = require('express').Router()
const ctrl   = require('../controllers/submissionsController')
const { protect } = require('../middleware/auth')

router.post('/',                ctrl.create)
router.get('/',          protect, ctrl.list)
router.get('/unread',    protect, ctrl.unreadCount)
router.patch('/:id/read', protect, ctrl.markRead)
router.delete('/:id',    protect, ctrl.remove)

module.exports = router
