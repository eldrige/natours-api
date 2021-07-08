const fs = require('fs');
const express = require('express');
const app = express();

app.use(express.json());

const PORT = 2000;

const tours = fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`);

app.get('/api/v1/tours', (req, res) => {
  res.json({
    data: {
      tours,
    },
  });
});

app.listen(PORT, () =>
  console.log(`Server is accepting request at : ${PORT} `)
);
