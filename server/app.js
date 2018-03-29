const Koa = require('koa')
const fs = require('fs')
const koaBody = require('koa-body')
const mongoose = require('mongoose')
const logUtil = require('./libs/logHelper')
const logConfig = require('./config/logConfig')
const responseFormatter = require('./middlewares/response_formatter')
const router = require('./router')

// 引入配置文件
const config = require('./config')

// 自定义模块
global.dbHelper = require('./libs/dbHelper')

// 全局配置
global.config = {
  appID: 'wx3b9a07644a3272ba',
  appSecret: '82e27e5fb06373682275e718ce3e9482'
}

// 连接数据库
mongoose.connect(`mongodb://${config.mongodb_url}`, function (err) {
  if (err) {
    console.log('数据库连接失败')
  }
})

// 确定log目录是否存在，如果不存在则创建目录
var confirmPath = function (pathStr) {
  if (!fs.existsSync(pathStr)) {
    fs.mkdirSync(pathStr)
    console.log('createPath: ' + pathStr)
  }
}

// 初始化log相关目录
const initLogPath = function () {
  // 创建log的根目录'logs'
  if (logConfig.baseLogPath) {
    confirmPath(logConfig.baseLogPath)
    // 根据不同的logType创建不同的文件目录
    for (let i = 0, len = logConfig.appenders.length; i < len; i++) {
      if (logConfig.appenders[i].path) {
        confirmPath(logConfig.baseLogPath + logConfig.appenders[i].path)
      }
    }
  }
}

initLogPath()

// 实例化
const app = new Koa()

// 日志 middleware
app.use(async (ctx, next) => {
  // 响应开始时间
  const start = new Date()
  // 响应间隔时间
  let ms
  try {
    // 开始进入到下一个中间件
    await next()
    ms = new Date() - start
    // 记录响应日志
    logUtil.logResponse(ctx, ms)
  } catch (error) {
    ms = new Date() - start
    // 记录异常日志
    logUtil.logError(ctx, error, ms)
  }
})

// post请求体解析middleware
app.use(koaBody({ multipart: true }))

// 格式化处理响应结果middleware，在添加路由之前调用
app.use(responseFormatter)

// 路由middleware
app.use(router.routes()).use(router.allowedMethods())

// 监听端口
app.listen(config.port)
