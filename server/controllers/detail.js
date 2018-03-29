// const utils = require('../libs/utils')
// const ApiError = require('../libs/errorHelper')
// const ApiErrorNames = require('../libs/apiErrorNamesHelper')

class detailController {
  static async get (ctx) {
    const canvasModel = global.dbHelper.getModel('t_canvas')
    const data = await canvasModel
      .findOne({
        fileName: ctx.request.query.fileName
      })
      .populate({ path: 'userInfo', select: 'name avatarUrl -_id' })
      .populate({ path: 'topicInfo', select: 'name description -_id' })

    // 设置Content-Type
    ctx.type = 'application/json'
    // 设置Response Body
    ctx.body = data
  }
}

module.exports = detailController
