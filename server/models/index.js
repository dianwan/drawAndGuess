const mongoose = require('mongoose')
const Schema = mongoose.Schema

module.exports = {
  t_list: {
    name: String,
    description: String
  },
  t_comment: {
    answer: String,
    openId: String,
    name: String,
    avatarUrl: String,
    canvasId: String,
    createTime: {
      type: Date,
      default: Date.now()
    }
  },
  t_user: {
    name: String,
    avatarUrl: String,
    openId: String
  },
  t_canvas: {
    path: String,
    fileName: String,
    suffix: String,
    userInfo: {
      type: Schema.Types.ObjectId,
      ref: 't_user'
    },
    topicInfo: {
      type: Schema.Types.ObjectId,
      ref: 't_list'
    }
  }
}
