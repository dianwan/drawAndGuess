const utils = require('../libs/utils')

class commentController {
  static async get (ctx) {
    // 校验参数
    const requireParams = ['canvasId', 'openId', 'offset', 'length']
    const params = ctx.request.query
    utils.checkRequireParams(ctx.request.query, requireParams)
    const queryParams = {
      canvasId: ctx.request.query.canvasId
    }

    const commentModel = global.dbHelper.getModel('t_comment')

    const commented = await commentModel
      .count({
        canvasId: params.canvasId,
        openId: params.openId
      })

    const totalItem = await commentModel
      .count(queryParams)
    const data = await commentModel
      .find(queryParams)
      .skip(parseInt(ctx.request.query.offset))
      .limit(parseInt(ctx.request.query.length))

    // 设置Content-Type
    ctx.type = 'application/json'
    // 设置Response Body
    if (commented === 0) {
      ctx.body = {
        data,
        totalItem,
        commented: false
      }
    } else {
      ctx.body = {
        data,
        totalItem,
        commented: true
      }
    }
  }
  static async save (ctx) {
    // 校验参数
    const requireParams = ['canvasId', 'name', 'avatarUrl', 'answer', 'openId']
    const params = ctx.request.body
    utils.checkRequireParams(params, requireParams)

    const commentModel = global.dbHelper.getModel('t_comment')
    await commentModel.create({
      canvasId: params.canvasId,
      name: params.name,
      avatarUrl: params.avatarUrl,
      answer: params.answer,
      openId: params.openId
    })

    // 设置Content-Type
    ctx.type = 'application/json'
    // 设置Response Body
    ctx.body = ''
  }
}

module.exports = commentController
