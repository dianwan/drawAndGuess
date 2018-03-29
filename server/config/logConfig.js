const path = require('path')

// 日志根目录
const baseLogPath = path.resolve(__dirname, '../logs')

// 错误日志目录
const errorPath = '/error'
// 错误日志文件名
const errorFileName = 'error'
// 错误日志输出完整路径
const errorLogPath = baseLogPath + errorPath + '/' + errorFileName

// 响应日志目录
const responsePath = '/response'
// 响应日志文件名
const responseFileName = 'response'
// 响应日志输出完整路径
const responseLogPath = baseLogPath + responsePath + '/' + responseFileName

module.exports = {
  'appenders':
    {
      // 错误日志
      error: {
        'category': 'errorLogger',
        // 日志类型
        'type': 'dateFile',
        // 日志输出位置
        'filename': errorLogPath,
        // 是否总是有后缀名
        'alwaysIncludePattern': true,
        // 后缀，每小时创建一个新的日志文件
        'pattern': '-yyyy-MM-dd-hh.log'
      },
      // 响应日志
      response: {
        'category': 'resLogger',
        'type': 'dateFile',
        'filename': responseLogPath,
        'alwaysIncludePattern': true,
        'pattern': '-yyyy-MM-dd-hh.log'
      }
    },
  'categories': {
    error: {
      appenders: ['error'],
      level: 'error'
    },
    response: {
      appenders: ['response'],
      level: 'info'
    },
    default: {
      appenders: ['response'],
      level: 'info'
    }
  },
  'baseLogPath': baseLogPath
}
