const router = require('../router')
const ApiError = require('../libs/errorHelper')

const routerList = router.stack.map(route => route.path)

/**
 * 在app.use(router)之前调用
 */
const responseFormatter = async (ctx, next) => {
  try {
    // 先去执行路由
    await next()
  } catch (error) {
    // 如果异常类型是API异常并且通过正则验证的url，将错误信息添加到响应体中返回
    if (error instanceof ApiError) {
      ctx.status = 200
      ctx.body = {
        success: false,
        code: error.code,
        message: error.message
      }
    }
    // 继续抛，让外层中间件处理日志
    throw error
  }

  // 从路由列表中匹配请求url
  if (routerList.indexOf(ctx.request.url.split('?')[0]) !== -1) {
    // 请求类型为json时，如果有返回数据，将返回数据添加到data中
    if (ctx.type === 'application/json') {
      if (ctx.body || ctx.body.data) {
        ctx.body = ctx.body.totalItem !== undefined
          ? { success: true, data: ctx.body.data, totalItem: ctx.body.totalItem, commented: ctx.body.commented }
          : { success: true, data: ctx.body }
      } else {
        ctx.body = { success: true, data: [] }
      }
    }
  }
}

module.exports = responseFormatter
