const axios = require('axios')
const ApiError = require('../libs/errorHelper')
const ApiErrorNames = require('../libs/apiErrorNamesHelper')

class loginController {
  static async login (ctx) {
    if (ctx.request.query.code) {
      const res = await axios({
        method: 'post',
        url: `https://api.weixin.qq.com/sns/jscode2session?appid=${global.config.appID}&secret=${global.config.appSecret}&js_code=${ctx.request.query.code}&grant_type=authorization_code`,
        data: {
          appid: global.config.appID,
          secret: global.config.appSecret,
          js_code: ctx.request.query.code,
          grant_type: 'authorization_code'
        }
      })
      // 设置Content-Type
      ctx.type = 'application/json'
      // 设置Response Body
      ctx.body = res.data
    } else {
      throw new ApiError(ApiErrorNames.MISSING_PARAMETERS)
    }
  }
}
module.exports = loginController
