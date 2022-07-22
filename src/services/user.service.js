const httpStatus = require('http-status');
const { User, InspectionAssociation } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody, loginUser) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }

  if (userBody.phone) {
    if (await User.isPhoneTaken(userBody.phone)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Phone number already taken');
    }
  }

  const user = await User.create(userBody);

  if (loginUser.role == 'admin' && userBody.role == 'inspection') {
    await InspectionAssociation.create({
      inspectionUserId: user._id,
      isUnderAdmin: true,
    });
  }

  return user;
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter, options) => {
  const users = await User.find(filter);
  return users;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  return User.findById(id);
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  return User.findOne({ email });
};

const getUserByPhone = async (phone) => {
  return User.findOne({ phone, role: 'inspection' });
};


/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};

const assignInspection = async (userBody) => {
  if (!await User.findOne({ "_id": userBody.inspectionUserId, role: 'inspection' })) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'inspection user invalid!');
  }

  if (!await User.findOne({ "_id": userBody.procurementUserId, role: 'procurement' })) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'procurement user invalid!');
  }

  if (await InspectionAssociation.findOne({$or:[{"inspection_user": userBody.inspectionUserId},{"procurement_user": userBody.procurementUserId}]})) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'inspection or procurement user already assign!');
  }

  return InspectionAssociation.create({
    "inspection_user": userBody.inspectionUserId,
    "procurement_user": userBody.procurementUserId,
  });
};

module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  getUserByPhone,
  updateUserById,
  deleteUserById,
  assignInspection,
};
