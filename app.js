const express = require('express');
const morgan = require('morgan');

const app = express();

const tourRouter = require('./routes/tourRoutes');

app.use(express.json());
app.use(morgan('dev'));

app.use(express.static(`${__dirname}/public`));

app.use('/api/v1/tours/', tourRouter);
app.get('/', (req, res) => {
  res.send('Natours API');
});

app.all('*', (req, res, next) => {
  const err = new Error(`Cant find ${req.originalUrl} on this server`);
  err.status = 'fail';
  err.statusCode = 404;
  // Passing the error to the , error middleware handler
  next(err);
});

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

module.exports = app;
