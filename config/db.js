let url = 'mongodb://127.0.0.1:27017/demo';
if (process.env.NODE_ENV === 'production') {
  url = 'mongodb://127.0.0.1:27017/demo';
}

module.exports = {
  url,
};
