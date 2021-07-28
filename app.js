const express = require('express');
const morgan = require('morgan');
const app = express();

const tourRouter = require('./routes/tourRoutes');

app.use(express.json());
app.use(morgan('dev'));

app.use('/api/v1/tours/', tourRouter);

app.get('/', (req, res) => {
  res.send('Natours API');
});

module.exports = app;
