const mongoose = require('mongoose')
const Schema = mongoose.Schema
const models = require('../models')

// 将models中定义的所有模式（Schema）编译为模型（Model)
for (var m in models) {
  const typeSchema = new Schema(models[m])
  mongoose.model(m, typeSchema, m)
}

// 返回编译后的对应type的模型（该模型可直接对数据库增删改查）
class dbHelper {
  static getModel (type) {
    return mongoose.model(type)
  }
}

module.exports = dbHelper
