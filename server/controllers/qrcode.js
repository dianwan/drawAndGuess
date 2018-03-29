const axios = require('axios')
// const fs = require('fs-extra')

class qrcodeController {
  static async get (ctx) {
    const token = await axios.get(`http://10.239.11.18:3000/api/token/get`)
    const res = await axios({
      method: 'post',
      responseType: 'stream',
      url: `https://api.weixin.qq.com/wxa/getwxacode?access_token=${token.data.data.accessToken}`,
      data: {
        path: 'http://www.163.com',
        width: parseInt(ctx.request.query.width) || 280
      }
    })

    // res.data.pipe(fs.createWriteStream('xxx.jpg'))
    // 设置Content-Type
    ctx.type = 'image/png'
    // 设置Response Body
    ctx.body = res.data
  }
}

module.exports = qrcodeController
