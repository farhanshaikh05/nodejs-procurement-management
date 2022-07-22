const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { checklistService } = require('../services');

const createChecklist = catchAsync(async (req, res) => {
  const checklist = await checklistService.createChecklist(req.body, req.user);

  return res.status(httpStatus.CREATED).send(checklist);
});

const getChecklist = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  const result = await checklistService.queryChecklist(filter, options, req.user);
  res.send(result);
});

const fillChecklist = catchAsync(async (req, res) => {
  await checklistService.fillChecklist(req.params.checklistId,req.body, req.user);
  
  res.status(httpStatus.OK).send({
    message: 'Checklist filled!'
  });
});

module.exports = {
  createChecklist,
  getChecklist,
  fillChecklist,
};
