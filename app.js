const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const AppError = require('./utils/appError');
const globalErrHandler = require('./controllers/errorController');

const app = express();

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');

const limiter = rateLimit({
  //  allow a hundred request from the same ipAddress in an hour
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests, please try again in an hour',
});

app.use(helmet());
app.use(express.json({ limit: '10kb' })); // do not recieve request more than 10kb
// Prevent against noSql query injection
app.use(mongoSanitize());

// Data sanitization against xss
app.use(xss());

// Prevent parameter polution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQty',
      'average',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

app.use(morgan('dev'));
app.use('/api', limiter); // apply rate limiting to all routes, starting with api

app.use(express.static(`${__dirname}/public`));

app.get('/', (req, res) => {
  res.send('Natours API');
});
app.use('/api/v1/tours/', tourRouter);
app.use('/api/v1/users/', userRouter);
app.use('/api/v1/reviews/', reviewRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrHandler);
module.exports = app;
