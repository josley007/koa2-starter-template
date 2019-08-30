const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const koajwt = require('koa-jwt');
const koaBody = require('koa-body');
const cors = require('@koa/cors');
const controller = require('./src/controller');
const response = require('./src/middleware/response');
const jwtUnless = require('./config/jwtUnless');

const app = new Koa();
// Middlevare

app.use(cors());

app.use(koaBody({
  multipart: true,
  formidable: {
    maxFileSize: 200 * 1024 * 1024, // 设置上传文件大小最大限制
  },
}));

app.use(bodyParser());

app.use(response);

app.use(koajwt({
  secret: 'josleyatpize',
}).unless(ctx => jwtUnless.validateURLandMethod(ctx)));

app.use(controller());

app.listen(3000);
