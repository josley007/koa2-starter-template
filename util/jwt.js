const jwt = require('jsonwebtoken');

const secret = 'josleyatpize';

function genToken(payload, tokenExpiresTime = 30 * 24 * 60 * 60) {
  const token = jwt.sign({
    ...payload,
    exp: Math.floor(Date.now() / 1000) + tokenExpiresTime,
  }, secret);
  return token;
}

function decodeToken(token) {
  const decoded = jwt.decode(token, secret);
  return decoded;
}
// 检查token是否过期
function checkSession(token) {
  try {
    const decoded = jwt.decode(token, secret);
    if (decoded.exp <= Date.now() / 1000) {
      return false;
    }
    return true;
  } catch (error) {
    return false;
  }
}


module.exports = {
  genToken,
  decodeToken,
  checkSession,
};
