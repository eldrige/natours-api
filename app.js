const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const AppError = require('./utils/appError');
const globalErrHandler = require('./controllers/errorController');

const app = express();

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const limiter = rateLimit({
  //  allow a hundred request from the same ipAddress in an hour
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests, please try again in an hour',
});

app.use(express.json());
app.use(morgan('dev'));
app.use('/api', limiter); // apply rate limiting to all routes, starting with api

app.use(express.static(`${__dirname}/public`));

app.get('/', (req, res) => {
  res.send('Natours API');
});
app.use('/api/v1/tours/', tourRouter);
app.use('/api/v1/users/', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrHandler);
module.exports = app;
