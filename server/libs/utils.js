const fs = require('fs-extra')
const ApiError = require('../libs/errorHelper')
const ApiErrorNames = require('../libs/apiErrorNamesHelper')

class utils {
  // 移除value为空的key
  static removeObjectEmptyValue (obj) {
    let ret = {}
    for (let key in obj) {
      if ((obj[key] && JSON.stringify(obj[key]) !== '{}' && JSON.stringify(obj[key]) !== '[]') || obj[key] === 0 || obj[key] === false) {
        ret[key] = obj[key]
      }
    }
    return ret
  }
  // 将文件从源目录拷贝至目标目录
  static async copyFile (sourceFile, targetFile) {
    try {
      await fs.copy(sourceFile, targetFile)
      console.log('success!')
    } catch (err) {
      console.error(err)
    }
  }
  // 格式化日期
  static formatDate (time, format) {
    const date = new Date(time)
    const decorate = i => i < 10 ? ('0' + i) : i
    return format.replace(/YYYY|MM|DD|hh|mm|ss/g, type => {
      switch (type) {
      case 'YYYY':
        return decorate(date.getFullYear())
      case 'MM':
        return decorate(date.getMonth() + 1)
      case 'DD':
        return decorate(date.getDate())
      case 'hh':
        return decorate(date.getHours())
      case 'mm':
        return decorate(date.getMinutes())
      case 'ss':
        return decorate(date.getSeconds())
      default:
        break
      }
    })
  }
  // 检查require参数
  static checkRequireParams (params, requireParams) {
    for (let param of requireParams) {
      if (!params[param]) {
        throw new ApiError(ApiErrorNames.MISSING_PARAMETERS)
      }
    }
  }
}

module.exports = utils
