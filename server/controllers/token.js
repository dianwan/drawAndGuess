const wechat = require('../libs/wechatHelper')

class tokenController {
  static async get (ctx) {
    const token = await wechat.ensureAccessToken(global.config.appID, global.config.appSecret)
    // 设置Content-Type
    ctx.type = 'application/json'
    // 设置Response Body
    ctx.body = token
  }
}

module.exports = tokenController
