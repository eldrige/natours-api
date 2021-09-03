const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) return next(new AppError('No document found with that ID', 404));

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

const updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) return next(new AppError('No doc found with that ID', 400));

    res.status(200).json({
      status: 'success',
      data: {
        doc,
        message: 'Document updated',
      },
    });
  });

const createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const newDocument = await Model.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        newDocument,
      },
    });
  });

const getOne = (Model, populateOptns) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (populateOptns) query = query.populate(populateOptns);
    const doc = await query;
    if (!doc) {
      return next(new AppError('No doc found with that ID', 400));
    }
    res.status(200).json({
      data: {
        doc,
      },
    });
  });

module.exports = {
  deleteOne,
  createOne,
  updateOne,
  getOne,
};
