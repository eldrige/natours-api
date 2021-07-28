const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

const checkBody = (req, res, next) => {
  if (!req.body.price || !req.body.name) {
    return res.status(400).json({
      status: 400,
      message: 'Missing name or price',
    });
  }
  next();
};

const getTours = (req, res) => {
  res.json({
    data: {
      results: tours.length,
      tours,
    },
  });
};

const getTour = (req, res) => {
  const tour = tours.find((elt) => elt.id === +req.params.id);
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

const deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null,
  });
};

const createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        data: {
          tour: newTour,
        },
      });
    }
  );
};

module.exports = {
  createTour,
  deleteTour,
  getTour,
  getTours,
  checkBody,
};
