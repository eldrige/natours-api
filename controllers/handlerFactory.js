const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

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

const getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    let filter = {};
    /**
     * if id empty, query all tours
     * else get all review for a single tour
     * allows nested GET reviews on tours route
     */
    if (req.params.tourId) filter = { tour: req.params.tourId };

    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .fieldLimit()
      .paginate();
    // const docs = await features.query.explain(); explain adds infor abt the query
    const docs = await features.query;

    res.status(200).json({
      data: {
        results: docs.length,
        docs,
      },
    });
  });

module.exports = {
  deleteOne,
  createOne,
  updateOne,
  getOne,
  getAll,
};
