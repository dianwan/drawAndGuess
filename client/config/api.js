const host = require('./host')

const apiPrefix = host.url + '/api'

let api = {
  getTopicList: '/topic/list',
  getAccessToken: '/token/get',
  getQRCode: '/qrcode/get',
  getShareImage: '/share/get',
  login: '/login',
  saveCanvas: '/canvas/save',
  getDetail: '/detail/get',
  saveComment: '/comment/save',
  getComment: '/comment/get'
}

for (var key in api) {
  api[key] = apiPrefix + api[key]
}

module.exports = api