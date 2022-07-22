const httpStatus = require('http-status');
const { Order, User } = require('../models');
const ApiError = require('../utils/ApiError');

const createOrder = async (userBody, loginUser) => {
  const userData = await User.findById(userBody.userId);

  if (!userData) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User not exists!');
  }
  if (userData.role != 'user') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Role mismatch!');
  }

  return Order.create({
    ...userBody,
    createdBy: loginUser._id,
  });
};

const queryOrder = async (filter, options, loginUser) => {
  const match = {};
  if (loginUser.role == 'procurement') {
    match.createdBy =loginUser._id;
  } else if (loginUser.role == 'inspection') {
    return Order.aggregate([
      {
        $lookup: {
            from: 'inspection_associations', 
            localField: 'createdBy', 
            foreignField: 'procurementUserId', 
            as: 'inspectionAssocData' 
        }
      },
      { $unwind: "$inspectionAssocData"},
      {
        $match: {
          'inspectionAssocData.inspectionUserId': loginUser._id,
        }
      }
    ]);
  } else if (loginUser.role == 'user') {
    match.userId = loginUser._id;
  }

  return Order.find(match);
};


const updateOrder = async (orderId, bodyData) => {
  if (!await Order.findById(orderId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Order not exists!');
  }

  return Order.updateOne({
    "_id": orderId
  },{
    $set: {"status": bodyData.status}
  });
};

module.exports = {
  createOrder,
  queryOrder,
  updateOrder,
};
