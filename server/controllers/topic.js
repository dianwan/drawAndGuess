class topicController {
  static async list (ctx) {
    const listModel = global.dbHelper.getModel('t_list')
    const data = await listModel.find()
    // 设置Content-Type
    ctx.type = 'application/json'
    // 设置Response Body
    ctx.body = data
  }
}

module.exports = topicController
