const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/appError');
const globalErrHandler = require('./controllers/errorController');

const app = express();

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

app.use(express.json());
app.use(morgan('dev'));

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
