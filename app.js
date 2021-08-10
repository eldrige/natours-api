const express = require('express');
const morgan = require('morgan');

const app = express();

const tourRouter = require('./routes/tourRoutes');

app.use(express.json());
app.use(morgan('dev'));

app.use(express.static(`${__dirname}/public`));

app.use('/api/v1/tours/', tourRouter);
app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Couldnot find ${req.originalUrl} on this server`,
  });
});

app.get('/', (req, res) => {
  res.send('Natours API');
});

module.exports = app;
