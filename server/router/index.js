const router = require('koa-router')()
const topicController = require('../controllers/topic')
const tokenController = require('../controllers/token')
const qrcodeController = require('../controllers/qrcode')
const loginController = require('../controllers/login')
const canvasController = require('../controllers/canvas')
const detailController = require('../controllers/detail')
const commentController = require('../controllers/comment')

router.get('/api/topic/list', topicController.list)
router.get('/api/token/get', tokenController.get)
router.get('/api/qrcode/get', qrcodeController.get)
router.get('/api/login', loginController.login)
router.post('/api/canvas/save', canvasController.save)
router.get('/api/detail/get', detailController.get)
router.get('/api/comment/get', commentController.get)
router.post('/api/comment/save', commentController.save)

module.exports = router
