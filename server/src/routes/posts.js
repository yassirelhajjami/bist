const router = require('express').Router()
const ctrl   = require('../controllers/postController')
const { protect } = require('../middleware/auth')

router.get('/',              protect, ctrl.list)
router.get('/:id',           protect, ctrl.getOne)
router.post('/',             protect, ctrl.create)
router.patch('/:id',         protect, ctrl.update)
router.delete('/:id',        protect, ctrl.remove)
router.patch('/:id/toggle',  protect, ctrl.toggleStatus)

module.exports = router
