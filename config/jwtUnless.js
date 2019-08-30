// 配置不需要token验证的接口路径
const urlConfig = {
  GET: ['all pass'],
  POST: ['/miniapp/paymentnotify', '/login', '/register', '/file'],
  PUT: [],
  DELETE: [],
};
module.exports = {
  validateURLandMethod(ctx) {
    let pass = false;
    if (urlConfig[ctx.method]) {
      const urls = urlConfig[ctx.method];
      if (urls[0] === 'all pass') {
        return true;
      }
      urls.forEach((url) => {
        if (url === ctx.path) {
          pass = true;
        }
      });
    }
    return pass;
  },
};
