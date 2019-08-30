const mongoose = require('../../../db');

const {
  Schema,
} = mongoose;

const schema = new Schema({
  name: String,
  username: {
    type: String,
    required: true,
    unique: true,
    dropDups: true,
  },
  password: String,
  role: String,
}, {
  strict: false,
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
});

schema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('Admin', schema);
