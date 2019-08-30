/* eslint-disable camelcase */
// 微信控制器，登陆，转发

const request = require('request');
const {
  Wechat,
  Payment,
} = require('wechat-jssdk');
const fs = require('fs');
const path = require('path');
const getRawBody = require('raw-body');
// 引入表对象
const User = require('../../user/model');
const Order = require('../../order/model');
// 引入jwt
const jwt = require('../../../../util/jwt');

const mp_appid = '';
const mp_secret = '';
const paymentKey = '';
const merchantId = '';

// Use MiniProgram directly
// const miniProgram = new MiniProgram({
//   miniProgram: {
//     appId: mp_appid,
//     appSecret: mp_secret,
//   },
// });

const wx = new Wechat({
  // 第一个为设置网页授权回调地址
  wechatRedirectUrl: 'http://yourdomain.com/wechat/oauth-callback',
  wechatToken: 'josley', // 第一次在微信控制台保存开发者配置信息时使用
  appId: mp_appid,
  appSecret: mp_secret,
  // card: true, // 开启卡券支持，默认关闭
  payment: true, // 开启支付支持，默认关闭
  merchantId, // 商户ID
  // paymentSandBox: true, // 沙箱模式，验收用例
  paymentKey, // 必传，验签密钥，TIP:获取沙箱密钥也需要真实的密钥，所以即使在沙箱模式下，真实验签密钥也需要传入。
  // pfx 证书
  paymentCertificatePfx: fs.readFileSync(path.join(process.cwd(), 'cert/apiclient_cert.p12')),
  // 默认微信支付通知地址
  paymentNotifyUrl: '',
  // 小程序配置
  miniProgram: {
    appId: mp_appid,
    appSecret: mp_secret,
  },
});

function createPayment(order = {}) {
  return wx.payment.unifiedOrder({
    body: order.body || 'order',
    openid: order.openid,
    detail: order.detail,
    // attach: 'store',
    total_fee: order.totalFee,
    spbill_create_ip: '127.0.0.1',
    time_start: Date.now(),
    // time_expire: utils.simpleDate(nowPlusTwoHours),
    goods_tag: 'pakcage',
    trade_type: Payment.PAYMENT_TYPE.JSAPI,
    // notify_url: 'http://beautytest.yjyyun.com/payment/',
    // product_id: '',
    // limit_pay: '',
    // openid: info.openId,
  }).then((result) => {
    const requestData = Object.assign({
      id: result.requestData.out_trade_no,
    },
    result.requestData);
    const responseData = Object.assign({
      id: result.responseData.out_trade_no,
    },
    result.responseData);
    return Promise.resolve(responseData);
  }).then(data => wx.payment
    .generateChooseWXPayInfo(data.prepay_id)
    .then((chooseWXPayData) => {
      console.log('WXpaydata data:', chooseWXPayData);
      return Promise.resolve({
        orderId: data.out_trade_no,
        chooseWXPay: chooseWXPayData,
      });
    }));
}

async function payOrder(ctx, next) {
  const order = ctx.request.body;
  const user = await User.findById(order.user);
  order.openid = user.openid;
  order.totalFee = order.totalFee;
  order.detail = JSON.stringify(order.detail);
  await createPayment(order).then((data) => {
    const newOrder = new Order({
      ...order,
      orderId: data.orderId,
      processed: false,
    });
    newOrder.save();
    ctx.success(data);
  }).catch((err) => {
    ctx.error(400, err);
  });
}

function getUserInfoFromWxServer(code) {
  return new Promise((resolve) => {
    wx.miniProgram.getSession(code).then((res) => {
      resolve(res);
    }).catch((err) => {
      resolve(err);
    });
  });
}
async function wxLogin(ctx, next) {
  const {
    code,
  } = ctx.query;
  if (!code) {
    ctx.error(400, '授权失败，请重试');
    return;
  }
  const sessionData = await getUserInfoFromWxServer(code);
  if (sessionData.openid) {
    const userRecord = await User.findOne({
      openid: sessionData.openid,
    });
    if (userRecord) {
      const token = jwt.genToken({
        openid: userRecord.openid,
        role: 'user',
      });
      ctx.success({
        token,
        ...userRecord.toObject(),
      });
      return;
    }
    // new user register
    const user = new User({
      openid: sessionData.openid,
    });
    user.save();
    const token = jwt.genToken({
      openid: user.openid,
      role: 'user',
    });
    ctx.success({
      token,
      ...user.toObject(),
    });
  } else {
    ctx.error(400, 'invalid code');
  }
}
async function checkSession(ctx, next) {
  const {
    token,
  } = ctx.query;
  if (!token) {
    ctx.error(401, 'invalid token');
  }
  const decoded = jwt.checkSession(token);
  if (decoded) {
    ctx.success({
      token,
    });
  } else {
    ctx.error(400, 'invalid token');
  }
}

async function updateNotifyResult(data) {
  const {
    openid,
    out_trade_no,
  } = data;
  const orderQuery = Order.findOne({
    orderId: out_trade_no,
  });
  orderQuery.then((order) => {
    Order.updateOne({
      orderId: data.out_trade_no,
    }, {
      processed: true,
    }, (err) => {
      if (err) console.log(err);
    });
  });
}
async function paymentNotify(ctx, next) {
  console.log('=====payment notify======');
  const xml = await getRawBody(ctx.req, {
    length: ctx.request.length,
    limit: '1mb',
    encoding: ctx.request.charset || 'utf-8',
  });
  wx.payment
    .parseNotifyData(xml)
    .then((data) => {
      console.log(data);
      const {
        sign,
      } = data;
      data.sign = undefined;
      const genSignData = wx.payment.generateSignature(data, data.sign_type);
      // case test, only case 6 will return sign
      if (sign && sign === genSignData.sign) {
        const tradeNo = data.out_trade_no;
        if (tradeNo) {
          const orderQuery = Order.findOne({
            orderId: tradeNo,
          });
          orderQuery.then((order) => {
            // order info inconsistent
            if (!order || order.totalFee !== data.total_fee) {
              return Promise.reject(new Error('notify data not consistent!'));
            }
          });
        }

        updateNotifyResult(data);
        // sign check and send back
        wx.payment.replyData(true).then((ret) => {
          ctx.body = ret;
        });
        return;
      }
      return Promise.reject(new Error('notify sign not matched!'));
    })
    .catch((err) => {
      console.error(err);
      wx.payment.replyData(false).then((ret) => {
        ctx.body = ret;
      });
    });
}


// module.exports = {
//   'GET /wxLogin': wxLogin,
//   'GET /checkSession': checkSession,
//   'POST /payOrder': payOrder,
//   'POST /paymentnotify': paymentNotify,
// };
