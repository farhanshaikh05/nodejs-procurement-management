const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const fields = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  options: {
    type: mongoose.Schema.Types.Mixed,
    required: false,
    default: '',
  },
  isRequired: {
    type: Boolean,
    required: true,
    default: false,
  },
  value: {  // Answer
    type: mongoose.Schema.Types.Mixed,
    required: false,
    default: null,
  },
});

const checklistSchema = mongoose.Schema(
  {
    name: {  // Checklist name
      type: String,
      required: true,
    },
    orderId: {  // End-user
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Order',
      required: true,
    },
    fields: [fields],  // Form Properties
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

checklistSchema.plugin(toJSON);

/**
 * @typedef Checklist
 */
const Checklist = mongoose.model('checklist', checklistSchema);

module.exports = Checklist;
