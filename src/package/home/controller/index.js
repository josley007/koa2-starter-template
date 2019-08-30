/*
 *  controller 自动注册
 * 除home文件之外的文件名为注册到router上的前缀路径
 * user.js 即为 '/user'
 */
// 引入表对象
const User = require('../../user/model');
const Admin = require('../../admin/model');
// 引入hash密码加密
const crypt = require('../../../../util/cryptPWD');
// 引入jwt
const jwt = require('../../../../util/jwt');

async function login(ctx, next) {
  const {
    username,
    password,
  } = ctx.request.body;
  const admin = await Admin.findOne({
    username,
  });
  if (!admin) {
    ctx.error(400, 'Invalid username or password');
    return;
  }
  crypt.validatePWD(password, admin.password).then(() => {
    const token = jwt.genToken({
      username,
      _id: admin._id,
    });
    ctx.success({
      token,
      ...admin.toObject(),
    });
  }).catch((err) => {
    ctx.error(400, err);
  });
}

async function register(ctx, next) {
  const {
    username,
    password,
  } = ctx.request.body;
  let admin = await Admin.findOne({
    username,
  });
  if (admin) {
    ctx.error(400, 'Username has been occupied');
    return;
  }
  admin = new Admin({
    ...ctx.request.body,
    password: crypt.hashPWD(password),
  });
  admin = await admin.save();
  admin.password = null;
  ctx.success('Sign in successfully');
}

async function forgotPWD(ctx, next) {
  const {
    username,
    newPassword,
  } = ctx.request.body;
  let admin = await Admin.findOne({
    username,
  });
  if (!admin) {
    ctx.error(400, 'Invalid user');
  }
  admin.password = crypt.hashPWD(newPassword);
  admin = await admin.save();
  ctx.success('Reset password successfully');
}

async function parseToken(ctx, next) {
  const {
    token,
  } = ctx.request.body;
  ctx.success(jwt.decodeToken(token));
}

module.exports = {
  'POST /login': login,
  'POST /register': register,
  'POST /forgotPWD': forgotPWD,
  'POST /parseToken': parseToken,
};
