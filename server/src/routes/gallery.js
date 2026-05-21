const router = require('express').Router()
const ctrl   = require('../controllers/galleryController')
const { protect } = require('../middleware/auth')
const { upload } = require('../middleware/upload')

router.get('/',                ctrl.list)
router.post('/',               protect, upload.array('images', 20), ctrl.upload)
router.patch('/:id',           protect, ctrl.update)
router.delete('/bulk',         protect, ctrl.bulkDelete)
router.delete('/:id',          protect, ctrl.remove)

module.exports = router
