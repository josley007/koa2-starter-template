const jwt = require('./jwt');

export default function (ctx) {
  return new Promise((resolve, reject) => {
    const {
      token,
    } = ctx.headers;
    if (!token) reject();
    const decoded = jwt.decodeToken(token);
    resolve(decoded.role || '');
  });
}
