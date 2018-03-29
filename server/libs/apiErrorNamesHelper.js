/**
 * API错误名称
 */
let ApiErrorNames = {}

ApiErrorNames.UNKNOW_ERROR = 'unknowError'
ApiErrorNames.MISSING_PARAMETERS = 'missingParameters'
ApiErrorNames.INTERNAL_ERROR = 'internalError'

/**
 * API错误名称对应的错误信息
 */
let errorMap = new Map()

errorMap.set(ApiErrorNames.UNKNOW_ERROR, { code: -1, message: '未知错误' })
errorMap.set(ApiErrorNames.MISSING_PARAMETERS, { code: 10001, message: '缺少参数' })
errorMap.set(ApiErrorNames.INTERNAL_ERROR, { code: 10001, message: '内部错误' })

// 根据错误名称获取错误信息
ApiErrorNames.getErrorInfo = (errorName) => {
  let errorInfo

  if (errorName) {
    errorInfo = errorMap.get(errorName)
  }

  // 如果没有对应的错误信息，默认'未知错误'
  if (!errorInfo) {
    errorName = ApiErrorNames.UNKNOW_ERROR
    errorInfo = errorMap.get(errorName)
  }

  return errorInfo
}

module.exports = ApiErrorNames
