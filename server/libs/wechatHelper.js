const axios = require('axios')
const fs = require('fs-extra')

const TOKEN_FILE_NAME = 'access_token.txt'

class wechatHelper {
  static async getAccessToken (appid, appsecret) {
    let token = {}
    const response = await axios.get(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${appsecret}`)
    // 过期时间，因网络延迟等，将实际过期时间提前20秒，以防止临界点
    const expireTime = Date.now() + (response.data.expires_in - 20) * 1000
    token.accessToken = response.data.access_token
    token.expireTime = expireTime
    await this.saveToken(token)
    return token
  }
  // 保存文件
  static async saveToken (token) {
    await fs.writeFile(TOKEN_FILE_NAME, JSON.stringify(token))
  }
  // 读取文件
  static async getToken () {
    const token = await fs.readFile(TOKEN_FILE_NAME, 'utf8')
    return JSON.parse(token)
  }
  // 读取文件获取token，读取失败重新请求接口
  static async ensureAccessToken (appID, appSecret) {
    let token = {}
    try {
      token = await this.getToken()
    } catch (e) {
      token = await this.getAccessToken(appID, appSecret)
    }
    if (token && (this.isValid(token.accessToken, token.expireTime))) {
      return token
    }
    return this.getAccessToken(appID, appSecret)
  }
  // 验证access_token是否过期
  static isValid (accessToken, expireTime) {
    return !!accessToken && Date.now() < expireTime
  }
}
module.exports = wechatHelper
