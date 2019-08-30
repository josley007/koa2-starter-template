
const defaultResponse = {
  data: null,
  code: 200,
  errmsg: '',
};

/**
 * response
 * @param ctx
 * @param data 数据
 * @param code 错误码 || [错误码, 错误描述]
 * @param message 错误描述
 */
const response = (ctx, data, code = 200, message) => {
  ctx.body = {
    data,
    code,
    message,
  };
};

/**
 * response 成功
 * @param ctx
 * @param data 数据
 * @param code 错误码 || [错误码, 错误描述]
 * @param message 错误描述
 */
const success = (ctx, data, code = 200, message) => {
  response(ctx, data, code, message);
};

/**
 * response 异常
 * @param ctx
 * @param code 错误码 || [错误码, 错误描述]
 * @param message 错误描述
 */
const error = (ctx, code = 400, message = 'ERROR') => {
  response(ctx, null, code, message);
};

module.exports = async (ctx, next) => {
  ctx.success = success.bind(null, ctx);
  ctx.error = error.bind(null, ctx);
  await next();
};
