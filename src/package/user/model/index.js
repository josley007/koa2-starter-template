const mongoose = require('../../../db');

const {
  Schema,
} = mongoose;

const schema = new Schema({
  openid: {
    type: String,
    required: true,
    unique: true,
    dropDups: true,
  },
  name: String,
  phone: String,
  gender: String,
}, {
  strict: false,
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
});

schema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('User', schema);
