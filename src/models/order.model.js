const mongoose = require('mongoose');
const { toJSON } = require('./plugins');
const status = ['pending', 'assigned', 'toConfirm', 'completed'];

const orderSchema = mongoose.Schema(
  {
    title: {  // Checklist name
      type: String,
      required: true,
    },
    userId: {  // End-user
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    price: { 
      type: Number,
      required: true,
      default: 0,
    },
    status: { 
      type: String,
      enum: [...status],
      default: status[0],
    },
    createdBy: {  // Procurement OR Admin
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

orderSchema.plugin(toJSON);

/**
 * @typedef Order
 */
const Order = mongoose.model('order', orderSchema);

module.exports = Order;
