const httpStatus = require('http-status');
const { Checklist, Order } = require('../models');
const ApiError = require('../utils/ApiError');
var mongoose = require('mongoose');

const createChecklist = async (userBody, loginUser) => {
  if (!await Order.findById(userBody.orderId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Order not exists!');
  }

  return Checklist.create({
    ...userBody,
    createdBy: loginUser._id,
  });
};

const queryChecklist = async (filter, options, loginUser) => {
  const match = {};
  if (loginUser.role == 'procurement') {
    return procurementChecklist(loginUser);
  } else if (loginUser.role == 'inspection') {
    return inspectionChecklist(loginUser);
  } else if (loginUser.role == 'user') {
    return userChecklist(loginUser);
  }

  // Admin
  return Checklist.aggregate([
    {
      $lookup: {
        from: 'orders',
        localField: 'orderId',
        foreignField: '_id',
        as: 'orderData'
      }
    },
    { $unwind: "$orderData" }
  ]);
};

const fillChecklist = async (checklistId, payloadField, loginUser) => {
  const checklist = await Checklist.findById(checklistId);
  if (!checklist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Checklist not exists!');
  }
  // let fieldExist = await Checklist.find({
  //     "_id": checklistId,
  //     "fields.$._id": payloadField[1]['fieldId']
  // });
  // console.log('fieldExist...', fieldExist);
  // if (!fieldExist) {
  //   throw new ApiError(httpStatus.BAD_REQUEST, 'Field not exists!!');
  // }

  const fields = checklist.fields;
  for(let field of fields) {
      let fieldExist = 0, fieldValue;
      for (let pField of payloadField) {
        if (pField.fieldId == field._id.toString()) {
          if (checkTypeWiseValue(field.type, pField.value, field.options)) {
            fieldExist = 1;
            fieldValue =  pField.value;
          }
          break;
        }
      }

      if (!fieldExist && field.isRequired) {
        throw new ApiError(httpStatus.BAD_REQUEST, `Field "${field.name}" is require!`);
      }

      if (fieldExist) {
        await Checklist.updateOne({
          "_id": checklistId,
          "fields._id": field._id,
        },{
          $set: {'fields.$.value': fieldValue}
        });
      }
  }

  return Order.updateOne({
    "_id": checklist.orderId,
  }, {
    $set: {'status': 'toConfirm'}
  });
};

function checkTypeWiseValue(fieldType, value, options) {
  switch (fieldType) {
    case 'textbox':
    case 'dropdown':
    case 'radio':
        if (typeof value != 'string') {
          throw new ApiError(httpStatus.BAD_REQUEST, `"${fieldType}" field value should be string!`);
        }
        //Value validation
        if (value) {
          return true;
        }
      break;
    
    case 'checkbox':
      if (!Array.isArray(value)) {
        throw new ApiError(httpStatus.BAD_REQUEST, `"${fieldType}" field value should be array/list!`);
      }
      const filteredValue = value.filter(e =>  e);
      if (filteredValue.length) {
        return true;
      }
    break;
  }

  
  return false;
}

const inspectionChecklist = async (loginUser) => {
  return Checklist.aggregate([
    {
      $lookup: {
        from: 'orders',
        localField: 'orderId',
        foreignField: '_id',
        as: 'orderData'
      }
    },
    { $unwind: "$orderData" },
    {
      $lookup: {
        from: 'inspection_associations',
        localField: 'orderData.createdBy',
        foreignField: 'procurementUserId',
        as: 'inspectionAssocData'
      }
    },
    { $unwind: "$inspectionAssocData" },
    {
      $match: {
        'inspectionAssocData.inspectionUserId': loginUser._id,
      }
    }
  ]);
}

const procurementChecklist = async (loginUser) => {
  return Checklist.aggregate([
    {
      $lookup: {
        from: 'orders',
        localField: 'orderId',
        foreignField: '_id',
        as: 'orderData'
      }
    },
    { $unwind: "$orderData" },
    {
      $match: {
        'orderData.createdBy': loginUser._id,
      }
    }
  ]);
}

const userChecklist = async (loginUser) => {
  return Checklist.aggregate([
    {
      $lookup: {
        from: 'orders',
        localField: 'orderId',
        foreignField: '_id',
        as: 'orderData'
      }
    },
    { $unwind: "$orderData" },
    {
      $match: {
        'orderData.userId': loginUser._id,
      }
    }
  ]);
}

module.exports = {
  createChecklist,
  queryChecklist,
  fillChecklist,
};
