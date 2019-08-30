const mongoose = require('../../../db');

const {
  Schema,
} = mongoose;

const schema = new Schema({
  orderId: {
    type: String,
    required: true,
    unique: true,
    dropDups: true,
  },
  totalFee: Number,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    autopopulate: true,
  },
  processed: {
    type: Boolean,
    default: false,
  },
}, {
  strict: false,
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
});

schema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('Order', schema);
