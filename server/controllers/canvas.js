const uuid = require('node-uuid')
const utils = require('../libs/utils')
const ApiError = require('../libs/errorHelper')
const ApiErrorNames = require('../libs/apiErrorNamesHelper')

class canvasController {
  static async save (ctx) {
    // 校验参数
    const requireParams = ['name', 'avatarUrl', 'openId', 'topicId']
    utils.checkRequireParams(ctx.request.body.fields, requireParams)

    // 转存文件
    const request = ctx.request.body.fields
    const fileName = `${uuid.v1()}`
    const suffix = '.png'
    const publicPath = './www'
    const sourcePath = `${ctx.request.body.files.file.path}`
    const targetPath = `/album/${request.openId}/`
    utils.copyFile(sourcePath, publicPath + targetPath + fileName + suffix)

    // 写入列表 更新用户信息
    const canvasModel = global.dbHelper.getModel('t_canvas')
    const userModel = global.dbHelper.getModel('t_user')

    userModel.findOneAndUpdate({
      openId: request.openId
    },
    {
      $set: {
        name: request.name,
        avatarUrl: request.avatarUrl,
        openId: request.openId
      }
    },
    {
      upsert: true
    }, (err, res) => {
      if (err) {
        throw new ApiError(ApiErrorNames.INTERNAL_ERROR)
      }
      canvasModel.create({
        path: targetPath,
        fileName,
        suffix,
        openId: request.openId,
        userInfo: res._id,
        topicInfo: request.topicId
      })
    })

    // 设置Content-Type
    ctx.type = 'application/json'
    // 设置Response Body
    ctx.body = fileName
  }
}

module.exports = canvasController
