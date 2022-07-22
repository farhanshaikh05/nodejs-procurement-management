const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const inspectionAssociationSchema = mongoose.Schema(
  {
    inspectionUserId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    procurementUserId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: false,
    },
    isUnderAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

inspectionAssociationSchema.plugin(toJSON);

/**
 * @typedef InspectionAssociation
 */
const InspectionAssociation = mongoose.model('inspection_association', inspectionAssociationSchema);

module.exports = InspectionAssociation;
