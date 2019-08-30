const mongoose = require('mongoose');
const dbConfig = require('../../config/db');

mongoose.set('useCreateIndex', true);
// 连接
mongoose.connect(dbConfig.url, {
  useNewUrlParser: true,
});

// 连接成功
mongoose.connection.on('connected', () => {
  console.log('Mongoose connection open to ', dbConfig.url);
});

// 连接异常
mongoose.connection.on('error', (err) => {
  console.log(`Mongoose connection error: ${err}`);
});

// 断开连接
mongoose.connection.on('disconnected', () => {
  console.log('Mongoose connection disconnected');
});

module.exports = mongoose;
