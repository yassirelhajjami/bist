const router = require('express').Router()
const ctrl   = require('../controllers/authController')
const { protect, authorize } = require('../middleware/auth')

router.post('/login',           ctrl.login)
router.get('/me',               protect, ctrl.getMe)
router.patch('/me',             protect, ctrl.updateMe)
router.patch('/me/password',    protect, ctrl.changePassword)
router.get('/users',            protect, authorize('admin'), ctrl.listUsers)
router.post('/users',           protect, authorize('admin'), ctrl.createUser)
router.patch('/users/:id',      protect, authorize('admin'), ctrl.updateUser)
router.delete('/users/:id',     protect, authorize('admin'), ctrl.deleteUser)

module.exports = router
